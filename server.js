const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// Questa riga è fondamentale per leggere le variabili su Railway
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// LOG DI CONTROLLO: Vedremo nei log di Railway se la chiave viene caricata
const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.error("⚠️ ATTENZIONE: La variabile GEMINI_API_KEY è VUOTA nel sistema!");
} else {
    console.log("✅ Variabile GEMINI_API_KEY rilevata (inizia con: " + key.substring(0, 4) + "...)");
}

const genAI = new GoogleGenerativeAI(key || "CHIAVE_MANCANTE");

app.get('/', (req, res) => {
    res.json({
        status: "ok",
        service: "Sommelier World Gemini",
        version: "5.0.1",
        key_detected: !!key
    });
});

app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        if (!key) throw new Error("Chiave API non configurata sul server");
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error("Errore Gemini:", error.message);
        res.status(500).json({ error: "Errore: " + error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server in ascolto sulla porta ' + PORT));
