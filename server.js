const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const ALLOWED_ORIGINS = [
  'https://timotiniurie49-cpu.github.io',
  'https://wondrous-queijadas-9e7ca9.netlify.app',
  'https://resplendent-mermaid-baa6ce.netlify.app',
  'https://cosmic-kangaroo-a22ea4.netlify.app',
  'http://localhost',
  'http://localhost:3000',
  'http://127.0.0.1',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.some(function(o){ return origin === o || origin.startsWith(o); })) {
      callback(null, true);
    } else {
      callback(new Error('Accesso non autorizzato'), false);
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sommelier World API',
    version: '3.1.0',
    groq: GROQ_API_KEY ? 'ok' : 'mancante',
    key_chars: GROQ_API_KEY ? GROQ_API_KEY.length : 0
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/groq', async (req, res) => {
  const origin = req.headers.origin || '';
  if (origin && !ALLOWED_ORIGINS.some(function(o){ return origin === o || origin.startsWith(o); })) {
    return res.status(403).json({ error: '🔒 Accesso non autorizzato.' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Servizio non disponibile' });
  }

  const { system, userMsg, maxTokens } = req.body;
  if (!system || !userMsg) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_API_KEY
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

    const data = await response.json();
    if (!response.ok) {
      const msg = data.error?.message || 'Errore API';
      if (msg.includes('Rate limit')) {
        return res.status(429).json({ error: '⏳ Limite giornaliero raggiunto. Riprova domani.' });
      }
      return res.status(response.status).json({ error: msg });
    }

    res.json({ text: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Non trovato' });
});

app.listen(PORT, () => {
  console.log('🍷 Sommelier World Server v3.1');
  console.log('   Porta: ' + PORT);
  console.log('   Groq: ' + (GROQ_API_KEY ? '✅' : '❌'));
});
