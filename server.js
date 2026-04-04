/**
 * SOMMELIER WORLD — Server v7.4 STABILE
 * ✓ Non crasha mai — tutte le dipendenze opzionali
 * ✓ Groq primario + Gemini fallback
 * ✓ Email Nodemailer Gmail
 * ✓ Articoli AI giornalieri
 *
 * RAILWAY VARIABLES:
 *   GROQ_API_KEY   = gsk_...
 *   GEMINI_API_KEY = AIza...
 *   GEMINI_MODEL   = gemini-2.0-flash
 *   SMTP_USER      = tuagmail@gmail.com   ← Gmail vero, non alias
 *   SMTP_PASS      = xxxx xxxx xxxx xxxx  ← App Password Gmail
 *   ADMIN_EMAIL    = timotiniurie49@gmail.com
 *   ADMIN_SECRET   = parola_segreta
 */
'use strict';

// ── Import sicuri ─────────────────────────────────────────
const express = require('express');
const cors    = require('cors');
const https   = require('https');
const http    = require('http');
const fs      = require('fs');

// Dipendenze opzionali — non crashano se mancano
let nodemailer = null;
try { nodemailer = require('nodemailer'); } catch(e) {
  console.warn('[Boot] nodemailer non disponibile — email disabilitata');
}

let nodeCron = null;
try { nodeCron = require('node-cron'); } catch(e) {
  console.warn('[Boot] node-cron non disponibile — cron disabilitato');
}

let GoogleGenerativeAI = null;
try { GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI; } catch(e) {
  console.warn('[Boot] @google/generative-ai non disponibile');
}

try { require('dotenv').config(); } catch(e) {}

// ── Config ────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 8080;

const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL    || 'gemini-2.0-flash';
const SMTP_USER    = process.env.SMTP_USER       || '';
const SMTP_PASS    = process.env.SMTP_PASS       || '';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL     || SMTP_USER;
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';

app.use(cors());
app.use(express.json({ limit: '4mb' }));

let callCount = 0;
let lastReset = Date.now();


/* ═══════════════════════════════════════════════════════
   EMAIL
   ═══════════════════════════════════════════════════════ */
