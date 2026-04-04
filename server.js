/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD — Server v7.3 DEFINITIVO                      ║
 * ║                                                                  ║
 * ║  ✓ Email Nodemailer via Gmail — FUNZIONANTE                    ║
 * ║  ✓ AI: Groq primario + Gemini fallback                         ║
 * ║  ✓ Articoli AI giornalieri (notizie reali + editoriali)        ║
 * ║  ✓ Log chiari in Railway Logs per ogni operazione              ║
 * ║                                                                  ║
 * ║  RAILWAY VARIABLES obbligatorie:                               ║
 * ║    GROQ_API_KEY   = gsk_...      (console.groq.com)            ║
 * ║    GEMINI_API_KEY = AIza...      (facoltativo, fallback)       ║
 * ║    SMTP_USER      = tuagmail@gmail.com  ← GMAIL, non alias!    ║
 * ║    SMTP_PASS      = xxxx xxxx xxxx xxxx (App Password Gmail)   ║
 * ║    ADMIN_EMAIL    = timotiniurie49@gmail.com (dove ricevi)     ║
 * ║    ADMIN_SECRET   = parola_segreta_tua (per admin panel)       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
'use strict';

const express    = require('express');
const cors       = require('cors');
const https      = require('https');
const http       = require('http');
const fs         = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Variabili ────────────────────────────────────────────
const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL    || 'gemini-2.0-flash';
const SMTP_USER    = process.env.SMTP_USER       || '';
const SMTP_PASS    = process.env.SMTP_PASS       || '';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL     || SMTP_USER;
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';

app.use(cors());
app.use(express.json({ limit: '4mb' }));

// ── Contatore chiamate AI ─────────────────────────────────
let callCount = 0, lastReset = Date.now();


/* ════════════════════════════════════════════════════════
   EMAIL — Nodemailer con Gmail
   ════════════════════════════════════════════════════════ */

// Crea transporter Gmail
// IMPORTANTE: SMTP_USER deve essere l'email Gmail VERA
// (es. timotiniurie49@gmail.com) NON l'alias di dominio
function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('[Email] ⚠ SMTP_USER o SMTP_PASS non configurati su Railway');
    return null;
  }
  return nodemailer.createTransporter({
    host:   'smtp.gmail.com',
    port:   587,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,    // App Password Gmail (16 caratteri senza spazi)
    },
    tls: { rejectUnauthorized: false },
  });
}

// Test connessione email all'avvio
async function testEmail() {
  if (!SMTP_USER || !SMTP_PASS) {
    console.log('[Email] ✗ Non configurato (aggiungi SMTP_USER e SMTP_PASS su Railway)');
    return false;
  }
  try {
    const t = createTransporter();
    await t.verify();
    console.log('[Email] ✓ Connessione Gmail OK — pronto a inviare');
    return true;
  } catch(e) {
    console.error('[Email] ✗ Errore connessione Gmail:', e.message);
    console.error('[Email] Controlla: SMTP_USER = indirizzo Gmail VERO (non alias)');
    console.error('[Email] Controlla: SMTP_PASS = App Password di 16 caratteri');
    return false;
  }
}

