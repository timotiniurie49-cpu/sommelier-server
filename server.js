/**
 * SOMMELIER WORLD — server.js v9.1
 * Completo, pulito, senza duplicati.
 * Railway ENV: GROQ_API_KEY, GEMINI_API_KEY, ADMIN_SECRET,
 *              SMTP_USER, SMTP_PASS, ADMIN_EMAIL
 */
'use strict';

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

/* ── Middleware ──────────────────────────── */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma',  'no-cache');
  res.setHeader('Expires', '0');
  next();
});

/* ── Configurazione ──────────────────────── */
const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';
const SMTP_USER    = process.env.SMTP_USER       || '';
const SMTP_PASS    = process.env.SMTP_PASS       || '';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL     || 'timotiniurie49@gmail.com';

/* ── Stato in memoria ─────────────────────── */
let _articles = [];
let _lastGen  = '';

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

/* ════════════════════════════════════════════
   AI — Groq primario, Gemini fallback
   ════════════════════════════════════════════ */
async function callGroq(system, user, maxTokens = 1200) {
  if (!GROQ_KEY) throw new Error('GROQ_API_KEY mancante');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      temperature: 0.78,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    })
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || `Groq ${r.status}`);
  return d.choices?.[0]?.message?.content || '';
}

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
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.78 }
      })
    }
  );
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || `Gemini ${r.status}`);
  return d.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callAI(system, user, maxTokens = 1200) {
  try {
    return await callGroq(system, user, maxTokens);
  } catch (e) {
    console.warn('[Groq→Gemini]', e.message);
    return await callGemini(`${system}\n\n${user}`, maxTokens);
  }
}

/* ════════════════════════════════════════════
   EMAIL
   ════════════════════════════════════════════ */
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
   FOTO INTELLIGENTE — mappa topic → URL vino
   Tutte verificate manualmente come foto di vino/vigne
   ════════════════════════════════════════════ */
const PHOTO_MAP = {
  wine_glass:    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80&fit=crop',
  wine_red:      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=80&fit=crop',
  wine_white:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&fit=crop',
  vineyard_hill: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=700&q=80&fit=crop',
  vineyard_sun:  'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=700&q=80&fit=crop',
  winery:        'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=700&q=80&fit=crop',
  cellar:        'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=700&q=80&fit=crop',
  grapes:        'https://images.unsplash.com/photo-1515779122185-2390ccdf060b?w=700&q=80&fit=crop',
  harvest:       'https://images.unsplash.com/photo-1596363470302-8d7c62a64c2d?w=700&q=80&fit=crop',
  champagne:     'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=700&q=80&fit=crop',
  sommelier:     'https://images.unsplash.com/photo-1574014671294-4b64eb4c68b4?w=700&q=80&fit=crop',
  bottles:       'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=700&q=80&fit=crop',
};

