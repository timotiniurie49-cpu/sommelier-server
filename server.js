/**
 * SOMMELIER WORLD — Server v6.2
 * Semplice e garantito. Legge GEMINI_MODEL da Railway Variables.
 *
 * Variables Railway necessarie:
 *   GEMINI_API_KEY = AIza...
 *   GEMINI_MODEL   = gemini-2.0-flash   ← IMPORTANTE
 */

const express = require('express');
const cors    = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '4mb' }));

/* ── Gemini ─────────────────────────────────────────────────── */
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL   = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY mancante! Aggiungila su Railway → Variables');
}

const genAI = new GoogleGenerativeAI(API_KEY || 'missing');

/* ── Status ─────────────────────────────────────────────────── */
app.get('/',            (req, res) => res.json({ ok: true, model: MODEL, version: '6.2' }));
app.get('/api/health',  (req, res) => res.json({ ok: true }));
app.get('/api/ping',    (req, res) => res.json({ pong: Date.now() }));

/* ── AI — unico endpoint, compatibile con tutto il frontend ─── */
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY non configurata su Railway' });
    }

    const model   = genAI.getGenerativeModel({ model: MODEL });
    const system  = req.body.system || req.body.systemPrompt || '';
    const userMsg = req.body.userMsg || req.body.message || req.body.prompt || 'Ciao';

    // Unisce system prompt e messaggio utente
    const prompt = system ? `${system}\n\n${userMsg}` : userMsg;

    const result = await model.generateContent(prompt);
    const text   = result.response.text();

    // Risposta compatibile con tutti i formati usati dal frontend
    res.json({
      text,
      choices: [{ message: { content: text } }]
    });

  } catch (err) {
    console.error('[AI Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ── Contatti (email opzionale) ─────────────────────────────── */
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }

  console.log(`[CONTACT] ${name} <${email}> — ${subject}`);

  // Email opzionale — funziona solo se SMTP_USER e SMTP_PASS sono configurati
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
        subject: `[SW] ${subject || 'Messaggio da ' + name}`,
        html:    `<p><b>${name}</b> &lt;${email}&gt;<br><i>${subject}</i></p><p>${message.replace(/\n/g,'<br>')}</p>`
      });
    } catch(e) {
      console.error('[SMTP]', e.message);
      // Continua comunque — il messaggio è già nel log
    }
  }

  res.json({ ok: true });
});

/* ── Start ──────────────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🍷 Sommelier Server v6.2`);
  console.log(`   Porta:  ${PORT}`);
  console.log(`   Modello: ${MODEL}`);
  console.log(`   API Key: ${API_KEY ? '✓ configurata' : '✗ MANCANTE!'}\n`);
});
