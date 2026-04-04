/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD — Server v7.1                                  ║
 * ║                                                                  ║
 * ║  ✓ Groq primario + Gemini fallback                             ║
 * ║  ✓ Cron job: articolo AI ogni giorno alle 08:00                ║
 * ║  ✓ API articoli: lista, aggiungi, rimuovi, genera               ║
 * ║    GET  /api/articles                                           ║
 * ║    POST /api/articles/generate  (cron-job.org o admin)         ║
 * ║    POST /api/articles           (aggiungi manuale)             ║
 * ║    DELETE /api/articles/:id     (rimuovi)                      ║
 * ║                                                                  ║
 * ║  Railway Variables:                                             ║
 * ║    GROQ_API_KEY     = gsk_...                                   ║
 * ║    GEMINI_API_KEY   = AIza...                                   ║
 * ║    GEMINI_MODEL     = gemini-2.0-flash                         ║
 * ║    ADMIN_SECRET     = una_parola_segreta_tua                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

'use strict';

const express  = require('express');
const cors     = require('cors');
const https    = require('https');
const fs       = require('fs');
const path     = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL    || 'gemini-2.0-flash';
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';

app.use(cors());
app.use(express.json({ limit: '4mb' }));

// ── Contatore chiamate ────────────────────────────────────
let callCount = 0;
let lastReset = Date.now();


/* ═══════════════════════════════════════════════════════
   ARTICOLI — storage in memoria + file cache
   ═══════════════════════════════════════════════════════ */
const ARTICLES_FILE = path.join('/tmp', 'sw_articles.json');

// Articoli seed (sempre disponibili come base)
const SEED_ARTICLES = [
  {
    id: 'seed-1',
    type: 'editorial',
    titolo_it: 'Barolo 2016: la Vendemmia del Secolo',
    titolo_en: 'Barolo 2016: The Vintage of the Century',
    titolo_fr: 'Barolo 2016 : le Millésime du Siècle',
    categoria_it: 'Annate', categoria_en: 'Vintages', categoria_fr: 'Millésimes',
    testo_it: 'Il 2016 è già considerato l\'annata più grande degli ultimi trent\'anni nelle Langhe. Un\'estate perfetta, senza stress idrico, con escursioni termiche notturne straordinarie ad agosto e settembre. I Barolo 2016 mostrano tannini di seta e acidità cristallina: questi vini dureranno cinquant\'anni.\n\nI produttori storici hanno raggiunto vette ineguagliabili. Il Monfortino di Giacomo Conterno, il Rocche dell\'Annunziata di Paolo Scavino, il Cerretta di Elio Grasso: ciascuno è un capolavoro della viticoltura mondiale.\n\nSe vuoi investire in un\'annata, questa è quella giusta — ma soprattutto, se la trovi a prezzo ragionevole, bevila. Il 2016 non è solo per i collezionisti.',
    testo_en: 'The 2016 vintage is already considered the greatest in the Langhe in thirty years. A perfect summer, no water stress, with extraordinary night-time temperature variations in August and September. The 2016 Barolos display silky tannins and crystalline acidity — these wines will last fifty years.\n\nHistoric producers achieved unequalled heights. The Monfortino from Giacomo Conterno, the Rocche dell\'Annunziata from Paolo Scavino, the Cerretta from Elio Grasso: each is a masterpiece of world viticulture.\n\nIf you want to invest in a vintage, this is it — but above all, if you find one at a reasonable price, drink it. 2016 is not just for collectors.',
    testo_fr: 'Le millésime 2016 est déjà considéré comme le plus grand des Langhe depuis trente ans. Un été parfait, sans stress hydrique, avec des amplitudes thermiques nocturnes extraordinaires en août et septembre. Les Barolo 2016 affichent des tanins soyeux et une acidité cristalline : ces vins dureront cinquante ans.\n\nLes producteurs historiques ont atteint des sommets inégalés. Le Monfortino de Giacomo Conterno, le Rocche dell\'Annunziata de Paolo Scavino, le Cerretta d\'Elio Grasso : chacun est un chef-d\'œuvre de la viticulture mondiale.',
    immagine: 'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
    autore: 'Timotin', data: '2 Aprile 2026', generato_ai: false,
  },
  {
    id: 'seed-2',
    type: 'editorial',
    titolo_it: 'Come Leggere un\'Etichetta: il Codice Segreto del Vino',
    titolo_en: 'How to Read a Wine Label: The Secret Code',
    titolo_fr: 'Comment Lire une Étiquette : Le Code Secret du Vin',
    categoria_it: 'Tecnica', categoria_en: 'Technique', categoria_fr: 'Technique',
    testo_it: 'DOC, DOCG, IGT, AVA, AOC, AOP: i livelli di classificazione sembrano in 2 minuti. Il millésime, il produttore, il vitigno, la denominazione — leggere un\'etichetta è come avere una carta d\'identità completa del vino.\n\nIl disciplinare è il regolamento che ogni denominazione deve rispettare: indica quali vitigni, quale resa massima, quale affinamento minimo. Più è restrittivo, più garantisce qualità e tipicità. Un Barolo DOCG deve avere 38 mesi di affinamento; un IGT può uscire dopo soli 6 mesi.\n\nIl trucco dei professionisti: guardare sempre il nome del produttore prima della denominazione. Un ottimo produttore in una denominazione minore batte un produttore mediocre in una grande denominazione.',
    testo_en: 'DOC, DOCG, IGT, AVA, AOC, AOP: the classification levels seem complex but can be mastered in two minutes. The vintage, producer, grape variety, appellation — reading a label is like having the wine\'s complete identity card.\n\nThe disciplinare is the set of rules each appellation must follow: it specifies which grapes, maximum yield, minimum ageing. The more restrictive it is, the more it guarantees quality and typicity.',
    testo_fr: 'DOC, DOCG, IGT, AVA, AOC, AOP : les niveaux de classification semblent complexes mais se maîtrisent en deux minutes. Le millésime, le producteur, le cépage, l\'appellation — lire une étiquette revient à disposer de la carte d\'identité complète du vin.',
    immagine: 'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
    autore: 'Timotin', data: '1 Aprile 2026', generato_ai: false,
  },
];