function getTransporter() {
  if (!nodemailer || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com', port: 587, secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
}

async function sendContactEmail(name, email, subject, message) {
  const t = getTransporter();
  if (!t) {
    console.log('[Email] Non configurata — log: ' + name + ' <' + email + '>');
    return false;
  }
  try {
    // Email all'admin
    await t.sendMail({
      from:    '"Sommelier World" <' + SMTP_USER + '>',
      to:      ADMIN_EMAIL,
      replyTo: '"' + name + '" <' + email + '>',
      subject: '[SW] ' + (subject || 'Messaggio da ' + name),
      html: [
        '<div style="font-family:Georgia,serif;max-width:580px;padding:24px;background:#fafaf8;border-radius:8px;">',
        '<h2 style="color:#1a0a02;border-bottom:2px solid #8B6914;padding-bottom:12px;margin-bottom:18px;">',
        '🍷 Nuovo messaggio — Sommelier World</h2>',
        '<p><strong>Da:</strong> ' + name + '</p>',
        '<p><strong>Email:</strong> <a href="mailto:' + email + '">' + email + '</a></p>',
        '<p><strong>Oggetto:</strong> ' + (subject || '—') + '</p>',
        '<div style="margin-top:16px;padding:14px;background:#fff;border-left:3px solid #8B6914;">',
        '<p style="white-space:pre-wrap;margin:0;">' + message + '</p></div>',
        '<p style="margin-top:18px;"><a href="mailto:' + email + '?subject=Re: ' + encodeURIComponent(subject || '') + '"',
        ' style="background:#8B6914;color:#fff;padding:10px 18px;text-decoration:none;border-radius:5px;">',
        '↩ Rispondi a ' + name + '</a></p>',
        '<p style="color:#aaa;font-size:.75rem;margin-top:20px;">',
        new Date().toLocaleString('it-IT') + ' · sommelierworld.vin</p>',
        '</div>'
      ].join(''),
    });
    console.log('[Email] ✓ Notifica admin inviata a ' + ADMIN_EMAIL);

    // Conferma al mittente
    await t.sendMail({
      from:    '"Sommelier World" <' + SMTP_USER + '>',
      to:      '"' + name + '" <' + email + '>',
      subject: 'Sommelier World — Messaggio ricevuto',
      html: [
        '<div style="font-family:Georgia,serif;max-width:580px;padding:24px;background:#0A0705;border-radius:8px;color:#F5EFE2;">',
        '<div style="text-align:center;padding-bottom:18px;border-bottom:1px solid rgba(212,175,55,.3);margin-bottom:18px;">',
        '<div style="font-size:1.4rem;">🍷</div>',
        '<h2 style="color:#D4AF37;font-size:1rem;letter-spacing:3px;margin:8px 0 0;">SOMMELIER WORLD</h2></div>',
        '<p style="line-height:1.8;">Caro ' + name + ',<br><br>',
        'Grazie per averci scritto. Abbiamo ricevuto il tuo messaggio e ti risponderemo entro 48 ore.</p>',
        '<div style="margin:18px 0;padding:12px;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);border-radius:6px;">',
        '<p style="font-style:italic;color:rgba(245,239,226,.6);margin:0;font-size:.9rem;">',
        '"' + message.substring(0, 120) + (message.length > 120 ? '…' : '') + '"</p></div>',
        '<p style="color:rgba(245,239,226,.6);font-size:.9rem;">Il Team di Sommelier World<br>',
        '<a href="mailto:info@sommelierworld.vin" style="color:rgba(212,175,55,.6);">info@sommelierworld.vin</a></p>',
        '<p style="font-size:.7rem;color:rgba(245,239,226,.2);margin-top:18px;border-top:1px solid rgba(212,175,55,.1);padding-top:14px;text-align:center;">',
        '© 2026 Sommelier World · sommelierworld.vin</p></div>'
      ].join(''),
    });
    console.log('[Email] ✓ Conferma inviata a ' + email);
    return true;

  } catch(e) {
    console.error('[Email] ✗ Errore:', e.message);
    if (e.code === 'EAUTH') {
      console.error('[Email] → SMTP_USER deve essere email Gmail vera (non alias di dominio)');
      console.error('[Email] → SMTP_PASS deve essere App Password Gmail (16 chars)');
    }
    return false;
  }
}


/* ═══════════════════════════════════════════════════════
   AI — Groq + Gemini
   ═══════════════════════════════════════════════════════ */
function callGroq(prompt, maxTokens) {
  return new Promise(function(resolve, reject) {
    if (!GROQ_KEY) return reject(new Error('GROQ_API_KEY mancante'));
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 1200, temperature: 0.75,
    });
    const req = https.request({
      hostname: 'api.groq.com', path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Length': Buffer.byteLength(body),
      }
    }, function(res) {
      let d = ''; res.on('data', c => d += c);
      res.on('end', function() {
        try {
          const j = JSON.parse(d);
          if (j.choices && j.choices[0]) resolve(j.choices[0].message.content);
          else reject(new Error((j.error && j.error.message) || 'Groq: risposta vuota'));
        } catch(e) { reject(new Error('Groq: parsing error')); }
      });
    });
    req.on('error', e => reject(new Error('Groq network: ' + e.message)));
    req.setTimeout(45000, function() { req.destroy(); reject(new Error('Groq timeout')); });
    req.write(body); req.end();
  });
}