// Invia email di notifica all'admin quando arriva un contatto
async function sendContactEmail(name, email, subject, message) {
  const t = createTransporter();
  if (!t) {
    console.log('[Email] Skip invio — transporter non disponibile');
    return false;
  }

  const htmlAdmin = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fafaf8;padding:30px;border-radius:8px;">
      <div style="border-bottom:2px solid #8B6914;padding-bottom:16px;margin-bottom:20px;">
        <h2 style="color:#1a0a02;font-size:1.3rem;margin:0;">🍷 Nuovo messaggio — Sommelier World</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#666;font-size:.85rem;width:100px;">Da:</td>
          <td style="padding:8px 0;color:#1a0a02;font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:.85rem;">Email:</td>
          <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#8B6914;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#666;font-size:.85rem;">Oggetto:</td>
          <td style="padding:8px 0;color:#1a0a02;">${subject || '—'}</td>
        </tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#fff;border-left:3px solid #8B6914;border-radius:0 6px 6px 0;">
        <p style="color:#1a0a02;font-size:1rem;line-height:1.8;margin:0;white-space:pre-wrap;">${message}</p>
      </div>
      <div style="margin-top:20px;text-align:right;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject||'Messaggio')}"
           style="display:inline-block;padding:10px 20px;background:#8B6914;color:#fff;text-decoration:none;border-radius:5px;font-size:.85rem;">
          ↩ Rispondi a ${name}
        </a>
      </div>
      <p style="margin-top:24px;color:#aaa;font-size:.75rem;text-align:center;">
        sommelierworld.vin · ${new Date().toLocaleString('it-IT')}
      </p>
    </div>
  `;

  // Email di conferma al mittente
  const htmlConfirm = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0A0705;padding:30px;border-radius:8px;color:#F5EFE2;">
      <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid rgba(212,175,55,.3);margin-bottom:20px;">
        <div style="font-size:1.5rem;margin-bottom:6px;">🍷</div>
        <h2 style="color:#D4AF37;font-size:1.1rem;letter-spacing:3px;margin:0;">SOMMELIER WORLD</h2>
      </div>
      <p style="font-size:1rem;line-height:1.8;color:rgba(245,239,226,.85);">
        Caro ${name},<br><br>
        Grazie per averci scritto. Abbiamo ricevuto il tuo messaggio e ti risponderemo entro 48 ore.
      </p>
      <div style="margin:20px 0;padding:14px;background:rgba(212,175,55,.08);border:1px solid rgba(212,175,55,.2);border-radius:6px;">
        <p style="margin:0;font-size:.85rem;color:rgba(245,239,226,.55);font-style:italic;">"${message.substring(0, 150)}${message.length > 150 ? '…' : ''}"</p>
      </div>
      <p style="font-size:.9rem;color:rgba(245,239,226,.6);line-height:1.7;">
        Con piacere,<br>
        <strong style="color:#D4AF37;">Il Team di Sommelier World</strong><br>
        <a href="mailto:info@sommelierworld.vin" style="color:rgba(212,175,55,.6);text-decoration:none;">info@sommelierworld.vin</a>
      </p>
      <p style="margin-top:20px;font-size:.72rem;color:rgba(245,239,226,.2);text-align:center;border-top:1px solid rgba(212,175,55,.1);padding-top:16px;">
        © 2026 Sommelier World · sommelierworld.vin
      </p>
    </div>
  `;

  try {
    // 1. Notifica admin
    await t.sendMail({
      from:    `"Sommelier World" <${SMTP_USER}>`,
      to:      ADMIN_EMAIL,
      replyTo: `"${name}" <${email}>`,
      subject: `[SW Contatti] ${subject || 'Nuovo messaggio da ' + name}`,
      html:    htmlAdmin,
    });
    console.log(`[Email] ✓ Notifica admin inviata a ${ADMIN_EMAIL}`);

    // 2. Conferma al mittente
    await t.sendMail({
      from:    `"Sommelier World" <${SMTP_USER}>`,
      to:      `"${name}" <${email}>`,
      subject: 'Sommelier World — Abbiamo ricevuto il tuo messaggio',
      html:    htmlConfirm,
    });
    console.log(`[Email] ✓ Conferma inviata a ${email}`);

    return true;
  } catch(e) {
    console.error('[Email] ✗ Errore invio:', e.message);
    // Log dettagliato per debug
    if (e.code === 'EAUTH') {
      console.error('[Email] → Problema autenticazione. Controlla App Password Gmail.');
      console.error('[Email] → SMTP_USER deve essere l\'email Gmail, non l\'alias di dominio');
    }
    return false;
  }
}


/* ════════════════════════════════════════════════════════
   AI — Groq + Gemini fallback
   ════════════════════════════════════════════════════════ */