function topicPhoto(tag, title) {
  const t = ((tag || '') + ' ' + (title || '')).toLowerCase();
  let query = 'wine,vineyard';
  if (t.match(/barolo|nebbiolo|langhe|piemonte/))     query = 'barolo,vineyard,piedmont,wine';
  else if (t.match(/champagne|bollicin|spumant/))     query = 'champagne,bubbles,sparkling,wine';
  else if (t.match(/mosel|mosella|riesling.*german/)) query = 'mosel,riesling,germany,vineyard';
  else if (t.match(/etna|vulcan|lava/))               query = 'etna,volcano,vineyard,sicily';
  else if (t.match(/borgogna|bourgogne|pinot.*noir/)) query = 'burgundy,pinot,vineyard,france';
  else if (t.match(/santorini|assyrtiko|grecia/))     query = 'santorini,vineyard,greece,wine';
  else if (t.match(/bordeaux|cabernet|merlot/))       query = 'bordeaux,chateau,vineyard,wine';
  else if (t.match(/toscana|sangiovese|chianti|brunello/)) query = 'tuscany,vineyard,wine,italy';
  else if (t.match(/rioja|tempranillo|spagna/))       query = 'rioja,vineyard,spain,wine';
  else if (t.match(/sommelier|degust|abbinament/))    query = 'sommelier,wine,tasting,glass';
  else if (t.match(/vendemmia|harvest|raccolt/))      query = 'harvest,grape,picking,vineyard';
  else if (t.match(/cantina|barrique|barrel|botti/))  query = 'wine,cellar,barrel,aging';
  else if (t.match(/viticolt|potatur|vigneto/))       query = 'vineyard,vine,pruning,wine';
  else if (t.match(/notizia|mercato|prezzi|asta/))    query = 'wine,bottle,cellar,collection';
  else if (t.match(/rosso|red.*wine|malbec|shiraz/))  query = 'red,wine,glass,vineyard';
  else if (t.match(/bianco|white.*wine|riesling/))    query = 'white,wine,glass,vineyard';
  else if (t.match(/provenza|rose|rosato/))           query = 'provence,rose,wine,vineyard';
  else if (t.match(/tokaj|furmint/))                  query = 'tokaj,hungary,wine,vineyard';
  else if (t.match(/georgia|kvevri/))                 query = 'georgia,wine,clay,kvevri';
  const seed = title
    ? Math.abs(title.split('').reduce((a,c) => a + c.charCodeAt(0), 0))
    : Math.floor(Date.now() / 86400000);
  return 'https://source.unsplash.com/700x400/?' + query + '&seed=' + seed;
}

/* ════════════════════════════════════════════
   TOPICS DINAMICI — variano ogni giorno
   Pool mondiali: 7 news, 14 terroir, 8 som,
   7 viticoltura, 10 vitigni
   ════════════════════════════════════════════ */
