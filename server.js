const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione Gemini API
// Usiamo il nome della variabile che hai impostato su Railway
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Pagina di controllo (Health Check)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sommelier World API (Gemini Edition)',
    key_configured: process.env.GEMINI_API_KEY ? 'SÌ' : 'NO'
  });
});

// IL TRUCCO: Questo endpoint accetta sia /api/chat che /api/groq
// Così non devi cambiare nulla nel tuo vecchio file index.html!
app.post(['/api/chat', '/api/groq'], async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key Gemini mancante su Railway' });
  }

  try {
    // Recuperiamo il messaggio dell'utente (gestiamo entrambi i formati possibili)
    const userMessage = req.body.userMsg || req.body.prompt || req.body.message;
    const systemInstructions = req.body.system || "Sei un esperto sommelier.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Uniamo le istruzioni di sistema al messaggio per Gemini
    const fullPrompt = `${systemInstructions}\n\nDomanda utente: ${userMessage}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Inviamo la risposta nello stesso formato che si aspetta il tuo sito
    res.json({ text: text });

  } catch (err) {
    console.error("Errore Gemini:", err);
    res.status(500).json({ error: "Il Sommelier ha avuto un problema: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log('Sommelier World Server v5.0 (Gemini) attivo sulla porta ' + PORT);
});
