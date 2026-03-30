const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- LOG DI CONTROLLO PER IL DEBUG ---
const key = process.env.GEMINI_API_KEY;
if (!key) {
    console.error("⚠️ ERRORE: La variabile GEMINI_API_KEY non è stata trovata su Railway!");
} else {
    console.log("✅ Chiave API rilevata correttamente (inizia con: " + key.substring(0, 4) + "...)");
}

// Inizializzazione Google Generative AI
const genAI = new GoogleGenerativeAI(key || "CHIAVE_MANCANTE");

// Rotta principale per testare se il server è vivo
app.get('/', (req, res) => {
    res.json({
        status: "online",
        service: "Sommelier World Gemini",
        version: "5.0.2",
        key_loaded: !!key
    });
});

// Rotta per la Chat (supporta sia /api/chat che /api/groq per compatibilità)
app.post(['/api/chat', '/api/groq'], async (req, res) => {
    try {
        if (!key) {
            return res.status(500).json({ error: "Configurazione incompleta: manca la chiave API sul server." });
        }

        // Usiamo gemini-1.5-flash che è veloce e gratuito
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Estrae il messaggio dell'utente dai vari formati possibili
        const userPrompt = req.body.userMsg || req.body.message || req.body.prompt || "Ciao";

        console.log("--- Nuova richiesta ricevuta ---");
        console.log("User dice:", userPrompt);

        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini risponde con successo.");
        
        // Risponde nel formato { text: "..." } che il tuo sito si aspetta
        res.json({ text: text });

    } catch (error) {
        console.error("❌ Errore durante la chiamata a Gemini:");
        console.error(error.message);

        // Se l'errore è dovuto alla posizione geografica (User location not supported)
        if (error.message.includes("location") || error.message.includes("supported")) {
            res.status(403).json({ 
                error: "Google Gemini non è disponibile nella regione di questo server. Prova a spostare il server Railway in USA." 
            });
        } else {
            res.status(500).json({ error: "Il Sommelier ha avuto un problema tecnico. Riprova tra poco." });
        }
    }
});

// Avvio del server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`Sommelier Server v5.0.2 pronto sulla porta ${PORT}`);
    console.log(`-----------------------------------------`);
});