// Carica o inizializza lo store
let articlesStore = [];
function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      articlesStore = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      console.log(`[Articles] Caricati ${articlesStore.length} articoli da cache`);
    } else {
      articlesStore = [...SEED_ARTICLES];
      saveArticles();
      console.log('[Articles] Inizializzato con seed articles');
    }
  } catch(e) {
    articlesStore = [...SEED_ARTICLES];
    console.warn('[Articles] Errore caricamento, uso seed:', e.message);
  }
}
function saveArticles() {
  try { fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articlesStore, null, 2)); }
  catch(e) { console.warn('[Articles] Errore salvataggio:', e.message); }
}
loadArticles();


/* ═══════════════════════════════════════════════════════
   AI CALLS — Groq + Gemini
   ═══════════════════════════════════════════════════════ */
function callGroq(prompt) {
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500, temperature: 0.8
    });
    const req = https.request({
      hostname: 'api.groq.com', path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    }, function(res) {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', function() {
        try {
          const j = JSON.parse(data);
          if (j.choices?.[0]) resolve(j.choices[0].message.content);
          else reject(new Error(j.error?.message || 'Groq vuoto'));
        } catch(e) { reject(new Error('Groq parse error')); }
      });
    });
    req.on('error', e => reject(new Error('Groq network: ' + e.message)));
    req.setTimeout(40000, () => { req.destroy(); reject(new Error('Groq timeout')); });
    req.write(body); req.end();
  });
}

