const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

// --- CONFIGURAZIONE CORS BLOCCANTE ---
app.use(cors({
    origin: '*', // Permette a QUALSIASI sito di interrogare il server
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

// Rotta per i test
app.get('/', (req, res) => {
    res.json({ status: "online", message: "Sommelier Server v5.0.6 pronto" });
});

// Rotta per la chat
app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const userPrompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        
        // Risposta pulita
        res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Errore:", error.message);
        res.status(500).json({ error: "Errore tecnico del Sommelier." });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server pronto'));
