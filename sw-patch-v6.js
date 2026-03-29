/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v7  — LUXURY RESTYLING                ║
 * ║                                                                  ║
 * ║  ✓ Palette premium: #0A0705 / Oro #D4AF37 / Rosso #4A0404       ║
 * ║  ✓ Tipografia: Playfair Display + Lato                          ║
 * ║  ✓ Glassmorphism nav + bordi arrotondati                        ║
 * ║  ✓ Mobile above-the-fold: griglia 2×2 quick access             ║
 * ║  ✓ Hero slideshow con foto Pexels viticoltura                   ║
 * ║  ✓ Denominazioni: Italia protagonista, regioni, descrizioni     ║
 * ║  ✓ Logo → Home sempre funzionante                               ║
 * ║  ✓ Immagini contestuali per ogni sezione                        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Carica DOPO sw-patch-v6.js:
 *   <script src="sw-patch-v6.js"></script>
 *   <script src="sw-patch-v7.js"></script>
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     PEXELS — immagini per categoria
  ═══════════════════════════════════════════════ */
  const PX = {
    hero: [
      { id: 442116,  cap: 'Terroir · Vigna al tramonto',        region: 'Piemonte' },
      { id: 2702805, cap: 'Cantina · Barili in affinamento',    region: 'Toscana' },
      { id: 1182264, cap: 'Vendemmia · Grappoli di Nebbiolo',   region: 'Langhe' },
      { id: 3850838, cap: 'Sommelier · L\'arte del servizio',   region: 'Milano' },
      { id: 4113579, cap: 'Filari · La geometria del vigneto',  region: 'Veneto' },
      { id: 1407846, cap: 'Degustazione · Calici di cristallo', region: 'Borgogna' },
    ],
    denominazioni: 442116,
    sommelier:     3850838,
    produttori:    2702805,
    events:        1407846,
    glossario:     4113579,
    hero_mobile:   1182264,
  };

  const px = (id, w = 1400, h = 800) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;

  /* ═══════════════════════════════════════════════
     1. GOOGLE FONTS
  ═══════════════════════════════════════════════ */
  function loadFonts() {
    if (document.querySelector('#sw7-fonts')) return;
    const link = document.createElement('link');
    link.id = 'sw7-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;700&family=Cinzel:wght@400;600;700&display=swap';
    document.head.appendChild(link);
  }

  /* ═══════════════════════════════════════════════
     2. CSS PREMIUM — sovrascrive stili esistenti
  ═══════════════════════════════════════════════ */
  function injectCSS() {
    if (document.querySelector('#sw7-css')) return;
    const s = document.createElement('style');
    s.id = 'sw7-css';
    s.textContent = `
      /* ── Variabili globali ── */
      :root {
        --sw7-nero:    #0A0705;
        --sw7-oro:     #D4AF37;
        --sw7-oro2:    #CD7F32;
        --sw7-vino:    #4A0404;
        --sw7-crema:   #F5EFE2;
        --sw7-grigio:  rgba(245,239,226,0.55);
        --sw7-radius:  8px;
        --sw7-glass:   rgba(10,7,5,0.82);
      }

      /* ── Body & base ── */
      body {
        background: var(--sw7-nero) !important;
        color: var(--sw7-crema) !important;
        font-family: 'Lato', 'Helvetica Neue', sans-serif !important;
        -webkit-font-smoothing: antialiased;
      }

      /* ── Titoli con Playfair ── */
      h1, h2, h3, .news-hero-title, .gz-title,
      [class*="-title"]:not(button), .section-title {
        font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif !important;
      }

      /* ── Navbar — glassmorphism ── */
      nav {
        background: var(--sw7-glass) !important;
        backdrop-filter: blur(16px) saturate(180%) !important;
        -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
        border-bottom: 1px solid rgba(212,175,55,0.22) !important;
        box-shadow: 0 2px 24px rgba(0,0,0,0.5) !important;
        height: 54px !important;
      }

      /* Tab navigazione */
      .ntab {
        font-family: 'Lato', sans-serif !important;
        font-size: 9px !important;
        font-weight: 700 !important;
        letter-spacing: 1.8px !important;
        text-transform: uppercase !important;
        color: rgba(212,175,55,0.55) !important;
        padding: 6px 10px !important;
        border-bottom: 2px solid transparent !important;
        transition: color .2s, border-color .2s !important;
        min-width: 52px !important;
      }
      .ntab.active, .ntab:hover {
        color: var(--sw7-oro) !important;
        border-bottom-color: var(--sw7-oro) !important;
        background: rgba(212,175,55,0.07) !important;
      }
      .ntab .ico { font-size: 16px !important; display: block; margin-bottom: 2px; }
      .ntab .lbl { display: block; }

      /* ── Cards ── */
      .news-item, .gz-card, .ev-card,
      [class*="-card"], .prod-card {
        border-radius: var(--sw7-radius) !important;
        overflow: hidden !important;
        border: 1px solid rgba(212,175,55,0.15) !important;
        transition: border-color .25s, transform .25s, box-shadow .25s !important;
      }
      .news-item:hover, .gz-card:hover, .ev-card:hover {
        border-color: rgba(212,175,55,0.4) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      }

      /* ── Bottoni premium ── */
      button, .btn {
        border-radius: var(--sw7-radius) !important;
        font-family: 'Lato', sans-serif !important;
        letter-spacing: 1.5px !important;
      }

      /* ── Inputs ── */
      input, textarea, select {
        border-radius: var(--sw7-radius) !important;
        font-family: 'Lato', sans-serif !important;
        background: rgba(255,255,255,0.06) !important;
        border: 1px solid rgba(212,175,55,0.25) !important;
        color: var(--sw7-crema) !important;
        font-size: 16px !important;
      }
      input:focus, textarea:focus, select:focus {
        border-color: rgba(212,175,55,0.6) !important;
        box-shadow: 0 0 0 2px rgba(212,175,55,0.12) !important;
        outline: none !important;
      }

      /* ── Sezioni header ── */
      .page > div:first-child[style*="border-bottom"] {
        background: linear-gradient(180deg, rgba(74,4,4,0.15) 0%, var(--sw7-nero) 100%) !important;
        border-bottom: 1px solid rgba(212,175,55,0.2) !important;
      }

      /* ── Scrollbar ── */
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: var(--sw7-nero); }
      ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.35); border-radius: 3px; }

      /* ════════════════════════════════════════
         QUICK ACCESS GRID  (mobile above fold)
      ════════════════════════════════════════ */
      #sw7-quick {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 16px;
        background: var(--sw7-nero);
      }
      .sw7-qbtn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 18px 12px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(212,175,55,0.18);
        border-radius: var(--sw7-radius);
        cursor: pointer;
        text-align: center;
        transition: all .22s;
        position: relative;
        overflow: hidden;
        min-height: 90px;
      }
      .sw7-qbtn::before {
        content: '';
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        opacity: 0.12;
        transition: opacity .3s;
      }
      .sw7-qbtn:hover::before, .sw7-qbtn:active::before { opacity: 0.22; }
      .sw7-qbtn:hover {
        border-color: rgba(212,175,55,0.45);
        background: rgba(212,175,55,0.08);
        transform: translateY(-1px);
      }
      .sw7-qbtn .q-ico  { font-size: 28px; line-height: 1; position: relative; z-index: 1; }
      .sw7-qbtn .q-lbl  {
        font-family: 'Lato', sans-serif;
        font-size: 11px; font-weight: 700;
        letter-spacing: 2px; text-transform: uppercase;
        color: var(--sw7-oro);
        position: relative; z-index: 1;
      }
      .sw7-qbtn .q-sub  {
        font-family: 'Lato', sans-serif;
        font-size: 10px; color: rgba(245,239,226,0.45);
        letter-spacing: .5px;
        position: relative; z-index: 1;
      }
      .sw7-qbtn .q-badge {
        position: absolute; top: 8px; right: 8px;
        background: var(--sw7-vino);
        color: rgba(245,239,226,0.8);
        font-size: 9px; font-weight: 700; letter-spacing: 1px;
        padding: 2px 6px; border-radius: 10px;
        font-family: 'Lato', sans-serif;
        z-index: 2;
      }

      /* ════════════════════════════════════════
         HERO SLIDESHOW v7
      ════════════════════════════════════════ */
      #sw7-hero {
        position: relative;
        width: 100%;
        height: clamp(260px, 52vw, 480px);
        overflow: hidden;
      }
      .sw7-slide {
        position: absolute; inset: 0;
        background-size: cover; background-position: center;
        opacity: 0; transition: opacity 1.6s ease;
      }
      .sw7-slide.sw7-active { opacity: 1; }
      .sw7-slide-ov {
        position: absolute; inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(10,7,5,0.18) 0%,
          rgba(10,7,5,0.5) 55%,
          rgba(10,7,5,0.94) 100%
        );
      }
      #sw7-hero-content {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        justify-content: flex-end;
        padding: 20px 20px 28px;
        z-index: 5; pointer-events: none;
      }
      #sw7-hero-kicker {
        font-family: 'Lato', sans-serif;
        font-size: 10px; font-weight: 700;
        letter-spacing: 3.5px; text-transform: uppercase;
        color: var(--sw7-oro); margin-bottom: 8px; opacity: .85;
      }
      #sw7-hero-title {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.6rem, 6vw, 2.8rem);
        font-weight: 700; color: #fff; line-height: 1.18;
        letter-spacing: .02em; margin-bottom: 8px;
        text-shadow: 0 3px 18px rgba(0,0,0,.65);
      }
      #sw7-hero-sub {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-size: clamp(.85rem, 2.5vw, 1.05rem);
        color: rgba(245,239,226,.65); margin-bottom: 10px;
      }
      #sw7-hero-meta {
        font-family: 'Lato', sans-serif;
        font-size: 10px; letter-spacing: 2px;
        color: rgba(212,175,55,.55);
      }
      #sw7-hero-dots {
        position: absolute; bottom: 12px; right: 18px;
        display: flex; gap: 7px; z-index: 10;
      }
      .sw7-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: rgba(255,255,255,.3);
        transition: all .4s; cursor: pointer;
      }
      .sw7-dot.sw7-active {
        background: var(--sw7-oro);
        width: 18px; border-radius: 3px;
      }

      /* ════════════════════════════════════════
         DENOMINAZIONI ITALIA — regioni
      ════════════════════════════════════════ */
      #sw7-italia-hero {
        position: relative; overflow: hidden;
        height: 180px; margin: 0 0 20px;
        border-radius: 0;
      }
      #sw7-italia-hero img {
        width: 100%; height: 100%; object-fit: cover;
        filter: brightness(.6) saturate(1.2);
      }
      #sw7-italia-hero-content {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        justify-content: center; align-items: center;
        text-align: center;
        background: linear-gradient(rgba(74,4,4,.3), rgba(10,7,5,.6));
      }
      .sw7-region-pill {
        display: inline-block;
        padding: 6px 14px;
        background: rgba(212,175,55,.12);
        border: 1px solid rgba(212,175,55,.3);
        border-radius: 20px;
        font-family: 'Lato', sans-serif;
        font-size: 11px; font-weight: 700;
        letter-spacing: 2px; text-transform: uppercase;
        color: var(--sw7-oro);
        cursor: pointer;
        transition: all .2s;
        margin: 4px;
      }
      .sw7-region-pill:hover, .sw7-region-pill.sw7-active-region {
        background: rgba(212,175,55,.22);
        border-color: var(--sw7-oro);
        color: var(--sw7-crema);
      }
      .sw7-den-card {
        background: rgba(255,255,255,.035);
        border: 1px solid rgba(212,175,55,.14);
        border-radius: var(--sw7-radius);
        margin: 0 14px 12px;
        overflow: hidden;
        transition: all .25s;
        cursor: pointer;
      }
      .sw7-den-card:hover {
        border-color: rgba(212,175,55,.38);
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(0,0,0,.35);
      }
      .sw7-den-card-header {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 16px;
        background: linear-gradient(135deg, rgba(74,4,4,.18), transparent);
      }
      .sw7-den-badge {
        font-family: 'Lato', sans-serif;
        font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
        padding: 3px 8px; border-radius: 4px;
        text-transform: uppercase;
        flex-shrink: 0;
      }
      .sw7-den-badge-docg { background: rgba(212,175,55,.18); color: var(--sw7-oro); border: 1px solid rgba(212,175,55,.3); }
      .sw7-den-badge-doc  { background: rgba(205,127,50,.15); color: #CD7F32; border: 1px solid rgba(205,127,50,.3); }
      .sw7-den-badge-igt  { background: rgba(100,100,100,.15); color: rgba(245,239,226,.6); border: 1px solid rgba(200,200,200,.2); }
      .sw7-den-name {
        font-family: 'Playfair Display', serif;
        font-size: 1rem; font-weight: 700;
        color: var(--sw7-crema); flex: 1;
      }
      .sw7-den-body { padding: 0 16px 16px; }
      .sw7-den-grapes {
        font-family: 'Lato', sans-serif;
        font-size: 11px; letter-spacing: 1.5px;
        color: var(--sw7-oro); text-transform: uppercase;
        margin-bottom: 8px;
      }
      .sw7-den-desc {
        font-family: 'Lato', sans-serif;
        font-size: 13px; color: rgba(245,239,226,.7);
        line-height: 1.7;
      }
      .sw7-den-terroir {
        margin-top: 10px; padding-top: 10px;
        border-top: 1px solid rgba(212,175,55,.1);
        font-family: 'Lato', sans-serif;
        font-size: 12px; color: rgba(245,239,226,.5);
        font-style: italic; line-height: 1.6;
      }

      /* ════════════════════════════════════════
         IMMAGINI SEZIONE contestuali
      ════════════════════════════════════════ */
      .sw7-section-hero {
        width: 100%; height: 140px;
        object-fit: cover; display: block;
        filter: brightness(.55) saturate(1.15);
        border-radius: 0;
      }

      /* ════════════════════════════════════════
         RESPONSIVE
      ════════════════════════════════════════ */
      @media (min-width: 600px) {
        #sw7-quick { grid-template-columns: repeat(4,1fr); }
        .sw7-qbtn { min-height: 110px; }
      }
      @media (max-width: 480px) {
        body { overflow-x: hidden !important; }
      }

      /* ════════════════════════════════════════
         ANIMAZIONI
      ════════════════════════════════════════ */
      @keyframes sw7FI { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes sw7Pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    `;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════
     3. HERO SLIDESHOW v7 (sostituisce quello di v6)
  ═══════════════════════════════════════════════ */
  function injectHero() {
    if (document.querySelector('#sw7-hero')) return;

    // Trova la sezione hero esistente e la nasconde
    const oldHero = document.querySelector('#heroSection, #sw-hero');
    if (oldHero) oldHero.style.display = 'none';

    const home = document.querySelector('#page-home');
    if (!home) return;

    const hero = document.createElement('div');
    hero.id = 'sw7-hero';

    // Slides
    PX.hero.forEach((p, i) => {
      const slide = document.createElement('div');
      slide.className = 'sw7-slide' + (i === 0 ? ' sw7-active' : '');
      slide.style.backgroundImage = `url('${px(p.id)}')`;
      slide.innerHTML = '<div class="sw7-slide-ov"></div>';
      hero.appendChild(slide);
    });

    // Contenuto fisso
    hero.insertAdjacentHTML('beforeend', `
      <div id="sw7-hero-content">
        <div id="sw7-hero-kicker">🍷 La Gazzetta del Terroir</div>
        <div id="sw7-hero-title">Dal Suolo al Bicchiere</div>
        <div id="sw7-hero-sub">L'enciclopedia mondiale del vino — 327 denominazioni, 28 paesi</div>
        <div id="sw7-hero-meta" id="sw7-meta-date">
          <span id="sw7-today"></span>
          <span style="margin:0 10px;opacity:.3">·</span>
          <span>327 DENOMINAZIONI · 28 PAESI</span>
        </div>
      </div>
      <div id="sw7-hero-dots"></div>
    `);

    // Dots
    const dotsEl = hero.querySelector('#sw7-hero-dots');
    PX.hero.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'sw7-dot' + (i === 0 ? ' sw7-active' : '');
      d.onclick = () => goSlide(i);
      dotsEl.appendChild(d);
    });

    // Inserisci prima del home-body
    const homeBody = home.querySelector('.home-body');
    home.insertBefore(hero, homeBody);

    // Data italiana
    const todayEl = document.querySelector('#sw7-today');
    if (todayEl) {
      const d = new Date();
      const opts = { weekday:'long', day:'numeric', month:'long', year:'numeric' };
      todayEl.textContent = d.toLocaleDateString('it-IT', opts);
    }

    // Autoplay
    let cur = 0;
    const slides = hero.querySelectorAll('.sw7-slide');
    const dots   = hero.querySelectorAll('.sw7-dot');
    const captions = PX.hero;

    function goSlide(n) {
      slides[cur].classList.remove('sw7-active');
      dots[cur].classList.remove('sw7-active');
      cur = n;
      slides[cur].classList.add('sw7-active');
      dots[cur].classList.add('sw7-active');
      // Aggiorna caption
      const titleEl = document.querySelector('#sw7-hero-title');
      if (titleEl) titleEl.textContent = captions[cur].cap;
    }

    setInterval(() => goSlide((cur + 1) % slides.length), 5500);
    console.log('[SW-v7] Hero slideshow ✓');
  }

  /* ═══════════════════════════════════════════════
     4. QUICK ACCESS GRID — mobile above-the-fold
  ═══════════════════════════════════════════════ */
  const QUICK_BTNS = [
    {
      ico: '🍷', lbl: 'Sommelier', sub: 'Abbinamento AI',
      page: 'sommelier', badge: 'AI',
      img: px(PX.sommelier, 400, 300),
    },
    {
      ico: '🌿', lbl: 'Terroir', sub: '327 denominazioni',
      page: 'explore', badge: null,
      img: px(PX.denominazioni, 400, 300),
    },
    {
      ico: '🏅', lbl: 'Produttori', sub: 'Directory cantine',
      page: 'producers', badge: 'NEW',
      img: px(PX.produttori, 400, 300),
    },
    {
      ico: '📅', lbl: 'Eventi', sub: 'Degustazioni & Fiere',
      page: 'events', badge: null,
      img: px(PX.events, 400, 300),
    },
  ];

  function injectQuickGrid() {
    if (document.querySelector('#sw7-quick')) return;

    const homeBody = document.querySelector('#page-home .home-body');
    if (!homeBody) return;

    const grid = document.createElement('div');
    grid.id = 'sw7-quick';

    QUICK_BTNS.forEach(btn => {
      const el = document.createElement('div');
      el.className = 'sw7-qbtn';
      el.style.cssText += `--bg:url('${btn.img}')`;
      el.style.backgroundImage = `url('${btn.img}')`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';

      // Overlay scuro sopra l'immagine
      el.innerHTML = `
        <div style="position:absolute;inset:0;background:rgba(10,7,5,0.78);border-radius:inherit;"></div>
        ${btn.badge ? `<div class="q-badge">${btn.badge}</div>` : ''}
        <div class="q-ico">${btn.ico}</div>
        <div class="q-lbl">${btn.lbl}</div>
        <div class="q-sub">${btn.sub}</div>
      `;

      el.addEventListener('click', () => {
        // Usa il sistema di navigazione esistente
        const tab = document.querySelector(`.ntab[data-page="${btn.page}"]`);
        if (tab) tab.click();
        else {
          // Fallback diretto
          document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
          const target = document.querySelector(`#page-${btn.page}`);
          if (target) { target.classList.add('active'); window.scrollTo(0, 0); }
        }
      });

      grid.appendChild(el);
    });

    // Inserisci PRIMA delle notizie (primo figlio di home-body)
    homeBody.insertBefore(grid, homeBody.firstChild);
    console.log('[SW-v7] Quick grid ✓');
  }

  /* ═══════════════════════════════════════════════
     5. LOGO → HOME (potenziato rispetto a v6)
  ═══════════════════════════════════════════════ */
  function fixLogoNav() {
    const logo = document.querySelector('#navLogo, .nav-logo');
    if (!logo || logo.dataset.sw7) return;
    logo.dataset.sw7 = '1';
    logo.style.cursor = 'pointer';

    logo.addEventListener('click', () => {
      // Chiudi eventuale wizard/pannello
      ['#sw-wiz','#sw-fp','#sw7-den-panel'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
      });

      // Attiva tab Home
      const homeTab = document.querySelector('.ntab[data-page="home"]');
      if (homeTab) {
        homeTab.click();
      } else {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const h = document.querySelector('#page-home');
        if (h) h.classList.add('active');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    console.log('[SW-v7] Logo → Home ✓');
  }

  /* ═══════════════════════════════════════════════
     6. IMMAGINI CONTESTUALI nelle sezioni
  ═══════════════════════════════════════════════ */
  function injectSectionImages() {
    const sections = [
      { page: 'page-explore',   photoId: PX.denominazioni },
      { page: 'page-sommelier', photoId: PX.sommelier },
      { page: 'page-events',    photoId: PX.events },
      { page: 'page-produttori', photoId: PX.produttori },
    ];

    sections.forEach(({ page, photoId }) => {
      const sec = document.querySelector(`#${page}`);
      if (!sec || sec.dataset.sw7img) return;
      sec.dataset.sw7img = '1';

      const header = sec.querySelector('div:first-child');
      if (!header) return;

      // Aggiungi immagine di sfondo all'header di sezione
      Object.assign(header.style, {
        backgroundImage: `url('${px(photoId, 800, 200)}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      });

      // Overlay per leggibilità
      if (!header.querySelector('.sw7-hov')) {
        const ov = document.createElement('div');
        ov.className = 'sw7-hov';
        ov.style.cssText = 'position:absolute;inset:0;background:linear-gradient(rgba(10,7,5,.75),rgba(10,7,5,.92));z-index:0;';
        header.insertBefore(ov, header.firstChild);
        Array.from(header.children).forEach(c => {
          if (c !== ov) { c.style.position = 'relative'; c.style.zIndex = '1'; }
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════
     7. DENOMINAZIONI ITALIA — regioni con desc ricche
  ═══════════════════════════════════════════════ */
  const ITALIA_REGIONI = {
    'Piemonte': {
      emoji: '🏔',
      desc: 'La Borgogna italiana. Nebbiolo sovrano tra le Langhe e il Monferrato.',
      dens: [
        {
          name: 'Barolo DOCG', type: 'DOCG', grapes: 'Nebbiolo',
          desc: 'Il Re dei vini italiani. Nasce tra le colline di La Morra, Castiglione Falletto e Serralunga d\'Alba su marne calcaree helvetiane. Un vino di struttura maestosa, capace di vivere mezzo secolo.',
          terroir: 'Suoli: marne tortoniane (Serralunga) vs. elvetiane (La Morra). I tannini di Serralunga hanno la durezza della roccia; quelli di La Morra, la seta. Affinamento minimo 38 mesi.',
          profilo: 'Viola appassita, tabacco, catrame, rosa secca, spezie. Tannini poderosi, acidità alta, lunga persistenza.',
          curiosita: 'Il nome "Barolo" appare per la prima volta nel 1798 in una lettera del conte Balbiano. Camillo Cavour contribuì a modernizzarne la produzione.',
        },
        {
          name: 'Barbaresco DOCG', type: 'DOCG', grapes: 'Nebbiolo',
          desc: 'La Regina — più femminile del Barolo, eppure ugualmente aristocratica. Le MGA (Menzioni Geografiche Aggiuntive) come Asili, Rabajà e Martinenga definiscono i cru più preziosi.',
          terroir: 'Suoli di tufo e sabbia più soffice rispetto al Barolo. Il Nebbiolo esprime qui eleganza prima della potenza. Affinamento minimo 26 mesi.',
          profilo: 'Geranio, rosa, fragola matura, spezie orientali. Tannini fini, acidità viva, persistenza notevole.',
          curiosita: 'Angelo Gaja rivoluzionò il Barbaresco negli anni \'60, introducendo pratiche borgognone che cambiarono la viticoltura italiana.',
        },
        {
          name: 'Barbera d\'Asti DOCG', type: 'DOCG', grapes: 'Barbera',
          desc: 'Il vino quotidiano dei piemontesi, elevato a dignità nobile. Le sottozone Nizza e Tinella raggiungono complessità straordinarie con invecchiamento in legno.',
          terroir: 'Argille calcaree delle colline astigiane. L\'acidità naturale elevata è il marchio di fabbrica.',
          profilo: 'Ciliegia, mora, amarena, note balsamiche. Acidità vivace, tannini morbidi, finale fresco.',
          curiosita: 'La Barbera era storicamente il vino dei contadini. Oggi la sottozona Nizza ha ottenuto una propria DOCG nel 2014.',
        },
        {
          name: 'Moscato d\'Asti DOCG', type: 'DOCG', grapes: 'Moscato Bianco',
          desc: 'Il più aromatico e delicato dei vini piemontesi. Leggermente frizzante, dolce senza essere stucchevole, con gradazione alcolica bassissima.',
          terroir: 'Colline di Canelli, Santo Stefano Belbo, Mango. Il microclima caldo e soleggiato concentra gli aromi del Moscato Bianco.',
          profilo: 'Pesca, albicocca, fiori d\'acacia, note di muschio. Bollicine fini, dolcezza calibrata, bassa gradazione.',
          curiosita: 'La vendemmia avviene sempre a fine settembre e i vigneti più pregiati si trovano sulle "sorì" (versanti soleggiati a sud).',
        },
      ],
    },
    'Toscana': {
      emoji: '🌾',
      desc: 'Il Sangiovese regna sovrano. Dalla Chianti Classico al Brunello, dalla costa tirrenica alle colline senesi.',
      dens: [
        {
          name: 'Brunello di Montalcino DOCG', type: 'DOCG', grapes: 'Sangiovese Grosso (Brunello)',
          desc: 'Il più longevo dei vini italiani. Montalcino è una fortezza medievale a 564 metri sul livello del mare, con un microclima unico tra la Maremma e le Crete Senesi.',
          terroir: 'Suoli di galestro e alberese. I quattro versanti della collina danno vini profondamente diversi: il nord più fresco ed elegante, il sud più caldo e strutturato.',
          profilo: 'Ciliegia sotto spirito, tabacco, cuoio, fiori secchi, note eteree. Struttura tannica imponente, acidità alta, longevo 30-50 anni.',
          curiosita: 'Ferruccio Biondi-Santi inventò letteralmente il Brunello nella seconda metà dell\'Ottocento. Prima era semplicemente "Rosso di Montalcino".',
        },
        {
          name: 'Chianti Classico DOCG', type: 'DOCG', grapes: 'Sangiovese',
          desc: 'Il cuore storico della Toscana del vino. Il territorio tra Firenze e Siena custodisce il Gallo Nero, simbolo di una delle denominazioni più antiche d\'Italia.',
          terroir: 'Galestro e alberese alternati. La Gran Selezione è il vertice qualitativo, con vini da singolo vigneto che competono con i migliori al mondo.',
          profilo: 'Ciliegia fresca, viola, spezie, cuoio, note floreali. Tannini vivi, acidità brillante, grande bevibilità.',
          curiosita: 'Il Consorzio del Gallo Nero nacque nel 1924, uno dei primi consorzi di tutela in Italia.',
        },
        {
          name: 'Bolgheri DOC', type: 'DOC', grapes: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
          desc: 'La rivoluzione costiera degli anni \'70. Sassicaia, Ornellaia e Masseto hanno riscritto le regole del vino italiano, portando i vitigni internazionali a esprimere una voce toscana unica.',
          terroir: 'Suoli limosi e argillosi vicino al mare Tirreno. La Sassicaia ha ottenuto nel 1994 la sua DOC dedicata — unica in Italia per una singola azienda.',
          profilo: 'Ribes nero, mirtillo, cedro, grafite, spezie. Struttura bordolese con eleganza italiana.',
          curiosita: 'Sassicaia 1985 vinse il confronto con i migliori Bordeaux nella famosa degustazione di Decanter del 1986, ottenendo punteggi superiori.',
        },
      ],
    },
    'Veneto': {
      emoji: '🏛',
      desc: 'Dal Lago di Garda alle Dolomiti, dall\'Amarone al Prosecco. La regione più produttiva d\'Italia.',
      dens: [
        {
          name: 'Amarone della Valpolicella DOCG', type: 'DOCG', grapes: 'Corvina, Corvinone, Rondinella',
          desc: 'Il grande vino dell\'appassimento. Le uve vengono lasciate ad asciugare per 90-120 giorni in apposite fruttai detti "arele", perdendo il 30% del loro peso. Il risultato è un vino di straordinaria concentrazione.',
          terroir: 'Tre zone: Classico (la più pregiata), Valpantena e Est. I migliori vigneti sono su calcari e basalti a quote tra 200 e 600 metri.',
          profilo: 'Ciliegia sotto spirito, prugna, cioccolato, spezie orientali, tabacco. Gradazione 15-17%, tannini vellutati, persistenza infinita.',
          curiosita: 'Il nome "Amarone" (da amaro) fu scelto per distinguerlo dal Recioto dolce. Fino agli anni \'50 era considerato un difetto di produzione del Recioto.',
        },
        {
          name: 'Soave Classico DOC', type: 'DOC', grapes: 'Garganega, Trebbiano di Soave',
          desc: 'Il bianco più famoso del Veneto. La zona Classica su basalto e tufo vulcanico produce vini di mineralità e struttura sorprendenti.',
          terroir: 'Basalti e tufi di origine vulcanica nella zona storica. I vigneti in quota su terreni magri danno la migliore espressione varietale.',
          profilo: 'Mandorla, fiori bianchi, agrumi, note minerali. Freschezza vivace, finale ammandorlato tipico.',
          curiosita: 'La Garganega è uno dei vitigni autoctoni più antichi d\'Italia, citata già nel Medioevo nei documenti del comune di Verona.',
        },
      ],
    },
    'Campania': {
      emoji: '🌋',
      desc: 'I vitigni autoctoni di una terra vulcanica. Fiano, Greco, Aglianico: radici greche, carattere tutto italiano.',
      dens: [
        {
          name: 'Taurasi DOCG', type: 'DOCG', grapes: 'Aglianico',
          desc: 'Il "Barolo del Sud". L\'Aglianico sui suoli vulcanici dell\'Irpinia produce un vino di struttura nordica con il calore del sole campano.',
          terroir: 'Suoli vulcanici a 400-700 metri di quota. Le escursioni termiche diurne preservano l\'acidità nonostante il calore estivo.',
          profilo: 'Ciliegia nera, prugna, tabacco, cuoio, spezie. Acidità tagliente, tannini fibrosi, lunga vita in bottiglia.',
          curiosita: 'Antonio Mastroberardino riportò il Taurasi all\'attenzione internazionale dopo la seconda guerra mondiale, recuperando cloni antichi di Aglianico.',
        },
        {
          name: 'Fiano di Avellino DOCG', type: 'DOCG', grapes: 'Fiano',
          desc: 'Uno dei più grandi bianchi italiani. Sui colli irpini a 400-700 metri, il Fiano esprime una complessità aromatica e una capacità di invecchiamento rare tra i bianchi meridionali.',
          terroir: 'Suoli argillosi e calcari su versanti collinari. Il comune di Lapio e Sorbo Serpico producono i vini più longevi.',
          profilo: 'Miele, noce, pera, erbe aromatiche, note affumicate. Struttura minerale, acidità calibrata.',
          curiosita: 'Il Fiano era già citato da Plinio il Vecchio come "Vitis Apiana" (vite amata dalle api) per il suo mosto dolcissimo.',
        },
      ],
    },
    'Sicilia': {
      emoji: '☀️',
      desc: 'Il vulcano, il sale, il sole. L\'Etna come Borgogna, il Nero d\'Avola come ambasciatore nel mondo.',
      dens: [
        {
          name: 'Etna DOC', type: 'DOC', grapes: 'Nerello Mascalese, Carricante',
          desc: 'La montagna di fuoco ha riscritto la mappa del vino siciliano. I vigneti ad alberello centenario su suoli vulcanici a 400-1000 metri producono vini di sorprendente eleganza.',
          terroir: 'Sabbie nere laviche e ceneri vulcaniche. Ogni contrada (simile ai cru di Borgogna) ha caratteristiche uniche. Quota e versante determinano il carattere.',
          profilo: 'Fragola selvatica, lampone, spezie, grafite, note minerali vulcaniche. Acidità alta, tannini fini, grande freschezza nonostante il sole.',
          curiosita: 'L\'Etna è il vulcano attivo più alto d\'Europa. Molti vigneti hanno viti pre-fillossera con radici franche su terreni vulcanici inospitali per il parassita.',
        },
        {
          name: 'Passito di Pantelleria DOC', type: 'DOC', grapes: 'Zibibbo (Moscato d\'Alessandria)',
          desc: 'L\'isola del vento e del sole africano. Lo Zibibbo viene appassito sotto il sole implacabile di Pantelleria, tra terrazzamenti di lava nera che trattengono il calore di notte.',
          terroir: 'Suoli lavici neri su un\'isola a 70 km dalla Tunisia. La vite è allevata ad alberello bassissimo (pantesco) per resistere allo scirocco.',
          profilo: 'Fico secco, dattero, albicocca candita, miele, agrumi. Dolcezza opulenta, acidità che equilibra.',
          curiosita: 'Ben\'Ryé di Donnafugata è stato eletto più volte tra i migliori vini dolci del mondo. Il nome in arabo significa "figlio del vento".',
        },
      ],
    },
  };

  function injectItaliaSection() {
    const explorePage = document.querySelector('#page-explore');
    if (!explorePage || document.querySelector('#sw7-italia')) return;

    // Crea sezione Italia dedicata
    const italiaSection = document.createElement('div');
    italiaSection.id = 'sw7-italia';
    italiaSection.style.cssText = 'background:var(--sw7-nero);';

    // Hero Italia
    italiaSection.innerHTML = `
      <div id="sw7-italia-hero">
        <img src="${px(442116, 800, 300)}" alt="Vigne italiane" loading="lazy">
        <div id="sw7-italia-hero-content">
          <div style="font-family:'Lato',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.7);text-transform:uppercase;margin-bottom:8px;">🇮🇹 Italia</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.5);">Le Denominazioni Italiane</div>
          <div style="font-family:'Playfair Display',serif;font-style:italic;font-size:.9rem;color:rgba(245,239,226,.6);margin-top:6px;">Dal Nebbiolo delle Langhe al Nerello dell'Etna</div>
        </div>
      </div>

      <!-- Pills regioni -->
      <div id="sw7-region-pills" style="padding:16px 14px;display:flex;flex-wrap:wrap;gap:6px;border-bottom:1px solid rgba(212,175,55,.1);">
        ${Object.entries(ITALIA_REGIONI).map(([name, r]) =>
          `<div class="sw7-region-pill" data-region="${name}">${r.emoji} ${name}</div>`
        ).join('')}
        <div class="sw7-region-pill sw7-active-region" data-region="all">🌍 Tutte</div>
      </div>

      <!-- Cards denominazioni -->
      <div id="sw7-den-list" style="padding:14px 0 20px;"></div>
    `;

    // Inserisci all'inizio della pagina explore, dopo l'header
    const firstDiv = explorePage.querySelector('div:first-child');
    if (firstDiv && firstDiv.nextSibling) {
      explorePage.insertBefore(italiaSection, firstDiv.nextSibling);
    } else {
      explorePage.appendChild(italiaSection);
    }

    // Render denominazioni
    renderDenominazioni('all');

    // Gestione pills
    italiaSection.querySelectorAll('.sw7-region-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        italiaSection.querySelectorAll('.sw7-region-pill').forEach(p => p.classList.remove('sw7-active-region'));
        pill.classList.add('sw7-active-region');
        renderDenominazioni(pill.dataset.region);
      });
    });

    console.log('[SW-v7] Italia denominazioni ✓');
  }

  function renderDenominazioni(filter) {
    const list = document.querySelector('#sw7-den-list');
    if (!list) return;

    list.innerHTML = '';
    list.style.animation = 'sw7FI .3s ease';

    const regions = filter === 'all'
      ? Object.entries(ITALIA_REGIONI)
      : [[filter, ITALIA_REGIONI[filter]]].filter(([,v]) => v);

    regions.forEach(([regionName, region]) => {
      if (!region) return;

      // Header regione
      const rHead = document.createElement('div');
      rHead.style.cssText = `
        padding: 14px 14px 8px;
        font-family: 'Lato', sans-serif;
        font-size: 10px; font-weight: 700; letter-spacing: 3px;
        text-transform: uppercase; color: var(--sw7-oro);
        border-top: 1px solid rgba(212,175,55,.12);
        margin-top: ${filter === 'all' ? '8px' : '0'};
      `;
      rHead.textContent = `${region.emoji} ${regionName}`;
      list.appendChild(rHead);

      // Desc regione
      const rDesc = document.createElement('div');
      rDesc.style.cssText = 'padding:0 14px 12px;font-family:\'Playfair Display\',serif;font-style:italic;font-size:.85rem;color:rgba(245,239,226,.5);';
      rDesc.textContent = region.desc;
      list.appendChild(rDesc);

      // Cards
      region.dens.forEach(den => {
        const card = document.createElement('div');
        card.className = 'sw7-den-card';

        const typeClass = {
          DOCG: 'sw7-den-badge-docg',
          DOC:  'sw7-den-badge-doc',
          IGT:  'sw7-den-badge-igt',
        }[den.type] || 'sw7-den-badge-doc';

        card.innerHTML = `
          <div class="sw7-den-card-header">
            <span class="sw7-den-badge ${typeClass}">${den.type}</span>
            <span class="sw7-den-name">${den.name.replace(/ DOCG| DOC| IGT/g,'')}</span>
          </div>
          <div class="sw7-den-body">
            <div class="sw7-den-grapes">🍇 ${den.grapes}</div>
            <div class="sw7-den-desc">${den.desc}</div>
            <div class="sw7-den-terroir">
              <strong style="color:rgba(212,175,55,.7);font-style:normal;">Terroir:</strong> ${den.terroir}
              <br><br>
              <strong style="color:rgba(212,175,55,.7);font-style:normal;">Profilo:</strong> ${den.profilo}
              <br><br>
              <strong style="color:rgba(212,175,55,.7);font-style:normal;">Curiosità:</strong> ${den.curiosita}
            </div>
          </div>
        `;

        // Toggle descrizione
        const body = card.querySelector('.sw7-den-body');
        body.style.display = 'none';
        card.querySelector('.sw7-den-card-header').addEventListener('click', () => {
          const open = body.style.display !== 'none';
          body.style.display = open ? 'none' : 'block';
          if (!open) body.style.animation = 'sw7FI .3s ease';
        });

        list.appendChild(card);
      });
    });
  }

  /* ═══════════════════════════════════════════════
     8. HERO HEIGHT — riduce su mobile per above-fold
  ═══════════════════════════════════════════════ */
  function optimizeHeroMobile() {
    if (window.innerWidth > 600) return;
    const hero = document.querySelector('#sw7-hero, #heroSection');
    if (hero) {
      hero.style.height = 'clamp(220px, 48vw, 320px)';
    }
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v7] 🍷 Patch v7 Premium — avvio');

    loadFonts();
    injectCSS();

    let n = 0;
    const run = () => {
      injectHero();
      injectQuickGrid();
      fixLogoNav();
      injectSectionImages();
      injectItaliaSection();
      optimizeHeroMobile();
      if (++n < 20) setTimeout(run, 350);
      else console.log('[SW-v7] Init completato ✓');
    };

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run)
      : run();

    window.addEventListener('resize', optimizeHeroMobile);
  }

  init();

})();
