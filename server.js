/**
 * SOMMELIER WORLD — server.js v9.0 TABULA RASA
 * Pulito. Solo l'essenziale.
 */
'use strict';

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/* Cache-Control: nessuna cache su nessuna risposta */
app.use(function(req, res, next){
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';
const SMTP_USER    = process.env.SMTP_USER       || '';
const SMTP_PASS    = process.env.SMTP_PASS       || '';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL     || 'timotiniurie49@gmail.com';

/* Cache articoli in memoria */
let _articles = [];
let _lastGen  = '';

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ── Groq ─────────────────────────────────── */
async function callGroq(system, user, maxTokens = 1200) {
  if (!GROQ_KEY) throw new Error('GROQ_API_KEY mancante');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      temperature: 0.75,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    })
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || `Groq ${r.status}`);
  return d.choices?.[0]?.message?.content || '';
}

/* ── Gemini fallback ──────────────────────── */
async function callGemini(prompt, maxTokens = 1200) {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY mancante');
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.75 }
      })
    }
  );
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || `Gemini ${r.status}`);
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/* ── AI con fallback automatico ──────────── */
async function callAI(system, user, maxTokens = 1200) {
  try {
    return await callGroq(system, user, maxTokens);
  } catch (e) {
    console.warn('[Groq→Gemini]', e.message);
    return await callGemini(`${system}\n\n${user}`, maxTokens);
  }
}

