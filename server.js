/**
 * ╔════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD — Server v6.0                                ║
 * ║                                                                ║
 * ║  Multi-provider AI: Gemini (priorità) + Groq (fallback)       ║
 * ║  Cambia provider senza toccare il frontend — basta Railway     ║
 * ║  Variables:                                                    ║
 * ║    GEMINI_API_KEY  = AIza...  (Google AI Studio)              ║
 * ║    GROQ_API_KEY    = gsk_...  (console.groq.com)              ║
 * ║    AI_PROVIDER     = gemini | groq | auto (default: auto)     ║
 * ║    SMTP_USER       = info@sommelierworld.vin (Gmail)          ║
 * ║    SMTP_PASS       = password-app-gmail-16-caratteri          ║
 * ║    ADMIN_EMAIL     = tua@email.com  (dove ricevi messaggi)    ║
 * ╚════════════════════════════════════════════════════════════════╝
 */

'use strict';

const express    = require('express');
const cors       = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

/* ── CORS ───────────────────────────────────────────────────── */
app.use(cors({
  origin: [
    'https://sommelierworld.vin',
    'https://www.sommelierworld.vin',
    'https://timotiniurie49-cpu.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ],
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

/* ── AI PROVIDER SETUP ──────────────────────────────────────── */
/*
 * AI_PROVIDER = "auto"   → usa Gemini se c'è la chiave, altrimenti Groq
 * AI_PROVIDER = "gemini" → forza sempre Gemini
 * AI_PROVIDER = "groq"   → forza sempre Groq
 *
 * Per cambiare provider: vai su Railway → Variables → AI_PROVIDER → salva.
 * Zero modifiche al codice.
 */

const PROVIDER = (process.env.AI_PROVIDER || 'auto').toLowerCase();

// Gemini
let geminiModel = null;
if (process.env.GEMINI_API_KEY) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✓ Gemini pronto');
  } catch(e) {
    console.warn('⚠ Gemini non disponibile:', e.message);
  }
}

// Groq
let groqClient = null;
if (process.env.GROQ_API_KEY) {
  try {
    const Groq = require('groq-sdk');
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✓ Groq pronto');
  } catch(e) {
    console.warn('⚠ Groq non disponibile:', e.message);
  }
}

/* Scegli quale provider usare per questa richiesta */
function pickProvider() {
  if (PROVIDER === 'gemini') return geminiModel ? 'gemini' : null;
  if (PROVIDER === 'groq')   return groqClient  ? 'groq'   : null;
  // auto: Gemini prima, Groq come fallback
  if (geminiModel) return 'gemini';
  if (groqClient)  return 'groq';
  return null;
}

/* Chiamata unificata all'AI */
async function callAI(system, userMsg, maxTokens) {
  const provider = pickProvider();
  if (!provider) throw new Error('Nessun provider AI configurato. Controlla GEMINI_API_KEY o GROQ_API_KEY su Railway.');

  if (provider === 'gemini') {
    const prompt = system
      ? `${system}\n\n---\n${userMsg}`
      : userMsg;
    const result   = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  if (provider === 'groq') {
    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: userMsg });
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: maxTokens || 1024,
      temperature: 0.7,
    });
    return completion.choices[0]?.message?.content || '';
  }
}

/* ── EMAIL (Nodemailer) ─────────────────────────────────────── */
/*
 * Configura su Railway:
 *   SMTP_USER = info@sommelierworld.vin  (il mittente)
 *   SMTP_PASS = password-app-gmail       (16 char, da Google Account → Sicurezza → Password app)
 *   ADMIN_EMAIL = timotiniurie49@gmail.com  (dove ricevi i messaggi)
 *
 * Se usi un alias Gmail ("Invia come" info@sommelierworld.vin):
 *   SMTP_HOST = smtp.gmail.com  (default)
 *   SMTP_PORT = 587              (default)
 */
function createMailer() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠ SMTP non configurato — email disabilitata');
    return null;
  }
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
const mailer = createMailer();

/* ══════════════════════════════════════════════════════════════
   ROUTES
   ══════════════════════════════════════════════════════════════ */

