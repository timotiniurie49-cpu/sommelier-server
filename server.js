// ══════════════════════════════════════════════════════════
// SOMMELIER WORLD — SERVER BACKEND
// La chiave API Groq rimane QUI, mai visibile agli utenti
// ══════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// La tua chiave Groq — su Railway la mettiamo come variabile d'ambiente
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ── Middleware ──
app.use(express.json({ limit: '2mb' }));
app.use(cors({
  origin: '*', // Permetti tutte le origini (puoi restringere al tuo dominio Netlify)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// ── Health check ──
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sommelier World API',
    version: '1.0.0',
    groq: GROQ_API_KEY ? 'ok' : 'mancante',
   key_start: GROQ_API_KEY ? GROQ_API_KEY.substring(0,6) : 'none'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ══════════════════════════════════════════════════════════
// ENDPOINT PRINCIPALE — Proxy verso Groq
// L'app chiama questo invece di Groq direttamente
// ══════════════════════════════════════════════════════════
app.post('/api/groq', async (req, res) => {
  // Verifica che la chiave sia configurata
  if (!GROQ_API_KEY) {
    return res.status(500).json({
      error: 'Chiave API Groq non configurata sul server. Contatta l\'amministratore.'
    });
  }

  const { system, userMsg, maxTokens } = req.body;

  if (!system || !userMsg) {
    return res.status(400).json({ error: 'Parametri mancanti: system e userMsg sono obbligatori' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens || 1000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMsg }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errMsg = errData.error?.message || 'Errore Groq';

      // Errori leggibili
      if (errMsg.includes('Rate limit') || errMsg.includes('rate_limit')) {
        const waitMatch = errMsg.match(/(\d+)m(\d+)s/) || errMsg.match(/(\d+) seconds?/);
        return res.status(429).json({
          error: `⏳ Limite giornaliero raggiunto. Riprova tra ${waitMatch ? waitMatch[0] : 'qualche ora'}. (Piano gratuito: 100.000 token/giorno)`
        });
      }

      return res.status(response.status).json({ error: errMsg });
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    res.json({ text });

  } catch (err) {
    console.error('Errore server:', err.message);
    res.status(500).json({ error: 'Errore interno del server: ' + err.message });
  }
});

// ══════════════════════════════════════════════════════════
// ENDPOINT NOTIZIE — Genera notizie del giorno
// ══════════════════════════════════════════════════════════
app.get('/api/news', async (req, res) => {
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API Key non configurata' });
  }

  const lang = req.query.lang || 'it';
  const langInstr = lang === 'en' ? 'Write everything in English.' :
                    lang === 'fr' ? 'Écrivez tout en français.' : 'Scrivi tutto in italiano.';

  const sys = langInstr + ' Sei il direttore di Sommelier World. Genera 4 notizie dal mondo del vino. Rispondi SOLO con JSON valido: {"notizie":[{"title":"...","text":"2 frasi concrete.","cat":"CATEGORIA","emoji":"🍷","date":"Sommelier World","photo_query":"vineyard specific query"}],"curiosita":{"titolo":"...","testo":"curiosità interessante.","emoji":"🔍"}}';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1200,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: 'Genera le notizie di oggi' }
        ]
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Groq error' });
    }

    const data = await response.json();
    const raw = data.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    parsed.source = 'server-ai';

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════
// AVVIO SERVER
// ══════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`\n🍷 Sommelier World Server avviato`);
  console.log(`   Porta: ${PORT}`);
  console.log(`   Groq API: ${GROQ_API_KEY ? '✅ configurata' : '❌ mancante — imposta GROQ_API_KEY'}`);
  console.log(`   Pronto!\n`);
});