/* ── Email (opzionale) ───────────────────── */
async function sendEmail(to, subject, html) {
  if (!SMTP_USER || !SMTP_PASS) return;
  try {
    const nm = require('nodemailer');
    const t = nm.createTransporter({
      host: 'smtp.gmail.com', port: 587, secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    await t.sendMail({ from: SMTP_USER, to, subject, html });
  } catch (e) { console.warn('[email]', e.message); }
}

/* ════════════════════════════════════════════
   ROOT / HEALTH
   ════════════════════════════════════════════ */
app.get('/', (req, res) => res.json({
  version: '9.0',
  groq: !!GROQ_KEY,
  gemini: !!GEMINI_KEY,
  articles: _articles.length,
  lastGen: _lastGen || 'mai'
}));

app.get('/api/health', (req, res) => res.json({ ok: true, version: '9.0' }));

/* ════════════════════════════════════════════
   POST /api/groq — SOMMELIER AI
   Il vincolo geografico è applicato QUI nel server:
   se l'utente manda paese/regione, li blocchiamo nel system prompt.
   ════════════════════════════════════════════ */
app.post(['/api/groq', '/api/chat'], async (req, res) => {
  try {
    let { system = '', userMsg = '', language = 'it', maxTokens = 1400,
          paese = '', regione = '' } = req.body;

    /* 1. ISTRUZIONE LINGUA — sempre in testa */
    const LANG = {
      it: 'Rispondi SEMPRE e SOLO in italiano. Non usare altre lingue.',
      en: 'Reply ALWAYS and ONLY in English. Do not use other languages.',
      fr: 'Réponds TOUJOURS et UNIQUEMENT en français. N\'utilise pas d\'autres langues.'
    };
    const langCmd = LANG[language] || LANG.it;
    if (!system.includes(langCmd)) system = `${langCmd}\n${system}`;

    /* 2. VINCOLO GEOGRAFICO — se il client manda paese/regione */
    // Il client può inviare paese e regione come parametri separati
    // oppure già inclusi nel userMsg. Li intercettiamo qui per sicurezza.
    const ESEMPI = {
      'Germania': "Riesling Spätlese del Mosel (Egon Müller, JJ Prüm), Spätburgunder Ahr (Meyer-Näkel), Silvaner Franken",
      'Francia':  "Bourgogne Pinot Noir, Chablis, Champagne, Châteauneuf-du-Pape, Sancerre Sauvignon Blanc",
      'Spagna':   "Rioja Tempranillo (Muga, CVNE), Ribera del Duero, Albariño Rías Baixas, Priorat Garnacha",
      'Austria':  "Grüner Veltliner Smaragd Wachau (FX Pichler, Prager), Riesling Kamptal, Blaufränkisch",
      'USA':      "Napa Valley Cabernet Sauvignon (Opus One, Heitz), Willamette Pinot Noir, Finger Lakes Riesling",
      'Grecia':   "Assyrtiko di Santorini (Gaia, Hatzidakis, Sigalas), Xinomavro Naoussa (Thymiopoulos)",
      'Portogallo':"Douro Touriga Nacional (Ramos Pinto, Niepoort), Alentejo, Vinho Verde Alvarinho",
      'Argentina':"Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés, Uco Valley",
      'Australia':"Barossa Shiraz (Penfolds Grange, Henschke), Clare Valley Riesling, Yarra Pinot Noir",
    };

    if (paese && paese !== 'Italia') {
      const esempi = ESEMPI[paese] || `vini tipici di ${paese}`;
      const geoBlock =
        `\n\n${'█'.repeat(46)}\n` +
        `🔴 VINCOLO GEOGRAFICO ASSOLUTO\n` +
        `${'█'.repeat(46)}\n` +
        `PAESE: "${paese}"${regione ? `\nREGIONE: "${regione}"` : ''}\n\n` +
        `✅ Consiglia SOLO vini di ${paese}${regione ? ` (zona ${regione})` : ''}\n` +
        `❌ VIETATO: Barolo, Brunello, Amarone, Chianti o qualunque vino italiano\n` +
        `❌ VIETATO: vini di qualsiasi altro paese che non sia ${paese}\n\n` +
        `Esempi accettabili: ${esempi}\n` +
        `${'█'.repeat(46)}\n`;

      userMsg = geoBlock + '\n' + userMsg;
    }

    const text = await callAI(system, userMsg, maxTokens);
    res.json({ text, ok: true });

  } catch (e) {
    console.error('[/api/groq]', e.message);
    res.status(500).json({ error: e.message });
  }
});

/* ════════════════════════════════════════════
   GET /api/articles — articoli in cache
   ════════════════════════════════════════════ */
app.get('/api/articles', (req, res) => {
  res.json(_articles);
});

/* ════════════════════════════════════════════
   GET /api/articles/generate — forza rigenerazione
   ════════════════════════════════════════════ */
app.get('/api/articles/generate', async (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Accesso negato' });
  }
  try {
    const arts = await generateArticles(true);
    res.json({ ok: true, count: arts.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ════════════════════════════════════════════
   GENERAZIONE ARTICOLI (3 lingue)
   ════════════════════════════════════════════ */
const IMGS = [
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80',
  'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
  'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&q=80',
  'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=600&q=80',
  'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=600&q=80',
];

/* ════════════════════════════════════════════
   TOPICS DINAMICI — variano ogni giorno automaticamente
   Ogni giorno l'IA sceglie argomenti diversi dal pool
   ════════════════════════════════════════════ */
function getDailyTopics(){
  const today = new Date();
  const d = Math.floor((today - new Date(today.getFullYear(),0,0)) / 86400000);

  const NEWS_POOL = [
    "una notizia dal mercato mondiale dei vini pregiati (aste, prezzi, nuove denominazioni 2025-2026)",
    "una notizia sui cambiamenti climatici e l impatto sulle vendemmie mondiali 2025-2026",
    "una notizia su un produttore mondiale premiato nel 2025-2026 (Decanter, Wine Spectator, Wine Advocate)",
    "le tendenze di consumo dei vini nel 2026: quali paesi emergono, quali stili crescono",
    "una innovazione in cantina o in vigna: anfore, orange wine, biodinamica, tecniche nuove",
    "un vino storico battuto all asta o una cantina acquistata da nuovi proprietari nel 2025-2026",
    "le denominazioni emergenti nel mondo del vino: nuove DOC, nuove AVA, trend globali",
  ];

  const TERROIR_POOL = [
    "Mosel - ardesia blu, Riesling, Egon Muller, JJ Prum, vigneti eroici",
    "Barolo - Piemonte, Nebbiolo, MGA storiche, Conterno, Mascarello",
    "Champagne - creta, metodo classico, grandi maison vs recoltant-manipulant",
    "Santorini - Assyrtiko, suolo vulcanico, alberello kouloura, Gaia Wines",
    "Priorat - llicorella scura, Garnacha centenaria, Alvaro Palacios",
    "Wachau - Gruner Veltliner, Riesling, Danubio, FX Pichler, Prager",
    "Barossa Valley - Shiraz centenario, old vines, Penfolds Grange, Henschke",
    "Marlborough - Sauvignon Blanc, Cloudy Bay, Greywacke, terroir unico",
    "Mendoza - Malbec, Ande, Catena Zapata, vigneti ad alta quota",
    "Borgogna - Pinot Noir, Chardonnay, grands crus, DRC, Leroy",
    "Etna - Nerello Mascalese, contrade, lava, Cornelissen, Terre Nere",
    "Tokaj - Furmint, aszu, botrytis, vino dei re, storia millenaria",
    "Georgia - Kvevri, Rkatsiteli, Saperavi, vini arancioni, 8000 anni di storia",
    "Rioja - Tempranillo, Garnacha, Muga, CVNE, Gran Reserva, terroir",
  ];

  const SOM_POOL = [
    "la decantazione: quando e perche usarla, vini che ne beneficiano, vini che non la tollerano",
    "l abbinamento cibo-vino: principi di concordanza e contrasto, 5 abbinamenti perfetti nel mondo",
    "la temperatura di servizio: come cambia il vino, regole per spumanti, bianchi, rossi, dolci",
    "la degustazione professionale: metodo AIS, come descrivere un vino, i 5 sensi applicati",
    "lo Champagne e le bollicine mondiali: metodo classico, charmat, petillant naturel",
    "i vini naturali, biodinamici, organici: differenze, produttori di riferimento, come riconoscerli",
    "i vini dolci del mondo: Sauternes, TBA, Tokaj, Vin Santo, Recioto",
  ];

  const VIT_POOL = [
    "la potatura invernale e i sistemi di allevamento nel mondo: Guyot, alberello, cordone",
    "il cambiamento climatico in vigna: come i produttori si adattano, vitigni resistenti",
    "la vendemmia: come si decide il momento giusto, differenze tra nord e sud del mondo",
    "biodinamica e agricoltura biologica: principi, calendario lunare, produttori mondiali",
    "il terroir: come suolo, clima e uomo creano il carattere unico di un vino",
    "i vitigni autoctoni dimenticati: vitigni recuperati in Italia, Spagna, Grecia, Georgia",
  ];

  const VIG_POOL = [
    "il Nebbiolo: Barolo, Barbaresco, Gattinara, il vitigno piu difficile d Italia",
    "il Riesling: Mosel, Alsazia, Rheingau, Wachau - il piu longevo al mondo",
    "il Pinot Nero: Borgogna vs Willamette vs Otago - il Santo Graal dei vitigni",
    "il Sangiovese: famiglia di cloni, Brunello, Chianti, Montepulciano",
    "l Assyrtiko di Santorini: minerale vulcanico, storia millenaria",
    "il Malbec: Argentina vs Cahors - storia, stile, produttori, futuro",
    "il Grenache/Garnacha/Cannonau: il piu coltivato al mondo, Priorat, Provenza, Sardegna",
    "il Cabernet Sauvignon: Bordeaux, Napa, Cile, Australia - come cambia il terroir",
    "il Shiraz/Syrah: Nord Rodano vs Barossa - stesso vitigno, mondi opposti",
  ];

  const n = NEWS_POOL[d % NEWS_POOL.length];
  const t1 = TERROIR_POOL[d % TERROIR_POOL.length];
  const t2 = TERROIR_POOL[(d+5) % TERROIR_POOL.length];
  const s = SOM_POOL[(d+2) % SOM_POOL.length];
  const v = VIT_POOL[(d+3) % VIT_POOL.length];
  const g = VIG_POOL[(d+4) % VIG_POOL.length];

  return [
    {
      tag: "🗞 Wine News", isNews: true,
      it: "Scrivi una notizia attuale e curiosa (2025-2026) su: "+n+". Fatti specifici, nomi reali, numeri. 270 parole. Coinvolgente, non un comunicato stampa. Solo italiano.",
      en: "Write a current 2025-2026 wine news about: "+n+". Specific facts, real names, numbers. 270 words. Engaging. English only.",
      fr: "Ecris une actualite vinicole 2025-2026 sur: "+n+". Faits precis, noms reels. 270 mots. Captivante. Francais uniquement."
    },
    {
      tag: "🌍 Terroir", isNews: false,
      it: "Scrivi un articolo appassionato su: "+t1+". Suolo, clima, vitigni, produttori, curiosita rare. 270 parole. Solo italiano.",
      en: "Write a passionate article about: "+t1+". Soil, climate, grapes, producers, rare facts. 270 words. English only.",
      fr: "Ecris un article passionne sur: "+t1+". Sol, climat, cepages, producteurs, curiosites. 270 mots. Francais uniquement."
    },
    {
      tag: "📚 Sommelier", isNews: false,
      it: "Scrivi un articolo tecnico e pratico su: "+s+". Esempi concreti con vini e produttori reali. Utile a esperti e appassionati. 270 parole. Solo italiano.",
      en: "Write a technical article about: "+s+". Concrete examples with real wines. Useful for experts and enthusiasts. 270 words. English only.",
      fr: "Ecris un article technique sur: "+s+". Exemples concrets avec noms reels. 270 mots. Francais uniquement."
    },
    {
      tag: "🍇 Viticoltura", isNews: false,
      it: "Scrivi un articolo dettagliato e curioso su: "+v+". Produttori reali da tutto il mondo. Interessante, non accademico. 270 parole. Solo italiano.",
      en: "Write a detailed article about: "+v+". Real producers from around the world. Interesting, not academic. 270 words. English only.",
      fr: "Ecris un article detaille sur: "+v+". Producteurs reels du monde entier. 270 mots. Francais uniquement."
    },
    {
      tag: "🍷 Vitigni", isNews: false,
      it: "Scrivi un articolo appassionante sul vitigno: "+g+". Storia, caratteristiche, migliori produttori mondiali, abbinamenti, curiosita. 270 parole. Solo italiano.",
      en: "Write an engaging article on: "+g+". History, styles, best world producers, pairings. 270 words. English only.",
      fr: "Ecris un article captivant sur: "+g+". Histoire, styles, meilleurs producteurs mondiaux. 270 mots. Francais uniquement."
    },
    {
      tag: "🌍 Curiosita Mondiale", isNews: false,
      it: "Scrivi un articolo appassionato su: "+t2+". Dettagli insoliti, produttori emergenti, storia affascinante. 270 parole. Solo italiano.",
      en: "Write a passionate article about: "+t2+". Unusual details, emerging producers, fascinating history. 270 words. English only.",
      fr: "Ecris un article passionne sur: "+t2+". Details insolites, producteurs emergents. 270 mots. Francais uniquement."
    },
  ];
}

const TOPICS = getDailyTopics();