/**
 * SOMMELIER WORLD — Server v6.4
 * Gemini primario + Groq fallback automatico
 * Se Gemini da 429 (quota esaurita) passa automaticamente a Groq
 *
 * Railway Variables:
 *   GEMINI_API_KEY = AIza...          (Google AI Studio - gratuito)
 *   GEMINI_MODEL   = gemini-2.0-flash
 *   GROQ_API_KEY   = gsk_...          (console.groq.com - gratuito, generoso)
 */

const express = require('express');
const cors    = require('cors');
const https   = require('https');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

const GEMINI_KEY   = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL   || 'gemini-2.0-flash';
const GROQ_KEY     = process.env.GROQ_API_KEY   || '';

app.use(cors());
app.use(express.json({ limit: '4mb' }));

/* ── Gemini ─────────────────────────────────────────────── */
async function callGemini(prompt) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/* ── Groq (chiamata HTTP diretta — no SDK necessario) ────── */
function callGroq(prompt) {
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.7
    });

    const options = {
      hostname: 'api.groq.com',
      path:     '/openai/v1/chat/completions',
      method:   'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          var parsed = JSON.parse(data);
          if (parsed.choices && parsed.choices[0]) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error(parsed.error?.message || 'Groq: risposta vuota'));
          }
        } catch(e) {
          reject(new Error('Groq: errore parsing'));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/* ── AI con fallback automatico ──────────────────────────── */
async function callAI(system, userMsg) {
  const prompt = system ? system + '\n\n' + userMsg : userMsg;

  // 1. Prova Gemini
  if (GEMINI_KEY) {
    try {
      const text = await callGemini(prompt);
      console.log('[AI] Gemini OK');
      return text;
    } catch(err) {
      const isQuota = err.message && (
        err.message.includes('429') ||
        err.message.includes('quota') ||
        err.message.includes('Too Many Requests')
      );
      if (isQuota && GROQ_KEY) {
        console.log('[AI] Gemini quota esaurita → fallback Groq');
      } else if (!GROQ_KEY) {
        throw err; // Nessun fallback disponibile
      } else {
        console.log('[AI] Gemini errore:', err.message, '→ Groq');
      }
    }
  }

  // 2. Fallback Groq
  if (GROQ_KEY) {
    const text = await callGroq(prompt);
    console.log('[AI] Groq OK');
    return text;
  }

  throw new Error('Nessun provider AI configurato. Aggiungi GEMINI_API_KEY o GROQ_API_KEY su Railway.');
}

/* ── Routes ──────────────────────────────────────────────── */
app.get('/', (req, res) => {
  res.json({
    status:  'ok',
    version: '6.4',
    gemini:  GEMINI_KEY  ? '✓' : '✗ mancante',
    groq:    GROQ_KEY    ? '✓' : '✗ mancante',
    model:   GEMINI_MODEL
  });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/ping',   (req, res) => res.json({ pong: Date.now() }));

app.post(['/api/chat', '/api/groq', '/api/gemini'], async (req, res) => {
  try {
    const system  = req.body.system || req.body.systemPrompt || '';
    const userMsg = req.body.userMsg || req.body.message || req.body.prompt || 'Ciao';

    const text = await callAI(system, userMsg);
    res.json({ text, choices: [{ message: { content: text } }] });

  } catch (err) {
    console.error('[AI Error]', err.message);
    let msg = 'Errore AI. ';
    if (err.message.includes('429') || err.message.includes('quota')) {
      msg = 'Quota API esaurita. Il servizio riprenderà tra qualche ora. In alternativa aggiungi GROQ_API_KEY su Railway.';
    } else if (err.message.includes('API key') || err.message.includes('401')) {
      msg = 'API Key non valida. Controlla GEMINI_API_KEY su Railway.';
    } else {
      msg = err.message;
    }
    res.status(500).json({ error: msg });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti' });
  }
  console.log('[CONTACT]', name, '<' + email + '>', subject || '');
  res.json({ ok: true });
});

/* ── Start ───────────────────────────────────────────────── */
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🍷 Sommelier Server v6.4 — porta ' + PORT);
  console.log('   Gemini: ' + (GEMINI_KEY ? '✓ ' + GEMINI_MODEL : '✗'));
  console.log('   Groq:   ' + (GROQ_KEY   ? '✓ llama-3.3-70b' : '✗'));
  if (!GEMINI_KEY && !GROQ_KEY) {
    console.log('   ⚠ ATTENZIONE: nessun provider AI configurato!');
  }
  console.log('');
});
