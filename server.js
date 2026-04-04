/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD — Server v7.2                                  ║
 * ║                                                                  ║
 * ║  ✓ Notizie REALI dal mondo del vino (Google News RSS +         ║
 * ║    Decanter + Drinks Business + Wine Spectator)                ║
 * ║  ✓ Groq riassume e traduce in IT/EN/FR                        ║
 * ║  ✓ 50+ argomenti editoriali a rotazione                        ║
 * ║  ✓ Cron: ogni giorno 08:00 → 1 notizia + 2 editoriali          ║
 * ║  ✓ API articoli completa (lista, genera, aggiungi, rimuovi)    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
'use strict';

const express = require('express');
const cors    = require('cors');
const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL    || 'gemini-2.0-flash';
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';

app.use(cors());
app.use(express.json({ limit: '4mb' }));

let callCount = 0, lastReset = Date.now();


/* ════════════════════════════════════════════════════════
   STORAGE ARTICOLI
   ════════════════════════════════════════════════════════ */
const ARTICLES_FILE = '/tmp/sw_articles.json';
let articlesStore = [];

const SEED = [
  {
    id:'seed-1', type:'editorial', isNews:false,
    titolo_it:'Barolo 2016: la Vendemmia del Secolo',
    titolo_en:'Barolo 2016: The Vintage of the Century',
    titolo_fr:'Barolo 2016 : le Millésime du Siècle',
    categoria_it:'Annate', categoria_en:'Vintages', categoria_fr:'Millésimes',
    testo_it:'Il 2016 è già considerato l\'annata più grande degli ultimi trent\'anni nelle Langhe. Un\'estate perfetta, senza stress idrico, con escursioni termiche notturne straordinarie ad agosto e settembre. I Barolo 2016 mostrano tannini di seta e acidità cristallina.\n\nI produttori storici hanno raggiunto vette ineguagliabili. Il Monfortino di Giacomo Conterno, il Rocche dell\'Annunziata di Paolo Scavino, il Cerretta di Elio Grasso: ciascuno è un capolavoro della viticoltura mondiale.\n\nSe trovi un 2016 a prezzo ragionevole, compralo. Questi vini dureranno cinquant\'anni.',
    testo_en:'The 2016 vintage is already considered the greatest in the Langhe for thirty years. A perfect summer, no water stress, extraordinary night-time temperature variations. The 2016 Barolos display silky tannins and crystalline acidity — these wines will last fifty years.',
    testo_fr:'Le millésime 2016 est déjà considéré comme le plus grand des Langhe depuis trente ans. Des tanins soyeux et une acidité cristalline : ces vins dureront cinquante ans.',
    immagine:'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
    autore:'Timotin', data:'Aprile 2026', generato_ai:false,
  },
  {
    id:'seed-2', type:'editorial', isNews:false,
    titolo_it:'Come Leggere un\'Etichetta: il Codice Segreto del Vino',
    titolo_en:'How to Read a Wine Label: The Secret Code',
    titolo_fr:'Comment Lire une Étiquette : Le Code Secret du Vin',
    categoria_it:'Tecnica', categoria_en:'Technique', categoria_fr:'Technique',
    testo_it:'DOC, DOCG, IGT, AOC, AOP: capire il sistema di classificazione ti permette di scegliere il vino giusto in pochi secondi. Il disciplinare è il regolamento di ogni denominazione: indica vitigni, resa massima e affinamento minimo.\n\nLa regola d\'oro dei professionisti: guarda sempre il nome del produttore prima della denominazione. Un grande produttore in una denominazione minore batte spesso un produttore mediocre in una grande denominazione.\n\nL\'annata è il secondo elemento da guardare: climi ed eventi stagionali cambiano radicalmente il carattere del vino ogni anno.',
    testo_en:'Understanding the classification system lets you choose the right wine in seconds. The disciplinare is each appellation\'s rulebook: it specifies grape varieties, maximum yield, and minimum ageing.\n\nThe professionals\' golden rule: always look at the producer\'s name before the appellation. A great producer in a minor appellation often beats a mediocre producer in a famous one.',
    testo_fr:'Comprendre le système de classification vous permet de choisir le bon vin en quelques secondes. La règle d\'or des professionnels : regardez toujours le nom du producteur avant l\'appellation.',
    immagine:'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
    autore:'Timotin', data:'Aprile 2026', generato_ai:false,
  },
];