async function callGemini(prompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callAI(system, userMsg) {
  const prompt = system ? system + '\n\n' + userMsg : userMsg;
  callCount++;
  if (Date.now() - lastReset > 3600000) { callCount = 1; lastReset = Date.now(); }
  if (GROQ_KEY) {
    try {
      console.log(`[AI] Chiamata API inviata → Groq (#${callCount})`);
      const text = await callGroq(prompt);
      console.log('[AI] Groq OK');
      return text;
    } catch(e) {
      console.warn('[AI] Groq errore:', e.message);
      if (!GEMINI_KEY) throw e;
    }
  }
  if (GEMINI_KEY) {
    console.log(`[AI] Chiamata API inviata → Gemini (#${callCount})`);
    const text = await callGemini(prompt);
    console.log('[AI] Gemini OK');
    return text;
  }
  throw new Error('Nessun provider AI configurato.');
}


/* ═══════════════════════════════════════════════════════
   GENERATORE ARTICOLO AI
   Temi a rotazione ogni giorno
   ═══════════════════════════════════════════════════════ */
const ARTICLE_TOPICS = [
  { it: 'I segreti della degustazione alla cieca',  en: 'Secrets of blind tasting',      cat_it: 'Tecnica',       cat_en: 'Technique',     cat_fr: 'Technique' },
  { it: 'Champagne vs Franciacorta: la differenza vera', en: 'Champagne vs Franciacorta: the real difference', cat_it: 'Confronti', cat_en: 'Comparisons', cat_fr: 'Comparaisons' },
  { it: 'Il Nebbiolo in cinque denominazioni a confronto', en: 'Nebbiolo in five appellations compared', cat_it: 'Vitigni', cat_en: 'Grapes', cat_fr: 'Cépages' },
  { it: 'Come abbinare il vino al sushi e alla cucina giapponese', en: 'Pairing wine with sushi and Japanese cuisine', cat_it: 'Abbinamenti', cat_en: 'Pairings', cat_fr: 'Accords' },
  { it: 'I vini naturali: moda o rivoluzione?', en: 'Natural wines: trend or revolution?', cat_it: 'Tendenze', cat_en: 'Trends', cat_fr: 'Tendances' },
  { it: 'Riesling: il vitigno più incompreso del mondo', en: 'Riesling: the world\'s most misunderstood grape', cat_it: 'Vitigni', cat_en: 'Grapes', cat_fr: 'Cépages' },
  { it: 'Etna: perché è diventato il terroir più emozionante del mondo', en: 'Etna: why it became the world\'s most exciting terroir', cat_it: 'Terroir', cat_en: 'Terroir', cat_fr: 'Terroir' },
  { it: 'Servire il vino: temperatura, calici, decantazione', en: 'Serving wine: temperature, glasses, decanting', cat_it: 'Tecnica', cat_en: 'Technique', cat_fr: 'Technique' },
  { it: 'Il Malbec argentino: dai vigneti andini al bicchiere', en: 'Argentine Malbec: from Andean vineyards to the glass', cat_it: 'Mondo', cat_en: 'World', cat_fr: 'Monde' },
  { it: 'Borgogna: come navigare il sistema dei crus', en: 'Burgundy: how to navigate the cru system', cat_it: 'Denominazioni', cat_en: 'Appellations', cat_fr: 'Appellations' },
  { it: 'I vini da meditazione: Porto, Madeira, Marsala', en: 'Meditation wines: Port, Madeira, Marsala', cat_it: 'Vini Speciali', cat_en: 'Special Wines', cat_fr: 'Vins Spéciaux' },
  { it: 'Sangiovese: l\'uva che ha costruito l\'Italia enologica', en: 'Sangiovese: the grape that built Italian wine', cat_it: 'Vitigni', cat_en: 'Grapes', cat_fr: 'Cépages' },
  { it: 'Biodinamico, naturale, sostenibile: le differenze', en: 'Biodynamic, natural, sustainable: the differences', cat_it: 'Sostenibilità', cat_en: 'Sustainability', cat_fr: 'Durabilité' },
  { it: 'I grandi bianchi italiani: da Vermentino a Fiano', en: 'Italy\'s great whites: from Vermentino to Fiano', cat_it: 'Bianche', cat_en: 'Whites', cat_fr: 'Blancs' },
];

const ARTICLE_IMAGES = [
  'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/2664149/pexels-photo-2664149.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&w=900',
];

async function generateDailyArticle() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const topicIdx  = dayOfYear % ARTICLE_TOPICS.length;
  const imgIdx    = dayOfYear % ARTICLE_IMAGES.length;
  const topic     = ARTICLE_TOPICS[topicIdx];

  const now = new Date();
  const dateStr = now.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  const SYS = 'Sei un sommelier e giornalista enologico esperto. Scrivi articoli profondi, concreti e appassionanti sul vino. ' +
    'Stile: elegante ma accessibile, con fatti precisi e aneddoti reali. NO markdown, NO asterischi, NO titoli con #. ' +
    'Testo puro, paragrafi separati da righe vuote. Massimo 250 parole per lingua.';

  // Genera in tutte e tre le lingue
  async function genLang(lang, topicTitle) {
    const langInstr = lang === 'it' ? 'Scrivi in italiano' : lang === 'en' ? 'Write in English' : 'Écris en français';
    const prompt = `${langInstr}. Argomento: "${topicTitle}". Scrivi un articolo di magazine enologico. 3 paragrafi. Concreto, con esempi di vini e produttori reali. NO markdown.`;
    return await callAI(SYS, prompt);
  }

  console.log('[Articles] Generando articolo:', topic.it);

  const [testo_it, testo_en, testo_fr] = await Promise.all([
    genLang('it', topic.it),
    genLang('en', topic.en),
    genLang('fr', topic.it),
  ]);

  const newArticle = {
    id: 'ai-' + Date.now(),
    type: 'editorial',
    titolo_it: topic.it,
    titolo_en: topic.en,
    titolo_fr: topic.it, // titolo fr uguale all'italiano, testo diverso
    categoria_it: topic.cat_it,
    categoria_en: topic.cat_en,
    categoria_fr: topic.cat_fr,
    testo_it, testo_en, testo_fr,
    immagine: ARTICLE_IMAGES[imgIdx],
    autore: 'Sommelier World AI',
    data: dateStr,
    generato_ai: true,
  };

  // Aggiunge all'inizio, rimuove se ci sono più di 30 articoli
  articlesStore.unshift(newArticle);
  if (articlesStore.length > 30) articlesStore = articlesStore.slice(0, 30);
  saveArticles();

  console.log('[Articles] ✓ Articolo generato:', topic.it);
  return newArticle;
}


