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
      'Germania': 'Riesling Spätlese del Mosel (Egon Müller, JJ Prüm), Spätburgunder dell\'Ahr (Meyer-Näkel), Silvaner del Franken (Juliusspital)',
      'Francia': 'Bourgogne Pinot Noir, Chablis, Champagne, Châteauneuf-du-Pape, Sancerre Sauvignon Blanc',
      'Spagna': 'Rioja Tempranillo (Muga, CVNE), Ribera del Duero, Albariño Rías Baixas, Priorat Garnacha',
      'Austria': 'Grüner Veltliner Smaragd Wachau (FX Pichler, Prager), Riesling Kamptal, Blaufränkisch',
      'USA': 'Napa Valley Cabernet Sauvignon (Opus One, Heitz Martha\'s Vineyard), Willamette Pinot Noir',
      'Grecia': 'Assyrtiko di Santorini (Gaia, Hatzidakis, Sigalas), Xinomavro Naoussa (Thymiopoulos)',
      'Portogallo': 'Douro Touriga Nacional (Ramos Pinto, Niepoort), Alentejo, Vinho Verde Alvarinho',
      'Argentina': 'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontés, Uco Valley',
      'Australia': 'Barossa Shiraz (Penfolds Grange, Henschke), Clare Valley Riesling, Yarra Pinot Noir',
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

const TOPICS = [
  {
    tag: '🗞 Wine News',
    isNews: true,
    it: 'Scrivi una notizia attuale (2025-2026) dal mondo del vino: nuovi premi, prezzi, vendemmie eccezionali, cambiamenti di proprietà. Usa fatti specifici, nomi reali, numeri. 260 parole. Solo italiano.',
    en: 'Write current wine news (2025-2026): awards, prices, exceptional vintages. Use specific facts, real names, numbers. 260 words. English only.',
    fr: 'Écris une actualité vinicole (2025-2026): prix, vendanges exceptionnelles. Faits précis, noms réels, chiffres. 260 mots. Français uniquement.'
  },
  {
    tag: '🌍 Terroir',
    isNews: false,
    it: 'Scrivi un articolo appassionato su un terroir vinicolo del mondo: suolo, clima, vitigni, stile, produttori chiave. Scegli tra Etna, Mosel, Santorini, Priorat, Wachau, Barolo. 260 parole. Solo italiano.',
    en: 'Write a passionate article on a wine terroir: soil, climate, grapes, style, key producers. Choose from Etna, Mosel, Santorini, Barossa. 260 words. English only.',
    fr: 'Écris un article passionné sur un terroir viticole: sol, climat, cépages, producteurs. Choisis parmi Etna, Moselle, Santorin. 260 mots. Français uniquement.'
  },
  {
    tag: '📚 Sommelier',
    isNews: false,
    it: 'Scrivi un articolo tecnico-pratico su una tecnica del sommelier: decantazione, temperatura di servizio, abbinamento cibo-vino, lettura etichette. Usa esempi concreti. 260 parole. Solo italiano.',
    en: 'Write a technical article on a sommelier technique: decanting, serving temperature, food pairing. Use concrete examples. 260 words. English only.',
    fr: 'Écris un article technique sur une technique de sommelier: décantation, température, accords mets-vins. Exemples concrets. 260 mots. Français uniquement.'
  },
  {
    tag: '🍇 Viticoltura',
    isNews: false,
    it: 'Scrivi un articolo sulla viticoltura: potatura, vendemmia, biodinamica, cambiamento climatico, alberello, copertina erbosa. Usa esempi di vignaioli reali. 260 parole. Solo italiano.',
    en: 'Write an article on viticulture: pruning, harvest, biodynamic farming, climate change. Use real winegrower examples. 260 words. English only.',
    fr: 'Écris un article sur la viticulture: taille, vendange, viticulture biodynamique, changement climatique. 260 mots. Français uniquement.'
  },
  {
    tag: '✨ Produttori',
    isNews: false,
    it: 'Scrivi un profilo di un produttore vinicolo eccellente: storia, filosofia, vini iconici, prezzi, perché vale la pena. Scegli tra DRC, Egon Müller, Quintarelli, Penfolds, Catena Zapata, Sassicaia. 260 parole. Solo italiano.',
    en: 'Write a producer profile: history, philosophy, iconic wines, prices. Choose from DRC, Egon Müller, Penfolds, Catena Zapata. 260 words. English only.',
    fr: 'Écris un profil de producteur: histoire, philosophie, vins iconiques. Choisis parmi DRC, Egon Müller, Penfolds. 260 mots. Français uniquement.'
  }
];

const SYS_ART = 'Sei un esperto giornalista enogastronomico. Scrivi con precisione, passione e concretezza. Usa sempre nomi reali di produttori, denominazioni, annate. Mai generico.';
const SYS_TIT = 'Sei un editor. Rispondi SOLO con il titolo (max 8 parole), nient\'altro, zero virgolette, zero punteggiatura finale.';