async function callGemini(prompt) {
  if (!GoogleGenerativeAI || !GEMINI_KEY) throw new Error('Gemini non configurato');
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callAI(system, userMsg, maxTokens) {
  const prompt = system ? system + '\n\n' + userMsg : userMsg;
  callCount++;
  if (Date.now() - lastReset > 3600000) { callCount = 1; lastReset = Date.now(); }

  if (GROQ_KEY) {
    try {
      console.log('[AI] Chiamata API inviata → Groq (#' + callCount + ')');
      const text = await callGroq(prompt, maxTokens);
      console.log('[AI] Groq OK — ' + text.length + ' chars');
      return text;
    } catch(e) {
      console.warn('[Groq] Errore:', e.message);
      if (!GEMINI_KEY) throw e;
      console.log('[AI] Fallback → Gemini');
    }
  }

  if (GEMINI_KEY) {
    console.log('[AI] Chiamata API inviata → Gemini (#' + callCount + ')');
    const text = await callGemini(prompt);
    console.log('[AI] Gemini OK');
    return text;
  }

  throw new Error('Nessun provider AI. Aggiungi GROQ_API_KEY su Railway → Variables.');
}


/* ═══════════════════════════════════════════════════════
   ARTICOLI
   ═══════════════════════════════════════════════════════ */
const ARTICLES_FILE = '/tmp/sw_articles.json';
let articlesStore = [];

const SEED_ARTICLES = [
  {
    id: 'seed-1', type: 'editorial', isNews: false,
    titolo_it: 'Barolo 2016: la Vendemmia del Secolo',
    titolo_en: 'Barolo 2016: The Vintage of the Century',
    titolo_fr: 'Barolo 2016 : le Millésime du Siècle',
    categoria_it: 'Annate', categoria_en: 'Vintages', categoria_fr: 'Millésimes',
    testo_it: 'Il 2016 è considerato l\'annata più grande delle Langhe degli ultimi trent\'anni. Estate perfetta, escursioni termiche straordinarie, acidità cristallina.\n\nI Barolo 2016 — il Monfortino di Giacomo Conterno, il Rocche dell\'Annunziata di Paolo Scavino, il Cerretta di Elio Grasso — sono capolavori destinati a durare cinquant\'anni.\n\nSe ne trovi ancora in vendita a prezzo ragionevole, compralo senza esitare.',
    testo_en: 'The 2016 vintage is the greatest in the Langhe for thirty years. Perfect summer, extraordinary temperature variations, crystalline acidity. These wines will last fifty years.',
    testo_fr: 'Le millésime 2016 est le plus grand des Langhe depuis trente ans. Tanins soyeux, acidité cristalline — ces vins dureront cinquante ans.',
    immagine: 'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
    autore: 'Timotin', data: 'Aprile 2026', generato_ai: false,
  },
  {
    id: 'seed-2', type: 'editorial', isNews: false,
    titolo_it: 'Come Leggere un\'Etichetta del Vino',
    titolo_en: 'How to Read a Wine Label',
    titolo_fr: 'Comment Lire une Étiquette de Vin',
    categoria_it: 'Tecnica', categoria_en: 'Technique', categoria_fr: 'Technique',
    testo_it: 'DOC, DOCG, IGT, AOC: capire il sistema di classificazione ti permette di scegliere il vino giusto in pochi secondi. Il disciplinare è il regolamento di ogni denominazione.\n\nLa regola d\'oro dei professionisti: guarda il nome del produttore prima della denominazione. Un grande produttore in una zona minore batte spesso un mediocre in una zona famosa.\n\nL\'annata è il secondo elemento da guardare: cambia radicalmente il carattere del vino ogni anno.',
    testo_en: 'Understanding wine classification lets you choose correctly in seconds. The golden rule: look at the producer\'s name before the appellation.',
    testo_fr: 'Comprendre la classification vous permet de choisir correctement en quelques secondes.',
    immagine: 'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
    autore: 'Timotin', data: 'Aprile 2026', generato_ai: false,
  },
  {
    id: 'seed-3', type: 'editorial', isNews: false,
    titolo_it: 'Etna: il Vulcano che ha Cambiato il Vino Italiano',
    titolo_en: 'Etna: The Volcano that Changed Italian Wine',
    titolo_fr: 'L\'Etna : le Volcan qui a Changé le Vin Italien',
    categoria_it: 'Terroir', categoria_en: 'Terroir', categoria_fr: 'Terroir',
    testo_it: 'In pochi anni l\'Etna è diventato il terroir più discusso e desiderato del vino mondiale. Le 133 contrade — come i crus di Borgogna — identificano vigneti centenari ad alberello su sabbie laviche tra i 400 e i 1000 metri.\n\nIl Nerello Mascalese produce rossi trasparenti e profumati che ricordano più il Pinot Nero di Vosne-Romanée che i rossi siciliani tradizionali. Cornelissen, Terre Nere, Benanti, Passopisciaro: i nomi da conoscere.\n\nChi compra Etna oggi sta comprando il futuro del vino italiano.',
    testo_en: 'Etna has become the world\'s most talked-about wine terroir. Its 133 contrade — like Burgundy\'s crus — identify century-old alberello vines on volcanic soils between 400 and 1000 metres.',
    testo_fr: 'L\'Etna est devenu le terroir le plus discuté du monde du vin. Ses 133 contrade identifient des vignes centenaires sur des sols volcaniques entre 400 et 1000 mètres.',
    immagine: 'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&w=900',
    autore: 'Timotin', data: 'Marzo 2026', generato_ai: false,
  },
];

function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      articlesStore = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      // Assicura che i seed siano sempre presenti
      SEED_ARTICLES.forEach(function(seed) {
        if (!articlesStore.find(a => a.id === seed.id)) {
          articlesStore.push(seed);
        }
      });
      console.log('[Articles] ' + articlesStore.length + ' articoli caricati');
    } else {
      articlesStore = [...SEED_ARTICLES];
      saveArticles();
      console.log('[Articles] Inizializzato con ' + SEED_ARTICLES.length + ' seed');
    }
  } catch(e) {
    console.warn('[Articles] Errore caricamento, uso seed:', e.message);
    articlesStore = [...SEED_ARTICLES];
  }
}

