/**
 * SOMMELIER WORLD — server.js v8.0
 */
'use strict';

const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const GROQ_KEY     = process.env.GROQ_API_KEY   || '';
const GEMINI_KEY   = process.env.GEMINI_API_KEY  || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET    || 'sommelier2026';
const SMTP_USER    = process.env.SMTP_USER       || '';
const SMTP_PASS    = process.env.SMTP_PASS       || '';
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL     || 'timotiniurie49@gmail.com';
const CLIENT_URL   = process.env.CLIENT_URL      || 'https://sommelierworld.vin';

let _articles = [];
let _lastGenDate = '';

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function callGroq(system, userMsg, maxTokens=1200){
  if(!GROQ_KEY) throw new Error('GROQ_API_KEY mancante');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ_KEY},
    body:JSON.stringify({
      model:'llama-3.3-70b-versatile',max_tokens:maxTokens,temperature:0.75,
      messages:[{role:'system',content:system},{role:'user',content:userMsg}]
    })
  });
  const d = await r.json();
  if(!r.ok) throw new Error(d.error?.message||'Groq error '+r.status);
  return d.choices?.[0]?.message?.content||'';
}

async function callGemini(prompt, maxTokens=1200){
  if(!GEMINI_KEY) throw new Error('GEMINI_API_KEY mancante');
  const model = process.env.GEMINI_MODEL||'gemini-2.0-flash';
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      contents:[{parts:[{text:prompt}]}],
      generationConfig:{maxOutputTokens:maxTokens,temperature:0.75}
    })
  });
  const d = await r.json();
  if(!r.ok) throw new Error(d.error?.message||'Gemini error');
  return d.candidates?.[0]?.content?.parts?.[0]?.text||'';
}

async function callAI(system, userMsg, maxTokens=1200){
  try{ return await callGroq(system,userMsg,maxTokens); }
  catch(e){ console.warn('[Groq→Gemini]',e.message); return await callGemini(system+'\n\n'+userMsg,maxTokens); }
}

async function sendEmail(to,subject,html){
  if(!SMTP_USER||!SMTP_PASS) return;
  try{
    const nm = require('nodemailer');
    const t = nm.createTransporter({host:'smtp.gmail.com',port:587,secure:false,auth:{user:SMTP_USER,pass:SMTP_PASS}});
    await t.sendMail({from:SMTP_USER,to,subject,html});
  }catch(e){ console.warn('[email]',e.message); }
}

/* === ROOT === */
app.get('/',(req,res)=>res.json({
  version:'8.0',groq:!!GROQ_KEY,gemini:!!GEMINI_KEY,
  email:!!SMTP_USER,articles:_articles.length,lastGen:_lastGenDate||'mai'
}));

app.get('/api/health',(req,res)=>res.json({ok:true,version:'8.0',articles:_articles.length}));

/* === SOMMELIER AI — multilingua + paese obbligatorio === */
app.post(['/api/groq','/api/chat'], async (req,res)=>{
  try{
    let { system='', userMsg='', language='it', maxTokens=1200 } = req.body;

    /* Istruzione lingua SEMPRE prima nel system */
    const LANG = {
      it:'Rispondi SEMPRE e SOLO in italiano. Non usare altre lingue.',
      en:'Reply ALWAYS and ONLY in English. Do not use other languages.',
      fr:'Réponds TOUJOURS et UNIQUEMENT en français. N\'utilise pas d\'autres langues.'
    };
    const langCmd = LANG[language]||LANG.it;
    if(!system.includes(langCmd)) system = langCmd+'\n'+system;

    const text = await callAI(system, userMsg, maxTokens);
    res.json({text,ok:true});
  }catch(e){
    console.error('[/api/groq]',e.message);
    res.status(500).json({error:e.message});
  }
});

/* === ARTICOLI === */
app.get('/api/articles',(req,res)=>res.json(_articles));

app.get('/api/articles/generate', async (req,res)=>{
  if(req.query.secret!==ADMIN_SECRET) return res.status(403).json({error:'Accesso negato'});
  try{
    const arts = await generateDailyArticles(true);
    res.json({ok:true,count:arts.length});
  }catch(e){
    console.error('[generate]',e.message);
    res.status(500).json({error:e.message});
  }
});