function getDailyTopics() {
  const today = new Date();
  const d = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

  /* NEWS_POOL — 31 varianti = 1 mese senza ripetizioni */
  const NEWS_POOL = [
    "mercato mondiale vini pregiati 2025-2026: aste Sothebys Christie's, prezzi record, chi compra",
    "cambiamento climatico sulle vendemmie 2025: siccita, grandine, come i produttori rispondono",
    "produttore mondiale premiato 2025-2026 da Decanter World Wine Awards con voti e motivazioni",
    "tendenze consumo vini 2026: dati IWSR, paesi emergenti, stili che crescono e calano",
    "innovazione in cantina 2025-2026: anfore georgiane, robot in vigna, AI nella vinificazione",
    "grande cantina acquisita o fusione nel 2025-2026: chi compra chi e perche nel mercato del vino",
    "denominazione emergente 2025-2026: nuova DOC italiana o nuova AVA americana con storia",
    "Barolo 2020 vs 2021: confronto tra due grandi annate piemontesi, chi vince e perche",
    "vini naturali e biodinamici 2025-2026: crescita del mercato, fiere, produttori da conoscere",
    "turismo del vino 2026: le cantine piu visitate al mondo, enoturismo post-pandemia, dati",
    "Champagne 2025-2026: annata, prezzi, nuove maison RM emergenti da scoprire",
    "vino cinese nel 2026: Ningxia conquista medaglie internazionali, cosa sta succedendo",
    "Prosecco vs Champagne: guerre legali, mercati, chi cresce di piu nel 2026",
    "Orange wine mainstream nel 2026: da nicchia a fenomeno globale, produttori chiave",
    "vini della Georgia 2025-2026: Kvevri conquista l'Europa, esportazioni, produttori",
    "prezzi del Barolo e Brunello nel 2026: analisi mercato secondario, en primeur",
    "Napa Valley 2024 vintage report: dopo gli incendi, una vendemmia eccezionale",
    "vini greci 2025-2026: Assyrtiko e Xinomavro conquistano le carte mondiali",
    "mercato spumanti italiani 2026: Franciacorta cresce, Trento DOC si consolida",
    "sostenibilita in vigna 2026: certificazioni, carbon footprint, chi guida la rivoluzione verde",
    "vini arancio 2026: da Collio a Georgia, mappa mondiale del skin contact",
    "investire in vino 2026: Liv-ex, rendimenti, quali etichette acquistare come investimento",
    "Riesling tedesco 2025: vendemmia fredda, acidita record, prezzi ancora accessibili",
    "Malbec argentino conquista Europa: nuovi mercati, Uco Valley emergente, annata 2024",
    "vino giapponese 2025-2026: Koshu e Muscat Bailey A a Londra, il Giappone vitivinicolo",
    "Bordeaux 2023 en primeur: prezzi crollano, i migliori chateaux da comprare",
    "Pinot Nero oltre Borgogna: Oregon Willamette, Otago, Ahr, chi fa meglio nel 2026",
    "vino senz'alcol 2026: il mercato esplode, quali sono buoni veramente, produttori pionieri",
    "Rioja divide: tradizionalisti vs modernisti, la guerra dei vini spagnoli nel 2026",
    "cannabis wine e infusi: legale in Europa, chi produce, quanto costa, dove comprare",
    "donne nel vino 2026: produttrici, cantiniere, sommelieres che stanno cambiando il settore",
  ];

  const TERROIR_POOL = [
    "Mosel tedesca: ardesia blu devoniana, vigneti eroici al 70%, Egon Muller, JJ Prum, Wehlener Sonnenuhr",
    "Barolo Piemonte: nebbiolo sulle Langhe, MGA storiche, Conterno Monfortino, Mascarello, Bruno Giacosa",
    "Champagne: suolo cretaceo, cinque sottozone, grande maison vs recoltant-manipulant, Krug vs Bollinger",
    "Santorini Grecia: Assyrtiko su pomice vulcanica, alberello kouloura, Gaia Wines, Hatzidakis, Sigalas",
    "Priorat Catalogna: llicorella scura, Garnacha centenaria 60+ anni, Alvaro Palacios, Clos Mogador",
    "Wachau Austria: Gruner Veltliner e Riesling sul Danubio, classificazione Smaragd, FX Pichler, Prager",
    "Barossa Valley Australia: Shiraz centenario old vines 100+ anni, Penfolds Grange, Henschke Hill of Grace",
    "Marlborough Nuova Zelanda: Sauvignon Blanc, terroir alluvionale, Cloudy Bay, Greywacke, Dog Point",
    "Mendoza Argentina: Malbec sulle Ande a 900-1500m, Catena Zapata Adrianna Vineyard, Achaval Ferrer",
    "Borgogna Francia: Pinot Noir e Chardonnay sui Grands Crus, DRC Romanee-Conti, Leroy, Rousseau",
    "Etna Sicilia: Nerello Mascalese sulle 133 contrade vulcaniche, Cornelissen, Terre Nere, Passopisciaro",
    "Tokaj Ungheria: Furmint e Harslevelu, botrytis puttonyos, storia dei Re, Disznoko, Royal Tokaji",
    "Georgia: Kvevri interrate, Rkatsiteli ambrato, Saperavi potente, 8000 anni di storia, Pheasants Tears",
    "Rioja Spagna: Tempranillo sulle tre sottozone, Gran Reserva, Muga Prado Enea, CVNE Imperial",
  ];

  const SOM_POOL = [
    "decantazione: quando usarla e quando evitarla, vini che ne beneficiano, tempi per ogni stile",
    "abbinamento cibo-vino nel mondo: principi di concordanza e contrasto, 8 abbinamenti perfetti internazionali",
    "temperatura di servizio: impatto sul vino, regole pratiche per spumanti bianchi rossi dolci al ristorante",
    "degustazione professionale metodo AIS: esame visivo olfattivo gustativo, come descrivere un grande vino",
    "grandi annate del mondo 2010-2024: Borgogna 2015, Barolo 2016, Mosel 2021, Napa 2013, quale comprare",
    "Champagne e bollicine mondiali: metodo classico vs Charmat vs petillant naturel, come scegliere il migliore",
    "vini naturali biodinamici organici: differenze reali, produttori di riferimento, come riconoscerli al naso",
    "vini dolci del mondo: Sauternes, TBA del Mosel, Tokaj Aszu, Vin Santo, Recioto, Ice Wine canadese",
  ];

  const VIT_POOL = [
    "potatura invernale e sistemi di allevamento: Guyot borgognone, alberello siciliano, Lyre americano",
    "cambiamento climatico in vigna: adattamenti dei produttori, vitigni resistenti, vigneti ad alta quota",
    "vendemmia: come si decide il momento perfetto, differenze tra nord Europa e Mediterraneo, biochimica",
    "viticoltura biodinamica: calendario lunare, preparati 500-501, produttori mondiali da DRC a Zind-Humbrecht",
    "il terroir: come suolo clima e uomo creano il carattere irripetibile di un vino, esempio Borgogna vs Barossa",
    "vitigni autoctoni dimenticati e recuperati: Timorasso, Grillo, Coda di Volpe, Xinomavro, Godello, Sagrantino",
    "irrigazione e siccità: sistemi goccia a goccia, stress idrico controllato, Cile Argentina California vs Europa",
  ];

  const VIG_POOL = [
    "Nebbiolo: Barolo Barbaresco Gattinara, vitigno piu difficile Italia, come invecchia, MGA storiche",
    "Riesling: Mosel Alsazia Rheingau Wachau Clare Valley, il piu longevo al mondo, petroliosita TDN",
    "Pinot Nero: Borgogna vs Willamette vs Otago vs Ahr, Santo Graal dei vitigni rossi, perche e impossibile",
    "Sangiovese famiglia di cloni: Brunello Grosso, Prugnolo Gentile, Morellino, Chianti, differenze genetiche",
    "Assyrtiko Santorini: minerale vulcanico, Gaia Wines, Hatzidakis, longeva struttura, perche e unico al mondo",
    "Malbec Argentina vs Cahors Francia: stessa uva mondi opposti, Catena Zapata vs Chateau Lagrezette",
    "Grenache Garnacha Cannonau: piu coltivato al mondo, Priorat vs Provenza vs Sardegna, stili a confronto",
    "Cabernet Sauvignon: Bordeaux vs Napa vs Cile vs Toscana, come esprime il terroir diversamente",
    "Shiraz Syrah: Nord Rodano vs Barossa, Hermitage Chave vs Penfolds Grange, stesso vitigno mondi opposti",
    "vitigni aromatici: Gewurztraminer Alsazia, Moscato Piemonte, Torrontes Argentina, Malvasia Sicilia",
  ];

  const n  = NEWS_POOL[d % NEWS_POOL.length];
  const t1 = TERROIR_POOL[d % TERROIR_POOL.length];
  const t2 = TERROIR_POOL[(d + 6) % TERROIR_POOL.length];
  const s  = SOM_POOL[(d + 2) % SOM_POOL.length];
  const v  = VIT_POOL[(d + 3) % VIT_POOL.length];
  const g  = VIG_POOL[(d + 4) % VIG_POOL.length];

  return [
    {
      tag: '🗞 Wine News', isNews: true, photo: 'bottles',
      it: `Scrivi una notizia attuale e coinvolgente (2025-2026) su: ${n}. Struttura: hook forte (60 parole) + analisi approfondita (280 parole) + impatto sul mercato e consiglio pratico per il lettore (160 parole). Usa fatti specifici, nomi reali, numeri concreti. TOTALE 500 parole. Solo italiano.`,
      en: `Write a current and engaging 2025-2026 wine news about: ${n}. Structure: strong hook (60w) + deep analysis (280w) + market impact and practical advice (160w). Specific facts, real names, numbers. 500 words. English only.`,
      fr: `Ecris une actualite vinicole 2025-2026 captivante sur: ${n}. Structure: accroche forte (60m) + analyse approfondie (280m) + impact marche et conseil pratique (160m). Faits precis, noms reels. 500 mots. Francais uniquement.`
    },
    {
      tag: '🌍 Terroir', isNews: false, photo: 'vineyard_hill',
      it: `Scrivi un articolo appassionato e dettagliato su: ${t1}. Struttura: storia e identita del territorio (120 parole) + geologia e clima spiegati in modo semplice e vivido (160 parole) + produttori chiave con vini e prezzi specifici (120 parole) + curiosita rara che pochi conoscono (100 parole). TOTALE 500 parole. Solo italiano.`,
      en: `Write a passionate detailed article about: ${t1}. Structure: territory identity and history (120w) + geology and climate in vivid simple terms (160w) + key producers with specific wines and prices (120w) + rare fact few people know (100w). 500 words. English only.`,
      fr: `Ecris un article passionne et detaille sur: ${t1}. Structure: identite et histoire du territoire (120m) + geologie et climat en termes vivants (160m) + producteurs cles avec vins et prix specifiques (120m) + curiosite rare (100m). 500 mots. Francais uniquement.`
    },
    {
      tag: '📚 Sommelier', isNews: false, photo: 'sommelier',
      it: `Scrivi un articolo tecnico e pratico su: ${s}. Struttura: perche e importante saperlo (80 parole) + regole pratiche con esempi di vini reali (240 parole) + errori comuni da evitare (100 parole) + consiglio del maestro (80 parole). TOTALE 500 parole. Solo italiano.`,
      en: `Write a technical and practical article about: ${s}. Structure: why it matters (80w) + practical rules with real wine examples (240w) + common mistakes to avoid (100w) + master sommelier tip (80w). 500 words. English only.`,
      fr: `Ecris un article technique et pratique sur: ${s}. Structure: pourquoi cest important (80m) + regles pratiques avec exemples reels (240m) + erreurs courantes (100m) + conseil du maitre (80m). 500 mots. Francais uniquement.`
    },
    {
      tag: '🍇 Viticoltura', isNews: false, photo: 'harvest',
      it: `Scrivi un articolo appassionante su: ${v}. Struttura: la sfida del vignaiolo spiegata con una storia concreta (120 parole) + tecnica spiegata in modo accessibile con esempi mondiali (200 parole) + come questo influenza il vino nel bicchiere (100 parole) + 3 produttori di riferimento con il loro approccio unico (80 parole). TOTALE 500 parole. Solo italiano.`,
      en: `Write an engaging article about: ${v}. Structure: the winegrower challenge told through a concrete story (120w) + technique explained accessibly with world examples (200w) + how this affects the wine in the glass (100w) + 3 reference producers and their approach (80w). 500 words. English only.`,
      fr: `Ecris un article captivant sur: ${v}. Structure: le defi du vigneron raconte a travers une histoire concrete (120m) + technique accessible avec exemples mondiaux (200m) + impact sur le vin (100m) + 3 producteurs de reference (80m). 500 mots. Francais uniquement.`
    },
    {
      tag: '🍷 Vitigni', isNews: false, photo: 'wine_red',
      it: `Scrivi un articolo appassionante sul vitigno: ${g}. Struttura: chi e questo vitigno e dove nasce (100 parole) + carattere ampelografico e sensoriale con paragoni vividi (160 parole) + i tre migliori produttori mondiali con vini specifici e prezzi (140 parole) + perche vale la pena conoscerlo (100 parole). TOTALE 500 parole. Solo italiano.`,
      en: `Write an engaging article on: ${g}. Structure: what is this grape and where it comes from (100w) + ampelographic and sensory character with vivid comparisons (160w) + top 3 world producers with specific wines and prices (140w) + why it is worth knowing (100w). 500 words. English only.`,
      fr: `Ecris un article captivant sur: ${g}. Structure: qu'est-ce que ce cepage et d'ou vient-il (100m) + caractere ampelographique et sensoriel avec comparaisons vivantes (160m) + 3 meilleurs producteurs mondiaux avec vins et prix (140m) + pourquoi le connaitre (100m). 500 mots. Francais uniquement.`
    },
    {
      tag: '🌍 Terroir Mondiale', isNews: false, photo: 'vineyard_sun',
      it: `Scrivi un articolo appassionato e curioso su: ${t2}. Struttura: l'elemento sorprendente che rende questa zona unica (100 parole) + il suolo e il microclima spiegati in modo sensoriale (160 parole) + produttori emergenti da scoprire (120 parole) + come degustare questi vini al meglio (120 parole). TOTALE 500 parole. Solo italiano.`,
      en: `Write a passionate article about: ${t2}. Structure: the surprising element that makes this region unique (100w) + soil and microclimate explained sensorially (160w) + emerging producers to discover (120w) + how to taste these wines at their best (120w). 500 words. English only.`,
      fr: `Ecris un article passionne sur: ${t2}. Structure: element surprenant qui rend cette region unique (100m) + sol et microclimat expliques sensorellement (160m) + producteurs emergents (120m) + comment deguster ces vins (120m). 500 mots. Francais uniquement.`
    },
  ];
}

