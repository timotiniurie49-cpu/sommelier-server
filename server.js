const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

// Configurazione CORS completa
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

app.get('/', (req, res) => {
    res.json({ status: "online", region: "US-WEST", version: "5.0.5" });
});

app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        if (!key) throw new Error("Chiave mancante");

        // Usiamo gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const userPrompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";

        // Puliamo la richiesta per Google
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }]
        });
        
        const response = await result.response;
        res.json({ text: response.text() });

    } catch (error) {
        console.error("Dettaglio Errore:", error.message);
        res.status(500).json({ error: "Il Sommelier ha un piccolo intoppo tecnico." });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server v5.0.5 pronto su porta ${PORT}`));