async function generateArticles(force = false) {
  const today = new Date().toISOString().split('T')[0];
  if (!force && _lastGen === today && _articles.length > 0) {
    console.log('[articles] Cache valida');
    return _articles;
  }

  console.log('[articles] Generazione per', today);
  const arts = [];

  for (let i = 0; i < TOPICS.length; i++) {
    const T = TOPICS[i];
    try {
      /* Italiano */
      const txt_it = await callAI(`${SYS_ART} Rispondi solo in italiano.`, T.it, 600);
      await sleep(700);
      const tit_it = await callAI(SYS_TIT, `Titolo per: ${txt_it.substring(0, 150)}`, 50);
      await sleep(400);

      /* Inglese */
      const txt_en = await callAI(`${SYS_ART} Reply only in English.`, T.en, 600);
      await sleep(700);
      const tit_en = await callAI('You are an editor. Reply ONLY with the title (max 8 words), no quotes, no punctuation.', `Title for: ${txt_en.substring(0, 150)}`, 50);
      await sleep(400);

      /* Francese */
      const txt_fr = await callAI(`${SYS_ART} Réponds uniquement en français.`, T.fr, 600);
      await sleep(700);
      const tit_fr = await callAI('Tu es un éditeur. Réponds UNIQUEMENT avec le titre (max 8 mots), sans guillemets.', `Titre pour: ${txt_fr.substring(0, 150)}`, 50);
      await sleep(400);

      const art = {
        id: `art_${today}_${i}`,
        isNews: T.isNews,
        generato_ai: true,
        categoria_it: T.tag, categoria_en: T.tag, categoria_fr: T.tag,
        titolo_it: tit_it.trim().replace(/^["'«»]+|["'«»]+$/g, ''),
        titolo_en: tit_en.trim().replace(/^["'«»]+|["'«»]+$/g, ''),
        titolo_fr: tit_fr.trim().replace(/^["'«»]+|["'«»]+$/g, ''),
        testo_it: txt_it.trim(),
        testo_en: txt_en.trim(),
        testo_fr: txt_fr.trim(),
        autore: 'Sommelier World AI',
        data: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
        immagine: IMGS[i % IMGS.length]   /* solo foto vino verificate */
      };
      arts.push(art);
      console.log(`[articles] ${i + 1}/${TOPICS.length} ✓ "${art.titolo_it}"`);
    } catch (e) {
      console.error(`[articles] topic ${i} errore:`, e.message);
    }
  }

  if (arts.length > 0) { _articles = arts; _lastGen = today; }
  return arts;
}

/* ════════════════════════════════════════════
   POST /api/contact — form contatti
   ════════════════════════════════════════════ */
app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', subject = '', message = '' } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Campi mancanti' });

  const html =
    `<div style="font-family:sans-serif;max-width:600px;">
      <h2 style="color:#8B0000;">📩 Messaggio da SommelierWorld</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Argomento:</strong> ${subject || '—'}</p>
      <p><strong>Messaggio:</strong></p>
      <blockquote style="border-left:3px solid #BF9B4A;padding-left:12px;">${message.replace(/\n/g, '<br>')}</blockquote>
    </div>`;

  try {
    await sendEmail(ADMIN_EMAIL, `[SW] ${subject || 'Msg da ' + name}`, html);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: true, warn: e.message });
  }
});

/* ════════════════════════════════════════════
   CRON — genera articoli ogni mattina alle 07:00 UTC
   ════════════════════════════════════════════ */
function startCron() {
  function scheduleNext() {
    const now  = new Date();
    const next = new Date(now);
    next.setUTCHours(7, 0, 0, 0);
    if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
    const delay = next - now;
    console.log(`[cron] Prossima gen: ${next.toISOString()} (fra ${Math.round(delay / 60000)} min)`);
    setTimeout(async () => {
      console.log('[cron] Generazione articoli…');
      try { await generateArticles(true); } catch (e) { console.error('[cron]', e.message); }
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}


/* ════════════════════════════════════════════
   GET /api/debug — diagnostica per Railway
   ════════════════════════════════════════════ */
app.get('/api/debug', (req, res) => {
  res.json({
    version: '9.0',
    timestamp: new Date().toISOString(),
    node: process.version,
    env: {
      groq:   !!GROQ_KEY,
      gemini: !!GEMINI_KEY,
      email:  !!SMTP_USER,
      port:   PORT,
      admin_secret_set: !!ADMIN_SECRET,
    },
    articles: {
      count: _articles.length,
      lastGen: _lastGen || 'mai generati',
      titles: _articles.slice(0,3).map(a => a.titolo_it || a.titolo_en || '?')
    },
    uptime_min: Math.round(process.uptime() / 60),
    message: 'Se vedi questo, Railway sta girando la versione corretta ✓'
  });
});

/* ════════════════════════════════════════════
   AVVIO
   ════════════════════════════════════════════ */
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🍷 Sommelier World Server v9.0 — porta ${PORT}`);
  console.log(`   Groq:${GROQ_KEY ? '✓' : '✗'} Gemini:${GEMINI_KEY ? '✓' : '✗'} Email:${SMTP_USER ? '✓' : '✗'}`);
  startCron();
  if (_articles.length === 0 && (GROQ_KEY || GEMINI_KEY)) {
    console.log('[startup] Generazione articoli iniziali…');
    generateArticles().catch(e => console.warn('[startup]', e.message));
  }
});
