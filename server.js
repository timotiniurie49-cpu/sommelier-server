/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD — Server v7.0 DEFINITIVO                   ║
 * ║                                                              ║
 * ║  Provider AI (in ordine di priorità):                       ║
 * ║  1. GROQ  — llama-3.3-70b — gratuito, quota generosa        ║
 * ║  2. GEMINI — gemini-2.0-flash — fallback se Groq manca      ║
 * ║                                                              ║
 * ║  Railway Variables necessarie (almeno una):                  ║
 * ║    GROQ_API_KEY   = gsk_...  ← CONSIGLIATO (console.groq.com)║
 * ║    GEMINI_API_KEY = AIza...  ← opzionale come fallback       ║
 * ║    GEMINI_MODEL   = gemini-2.0-flash                         ║
 * ║                                                              ║
 * ║  ✓ L'AI si attiva SOLO su richiesta esplicita dell'utente   ║
 * ║  ✓ Nessun loop automatico — ogni chiamata è singola         ║
 * ║  ✓ Log chiari in Railway Logs per ogni chiamata             ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

'use strict';

const express = require('express');
const cors    = require('cors');
const https   = require('https');   // built-in Node — zero dipendenze extra
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

// ── Variabili di configurazione ─────────────────────────
const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL    || 'gemini-2.0-flash';

// ── Contatore chiamate (per monitorare loop) ─────────────
let callCount = 0;
let lastReset = Date.now();

app.use(cors());
app.use(express.json({ limit: '4mb' }));


/* ═══════════════════════════════════════════════════════
   GROQ — chiamata HTTP diretta (no SDK necessario)
   Modello: llama-3.3-70b-versatile
   Free tier: ~14.400 richieste/giorno — molto generoso
   ═══════════════════════════════════════════════════════ */
function callGroq(prompt) {
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7,
      stream: false
    });

    const req = https.request({
      hostname: 'api.groq.com',
      path:     '/openai/v1/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':   'application/json',
        'Authorization':  'Bearer ' + GROQ_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    }, function(res) {
      let data = '';
      res.on('data', function(c) { data += c; });
      res.on('end', function() {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            const err = json.error?.message || JSON.stringify(json);
            reject(new Error('Groq: ' + err));
          }
        } catch(e) {
          reject(new Error('Groq: errore parsing risposta'));
        }
      });
    });

    req.on('error', function(e) { reject(new Error('Groq network: ' + e.message)); });
    req.setTimeout(30000, function() {
      req.destroy();
      reject(new Error('Groq: timeout 30s'));
    });
    req.write(body);
    req.end();
  });
}


/* ═══════════════════════════════════════════════════════
   GEMINI — usa SDK @google/generative-ai
   ═══════════════════════════════════════════════════════ */
async function callGemini(prompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
}


/* ═══════════════════════════════════════════════════════
   CHIAMATA AI con fallback automatico
   Groq → Gemini (se Groq non configurato o in errore)
   ═══════════════════════════════════════════════════════ */
async function callAI(system, userMsg) {
  // ⚠️ ANTI-LOOP: una sola chiamata alla volta per richiesta
  // Il server non chiama mai l'AI in automatico —
  // questa funzione parte SOLO quando il frontend fa POST /api/groq

  const prompt = system
    ? system + '\n\n' + userMsg
    : userMsg;

  // Aggiorna contatore
  callCount++;
  const now = Date.now();
  if (now - lastReset > 3600000) { callCount = 1; lastReset = now; } // reset ogni ora

  // ── Prova Groq per primo (quota molto più generosa) ──
  if (GROQ_KEY) {
    console.log(`[AI] Chiamata API inviata → Groq (#${callCount} questa ora)`);
    try {
      const text = await callGroq(prompt);
      console.log(`[AI] Groq OK — ${text.length} caratteri`);
      return text;
    } catch(err) {
      console.warn('[AI] Groq errore:', err.message);
      if (!GEMINI_KEY) throw err;
      console.log('[AI] Fallback a Gemini…');
    }
  }

  // ── Fallback Gemini ──
  if (GEMINI_KEY) {
    console.log(`[AI] Chiamata API inviata → Gemini (#${callCount} questa ora)`);
    try {
      const text = await callGemini(prompt);
      console.log(`[AI] Gemini OK — ${text.length} caratteri`);
      return text;
    } catch(err) {
      console.error('[AI] Gemini errore:', err.message);
      // Errore leggibile
      if (err.message.includes('429') || err.message.includes('quota')) {
        throw new Error('Quota API esaurita. Aggiungi GROQ_API_KEY su Railway (gratuito su console.groq.com).');
      }
      throw err;
    }
  }

  throw new Error('Nessun provider AI configurato. Aggiungi GROQ_API_KEY su Railway → Variables.');
}


/* ═══════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════ */

// Status — utile per verificare che il server funzioni
app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    version: '7.0',
    groq:    GROQ_KEY    ? '✓ configurato' : '✗ mancante (aggiungilo su Railway)',
    gemini:  GEMINI_KEY  ? '✓ configurato' : '✗ mancante',
    model:   GEMINI_MODEL,
    calls_this_hour: callCount,
    ready:   !!(GROQ_KEY || GEMINI_KEY)
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/ping',   (req, res) => res.json({ pong: Date.now() }));

// ── ENDPOINT AI PRINCIPALE ───────────────────────────────
// Viene chiamato SOLO quando l'utente preme un pulsante nel frontend
// NON parte automaticamente al caricamento della pagina
app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  const system  = req.body.system || req.body.systemPrompt || '';
  const userMsg = req.body.userMsg || req.body.message || req.body.prompt || '';

  if (!userMsg && !system) {
    return res.status(400).json({ error: 'Messaggio vuoto' });
  }

  try {
    const text = await callAI(system, userMsg);
    // Risposta compatibile con tutti i formati usati dal frontend
    res.json({
      text,
      choices: [{ message: { content: text } }]
    });
  } catch(err) {
    console.error('[AI ERRORE]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── CONTATTI ─────────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti (name, email, message)' });
  }
  // Log nel Railway Logs — visibile nella dashboard
  console.log(`[CONTACT] Da: ${name} <${email}> | Oggetto: ${subject || '—'}`);
  console.log(`[CONTACT] Messaggio: ${message.substring(0, 100)}…`);
  res.json({ ok: true });
});


/* ═══════════════════════════════════════════════════════
   START
   ═══════════════════════════════════════════════════════ */
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  🍷 SOMMELIER SERVER v7.0                  ║');
  console.log(`║  Porta: ${PORT}                               ║`);
  console.log('╠════════════════════════════════════════════╣');
  console.log(`║  Groq:   ${GROQ_KEY   ? '✓ ATTIVO (llama-3.3-70b)    ║' : '✗ mancante (aggiungi GROQ_API_KEY)║'}`);
  console.log(`║  Gemini: ${GEMINI_KEY ? '✓ attivo (' + GEMINI_MODEL.padEnd(18) + ')║' : '✗ mancante                       ║'}`);

  if (!GROQ_KEY && !GEMINI_KEY) {
    console.log('║  ⚠ ATTENZIONE: nessun provider AI!        ║');
    console.log('║  Vai su Railway → Variables               ║');
    console.log('║  Aggiungi: GROQ_API_KEY = gsk_...         ║');
    console.log('║  Chiave gratuita: console.groq.com        ║');
  } else {
    console.log('║  ✓ Server pronto a ricevere richieste     ║');
  }
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
});