/* ═══════════════════════════════════════════════════════
   CRON JOB INTERNO — ogni giorno alle 08:00
   Usa setInterval come fallback se node-cron non è disponibile
   ═══════════════════════════════════════════════════════ */
function setupCron() {
  try {
    const cron = require('node-cron');
    // Ogni giorno alle 08:00 (UTC — Railway è UTC)
    cron.schedule('0 8 * * *', async function() {
      console.log('[Cron] 08:00 — Generazione articolo giornaliero...');
      try { await generateDailyArticle(); }
      catch(e) { console.error('[Cron] Errore generazione:', e.message); }
    });
    console.log('[Cron] ✓ Schedulato articolo giornaliero alle 08:00 UTC');
  } catch(e) {
    console.log('[Cron] node-cron non disponibile — usa cron-job.org per chiamare POST /api/articles/generate');
  }
}


/* ═══════════════════════════════════════════════════════
   MIDDLEWARE AUTH
   ═══════════════════════════════════════════════════════ */
function requireAdmin(req, res, next) {
  const secret = req.headers['x-admin-secret'] || req.query.secret;
  if (secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Accesso non autorizzato. Usa header x-admin-secret.' });
  }
  next();
}


/* ═══════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════ */

app.get('/', (req, res) => res.json({
  status: 'ok', version: '7.1',
  groq:   GROQ_KEY   ? '✓' : '✗',
  gemini: GEMINI_KEY ? '✓' : '✗',
  articles: articlesStore.length,
}));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/ping',   (req, res) => res.json({ pong: Date.now() }));