function saveArticles() {
  try { fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articlesStore, null, 2)); }
  catch(e) { console.warn('[Save]', e.message); }
}

loadArticles();

// Fetch URL con timeout
function fetchUrl(url) {
  return new Promise(function(resolve) {
    try {
      const proto = url.startsWith('https') ? https : http;
      const req = proto.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 SommelierWorldBot/1.0' },
        timeout: 12000,
      }, function(res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location).then(resolve);
        }
        let d = '';
        res.on('data', c => { if (d.length < 50000) d += c; });
        res.on('end', () => resolve(d));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch(e) { resolve(''); }
  });
}

function parseRSS(xml) {
  const items = [];
  const re = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < 5) {
    const b = m[1];
    const title = (b.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s) || [])[1] || '';
    const desc  = (b.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/s) || [])[1] || '';
    const clean = function(s) {
      return s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
    };
    const t = clean(title);
    if (t.length > 10) items.push({ title: t, desc: clean(desc).substring(0, 500) });
  }
  return items;
}

const TOPICS = [
  'Il Nebbiolo in cinque denominazioni a confronto',
  'Champagne vs Franciacorta: le differenze vere',
  'Riesling — il vitigno più longevo del mondo',
  'I vini naturali: moda o rivoluzione?',
  'Borgogna: guida completa al sistema dei crus',
  'Abbinamento vino e formaggio: le 10 combinazioni perfette',
  'Super Tuscan: la ribellione che ha cambiato il vino italiano',
  'Malbec argentino: dai vigneti andini al bicchiere',
  'La rivoluzione del vino georgiano — 8000 anni di kvevri',
  'Degustazione alla cieca: metodo e segreti dei Master Sommelier',
  'Temperatura di servizio: la verità che nessuno ti dice',
  'Decantare o non decantare? Dipende dal vino e dall\'annata',
  'Sangiovese: 350 cloni, un\'identità sola',
  'Pinot Nero: la sfida del vitigno più difficile da coltivare',
  'Climate change e vino: come cambia il paesaggio viticolo mondiale',
  'I grandi bianchi italiani: da Vermentino a Fiano di Avellino',
  'Rioja: Joven, Crianza, Reserva, Gran Reserva — le differenze',
  'Affinamento in botte: rovere francese vs americano vs slavonia',
  'Vino e sushi: la guida completa oltre il sake',
  'Le aste del vino: cosa vale di più e perché',
];

const IMAGES = [
  'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/2664149/pexels-photo-2664149.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&w=900',
];

function todayStr() {
  return new Date().toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' });
}