function loadArticles() {
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      articlesStore = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      console.log(`[Articles] ${articlesStore.length} articoli in cache`);
    } else {
      articlesStore = [...SEED];
      saveArticles();
    }
  } catch(e) { articlesStore = [...SEED]; }
}
function saveArticles() {
  try { fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articlesStore, null, 2)); }
  catch(e) { console.warn('[Save]', e.message); }
}
loadArticles();


/* ════════════════════════════════════════════════════════
   AI CALLS
   ════════════════════════════════════════════════════════ */
function callGroq(prompt, maxTokens) {
  maxTokens = maxTokens || 1200;
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify({
      model:'llama-3.3-70b-versatile',
      messages:[{role:'user', content:prompt}],
      max_tokens: maxTokens, temperature:0.75
    });
    const req = https.request({
      hostname:'api.groq.com', path:'/openai/v1/chat/completions',
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+GROQ_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    }, function(res) {
      let d=''; res.on('data',c=>d+=c);
      res.on('end',function(){
        try {
          const j=JSON.parse(d);
          if(j.choices?.[0]) resolve(j.choices[0].message.content);
          else reject(new Error(j.error?.message||'Groq vuoto'));
        } catch(e){ reject(new Error('Groq parse')); }
      });
    });
    req.on('error',e=>reject(new Error('Groq net: '+e.message)));
    req.setTimeout(45000,()=>{req.destroy();reject(new Error('Groq timeout'));});
    req.write(body); req.end();
  });
}

async function callGemini(prompt) {
  const {GoogleGenerativeAI} = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({model: GEMINI_MODEL});
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callAI(system, userMsg, maxTokens) {
  const prompt = system ? system+'\n\n'+userMsg : userMsg;
  callCount++;
  if (Date.now()-lastReset>3600000){callCount=1;lastReset=Date.now();}

  if (GROQ_KEY) {
    try {
      console.log(`[AI] Chiamata API inviata → Groq (#${callCount})`);
      const t = await callGroq(prompt, maxTokens||1200);
      return t;
    } catch(e) {
      console.warn('[Groq]',e.message);
      if (!GEMINI_KEY) throw e;
    }
  }
  if (GEMINI_KEY) {
    console.log(`[AI] Chiamata API inviata → Gemini (#${callCount})`);
    return await callGemini(prompt);
  }
  throw new Error('Nessun provider AI.');
}


/* ════════════════════════════════════════════════════════
   RSS FETCHER — notizie reali dal mondo del vino
   ════════════════════════════════════════════════════════ */
const NEWS_FEEDS = [
  // Google News RSS — notizie di oggi sul vino mondiale
  { name:'Google News IT', url:'https://news.google.com/rss/search?q=vino+viticoltura+denominazione+sommelier&hl=it&gl=IT&ceid=IT:it', lang:'it' },
  { name:'Google News EN', url:'https://news.google.com/rss/search?q=wine+winery+sommelier+appellation+viticulture&hl=en&gl=US&ceid=US:en', lang:'en' },
  { name:'Google News FR', url:'https://news.google.com/rss/search?q=vin+vigneron+appellation+sommelier&hl=fr&gl=FR&ceid=FR:fr', lang:'fr' },
  // Decanter
  { name:'Decanter', url:'https://www.decanter.com/feed/', lang:'en' },
  // The Drinks Business
  { name:'Drinks Business', url:'https://www.thedrinksbusiness.com/feed/', lang:'en' },
  // Wine Enthusiast
  { name:'Wine Enthusiast', url:'https://www.winemag.com/feed/', lang:'en' },
];

function fetchUrl(url) {
  return new Promise(function(resolve) {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 SommelierWorldBot/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      },
      timeout: 15000,
    }, function(res) {
      // Segui redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve);
        return;
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRegex.exec(xml)) !== null && items.length < 8) {
    const block = m[1];
    const title  = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)?.[1]||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]+>/g,'').trim();
    const link   = (block.match(/<link[^>]*>([^<]*)<\/link>/s)?.[1]||block.match(/<link[^>]+href="([^"]+)"/)?.[1]||'').trim();
    const desc   = (block.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/s)?.[1]||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().substring(0,800);
    const pub    = block.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || '';
    const source = block.match(/<source[^>]*>(.*?)<\/source>/s)?.[1]?.trim() || block.match(/source url="([^"]+)"/)?.[1]||'';

    if (title && title.length > 10) {
      items.push({ title, link, desc, pub, source });
    }
  }
  return items;
}