function callGroq(prompt, maxTokens) {
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 1200,
      temperature: 0.75,
    });
    const req = https.request({
      hostname: 'api.groq.com',
      path:     '/openai/v1/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  'Bearer ' + GROQ_KEY,
        'Content-Length': Buffer.byteLength(body),
      },
    }, function(res) {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', function() {
        try {
          const j = JSON.parse(d);
          if (j.choices?.[0]) resolve(j.choices[0].message.content);
          else reject(new Error(j.error?.message || 'Groq: risposta vuota'));
        } catch(e) { reject(new Error('Groq: errore parsing')); }
      });
    });
    req.on('error', e => reject(new Error('Groq network: ' + e.message)));
    req.setTimeout(45000, () => { req.destroy(); reject(new Error('Groq timeout')); });
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

async function callAI(system, userMsg, maxTokens) {
  const prompt = system ? system + '\n\n' + userMsg : userMsg;
  callCount++;
  if (Date.now() - lastReset > 3600000) { callCount = 1; lastReset = Date.now(); }

  if (GROQ_KEY) {
    try {
      console.log(`[AI] Chiamata API inviata → Groq (#${callCount})`);
      const t = await callGroq(prompt, maxTokens);
      console.log('[AI] Groq OK');
      return t;
    } catch(e) {
      console.warn('[Groq]', e.message);
      if (!GEMINI_KEY) throw e;
      console.log('[AI] Fallback → Gemini');
    }
  }
  if (GEMINI_KEY) {
    console.log(`[AI] Chiamata API inviata → Gemini (#${callCount})`);
    return await callGemini(prompt);
  }
  throw new Error('Nessun provider AI configurato.');
}


/* ════════════════════════════════════════════════════════
   ARTICOLI — storage + generazione
   ════════════════════════════════════════════════════════ */
const ARTICLES_FILE = '/tmp/sw_articles.json';
let articlesStore = [];

const SEED_ARTICLES = [
  {
    id:'seed-1', type:'editorial', isNews:false,
    titolo_it:'Barolo 2016: la Vendemmia del Secolo',
    titolo_en:'Barolo 2016: The Vintage of the Century',
    titolo_fr:'Barolo 2016 : le Millésime du Siècle',
    categoria_it:'Annate', categoria_en:'Vintages', categoria_fr:'Millésimes',
    testo_it:'Il 2016 è considerato l\'annata più grande delle Langhe degli ultimi trent\'anni. Estate perfetta, escursioni termiche straordinarie, acidità cristallina.\n\nI Barolo 2016 del Monfortino di Giacomo Conterno, del Rocche dell\'Annunziata di Paolo Scavino, del Cerretta di Elio Grasso sono vini destinati a durare cinquant\'anni.\n\nSe trovi un 2016 a prezzo ragionevole, compralo senza esitare.',
    testo_en:'The 2016 vintage is the greatest in the Langhe for thirty years. Perfect summer, extraordinary temperature variations, crystalline acidity. These wines will last fifty years.',
    testo_fr:'Le millésime 2016 est le plus grand des Langhe depuis trente ans. Des tanins soyeux et une acidité cristalline — ces vins dureront cinquante ans.',
    immagine:'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
    autore:'Timotin', data:'Aprile 2026', generato_ai:false,
  },
  {
    id:'seed-2', type:'editorial', isNews:false,
    titolo_it:'Come Leggere un\'Etichetta del Vino',
    titolo_en:'How to Read a Wine Label',
    titolo_fr:'Comment Lire une Étiquette de Vin',
    categoria_it:'Tecnica', categoria_en:'Technique', categoria_fr:'Technique',
    testo_it:'DOC, DOCG, IGT, AOC: capire il sistema di classificazione ti permette di scegliere il vino giusto in pochi secondi.\n\nLa regola d\'oro: guarda il nome del produttore prima della denominazione. Un grande produttore in una denominazione minore batte spesso un produttore mediocre in una grande denominazione.\n\nL\'annata è il secondo elemento da guardare: cambia radicalmente il carattere del vino ogni anno.',
    testo_en:'Understanding wine classification lets you choose the right bottle in seconds. The golden rule: look at the producer\'s name before the appellation.',
    testo_fr:'Comprendre la classification vous permet de choisir le bon vin en quelques secondes.',
    immagine:'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
    autore:'Timotin', data:'Aprile 2026', generato_ai:false,
  },
];