async function runDailyJob() {
  console.log('\n[CRON] ═══ Job giornaliero: ' + todayStr() + ' ═══');
  const dayN = Math.floor(Date.now() / 86400000);

  // 1. Prova a prendere una notizia reale
  let newsAdded = false;
  const newsFeeds = [
    'https://news.google.com/rss/search?q=vino+viticoltura+denominazione&hl=it&gl=IT&ceid=IT:it',
    'https://news.google.com/rss/search?q=wine+winery+sommelier+vintage&hl=en&gl=US&ceid=US:en',
  ];
  for (const url of newsFeeds) {
    try {
      const xml = await fetchUrl(url);
      const items = parseRSS(xml);
      if (!items.length) continue;
      const item = items[Math.floor(Math.random() * Math.min(3, items.length))];

      const testo_it = await callAI(
        'Sei un giornalista enologico. Riscrivi in italiano professionale. NO markdown. 2 paragrafi. Max 180 parole.',
        'Notizia: ' + item.title + '\n' + item.desc, 500
      );
      const titleIt = await callAI('', 'Titolo italiano (max 9 parole, niente virgolette): "' + item.title + '"', 50);

      articlesStore.unshift({
        id: 'news-' + Date.now(), type:'news', isNews:true,
        titolo_it: titleIt.replace(/["""]/g,'').trim(),
        titolo_en: item.title, titolo_fr: titleIt.replace(/["""]/g,'').trim(),
        categoria_it:'🗞 Notizia', categoria_en:'🗞 News', categoria_fr:'🗞 Actualité',
        testo_it, testo_en: item.desc, testo_fr: testo_it,
        immagine: IMAGES[dayN % IMAGES.length],
        autore:'Sommelier World News', data: todayStr(), generato_ai:true,
      });
      console.log('[CRON] ✓ Notizia: ' + titleIt.trim());
      newsAdded = true;
      break;
    } catch(e) { console.warn('[CRON] Notizia errore:', e.message); }
  }

  await new Promise(r => setTimeout(r, 2000));

  // 2. Editoriale tematico
  try {
    const topic = TOPICS[dayN % TOPICS.length];
    const testo_it = await callAI(
      'Sei un sommelier e giornalista. Scrivi un articolo sul vino. Cita produttori reali. NO markdown. 3 paragrafi. Max 220 parole.',
      'Argomento: "' + topic + '". In italiano.', 700
    );
    const testo_en = await callAI(
      'You are a wine journalist. Write a wine article. Cite real producers. NO markdown. 3 paragraphs. Max 220 words.',
      'Topic: "' + topic + '". In English.', 700
    );

    articlesStore.splice(newsAdded ? 1 : 0, 0, {
      id: 'ai-' + Date.now(), type:'editorial', isNews:false,
      titolo_it: topic, titolo_en: topic, titolo_fr: topic,
      categoria_it:'📚 Magazine', categoria_en:'📚 Magazine', categoria_fr:'📚 Magazine',
      testo_it, testo_en, testo_fr: testo_it,
      immagine: IMAGES[(dayN + 3) % IMAGES.length],
      autore:'Sommelier World AI', data: todayStr(), generato_ai:true,
    });
    console.log('[CRON] ✓ Editoriale: ' + topic);
  } catch(e) { console.error('[CRON] Editoriale errore:', e.message); }

  // Mantieni max 50 articoli (seed sempre in fondo)
  const nonSeed = articlesStore.filter(a => !a.id.startsWith('seed'));
  const seeds   = articlesStore.filter(a =>  a.id.startsWith('seed'));
  articlesStore  = [...nonSeed.slice(0, 47), ...seeds];
  saveArticles();
  console.log('[CRON] Totale articoli: ' + articlesStore.length + '\n');
}

function setupCron() {
  if (!nodeCron) {
    console.log('[Cron] Non disponibile — usa cron-job.org per chiamare POST /api/articles/generate');
    return;
  }
  nodeCron.schedule('0 8 * * *', function() {
    runDailyJob().catch(e => console.error('[Cron]', e.message));
  });
  console.log('[Cron] ✓ Job schedulato alle 08:00 UTC');
}

function requireAdmin(req, res, next) {
  const s = req.headers['x-admin-secret'] || req.query.secret;
  if (s !== ADMIN_SECRET) return res.status(403).json({ error: 'Non autorizzato' });
  next();
}


/* ═══════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════ */

app.get('/', function(req, res) {
  res.json({
    status:   'ok',
    version:  '7.4',
    groq:     GROQ_KEY    ? '✓ attivo' : '✗ mancante GROQ_API_KEY',
    gemini:   GEMINI_KEY  ? '✓ attivo' : '✗ mancante',
    email:    SMTP_USER   ? '✓ ' + SMTP_USER : '✗ non configurata',
    articles: articlesStore.length,
    cron:     nodeCron    ? '✓ 08:00 UTC' : '✗ non disponibile',
  });
});

app.get('/api/health', function(_, res) { res.json({ ok: true }); });
app.get('/api/ping',   function(_, res) { res.json({ pong: Date.now() }); });