// ── GET articoli (tutti, per il frontend) ─────────────────
app.get('/api/articles', (req, res) => {
  // Articoli ordinati: prima i non-seed (più recenti), poi i seed
  const sorted = [
    ...articlesStore.filter(a => !a.id.startsWith('seed')),
    ...articlesStore.filter(a =>  a.id.startsWith('seed')),
  ];
  res.json(sorted);
});

// ── POST genera articolo (cron-job.org o admin) ───────────
app.post('/api/articles/generate', requireAdmin, async (req, res) => {
  try {
    const article = await generateDailyArticle();
    res.json({ ok: true, article });
  } catch(e) {
    console.error('[Generate]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── POST aggiungi articolo manuale ────────────────────────
app.post('/api/articles', requireAdmin, (req, res) => {
  const { titolo_it, titolo_en, titolo_fr, categoria_it, testo_it, testo_en, testo_fr,
          immagine, autore, tipo } = req.body;
  if (!titolo_it || !testo_it) {
    return res.status(400).json({ error: 'titolo_it e testo_it obbligatori' });
  }
  const article = {
    id: 'manual-' + Date.now(),
    type: tipo || 'editorial',
    titolo_it, titolo_en: titolo_en || titolo_it,
    titolo_fr: titolo_fr || titolo_it,
    categoria_it: categoria_it || 'Magazine',
    categoria_en: 'Magazine', categoria_fr: 'Magazine',
    testo_it, testo_en: testo_en || testo_it, testo_fr: testo_fr || testo_it,
    immagine: immagine || ARTICLE_IMAGES[0],
    autore: autore || 'Sommelier World',
    data: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
    generato_ai: false,
  };
  articlesStore.unshift(article);
  saveArticles();
  console.log('[Articles] Aggiunto manualmente:', titolo_it);
  res.json({ ok: true, article });
});

// ── DELETE rimuovi articolo ───────────────────────────────
app.delete('/api/articles/:id', requireAdmin, (req, res) => {
  const id = req.params.id;
  const before = articlesStore.length;
  articlesStore = articlesStore.filter(a => a.id !== id);
  if (articlesStore.length === before) {
    return res.status(404).json({ error: 'Articolo non trovato' });
  }
  saveArticles();
  console.log('[Articles] Rimosso:', id);
  res.json({ ok: true, removed: id });
});

// ── AI chat principale ────────────────────────────────────
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  const system  = req.body.system || req.body.systemPrompt || '';
  const userMsg = req.body.userMsg || req.body.message || req.body.prompt || '';
  if (!userMsg && !system) return res.status(400).json({ error: 'Messaggio vuoto' });
  try {
    const text = await callAI(system, userMsg);
    res.json({ text, choices: [{ message: { content: text } }] });
  } catch(e) {
    console.error('[AI]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── Contatti ──────────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }
  console.log(`[CONTACT] ${name} <${email}> | ${subject || '—'}`);
  res.json({ ok: true });
});


/* ═══════════════════════════════════════════════════════
   START
   ═══════════════════════════════════════════════════════ */
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  🍷 SOMMELIER SERVER v7.1                    ║');
  console.log(`║  Porta: ${PORT}                                 ║`);
  console.log(`║  Groq:   ${GROQ_KEY   ? '✓ ATTIVO              ║' : '✗ mancante (aggiungi GROQ_API_KEY)║'}`);
  console.log(`║  Gemini: ${GEMINI_KEY ? '✓ attivo              ║' : '✗ mancante                       ║'}`);
  console.log(`║  Articoli: ${articlesStore.length} in memoria              ║`);
  console.log('╚══════════════════════════════════════════════╝\n');
  setupCron();
});
