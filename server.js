const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Inizializza Gemini con la tua chiave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Accetta sia /api/chat che /api/groq per non rompere il sito
app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Prende il messaggio in qualunque formato arrivi dall'HTML
        const prompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Risponde nel formato 'text' che il tuo index.html si aspetta
        res.json({ text: text }); 
    } catch (error) {
        console.error("Errore:", error);
        res.status(500).json({ error: "Il Sommelier è in pausa." });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Server Online"));
