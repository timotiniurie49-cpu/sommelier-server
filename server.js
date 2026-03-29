const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080;

// Configurazione Gemini con la chiave che hai appena aggiunto
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

// Pagina di controllo per capire se il cambio è avvenuto
app.get('/', (req, res) => {
  res.json({
    status: "ok",
    service: "Sommelier World API (Gemini)",
    version: "5.0.0", // Vedrai questo quando avrai salvato
    gemini: process.env.GEMINI_API_KEY ? "configurato" : "mancante"
  });
});

// Questo gestisce le domande del tuo sito (abbiniamo /api/groq per non rompere l'index.html)
app.post(['/api/chat', '/api/groq'], async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const userMsg = req.body.userMsg || req.body.prompt || req.body.message || "Ciao";
    
    const result = await model.generateContent(userMsg);
    const response = await result.response;
    
    // Risponde nel formato 'text' che il tuo sito si aspetta
    res.json({ text: response.text() });
  } catch (err) {
    console.error("Errore Gemini:", err);
    res.status(500).json({ error: "Il Sommelier è in cantina: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log('Server v5.0 pronto sulla porta ' + PORT);
});
