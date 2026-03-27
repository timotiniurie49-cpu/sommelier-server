# Sommelier World — Backend Server

Server Node.js che gestisce le chiamate AI per l'app Sommelier World.
La chiave API Groq rimane sul server — gli utenti non la vedono mai.

## Setup Railway (deploy in 5 minuti)

1. Vai su railway.app e crea account gratuito
2. Clicca "New Project" → "Deploy from GitHub repo"
3. Seleziona questo repository
4. Vai su "Variables" e aggiungi: GROQ_API_KEY = tua_chiave_gsk_...
5. Railway fa il deploy automatico

## Endpoints

- GET  /              → status server
- GET  /api/health    → health check  
- POST /api/groq      → proxy AI (body: {system, userMsg, maxTokens})
- GET  /api/news      → notizie giornaliere (?lang=it|en|fr)