async function fetchLatestWineNews() {
  console.log('[News] Recupero notizie reali dal mondo del vino...');

  const allItems = [];
  for (const feed of NEWS_FEEDS) {
    try {
      const xml = await fetchUrl(feed.url);
      if (!xml || !xml.includes('<item')) continue;
      const items = parseRSS(xml);
      items.forEach(i => { i._feedLang = feed.lang; i._feedName = feed.name; });
      allItems.push(...items.slice(0, 4));
      console.log(`[News] ${feed.name}: ${items.length} notizie`);
    } catch(e) {
      console.warn(`[News] ${feed.name} errore:`, e.message);
    }
  }

  if (!allItems.length) {
    console.warn('[News] Nessuna notizia trovata dai feed RSS');
    return null;
  }

  // Prendi la notizia più recente e interessante
  const item = allItems[Math.floor(Math.random() * Math.min(5, allItems.length))];
  console.log('[News] Notizia selezionata:', item.title);
  return item;
}


/* ════════════════════════════════════════════════════════
   50+ ARGOMENTI EDITORIALI A ROTAZIONE
   ════════════════════════════════════════════════════════ */
const TOPICS = [
  // Vitigni
  { it:'Il Nebbiolo: anatomia del vitigno più nobile d\'Italia',          cat:'Vitigni' },
  { it:'Riesling — il vitigno più incompreso e più longevo del mondo',    cat:'Vitigni' },
  { it:'Sangiovese: 350 cloni, un\'identità sola',                        cat:'Vitigni' },
  { it:'Grenache/Garnacha: il vitigno che conquista tre continenti',      cat:'Vitigni' },
  { it:'Pinot Nero: la sfida del vitigno più difficile da coltivare',     cat:'Vitigni' },
  { it:'Chardonnay: versatile o overrated? La verità',                    cat:'Vitigni' },
  { it:'Vitigni autoctoni italiani dimenticati: la nuova frontiera',      cat:'Vitigni' },
  { it:'Cabernet Sauvignon vs Merlot: qual è davvero il migliore?',       cat:'Vitigni' },
  { it:'Assyrtiko di Santorini: il bianco vulcanico che sfida il tempo',  cat:'Vitigni' },
  { it:'Tempranillo: il cuore della Spagna vinicola',                     cat:'Vitigni' },
  // Denominazioni
  { it:'Barolo vs Barbaresco: le differenze vere tra i due "grandi"',     cat:'Denominazioni' },
  { it:'Champagne: come orientarsi tra 300 produttori e mille etichette', cat:'Denominazioni' },
  { it:'Borgogna: la guida completa al sistema dei crus',                 cat:'Denominazioni' },
  { it:'Etna: perché il vulcano è il terroir del futuro',                 cat:'Denominazioni' },
  { it:'Priorat: l\'ardesia che trasforma il vino in pietra viva',        cat:'Denominazioni' },
  { it:'Mosel: i Riesling più longevi del pianeta su ardesia millenaria', cat:'Denominazioni' },
  { it:'Wachau: il Danubio e il Grüner Veltliner in tre categorie',      cat:'Denominazioni' },
  { it:'Rioja: Joven, Crianza, Reserva, Gran Reserva — le differenze',   cat:'Denominazioni' },
  { it:'Super Tuscan: la ribellione che ha cambiato il vino italiano',    cat:'Denominazioni' },
  { it:'Sancerre e Pouilly-Fumé: il Sauvignon Blanc al suo apice',       cat:'Denominazioni' },
  // Tecnica
  { it:'Degustazione alla cieca: metodo e segreti dei Master Sommelier',  cat:'Tecnica' },
  { it:'Temperatura di servizio: la verità che nessuno ti dice',          cat:'Tecnica' },
  { it:'Decantare o non decantare? Tutto dipende dal vino',               cat:'Tecnica' },
  { it:'I calici giusti per ogni vino: guida scientifica',                cat:'Tecnica' },
  { it:'Affinamento in botte: rovere francese vs americano vs slavonia',  cat:'Tecnica' },
  { it:'Metodo Classico vs Charmat: le bollicine spiegate davvero',       cat:'Tecnica' },
  { it:'Il vino naturale: come riconoscerlo e quando è davvero buono',    cat:'Tecnica' },
  { it:'Come costruire una cantina di casa: partire da zero',             cat:'Tecnica' },
  { it:'I difetti del vino: come riconoscerli e cosa fare',               cat:'Tecnica' },
  { it:'L\'invecchiamento: quali vini migliorano e quali no',             cat:'Tecnica' },
  // Abbinamenti
  { it:'Abbinamento vino e formaggio: le 10 combinazioni perfette',       cat:'Abbinamenti' },
  { it:'Vino e cioccolato: un abbinamento possibile con le regole giuste',cat:'Abbinamenti' },
  { it:'Sushi e vino: la guida completa oltre il sake',                   cat:'Abbinamenti' },
  { it:'Vino e pizza: quale bottiglia scegliere per ogni tipo',           cat:'Abbinamenti' },
  { it:'I vini per il pesce crudo: da ostriche a carpacci',               cat:'Abbinamenti' },
  { it:'Selvaggina e vino: gli abbinamenti dei grandi chef stellati',     cat:'Abbinamenti' },
  { it:'Vino e spezie: come gestire i piatti etnici e i curry',           cat:'Abbinamenti' },
  { it:'Champagne a tutto pasto: come si fa davvero',                     cat:'Abbinamenti' },
  // Mondo
  { it:'La rivoluzione del vino georgiano: 8000 anni di kvevri',         cat:'Mondo' },
  { it:'Cina: il nuovo gigante del vino che pochi conoscono',             cat:'Mondo' },
  { it:'Giappone e il Koshu: il vino che rispecchia l\'estetica wabi-sabi',cat:'Mondo' },
  { it:'Libano: Château Musar e il vino che sopravvive alle guerre',      cat:'Mondo' },
  { it:'Mendoza vs Valle de Uco: la guerra del Malbec argentino',         cat:'Mondo' },
  { it:'Sudafrica: la rinascita del Chenin Blanc e del Swartland',        cat:'Mondo' },
  { it:'Oregon vs Borgogna: chi fa il miglior Pinot Nero al mondo?',      cat:'Mondo' },
  // Sostenibilità e tendenze
  { it:'Biodinamico, naturale, biologico: le differenze concrete',        cat:'Tendenze' },
  { it:'Vini arancioni: la moda che viene dall\'antichità georgiana',     cat:'Tendenze' },
  { it:'Il vino low alcol: moda o futuro della viticoltura?',             cat:'Tendenze' },
  { it:'Climate change e vino: come il riscaldamento cambia tutto',       cat:'Tendenze' },
  { it:'Le aste del vino: come funzionano e cosa vale di più nel 2025',  cat:'Tendenze' },
  { it:'Vino in lattina e bag-in-box: quando ha senso berlo',             cat:'Tendenze' },
];