// ── CONTATTI ─────────────────────────────────────────────
app.post('/api/contact', async function(req, res) {
  const body = req.body || {};
  const name    = (body.name    || '').trim();
  const email   = (body.email   || '').trim();
  const subject = (body.subject || '').trim();
  const message = (body.message || '').trim();

  if (!name)              return res.status(400).json({ error: 'Nome obbligatorio' });
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email non valida' });
  if (message.length < 4) return res.status(400).json({ error: 'Messaggio troppo corto' });

  console.log('[CONTACT] ' + name + ' <' + email + '> — ' + (subject || '—'));

  const sent = await sendContactEmail(name, email, subject, message);
  res.json({
    ok: true,
    message: sent
      ? 'Messaggio inviato! Riceverai una conferma via email.'
      : 'Messaggio ricevuto! Ti risponderemo entro 48 ore.',
  });
});

// ── AI ─────────────────────────────────────────────────
app.post(['/api/chat', '/api/groq', '/api/gemini'], async function(req, res) {
  const system  = req.body.system  || req.body.systemPrompt || '';
  const userMsg = req.body.userMsg || req.body.message      || req.body.prompt || '';
  if (!userMsg && !system) return res.status(400).json({ error: 'Messaggio vuoto' });
  try {
    const text = await callAI(system, userMsg);
    res.json({ text: text, choices: [{ message: { content: text } }] });
  } catch(e) {
    console.error('[AI Error]', e.message);
    let msg = e.message;
    if (msg.includes('429') || msg.includes('quota')) msg = 'Quota AI esaurita. Riprova tra qualche ora.';
    if (msg.includes('mancante'))                      msg = 'Servizio AI non configurato. Aggiungi GROQ_API_KEY su Railway.';
    res.status(500).json({ error: msg });
  }
});

// ── ARTICOLI ───────────────────────────────────────────
app.get('/api/articles', function(_, res) {
  const sorted = [
    ...articlesStore.filter(a => a.isNews),
    ...articlesStore.filter(a => !a.isNews && !a.id.startsWith('seed')),
    ...articlesStore.filter(a => a.id.startsWith('seed')),
  ];
  res.json(sorted);
});

app.post('/api/articles/generate', requireAdmin, async function(req, res) {
  try {
    await runDailyJob();
    res.json({ ok: true, total: articlesStore.length });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/articles', requireAdmin, function(req, res) {
  const b = req.body || {};
  if (!b.titolo_it || !b.testo_it) {
    return res.status(400).json({ error: 'titolo_it e testo_it obbligatori' });
  }
  const art = {
    id: 'manual-' + Date.now(), type: 'editorial', isNews: !!b.isNews,
    titolo_it: b.titolo_it, titolo_en: b.titolo_en || b.titolo_it,
    titolo_fr: b.titolo_fr || b.titolo_it,
    categoria_it: b.categoria_it || 'Magazine', categoria_en: 'Magazine', categoria_fr: 'Magazine',
    testo_it: b.testo_it, testo_en: b.testo_en || b.testo_it, testo_fr: b.testo_fr || b.testo_it,
    immagine: b.immagine || IMAGES[0], autore: b.autore || 'Sommelier World',
    data: todayStr(), generato_ai: false,
  };
  articlesStore.unshift(art);
  saveArticles();
  console.log('[Articles] Aggiunto manuale:', art.titolo_it);
  res.json({ ok: true, article: art });
});

app.delete('/api/articles/:id', requireAdmin, function(req, res) {
  const before = articlesStore.length;
  articlesStore = articlesStore.filter(a => a.id !== req.params.id);
  if (articlesStore.length === before) return res.status(404).json({ error: 'Non trovato' });
  saveArticles();
  res.json({ ok: true });
});


/* ═══════════════════════════════════════════════════════
   START
   ═══════════════════════════════════════════════════════ */
app.listen(PORT, '0.0.0.0', function() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  🍷 SOMMELIER WORLD v7.4                 ║');
  console.log('║  Porta: ' + PORT + '                           ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log('║  Groq:    ' + (GROQ_KEY   ? '✓ attivo       ' : '✗ GROQ_API_KEY mancante'));
  console.log('║  Gemini:  ' + (GEMINI_KEY ? '✓ attivo       ' : '✗ mancante     '));
  console.log('║  Email:   ' + (SMTP_USER  ? '✓ ' + SMTP_USER : '✗ SMTP non configurato'));
  console.log('║  Articoli:  ' + articlesStore.length + ' in cache');
  console.log('╚══════════════════════════════════════════╝\n');
  setupCron();
});
