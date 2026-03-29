/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v6  —  FIX COMPLETO                    ║
 * ║                                                                   ║
 * ║  PROBLEMI RISOLTI:                                               ║
 * ║  ✓ AI non genera per gli amici → tutto via Railway (no key)      ║
 * ║  ✓ Railway cold-start (30s sleep) → wake-up ping + skeleton UI  ║
 * ║  ✓ Eventi non disponibili → generati dall'AI (no API esterne)    ║
 * ║  ✓ Foto Pexels: Hero slideshow + Gallery + Terroir BG            ║
 * ║  ✓ Wizard abbinamento 3-step da ristorante                       ║
 * ║  ✓ Preferiti con localStorage (vino+piatto+spiegazione)          ║
 * ║  ✓ Contrasto + mobile-first + lazy loading                       ║
 * ║  ✓ Chat history (memoria conversazione)                          ║
 * ║  ✓ Gemini: filtri corpo/piatto, spiegazione abbinamento          ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * INSTALLAZIONE: aggiungi UNA SOLA riga in index.html prima di </body>
 *   <script src="sw-patch-v6.js"></script>
 *
 * Sostituisce sw-patch-v4.js e sw-patch-v5.js (non servono più)
 */

(function () {
  'use strict';

  const SERVER   = 'https://sommelier-server-production-8f92.up.railway.app';
  const LS_FAV   = 'sw_favorites_v1';
  const LS_HIST  = 'sw_chat_history_v1';
  const MAX_HIST = 8;

  /* ═══════════════════════════════════════════════════════
     1. WAKE-UP RAILWAY
     Ping silenzioso appena la pagina si apre, così quando
     l'utente preme "Consulta" il server è già sveglio.
  ═══════════════════════════════════════════════════════ */
  let serverAwake = false;
  let _wakeP = null;

  function wakeServer() {
    if (serverAwake) return Promise.resolve();
    if (_wakeP) return _wakeP;
    _wakeP = fetch(SERVER + '/health', { signal: AbortSignal.timeout(35000) })
      .then(() => { serverAwake = true; console.log('[SW-v6] Server sveglio ✓'); })
      .catch(() => console.warn('[SW-v6] Server non risponde'));
    return _wakeP;
  }

  /* ═══════════════════════════════════════════════════════
     2. SYSTEM PROMPT PROFESSIONALE
  ═══════════════════════════════════════════════════════ */
  const SYS = `Sei il Maestro Sommelier di Sommelier World. Parli con la precisione di un Master of Wine e la poesia di chi vive tra vigne e cantine.

REGOLE:
• Mai citare prezzi — cambiano tra ristorante, enoteca e cantina
• Cita produttori reali (Giacomo Conterno, Gaja, Antinori, López de Heredia, Domaine Leflaive…)
• Specifica denominazione e annata consigliata o range (es. "cerca 2016-2019")
• Spiega SEMPRE perché l'abbinamento funziona (acidità, tannini, struttura, grassezza del piatto)
• Mantieni memoria della conversazione
• Suggerisci 2 vini: uno classico, uno sorpresa
• Tono: poetico ma diretto, da sommelier di ristorante stellato
• Lingua: italiano salvo l'utente scriva altrimenti`;

  /* ═══════════════════════════════════════════════════════
     3. CHAT HISTORY (session storage — dura la sessione)
  ═══════════════════════════════════════════════════════ */
  let hist = (() => { try { return JSON.parse(sessionStorage.getItem(LS_HIST) || '[]'); } catch { return []; } })();

  function addHist(role, content) {
    hist.push({ role, content });
    if (hist.length > MAX_HIST * 2) hist = hist.slice(-MAX_HIST * 2);
    try { sessionStorage.setItem(LS_HIST, JSON.stringify(hist)); } catch {}
  }

  /* ═══════════════════════════════════════════════════════
     4. CHIAMATA AI — ordine: Railway → Groq diretto → fallback
     Gli amici usano Railway (no key necessaria).
     Tu usi Railway + fallback Groq con la tua key.
  ═══════════════════════════════════════════════════════ */
  async function ask(userMsg) {
    addHist('user', userMsg);
    const messages = [{ role: 'system', content: SYS }, ...hist.slice(0, -1), { role: 'user', content: userMsg }];

    // A) Railway (funziona per tutti, usa GROQ_API_KEY del server)
    try {
      await wakeServer();
      const r = await fetch(SERVER + '/api/sommelier-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: AbortSignal.timeout(30000),
      });
      if (r.ok) {
        const d = await r.json();
        const reply = d.content || d.reply || '';
        if (reply) { addHist('assistant', reply); return reply; }
      }
    } catch (e) { console.warn('[SW-v6] Railway:', e.message); }

    // B) Groq diretto (fallback con tua key personale)
    const key = localStorage.getItem('groqApiKey') || localStorage.getItem('groq_api_key') || '';
    if (key) {
      try {
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages, max_tokens: 1800, temperature: 0.75 }),
          signal: AbortSignal.timeout(20000),
        });
        if (r.ok) {
          const d = await r.json();
          const reply = d.choices?.[0]?.message?.content || '';
          if (reply) { addHist('assistant', reply); return reply; }
        }
      } catch (e) { console.warn('[SW-v6] Groq diretto:', e.message); }
    }

    // C) Messaggio di emergenza
    const fb = 'Il Sommelier è momentaneamente in cantina 🍷\n\nIl server si sta svegliando — riprova tra 20 secondi. Se il problema persiste, aggiorna la pagina.';
    addHist('assistant', fb);
    return fb;
  }

  window.SW_askSommelier = ask;

  /* ═══════════════════════════════════════════════════════
     5. HOOK FUNZIONI AI ESISTENTI (callAPI / callAPILong)
     Il codice originale chiama queste funzioni con la key
     Groq del localStorage. Le reindirizziamo a Railway.
  ═══════════════════════════════════════════════════════ */
  function hookOriginalAI() {
    ['callAPI', 'callAPILong'].forEach(fn => {
      if (typeof window[fn] === 'function') {
        const orig = window[fn];
        window[fn] = async (prompt, ...rest) => {
          try { return await ask(prompt); }
          catch { return orig(prompt, ...rest); }
        };
        console.log('[SW-v6] Reindirizzato ' + fn + ' → Railway ✓');
      }
    });

    // Intercetta pulsante "CONSULTA IL SOMMELIER" se callAPI non è definita
    function tryPatch() {
      const btn = Array.from(document.querySelectorAll('button,[onclick]'))
        .find(el => !el.dataset.swp && /consulta|sommelier/i.test(el.textContent));
      if (!btn) return;
      btn.dataset.swp = '1';

      btn.addEventListener('click', async e => {
        const sect = btn.closest('section,#sommelier,[data-tab="sommelier"]') || document.body;
        const inp  = sect.querySelector('input[type="text"],textarea');
        if (!inp?.value.trim()) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const q = inp.value.trim();
        let out = sect.querySelector('[id*="result"],[class*="result"],[id*="answer"]');
        if (!out) {
          out = document.createElement('div');
          out.style.cssText = 'margin:20px 0;padding:20px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(212,168,83,.2);font-family:Georgia,serif;color:#d4c9b5;line-height:1.75;';
          btn.parentNode.insertBefore(out, btn.nextSibling);
        }

        out.innerHTML = '<div style="display:flex;align-items:center;gap:12px;color:rgba(212,168,83,.6);font-family:Georgia,serif;font-size:14px;letter-spacing:1px;"><div style="font-size:28px;animation:swSpin 2s linear infinite">🍷</div><div>Il Sommelier sta valutando…<br><span style="font-size:11px;opacity:.6">~20s se il server era inattivo</span></div></div>';

        const reply = await ask(q);
        out.innerHTML = '<div style="margin-bottom:14px;font-size:15px;line-height:1.8;">' + reply.replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div>';
        savBtn(out, reply, q);
        updateBadge();
      }, true);
    }

    let att = 0;
    const iv = setInterval(() => { tryPatch(); if (++att > 30) clearInterval(iv); }, 400);
  }

  /* ═══════════════════════════════════════════════════════
     6. EVENTI AI — niente API esterne, tutto generato
  ═══════════════════════════════════════════════════════ */
  const EV_KEY = 'sw_events_v1';
  const EV_TTL = 6 * 3600 * 1000;

  const EV_STATIC = [
    { titolo:'Barolo Experience 2026',  luogo:'La Morra, Cuneo',     data:'Sab 4 Apr 2026',   tipo:'Degustazione', e:'🍷', desc:'Verticale Barolo 2016-2020 con i produttori delle Langhe.' },
    { titolo:'Vinitaly 2026',           luogo:'Fiera di Verona',     data:'6-9 Apr 2026',      tipo:'Fiera',        e:'🏛', desc:'Il più grande salone del vino italiano. 4.000 espositori.' },
    { titolo:'Champagne & Jazz',        luogo:'Milano, Navigli',     data:'Ven 10 Apr 2026',   tipo:'Evento',       e:'🥂', desc:'Maison di Champagne e musica dal vivo tra i Navigli.' },
    { titolo:'Masterclass Nebbiolo',    luogo:'Torino',              data:'Dom 12 Apr 2026',   tipo:'Masterclass',  e:'🎓', desc:'Barolo, Barbaresco e Langhe Nebbiolo a confronto.' },
    { titolo:'Tuscany Wine Week',       luogo:'Firenze',             data:'18-20 Apr 2026',    tipo:'Settimana',    e:'🌿', desc:'Brunello, Chianti Classico e Supertuscan nelle cantine aperte.' },
    { titolo:'Orange Wine Festival',    luogo:'Trieste',             data:'Sab 25 Apr 2026',   tipo:'Festival',     e:'🧡', desc:'Vini macerati e naturali da Slovenia, Friuli e Georgia.' },
  ];

  async function getEvents() {
    try {
      const c = JSON.parse(localStorage.getItem(EV_KEY) || 'null');
      if (c && Date.now() - c.ts < EV_TTL) return c.data;
    } catch {}

    try {
      await wakeServer();
      const r = await fetch(SERVER + '/api/sommelier-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          { role:'system', content:'Rispondi SOLO con un JSON array valido, senza markdown, senza testo aggiuntivo.' },
          { role:'user', content:'Crea 6 eventi realistici del vino in Europa Aprile-Maggio 2026. Campi: titolo, luogo, data, tipo (Degustazione/Fiera/Masterclass/Festival), e (emoji), desc (max 80 chars). Solo JSON array.' },
        ]}),
        signal: AbortSignal.timeout(18000),
      });
      if (r.ok) {
        const d = await r.json();
        const txt = (d.content || d.reply || '').replace(/```json|```/g,'').trim();
        const ev = JSON.parse(txt);
        if (Array.isArray(ev) && ev.length > 0) {
          localStorage.setItem(EV_KEY, JSON.stringify({ ts: Date.now(), data: ev }));
          return ev;
        }
      }
    } catch {}

    return EV_STATIC;
  }

  function showEvents(evs) {
    const sec = document.querySelector('#eventi,[data-tab="eventi"],.eventi-section');
    if (!sec) return;

    Array.from(sec.querySelectorAll('*'))
      .filter(el => /non disponibil|riprova/i.test(el.textContent) && el.children.length < 3)
      .forEach(el => { el.style.display = 'none'; });

    document.querySelector('#sw-ev-grid')?.remove();
    const g = document.createElement('div');
    g.id = 'sw-ev-grid';
    g.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px;padding:18px 0;';
    g.innerHTML = evs.map(ev => `
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,168,83,.18);border-radius:10px;padding:16px;font-family:Georgia,serif;transition:border-color .2s,transform .2s;"
           onmouseenter="this.style.borderColor='rgba(212,168,83,.42)';this.style.transform='translateY(-2px)'"
           onmouseleave="this.style.borderColor='rgba(212,168,83,.18)';this.style.transform='translateY(0)'">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:9px;">
          <span style="font-size:24px">${ev.e||'🍷'}</span>
          <div>
            <div style="font-size:10px;color:rgba(212,168,83,.6);letter-spacing:2px;text-transform:uppercase;">${ev.tipo||'Evento'}</div>
            <div style="font-size:14px;color:#f0e8d8;font-weight:bold;line-height:1.3;">${ev.titolo}</div>
          </div>
        </div>
        <div style="font-size:11px;color:rgba(200,180,150,.5);margin-bottom:6px;letter-spacing:1px;">📍 ${ev.luogo} &nbsp;·&nbsp; 📅 ${ev.data}</div>
        <div style="font-size:12px;color:#c8bfb0;line-height:1.6;">${ev.desc}</div>
      </div>`).join('');
    sec.appendChild(g);
  }

  async function initEvents() {
    const sec = document.querySelector('#eventi,[data-tab="eventi"],.eventi-section');
    if (!sec || sec.dataset.swEv) return;
    sec.dataset.swEv = '1';

    const sk = document.createElement('div');
    sk.style.cssText = 'padding:20px;text-align:center;color:rgba(212,168,83,.5);font-family:Georgia,serif;letter-spacing:2px;font-size:13px;';
    sk.textContent = '⏳ Caricamento eventi…';
    sec.appendChild(sk);

    const evs = await getEvents();
    sk.remove();
    showEvents(evs);

    // Bottone aggiorna
    sec.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.swEv) return;
      btn.dataset.swEv = '1';
      btn.addEventListener('click', async () => {
        localStorage.removeItem(EV_KEY);
        document.querySelector('#sw-ev-grid')?.remove();
        sec.appendChild(sk);
        const fresh = await getEvents();
        sk.remove();
        showEvents(fresh);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     7. FOTO PEXELS
  ═══════════════════════════════════════════════════════ */
  const px = (id, w=1400, h=800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;

  const HERO_PHOTOS = [
    { id:442116,  c:'Terroir · Vigna al tramonto' },
    { id:2702805, c:'Cantina · Affinamento in botte' },
    { id:1182264, c:'Vendemmia · Grappoli maturi' },
    { id:3850838, c:'Degustazione · L\'arte del Sommelier' },
    { id:4113579, c:'Filari · La geometria del vigneto' },
  ];
  const GALLERY_PHOTOS = [
    { id:442116, l:'Vigneto' }, { id:2702805, l:'Cantina' }, { id:1182264, l:'Vendemmia' },
    { id:3850838, l:'Sommelier' }, { id:1407846, l:'Degustazione' }, { id:3407777, l:'Winery' },
  ];

  function injectHero() {
    if (document.querySelector('#sw-hero')) return;
    const home = document.querySelector('#home,[data-tab="home"],.home-section,section:first-of-type');
    if (!home) return;

    const wrap = document.createElement('div');
    wrap.id = 'sw-hero';
    wrap.style.cssText = 'position:relative;width:100%;height:clamp(280px,55vw,520px);overflow:hidden;';

    HERO_PHOTOS.forEach((p, i) => {
      const s = document.createElement('div');
      s.className = 'sw-sl';
      s.style.cssText = `position:absolute;inset:0;background:url('${px(p.id)}') center/cover no-repeat;opacity:${i===0?1:0};transition:opacity 1.4s ease;`;
      s.insertAdjacentHTML('beforeend', '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,5,2,.3),rgba(10,5,2,.65) 65%,rgba(10,5,2,.88));"></div>');
      wrap.appendChild(s);
    });

    wrap.insertAdjacentHTML('beforeend', `
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:5;pointer-events:none;text-align:center;padding:0 20px;">
        <div style="font-family:Georgia,serif;font-size:clamp(26px,7vw,62px);color:#fff;letter-spacing:6px;text-transform:uppercase;text-shadow:0 4px 24px rgba(0,0,0,.6);font-weight:300;">Sommelier World</div>
        <div style="font-family:Georgia,serif;font-size:clamp(12px,2.5vw,17px);color:rgba(212,168,83,.9);letter-spacing:4px;text-transform:uppercase;font-style:italic;margin-top:10px;text-shadow:0 2px 12px rgba(0,0,0,.5);">Dal suolo al bicchiere</div>
      </div>`);

    const dots = document.createElement('div');
    dots.style.cssText = 'position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:10;';
    HERO_PHOTOS.forEach((_, i) => {
      const d = document.createElement('div');
      d.style.cssText = `width:${i===0?20:6}px;height:6px;border-radius:3px;background:${i===0?'#d4a853':'rgba(255,255,255,.35)'};transition:all .4s;cursor:pointer;`;
      d.onclick = () => go(i);
      dots.appendChild(d);
    });
    wrap.appendChild(dots);
    home.insertBefore(wrap, home.firstChild);

    let cur = 0;
    const slides = wrap.querySelectorAll('.sw-sl');
    const dotEls = dots.querySelectorAll('div');
    function go(n) {
      slides[cur].style.opacity=0; dotEls[cur].style.width='6px'; dotEls[cur].style.background='rgba(255,255,255,.35)';
      cur=n; slides[cur].style.opacity=1; dotEls[cur].style.width='20px'; dotEls[cur].style.background='#d4a853';
    }
    setInterval(() => go((cur+1)%slides.length), 5000);
  }

  function injectGallery() {
    if (document.querySelector('#sw-gallery')) return;
    const home = document.querySelector('#home,[data-tab="home"],.home-section,section:first-of-type');
    if (!home) return;
    const el = document.createElement('div');
    el.id = 'sw-gallery';
    el.innerHTML = `<div style="padding:40px 16px 48px;background:#0d0803;border-top:1px solid rgba(139,90,43,.2);border-bottom:1px solid rgba(139,90,43,.2);">
      <div style="text-align:center;margin-bottom:26px;font-family:Georgia,serif;color:rgba(212,168,83,.7);letter-spacing:4px;text-transform:uppercase;font-size:12px;">· Il Mondo del Vino ·</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:900px;margin:0 auto;" id="sw-gal-grid">
        ${GALLERY_PHOTOS.map(p=>`<div style="position:relative;border-radius:6px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 4px 20px rgba(0,0,0,.4);" onmouseenter="this.querySelector('img').style.transform='scale(1.06)'" onmouseleave="this.querySelector('img').style.transform='scale(1)'"><img src="${px(p.id,600,450)}" alt="${p.l}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .5s;display:block;"><div style="position:absolute;bottom:0;left:0;right:0;padding:10px 12px;background:linear-gradient(transparent,rgba(0,0,0,.7));color:rgba(255,255,255,.8);font-family:Georgia,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">${p.l}</div></div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:12px;font-size:10px;color:rgba(255,255,255,.2);font-family:Georgia,serif;">Photo credits: Pexels</div>
    </div>`;
    const children = Array.from(home.children);
    (children[2] || home.lastElementChild)?.parentNode.insertBefore(el, (children[2] || home.lastElementChild)?.nextSibling);
  }

  function injectTerroirBg() {
    const sec = document.querySelector('#terroir,[data-tab="terroir"],.terroir-section');
    if (!sec || sec.dataset.swBg) return;
    sec.dataset.swBg = '1';
    Object.assign(sec.style, { backgroundImage:`url('${px(442116,1600,900)}')`, backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed', position:'relative' });
    const ov = document.createElement('div');
    ov.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;background:linear-gradient(to bottom,rgba(8,4,1,.88),rgba(8,4,1,.75) 50%,rgba(8,4,1,.92));';
    sec.insertBefore(ov, sec.firstChild);
    Array.from(sec.children).forEach(c => { if (c!==ov) { c.style.position='relative'; c.style.zIndex='1'; } });
  }

  /* ═══════════════════════════════════════════════════════
     8. CSS GLOBALE
  ═══════════════════════════════════════════════════════ */
  function injectCSS() {
    if (document.querySelector('#sw-v6-css')) return;
    const s = document.createElement('style');
    s.id = 'sw-v6-css';
    s.textContent = `
      body{color:#e8e0d0!important;-webkit-font-smoothing:antialiased;}
      p,.desc,.description{color:#d4c9b5!important;line-height:1.75!important;}
      h1,h2,h3,h4{color:#f0e8d8!important;}
      a{color:#d4a853!important;} a:hover{color:#e8c87a!important;}
      input,textarea,select{background:rgba(255,255,255,.07)!important;color:#f0e8d8!important;border:1px solid rgba(212,168,83,.3)!important;border-radius:6px!important;padding:10px 14px!important;font-size:16px!important;}
      input::placeholder,textarea::placeholder{color:rgba(200,185,160,.45)!important;}
      input:focus,textarea:focus,select:focus{border-color:rgba(212,168,83,.7)!important;outline:none!important;box-shadow:0 0 0 2px rgba(212,168,83,.12)!important;}
      button,.btn{min-height:44px!important;}
      ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:#0d0803;} ::-webkit-scrollbar-thumb{background:rgba(139,90,43,.5);border-radius:3px;}
      img[loading="lazy"]{opacity:0;transition:opacity .5s;} img[loading="lazy"].sw-vis{opacity:1;}
      @media(max-width:480px){h1{font-size:clamp(20px,7vw,32px)!important;}h2{font-size:clamp(17px,5vw,24px)!important;}body{overflow-x:hidden!important;}#sw-gal-grid{grid-template-columns:repeat(2,1fr)!important;}}
      @keyframes swFI{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes swSL{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
      @keyframes swHB{0%,100%{transform:scale(1)}30%{transform:scale(1.4)}60%{transform:scale(1.15)}}
      @keyframes swSpin{to{transform:rotate(360deg)}}
    `;
    document.head.appendChild(s);

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('sw-vis');obs.unobserve(e.target);} }), { rootMargin:'200px' });
      const observe = img => obs.observe(img);
      document.querySelectorAll('img[loading="lazy"]').forEach(observe);
      new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
        if (n.tagName==='IMG'&&n.getAttribute('loading')==='lazy') observe(n);
        if (n.querySelectorAll) n.querySelectorAll('img[loading="lazy"]').forEach(observe);
      }))).observe(document.body, { childList:true, subtree:true });
    }
  }

  /* ═══════════════════════════════════════════════════════
     9. PREFERITI
  ═══════════════════════════════════════════════════════ */
  const F = {
    all()  { try{return JSON.parse(localStorage.getItem(LS_FAV)||'[]');}catch{return[];} },
    add(x) { const l=this.all(); l.unshift({id:Date.now(),date:new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'short',year:'numeric'}),...x}); if(l.length>50)l.pop(); localStorage.setItem(LS_FAV,JSON.stringify(l)); },
    del(id){ localStorage.setItem(LS_FAV,JSON.stringify(this.all().filter(f=>f.id!==id))); },
    clr()  { localStorage.removeItem(LS_FAV); },
  };

  function parse(text) {
    return {
      wine: text.match(/(?:vino\s+(?:consigliato|ideale)|raccomando)[:\s]+([^\n.]{5,80})/i)?.[1]?.trim()||'',
      food: text.match(/(?:con|per|abbinamento con)[:\s]+([^\n.]{5,60})/i)?.[1]?.trim()||'',
      explanation: text.match(/(?:perch[eé]|l'acidit|tannin|struttura|funziona)[^\n.]{10,}[.!]/i)?.[0]?.trim()||text.slice(0,160)+'…',
    };
  }

  function savBtn(el, text, query) {
    el.querySelectorAll('.sw-sb').forEach(b=>b.remove());
    const p = parse(text);
    if (query && !p.food) p.food = query.slice(0,60);
    const b = document.createElement('button');
    b.className = 'sw-sb';
    b.innerHTML = '♥ Salva abbinamento';
    b.style.cssText = 'margin-top:12px;padding:9px 20px;background:transparent;border:1px solid rgba(212,168,83,.35);color:#d4a853;border-radius:6px;cursor:pointer;font-family:Georgia,serif;font-size:13px;letter-spacing:1.5px;transition:all .2s;';
    b.onmouseenter=()=>{b.style.background='rgba(212,168,83,.1)';b.style.borderColor='#d4a853';};
    b.onmouseleave=()=>{b.style.background='transparent';b.style.borderColor='rgba(212,168,83,.35)';};
    b.onclick=()=>{ F.add({...p,rawText:text}); b.innerHTML='♥ Salvato!'; b.style.color='#4caf50'; b.style.animation='swHB .6s'; renderFavs(); updateBadge(); toast('♥ Salvato!','success'); setTimeout(()=>{b.disabled=true;b.style.opacity='.5';},1200); };
    el.appendChild(b);
  }

  function buildFavPanel() {
    if (document.querySelector('#sw-fp')) return;
    const p = document.createElement('div');
    p.id='sw-fp';
    p.style.cssText='display:none;position:fixed;top:0;right:0;width:min(420px,100vw);height:100dvh;background:#100a04;z-index:99998;border-left:1px solid rgba(212,168,83,.2);box-shadow:-8px 0 40px rgba(0,0,0,.7);flex-direction:column;overflow:hidden;animation:swSL .3s ease;font-family:Georgia,serif;';
    p.innerHTML=`<div style="padding:18px 20px 14px;border-bottom:1px solid rgba(212,168,83,.12);display:flex;align-items:center;justify-content:space-between;background:#0d0803;flex-shrink:0;"><div><div style="font-size:17px;color:#d4a853;letter-spacing:2px;text-transform:uppercase;">♥ I Miei Preferiti</div><div id="sw-fc" style="font-size:11px;color:rgba(200,180,150,.5);margin-top:2px;letter-spacing:1px;">0 abbinamenti</div></div><div style="display:flex;gap:8px;"><button onclick="SW_V6.clrFavs()" style="background:transparent;border:1px solid rgba(200,80,80,.3);color:rgba(200,100,100,.6);padding:5px 9px;border-radius:4px;cursor:pointer;font-size:11px;">🗑 Tutti</button><button onclick="SW_V6.closeFavs()" style="background:transparent;border:none;color:rgba(200,185,160,.5);font-size:22px;cursor:pointer;padding:2px 8px;line-height:1;">✕</button></div></div><div id="sw-fl" style="flex:1;overflow-y:auto;padding:14px;"></div>`;
    document.body.appendChild(p);
    renderFavs();
  }

  function renderFavs() {
    const l=document.querySelector('#sw-fl'), c=document.querySelector('#sw-fc');
    if (!l) return;
    const favs=F.all();
    if (c) c.textContent=favs.length+' abbinament'+(favs.length!==1?'i':'o')+' salvat'+(favs.length!==1?'i':'o');
    if (!favs.length){ l.innerHTML='<div style="text-align:center;padding:60px 20px;color:rgba(200,180,150,.4);font-size:14px;line-height:1.8;"><div style="font-size:36px;margin-bottom:14px">🍷</div>Nessun abbinamento salvato.<br>Consulta il Sommelier e salva<br>i tuoi preferiti con ♥</div>'; return; }
    l.innerHTML=favs.map(f=>`<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,168,83,.15);border-radius:8px;padding:15px;margin-bottom:12px;animation:swFI .3s ease;" onmouseenter="this.style.borderColor='rgba(212,168,83,.35)'" onmouseleave="this.style.borderColor='rgba(212,168,83,.15)'"><div style="font-size:10px;color:rgba(200,180,150,.4);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">${f.date}</div>${f.wine?`<div style="margin-bottom:6px;"><span style="font-size:10px;color:#d4a853;letter-spacing:2px;text-transform:uppercase;">🍷 Vino</span><br><span style="font-size:14px;color:#f0e8d8;font-weight:bold;">${f.wine}</span></div>`:''} ${f.food?`<div style="margin-bottom:6px;"><span style="font-size:10px;color:rgba(200,180,150,.5);letter-spacing:2px;text-transform:uppercase;">🍽 Piatto</span><br><span style="font-size:13px;color:#d4c9b5;">${f.food}</span></div>`:''}<div style="font-size:12px;color:rgba(200,180,150,.7);line-height:1.6;font-style:italic;border-top:1px solid rgba(212,168,83,.1);padding-top:8px;margin-top:6px;">${f.explanation}</div><div style="display:flex;gap:8px;margin-top:10px;"><button onclick="SW_V6.delFav(${f.id})" style="flex:1;background:transparent;border:1px solid rgba(200,80,80,.25);color:rgba(200,100,100,.6);padding:7px 0;border-radius:4px;cursor:pointer;font-size:11px;letter-spacing:1px;">🗑 Rimuovi</button><button onclick="SW_V6.shareFav(${f.id})" style="flex:1;background:transparent;border:1px solid rgba(212,168,83,.25);color:rgba(212,168,83,.6);padding:7px 0;border-radius:4px;cursor:pointer;font-size:11px;letter-spacing:1px;">↗ Condividi</button></div></div>`).join('');
  }

  function updateBadge() {
    const b=document.querySelector('#sw-fb'); if(!b) return;
    const n=F.all().length; b.textContent=n>9?'9+':n; b.style.display=n>0?'flex':'none';
  }

  function injectFABFavs() {
    if (document.querySelector('#sw-fav-btn')) return;
    const btn=document.createElement('button'); btn.id='sw-fav-btn'; btn.title='I miei preferiti';
    btn.style.cssText='position:fixed;bottom:84px;right:18px;width:52px;height:52px;border-radius:50%;background:#8b2635;border:1px solid rgba(212,168,83,.4);color:#f0e8d8;font-size:22px;cursor:pointer;z-index:9997;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:all .25s;display:flex;align-items:center;justify-content:center;';
    btn.innerHTML='♥';
    const bdg=document.createElement('div'); bdg.id='sw-fb';
    bdg.style.cssText='position:absolute;top:-3px;right:-3px;width:19px;height:19px;border-radius:50%;background:#d4a853;color:#0d0803;font-size:10px;font-weight:bold;display:none;align-items:center;justify-content:center;font-family:Arial,sans-serif;';
    btn.appendChild(bdg);
    btn.onmouseenter=()=>{btn.style.transform='scale(1.1)';btn.style.background='#a0303f';};
    btn.onmouseleave=()=>{btn.style.transform='scale(1)';btn.style.background='#8b2635';};
    btn.onclick=()=>SW_V6.openFavs();
    document.body.appendChild(btn);
    updateBadge();
  }

  /* ═══════════════════════════════════════════════════════
     10. WIZARD ABBINAMENTO RAPIDO
  ═══════════════════════════════════════════════════════ */
  const STEPS=[
    {q:'Cosa stai mangiando?',i:'🍽',o:[{l:'🥩 Carne rossa',v:'carne rossa (bistecca, brasato, selvaggina)'},{l:'🐟 Pesce',v:'pesce (branzino, orata, salmone, frutti di mare)'},{l:'🍝 Pasta / Risotto',v:'pasta o risotto (ragù, burro, frutti di mare)'},{l:'🧀 Formaggi',v:'formaggi (stagionati, erborinati, freschi)'},{l:'🥗 Vegetariano',v:'piatto vegetariano (verdure, legumi, cereali)'},{l:'🍰 Dolce',v:'dessert (torta al cioccolato, tiramisù, panna cotta)'}]},
    {q:'Che corpo preferisci?',i:'🎨',o:[{l:'🌿 Leggero & Fresco',v:'vino leggero, fresco, alta acidità, poco tannino'},{l:'🏋 Strutturato & Potente',v:'vino corposo, tannico, concentrato'},{l:'🥂 Bollicine',v:'spumante o champagne, perlage fine'},{l:'🍯 Morbido & Vellutato',v:'vino morbido, bassa tannicità, finale setoso'}]},
    {q:'Origine preferita?',i:'🌍',o:[{l:'🇮🇹 Italia',v:'italiano'},{l:'🇫🇷 Francia',v:'francese'},{l:'🌏 Nuovo Mondo',v:'del Nuovo Mondo (Argentina, Cile, USA, Australia)'},{l:'🌍 Qualsiasi',v:'di qualsiasi origine'}]},
    {q:'Che fascia vuoi?',i:'💶',o:[{l:'🟢 Accessibile — enoteca di quartiere',v:'accessibile, da enoteca o cantina diretta, non cercare etichette rare o famose'},{l:'🟡 Medio — bistrot e trattoria',v:'fascia media, buon rapporto qualità-prezzo, produttori seri ma non blasonati'},{l:'🔴 Importante — serata speciale',v:'fascia alta, grandi produttori, annate ricercate, massima qualità'},{l:'💎 Eccellenza — nessun limite',v:'il meglio assoluto, icone del vino mondiale, nessun compromesso'}]},
  ];
  let wz={};

  function buildWizard(){
    if(document.querySelector('#sw-wiz')) return;
    const m=document.createElement('div'); m.id='sw-wiz';
    m.style.cssText='display:none;position:fixed;inset:0;z-index:99999;background:rgba(8,4,1,.92);backdrop-filter:blur(6px);align-items:flex-end;justify-content:center;';
    m.innerHTML=`<div style="background:#100a04;width:min(560px,100vw);border-radius:16px 16px 0 0;border:1px solid rgba(212,168,83,.2);border-bottom:none;padding:0 0 28px;max-height:92dvh;overflow-y:auto;box-shadow:0 -12px 60px rgba(0,0,0,.8);animation:swFI .35s ease;"><div style="width:40px;height:4px;background:rgba(212,168,83,.3);border-radius:2px;margin:12px auto 0;"></div><div style="padding:18px 22px 14px;border-bottom:1px solid rgba(212,168,83,.1);display:flex;align-items:center;justify-content:space-between;"><div><div style="font-size:15px;color:#d4a853;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">✦ Abbinamento Rapido</div><div style="font-size:11px;color:rgba(200,180,150,.5);margin-top:2px;letter-spacing:1px;">3 domande · risposta immediata</div></div><button onclick="SW_V6.closeWiz()" style="background:transparent;border:none;color:rgba(200,185,160,.5);font-size:22px;cursor:pointer;padding:2px 8px;line-height:1;">✕</button></div><div style="height:2px;background:rgba(212,168,83,.08);margin:0 22px;"><div id="sw-wb" style="height:100%;width:0;background:#d4a853;transition:width .4s;border-radius:1px;"></div></div><div id="sw-ws" style="padding:22px;"></div><div id="sw-wr" style="display:none;padding:0 22px 8px;"></div></div>`;
    m.addEventListener('click',e=>{if(e.target===m)SW_V6.closeWiz();});
    document.body.appendChild(m);
  }

  function renderStep(i){
    const s=STEPS[i],bar=document.querySelector('#sw-wb'),step=document.querySelector('#sw-ws'),res=document.querySelector('#sw-wr');
    if(!step)return;
    if(bar) bar.style.width=(i/STEPS.length*100)+'%';
    if(res) res.style.display='none';
    step.style.animation='none'; step.offsetHeight; step.style.animation='swFI .3s ease';
    step.innerHTML=`<div style="font-size:10px;color:rgba(212,168,83,.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;font-family:Georgia,serif;">PASSO ${i+1} / ${STEPS.length}</div><div style="font-size:19px;color:#f0e8d8;font-family:Georgia,serif;margin-bottom:20px;">${s.i} ${s.q}</div><div style="display:flex;flex-direction:column;gap:10px;">${s.o.map(o=>`<button onclick="SW_V6.wp('${o.v.replace(/'/g,"\\'")}',${i})" style="text-align:left;padding:13px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(212,168,83,.15);border-radius:8px;color:#d4c9b5;font-family:Georgia,serif;font-size:15px;cursor:pointer;min-height:48px;transition:all .2s;" onmouseenter="this.style.background='rgba(212,168,83,.08)';this.style.borderColor='rgba(212,168,83,.4)';this.style.color='#f0e8d8'" onmouseleave="this.style.background='rgba(255,255,255,.04)';this.style.borderColor='rgba(212,168,83,.15)';this.style.color='#d4c9b5'">${o.l}</button>`).join('')}</div>${i>0?`<button onclick="SW_V6.wb(${i})" style="margin-top:14px;background:transparent;border:none;color:rgba(200,180,150,.4);cursor:pointer;font-family:Georgia,serif;font-size:13px;padding:8px 0;">← Indietro</button>`:''}`;
  }

  async function wizAI(){
    const step=document.querySelector('#sw-ws'),res=document.querySelector('#sw-wr'),bar=document.querySelector('#sw-wb');
    if(bar) bar.style.width='100%';
    if(step) step.innerHTML=`<div style="text-align:center;padding:36px 0;color:rgba(212,168,83,.7);font-family:Georgia,serif;"><div style="font-size:32px;animation:swSpin 2s linear infinite;margin-bottom:14px;">🍷</div><div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;">Il Sommelier sta scegliendo…</div></div>`;
    const prompt=`Sono al ristorante. Sto mangiando: ${wz.food}. Voglio un ${wz.style}. Preferibilmente ${wz.origin}. Fascia: ${wz.budget||"qualsiasi"}. Suggerisci 2 vini (produttore reale, denominazione, annata consigliata). Per ognuno 1-2 frasi su perché funziona con il piatto. Non citare mai prezzi o cifre nella risposta. Max 220 parole.`;
    try {
      const reply=await ask(prompt);
      if(step) step.innerHTML='';
      if(res){ res.style.display='block'; res.innerHTML=`<div style="background:rgba(212,168,83,.06);border:1px solid rgba(212,168,83,.2);border-radius:10px;padding:18px;font-family:Georgia,serif;color:#d4c9b5;line-height:1.75;font-size:14px;white-space:pre-line;">${reply.replace(/</g,'&lt;')}</div><div id="sw-wsv"></div><button onclick="SW_V6.openWiz()" style="display:block;width:100%;margin-top:14px;padding:13px;background:transparent;border:1px solid rgba(212,168,83,.25);color:rgba(212,168,83,.7);border-radius:8px;cursor:pointer;font-family:Georgia,serif;font-size:13px;letter-spacing:1.5px;" onmouseenter="this.style.background='rgba(212,168,83,.08)';this.style.color='#d4a853'" onmouseleave="this.style.background='transparent';this.style.color='rgba(212,168,83,.7)'">↺ Nuova Ricerca</button>`; const sv=document.querySelector('#sw-wsv'); if(sv)savBtn(sv,reply,wz.food); }
    } catch { if(step) step.innerHTML=`<div style="text-align:center;padding:28px;color:rgba(220,100,100,.8);font-family:Georgia,serif;font-size:14px;line-height:1.8;">⚠️ Connessione assente.<br>Riprova tra qualche secondo.<br><br><button onclick="SW_V6.openWiz()" style="background:transparent;border:1px solid rgba(212,168,83,.3);color:#d4a853;padding:10px 24px;border-radius:6px;cursor:pointer;font-family:Georgia,serif;">Riprova</button></div>`; }
  }

  function injectFABWiz(){
    if(document.querySelector('#sw-wiz-btn')) return;
    const b=document.createElement('button'); b.id='sw-wiz-btn';
    b.style.cssText='position:fixed;bottom:84px;left:18px;background:#1a3a2a;border:1px solid rgba(212,168,83,.35);color:#d4a853;border-radius:28px;padding:0 18px;height:52px;cursor:pointer;z-index:9997;box-shadow:0 4px 20px rgba(0,0,0,.5);display:flex;align-items:center;gap:8px;font-family:Georgia,serif;font-size:13px;letter-spacing:1.5px;transition:all .25s;white-space:nowrap;';
    b.innerHTML='✦ Abbinamento Rapido';
    b.onmouseenter=()=>{b.style.background='#243f31';b.style.transform='scale(1.04)';};
    b.onmouseleave=()=>{b.style.background='#1a3a2a';b.style.transform='scale(1)';};
    b.onclick=()=>SW_V6.openWiz();
    document.body.appendChild(b);
  }

  /* ═══════════════════════════════════════════════════════
     11. BANNER COLD-START
  ═══════════════════════════════════════════════════════ */
  function injectBanner(){
    if(serverAwake||document.querySelector('#sw-banner')) return;
    const b=document.createElement('div'); b.id='sw-banner';
    b.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99996;background:rgba(30,15,5,.95);border-bottom:1px solid rgba(212,168,83,.25);padding:8px 16px;text-align:center;font-family:Georgia,serif;font-size:12px;color:rgba(212,168,83,.8);letter-spacing:1.5px;display:flex;align-items:center;justify-content:center;gap:10px;';
    b.innerHTML='<span style="animation:swSpin 1.5s linear infinite;display:inline-block">⏳</span> Sommelier AI in avvio (server freddo — ~20 secondi)…';
    document.body.appendChild(b);
    const chk=setInterval(()=>{ if(serverAwake){b.style.transition='opacity .5s';b.style.opacity='0';setTimeout(()=>b.remove(),600);clearInterval(chk);} },500);
    setTimeout(()=>{b.remove();clearInterval(chk);},45000);
  }

  /* ═══════════════════════════════════════════════════════
     TOAST
  ═══════════════════════════════════════════════════════ */
  function toast(msg,type='info'){
    const bg={info:'#8b5a2b',success:'#2a6635',warning:'#8b6000',error:'#8b2020'};
    const t=document.createElement('div');
    t.style.cssText=`position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${bg[type]||bg.info};color:#f0e8d8;padding:11px 22px;border-radius:8px;z-index:999999;font-family:Georgia,serif;font-size:14px;letter-spacing:1px;box-shadow:0 4px 20px rgba(0,0,0,.4);animation:swFI .3s ease;pointer-events:none;`;
    t.textContent=msg; document.body.appendChild(t);
    setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .4s';},2500);
    setTimeout(()=>t.remove(),3000);
  }

  /* ═══════════════════════════════════════════════════════
     12. API PUBBLICA
  ═══════════════════════════════════════════════════════ */
  window.SW_V6 = {
    openWiz()    { wz={}; buildWizard(); renderStep(0); const m=document.querySelector('#sw-wiz'); if(m){m.style.display='flex';document.body.style.overflow='hidden';} },
    closeWiz()   { const m=document.querySelector('#sw-wiz'); if(m){m.style.display='none';document.body.style.overflow='';} },
    wp(v,i)      { const k=['food','style','origin','budget']; wz[k[i]]=v; i+1<STEPS.length?renderStep(i+1):wizAI(); },
    wb(i)        { renderStep(i-1); },
    openFavs()   { buildFavPanel(); const p=document.querySelector('#sw-fp'); if(p){p.style.display='flex';document.body.style.overflow='hidden';} },
    closeFavs()  { const p=document.querySelector('#sw-fp'); if(p){p.style.display='none';document.body.style.overflow='';} },
    delFav(id)   { F.del(id); renderFavs(); updateBadge(); toast('Rimosso','info'); },
    clrFavs()    { if(!confirm('Cancellare tutti i preferiti?'))return; F.clr(); renderFavs(); updateBadge(); toast('Cancellati','info'); },
    shareFav(id) { const f=F.all().find(x=>x.id===id); if(!f)return; const t=`🍷 ${f.wine||'Abbinamento'}\n🍽 ${f.food||''}\n\n${f.explanation}\n\n— sommelierworld.vin`; navigator.share?navigator.share({title:'Abbinamento',text:t}).catch(()=>{}):navigator.clipboard?.writeText(t).then(()=>toast('Copiato ✓','success')); },
    ask, toast,
    clrHist()  { hist=[]; sessionStorage.removeItem(LS_HIST); toast('Nuova conversazione ✓','success'); },
  };

  // Retrocompat v4/v5
  window.SW_V4 = { callSommelier: ask, clearHistory: window.SW_V6.clrHist };
  window.SW_V5 = window.SW_V6;

  /* ═══════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════ */
  function init(){
    console.log('[SW-v6] 🍷 Patch v6 avviata');
    injectCSS();
    hookOriginalAI();
    injectBanner();

    let n=0;
    const run=()=>{
      injectHero(); injectGallery(); injectTerroirBg();
      injectFABFavs(); injectFABWiz(); buildWizard(); buildFavPanel();
      initEvents();
      if(++n<15) setTimeout(run,400);
      else console.log('[SW-v6] Init completato ✓');
    };

    document.readyState==='loading'
      ? document.addEventListener('DOMContentLoaded',run)
      : run();
  }

  init();
  wakeServer(); // ping immediato

})();