const IMAGES = [
  'https://images.pexels.com/photos/4113579/pexels-photo-4113579.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/3532658/pexels-photo-3532658.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/3850838/pexels-photo-3850838.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/339696/pexels-photo-339696.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/2664149/pexels-photo-2664149.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/2702805/pexels-photo-2702805.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/2425434/pexels-photo-2425434.jpeg?auto=compress&w=900',
  'https://images.pexels.com/photos/1407843/pexels-photo-1407843.jpeg?auto=compress&w=900',
];

function todayDate() {
  return new Date().toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' });
}
function imgForDay(offset) {
  const d = Math.floor(Date.now()/86400000) + (offset||0);
  return IMAGES[d % IMAGES.length];
}
function topicForDay(offset) {
  const d = Math.floor(Date.now()/86400000) + (offset||0);
  return TOPICS[d % TOPICS.length];
}


/* ════════════════════════════════════════════════════════
   GENERA NOTIZIA REALE DAI RSS
   ════════════════════════════════════════════════════════ */
async function generateNewsArticle() {
  const newsItem = await fetchLatestWineNews();

  if (!newsItem) {
    // Fallback: genera una "flash news" di settore AI
    const topic = 'Mercato globale del vino: le tendenze della settimana';
    const prompt = `Sei un giornalista enologico. Scrivi una notizia di attualità sul mercato del vino mondiale, massimo 200 parole. 2 paragrafi. Tono giornalistico, fatti concreti, niente asterischi.`;
    const testo_it = await callAI('', prompt, 500);

    return {
      id: 'news-' + Date.now(), type:'news', isNews:true,
      titolo_it: 'Vino nel Mondo: le Notizie della Settimana',
      titolo_en: 'Wine World: This Week\'s News',
      titolo_fr: 'Le Monde du Vin : Actualités de la Semaine',
      categoria_it:'🌍 Notizie', categoria_en:'🌍 News', categoria_fr:'🌍 Actualités',
      testo_it, testo_en: testo_it, testo_fr: testo_it,
      immagine: imgForDay(1),
      autore:'Sommelier World', data: todayDate(), generato_ai:true,
    };
  }

  const SYS = 'Sei un giornalista enologico esperto. Ricevi una notizia in inglese sul mondo del vino e la riscrivi in modo professionale. NO asterischi, NO markdown. Testo puro, paragrafi separati da riga vuota. Max 200 parole.';

  // Testo source per Groq
  const source = `Titolo: ${newsItem.title}\nDescrizione: ${newsItem.desc}\nFonte: ${newsItem._feedName}`;

  // Genera nelle 3 lingue in parallelo
  const [testo_it, testo_en, testo_fr] = await Promise.all([
    callAI(SYS, `Riscrivi in ITALIANO questa notizia sul vino:\n${source}`, 600),
    callAI(SYS, `Rewrite in ENGLISH this wine news:\n${source}`, 600),
    callAI(SYS, `Réécris en FRANÇAIS cette actualité du vin:\n${source}`, 600),
  ]);

  // Estrai titolo pulito
  const titlePrompt = `Dalla notizia: "${newsItem.title}". Scrivi SOLO il titolo in italiano, 8-12 parole, senza virgolette, senza puntini:`;
  const titolo_it = (await callAI('', titlePrompt, 80)).replace(/["""]/g,'').trim();

  return {
    id: 'news-' + Date.now(), type:'news', isNews:true,
    titolo_it, titolo_en: newsItem.title,
    titolo_fr: titolo_it,
    categoria_it:'🗞 Notizia del Giorno', categoria_en:'🗞 Today\'s News', categoria_fr:'🗞 Actualité du Jour',
    testo_it, testo_en, testo_fr,
    fonte: newsItem._feedName,
    link_originale: newsItem.link,
    immagine: imgForDay(1),
    autore:'Sommelier World News', data: todayDate(), generato_ai:true,
  };
}


/* ════════════════════════════════════════════════════════
   GENERA ARTICOLO EDITORIALE
   ════════════════════════════════════════════════════════ */
async function generateEditorialArticle(topicOffset) {
  const topic = topicForDay(topicOffset || 0);
  const SYS = `Sei un sommelier e giornalista enologico esperto. Scrivi un articolo di magazine sul vino. Stile: elegante, appassionato, concreto — cita produttori reali, denominazioni specifiche, annate. NO markdown, NO asterischi. Testo puro. 3 paragrafi. Max 220 parole.`;

  const [testo_it, testo_en, testo_fr] = await Promise.all([
    callAI(SYS, `Argomento: "${topic.it}". Scrivi in italiano.`, 700),
    callAI(SYS, `Topic: "${topic.it}". Write in English.`, 700),
    callAI(SYS, `Sujet: "${topic.it}". Écris en français.`, 700),
  ]);

  const catMap = {
    'Vitigni':'🍇 Vitigni', 'Denominazioni':'🗺 Denominazioni', 'Tecnica':'📚 Tecnica',
    'Abbinamenti':'🍽 Abbinamenti', 'Mondo':'🌍 Mondo', 'Tendenze':'✨ Tendenze'
  };
  const catIT = catMap[topic.cat] || topic.cat;

  return {
    id: 'ai-' + Date.now() + '-' + (topicOffset||0),
    type:'editorial', isNews:false,
    titolo_it: topic.it,
    titolo_en: topic.it, // sarà migliorato in futuro
    titolo_fr: topic.it,
    categoria_it: catIT, categoria_en: catIT, categoria_fr: catIT,
    testo_it, testo_en, testo_fr,
    immagine: imgForDay(topicOffset || 0),
    autore:'Sommelier World AI', data: todayDate(), generato_ai:true,
  };
}


/* ════════════════════════════════════════════════════════
   JOB GIORNALIERO — 1 notizia + 2 editoriali
   ════════════════════════════════════════════════════════ */
async function runDailyJob() {
  console.log('\n[CRON] ═══ Job giornaliero avviato ═══');
  const results = [];

  // 1. Notizia reale
  try {
    console.log('[CRON] 1/3 — Notizia reale...');
    const news = await generateNewsArticle();
    articlesStore.unshift(news);
    results.push('✓ Notizia: ' + news.titolo_it);
  } catch(e) { console.error('[CRON] Notizia errore:', e.message); }

  await new Promise(r => setTimeout(r, 2000)); // pausa tra chiamate

  // 2. Editoriale tematico A
  try {
    console.log('[CRON] 2/3 — Editoriale A...');
    const a = await generateEditorialArticle(0);
    articlesStore.splice(1, 0, a); // inserisce al secondo posto
    results.push('✓ Editoriale: ' + a.titolo_it);
  } catch(e) { console.error('[CRON] Editoriale A errore:', e.message); }

  await new Promise(r => setTimeout(r, 2000));

  // 3. Editoriale tematico B (argomento diverso)
  try {
    console.log('[CRON] 3/3 — Editoriale B...');
    const b = await generateEditorialArticle(7); // argomento di 7 giorni dopo
    articlesStore.splice(2, 0, b);
    results.push('✓ Editoriale: ' + b.titolo_it);
  } catch(e) { console.error('[CRON] Editoriale B errore:', e.message); }

  // Mantieni max 50 articoli (seed sempre in fondo)
  const nonSeed = articlesStore.filter(a => !a.id.startsWith('seed'));
  const seeds   = articlesStore.filter(a =>  a.id.startsWith('seed'));
  articlesStore  = [...nonSeed.slice(0, 48), ...seeds];
  saveArticles();

  console.log('[CRON] ═══ Job completato ═══');
  console.log('[CRON] Risultati:', results.join(' | '));
  console.log('[CRON] Totale articoli:', articlesStore.length);
  return results;
}


/* ════════════════════════════════════════════════════════
   CRON
   ════════════════════════════════════════════════════════ */
function setupCron() {
  try {
    const cron = require('node-cron');
    cron.schedule('0 8 * * *', function() {
      console.log('[Cron] 08:00 UTC — avvio job giornaliero');
      runDailyJob().catch(e => console.error('[Cron]', e.message));
    });
    console.log('[Cron] ✓ Schedulato alle 08:00 UTC ogni giorno');
  } catch(e) {
    console.log('[Cron] node-cron non disponibile. Usa cron-job.org → POST /api/articles/generate?secret=ADMIN_SECRET');
  }
}


/* ════════════════════════════════════════════════════════
   AUTH
   ════════════════════════════════════════════════════════ */
function requireAdmin(req, res, next) {
  const s = req.headers['x-admin-secret'] || req.query.secret;
  if (s !== ADMIN_SECRET) return res.status(403).json({ error: 'Non autorizzato' });
  next();
}


/* ════════════════════════════════════════════════════════
   ROUTES
   ════════════════════════════════════════════════════════ */
app.get('/', (req,res) => res.json({
  status:'ok', version:'7.2',
  groq:  GROQ_KEY   ?'✓':'✗',
  gemini:GEMINI_KEY ?'✓':'✗',
  articles: articlesStore.length,
  next_cron: '08:00 UTC',
}));

app.get('/api/health', (_,res) => res.json({ok:true}));
app.get('/api/ping',   (_,res) => res.json({pong:Date.now()}));

// GET tutti gli articoli
app.get('/api/articles', (req,res) => {
  const sorted = [
    ...articlesStore.filter(a=>a.isNews),           // notizie prima
    ...articlesStore.filter(a=>!a.isNews && !a.id.startsWith('seed')), // editoriali
    ...articlesStore.filter(a=>a.id.startsWith('seed')), // seed
  ];
  res.json(sorted);
});

// POST genera (admin o cron-job.org)
app.post('/api/articles/generate', requireAdmin, async (req,res) => {
  try {
    const results = await runDailyJob();
    res.json({ ok:true, results, total:articlesStore.length });
  } catch(e) {
    res.status(500).json({ error:e.message });
  }
});

// POST aggiungi articolo manuale
app.post('/api/articles', requireAdmin, (req,res) => {
  const { titolo_it, titolo_en, titolo_fr, categoria_it, testo_it, testo_en, testo_fr, immagine, autore, tipo } = req.body;
  if (!titolo_it||!testo_it) return res.status(400).json({error:'titolo_it e testo_it obbligatori'});
  const art = {
    id:'manual-'+Date.now(), type:tipo||'editorial', isNews:!!req.body.isNews,
    titolo_it, titolo_en:titolo_en||titolo_it, titolo_fr:titolo_fr||titolo_it,
    categoria_it:categoria_it||'Magazine', categoria_en:'Magazine', categoria_fr:'Magazine',
    testo_it, testo_en:testo_en||testo_it, testo_fr:testo_fr||testo_it,
    immagine:immagine||IMAGES[0], autore:autore||'Sommelier World',
    data:todayDate(), generato_ai:false,
  };
  articlesStore.unshift(art);
  saveArticles();
  res.json({ok:true, article:art});
});

// DELETE rimuovi
app.delete('/api/articles/:id', requireAdmin, (req,res) => {
  const before = articlesStore.length;
  articlesStore = articlesStore.filter(a=>a.id!==req.params.id);
  if (articlesStore.length===before) return res.status(404).json({error:'Non trovato'});
  saveArticles();
  res.json({ok:true, removed:req.params.id});
});

// Chat AI principale
app.post(['/api/chat','/api/groq','/api/gemini'], async (req,res) => {
  const system  = req.body.system||req.body.systemPrompt||'';
  const userMsg = req.body.userMsg||req.body.message||req.body.prompt||'';
  if (!userMsg&&!system) return res.status(400).json({error:'Messaggio vuoto'});
  try {
    const text = await callAI(system, userMsg);
    res.json({ text, choices:[{message:{content:text}}] });
  } catch(e) {
    res.status(500).json({error:e.message});
  }
});

// Contatti
app.post('/api/contact', (req,res) => {
  const {name,email,subject,message} = req.body||{};
  if (!name||!email||!message) return res.status(400).json({error:'Campi mancanti'});
  console.log(`[CONTACT] ${name} <${email}> | ${subject||'—'}`);
  res.json({ok:true});
});


/* ════════════════════════════════════════════════════════
   START
   ════════════════════════════════════════════════════════ */
app.listen(PORT,'0.0.0.0',()=>{
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║  🍷 SOMMELIER SERVER v7.2                     ║');
  console.log(`║  Porta: ${PORT}                                  ║`);
  console.log(`║  Groq:   ${GROQ_KEY   ?'✓ ATTIVO (notizie + editoriali)':'✗ aggiungi GROQ_API_KEY'} `);
  console.log(`║  Gemini: ${GEMINI_KEY ?'✓':'✗'}`);
  console.log(`║  Articoli: ${articlesStore.length} in memoria`);
  console.log('║  Cron: ogni giorno 08:00 UTC                  ║');
  console.log('║  (1 notizia reale + 2 editoriali al giorno)  ║');
  console.log('╚═══════════════════════════════════════════════╝\n');
  setupCron();
});