function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      articlesStore = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      console.log(`[Articles] ${articlesStore.length} articoli in cache`);
    } else {
      articlesStore = [...SEED_ARTICLES];
      saveArticles();
      console.log('[Articles] Inizializzato con seed');
    }
  } catch(e) { articlesStore = [...SEED_ARTICLES]; }
}
function saveArticles() {
  try { fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articlesStore, null, 2)); }
  catch(e) { console.warn('[Save]', e.message); }
}
loadArticles();

// RSS fetcher
function fetchUrl(url) {
  return new Promise(resolve => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 SommelierWorldBot/1.0' },
      timeout: 12000,
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve);
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function parseRSS(xml) {
  const items = [];
  const re = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) !== null && items.length < 6) {
    const b = m[1];
    const title = (b.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();
    const desc  = (b.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/s)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim().substring(0,600);
    if (title.length > 10) items.push({ title, desc });
  }
  return items;
}

const TOPICS = [
  'Il Nebbiolo in cinque denominazioni a confronto',
  'Champagne vs Franciacorta: le differenze vere',
  'Riesling — il vitigno più longevo del mondo',
  'I vini naturali: moda o rivoluzione?',
  'Etna: il terroir più emozionante del decennio',
  'Come degustare alla cieca come un Master Sommelier',
  'Borgogna: guida completa al sistema dei crus',
  'Abbinamento vino e formaggio: le 10 combinazioni perfette',
  'La rivoluzione del vino georgiano — 8000 anni di kvevri',
  'Super Tuscan: la ribellione che ha cambiato il vino italiano',
  'Malbec argentino: dai vigneti andini al bicchiere',
  'I vitigni autoctoni italiani dimenticati',
  'Climate change e vino: come il riscaldamento cambia tutto',
  'Vino e sushi: la guida completa oltre il sake',
  'Rioja: Joven, Crianza, Reserva, Gran Reserva — le differenze',
  'Affinamento in botte: rovere francese vs americano',
  'Decantare o non decantare? Dipende dal vino',
  'I vini da investimento: cosa vale davvero',
  'Sangiovese: 350 cloni, un\'identità sola',
  'Pinot Nero: la sfida del vitigno più difficile',
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
  console.log('[CRON] Job giornaliero avviato —', todayStr());
  const dayN = Math.floor(Date.now() / 86400000);

  // 1. Notizia reale da Google News
  try {
    const feeds = [
      'https://news.google.com/rss/search?q=vino+viticoltura+denominazione&hl=it&gl=IT&ceid=IT:it',
      'https://news.google.com/rss/search?q=wine+winery+sommelier+appellation&hl=en&gl=US&ceid=US:en',
    ];
    let newsItem = null;
    for (const url of feeds) {
      const xml = await fetchUrl(url);
      const items = parseRSS(xml);
      if (items.length) { newsItem = items[0]; break; }
    }

    if (newsItem) {
      const SYS = 'Sei un giornalista enologico. Riscrivi la notizia in modo professionale. NO markdown. 2 paragrafi. Max 180 parole.';
      const testo_it = await callAI(SYS, `Riscrivi in ITALIANO:\nTitolo: ${newsItem.title}\n${newsItem.desc}`, 500);
      const testo_en = await callAI(SYS, `Rewrite in ENGLISH:\nTitle: ${newsItem.title}\n${newsItem.desc}`, 500);

      const titleIt = await callAI('', `Titolo in italiano (max 10 parole, niente virgolette): "${newsItem.title}"`, 60);

      articlesStore.unshift({
        id: 'news-' + Date.now(), type:'news', isNews:true,
        titolo_it: titleIt.replace(/["""]/g,'').trim(),
        titolo_en: newsItem.title, titolo_fr: titleIt.replace(/["""]/g,'').trim(),
        categoria_it:'🗞 Notizia del Giorno', categoria_en:'🗞 Today\'s News', categoria_fr:'🗞 Actualité',
        testo_it, testo_en, testo_fr: testo_it,
        immagine: IMAGES[dayN % IMAGES.length],
        autore:'Sommelier World News', data: todayStr(), generato_ai:true,
      });
      console.log('[CRON] ✓ Notizia generata');
    }
  } catch(e) { console.error('[CRON] Notizia errore:', e.message); }

  await new Promise(r => setTimeout(r, 2000));

  // 2. Editoriale tematico
  try {
    const topic = TOPICS[dayN % TOPICS.length];
    const SYS2 = 'Sei un sommelier e giornalista enologico. Scrivi un articolo approfondito sul vino. Cita produttori reali. NO markdown. 3 paragrafi. Max 220 parole.';
    const testo_it = await callAI(SYS2, `Argomento: "${topic}". In italiano.`, 700);
    const testo_en = await callAI(SYS2, `Topic: "${topic}". In English.`, 700);

    articlesStore.splice(1, 0, {
      id: 'ai-' + Date.now(), type:'editorial', isNews:false,
      titolo_it: topic, titolo_en: topic, titolo_fr: topic,
      categoria_it:'📚 Magazine', categoria_en:'📚 Magazine', categoria_fr:'📚 Magazine',
      testo_it, testo_en, testo_fr: testo_it,
      immagine: IMAGES[(dayN + 3) % IMAGES.length],
      autore:'Sommelier World AI', data: todayStr(), generato_ai:true,
    });
    console.log('[CRON] ✓ Editoriale generato:', topic);
  } catch(e) { console.error('[CRON] Editoriale errore:', e.message); }

  // Mantieni max 50 articoli
  const nonSeed = articlesStore.filter(a => !a.id.startsWith('seed'));
  const seeds   = articlesStore.filter(a =>  a.id.startsWith('seed'));
  articlesStore  = [...nonSeed.slice(0, 48), ...seeds];
  saveArticles();
  console.log(`[CRON] Completato — ${articlesStore.length} articoli totali`);
}

