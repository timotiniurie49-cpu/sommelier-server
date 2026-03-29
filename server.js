const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 8080; // Railway usa spesso la 8080

// Inizializza Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.post(['/api/chat', '/api/groq'], async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = req.body.userMsg || req.body.message || "Ciao";
    
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('--- SERVER AGGIORNATO ---');
  console.log('Motore attuale: GEMINI');
  console.log('Porta: ' + PORT);
});
