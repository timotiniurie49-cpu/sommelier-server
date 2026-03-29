/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v9  — DEFINITIVO                       ║
 * ║                                                                  ║
 * ║  ✓ Database completo 20 regioni italiane (DOCG + DOC)           ║
 * ║  ✓ Sistema anti-blocco API: cache 24h + fallback + key rotation ║
 * ║  ✓ 30 articoli rotanti offline (storia, tecnica, vitigni)       ║
 * ║  ✓ Immagini Unsplash per sezione                                ║
 * ║  ✓ Mobile above-the-fold: griglia 2x2 visibile senza scroll     ║
 * ║  ✓ Logo → Home sempre funzionante                               ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Installazione in index.html prima di </body>:
 *   <script src="sw-patch-v6.js"></script>
 *   <script src="sw-patch-v9.js"></script>
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     IMMAGINI — Pexels (stabili, no API key)
  ═══════════════════════════════════════════════ */
  const PX = {
    vigne:     442116,
    cantina:   2702805,
    sommelier: 3850838,
    grappoli:  1182264,
    filari:    4113579,
    degust:    1407846,
    calici:    1579367,
    terra:     1470171,
    antico:    1458671,
    etna:      3532658,
    pantelleria: 2660262,
    borgogna:  3741248,
    barrique:  2709937,
    harvest:   2599537,
  };
  const px = (id, w, h) =>
    'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id +
    '.jpeg?auto=compress&cs=tinysrgb&w=' + (w||900) + '&h=' + (h||500) + '&dpr=1';

  /* ═══════════════════════════════════════════════
     CONFIG SERVER
  ═══════════════════════════════════════════════ */
  const SERVER = 'https://sommelier-server-production-8f92.up.railway.app';
  const CACHE_NS = 'sw9_';
  const CACHE_TTL = 24 * 3600 * 1000; // 24 ore

  /* ═══════════════════════════════════════════════
     CACHE localStorage
  ═══════════════════════════════════════════════ */
  const Cache = {
    get(key) {
      try {
        var raw = localStorage.getItem(CACHE_NS + key);
        if (!raw) return null;
        var obj = JSON.parse(raw);
        if (Date.now() - obj.ts > CACHE_TTL) { localStorage.removeItem(CACHE_NS + key); return null; }
        return obj.data;
      } catch(e) { return null; }
    },
    set(key, data) {
      try { localStorage.setItem(CACHE_NS + key, JSON.stringify({ ts: Date.now(), data: data })); }
      catch(e) {}
    },
  };

  /* ═══════════════════════════════════════════════
     DATABASE COMPLETO DENOMINAZIONI ITALIANE
     Tutte le 20 regioni produttive DOC/DOCG
  ═══════════════════════════════════════════════ */
  var WINE_DATABASE = {

    'Abruzzo': {
      flag: '🌊', img: PX.vigne,
      note: 'Tra Appennino e Adriatico. Montepulciano e Trebbiano sono i re; Valentini e Emidio Pepe i custodi del mito.',
      docg: ['Colline Teramane Montepulciano d\'Abruzzo', 'Tullum'],
      doc:  ['Abruzzo', 'Cerasuolo d\'Abruzzo', 'Controguerra', 'Montepulciano d\'Abruzzo', 'Ortona', 'Trebbiano d\'Abruzzo', 'Villamagna'],
      focus: {
        nome: 'Montepulciano d\'Abruzzo DOC',
        storia: 'Il Montepulciano d\'Abruzzo e\' il vitigno autoctono per eccellenza della regione. Valentini di Loreto Aprutino ha elevato questo vino a mito mondiale, invecchiando le bottiglie 10+ anni prima di commercializzarle.',
        terroir: 'Colline adriatiche tra 100 e 600m. Suoli argillosi e calcarei, clima mediterraneo con brezze adriatiche che moderano il caldo estivo.',
        profilo: 'Ciliegia matura, prugna, violetta, spezie. Corpo pieno, tannini morbidi, finale persistente.',
        note: 'Il Cerasuolo d\'Abruzzo DOC e\' il rosato da Montepulciano, tra i migliori rosati italiani.'
      }
    },

    'Alto Adige': {
      flag: '🏔', img: PX.filari,
      note: 'Il Sudtirolo vitivinicolo — tre lingue, un terroir alpino unico. Dalla Val d\'Isarco al Lago di Caldaro.',
      docg: [],
      doc:  ['Alto Adige / Sudtirol', 'Colli di Bolzano', 'Lago di Caldaro', 'Meranese di Collina', 'Santa Maddalena', 'Terlano', 'Valdadige', 'Valle Isarco', 'Valle Venosta'],
      focus: {
        nome: 'Alto Adige DOC',
        storia: 'Prima DOC italiana a disciplinare i vitigni internazionali. Le cantine cooperative sudtirolesi sono modello europeo di qualita\'. Gewurztraminer nasce a Tramin/Termeno.',
        terroir: '21 sottozone. Bolzano caldo per il Lagrein. Tramin aromatico per il Gewurztraminer. Valle Isarco fresca per Riesling e Kerner.',
        profilo: 'Dipende dal vitigno: Lagrein (mirtillo, cioccolato), Gewurztraminer (rosa, litchi), Riesling (limone, petrolio, mineralita\' alpina).',
        note: 'Cantina di Terlano invecchia i bianchi 10+ anni. Alois Lageder, Hofstatter, Franz Haas i riferimenti.'
      }
    },

    'Basilicata': {
      flag: '🌋', img: PX.terra,
      note: 'Il vulcano spento del Vulture e\' il segreto della Basilicata. Aglianico su basalto — minerale, austero, longevo.',
      docg: ['Aglianico del Vulture Superiore'],
      doc:  ['Aglianico del Vulture', 'Grottino di Roccanova', 'Matera', 'Terre dell\'Alta Val d\'Agri'],
      focus: {
        nome: 'Aglianico del Vulture Superiore DOCG',
        storia: 'Il Vulture e\' un vulcano spento nell\'Appennino lucano. Elena Fucci con "Titolo" ha rivoluzionato la denominazione negli anni 2000, portandola all\'attenzione internazionale.',
        terroir: 'Basalto vulcanico a 300-700m. Tufi e ceneri ben drenanti. Clima continentale con inverni freddi e estati secche.',
        profilo: 'Ciliegia nera, pepe, tabacco, grafite vulcanica. Acidita\' alta, tannini fibrosi, longevo 20+ anni.',
        note: 'Elena Fucci, Paternoster, Re Manfredi i top producers. Il DOCG richiede almeno 5 anni di affinamento.'
      }
    },

    'Calabria': {
      flag: '🌊', img: PX.vigne,
      note: 'La punta dello stivale. Ciro\' e\' il vino piu\' antico d\'Italia — gia\' i Greci di Crimisa lo producevano per gli atleti olimpici.',
      docg: [],
      doc:  ['Bivongi', 'Ciro\'', 'Greco di Bianco', 'Lamezia', 'Melissa', 'Sant\'Anna di Isola Capo Rizzuto', 'Savuto', 'Scavigna', 'Terre di Cosenza'],
      focus: {
        nome: 'Ciro\' DOC',
        storia: 'Ciro\' Marina era Crimisa, colonia greca del VI sec. a.C. I Greci producevano il Krimisa per i vincitori delle Olimpiadi. E\' il vino italiano con la storia piu\' lunga documentata.',
        terroir: 'Colline argillose e calcari della costa ionica. Clima mediterraneo estremo con scirocco africano.',
        profilo: 'Ciliegia, spezie, note iodate, mandorla. Struttura media, tannini presenti, finale persistente.',
        note: 'Librandi e\' il produttore piu\' noto. Il Ciro\' Bianco da Greco Bianco e\' meno famoso ma interessante.'
      }
    },

    'Campania': {
      flag: '🌋', img: PX.terra,
      note: 'La Grecia d\'Italia. Fiano, Greco e Aglianico — vitigni portati dai coloni greci 2700 anni fa, oggi tra i piu\' grandi d\'Italia.',
      docg: ['Aglianico del Taburno', 'Fiano di Avellino', 'Greco di Tufo', 'Taurasi'],
      doc:  ['Aversa Asprinio', 'Campi Flegrei', 'Capri', 'Casavecchia di Pontelatone', 'Castel San Lorenzo', 'Cilento', 'Costa d\'Amalfi', 'Falanghina del Sannio', 'Falerno del Massico', 'Galluccio', 'Irpinia', 'Ischia', 'Penisola Sorrentina', 'Sannio', 'Vesuvio'],
      focus: {
        nome: 'Taurasi DOCG',
        storia: 'Il "Barolo del Sud". L\'Aglianico sui suoli vulcanici irpini produce struttura nordica con calore campano. Mastroberardino ne e\' il custode storico dal dopoguerra.',
        terroir: 'Suoli vulcanici e argillosi a 400-700m. Escursioni termiche diurne preservano l\'acidita\'. DOCG dal 1993.',
        profilo: 'Ciliegia nera, prugna, tabacco, cuoio, spezie orientali. Acidita\' tagliente, tannini fibrosi, longevo 15-25 anni.',
        note: 'Affinamento minimo 3 anni (Riserva 4). Mastroberardino, Feudi di San Gregorio, Caggiano i top.'
      }
    },

    'Emilia Romagna': {
      flag: '🌾', img: PX.grappoli,
      note: 'Terra di lambrusco frizzante e Albana passita. Il Gutturnio dei Colli Piacentini e la Romagna del Sangiovese completano il quadro.',
      docg: ['Colli Bolognesi Pignoletto', 'Romagna Albana'],
      doc:  ['Bosco Eliceo', 'Colli Bolognesi', 'Colli d\'Imola', 'Colli di Faenza', 'Colli di Parma', 'Colli di Rimini', 'Colli Piacentini', 'Gutturnio', 'Lambrusco di Sorbara', 'Lambrusco Grasparossa di Castelvetro', 'Lambrusco Salamino di Santa Croce', 'Ortrugo dei Colli Piacentini', 'Pignoletto', 'Reggiano', 'Rimini', 'Romagna'],
      focus: {
        nome: 'Lambrusco di Sorbara DOC',
        storia: 'Il Lambrusco piu\' elegante — leggero, frizzante, con un colore quasi rosato. Sorbara e\' la sottozona piu\' pregiata, con viti che faticano a fruttificare per scarsa allegagione.',
        terroir: 'Pianura padana, suoli alluvionali argillosi. Clima continentale con nebbie autunnali che rallentano la maturazione.',
        profilo: 'Fragola, lampone, violetta. Frizzante vivace, acidita\' alta, bassa gradazione. Perfetto con salumi e tigelle.',
        note: 'Cleto Chiarli, Medici Ermete e Cavicchioli i produttori storici. Il Lambrusco di qualita\' e\' molto diverso dalla versione industriale dolce anni \'80.'
      }
    },

    'Friuli-Venezia Giulia': {
      flag: '⛰', img: PX.cantina,
      note: 'La capitale italiana del vino bianco. Collio e COF producono bianchi tra i piu\' complessi d\'Europa. Gravner e Radikon hanno inventato i vini orange.',
      docg: ['Colli Orientali del Friuli Picolit', 'Lison', 'Ramandolo', 'Rosazzo'],
      doc:  ['Carso', 'Collio', 'Friuli Aquileia', 'Friuli Grave', 'Friuli Isonzo', 'Friuli Latisana', 'Friuli Venezia Giulia', 'Lison-Pramaggiore', 'Prosecco'],
      focus: {
        nome: 'Collio DOC',
        storia: 'Il Collio e\' una piccola area al confine con la Slovenia. Josko Gravner e Stanko Radikon negli anni \'90-2000 hanno rivoluzionato la vinificazione con macerazione sulle bucce in anfore di terracotta — nasce il movimento dei vini orange.',
        terroir: 'Flysch di Cormons — alternanza di marne e arenarie. Mineralita\' straordinaria, acidita\' vibrante.',
        profilo: 'Pesca bianca, fiori bianchi, mineralita\' intensa. Struttura media-alta. I vini orange: ambrati, tannici, ossidativi eleganti.',
        note: 'Radikon, Gravner, Schiopetto, Princic i produttori storici. Il confine con la Slovenia e\' impercettibile nel vino.'
      }
    },

    'Lazio': {
      flag: '🏛', img: PX.cantina,
      note: 'Dai Castelli Romani vulcanici alla Via Appia. Frascati e Cesanese custodiscono una tradizione millenaria a due passi dalla Capitale.',
      docg: ['Cannellino di Frascati', 'Cesanese del Piglio', 'Frascati Superiore'],
      doc:  ['Aleatico di Gradoli', 'Aprilia', 'Atina', 'Bianco Capena', 'Castelli Romani', 'Cerveteri', 'Cesanese di Affile', 'Cesanese di Olevano Romano', 'Circeo', 'Colli Albani', 'Colli della Sabina', 'Colli Etruschi Viterbesi', 'Colli Lanuvini', 'Cori', 'Est!Est!!Est!!! di Montefiascone', 'Frascati', 'Genazzano', 'Marino', 'Montecompatri Colonna', 'Nettuno', 'Orvieto', 'Roma', 'Tarquinia', 'Terracina', 'Velletri', 'Vignanello', 'Zagarolo'],
      focus: {
        nome: 'Frascati Superiore DOCG',
        storia: 'Il vino bianco di Roma per eccellenza. I Castelli Romani — tufi vulcanici alle porte di Roma — producono bianchi freschi per la cucina laziale da secoli. I Papi avevano le loro vigne a Frascati.',
        terroir: 'Suoli vulcanici di tufo e lapillo. Il sottosuolo poroso drena perfettamente e trattiene il fresco d\'estate.',
        profilo: 'Frutta gialla, fiori bianchi, note minerali vulcaniche. Freschezza viva, bevibilita\' immediata, finale pulito.',
        note: 'Casale Marchese, Villa Simone e Poggio Le Volpi tra i top. Il Cannellino di Frascati DOCG e\' la versione dolce passita.'
      }
    },

    'Liguria': {
      flag: '🌊', img: PX.filari,
      note: 'Terrazzamenti a picco sul mare. Uve trasportate a mano o con monorotaie. Il Rossese e lo Sciacchetra\' sono gioielli rarissimi.',
      docg: [],
      doc:  ['Cinque Terre', 'Cinque Terre Sciacchetra\'', 'Colli di Luni', 'Colline di Levanto', 'Golfo del Tigullio-Portofino', 'Pornassio', 'Riviera Ligure di Ponente', 'Rossese di Dolceacqua', 'Val Polcevera'],
      focus: {
        nome: 'Cinque Terre Sciacchetra\' DOC',
        storia: 'Il passito piu\' raro d\'Italia. Le Cinque Terre sono un paesaggio UNESCO su falesie a picco sul mar Ligure. Le uve vengono appassite su graticci per produrre pochissime bottiglie di Sciacchetra\' ogni anno.',
        terroir: 'Terrazzamenti calcarei su pareti quasi verticali. Le uve si trasportano a mano o con monorotaie per l\'impossibilita\' di accesso meccanico.',
        profilo: 'Albicocca secca, miele di fiori bianchi, agrumi canditi, note saline marine. Dolcezza misurata, acidita\' che bilancia.',
        note: 'Produzione di poche migliaia di bottiglie. La Cooperativa delle Cinque Terre e\' il principale produttore. Prezzo elevato per la rarissima disponibilita\'.'
      }
    },

    'Lombardia': {
      flag: '🏙', img: PX.cantina,
      note: 'Da Milano al Lago di Garda, dalla Franciacorta alla Valtellina verticale. La regione piu\' ricca d\'Italia ha anche i suoi vini di lusso.',
      docg: ['Franciacorta', 'Moscato di Scanzo', 'Oltrepo\' Pavese Metodo Classico', 'Sforzato di Valtellina', 'Valtellina Superiore'],
      doc:  ['Bonarda dell\'Oltrepo\' Pavese', 'Botticino', 'Capriano del Colle', 'Cellatica', 'Curtefranca', 'Garda', 'Garda Colli Mantovani', 'Lambrusco Mantovano', 'Lugana', 'Oltrepo\' Pavese', 'Pinot Nero dell\'Oltrepo\' Pavese', 'Riviera del Garda Bresciano', 'San Colombano al Lambro', 'San Martino della Battaglia', 'Sangue di Giuda dell\'Oltrepo\' Pavese', 'Terre di Franciacorta', 'Valcalepio', 'Valtellina'],
      focus: {
        nome: 'Franciacorta DOCG',
        storia: 'Nato negli anni \'60 con Guido Berlucchi. Le morene glaciali del Lago d\'Iseo danno un terroir ideale per il Metodo Classico. Oggi la Franciacorta compete con lo Champagne di fascia alta.',
        terroir: 'Morene glaciali su pianura prealpina. Il Lago d\'Iseo mitiga il clima. Suoli di sabbia, ghiaia e argilla in proporzioni variabili per sottozona.',
        profilo: 'Frutta bianca e gialla, brioches, lieviti, bollicine cremose. Maggiore struttura e frutta matura rispetto alla Champagne.',
        note: 'Ca\' del Bosco, Bellavista, Berlucchi i colossi. Il Saten (solo uve bianche) e\' l\'originalita\' della Franciacorta. Dosaggi dal Pas Dose al Demi-Sec.'
      }
    },

    'Marche': {
      flag: '🌊', img: PX.vigne,
      note: 'Tra Appennino e Adriatico. Verdicchio di Jesi e Matelica, Rosso Conero, Lacrima di Morro — un repertorio autoctono straordinario.',
      docg: ['Castelli di Jesi Verdicchio Riserva', 'Conero', 'Offida', 'Verdicchio di Matelica Riserva', 'Vernaccia di Serrapetrona'],
      doc:  ['Bianchello del Metauro', 'Colli Maceratesi', 'Colli Pesaresi', 'Esino', 'Falerio', 'I Terreni di San Severino', 'Lacrima di Morro d\'Alba', 'Pergola', 'Rosso Conero', 'Rosso Piceno', 'San Ginesio', 'Serrapetrona', 'Terre di Offida', 'Verdicchio dei Castelli di Jesi', 'Verdicchio di Matelica'],
      focus: {
        nome: 'Verdicchio dei Castelli di Jesi DOC',
        storia: 'Il Verdicchio era famoso nel Medioevo — i Visconti lo servivano a corte. L\'anfora della bottiglia classica e\' ispirata ai contenitori greci dei Piceni. Bucci negli anni \'80 ne ha dimostrato la capacita\' di invecchiamento.',
        terroir: 'Colline argillose tra costa adriatica e Appennino. La zona Classica (Matelica e Jesi Classico) da\' i vini piu\' complessi.',
        profilo: 'Mandorla amara, erbe aromatiche, agrumi, note amare in chiusura tipiche. Freschezza vivace. Invecchia straordinariamente.',
        note: 'Bucci, Sartarelli, Garofoli i riferimenti. Il Classico Superiore Riserva puo\' invecchiare 10+ anni diventando minerale e complesso.'
      }
    },

    'Molise': {
      flag: '🌿', img: PX.vigne,
      note: 'La regione vinicola meno conosciuta d\'Italia. Il Tintilia e\' il vitigno autoctono riscoperto negli ultimi anni.',
      docg: [],
      doc:  ['Biferno', 'Molise', 'Pentro di Isernia', 'Tintilia del Molise'],
      focus: {
        nome: 'Tintilia del Molise DOC',
        storia: 'Il Tintilia era quasi scomparso. Riscoperto negli anni \'90 da pochi viticoltori appassionati, oggi e\' il simbolo del rinascimento vinicolo molisano. Il nome deriva probabilmente dallo spagnolo "tinto" (rosso).',
        terroir: 'Colline molisane tra 300 e 700m. Suoli argillosi e calcarei. Clima interno continentale.',
        profilo: 'Frutti di bosco, ciliegia, spezie mediterranee, note floreali. Struttura media, acidita\' viva, bevibilita\' immediata.',
        note: 'Roberto Lombardi e Claudio Cipressi i produttori che hanno reso famoso il Tintilia fuori regione.'
      }
    },

    'Piemonte': {
      flag: '🏔', img: PX.filari,
      note: 'La Borgogna italiana. 17 DOCG — piu\' di qualsiasi altra regione. Nebbiolo, Barbera, Moscato, Dolcetto, Arneis, Timorasso — un universo.',
      docg: ['Alta Langa', 'Asti', 'Barbaresco', 'Barbera d\'Asti', 'Barolo', 'Brachetto d\'Acqui', 'Dogliani', 'Erbaluce di Caluso', 'Gattinara', 'Gavi', 'Ghemme', 'Nizza', 'Ovada', 'Roero', 'Ruchè di Castagnole Monferrato', 'Strevi', 'Terre Alfieri'],
      doc:  ['Alba', 'Albugnano', 'Barbera d\'Alba', 'Barbera del Monferrato', 'Calosso', 'Canavese', 'Colli Tortonesi', 'Collina Torinese', 'Cortese dell\'Alto Monferrato', 'Dolcetto d\'Acqui', 'Dolcetto d\'Alba', 'Dolcetto d\'Asti', 'Dolcetto di Diano d\'Alba', 'Dolcetto di Ovada', 'Freisa d\'Asti', 'Freisa di Chieri', 'Gabiano', 'Grignolino d\'Asti', 'Grignolino del Monferrato Casalese', 'Langhe', 'Lessona', 'Loazzolo', 'Malvasia di Casorzo d\'Asti', 'Malvasia di Castelnuovo Don Bosco', 'Monferrato', 'Nebbiolo d\'Alba', 'Piemonte', 'Pinerolese', 'Rubino di Cantavenna', 'Sizzano', 'Valli Ossolane', 'Verduno Pelaverga'],
      focus: {
        nome: 'Barolo DOCG',
        storia: 'Il Re dei vini italiani. Nasce tra La Morra, Castiglione Falletto e Serralunga d\'Alba. Il conte Camillo Cavour e la marchesa Falletti di Barolo ne fecero il vino della casa reale sabauda nel XIX secolo.',
        terroir: 'Marne tortoniane a Serralunga (tannino duro) vs. elvetiane a La Morra (eleganza). Quote 150-400m. 155 MGA (Menzioni Geografiche Aggiuntive) codificano i cru.',
        profilo: 'Viola appassita, tabacco, catrame, rosa secca, liquirizia. Tannini imponenti, acidita\' alta. Affinamento minimo 38 mesi.',
        note: 'Giacomo Conterno, Bruno Giacosa, Gaja, Mascarello, Cappellano i produttori di culto. I migliori reggono 30-50 anni.'
      }
    },

    'Puglia': {
      flag: '🌞', img: PX.vigne,
      note: 'Il tacco dello stivale. Primitivo e Negroamaro su terre rosse ferraginose tra i piu\' antichi vigneti d\'Italia.',
      docg: ['Castel del Monte Bombino Nero', 'Castel del Monte Nero di Troia Riserva', 'Castel del Monte Rosso Riserva', 'Primitivo di Manduria Dolce Naturale'],
      doc:  ['Aleatico di Puglia', 'Barletta', 'Brindisi', 'Cacc\'e Mmitte di Lucera', 'Castel del Monte', 'Copertino', 'Galatina', 'Gioia del Colle', 'Gravina', 'Leverano', 'Lizzano', 'Locorotondo', 'Martina Franca', 'Matino', 'Moscato di Trani', 'Nardo\'', 'Orta Nova', 'Ostuni', 'Primitivo di Manduria', 'Rosso Barletta', 'Rosso di Cerignola', 'Salice Salentino', 'San Severo', 'Squinzano', 'Tavoliere delle Puglie', 'Terra d\'Otranto'],
      focus: {
        nome: 'Primitivo di Manduria DOC',
        storia: 'Il Primitivo e\' lo stesso vitigno dello Zinfandel californiano — identita\' confermata dall\'analisi genetica negli anni \'90. I californiani vennero in Puglia a studiarne le origini. Gianfranco Fino con "Es" ne ha ridefinito la qualita\'.',
        terroir: 'Tavoliere pugliese, suoli argillosi rossi ferrosi (terra rossa) a bassissima quota. Clima continentale arido, sole intenso.',
        profilo: 'Prugna, fico, cioccolato fondente, spezie calde, tabacco. Gradazione 14-17%, struttura imponente, finale caldo.',
        note: 'Gianfranco Fino, Pervini, Felline, Masseria Pepe i top. Il Primitivo di Manduria Dolce Naturale DOCG e\' la versione dessert straordinaria.'
      }
    },

    'Sardegna': {
      flag: '🏝', img: PX.vigne,
      note: 'L\'isola dei vitigni spagnoli diventati sardi. Cannonau longevo, Vermentino sapido, Carignano del Sulcis da viti centenarie su sabbia.',
      docg: ['Vermentino di Gallura'],
      doc:  ['Alghero', 'Arborea', 'Campidano di Terralba', 'Cannonau di Sardegna', 'Carignano del Sulcis', 'Girò di Cagliari', 'Malvasia di Bosa', 'Malvasia di Cagliari', 'Mandrolisai', 'Monica di Cagliari', 'Monica di Sardegna', 'Moscato di Cagliari', 'Moscato di Sorso-Sennori', 'Nasco di Cagliari', 'Nuragus di Cagliari', 'Sardegna Semidano', 'Vermentino di Sardegna', 'Vernaccia di Oristano'],
      focus: {
        nome: 'Vermentino di Gallura DOCG',
        storia: 'Unica DOCG sarda per i bianchi. La Gallura a nord-est dell\'isola ha graniti paleozoici unici. Il Vermentino qui raggiunge complessita\' irraggiungibili altrove in Italia.',
        terroir: 'Graniti paleozoici acidi e poveri. Vento maestrale costante. Microclima semi-arido con forti escursioni termiche giorno-notte.',
        profilo: 'Pesca bianca, agrumi, erbe mediterranee, note minerali granitiche. Freschezza sapida, struttura media, finale persistente.',
        note: 'Capichera, Surrau, CS della Gallura i top. Da non confondere con il Vermentino di Sardegna DOC (tutta l\'isola).'
      }
    },

    'Sicilia': {
      flag: '☀️', img: PX.etna,
      note: 'Il vulcano, il sale, il sole africano. L\'Etna come Borgogna. Il Nero d\'Avola come ambasciatore. Pantelleria come paradiso del passito.',
      docg: ['Cerasuolo di Vittoria'],
      doc:  ['Alcamo', 'Contea di Sclafani', 'Contessa Entellina', 'Delia Nivolelli', 'Eloro', 'Erice', 'Etna', 'Faro', 'Malvasia delle Lipari', 'Mamertino di Milazzo', 'Marsala', 'Menfi', 'Monreale', 'Noto', 'Pantelleria', 'Riesi', 'Santa Margherita di Belice', 'Sambuca di Sicilia', 'Sciacca', 'Sicilia', 'Siracusa', 'Vittoria'],
      focus: {
        nome: 'Etna DOC',
        storia: 'Il "rinascimento etneo" degli anni 2000 con Marc de Grazia, Cornelissen e Passopisciaro ha trasformato l\'Etna nel terroir piu\' discusso al mondo. Le 133 contrade sono l\'equivalente dei cru di Borgogna.',
        terroir: 'Sabbie laviche e ceneri vulcaniche a 400-1000m. Ogni contrada ha carattere diverso. Viti pre-fillossera centenarie ad alberello su lava.',
        profilo: 'Fragola selvatica, lampone, grafite, spezie, mineralita\' vulcanica. Acidita\' alta, tannini fini, grande freschezza nonostante il sole.',
        note: 'Benanti, Passopisciaro, Cornelissen, Terre Nere, Terre di Trente i riferimenti. Il Nerello Mascalese bianco Carricante e\' la scoperta degli ultimi anni.'
      }
    },

    'Toscana': {
      flag: '🌾', img: PX.vigne,
      note: 'Il Sangiovese e\' il cuore pulsante. Da Firenze a Montalcino, da Bolgheri al confine umbro. 11 DOCG, un patrimonio senza pari nel mondo.',
      docg: ['Brunello di Montalcino', 'Carmignano', 'Chianti', 'Chianti Classico', 'Elba Aleatico Passito', 'Montecucco Sangiovese', 'Morellino di Scansano', 'Vernaccia di San Gimignano', 'Vino Nobile di Montepulciano', 'Suvereto', 'Val di Cornia Rosso'],
      doc:  ['Ansonica Costa dell\'Argentario', 'Barco Reale di Carmignano', 'Bianco dell\'Empolese', 'Bianco di Pitigliano', 'Bolgheri', 'Bolgheri Sassicaia', 'Candia dei Colli Apuani', 'Capalbio', 'Colli dell\'Etruria Centrale', 'Colli di Luni', 'Colline Lucchesi', 'Cortona', 'Elba', 'Grance Senesi', 'Maremma Toscana', 'Massa Marittima', 'Montecarlo', 'Montecucco', 'Monteregio di Massa Marittima', 'Montescudaio', 'Morellino di Scansano', 'Orcia', 'Parrina', 'Pietraviva', 'Pomino', 'Rosso di Montalcino', 'Rosso di Montepulciano', 'San Gimignano', 'San Torpè', 'Sant\'Antimo', 'Terratico di Bibbona', 'Val d\'Arbia', 'Val di Cornia', 'Valdarno di Sopra', 'Valdichiana Toscana', 'Vin Santo del Chianti', 'Vin Santo del Chianti Classico', 'Vin Santo di Montepulciano'],
      focus: {
        nome: 'Brunello di Montalcino DOCG',
        storia: 'Ferruccio Biondi-Santi isolo\' nel 1888 il clone di Sangiovese Grosso chiamandolo Brunello. Oggi e\' il vino italiano piu\' longevo. Le Riserva possono durare 50+ anni in bottiglia.',
        terroir: 'Galestro e alberese su quattro versanti con caratteristiche diverse. Nord fresco ed elegante, Sud potente e strutturato. Quote 250-600m.',
        profilo: 'Ciliegia sotto spirito, tabacco, cuoio, fiori secchi, balsamico. Tannini imponenti, acidita\' alta. Affinamento 5 anni (Riserva 6).',
        note: 'Biondi-Santi, Soldera, Poggio di Sotto, Ciacci Piccolomini, Cerbaiona i grandi. Il Rosso di Montalcino DOC e\' l\'espressione piu\' accessibile dello stesso territorio.'
      }
    },

    'Trentino': {
      flag: '🏔', img: PX.calici,
      note: 'Le Dolomiti come sfondo. Teroldego unico al mondo, Trento DOC Metodo Classico di eccellenza, Marzemino di mozartiana memoria.',
      docg: [],
      doc:  ['Casteller', 'Marzemino', 'Sorni', 'Teroldego Rotaliano', 'Trento', 'Trentino', 'Valdadige', 'Valdadige Terradeiforti'],
      focus: {
        nome: 'Trento DOC',
        storia: 'Giulio Ferrari fondo\' l\'azienda nel 1902 dopo aver studiato in Champagne — porto\' il Metodo Classico sulle Alpi. Oggi Ferrari Riserva del Fondatore e\' tra i migliori Metodo Classico al mondo.',
        terroir: 'Fondovalle atesino, suoli calcarei e porfirici a varie quote. Il clima alpino con escursioni termiche preserva acidita\' e freschezza.',
        profilo: 'Frutta bianca, crosta di pane tostata, note floreali, bollicine finissime. Freschezza alpina, mineralita\' calcarea.',
        note: 'Ferrari, Rotari (Mezzacorona), Cavit, Letrari i produttori principali. Il Teroldego Rotaliano DOC su ghiaie del Campo Rotaliano e\' il rosso piu\' originale del Trentino.'
      }
    },

    'Umbria': {
      flag: '🌲', img: PX.vigne,
      note: 'Il cuore verde d\'Italia. Sagrantino di Montefalco ha i tannini piu\' alti del mondo. Orvieto e\' il bianco storico dei Papi.',
      docg: ['Montefalco Sagrantino', 'Torgiano Rosso Riserva'],
      doc:  ['Amelia', 'Assisi', 'Colli Altotiberini', 'Colli del Trasimeno', 'Colli Martani', 'Colli Perugini', 'Lago di Corbara', 'Montefalco', 'Orvieto', 'Rosso Orvietano', 'Spoleto', 'Torgiano'],
      focus: {
        nome: 'Montefalco Sagrantino DOCG',
        storia: 'Il Sagrantino ha i tannini piu\' alti di qualsiasi vino al mondo — misurati scientificamente. Era usato per il Passito nelle messe religiose. Arnaldo Caprai creo\' la versione secca moderna negli anni \'70.',
        terroir: 'Colline calcareo-argillose di Montefalco, 220-400m. Microclima continentale con estati calde e secche.',
        profilo: 'Mirtillo, more, cioccolato fondente, spezie, note ferrose. Tannini mostruosi che richiedono anni per ammorbidirsi. Potenziale 20-30 anni.',
        note: 'Arnaldo Caprai "25 Anni" il vino di riferimento. Colpetrone, Scacciadiavoli, Antonelli altri top. La versione Passito dolce e\' piu\' accessibile da giovane.'
      }
    },

    'Valle d\'Aosta': {
      flag: '🏔', img: PX.filari,
      note: 'La piu\' piccola denominazione d\'Italia. Vigneti a 300-1200m ai piedi del Monte Bianco. Vitigni alpini rarissimi come Petit Rouge, Fumin e Petite Arvine.',
      docg: [],
      doc:  ['Valle d\'Aosta / Vallee d\'Aoste', 'Valle d\'Aosta Arnad-Montjovet', 'Valle d\'Aosta Blanc de Morgex et de La Salle', 'Valle d\'Aosta Chambave', 'Valle d\'Aosta Donnas', 'Valle d\'Aosta Enfer d\'Arvier', 'Valle d\'Aosta Nus', 'Valle d\'Aosta Torrette'],
      focus: {
        nome: 'Valle d\'Aosta / Vallee d\'Aoste DOC',
        storia: 'Una sola DOC comprensiva per la regione piu\' piccola d\'Italia. I vigneti di Morgex e La Salle a 900-1200m sono tra i piu\' alti d\'Europa. Blanc de Morgex da Prie Blanc e\' quasi unico al mondo.',
        terroir: 'Suoli glaciali e granitici ai piedi del Monte Bianco e del Gran Paradiso. Clima alpino estremo, gelate primaverili frequenti.',
        profilo: 'Dipende dal vitigno: Blanc de Morgex (limone, fiori alpini, mineralita\' glaciale), Torrette da Petit Rouge (frutti rossi, spezie alpine), Donnas da Nebbiolo (elegante e montano).',
        note: 'Grosjean, Anselmet, La Crotta di Vegneron, Cave du Vin Blanc de Morgex i produttori. Vini rarissimi fuori regione.'
      }
    },

    'Veneto': {
      flag: '🏛', img: PX.cantina,
      note: 'Prima regione italiana per volume. Dal Lago di Garda alle Dolomiti, dall\'Amarone al Prosecco. Diversita\' e qualita\' in ogni angolo.',
      docg: ['Amarone della Valpolicella', 'Asolo Prosecco', 'Bagnoli Friularo', 'Bardolino Superiore', 'Colli Asolani-Prosecco', 'Colli di Conegliano', 'Colli Euganei Fior d\'Arancio', 'Conegliano Valdobbiadene Prosecco', 'Lison', 'Montello Rosso', 'Piave Malanotte', 'Recioto della Valpolicella', 'Recioto di Gambellara', 'Recioto di Soave', 'Soave Superiore'],
      doc:  ['Arcole', 'Bagnoli di Sopra', 'Bardolino', 'Bianco di Custoza', 'Colli Berici', 'Colli Euganei', 'Corti Benedettine del Padovano', 'Delle Venezie', 'Durello', 'Garda', 'Gambellara', 'Lessini Durello', 'Lison-Pramaggiore', 'Lugana', 'Merlara', 'Montagnana', 'Montello e Colli Asolani', 'Piave', 'Prosecco', 'Riviera del Brenta', 'San Martino della Battaglia', 'Soave', 'Valdadige', 'Valpolicella', 'Venezia', 'Vicenza', 'Zardetto'],
      focus: {
        nome: 'Amarone della Valpolicella DOCG',
        storia: 'Nato per caso: negli anni \'40 un Recioto "dimenticato" fermo\' fino in secco. Adelino Lucchese di Bertani assaggio\' il vino e disse: "Questo non e\' amaro — e\' amarone!". Da allora il nome e rimasto.',
        terroir: 'Tre zone: Classico (Val Negrar, Marano, Fumane — la piu\' pregiata), Valpantena, Est. Basalti e calcari a 200-600m sulle colline veronesi.',
        profilo: 'Ciliegia sotto spirito, prugna, cioccolato, spezie orientali, tabacco, note eteree. 15-17%, tannini vellutati, persistenza straordinaria.',
        note: 'Appassimento 90-120 giorni in fruttai (arele). Quintarelli, Dal Forno, Masi, Allegrini, Bertani i produttori di culto.'
      }
    },

  };

  /* ═══════════════════════════════════════════════
     30 ARTICOLI STATICI ROTANTI
  ═══════════════════════════════════════════════ */
  var ARTICOLI_STATICI = [
    { id:1, cat:'STORIA', e:'📜', img:PX.antico,
      t:'Il Vino nella Roma Antica: Falerno e Baccanali',
      s:'I Romani bevevano vino annacquato. Il Falerno era il Petrus dell\'Impero. Plinio descrisse 200 varieta\' di uva coltivate in Italia.',
      txt:'L\'Impero Romano era costruito su tre pilastri: grano, olio e vino. Il Falerno, prodotto sui pendii del Monte Massico in Campania, era il vino piu\' quotato — citato da Orazio, Virgilio e Plinio. Il vino romano era diverso: addensato con miele (mulsum), speziato con resina, conservato in anfore con coperture di pece. La diffusione attraverso l\'Impero porto\' la vite dal Reno alla Britannia, lasciando le radici delle grandi regioni vinicole europee di oggi.' },

    { id:2, cat:'TECNICA', e:'🍷', img:PX.degust,
      t:'L\'Arte del Decanting: Quando e Come',
      s:'Non tutti i vini vanno decantati. I rossi giovani e tannici beneficiano dell\'ossigenazione; i grandi vecchi vanno aperti con delicatezza.',
      txt:'Il decanter e\' lo strumento piu\' frainteso del sommelier. Due motivi per decantare: separare il sedimento (vini anziani) e ossigenare il vino per aprire gli aromi (vini giovani). Per un Barolo di 5 anni: decantare 1-2 ore. Per un Brunello di 20 anni: usare la candela per vedere il sedimento, fermarsi appena compare. I grandi bianchi complessi (Borgogna bianco, Fiano invecchiato) beneficiano di 20 minuti di decantazione. Mai decantare Champagne, frizzanti o Pinot Nero delicato.' },

    { id:3, cat:'VITIGNI RARI', e:'🍇', img:PX.etna,
      t:'Nerello Mascalese: Il Pinot Nero del Vulcano',
      s:'Sull\'Etna, tra 600 e 1000 metri, viti centenarie ad alberello producono vini che ricordano la Borgogna — e costano quanto lei.',
      txt:'Il Nerello Mascalese e\' il vitigno dell\'Etna: rosso leggero, acidissimo, con tannini fini che ricordano il Pinot Nero. Ogni contrada ha carattere distinto: Calderara Sottana elegante, Barbabecchi potente, Rampante sul versante nord piu\' acido e minerale. Le viti ad alberello centenario crescono su terreni lavici pre-fillossera — la fillossera non sopravvive sulla lava vulcanica. Il sistema delle 133 contrade, come i cru borgognoni, ha trasformato l\'Etna nel terroir piu\' discusso del vino mondiale.' },

    { id:4, cat:'VIGNE EROICHE', e:'⛰', img:PX.filari,
      t:'Le Vigne Eroiche: Dove il Vino Costa Fatica',
      s:'In Valtellina, sulle Cinque Terre, a Priorat e sulla Mosella, i viticoltori sfidano la gravita\' per produrre vino. Niente macchine.',
      txt:'Il CERVIM definisce "eroica" la viticoltura con pendenze superiori al 30%, quote sopra 500m, o viticoltura su isole. In Valtellina i muri a secco risalgono al Medioevo e vengono mantenuti a mano. In Liguria le uve si trasportano con monorotaie. Sul Reno ripido della Mosella i vignaioli si calano con funi. A Priorat i trattori monofilo "spider" sono l\'unica macchina possibile. Queste vigne producono vini rari, costosi, irriproducibili — e mantengono in vita paesaggi millenari.' },

    { id:5, cat:'TECNICA', e:'🥂', img:PX.calici,
      t:'La Temperatura di Servizio: Il Segreto Dimenticato',
      s:'Un Barolo a 25 gradi e\' inutile. Uno Champagne a 12 gradi e\' sprecato. La temperatura di servizio trasforma o distrugge un vino.',
      txt:'La temperatura di servizio e\' l\'errore piu\' frequente nei ristoranti. I rossi "a temperatura ambiente" risalgono all\'epoca pre-riscaldamento delle abitazioni a 16-18 gradi. Oggi "ambiente" significa 22-25 gradi — il vino diventa flaccido e alcolico. Regola: Champagne 6-8 gradi; bianchi leggeri 8-10; bianchi strutturati 10-12; rosati 10-12; Pinot Nero e rossi leggeri 14-16; rossi strutturati 16-18; vini dolci 8-10. Una bottiglia si scalda di 2 gradi ogni 10 minuti a temperatura ambiente.' },

    { id:6, cat:'STORIA', e:'📜', img:PX.degust,
      t:'Il Giudizio di Parigi 1976: California vs Francia',
      s:'Il 24 maggio 1976 esperti francesi assaggiarono alla cieca vini californiani contro i grandi Bordeaux e Borgogna. La California vinse.',
      txt:'Steven Spurrier organizzo\' una degustazione cieca per il bicentenario americano. I giudici erano tutti francesi. Il Chardonnay Chateau Montelena 1973 vinse sui bianchi francesi. Il Cabernet Stag\'s Leap Wine Cellars 1973 vinse sui Bordeaux. I giudici credevano di assaggiare i loro vini. La notizia fu ignorata in Francia ma esplose in America. George Taber del Time fu l\'unico giornalista presente. La Borgogna e Bordeaux non furono mai piu\' gli stessi.' },

    { id:7, cat:'VITIGNI RARI', e:'🍇', img:PX.grappoli,
      t:'Timorasso: Il Vitigno Resurrezione del Piemonte',
      s:'Quasi estinto negli anni \'80, il Timorasso dei Colli Tortonesi e\' oggi uno dei bianchi piu\' ricercati d\'Italia. Walter Massa lo ha salvato.',
      txt:'Il Timorasso cresceva sui Colli Tortonesi fino agli anni \'50, poi quasi scomparve. Walter Massa di Monleale nei \'90 decise di recuperarlo. Il risultato fu sorprendente: bianco strutturato, grasso, minerale, capace di invecchiare 15-20 anni. L\'aroma ricorda il Riesling Mosella ma con corpo piu\' pieno. Oggi il Derthona (nome storico dei vini tortonesi) di Massa, Boveri e Mutti viene venduto a prezzi paragonabili ai grandi bianchi borgognoni.' },

    { id:8, cat:'LUOGHI', e:'🌍', img:PX.filari,
      t:'La Mosella: Le Vigne piu\' Ripide del Mondo',
      s:'Sul fiume Mosella in Germania le vigne crescono su ardesia blu a 70 gradi di inclinazione. Il Riesling che ne nasce e\' il vino piu\' longevo al mondo.',
      txt:'La Mosella serpeggia tra le Ardenne e il Reno. I vignaioli hanno costruito terrazzamenti verticali su ardesia blu devoniana da 2000 anni. L\'ardesia trattiene il calore solare e lo rilascia di notte. Il Riesling di Mosella e\' il vino piu\' longevo al mondo: bottiglie degli anni \'70 sono ancora magnifiche. Egon Muller (Scharzhofberg), JJ Prum (Wehlener Sonnenuhr), Loosen (Doctor) producono qui i Trockenbeerenauslese piu\' costosi del mondo.' },

    { id:9, cat:'TECNICA', e:'🍷', img:PX.calici,
      t:'I Bicchieri del Vino: Perche\' la Forma Conta',
      s:'Un Barolo nel calice sbagliato perde il 40% degli aromi. Riedel, Zalto, Spiegelau: la scienza dei bicchieri e\' seria quanto l\'enologia.',
      txt:'Georg Riedel negli anni \'70 dimostro\' scientificamente che la forma del bicchiere influenza la percezione del vino. Il calice Borgogna e\' ampio e rotondo per i profumi delicati. Il Bordeaux e\' piu\' alto e stretto per i tannini. Il flute per Champagne e\' elegante ma disperde gli aromi — meglio il tulipano. Regole base: bicchiere trasparente, cristallo sottile, stelo lungo. Non riempire mai piu\' di un terzo. Tenere sempre dal gambo per non scaldare il vino.' },

    { id:10, cat:'STORIA', e:'📜', img:PX.terra,
      t:'La Fillossera: Il Parassita che Distrusse l\'Europa',
      s:'Dal 1860 al 1890 un minuscolo afide americano distrusse il 70% dei vigneti europei. Il vino non fu mai piu\' lo stesso.',
      txt:'La Phylloxera vastatrix arrivo\' in Europa nel 1863 importata dall\'America con piante ornamentali. L\'afide attacca le radici della Vitis vinifera europea che non ha difese. In 20 anni distrusse vigneti in tutta Europa. La soluzione: innestare le viti europee su radici di vite americana resistente. Oggi il 99% dei vigneti mondiali e\' innestato. Pochissime eccezioni sopravvivono su piede franco: Colares in Portogallo su sabbia, alcune zone di Pantelleria, il Cannonau sardo, i vecchi vigneti dell\'Etna. Il vino pre-fillossera e\' perduto per sempre.' },

    { id:11, cat:'VIGNE EROICHE', e:'⛰', img:PX.pantelleria,
      t:'L\'Alberello Pantesco: La Viticoltura piu\' Antica del Mediterraneo',
      s:'A Pantelleria le viti si sdraiano sulla lava nera come sculture viventi. E\' il sistema di allevamento piu\' antico del Mediterraneo — UNESCO 2014.',
      txt:'L\'alberello pantesco e\' stato riconosciuto dall\'UNESCO nel 2014 come Patrimonio Immateriale dell\'Umanita\'. La vite viene potata a cespuglio bassissimo, quasi a contatto con la lava nera, per resistere allo scirocco africano e catturare l\'umidita\' notturna. Ogni pianta produce meno di 500 grammi di uva. La vendemmia e\' completamente manuale, spesso in ginocchio. Le viti piu\' vecchie hanno 150-200 anni con radici franche pre-fillossera. Il Passito di Pantelleria e\' uno dei vini dolci piu\' grandi del mondo.' },

    { id:12, cat:'TECNICA', e:'🍷', img:PX.sommelier,
      t:'Il Cavatappi del Sommelier: Guida Definitiva',
      s:'Il Waiter\'s Friend, l\'Ah-So, il Durand per bottiglie anziane. Ogni cavatappi ha la sua specialita\'.',
      txt:'Il cavatappi professionale (Waiter\'s Friend) con doppia leva e\' il piu\' usato nei ristoranti del mondo. Per bottiglie antiche con tappi fragili: il sistema Ah-So (due lame laterali) si avvolge lentamente il sughero senza perforarlo. Il Durand combina vite elicoidale e Ah-So per i casi piu\' difficili (Borgogna anni \'60-\'70). Mai aprire Champagne con il cavatappi — la pressione e\' 6 atmosfere. Il coltellino del sommelier serve per rimuovere la capsula con precisione prima dell\'apertura.' },

    { id:13, cat:'VITIGNI RARI', e:'🍇', img:PX.grappoli,
      t:'Gewurztraminer: Il Vino che Profuma di Rosa e Litchi',
      s:'Il vitigno piu\' aromatico al mondo nasce a Termeno in Alto Adige. Il suo profumo di litchi, rosa e spezie orientali e\' inconfondibile.',
      txt:'Tramin/Termeno e\' un piccolo comune dell\'Alto Adige dove il Gewurztraminer ha avuto origine nel Medioevo. L\'uva ha buccia rosata e aromi cosi\' intensi da essere riconoscibile a distanza dalla vigna in fase di maturazione. Gli Alsaziani ne fanno la versione piu\' famosa (Weinbach, Trimbach, Zind-Humbrecht), in versione secca e Vendange Tardive. In Alto Adige: Hofstatter, Cantina Tramin, Franz Haas. Il Gewurztraminer Vendange Tardive alsaziano e\' tra i vini dolci piu\' aromatici prodotti.' },

    { id:14, cat:'LUOGHI', e:'🌍', img:PX.borgogna,
      t:'La Borgogna: Dove 1 Ettaro Vale 50 Milioni',
      s:'La Romanee-Conti ha 1,8 ettari e produce 6000 bottiglie l\'anno. Un ettaro di Grand Cru costa piu\' di qualsiasi immobile al mondo.',
      txt:'La Cote d\'Or e\' una striscia di terra lunga 50km e larga 2km tra Dijon e Beaune. Su questo calcare e argilla si producono i vini piu\' costosi del mondo. La Romanee-Conti (DRC) vale oltre 1 milione di euro ad ettaro. La Borgogna e\' unica per la parcellizzazione estrema: il Clos de Vougeot ha 80 proprietari diversi. Il sistema Grand Cru, Premier Cru, Village, Regional e\' il modello copiato in tutto il mondo. I vini DRC vengono venduti solo in cassetta mista e i collezionisti li accumulano senza aprirli.' },

    { id:15, cat:'STORIA', e:'📜', img:PX.calici,
      t:'Dom Perignon e il Mito dello Champagne',
      s:'Dom Perignon NON ha inventato lo Champagne. Ma ha migliorato ogni aspetto della sua produzione — e il mito e\' ormai inseparabile dalla realta\'.',
      txt:'Pierre Perignon, frate benedettino dell\'Abbazia di Hautvillers, lavoro\' dal 1668 al 1715 perfezionando il vino della Champagne. Ma le bollicine le scoprirono gli inglesi: nel 1662 Christopher Merret scrisse il primo documento che descrive il metodo per rendere spumante il vino. Dom Perignon odiava le bollicine e cercava di eliminarle. La sua vera rivoluzione fu la cuvee (assemblaggio di vini diversi), il tappo di sughero, e la selezione rigorosa delle uve. Moet ha acquisito il nome "Dom Perignon" nel 1936 per la sua cuvee prestige.' },

    { id:16, cat:'TECNICA', e:'🍷', img:PX.sommelier,
      t:'Come Assaggiare un Vino: Il Protocollo del Sommelier',
      s:'Vista, naso, bocca. Tre fasi che richiedono concentrazione. Un vino non va "bevuto" al primo assaggio — va ascoltato.',
      txt:'La degustazione professionale ha un protocollo preciso. Vista: colore, limpidezza, consistenza. Naso: primo naso (aromi primari del vitigno), secondo naso dopo rotazione (aromi secondari della fermentazione), terzo naso dopo riposo (aromi terziari dell\'affinamento). Bocca: ingresso, sviluppo (acidita\', tannini, struttura), finale (persistenza in secondi — PAI). La scheda AIS codifica ogni parametro. Un grande vino ha equilibrio tra acidita\', tannini, alcol e morbidezza — nessuno degli elementi prevale sugli altri.' },

    { id:17, cat:'VITIGNI RARI', e:'🍇', img:PX.cantina,
      t:'Ribolla Gialla e i Vini Orange: La Rivoluzione di Gravner',
      s:'Josko Gravner nel 1997 fece fermentare il bianco sulle bucce per mesi in anfore di terracotta. Nacque il vino orange.',
      txt:'La Ribolla Gialla e\' il vitigno autoctono del Collio friulano. Josko Gravner nel 1997, dopo un viaggio in Georgia, scopri\' i Kvevri — anfore di terracotta interrate. Torno\' in Friuli e comincio\' a fermentare la Ribolla con bucce per 6 mesi in anfore. Il risultato fu un vino ambrato, tannico, ossidativo, senza solfiti aggiunti. In 10 anni divento\' il simbolo del movimento natural wine. Stanko Radikon segui\' la stessa strada. Oggi i loro vini vengono venduti a 100+ euro la bottiglia.' },

    { id:18, cat:'LUOGHI', e:'🌍', img:PX.pantelleria,
      t:'Pantelleria: L\'Isola del Vento tra Africa e Sicilia',
      s:'A 70km dalla Tunisia, Pantelleria e\' il luogo piu\' insolito della viticoltura italiana. Lava nera, scirocco africano, Zibibbo ad alberello.',
      txt:'Pantelleria e\' geologicamente africana — la lava e\' la stessa del continente. Gli Arabi portarono lo Zibibbo nell\'827 d.C. durante la conquista dell\'isola. Oggi i 4000 ettari vitati sono coltivati da poche decine di famiglie su terrazzamenti lavici. Il Passito di Pantelleria e\' ottenuto da uve appassite al sole per 20-30 giorni. Ben\'Rye di Donnafugata ha reso famosa l\'isola in tutto il mondo.' },

    { id:19, cat:'STORIA', e:'📜', img:PX.antico,
      t:'I Vini del Medioevo: Ippocrasso, Vernaccia e Monasteri',
      s:'Nel Medioevo i monasteri erano custodi del vino. I monaci benedettini e cistercensi trasformarono la viticoltura europea in una scienza.',
      txt:'I monaci benedettini (ora et labora) coltivavano la vite per il vino della Messa e per la medicina. I cistercensi crearono il Clos de Vougeot nel 1141, costruendo il muro che ancora lo circonda. L\'ippocrasso era il vino dei nobili medievali: vino rosso speziato con cannella, chiodi di garofano e zucchero di canna. I vini medievali erano spesso diluiti e speziati. La Vernaccia di San Gimignano era gia\' famosa nel 1282: il vino dell\'aristocrazia toscana.' },

    { id:20, cat:'TECNICA', e:'🍷', img:PX.degust,
      t:'L\'Abbinamento Cibo-Vino: Le Regole che Si Possono Rompere',
      s:'Bianco col pesce, rosso con la carne: e\' una semplificazione. La vera regola e\' l\'equilibrio tra le strutture del piatto e del vino.',
      txt:'Le regole dell\'abbinamento sono state scritte per essere infrante con criterio. La vera logica e\' l\'equilibrio: un piatto grasso (costata, formaggi stagionati) vuole un vino con tannini o acidita\' per tagliare la grassezza. Un pesce delicato vuole un bianco leggero per non coprirlo. Ma la pasta al tartufo bianco con un Barolo e\' uno dei grandi abbinamenti regionali piemontesi. I quattro principi base: concordanza, contrasto, regionalita\', stagionalita\'. Foie gras con Sauternes: dolce acido, contrasto perfetto.' },

    { id:21, cat:'VITIGNI RARI', e:'🍇', img:PX.vigne,
      t:'Sagrantino: Il Vino con piu\' Tannini del Mondo',
      s:'Scientificamente misurato, il Sagrantino di Montefalco ha la concentrazione di tannini piu\' alta di qualsiasi vino prodotto. Ma con il tempo e\' straordinario.',
      txt:'Il Sagrantino e\' un vitigno autoctono di Montefalco, Umbria. Studi dell\'Universita\' di Perugia hanno misurato la sua concentrazione di proantocianidine come la piu\' alta al mondo — superiore anche al Tannat uruguayano. Da giovane e\' quasi imbevibile: asciuga completamente la bocca. Ma con 10-15 anni di affinamento diventa vellutato, profondo, complesso. Arnaldo Caprai ha creato il "25 Anni" invecchiandolo in barrique per 5 anni. La versione Passito dolce — quella originale — e\' piu\' accessibile da giovane.' },

    { id:22, cat:'LUOGHI', e:'🌍', img:PX.filari,
      t:'Le Langhe: La Borgogna Italiana dei Tannini',
      s:'Le colline delle Langhe a sud di Alba sono tra i paesaggi viticoli piu\' belli del mondo — UNESCO dal 2014. Barolo, Barbaresco, Dolcetto, Barbera.',
      txt:'Le Langhe sono colline formate da depositi marini terziari nell\'entroterra cuneese. La suddivisione in MGA ha codificato 155 cru solo per il Barolo e 66 per il Barbaresco. La diversita\' geologica e\' straordinaria: marne tortoniane su Serralunga (tannini duri, longevita\') vs. marne elvetiane su La Morra (eleganza). Ristoranti come Piazza Duomo di Enrico Crippa (3 stelle Michelin) ad Alba fanno delle Langhe una meta gastronomica mondiale. La Fiera del Tartufo Bianco di Alba (ottobre-novembre) e\' il momento culminante.' },

    { id:23, cat:'STORIA', e:'📜', img:PX.vigne,
      t:'La Nascita del Chianti: Barone Ricasoli e la Formula Segreta',
      s:'Nel 1872 Bettino Ricasoli scrisse la formula del Chianti: Sangiovese, Canaiolo, Malvasia. Una ricetta che ha dominato per un secolo.',
      txt:'Bettino Ricasoli, Presidente del Consiglio italiano dopo Cavour, scrisse nel 1872 la sua formula del Chianti Classico: Sangiovese per colore e struttura, Canaiolo per ammorbidire i tannini, Malvasia bianca per profumo e morbidezza. Per un secolo questa formula fu legge. Poi negli anni \'70 i produttori di qualita\' eliminarono la Malvasia che diluiva il vino e aggiunsero Cabernet Sauvignon. I Supertuscan nacquero da questa ribellione. Nel 1996 il disciplinare fu riformato: oggi il Chianti Classico puo\' essere 100% Sangiovese.' },

    { id:24, cat:'TECNICA', e:'🍷', img:PX.calici,
      t:'Il Metodo Classico: Champagne, Franciacorta, Trento',
      s:'Tre paesi, stesso metodo, caratteri completamente diversi. La seconda fermentazione in bottiglia e\' il modo piu\' nobile di fare le bollicine.',
      txt:'Il Metodo Classico prevede la rifermentazione in bottiglia con lieviti e zucchero (liqueur de tirage). La seconda fermentazione produce CO2 intrappolata — le bollicine. Il remuage porta i lieviti sul tappo. Il degorgement li elimina. La liqueur d\'expedition aggiusta la dolcezza. In Champagne: gessi e argille della Marne danno mineralita\' e freschezza. In Franciacorta: morene glaciali danno struttura. In Trentino: calcare alpino da\' freschezza e acidita\'. I migliori Metodo Classico italiani competono con lo Champagne.' },

    { id:25, cat:'VITIGNI RARI', e:'🍇', img:PX.grappoli,
      t:'Pecorino: Il Vitigno Quasi Estinto che Vale Oro',
      s:'Negli anni \'80 il Pecorino era ridotto a poche piante selvatiche nelle Marche. Oggi e\' uno dei bianchi italiani piu\' premiati.',
      txt:'Il Pecorino (il nome viene dalle pecore che mangiavano i grappoli dolci durante le migrazioni autunnali) era praticamente estinto negli anni \'80. Produttori marchigiani lo recuperarono da viti selvatiche sui costoni. Il risultato e\' un bianco di grande struttura, sapidita\' intensa, acidita\' vibrante — quasi un "bianco con anima da rosso". La DOCG Offida Pecorino e l\'IGT Terre di Offida ne sono le espressioni principali. Velenosi, Aurora, Cantina dei Colli Ripani tra i migliori.' },

    { id:26, cat:'LUOGHI', e:'🌍', img:PX.terra,
      t:'Santorini: Il Vino Vulcanico dell\'Egeo',
      s:'Su pomice e cenere vulcanica, a 36 gradi di latitudine, l\'Assyrtiko produce i bianchi piu\' minerali d\'Europa. La vigna Kouloura ha 3500 anni.',
      txt:'Santorini e\' il cratere di un supervulcano esploso 3600 anni fa. Il suolo e\' pomice, cenere e basalto nero — nessuna argilla. La vite Assyrtiko sopravvive in secco grazie al sistema Kouloura — allevata a cesto intrecciato che protegge i grappoli dal vento. Le viti piu\' vecchie hanno 200 anni con radici franche pre-fillossera — la fillossera non sopravvive sulla pomice. Gaia, Hatzidakis e Sigalas producono bianchi di mineralita\' vulcanica incomparabile.' },

    { id:27, cat:'STORIA', e:'📜', img:PX.cantina,
      t:'Barolo: Da Vino Dolce a Re dei Vini',
      s:'Prima del 1850 il Barolo era dolce e semi-fermentato. Cavour chiamo\' l\'enologo francese Oudart per trasformarlo nel vino che conosciamo.',
      txt:'Il Barolo che conosciamo esiste da meno di 200 anni. Prima del 1850 era vinificato dolce — la fermentazione si arrestava col freddo autunnale prima che tutti gli zuccheri si esaurissero. Il conte Cavour chiamo\' Louis Oudart, enologo francese, per riformare la produzione. Oudart insegno\' la fermentazione completa in secco e l\'affinamento prolungato. La marchesa Giulia Falletti di Barolo dono\' al re Carlo Alberto 325 botti del nuovo vino — una per ogni giorno dell\'anno. Il "Re dei Vini" nacque cosi\'.' },

    { id:28, cat:'TECNICA', e:'🍷', img:PX.vigne,
      t:'Il Vino Naturale: Cosa Significa Davvero',
      s:'Natural wine, biologico, biodinamico, artigianale — le etichette si moltiplicano. Cosa distingue davvero un vino "naturale" da uno convenzionale?',
      txt:'Non esiste una definizione legale di "vino naturale". Per convenzione indica: uve biologiche, fermentazione con lieviti indigeni (senza inoculo di selezionati), senza o bassissima aggiunta di solfiti, nessuna correzione chimica. I vini biologici hanno regole precise sull\'uso di pesticidi. I biodinamici lavorano secondo il calendario lunare e usano preparati omeopatici. I vini naturali possono essere torbidi, con lievi ossidazioni, con rifermentazione in bottiglia. Non sono automaticamente migliori dei convenzionali — ma raccontano un terroir senza filtri.' },

    { id:29, cat:'VITIGNI RARI', e:'🍇', img:PX.etna,
      t:'Carricante: L\'Etna Bianco Scoperta degli Ultimi Anni',
      s:'Mentre il mondo scopriva il Nerello Mascalese, il Carricante e\' rimasto nell\'ombra. Oggi e\' uno dei bianchi piu\' eleganti d\'Italia.',
      txt:'Il Carricante (da "caricare" — carico di uve) e\' il vitigno bianco dell\'Etna, coltivato principalmente sul versante est nella zona di Milo. Su suoli lavici a 600-900m produce un bianco di mineralita\' vulcanica straordinaria, acidita\' quasi renana, struttura che permette l\'invecchiamento 10+ anni. Benanti e\' il pioniere con il Pietramarina da vecchie vigne di Carricante a Milo. Il confronto con il Chablis Grand Cru non e\' irragionevole — stessa mineralita\' segnata, stessa freschezza tagliente.' },

    { id:30, cat:'LUOGHI', e:'🌍', img:PX.cantina,
      t:'La Valpolicella: Tre Vini da un\'Unica Vigna',
      s:'Le stesse uve Corvina danno tre vini completamente diversi: Valpolicella fresco, Ripasso morbido, Amarone potente. Il segreto e\' l\'appassimento.',
      txt:'La Valpolicella e\' un sistema viticolo unico al mondo: le stesse uve coltivate negli stessi vigneti danno tre vini diversissimi. Il Valpolicella Classico e\' leggero e fresco. Il Ripasso viene fatto "ripassare" sulle vinacce dell\'Amarone — le bucce secche cedono struttura. L\'Amarone nasce dall\'appassimento: le uve appassiscono per 90-120 giorni in fruttai, perdendo il 30-35% del peso. La concentrazione che ne risulta produce un vino di 15-17 gradi con struttura monumentale. Quintarelli, Dal Forno, Masi, Allegrini i nomi di riferimento.' },
  ];

  /* ═══════════════════════════════════════════════
     CSS v9
  ═══════════════════════════════════════════════ */
  function css9() {
    if (document.querySelector('#sw9-css')) return;
    var s = document.createElement('style');
    s.id = 'sw9-css';
    s.textContent = [
      ':root{--v9n:#0A0705;--v9o:#D4AF37;--v9b:#CD7F32;--v9r:#4A0404;--v9c:#F5EFE2;--v9g:rgba(245,239,226,.55);--v9rad:8px;}',
      'body{background:var(--v9n)!important;color:var(--v9c)!important;-webkit-font-smoothing:antialiased;}',

      /* Nav glassmorphism */
      'nav{background:rgba(10,7,5,.88)!important;backdrop-filter:blur(16px) saturate(180%)!important;-webkit-backdrop-filter:blur(16px) saturate(180%)!important;border-bottom:1px solid rgba(212,175,55,.2)!important;box-shadow:0 2px 20px rgba(0,0,0,.5)!important;}',

      /* Tab */
      '.ntab{font-size:9px!important;font-weight:700!important;letter-spacing:1.8px!important;text-transform:uppercase!important;color:rgba(212,175,55,.5)!important;padding:6px 10px!important;border-bottom:2px solid transparent!important;transition:all .2s!important;min-width:50px!important;}',
      '.ntab.active,.ntab:hover{color:var(--v9o)!important;border-bottom-color:var(--v9o)!important;background:rgba(212,175,55,.07)!important;}',
      '.ntab .ico{font-size:16px!important;display:block;margin-bottom:2px;}',
      '.ntab .lbl{display:block;}',

      /* Cards */
      '.news-item,.gz-card,.ev-card,[class*="-card"]{border-radius:var(--v9rad)!important;border:1px solid rgba(212,175,55,.15)!important;transition:all .25s!important;}',
      '.news-item:hover,.gz-card:hover{border-color:rgba(212,175,55,.4)!important;transform:translateY(-2px)!important;}',

      /* Buttons / inputs */
      'button,.btn{border-radius:var(--v9rad)!important;}',
      'input,textarea,select{border-radius:var(--v9rad)!important;background:rgba(255,255,255,.06)!important;border:1px solid rgba(212,175,55,.25)!important;color:var(--v9c)!important;font-size:16px!important;}',
      'input:focus,textarea:focus,select:focus{border-color:rgba(212,175,55,.6)!important;outline:none!important;box-shadow:0 0 0 2px rgba(212,175,55,.12)!important;}',

      /* Quick grid */
      '#sw9-quick{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px;}',
      '.sw9-qb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:16px 10px;background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.18);border-radius:var(--v9rad);cursor:pointer;text-align:center;transition:all .22s;position:relative;overflow:hidden;min-height:88px;}',
      '.sw9-qb:hover{border-color:rgba(212,175,55,.45);background:rgba(212,175,55,.08);transform:translateY(-1px);}',
      '.sw9-qb-ico{font-size:26px;line-height:1;position:relative;z-index:1;}',
      '.sw9-qb-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--v9o);position:relative;z-index:1;}',
      '.sw9-qb-sub{font-size:9px;color:rgba(245,239,226,.4);letter-spacing:.5px;position:relative;z-index:1;}',
      '.sw9-qb-badge{position:absolute;top:7px;right:7px;background:var(--v9r);color:rgba(245,239,226,.85);font-size:8px;font-weight:700;letter-spacing:1px;padding:2px 5px;border-radius:8px;z-index:2;}',
      '@media(min-width:600px){#sw9-quick{grid-template-columns:repeat(4,1fr);}}',

      /* Articoli */
      '#sw9-articles{background:var(--v9n);}',
      '.sw9-ah{position:relative;overflow:hidden;height:clamp(180px,45vw,340px);cursor:pointer;}',
      '.sw9-ah img{width:100%;height:100%;object-fit:cover;filter:brightness(.58) saturate(1.2);transition:transform .5s,filter .4s;}',
      '.sw9-ah:hover img{transform:scale(1.04);filter:brightness(.68) saturate(1.3);}',
      '.sw9-aho{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(10,7,5,.1) 0%,rgba(10,7,5,.82) 100%);padding:18px;display:flex;flex-direction:column;justify-content:flex-end;}',
      '.sw9-ac{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;margin-bottom:7px;}',
      '.sw9-at{font-family:"Playfair Display",Georgia,serif;font-size:clamp(1.05rem,4vw,1.55rem);font-weight:700;color:#fff;line-height:1.25;margin-bottom:7px;}',
      '.sw9-as{font-size:12px;color:rgba(245,239,226,.65);line-height:1.55;}',
      '.sw9-ag{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(212,175,55,.1);}',
      '.sw9-as2{background:var(--v9n);cursor:pointer;transition:background .2s;}',
      '.sw9-as2:hover{background:rgba(212,175,55,.05);}',
      '.sw9-as2 img{width:100%;height:100px;object-fit:cover;filter:brightness(.58);display:block;}',
      '.sw9-as2b{padding:11px;}',
      '.sw9-as2c{font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#D4AF37;margin-bottom:5px;}',
      '.sw9-as2t{font-family:"Playfair Display",Georgia,serif;font-size:.82rem;font-weight:700;color:#F5EFE2;line-height:1.3;}',
      '@media(max-width:480px){.sw9-ag{grid-template-columns:1fr;}.sw9-as2 img{height:130px;}}',

      /* Modal articolo */
      '#sw9-modal{display:none;position:fixed;inset:0;z-index:999990;background:rgba(10,7,5,.97);overflow-y:auto;}',
      '#sw9-modal-close{position:fixed;top:14px;right:14px;z-index:999991;background:rgba(10,7,5,.88);border:1px solid rgba(212,175,55,.35);color:#D4AF37;font-size:20px;width:42px;height:42px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);}',
      '#sw9-mi{max-width:680px;margin:0 auto;padding-bottom:40px;}',
      '#sw9-mi img{width:100%;height:clamp(200px,50vw,420px);object-fit:cover;display:block;}',
      '#sw9-mb{padding:22px 18px 40px;}',
      '#sw9-mcat{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;margin-bottom:11px;}',
      '#sw9-mtit{font-family:"Playfair Display",Georgia,serif;font-size:clamp(1.35rem,5vw,2rem);font-weight:700;color:#F5EFE2;line-height:1.25;margin-bottom:14px;}',
      '#sw9-msom{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-size:1rem;color:rgba(245,239,226,.62);line-height:1.7;margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(212,175,55,.15);}',
      '#sw9-mtxt{font-size:15px;color:rgba(245,239,226,.8);line-height:1.85;}',

      /* Denominazioni */
      '#sw9-den-nav{display:flex;flex-wrap:wrap;gap:5px;padding:12px 12px;border-bottom:1px solid rgba(212,175,55,.1);position:sticky;top:54px;z-index:50;background:rgba(10,7,5,.97);backdrop-filter:blur(8px);}',
      '.sw9-rbtn{padding:5px 11px;background:rgba(255,255,255,.04);border:1px solid rgba(212,175,55,.2);border-radius:14px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(212,175,55,.65);cursor:pointer;transition:all .2s;white-space:nowrap;}',
      '.sw9-rbtn:hover,.sw9-rbtn.sw9-ra{background:rgba(212,175,55,.15);border-color:#D4AF37;color:#D4AF37;}',

      /* Scrollbar */
      '::-webkit-scrollbar{width:5px;height:5px;}',
      '::-webkit-scrollbar-track{background:var(--v9n);}',
      '::-webkit-scrollbar-thumb{background:rgba(212,175,55,.35);border-radius:3px;}',

      '@keyframes sw9fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
    ].join('');
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════
     QUICK GRID 2x2 — above the fold
  ═══════════════════════════════════════════════ */
  var QBTNS = [
    { ico:'🍷', lbl:'Sommelier', sub:'Abbinamento AI', page:'sommelier', badge:'AI', img:PX.sommelier },
    { ico:'🌿', lbl:'Terroir', sub:'327 denominazioni', page:'explore', badge:null, img:PX.vigne },
    { ico:'🏅', lbl:'Produttori', sub:'Directory cantine', page:'producers', badge:'NEW', img:PX.cantina },
    { ico:'📅', lbl:'Eventi', sub:'Degustazioni & Fiere', page:'events', badge:null, img:PX.degust },
  ];

  function injectQuick() {
    if (document.querySelector('#sw9-quick')) return;
    var homeBody = document.querySelector('#page-home .home-body');
    if (!homeBody) return;

    // Nascondi quick v7/v8
    ['#sw7-quick','#sw8-quick'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    var g = document.createElement('div');
    g.id = 'sw9-quick';

    QBTNS.forEach(function(btn) {
      var el = document.createElement('div');
      el.className = 'sw9-qb';
      // Sfondo immagine con overlay
      el.style.cssText = [
        'background-image:url("' + px(btn.img,400,300) + '")',
        'background-size:cover',
        'background-position:center',
      ].join(';');
      el.innerHTML =
        '<div style="position:absolute;inset:0;background:rgba(10,7,5,.8);border-radius:inherit;"></div>' +
        (btn.badge ? '<div class="sw9-qb-badge">' + btn.badge + '</div>' : '') +
        '<div class="sw9-qb-ico">' + btn.ico + '</div>' +
        '<div class="sw9-qb-lbl">' + btn.lbl + '</div>' +
        '<div class="sw9-qb-sub">' + btn.sub + '</div>';

      el.addEventListener('click', function() {
        var tab = document.querySelector('.ntab[data-page="' + btn.page + '"]');
        if (tab) { tab.click(); }
        else {
          document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
          var target = document.querySelector('#page-' + btn.page);
          if (target) { target.classList.add('active'); window.scrollTo(0,0); }
        }
      });
      g.appendChild(el);
    });

    homeBody.insertBefore(g, homeBody.firstChild);
    console.log('[SW-v9] Quick grid ok');
  }

  /* ═══════════════════════════════════════════════
     ARTICOLI ROTANTI + MODAL
  ═══════════════════════════════════════════════ */
  function getDayOffset() {
    var now = new Date();
    return Math.floor(now.getTime() / 86400000) % ARTICOLI_STATICI.length;
  }

  function buildModal9() {
    if (document.querySelector('#sw9-modal')) return;
    var m = document.createElement('div');
    m.id = 'sw9-modal';
    m.innerHTML =
      '<button id="sw9-modal-close" onclick="document.querySelector(\'#sw9-modal\').style.display=\'none\';document.body.style.overflow=\'\';">✕</button>' +
      '<div id="sw9-mi">' +
        '<img id="sw9-mimg" src="" alt="" loading="lazy">' +
        '<div id="sw9-mb">' +
          '<div id="sw9-mcat"></div>' +
          '<div id="sw9-mtit"></div>' +
          '<div id="sw9-msom"></div>' +
          '<div id="sw9-mtxt"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
  }

  function openArt(a) {
    buildModal9();
    document.querySelector('#sw9-mimg').src = px(a.img, 900, 500);
    document.querySelector('#sw9-mimg').alt = a.t;
    document.querySelector('#sw9-mcat').textContent = a.e + ' ' + a.cat;
    document.querySelector('#sw9-mtit').textContent = a.t;
    document.querySelector('#sw9-msom').textContent = a.s;
    document.querySelector('#sw9-mtxt').textContent = a.txt;
    var modal = document.querySelector('#sw9-modal');
    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function injectArticles() {
    if (document.querySelector('#sw9-articles')) return;
    var home = document.querySelector('#page-home .home-body');
    if (!home) return;

    // Nascondi vecchi sistemi notizie
    ['#sw8-articles', '#newsContainer', '.news-section-head'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    var off = getDayOffset();
    var arts = ARTICOLI_STATICI.slice(off).concat(ARTICOLI_STATICI.slice(0, off));
    var featured = arts[0];
    var secondary = arts.slice(1, 5);

    var now = new Date();
    var dateStr = now.toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' });

    var sec = document.createElement('div');
    sec.id = 'sw9-articles';
    sec.innerHTML =
      '<div style="padding:18px 14px 12px;border-top:1px solid rgba(212,175,55,.1);display:flex;align-items:center;justify-content:space-between;">' +
        '<div>' +
          '<div style="font-size:8px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.45);text-transform:uppercase;margin-bottom:3px;">🗞 GAZZETTA DEL TERROIR</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.05rem;color:#F5EFE2;">Le Storie di Oggi</div>' +
        '</div>' +
        '<div style="font-size:10px;color:rgba(212,175,55,.38);letter-spacing:.5px;">' + dateStr + '</div>' +
      '</div>';

    // Hero article
    var heroEl = document.createElement('div');
    heroEl.className = 'sw9-ah';
    heroEl.innerHTML =
      '<img src="' + px(featured.img, 900, 500) + '" alt="' + featured.t + '" loading="lazy">' +
      '<div class="sw9-aho">' +
        '<div class="sw9-ac">' + featured.e + ' ' + featured.cat + '</div>' +
        '<div class="sw9-at">' + featured.t + '</div>' +
        '<div class="sw9-as">' + featured.s + '</div>' +
      '</div>';
    heroEl.addEventListener('click', function() { openArt(featured); });
    sec.appendChild(heroEl);

    // Grid 4 articoli
    var grid = document.createElement('div');
    grid.className = 'sw9-ag';
    secondary.forEach(function(art) {
      var el = document.createElement('div');
      el.className = 'sw9-as2';
      el.innerHTML =
        '<img src="' + px(art.img, 400, 250) + '" alt="' + art.t + '" loading="lazy">' +
        '<div class="sw9-as2b">' +
          '<div class="sw9-as2c">' + art.e + ' ' + art.cat + '</div>' +
          '<div class="sw9-as2t">' + art.t + '</div>' +
        '</div>';
      el.addEventListener('click', function() { openArt(art); });
      grid.appendChild(el);
    });
    sec.appendChild(grid);

    // Inserisci dopo quick grid
    var quick = home.querySelector('#sw9-quick, #sw7-quick');
    if (quick && quick.nextSibling) {
      home.insertBefore(sec, quick.nextSibling);
    } else {
      home.appendChild(sec);
    }
    console.log('[SW-v9] Articoli ok');
  }

  /* ═══════════════════════════════════════════════
     DENOMINAZIONI — tutte le regioni
  ═══════════════════════════════════════════════ */
  function injectDen() {
    var page = document.querySelector('#page-explore');
    if (!page || document.querySelector('#sw9-den')) return;

    // Rimuovi vecchie sezioni
    ['#sw7-italia','#sw8-den'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.remove();
    });

    var section = document.createElement('div');
    section.id = 'sw9-den';

    // Hero
    section.innerHTML =
      '<div style="position:relative;height:150px;overflow:hidden;">' +
        '<img src="' + px(PX.vigne, 900, 400) + '" style="width:100%;height:100%;object-fit:cover;filter:brightness(.48) saturate(1.2);" loading="lazy" alt="Vigne Italia">' +
        '<div style="position:absolute;inset:0;background:linear-gradient(rgba(74,4,4,.25),rgba(10,7,5,.85));display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:18px;">' +
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.7);text-transform:uppercase;margin-bottom:5px;">🇮🇹 ENCICLOPEDIA ITALIANA</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.35rem;font-weight:700;color:#fff;">Le Denominazioni d\'Italia</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.5);margin-top:4px;">DOCG e DOC per ogni regione</div>' +
        '</div>' +
      '</div>';

    // Nav regioni
    var nav = document.createElement('div');
    nav.id = 'sw9-den-nav';

    var allBtn = document.createElement('div');
    allBtn.className = 'sw9-rbtn sw9-ra';
    allBtn.textContent = '🌍 Tutte';
    allBtn.dataset.r = 'all';
    nav.appendChild(allBtn);

    Object.keys(WINE_DATABASE).forEach(function(name) {
      var btn = document.createElement('div');
      btn.className = 'sw9-rbtn';
      btn.textContent = WINE_DATABASE[name].flag + ' ' + name;
      btn.dataset.r = name;
      nav.appendChild(btn);
    });
    section.appendChild(nav);

    var list = document.createElement('div');
    list.id = 'sw9-den-list';
    section.appendChild(list);

    var header = page.querySelector('div:first-child');
    if (header && header.nextSibling) {
      page.insertBefore(section, header.nextSibling);
    } else {
      page.appendChild(section);
    }

    renderDen9('all');

    nav.querySelectorAll('.sw9-rbtn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        nav.querySelectorAll('.sw9-rbtn').forEach(function(b) { b.classList.remove('sw9-ra'); });
        btn.classList.add('sw9-ra');
        renderDen9(btn.dataset.r);
        list.scrollIntoView({ behavior:'smooth', block:'start' });
      });
    });
    console.log('[SW-v9] Denominazioni ok');
  }

  function renderDen9(filter) {
    var list = document.querySelector('#sw9-den-list');
    if (!list) return;
    list.innerHTML = '';

    var keys = filter === 'all'
      ? Object.keys(WINE_DATABASE)
      : Object.keys(WINE_DATABASE).filter(function(k) { return k === filter; });

    keys.forEach(function(rname) {
      var r = WINE_DATABASE[rname];

      // Header regione
      var rh = document.createElement('div');
      rh.style.cssText = 'padding:16px 14px 6px;display:flex;align-items:center;gap:10px;border-top:1px solid rgba(212,175,55,.1);';
      rh.innerHTML =
        '<div style="width:34px;height:34px;border-radius:50%;background:rgba(74,4,4,.35);border:1px solid rgba(212,175,55,.22);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;">' + r.flag + '</div>' +
        '<div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1rem;font-weight:700;color:#F5EFE2;">' + rname + '</div>' +
          '<div style="font-size:9px;color:rgba(212,175,55,.45);letter-spacing:1px;margin-top:1px;">' +
            (r.docg.length > 0 ? r.docg.length + ' DOCG · ' : '') + r.doc.length + ' DOC' +
          '</div>' +
        '</div>';
      list.appendChild(rh);

      // Intro
      if (r.note) {
        var ri = document.createElement('div');
        ri.style.cssText = 'padding:3px 14px 12px;font-family:\'Playfair Display\',Georgia,serif;font-style:italic;font-size:.82rem;color:rgba(245,239,226,.45);line-height:1.6;';
        ri.textContent = r.note;
        list.appendChild(ri);
      }

      // Focus card (scheda approfondita)
      if (r.focus) {
        var fc = document.createElement('div');
        fc.style.cssText = 'margin:0 12px 8px;border-radius:8px;overflow:hidden;border:1px solid rgba(212,175,55,.22);cursor:pointer;transition:all .25s;';
        fc.onmouseenter = function() { fc.style.borderColor = 'rgba(212,175,55,.5)'; fc.style.transform = 'translateY(-1px)'; };
        fc.onmouseleave = function() { fc.style.borderColor = 'rgba(212,175,55,.22)'; fc.style.transform = 'translateY(0)'; };

        fc.innerHTML =
          '<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:linear-gradient(135deg,rgba(74,4,4,.2),transparent);">' +
            '<span style="font-size:9px;font-weight:700;letter-spacing:1.5px;padding:3px 7px;border-radius:4px;text-transform:uppercase;flex-shrink:0;background:rgba(212,175,55,.15);color:#D4AF37;border:1px solid rgba(212,175,55,.3);">FOCUS</span>' +
            '<span style="font-family:\'Playfair Display\',Georgia,serif;font-size:.92rem;font-weight:700;color:#F5EFE2;flex:1;">' + r.focus.nome + '</span>' +
            '<span style="font-size:16px;">⭐</span>' +
          '</div>' +
          '<div class="sw9-focus-body" style="display:none;padding:0 14px 14px;">' +
            '<div style="font-size:13px;color:rgba(245,239,226,.72);line-height:1.75;margin-bottom:10px;">' + r.focus.storia + '</div>' +
            '<div style="border-top:1px solid rgba(212,175,55,.1);padding-top:8px;margin-bottom:8px;">' +
              '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:5px;">🌍 Terroir</div>' +
              '<div style="font-size:12px;color:rgba(245,239,226,.55);line-height:1.65;font-style:italic;">' + r.focus.terroir + '</div>' +
            '</div>' +
            '<div style="border-top:1px solid rgba(212,175,55,.1);padding-top:8px;margin-bottom:8px;">' +
              '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:5px;">🎨 Profilo</div>' +
              '<div style="font-size:12px;color:rgba(245,239,226,.55);line-height:1.65;font-style:italic;">' + r.focus.profilo + '</div>' +
            '</div>' +
            '<div style="border-top:1px solid rgba(212,175,55,.1);padding-top:8px;">' +
              '<div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.55);margin-bottom:5px;">📌 Note</div>' +
              '<div style="font-size:12px;color:rgba(245,239,226,.55);line-height:1.65;font-style:italic;">' + r.focus.note + '</div>' +
            '</div>' +
          '</div>';

        var header9 = fc.querySelector('div:first-child');
        var body9 = fc.querySelector('.sw9-focus-body');
        header9.addEventListener('click', function() {
          var open = body9.style.display !== 'none';
          body9.style.display = open ? 'none' : 'block';
          if (!open) body9.style.animation = 'sw9fi .25s ease';
        });
        list.appendChild(fc);
      }

      // Lista DOCG
      if (r.docg.length > 0) {
        var docgHead = document.createElement('div');
        docgHead.style.cssText = 'padding:8px 14px 4px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.55);';
        docgHead.textContent = 'DOCG';
        list.appendChild(docgHead);

        r.docg.forEach(function(den) {
          var row = document.createElement('div');
          row.style.cssText = 'padding:7px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(212,175,55,.06);';
          row.innerHTML =
            '<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;background:rgba(212,175,55,.12);color:#D4AF37;border:1px solid rgba(212,175,55,.25);flex-shrink:0;letter-spacing:1px;">DOCG</span>' +
            '<span style="font-size:13px;color:#F5EFE2;">👑 ' + den + '</span>';
          list.appendChild(row);
        });
      }

      // Lista DOC
      if (r.doc.length > 0) {
        var docHead = document.createElement('div');
        docHead.style.cssText = 'padding:8px 14px 4px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(205,127,50,.55);';
        docHead.textContent = 'DOC';
        list.appendChild(docHead);

        r.doc.forEach(function(den) {
          var row = document.createElement('div');
          row.style.cssText = 'padding:6px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(212,175,55,.05);';
          row.innerHTML =
            '<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;background:rgba(205,127,50,.1);color:#CD7F32;border:1px solid rgba(205,127,50,.22);flex-shrink:0;letter-spacing:1px;">DOC</span>' +
            '<span style="font-size:13px;color:rgba(245,239,226,.8);">🍷 ' + den + '</span>';
          list.appendChild(row);
        });
      }

      // Spaziatura
      var spacer = document.createElement('div');
      spacer.style.height = '12px';
      list.appendChild(spacer);
    });
  }

  /* ═══════════════════════════════════════════════
     LOGO → HOME
  ═══════════════════════════════════════════════ */
  function fixLogo() {
    var logo = document.querySelector('#navLogo, .nav-logo');
    if (!logo || logo.dataset.sw9) return;
    logo.dataset.sw9 = '1';
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function() {
      ['#sw-wiz','#sw-fp','#sw9-modal','#sw8-modal'].forEach(function(s) {
        var el = document.querySelector(s);
        if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
      });
      var tab = document.querySelector('.ntab[data-page="home"]');
      if (tab) tab.click();
      else {
        document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
        var h = document.querySelector('#page-home');
        if (h) h.classList.add('active');
      }
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v9] Patch v9 Definitivo — avvio');
    css9();
    buildModal9();

    var n = 0;
    function run() {
      injectQuick();
      injectArticles();
      injectDen();
      fixLogo();
      if (++n < 20) setTimeout(run, 350);
      else console.log('[SW-v9] Init completato ok');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  init();

})();