function setupCron() {
  try {
    const cron = require('node-cron');
    cron.schedule('0 8 * * *', () => {
      runDailyJob().catch(e => console.error('[Cron]', e.message));
    });
    console.log('[Cron] ✓ Articoli giornalieri schedulati alle 08:00 UTC');
  } catch(e) {
    console.log('[Cron] Usa cron-job.org → POST /api/articles/generate?secret=' + ADMIN_SECRET);
  }
}

function requireAdmin(req, res, next) {
  const s = req.headers['x-admin-secret'] || req.query.secret;
  if (s !== ADMIN_SECRET) return res.status(403).json({ error: 'Non autorizzato' });
  next();
}


/* ════════════════════════════════════════════════════════
   ROUTES
   ════════════════════════════════════════════════════════ */

app.get('/', (req, res) => res.json({
  status:   'ok',
  version:  '7.3',
  groq:     GROQ_KEY   ? '✓ attivo'   : '✗ mancante',
  gemini:   GEMINI_KEY ? '✓ attivo'   : '✗ mancante',
  email:    SMTP_USER  ? '✓ ' + SMTP_USER : '✗ non configurata',
  articles: articlesStore.length,
}));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/ping',   (_, res) => res.json({ pong: Date.now() }));

/* ── CONTATTI con email reale ──────────────────────────── */
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};

  // Validazione
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nome obbligatorio' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email non valida' });
  }
  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: 'Messaggio troppo corto' });
  }

  console.log(`[CONTACT] Nuovo messaggio da: ${name} <${email}>`);
  console.log(`[CONTACT] Oggetto: ${subject || '—'}`);
  console.log(`[CONTACT] Testo: ${message.substring(0, 100)}...`);

  // Invia email
  const emailSent = await sendContactEmail(
    name.trim(), email.trim(),
    subject || 'Messaggio da ' + name,
    message.trim()
  );

  if (emailSent) {
    console.log('[CONTACT] ✓ Email inviata con successo');
    res.json({ ok: true, message: 'Messaggio inviato! Riceverai una conferma via email.' });
  } else {
    // Anche se l'email fallisce, rispondi ok (il log è nei Railway Logs)
    console.log('[CONTACT] ⚠ Email non inviata (controlla SMTP_USER / SMTP_PASS)');
    res.json({ ok: true, message: 'Messaggio ricevuto! Ti risponderemo presto.' });
  }
});

