const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

// Middleware obbligatori
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const API_KEY = process.env.GEMINI_API_KEY;

// Verifica la chiave all'avvio
if (!API_KEY) {
    console.error("❌ ERRORE CRITICO: GEMINI_API_KEY non trovata nelle variabili!");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// Test rapido del server
app.get('/', (req, res) => {
    res.status(200).send("Server Sommelier Online v5.0.8");
});

// Gestione della chat
app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        if (!API_KEY) throw new Error("API Key mancante sul server");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const userPrompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });

    } catch (error) {
        console.error("Errore API Gemini:", error.message);
        res.status(500).json({ error: "Il Sommelier è temporaneamente offline." });
    }
});

// Avvio server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server in ascolto sulla porta ${PORT}`);
});