async function generateDailyArticles(force=false){
  const today = new Date().toISOString().split('T')[0];
  if(!force && _lastGenDate===today && _articles.length>0){
    console.log('[articles] Cache valida per oggi');
    return _articles;
  }

  const UNSPLASH = [
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
    'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&q=80',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80',
    'https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&q=80',
    'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?w=600&q=80',
    'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=600&q=80',
  ];

  const TOPICS = [
    {tag:'🗞 Notizie',   isNews:true,
     it:`Scrivi un articolo giornalistico di 280 parole su una notizia attuale del mondo del vino (2025-2026): nuovi premi, fusioni di cantine, cambiamento climatico e vigneti, nuove denominazioni, mercato dei vini pregiati. Usa fatti specifici, nomi reali, cifre. Scrivi in italiano.`,
     en:`Write a 280-word wine news article about a current 2025-2026 topic: new awards, winery mergers, climate change in vineyards, new appellations, fine wine market. Use specific facts, real names, figures. Write in English.`,
     fr:`Écris un article d'actualité vinicole de 280 mots sur un sujet 2025-2026: nouveaux prix, fusions de domaines, changement climatique, nouvelles appellations, marché des grands vins. Utilise des faits précis, noms réels, chiffres. Écris en français.`},
    {tag:'🌍 Terroir',  isNews:false,
     it:`Scrivi un articolo appassionato di 280 parole su un terroir vinicolo straordinario del mondo (scegli tra: Etna, Mosel, Santorini, Priorat, Champagne, Barolo, Mendoza, Wachau). Spiega suolo, clima, vitigni, stile del vino, produttori chiave. Scrivi in italiano.`,
     en:`Write a passionate 280-word article about an extraordinary wine terroir (choose from: Etna, Mosel, Santorini, Priorat, Champagne, Barolo, Mendoza, Wachau). Explain soil, climate, grapes, wine style, key producers. Write in English.`,
     fr:`Écris un article passionné de 280 mots sur un terroir viticole extraordinaire (choisis parmi: Etna, Moselle, Santorin, Priorat, Champagne, Barolo, Mendoza, Wachau). Explique sol, climat, cépages, style, producteurs clés. Écris en français.`},
    {tag:'📚 Sommelier', isNews:false,
     it:`Scrivi un articolo tecnico-pratico di 280 parole su una tecnica del sommelier o di degustazione: decantazione, temperatura di servizio, abbinamento cibo-vino, lettura delle etichette, annate migliori. Sii preciso e usa esempi concreti. Scrivi in italiano.`,
     en:`Write a 280-word technical article about a sommelier or tasting technique: decanting, serving temperature, food pairing, reading labels, best vintages. Be precise with concrete examples. Write in English.`,
     fr:`Écris un article technique de 280 mots sur une technique de sommelier ou dégustation: décantation, température de service, accord mets-vins, lecture des étiquettes, meilleurs millésimes. Sois précis avec exemples concrets. Écris en français.`},
    {tag:'🍷 Viticoltura', isNews:false,
     it:`Scrivi un articolo di 280 parole sulla viticoltura: potatura, vendemmia, allevamento della vite, biodinamica, cambiamento climatico e adattamenti. Usa esempi di vignaioli reali e pratiche concrete. Scrivi in italiano.`,
     en:`Write a 280-word article about viticulture: pruning, harvest, vine training, biodynamic farming, climate change adaptations. Use real winegrower examples and concrete practices. Write in English.`,
     fr:`Écris un article de 280 mots sur la viticulture: taille, vendange, conduite de la vigne, biodynamie, adaptation au changement climatique. Utilise des exemples de vignerons réels et pratiques concrètes. Écris en français.`},
    {tag:'✨ Produttori', isNews:false,
     it:`Scrivi un profilo di 280 parole su un produttore vinicolo eccellente del mondo (scegli tra: DRC, Egon Müller, Quintarelli, Penfolds, Catena Zapata, Sassicaia, Henschke, Selosse). Storia, filosofia, vini iconici, prezzi, perché vale la pena. Scrivi in italiano.`,
     en:`Write a 280-word profile of an outstanding world wine producer (choose from: DRC, Egon Müller, Quintarelli, Penfolds, Catena Zapata, Sassicaia, Henschke, Selosse). History, philosophy, iconic wines, prices, why worth it. Write in English.`,
     fr:`Écris un profil de 280 mots sur un producteur de vin exceptionnel (choisis parmi: DRC, Egon Müller, Quintarelli, Penfolds, Catena Zapata, Sassicaia, Henschke, Selosse). Histoire, philosophie, vins iconiques, prix, pourquoi ça vaut. Écris en français.`},
  ];

  const SYS = 'Sei un esperto giornalista enogastronomico. Scrivi in modo preciso, appassionato e mai generico. Usa sempre nomi reali, cifre concrete, produttori specifici.';
  const arts = [];

  for(let i=0;i<TOPICS.length;i++){
    const T = TOPICS[i];
    try{
      /* Italiano */
      const txt_it = await callAI(SYS+' Rispondi SOLO in italiano.', T.it, 700);
      await sleep(700);
      const tit_it = await callAI('Sei un editor. Rispondi SOLO con il titolo (max 8 parole), nient\'altro.',
        `Crea un titolo per: ${txt_it.substring(0,150)}`, 50);
      await sleep(500);

      /* Inglese */
      const txt_en = await callAI(SYS+' Reply ONLY in English.', T.en, 700);
      await sleep(700);
      const tit_en = await callAI('You are an editor. Reply ONLY with the title (max 8 words), nothing else.',
        `Create a title for: ${txt_en.substring(0,150)}`, 50);
      await sleep(500);

      /* Francese */
      const txt_fr = await callAI(SYS+' Réponds UNIQUEMENT en français.', T.fr, 700);
      await sleep(700);
      const tit_fr = await callAI('Tu es un éditeur. Réponds UNIQUEMENT avec le titre (max 8 mots), rien d\'autre.',
        `Crée un titre pour: ${txt_fr.substring(0,150)}`, 50);
      await sleep(500);

      arts.push({
        id:`art_${today}_${i}`,
        isNews: T.isNews,
        generato_ai: true,
        categoria_it:T.tag, categoria_en:T.tag, categoria_fr:T.tag,
        titolo_it: tit_it.trim().replace(/^["'«»]+|["'«»]+$/g,''),
        titolo_en: tit_en.trim().replace(/^["'«»]+|["'«»]+$/g,''),
        titolo_fr: tit_fr.trim().replace(/^["'«»]+|["'«»]+$/g,''),
        testo_it: txt_it.trim(),
        testo_en: txt_en.trim(),
        testo_fr: txt_fr.trim(),
        autore: 'Sommelier World AI',
        data: new Date().toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}),
        immagine: UNSPLASH[i % UNSPLASH.length]
      });

      console.log(`[articles] ${i+1}/${TOPICS.length} ✓ "${arts[arts.length-1].titolo_it}"`);

    }catch(e){ console.error(`[articles] topic ${i} errore:`,e.message); }
  }

  if(arts.length>0){ _articles=arts; _lastGenDate=today; }
  return arts;
}

/* === CONTATTI === */
app.post('/api/contact', async (req,res)=>{
  const {name='',email='',subject='',message=''} = req.body;
  if(!name||!email||!message) return res.status(400).json({error:'Campi mancanti'});

  const html = `<div style="font-family:sans-serif;max-width:600px;">
    <h2 style="color:#8B0000;">📩 Messaggio da SommelierWorld</h2>
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Argomento:</strong> ${subject||'—'}</p>
    <p><strong>Messaggio:</strong></p>
    <blockquote style="border-left:3px solid #BF9B4A;padding-left:12px;">${message.replace(/\n/g,'<br>')}</blockquote>
    <hr><small>Inviato da ${CLIENT_URL}</small></div>`;

  try{
    await sendEmail(ADMIN_EMAIL, `[SW] ${subject||'Msg da '+name}`, html);
    res.json({ok:true});
  }catch(e){ res.json({ok:true,warn:e.message}); }
});

/* === CRON === */
function startCron(){
  const HOUR_UTC = 7;
  function scheduleNext(){
    const now=new Date();
    const next=new Date(now);
    next.setUTCHours(HOUR_UTC,0,0,0);
    if(next<=now) next.setUTCDate(next.getUTCDate()+1);
    const delay=next-now;
    console.log(`[cron] Prossima gen: ${next.toISOString()} (fra ${Math.round(delay/60000)} min)`);
    setTimeout(async()=>{
      console.log('[cron] Generazione…');
      try{ await generateDailyArticles(true); }catch(e){ console.error('[cron]',e.message); }
      scheduleNext();
    },delay);
  }
  scheduleNext();
}

/* === AVVIO === */
app.listen(PORT,'0.0.0.0',async()=>{
  console.log(`\n🍷 Sommelier World Server v8.0 — porta ${PORT}`);
  console.log(`   Groq:${GROQ_KEY?'✓':'✗'} Gemini:${GEMINI_KEY?'✓':'✗'} Email:${SMTP_USER?'✓':'✗'}`);
  startCron();
  if(_articles.length===0&&(GROQ_KEY||GEMINI_KEY)){
    console.log('[startup] Generazione articoli iniziali…');
    generateDailyArticles().catch(e=>console.warn('[startup]',e.message));
  }
});