/* ════════════════════════════════════════════
   GENERAZIONE ARTICOLI
   ════════════════════════════════════════════ */
const SYS_ART = 'Sei un esperto giornalista enogastronomico internazionale, stile Decanter e Wine Spectator. ' +
  'Scrivi con precisione, passione e concretezza. ' +
  'Regole OBBLIGATORIE: (1) usa sempre nomi reali di produttori, denominazioni, annate specifiche; ' +
  '(2) includi almeno 3 dettagli tecnici concreti (es. suolo, altitudine, resa/ettaro, gradazione); ' +
  '(3) racconta come una storia che cattura, non elencare fatti; ' +
  '(4) ogni articolo deve includere un fatto sorprendente che pochi conoscono.';

const SYS_TIT = 'Sei un editor di una rivista di vino. ' +
  'Rispondi SOLO con il titolo (massimo 8 parole, nessuna virgolette, nessuna punteggiatura finale). ' +
  'Il titolo deve essere evocativo e preciso, non generico.';

async function generateArticles(force = false) {
  const today = new Date().toISOString().split('T')[0];
  if (!force && _lastGen === today && _articles.length > 0) {
    console.log('[articles] Cache valida per', today);
    return _articles;
  }

  console.log('[articles] Generazione per', today);
  const arts = [];
  const topics = getDailyTopics();

  for (let i = 0; i < topics.length; i++) {
    const T = topics[i];
    try {
      /* Italiano */
      const txt_it = await callAI(`${SYS_ART} Rispondi solo in italiano.`, T.it, 1100);
      await sleep(700);
      const tit_it = await callAI(SYS_TIT, `Titolo per: ${txt_it.substring(0, 250)}`, 60);
      await sleep(400);

      /* Inglese */
      const txt_en = await callAI(`${SYS_ART} Reply only in English.`, T.en, 1100);
      await sleep(700);
      const tit_en = await callAI(
        'You are a wine magazine editor. Reply ONLY with the title (max 8 words, no quotes, no final punctuation).',
        `Title for: ${txt_en.substring(0, 250)}`, 60
      );
      await sleep(400);

      /* Francese */
      const txt_fr = await callAI(`${SYS_ART} Réponds uniquement en français.`, T.fr, 1100);
      await sleep(700);
      const tit_fr = await callAI(
        'Tu es un éditeur de magazine vinicole. Réponds UNIQUEMENT avec le titre (max 8 mots, sans guillemets).',
        `Titre pour: ${txt_fr.substring(0, 250)}`, 60
      );
      await sleep(400);

      const cleanTit = s => s.trim().replace(/^["'«»\-–—]+|["'«»\-–—]+$/g, '').trim();

      const art = {
        id:           `art_${today}_${i}`,
        isNews:       T.isNews,
        generato_ai:  true,
        categoria_it: T.tag,
        categoria_en: T.tag,
        categoria_fr: T.tag,
        titolo_it:    cleanTit(tit_it),
        titolo_en:    cleanTit(tit_en),
        titolo_fr:    cleanTit(tit_fr),
        testo_it:     txt_it.trim(),
        testo_en:     txt_en.trim(),
        testo_fr:     txt_fr.trim(),
        autore:       'Sommelier World AI',
        data:         new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
        immagine:     topicPhoto(T.tag, cleanTit(tit_it)),
      };

      arts.push(art);
      console.log(`[articles] ${i + 1}/${topics.length} ✓ "${art.titolo_it}"`);
    } catch (e) {
      console.error(`[articles] topic ${i} errore:`, e.message);
    }
  }

  if (arts.length > 0) { _articles = arts; _lastGen = today; }
  return arts;
}

/* ════════════════════════════════════════════
   ROUTE: ROOT + HEALTH
   ════════════════════════════════════════════ */
app.get('/', (_req, res) => res.json({
  name:     'Sommelier World Server',
  version:  '9.1',
  groq:     !!GROQ_KEY,
  gemini:   !!GEMINI_KEY,
  articles: _articles.length,
  lastGen:  _lastGen || 'mai',
  ok:       true,
}));

app.get('/api/health', (_req, res) => res.json({ ok: true, version: '9.1' }));

app.get('/api/debug', (_req, res) => res.json({
  version:    '9.1',
  timestamp:  new Date().toISOString(),
  groq:       !!GROQ_KEY,
  gemini:     !!GEMINI_KEY,
  email:      !!SMTP_USER,
  articles:   _articles.length,
  lastGen:    _lastGen || 'mai',
  uptime_min: Math.round(process.uptime() / 60),
  message:    'Railway v9.1 operativo ✓',
}));

/* ════════════════════════════════════════════
   ROUTE: SOMMELIER AI
   Vincolo geografico applicato lato server
   ════════════════════════════════════════════ */
app.post(['/api/groq', '/api/chat'], async (req, res) => {
  try {
    let { system = '', userMsg = '', language = 'it', maxTokens = 1600,
          paese = '', regione = '' } = req.body;

    /* Istruzione lingua — sempre in testa */
    const LANG = {
      it: 'Rispondi SEMPRE e SOLO in italiano.',
      en: 'Reply ALWAYS and ONLY in English.',
      fr: 'Réponds TOUJOURS et UNIQUEMENT en français.'
    };
    const langCmd = LANG[language] || LANG.it;
    if (!system.includes(langCmd)) system = `${langCmd}\n${system}`;

    /* Vincolo geografico assoluto */
    const ESEMPI = {
      'Germania':   'Riesling Mosel (Egon Muller, JJ Prum), Spatburgunder Ahr (Meyer-Nakel), Silvaner Franken',
      'Francia':    'Bourgogne Pinot Noir, Chablis, Champagne, Chateauneuf-du-Pape, Sancerre',
      'Spagna':     'Rioja Tempranillo (Muga, CVNE), Ribera del Duero, Albarino Rias Baixas, Priorat',
      'Austria':    'Gruner Veltliner Smaragd Wachau (FX Pichler), Riesling Kamptal, Blaufrankisch',
      'USA':        'Napa Cabernet Sauvignon (Opus One, Heitz), Willamette Pinot Noir, Finger Lakes Riesling',
      'Grecia':     'Assyrtiko Santorini (Gaia, Hatzidakis), Xinomavro Naoussa (Thymiopoulos)',
      'Portogallo': 'Douro Touriga Nacional (Niepoort, Ramos Pinto), Alentejo, Vinho Verde Alvarinho',
      'Argentina':  'Mendoza Malbec (Catena Zapata, Achaval Ferrer), Salta Torrontes, Uco Valley',
      'Australia':  'Barossa Shiraz (Penfolds Grange, Henschke), Clare Valley Riesling, Yarra Pinot Noir',
    };

    if (paese && paese !== 'Italia') {
      const esempi = ESEMPI[paese] || `vini tipici di ${paese}`;
      userMsg =
        `\n\n${'█'.repeat(44)}\n` +
        `VINCOLO GEOGRAFICO ASSOLUTO\n` +
        `${'█'.repeat(44)}\n` +
        `PAESE: "${paese}"${regione ? `\nREGIONE: "${regione}"` : ''}\n\n` +
        `OBBLIGATORIO: consiglia SOLO vini di ${paese}${regione ? ` zona ${regione}` : ''}\n` +
        `VIETATO: qualsiasi vino non proveniente da ${paese}\n` +
        `Esempi accettabili: ${esempi}\n` +
        `${'█'.repeat(44)}\n\n` + userMsg;
    }

    /* Aggiunge regole AIS al system prompt se non già presenti */
    if (!system.includes('REGOLE D')) {
      system += '\n\n═══ REGOLE INVIOLABILI AIS ═══\n' +
        'TANNINO + PESCE = VIETATO (sapore metallico). ' +
        'PIATTO GRASSO → acidità o bollicine obbligatorie. ' +
        'CARNE SUCCULENTA → tannino + alcol. ' +
        'DESSERT → solo vino dolce. ' +
        'SPEZIATO → vino morbido e fruttato, basso alcol. ' +
        'Struttura risposta: ① Analisi AIS del piatto ② Vino consigliato con chimica ③ Alternativa economica ④ Temperatura/servizio ⑤ Segreto del sommelier.';
    }

    const text = await callAI(system, userMsg, maxTokens);
    res.json({ text, ok: true });

  } catch (e) {
    console.error('[/api/groq]', e.message);
    res.status(500).json({ error: e.message });
  }
});

/* ════════════════════════════════════════════
   ROUTE: ARTICOLI
   ════════════════════════════════════════════ */
app.get('/api/articles', (_req, res) => {
  res.json(_articles);
});

app.get('/api/articles/generate', async (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Accesso negato' });
  try {
    const arts = await generateArticles(true);
    res.json({ ok: true, count: arts.length, titles: arts.map(a => a.titolo_it) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* Admin: salva articolo manuale */
app.post('/api/articles/save', async (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Accesso negato' });
  const art = req.body;
  if (!art || !art.id) return res.status(400).json({ error: 'Articolo non valido' });
  /* Assicura foto corretta basata su topic */
  if (!art.immagine) art.immagine = topicPhoto(art.categoria_it, art.titolo_it);
  _articles = [art, ..._articles.filter(a => a.id !== art.id)];
  console.log('[admin] Articolo salvato:', art.titolo_it || '?');
  res.json({ ok: true, count: _articles.length });
});

/* Admin: elimina articolo */
app.delete('/api/articles/delete/:id', (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Accesso negato' });
  const before = _articles.length;
  _articles = _articles.filter(a => a.id !== req.params.id);
  if (_articles.length === before) return res.status(404).json({ error: 'Articolo non trovato' });
  res.json({ ok: true, remaining: _articles.length });
});

/* ════════════════════════════════════════════
   ROUTE: CONTATTI
   ════════════════════════════════════════════ */
app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', subject = '', message = '' } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Campi mancanti' });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;">
      <h2 style="color:#8B0000;">📩 Messaggio da SommelierWorld</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Argomento:</strong> ${subject || '—'}</p>
      <p><strong>Messaggio:</strong></p>
      <blockquote style="border-left:3px solid #BF9B4A;padding-left:12px;">
        ${message.replace(/\n/g, '<br>')}
      </blockquote>
    </div>`;

  try {
    await sendEmail(ADMIN_EMAIL, `[SW] ${subject || 'Messaggio da ' + name}`, html);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: true, warn: e.message });
  }
});

/* ════════════════════════════════════════════
   CRON — genera articoli ogni giorno alle 07:00 UTC
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
      console.log('[cron] Generazione articoli...');
      try { await generateArticles(true); }
      catch (e) { console.error('[cron]', e.message); }
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}

/* ════════════════════════════════════════════
   AVVIO SERVER
   ════════════════════════════════════════════ */
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🍷 Sommelier World Server v9.1 — porta ${PORT}`);
  console.log(`   Groq:${GROQ_KEY ? '✓' : '✗'}  Gemini:${GEMINI_KEY ? '✓' : '✗'}  Email:${SMTP_USER ? '✓' : '✗'}`);
  startCron();
  if (_articles.length === 0 && (GROQ_KEY || GEMINI_KEY)) {
    console.log('[startup] Generazione articoli iniziali...');
    generateArticles().catch(e => console.warn('[startup]', e.message));
  }
});