/* ── Status ─────────────────────────────────────────────────── */
app.get('/', (req, res) => {
  const provider = pickProvider() || 'nessuno';
  res.json({
    status:   'ok',
    version:  '6.0.0',
    provider,
    gemini:   !!geminiModel,
    groq:     !!groqClient,
    email:    !!mailer,
    message:  `Sommelier Server — provider attivo: ${provider}`,
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ── Wake-up ping (Railway cold start) ──────────────────────── */
app.get('/api/ping', (req, res) => res.json({ pong: Date.now() }));

/* ── AI principale — compatibile con v6 e v10 ───────────────── */
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  try {
    const system    = req.body.system || req.body.systemPrompt || null;
    const userMsg   = req.body.userMsg || req.body.message || req.body.prompt || 'Ciao';
    const maxTokens = req.body.maxTokens || 1024;

    const text = await callAI(system, userMsg, maxTokens);
    res.json({ text, choices: [{ message: { content: text } }] });

  } catch (err) {
    console.error('[AI]', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── Contatti — invia email dal form ────────────────────────── */
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }

  // Validazione email minima
  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Email non valida' });
  }

  if (!mailer) {
    // Se email non configurata: salva sul log e rispondi OK ugualmente
    console.log('[CONTACT] (email non configurata)', { name, email, subject, message });
    return res.json({ ok: true, warning: 'Email non configurata sul server' });
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const subjectLine = `[SommelierWorld] ${subject || 'Messaggio da ' + name}`;

    // Email all'admin
    await mailer.sendMail({
      from:    `"Sommelier World" <${process.env.SMTP_USER}>`,
      to:      adminEmail,
      replyTo: email,
      subject: subjectLine,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0A0705;color:#F5EFE2;padding:30px;border-radius:8px;">
          <h2 style="color:#D4AF37;margin-top:0;">📬 Nuovo messaggio — Sommelier World</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#D4AF37;width:100px;">Nome</td><td>${name}</td></tr>
            <tr><td style="padding:6px 0;color:#D4AF37;">Email</td><td><a href="mailto:${email}" style="color:#F5EFE2;">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#D4AF37;">Argomento</td><td>${subject || '—'}</td></tr>
          </table>
          <hr style="border-color:rgba(212,175,55,.2);margin:16px 0;">
          <p style="line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>
          <p style="font-size:12px;color:rgba(245,239,226,.4);margin-top:24px;">Inviato da sommelierworld.vin</p>
        </div>
      `,
    });

    // Email di conferma all'utente
    await mailer.sendMail({
      from:    `"Sommelier World" <${process.env.SMTP_USER}>`,
      to:      email,
      subject: 'Abbiamo ricevuto il tuo messaggio — Sommelier World',
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0A0705;color:#F5EFE2;padding:30px;border-radius:8px;">
          <h2 style="color:#D4AF37;margin-top:0;">🍷 Sommelier World</h2>
          <p>Ciao <strong>${name}</strong>,</p>
          <p>abbiamo ricevuto il tuo messaggio e ti risponderemo entro 48 ore a questo indirizzo.</p>
          <p style="color:rgba(245,239,226,.6);font-style:italic;">"${message.substring(0,120)}${message.length > 120 ? '…' : ''}"</p>
          <hr style="border-color:rgba(212,175,55,.2);margin:20px 0;">
          <p style="font-size:12px;color:rgba(245,239,226,.4);">
            info@sommelierworld.vin · sommelierworld.vin<br>
            Non rispondere a questa email automatica.
          </p>
        </div>
      `,
    });

    res.json({ ok: true });

  } catch (err) {
    console.error('[CONTACT EMAIL]', err.message);
    res.status(500).json({ error: 'Errore invio email. Riprova.' });
  }
});

/* ── Blog — lista articoli ───────────────────────────────────── */
/*
 * Archiviazione semplice: file blog.json nella root del server
 * (su Railway il filesystem è temporaneo — considera un DB o GitHub per produzione)
 */
const fs   = require('fs');
const path = require('path');
const BLOG_FILE = path.join(__dirname, 'blog.json');

function loadBlog() {
  try {
    if (fs.existsSync(BLOG_FILE)) {
      return JSON.parse(fs.readFileSync(BLOG_FILE, 'utf8'));
    }
  } catch(e) {}
  return [];
}

function saveBlog(articles) {
  try { fs.writeFileSync(BLOG_FILE, JSON.stringify(articles, null, 2)); }
  catch(e) { console.error('[BLOG save]', e.message); }
}

app.get('/api/blog', (req, res) => {
  const articles = loadBlog();
  res.json(articles);
});

/* Pubblica articolo (protetto da ADMIN_API_KEY) */
app.post('/api/blog', (req, res) => {
  const key = req.headers['x-admin-key'] || req.body.adminKey;
  if (!process.env.ADMIN_API_KEY || key !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: 'Non autorizzato' });
  }
  const { title, category, content, image, author } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title e content sono obbligatori' });
  }
  const articles = loadBlog();
  const article  = {
    id:        Date.now(),
    title,
    category:  category || 'Magazine',
    content,
    image:     image || null,
    author:    author || 'Sommelier World',
    date:      new Date().toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' }),
    createdAt: new Date().toISOString(),
  };
  articles.unshift(article);
  saveBlog(articles);
  res.json({ ok: true, article });
});

/* Elimina articolo */
app.delete('/api/blog/:id', (req, res) => {
  const key = req.headers['x-admin-key'] || req.body.adminKey;
  if (!process.env.ADMIN_API_KEY || key !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: 'Non autorizzato' });
  }
  const id  = parseInt(req.params.id);
  const arts = loadBlog().filter(a => a.id !== id);
  saveBlog(arts);
  res.json({ ok: true });
});

/* ── Notizie ─────────────────────────────────────────────────── */
app.get('/api/news', (req, res) => {
  try {
    const newsFile = path.join(__dirname, 'news.json');
    if (fs.existsSync(newsFile)) {
      return res.json(JSON.parse(fs.readFileSync(newsFile, 'utf8')));
    }
  } catch(e) {}
  res.json([]);
});

/* ── 404 ─────────────────────────────────────────────────────── */
app.use((req, res) => res.status(404).json({ error: 'Endpoint non trovato' }));

/* ── Start ───────────────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🍷 Sommelier Server v6.0 — porta ${PORT}`);
  console.log(`   Provider AI: ${pickProvider() || '⚠ nessuno configurato'}`);
  console.log(`   Email:       ${mailer ? '✓ configurata' : '✗ non configurata'}`);
  console.log(`   Blog:        ✓\n`);
});
