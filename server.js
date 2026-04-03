/**
 * SOMMELIER WORLD — Server v6.1
 * FIX: gemini-1.5-flash → gemini-2.0-flash (modello attuale)
 * + supporto system prompt per abbinamenti e terroir
 */

const express = require('express');
const cors    = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ── Gemini ─────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// gemini-2.0-flash è il modello attuale stabile (rimpiazza 1.5-flash)
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

app.get('/', (req, res) => {
  res.json({ status: 'ok', version: '6.1.0', model: MODEL });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/ping',   (req, res) => res.json({ pong: Date.now() }));

// Endpoint principale — compatibile con tutti i patch precedenti
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  try {
    const model     = genAI.getGenerativeModel({ model: MODEL });
    const system    = req.body.system || req.body.systemPrompt || null;
    const userMsg   = req.body.userMsg || req.body.message || req.body.prompt || 'Ciao';

    // Unisce system prompt + messaggio utente in un unico prompt
    const fullPrompt = system
      ? `${system}\n\n---\nMessaggio utente:\n${userMsg}`
      : userMsg;

    const result   = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text     = response.text();

    // Risposta compatibile sia con vecchio formato che con nuovo
    res.json({
      text,
      choices: [{ message: { content: text } }]
    });

  } catch (err) {
    console.error('[Gemini Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint contatti (da sw-patch-v11)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }
  // Log sempre — email opzionale
  console.log('[CONTACT]', { name, email, subject });

  // Se nodemailer è configurato (variabili SMTP_USER/SMTP_PASS)
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const nodemailer = require('nodemailer');
      const mailer = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: 587, secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });
      await mailer.sendMail({
        from:    `"Sommelier World" <${process.env.SMTP_USER}>`,
        to:      process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        subject: `[SW] ${subject || 'Messaggio da ' + name}`,
        html: `<p><b>Da:</b> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g,'<br>')}</p>`
      });
    } catch(e) {
      console.error('[SMTP]', e.message);
    }
  }
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍷 Sommelier Server v6.1 — porta ${PORT} — modello: ${MODEL}`);
});
