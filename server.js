/**
 * SOMMELIER WORLD — Server v6.3 MINIMAL
 * Solo Gemini 2.0-flash. Nessuna dipendenza extra.
 * Package.json necessario: express, cors, dotenv, @google/generative-ai
 */

const express = require('express');
const cors    = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '4mb' }));

/* ── Gemini setup ─────────────────────────────────── */
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL   = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

// Inizializza solo se la chiave esiste
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/* ── Routes ───────────────────────────────────────── */
app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    version: '6.3',
    model:   MODEL,
    ready:   !!genAI
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/ping',   (req, res) => res.json({ pong: Date.now() }));

// Endpoint AI — compatibile con tutto il frontend
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  if (!genAI) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY non configurata. Aggiungila su Railway → Variables.'
    });
  }

  try {
    const model   = genAI.getGenerativeModel({ model: MODEL });
    const system  = req.body.system || req.body.systemPrompt || '';
    const userMsg = req.body.userMsg || req.body.message || req.body.prompt || 'Ciao';
    const prompt  = system ? `${system}\n\n${userMsg}` : userMsg;

    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    // Formato compatibile con frontend vecchio e nuovo
    res.json({
      text,
      choices: [{ message: { content: text } }]
    });

  } catch (err) {
    console.error('[Gemini]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Contatti — salva nel log, email opzionale
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }
  console.log(`[CONTACT] ${name} <${email}> — ${subject || 'nessun oggetto'}`);

  // Email opzionale — non crashare se nodemailer non c'è
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = require('nodemailer');
      const t = nodemailer.createTransport({
        host: 'smtp.gmail.com', port: 587, secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await t.sendMail({
        from:    `"Sommelier World" <${process.env.SMTP_USER}>`,
        to:      process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[SW] ${subject || 'Messaggio'}`,
        html:    `<p><b>${name}</b> &lt;${email}&gt;</p><p>${message.replace(/\n/g,'<br>')}</p>`
      });
    } catch (e) {
      console.error('[SMTP]', e.message);
      // Non restituire errore — il messaggio è nel log
    }
  }

  res.json({ ok: true });
});

/* ── Start ────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🍷 Sommelier Server v6.3`);
  console.log(`   Porta:   ${PORT}`);
  console.log(`   Modello: ${MODEL}`);
  console.log(`   Gemini:  ${genAI ? '✓ pronto' : '✗ GEMINI_API_KEY mancante!'}\n`);
});
