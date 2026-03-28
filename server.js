const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// CORS aperto — la sicurezza è nella chiave Groq nascosta sul server
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sommelier World API',
    version: '4.0.0',
    groq: GROQ_API_KEY ? 'ok' : 'mancante',
    key_chars: GROQ_API_KEY ? GROQ_API_KEY.length : 0
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/groq', async (req, res) => {
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

app.listen(PORT, () => {
  console.log('Sommelier World Server v4.0 porta ' + PORT);
  console.log('Groq: ' + (GROQ_API_KEY ? 'OK' : 'MANCANTE'));
});