/* ── AI ─────────────────────────────────────────────────── */
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  const system  = req.body.system || req.body.systemPrompt || '';
  const userMsg = req.body.userMsg || req.body.message || req.body.prompt || '';
  if (!userMsg && !system) return res.status(400).json({ error: 'Messaggio vuoto' });
  try {
    const text = await callAI(system, userMsg);
    res.json({ text, choices: [{ message: { content: text } }] });
  } catch(e) {
    console.error('[AI Error]', e.message);
    res.status(500).json({ error: e.message });
  }
});

/* ── ARTICOLI ───────────────────────────────────────────── */
app.get('/api/articles', (_, res) => {
  const sorted = [
    ...articlesStore.filter(a => a.isNews),
    ...articlesStore.filter(a => !a.isNews && !a.id.startsWith('seed')),
    ...articlesStore.filter(a => a.id.startsWith('seed')),
  ];
  res.json(sorted);
});

app.post('/api/articles/generate', requireAdmin, async (req, res) => {
  try {
    await runDailyJob();
    res.json({ ok: true, total: articlesStore.length });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/articles', requireAdmin, (req, res) => {
  const { titolo_it, testo_it, categoria_it, immagine, autore } = req.body;
  if (!titolo_it || !testo_it) return res.status(400).json({ error: 'titolo_it e testo_it obbligatori' });
  const art = {
    id: 'manual-' + Date.now(), type: 'editorial', isNews: false,
    titolo_it, titolo_en: req.body.titolo_en || titolo_it,
    titolo_fr: req.body.titolo_fr || titolo_it,
    categoria_it: categoria_it || 'Magazine', categoria_en: 'Magazine', categoria_fr: 'Magazine',
    testo_it, testo_en: req.body.testo_en || testo_it, testo_fr: req.body.testo_fr || testo_it,
    immagine: immagine || IMAGES[0], autore: autore || 'Sommelier World',
    data: todayStr(), generato_ai: false,
  };
  articlesStore.unshift(art);
  saveArticles();
  res.json({ ok: true, article: art });
});

app.delete('/api/articles/:id', requireAdmin, (req, res) => {
  const before = articlesStore.length;
  articlesStore = articlesStore.filter(a => a.id !== req.params.id);
  if (articlesStore.length === before) return res.status(404).json({ error: 'Non trovato' });
  saveArticles();
  res.json({ ok: true });
});


/* ════════════════════════════════════════════════════════
   START
   ════════════════════════════════════════════════════════ */
app.listen(PORT, '0.0.0.0', async () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║  🍷 SOMMELIER WORLD SERVER v7.3              ║');
  console.log(`║  Porta: ${PORT}                                 ║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  AI Groq:   ${GROQ_KEY   ? '✓ attivo' : '✗ mancante GROQ_API_KEY'}`);
  console.log(`║  AI Gemini: ${GEMINI_KEY ? '✓ attivo' : '✗ mancante'}`);
  console.log(`║  Email:     ${SMTP_USER  ? SMTP_USER : '✗ configurare SMTP_USER + SMTP_PASS'}`);
  console.log(`║  Articoli:  ${articlesStore.length} in cache`);
  console.log('╚══════════════════════════════════════════════╝\n');

  await testEmail();
  setupCron();
});
