const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const key = process.env.GEMINI_API_KEY;

// Inizializzazione con specifica della versione API corretta
const genAI = new GoogleGenerativeAI(key);

app.get('/', (req, res) => {
    res.status(200).send("Sommelier Server v5.1.0 - Pronto");
});

app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        // Specifichiamo il modello corretto
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const userPrompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";

        // Procedura di generazione contenuto
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text });

    } catch (error) {
        console.error("Errore Gemini:", error.message);
        res.status(500).json({ error: "Errore nella comunicazione con l'AI." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
