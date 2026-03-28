const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  const key = process.env.GROQ_API_KEY;
  res.json({
    status: 'ok',
    version: '3.0.0',
    groq: key ? 'ok' : 'mancante',
    key_chars: key ? key.length : 0
  });
});

app.post('/api/groq', async (req, res) => {
  const key = process.env.GROQ_API_KEY;
  if (!key) return res.status(500).json({ error: 'Chiave API non configurata' });
  
  const { system, userMsg, maxTokens } = req.body;
  if (!system || !userMsg) return res.status(400).json({ error: 'Parametri mancanti' });

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens || 1000,
      messages: [{ role: 'system', content: system }, { role: 'user', content: userMsg }]
    })
  });

  const data = await r.json();
  if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'Errore' });
  res.json({ text: data.choices[0].message.content });
});

app.listen(process.env.PORT || 3000, () => console.log('OK porta ' + (process.env.PORT || 3000)));
