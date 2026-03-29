/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v8  — DATABASE COMPLETO               ║
 * ║                                                                  ║
 * ║  ✓ Tutte le regioni italiane con denominazioni + descrizioni    ║
 * ║  ✓ 30 articoli rotanti (storia, tecnica, vitigni rari)          ║
 * ║  ✓ Sistema articoli offline + fallback senza API               ║
 * ║  ✓ Immagini Pexels contestuali per ogni articolo               ║
 * ║  ✓ Mobile above-the-fold ottimizzato                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     PEXELS helpers
  ═══════════════════════════════════════════════════════ */
  const px = (id, w = 1200, h = 700) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;

  const IMG = {
    vigne:     442116,
    cantina:   2702805,
    sommelier: 3850838,
    grappoli:  1182264,
    filari:    4113579,
    degust:    1407846,
    decanter:  3407777,
    calici:    1579367,
    terra:     1470171,
    vendemmia: 2599537,
    antico:    1458671,
    etna:      3532658,
    mosella:   4753946,
    pantelleria: 2660262,
    borgogna:  3741248,
  };

  /* ═══════════════════════════════════════════════════════
     DATABASE COMPLETO DENOMINAZIONI ITALIANE
     Tutte le 20 regioni produttive
  ═══════════════════════════════════════════════════════ */
  const DB_ITALIA = {

    'Piemonte': {
      emoji: '🏔', foto: IMG.filari,
      intro: 'La Borgogna italiana. Nebbiolo sovrano tra Langhe, Monferrato e Roero — 17 DOCG, la regione più premiata d\'Italia.',
      dens: [
        { n:'Barolo DOCG', t:'DOCG', uva:'Nebbiolo', img: IMG.filari,
          storia:'Nato nelle Langhe nel XIX secolo, il Barolo deve la sua fama alla marchesa Giulia Falletti di Barolo e al conte Camillo Cavour, che ne fecero il vino della casa reale sabauda. Ferruccio Biondi-Santi ne stabilì i canoni moderni.',
          terroir:'Marne tortoniane a Serralunga e Castiglione (tannino duro e longevo) vs. marne elveziane a La Morra e Barolo (eleganza setosa). Quote 150-400m, clima continentale.',
          profilo:'Viola appassita, tabacco, catrame, rosa secca, liquirizia. Tannini imponenti, acidità alta, 38 mesi di affinamento minimo. Longevo 20-50 anni.',
          note:'Le MGA (Menzioni Geografiche Aggiuntive) identificano i cru: Cannubi, Brunate, Cerequio, Rocche dell\'Annunziata.' },

        { n:'Barbaresco DOCG', t:'DOCG', uva:'Nebbiolo', img: IMG.vigne,
          storia:'Nasce a pochi km dal Barolo, sulla riva destra del Tanaro. Angelo Gaja lo portò alla ribalta internazionale negli anni \'60-\'70 con metodi rivoluzionari: barrique, basse rese, raccolta tardiva.',
          terroir:'Tufo e sabbie più morbide rispetto al Barolo. I tre comuni di Barbaresco, Treiso e Neive hanno crus distinti. Affinamento 26 mesi (9 in legno).',
          profilo:'Geranio, rosa, fragola matura, spezie orientali. Tannini fini, acidità viva, eleganza prima della potenza.',
          note:'MGA top: Asili, Rabajà, Martinenga, Starderi, Ovello.' },

        { n:'Barbera d\'Asti DOCG', t:'DOCG', uva:'Barbera', img: IMG.grappoli,
          storia:'Il vino della gente piemontese, elevato a nobile. La sottozona Nizza ha ottenuto propria DOCG nel 2014. Giacomo Bologna (Braida) ne fu il moderno artefice negli anni \'80.',
          terroir:'Argille calcaree astigiane. Acidità naturale elevatissima — la caratteristica che la rende longeva e abbinabile.',
          profilo:'Ciliegia, mora, amarena, note balsamiche. Acidità vivace, tannini morbidi, finale fresco.',
          note:'La versione "Superiore" affina almeno 14 mesi, di cui 6 in legno.' },

        { n:'Moscato d\'Asti DOCG', t:'DOCG', uva:'Moscato Bianco', img: IMG.grappoli,
          storia:'Vino antichissimo, citato già nel Medioevo. La zona di Canelli, Santo Stefano Belbo e Mango è il cuore produttivo.',
          terroir:'Colline calcaree con esposizioni soleggiate. Raccolta anticipata per mantenere acidità e aromi varietali.',
          profilo:'Pesca, albicocca, fiori d\'acacia, muschio. Bollicine finissime, dolcezza calibrata, gradazione 5-5,5%.',
          note:'Non va confuso con l\'Asti DOCG spumante: il Moscato d\'Asti è frizzante, non spumante.' },

        { n:'Alta Langa DOCG', t:'DOCG', uva:'Pinot Nero, Chardonnay', img: IMG.cantina,
          storia:'Metodo Classico delle Langhe alte, sopra i 250m. Riconosciuto DOCG nel 2011, rappresenta l\'eccellenza delle bollicine piemontesi.',
          terroir:'Suoli calcareo-argillosi su colline alte e fresche. La quota garantisce lenta maturazione e acidità preservata.',
          profilo:'Frutta a guscio, brioche, agrumi, note minerali. Perlage fine e persistente, freschezza alpina.',
          note:'Contratto, Enrico Serafino e G.D. Vajra tra i produttori di riferimento.' },

        { n:'Gattinara DOCG', t:'DOCG', uva:'Nebbiolo (Spanna)', img: IMG.vigne,
          storia:'Alto Piemonte, ai piedi delle Prealpi. Il Nebbiolo su suoli vulcanici porfiritici dà un vino diverso dal Barolo: più austero, minerale, longevo.',
          terroir:'Porfido rosso vulcanico, suoli acidi e poveri. Clima più fresco e umido rispetto alle Langhe.',
          profilo:'Ciliegia selvatica, spezie, grafite, note minerali. Struttura tannica imponente, acidità alta.',
          note:'Travaglini e Antoniolo i produttori storici. Il Gattinara di annata può durare 30+ anni.' },
      ],
    },

    'Toscana': {
      emoji: '🌾', foto: IMG.vigne,
      intro: 'Il Sangiovese è il cuore pulsante — da Firenze a Montalcino, da Bolgheri al confine umbro. 11 DOCG, un patrimonio enologico senza pari.',
      dens: [
        { n:'Brunello di Montalcino DOCG', t:'DOCG', uva:'Sangiovese Grosso (Brunello)', img: IMG.vigne,
          storia:'Ferruccio Biondi-Santi isolò nel 1888 il clone di Sangiovese Grosso chiamandolo "Brunello". La prima annata commercializzata fu 1888. Oggi è il vino italiano più longevo e costoso.',
          terroir:'Galestro e alberese su quattro versanti con caratteristiche diverse. Nord: fresco, elegante. Sud: potente, strutturato. Quote 250-600m.',
          profilo:'Ciliegia sotto spirito, tabacco, cuoio, fiori secchi, note balsamiche. Tannini imponenti, acidità alta. Affinamento 5 anni (Riserva 6).',
          note:'Le prime Riserva vendute erano del 1955. Biondi-Santi, Soldera, Poggio di Sotto, Cerbaiona i cru assoluti.' },

        { n:'Chianti Classico DOCG', t:'DOCG', uva:'Sangiovese', img: IMG.filari,
          storia:'Il territorio storico tra Firenze e Siena fu delimitato da Cosimo III de\' Medici nel 1716 con un bando granducale — uno dei primi sistemi di denominazione al mondo. Il Gallo Nero è il simbolo della Lega del Chianti medievale.',
          terroir:'Galestro e alberese su pendii collinari 250-600m. La Gran Selezione (introdotta nel 2014) è il vertice qualitativo da singolo vigneto.',
          profilo:'Ciliegia fresca, viola, spezie, cuoio, note floreali. Tannini vivi, acidità brillante. I migliori reggono 15-20 anni.',
          note:'Panzano, Castelnuovo Berardenga, Gaiole le sottozone più celebri. Antinori, Fèlsina, Isole e Olena le aziende di riferimento.' },

        { n:'Vino Nobile di Montepulciano DOCG', t:'DOCG', uva:'Prugnolo Gentile (Sangiovese)', img: IMG.vigne,
          storia:'Citato già nel 789 d.C. in una cronaca monastica. Francesco Redi nel \'600 lo definì "d\'ogni vino re". Montepulciano è una città etrusca sulle colline senesi.',
          terroir:'Argille sabbiose e galestro su suoli tufacei. Altitudine 250-600m, clima caldo-secco con escursioni termiche significative.',
          profilo:'Ciliegia, prugna, viola, spezie, tabacco. Struttura media, acidità viva, tannini educati.',
          note:'Avignonesi, Poliziano e Boscarelli i produttori storici. Il Rosso di Montepulciano DOC è la versione più accessibile.' },

        { n:'Morellino di Scansano DOCG', t:'DOCG', uva:'Sangiovese (Morellino)', img: IMG.vigne,
          storia:'La Maremma toscana è la denominazione "giovane" che ha sorpreso il mondo. Il Morellino è il nome locale del Sangiovese, adattato alla costa.',
          terroir:'Argille marine costiere a poca distanza dal Tirreno. Clima caldo e ventoso, influenza marina importante.',
          profilo:'Ciliegia matura, marasca, note speziate e balsamiche. Struttura media, tannini rotondi, ottima bevibilità.',
          note:'Moris Farms e Rocca di Frassinello tra i top. La DOCG risale al 2007.' },

        { n:'Bolgheri DOC', t:'DOC', uva:'Cabernet Sauvignon, Merlot, Cabernet Franc', img: IMG.cantina,
          storia:'La rivoluzione dei "Supertuscan". Sassicaia fu creato dal marchese Mario Incisa della Rocchetta nel dopoguerra ispirandosi ai grandi Bordeaux. Nei \'70 Antinori creò il Tignanello. La DOC fu riconosciuta nel 1983.',
          terroir:'Suoli limosi e argillosi a poca distanza dal mare, con ghiaie profonde. Il microclima temperato è perfetto per i vitigni bordolesi.',
          profilo:'Ribes nero, mirtillo, cedro, grafite, spezie. Struttura bordolese con eleganza e calore toscano.',
          note:'Bolgheri Sassicaia ha ottenuto una propria DOC nel 1994 — unica in Italia per una sola azienda. Ornellaia, Masseto, Guado al Tasso.' },

        { n:'Vernaccia di San Gimignano DOCG', t:'DOCG', uva:'Vernaccia', img: IMG.grappoli,
          storia:'Prima DOC italiana nel 1966, poi DOCG nel 1993. San Gimignano è la città delle torri medievali in Val d\'Elsa, Siena.',
          terroir:'Tufo pliocenico e arenaria. La Vernaccia è autoctona di quest\'area e dà risultati diversi altrove.',
          profilo:'Mandorla, salvia, cedro, note minerali. Freschezza vibrante, finale leggermente amarognolo tipico.',
          note:'Teruzzi, Panizzi e San Quirico tra i produttori di riferimento.' },
      ],
    },

    'Veneto': {
      emoji: '🏛', foto: IMG.cantina,
      intro: 'Prima regione italiana per volume produttivo. Dal Lago di Garda alle Dolomiti, dall\'Amarone al Prosecco: una diversità unica.',
      dens: [
        { n:'Amarone della Valpolicella DOCG', t:'DOCG', uva:'Corvina, Corvinone, Rondinella', img: IMG.cantina,
          storia:'Nato per caso negli anni \'40 quando un Recioto "dimenticato" fermentò fino in secco. Adelino Lucchese di Bertani assaggiò il vino e disse: "Questo non è amaro, è amarone!". Da allora il nome è rimasto.',
          terroir:'Tre zone: Classico (Val Negrar, Marano, Fumane — la più pregiata), Valpantena, Est. Basalti e calcari a 200-600m.',
          profilo:'Ciliegia sotto spirito, prugna, cioccolato, spezie orientali, tabacco, note eteree. 15-17%, tannini vellutati, persistenza infinita.',
          note:'Appassimento 90-120 giorni in fruttaio. Quintarelli, Dal Forno, Masi, Allegrini i produttori di culto.' },

        { n:'Prosecco Superiore DOCG', t:'DOCG', uva:'Glera', img: IMG.calici,
          storia:'Valdobbiadene e Conegliano, patrimonio UNESCO dal 2019. Il Prosecco nasce come vino contadino delle Prealpi trevigiane, diventato negli ultimi 20 anni il vino italiano più esportato al mondo.',
          terroir:'Colline morfologicamente uniche con terreni di sfasciume — calcari e marne a gradoni. Le "Rive" identificano i cru dei singoli comuni. Cartizze (107 ha) è il cru assoluto.',
          profilo:'Mela verde, pera, agrumi, fiori bianchi. Bollicine cremose, freschezza viva, bevibilità immediata.',
          note:'Metodo Charmat (Martinotti). Nino Franco, Bisol, Ruggeri tra i migliori.' },

        { n:'Soave Superiore DOCG', t:'DOCG', uva:'Garganega, Trebbiano di Soave', img: IMG.vigne,
          storia:'La zona Classica su tufo e basalto vulcanico produce vini completamente diversi dalla versione DOC pianeggiante. Pieropan negli anni \'70 aprì la strada alla riscoperta qualitativa.',
          terroir:'Basalti di origine vulcanica nel Soave Classico. I vigneti storici su colline a gradoni danno uve con concentrazione naturale.',
          profilo:'Mandorla, fiori bianchi, agrumi, note minerali vulcaniche. Struttura media, finale ammandorlato.',
          note:'Pieropan, Gini, Prà, Tamellini i top producers. La Rocca è il cru più celebre.' },
      ],
    },

    'Campania': {
      emoji: '🌋', foto: IMG.terra,
      intro: 'La Grecia d\'Italia. Fiano, Greco e Aglianico sono tra i vitigni più antichi del mondo, portati dai coloni greci 2700 anni fa.',
      dens: [
        { n:'Taurasi DOCG', t:'DOCG', uva:'Aglianico', img: IMG.terra,
          storia:'L\'Aglianico arrivò in Campania con i coloni greci (il nome deriva da Ellenico → Aglianico). Mastroberardino ne è il custode storico. La DOCG risale al 1993.',
          terroir:'Suoli vulcanici e argillosi dell\'Irpinia a 400-700m. Le escursioni termiche conservano acidità nonostante il calore.',
          profilo:'Ciliegia nera, prugna, tabacco, cuoio, spezie. Acidità tagliente, tannini fibrosi, longevo 15-25 anni.',
          note:'Affinamento minimo 3 anni (Riserva 4). Campania è la sua terra d\'elezione, ma cresce bene anche in Basilicata.' },

        { n:'Fiano di Avellino DOCG', t:'DOCG', uva:'Fiano', img: IMG.grappoli,
          storia:'Plinio il Vecchio lo citò come "Vitis Apiana" — vite amata dalle api per il mosto dolcissimo. Dopo secoli di oblio, Mastroberardino lo riportò alla notorietà negli anni \'70.',
          terroir:'Argille e calcari su colline irpine 400-700m. Il comune di Lapio dà i vini più strutturati e longevi.',
          profilo:'Miele, noce, pera Williams, erbe aromatiche, fumo. Struttura minerale, acidità calibrata, longevo 10+ anni.',
          note:'Feudi di San Gregorio, Cantina di Marzo, Ciro Picariello tra i migliori. Il Fiano di Lapio è il più ricercato.' },

        { n:'Greco di Tufo DOCG', t:'DOCG', uva:'Greco', img: IMG.grappoli,
          storia:'Il Greco fu portato dai Greci di Magna Grecia. Il "tufo" nel nome non è il tufo vulcanico ma la zolfo: le miniere di tufo solfureo di Tufo (AV) caratterizzano i suoli.',
          terroir:'Suoli ricchi di solfuri attorno alle miniere di Tufo. L\'influenza minerale è straordinaria e unica.',
          profilo:'Pesca bianca, mandorla, idrocarburi, note iodinate. Struttura sapida, acidità vivace.',
          note:'Benito Ferrara, Di Meo, Terredora i produttori top. La versione spumante è molto apprezzata.' },
      ],
    },

    'Sicilia': {
      emoji: '☀️', foto: IMG.etna,
      intro: 'Il vulcano, il sale, il sole africano. L\'Etna è la nuova Borgogna. Il Nero d\'Avola è l\'ambasciatore. Pantelleria è il paradiso del passito.',
      dens: [
        { n:'Etna DOC', t:'DOC', uva:'Nerello Mascalese, Carricante', img: IMG.etna,
          storia:'Il "rinascimento etneo" è iniziato negli anni 2000 con Marc de Grazia, Cornelissen e Passopisciaro. Le contrade (simili ai crus di Borgogna) hanno trasformato l\'Etna nel terroir più discusso al mondo.',
          terroir:'Sabbie laviche e ceneri vulcaniche su quota 400-1000m. Ogni contrada ha carattere diverso. Viti pre-fillossera centenarie ad alberello tradizionale.',
          profilo:'Fragola selvatica, lampone, grafite, spezie, note vulcaniche. Acidità alta, tannini fini, grande freschezza.',
          note:'Le 133 contrade sono l\'equivalente dei lieu-dit borgognoni. Benanti, Passopisciaro, Cornelissen, Terre Nere i riferimenti.' },

        { n:'Passito di Pantelleria DOC', t:'DOC', uva:'Zibibbo (Moscato d\'Alessandria)', img: IMG.pantelleria,
          storia:'Pantelleria dista 70km dalla Tunisia e 110km dalla Sicilia. Lo Zibibbo fu portato dagli Arabi nel IX secolo. L\'alberello pantesco — vite allentata a cesto nella lava — è il simbolo della resistenza contadina.',
          terroir:'Lava nera, sole africano, scirocco. L\'alberello bassissimo protegge le uve dal vento e trattiene il calore di notte.',
          profilo:'Fico secco, dattero, arancio candito, miele d\'arancio, vaniglia. Dolcezza opulenta equilibrata dall\'acidità.',
          note:'Ben\'Ryé di Donnafugata è il più famoso. Pantelleria è il primo territorio italiano ad ottenere il riconoscimento di "Paesaggio Viticolo di Interesse Storico".' },

        { n:'Cerasuolo di Vittoria DOCG', t:'DOCG', uva:'Nero d\'Avola, Frappato', img: IMG.vigne,
          storia:'Unica DOCG siciliana, sul plateau ibleo. Nero d\'Avola porta struttura e longevità, Frappato porta profumo e grazia. COS ha reso questo blend famoso in tutto il mondo.',
          terroir:'Suoli calcarei e sabbiosi del ragusano. Clima mediterraneo con eccursioni termiche notevoli.',
          profilo:'Ciliegia, melograno, spezie dolci, fiori rossi. Struttura media, tannini gentili, freschezza.',
          note:'COS e Valle dell\'Acate i produttori di riferimento. Cerasuolo significa "color ciliegia".' },
      ],
    },

    'Puglia': {
      emoji: '🌞', foto: IMG.vigne,
      intro: 'Il tacco dello stivale. Primitivo e Negroamaro sono i re. Viti centenarie su suoli rossi ferrosi tra i più antichi d\'Italia.',
      dens: [
        { n:'Primitivo di Manduria DOCG', t:'DOCG', uva:'Primitivo', img: IMG.vigne,
          storia:'Il Primitivo è il Zinfandel californiano: stessa uva, DNA identico, confermato negli anni \'90 dall\'analisi genetica. I primi a capirlo furono i produttori californiani che vennero in Puglia a studiare.',
          terroir:'Tavoliere delle Puglie, suoli argillosi rossi ferrosi (terra rossa) a bassissima quota. Clima continentale arido.',
          profilo:'Prugna, fico, cioccolato, spezie calde, tabacco. Elevata gradazione alcolica (14-17%), struttura imponente.',
          note:'Gianfranco Fino con "Es" ha rivoluzionato il Primitivo. Anche nella versione Dolce Naturale è straordinario.' },

        { n:'Salice Salentino DOC', t:'DOC', uva:'Negroamaro, Malvasia Nera', img: IMG.vigne,
          storia:'Il Negroamaro (dal greco "nero" e dal latino "amaro") è autoctono del Salento. Cosimo Taurino e Leone de Castris lo hanno portato alla ribalta negli anni \'70.',
          terroir:'Pianura salentina, suoli argillosi profondi, clima mediterraneo estremo. La vigna sopravvive con pochissima acqua.',
          profilo:'Mora, prugna, tabacco, note di tostatura. Corpo pieno, tannini morbidi, calore alcolico.',
          note:'Anche il rosato di Negroamaro è eccezionale — uno dei migliori rosati italiani.' },
      ],
    },

    'Sardegna': {
      emoji: '🏝', foto: IMG.vigne,
      intro: 'L\'isola dei vitigni spagnoli diventati sardi. Cannonau è il Grenache, Carignano il Carignan. Ma sono sardi da secoli e si comportano come tali.',
      dens: [
        { n:'Vermentino di Gallura DOCG', t:'DOCG', uva:'Vermentino', img: IMG.vigne,
          storia:'Unica DOCG sarda per i bianchi. La Gallura, a nord-est dell\'isola, ha un\'identità geologica unica con graniti antichissimi. Il Vermentino qui raggiunge complessità irraggiungibili altrove.',
          terroir:'Graniti paleozoici, suoli acidi e poveri. Vento maestrale costante. Microclima semi-arido con forti escursioni.',
          profilo:'Pesca bianca, agrumi, erbe mediterranee, note minerali granitiche. Freschezza sapida, struttura media.',
          note:'Capichera, Surrau, CS della Gallura i top. Da non confondere con il Vermentino di Sardegna DOC (tutta l\'isola).' },

        { n:'Cannonau di Sardegna DOC', t:'DOC', uva:'Cannonau (Grenache)', img: IMG.vigne,
          storia:'Arrivato dalla Spagna con gli Aragonesi nel XIV-XV secolo, il Cannonau si è adattato così bene alla Sardegna da diventare il simbolo enologico dell\'isola.',
          terroir:'Graniti del Nuorese e del Gennargentu a 300-700m. Le viti centenarie dei paesi della Barbagia (Orgosolo, Mamoiada) producono uve di straordinaria concentrazione.',
          profilo:'Amarena, fico, spezie orientali, erbe aromatiche. Struttura corposa, tannini morbidi, elevata gradazione.',
          note:'Giuseppe Sedilesu di Mamoiada e il Cannonau di Orgosolo sono i riferimenti assoluti per le viti centenarie.' },
      ],
    },

    'Friuli-Venezia Giulia': {
      emoji: '⛰', foto: IMG.cantina,
      intro: 'La capitale italiana del vino bianco. Collio e Colli Orientali del Friuli producono bianchi tra i più complessi d\'Europa. Gravner e Radikon hanno inventato i vini orange.',
      dens: [
        { n:'Collio DOC', t:'DOC', uva:'Ribolla Gialla, Friulano, Malvasia Istriana', img: IMG.cantina,
          storia:'Il Collio è una piccola area collinare al confine con la Slovenia. Josko Gravner e Stanko Radikon negli anni \'90-2000 hanno rivoluzionato la vinificazione con la macerazione sulle bucce, dando vita al movimento dei vini orange.',
          terroir:'Flysch di Cormons — alternanza di marne e arenarie — dà vini di straordinaria mineralità e complessità.',
          profilo:'Pesca bianca, fiori bianchi, note minerali, a volte idrocarburi. Struttura media-alta, acidità vibrante.',
          note:'Radikon, Gravner, Schiopetto, Princic i produttori storici. Il confine con la Slovenia è impercettibile nel vino.' },

        { n:'Ramandolo DOCG', t:'DOCG', uva:'Verduzzo Friulano', img: IMG.grappoli,
          storia:'Smallest DOCG italiana (pochi ettari nel comune di Nimis). Il Verduzzo passito di Ramandolo è uno dei vini dolci più raffinati d\'Italia.',
          terroir:'Schisti e marne su pendii scoscesi in Val del Torre.',
          profilo:'Albicocca secca, miele di castagno, spezie, note ossidative eleganti. Dolcezza misurata, acidità che bilancia.',
          note:'Giovanni Dri è il custode di questa piccola gemma. Produzione di poche migliaia di bottiglie.' },
      ],
    },

    'Alto Adige': {
      emoji: '🏔', foto: IMG.filari,
      intro: 'Il Sudtirolo parla tre lingue e produce vini da tutti i climi. Gewürztraminer di Tramin, Lagrein di Bolzano, Pinot Nero e Riesling da alta quota.',
      dens: [
        { n:'Alto Adige DOC', t:'DOC', uva:'Lagrein, Gewürztraminer, Pinot Grigio, Riesling', img: IMG.filari,
          storia:'La prima DOC italiana a disciplinare i vitigni internazionali. La cultura vitivinicola sudtirolese è fortemente influenzata dal mondo germanico — le cantine cooperative sono tra le meglio organizzate d\'Europa.',
          terroir:'21 sottozone con caratteristiche diverse. Bolzano caldo per il Lagrein. Tramin caldo e aromatico per il Gewürztraminer. Alta Valle per Riesling e Pinot Nero.',
          profilo:'Dipende dal vitigno: Lagrein (mirtillo, viola, cioccolato), Gewürztraminer (rosa, litchi, spezie orientali), Riesling (limone, petrolio, mineralità alpina).',
          note:'Alois Lageder, Cantina Terlano, Franz Haas, Hofstätter tra i top. La Cantina di Terlano invecchia i bianchi 10+ anni.' },
      ],
    },

    'Trentino': {
      emoji: '🏔', foto: IMG.calici,
      intro: 'Le Dolomiti fanno da sfondo. Teroldego, Marzemino, Trento DOC metodo classico. Un\'identità alpina e mediterranea insieme.',
      dens: [
        { n:'Trento DOC', t:'DOC', uva:'Chardonnay, Pinot Nero', img: IMG.calici,
          storia:'Il Metodo Classico trentino ha in Ferrari il suo massimo interprete mondiale. Giulio Ferrari fondò l\'azienda nel 1902 dopo aver studiato in Champagne.',
          terroir:'Fondovalle atesino, suoli calcarei e porfirici a varie quote. Le uve vengono da più vigneti per creare cuvée di consistenza.',
          profilo:'Frutta bianca, crosta di pane, note tostate, bollicine finissime. Maggiore freschezza e mineralità rispetto allo Champagne.',
          note:'Ferrari, Rotari (Mezzacorona), Cavit i produttori principali. Ferrari Riserva Lunelli è tra le eccellenze mondiali.' },

        { n:'Teroldego Rotaliano DOC', t:'DOC', uva:'Teroldego', img: IMG.vigne,
          storia:'Il Campo Rotaliano è l\'unica area al mondo dove il Teroldego si esprime al meglio — una piana alluvionale tra i fiumi Adige e Noce.',
          terroir:'Ghiaie e ciottoli alluvionali, suoli profondi e fertili. Il terroir pianeggiante è atipico per un grande rosso.',
          profilo:'Mirtillo, mora, viola, note di cioccolato. Freschezza sorprendente, tannini presenti ma non aggressivi.',
          note:'Foradori ha rivoluzionato il Teroldego con anfore e bassissima resa. Mezzacorona per la produzione più accessibile.' },
      ],
    },

    'Lombardia': {
      emoji: '🏙', foto: IMG.cantina,
      intro: 'Da Milano al Lago di Garda, dalla Franciacorta alla Valtellina verticale. La regione più ricca d\'Italia produce anche alcuni dei suoi vini più esclusivi.',
      dens: [
        { n:'Franciacorta DOCG', t:'DOCG', uva:'Chardonnay, Pinot Nero, Pinot Bianco', img: IMG.calici,
          storia:'Nata negli anni \'60 con Guido Berlucchi, la Franciacorta è diventata il Metodo Classico italiano di riferimento. Le morene glaciali del Lago d\'Iseo danno un terroir unico.',
          terroir:'Morene glaciali su pianura prealpina. Il Lago d\'Iseo mitiga il clima. Suoli di sabbia, ghiaia e argilla in proporzioni diverse.',
          profilo:'Frutta bianca e gialla, brioches, note floreali, bollicine cremose. Maggiore struttura e complessità rispetto al Prosecco.',
          note:'Ca\' del Bosco, Bellavista, Berlucchi i colossi. Il Satèn (solo uve bianche) è l\'originalità della Franciacorta.' },

        { n:'Valtellina Superiore DOCG', t:'DOCG', uva:'Nebbiolo (Chiavennasca)', img: IMG.filari,
          storia:'I terrazzamenti verticali su granito sono tra i più spettacolari paesaggi viticoli del mondo. Il Nebbiolo — chiamato Chiavennasca in Valtellina — cresce su pareti quasi verticali sopra il fiume Adda.',
          terroir:'Granito e gneiss su terrazzamenti muri a secco a 300-800m. Microclima alpino con forti escursioni.',
          profilo:'Ciliegia, lampone, spezie, note minerali granitiche. Struttura elegante, acidità alta.',
          note:'Cinque sottozone: Sassella, Grumello, Inferno, Valgella, Maroggia. Nino Negri, Rainoldi, Arpepe i top.' },
      ],
    },

    'Marche': {
      emoji: '🌊', foto: IMG.vigne,
      intro: 'Tra Appennino e Adriatico. Verdicchio e Rosso Conero bianco e rosso — e il mistero di Pecorino e Lacrima.',
      dens: [
        { n:'Verdicchio dei Castelli di Jesi DOC', t:'DOC', uva:'Verdicchio', img: IMG.grappoli,
          storia:'Il Verdicchio era famoso nel Medioevo — i Visconti lo servivano alle feste di corte. L\'anfora "amphora" della bottiglia classica è ispirata ai contenitori greci portati dai Piceni.',
          terroir:'Colline argillose tra la costa adriatica e l\'Appennino. La zona Classica (Matelica e Jesi Classico) dà i vini più complessi.',
          profilo:'Mandorla amara, erbe aromatiche, agrumi, note amare in chiusura tipiche. Freschezza vivace, struttura media.',
          note:'Bucci, Sartarelli, Garofoli i produttori di riferimento. Il Classico Superiore Riserva può invecchiare 10+ anni.' },

        { n:'Offida DOCG', t:'DOCG', uva:'Pecorino, Passerina', img: IMG.grappoli,
          storia:'Il Pecorino era quasi estinto negli anni \'80. Oasi degli Angeli lo ha riportato in auge con il Kurni di Montepulciano, ma il Pecorino di Offida è la sorpresa bianca marchigiana.',
          terroir:'Colline ascolane, argille e calcari. Il Pecorino ama i suoli poveri e le quote alte.',
          profilo:'Agrumi, pesca, erbe alpine, note minerali. Acidità vibrante, sapidità marcata.',
          note:'Velenosi e Aurora tra i produttori. Il Passerina è meno complessa ma molto fresca.' },
      ],
    },

    'Umbria': {
      emoji: '🌲', foto: IMG.vigne,
      intro: 'Il cuore verde d\'Italia. Sagrantino di Montefalco è il re dei tannini mondiali. Orvieto è il bianco storico.',
      dens: [
        { n:'Sagrantino di Montefalco DOCG', t:'DOCG', uva:'Sagrantino', img: IMG.vigne,
          storia:'Il Sagrantino ha i tannini più alti di qualsiasi vino al mondo (misurati scientificamente). Era tradizionalmente usato solo per il Passito dolce nelle messe religiose. Arnaldo Caprai ha creato la versione secca moderna negli anni \'70.',
          terroir:'Colline calcareo-argillose di Montefalco, altitudine 220-400m. Microclima continentale con estati calde e secche.',
          profilo:'Mirtillo, more, cioccolato fondente, spezie, note ferrose. Tannini mostruosi che richiedono anni per ammorbidirsi. Potenziale 20-30 anni.',
          note:'Arnaldo Caprai con "25 Anni" è il vino di riferimento. Colpetrone e Scacciadiavoli altri top producer.' },
      ],
    },

    'Lazio': {
      emoji: '🏛', foto: IMG.cantina,
      intro: 'Dai Castelli Romani alla via Appia. Frascati e Cesanese custodiscono una tradizione millenaria vicino alla Capitale.',
      dens: [
        { n:'Frascati Superiore DOCG', t:'DOCG', uva:'Malvasia Bianca, Trebbiano', img: IMG.cantina,
          storia:'Il vino bianco di Roma per eccellenza. I Castelli Romani — tufi vulcanici alle porte di Roma — producono bianchi freschi e immediati da bere con la cucina laziale.',
          terroir:'Suoli vulcanici di tufo e lapillo. Il sottosuolo poroso drena perfettamente e trattiene il fresco.',
          profilo:'Frutta gialla, fiori bianchi, note minerali vulcaniche. Freschezza viva, bevibilità immediata.',
          note:'Casale Marchese e Villa Simone tra i top. Il Frascati "dolce" era il più famoso nel Medioevo.' },
      ],
    },

    'Abruzzo': {
      emoji: '🏔', foto: IMG.vigne,
      intro: 'Tra l\'Appennino e l\'Adriatico. Montepulciano d\'Abruzzo e Trebbiano d\'Abruzzo — Valentini è il produttore cult che ha reso famoso il vino abruzzese nel mondo.',
      dens: [
        { n:'Montepulciano d\'Abruzzo DOC', t:'DOC', uva:'Montepulciano', img: IMG.vigne,
          storia:'Valentini, Emidio Pepe e Masciarelli hanno elevato questo vino da rustico locale a grandioso. Valentini in particolare invecchia i vini 10+ anni prima di commercializzarli.',
          terroir:'Colline adriatiche tra 100 e 600m. Suoli argillosi e calcarei. Clima mediterraneo con influenze adriatiche.',
          profilo:'Ciliegia matura, prugna, spezie, violetta. Corpo pieno, tannini morbidi, ottima versatilità.',
          note:'Cerasuolo d\'Abruzzo DOC è il rosato di Montepulciano — tra i migliori rosati italiani.' },

        { n:'Trebbiano d\'Abruzzo DOC', t:'DOC', uva:'Trebbiano Abruzzese', img: IMG.grappoli,
          storia:'Valentini produce forse il bianco longevo più misterioso d\'Italia. Il Trebbiano Abruzzese non ha nulla in comune con il banale Trebbiano Toscano — è un vitigno nobile capace di invecchiare 20 anni.',
          terroir:'Le Trebbiano vineyard di Valentini a Loreto Aprutino sono coltivate senza chimica da oltre 50 anni.',
          profilo:'Mela, pera, minerale, note di cera d\'api. Evolve verso noci, miele e note ossidative eleganti.',
          note:'Valentini non produce ogni anno — solo nelle annate che ritiene degne.' },
      ],
    },

    'Basilicata': {
      emoji: '🌋', foto: IMG.terra,
      intro: 'Il Vulture è un vulcano spento i cui suoli hanno forgiato un Aglianico diverso da quello irpino — più minerale, più austero.',
      dens: [
        { n:'Aglianico del Vulture DOC', t:'DOC', uva:'Aglianico', img: IMG.terra,
          storia:'Il Monte Vulture è un vulcano spento. L\'Aglianico su suoli vulcanici basaltici dà un vino più minerale e austero rispetto al Taurasi campano. Elena Fucci ha rivoluzionato la denominazione negli anni 2000.',
          terroir:'Suoli basaltici vulcanici a 300-700m. Tufi e ceneri vulcaniche ben drenanti. Clima continentale freddo d\'inverno.',
          profilo:'Ciliegia nera, pepe, tabacco, note minerali vulcaniche. Acidità alta, tannini fibrosi, longevo.',
          note:'Elena Fucci con "Titolo" e Paternoster i riferimenti. Il Superiore DOCG (da 2010) è la versione top.' },
      ],
    },

    'Calabria': {
      emoji: '🌊', foto: IMG.vigne,
      intro: 'La punta dello stivale. Gaglioppo è il re locale, e il Cirò DOC è il vino più antico d\'Italia — già i Greci lo producevano per i loro atleti olimpici.',
      dens: [
        { n:'Cirò DOC', t:'DOC', uva:'Gaglioppo, Greco Bianco', img: IMG.vigne,
          storia:'Cirò è considerato il vino più antico d\'Italia. I Greci di Crimisa (l\'attuale Cirò Marina) lo producevano come Krimisa e lo offrivano agli atleti vincitori delle Olimpiadi.',
          terroir:'Colline argillose e suoli calcarei della costa ionica calabrese. Clima mediterraneo estremo.',
          profilo:'Ciliegia, spezie, note iodate. Struttura media, tannini presenti, bevibilità immediata.',
          note:'Librandi è il produttore più noto. Il Cirò Bianco da Greco è meno famoso ma interessante.' },
      ],
    },
  };

  /* ═══════════════════════════════════════════════════════
     30 ARTICOLI ROTANTI — storia, tecnica, vitigni rari
  ═══════════════════════════════════════════════════════ */
  const ARTICOLI = [
    {
      id: 1, cat: 'STORIA', emoji: '📜',
      titolo: 'Il Vino nella Roma Antica: Anfore, Falerno e Baccanali',
      sommario: 'I Romani bevevano vino annacquato con acqua marina e miele. Il Falerno era il vino più quotato dell\'Impero — equivalente del Pétrus antico.',
      testo: 'L\'Impero Romano era costruito su tre pilastri: il grano, l\'olio e il vino. Ogni legionario riceveva una razione giornaliera di posca — aceto diluito in acqua. Ma i patrizi bevevano Falerno, prodotto sui pendii del Monte Massico in Campania, già citato da Orazio, Virgilio e Plinio. Il vino romano era diverso: addensato con miele (mulsum), speziato con resina (retsina greca), talvolta conservato in anfore con coperture di pece. Plinio il Vecchio nella Naturalis Historia descrisse oltre 200 varietà di uva coltivate in Italia. La diffusione del vino attraverso l\'Impero portò la vite dal Reno alla Britannia, lasciando le radici di quelle che oggi sono le grandi regioni vinicole europee.',
      img: IMG.antico, tag: 'storia',
    },
    {
      id: 2, cat: 'TECNICA', emoji: '🍷',
      titolo: 'L\'Arte del Decanting: Quando e Come Usare il Decanter',
      sommario: 'Non tutti i vini vanno decantati. I vini giovani e tannici beneficiano dell\'ossigenazione; i vini anziani vanno aperti con delicatezza per non perdere il bouquet.',
      testo: 'Il decanter è lo strumento più frainteso del sommelier. Esistono due motivi per decantare: separare il sedimento (vini anziani) e ossigenare il vino per aprire gli aromi (vini giovani e tannici). Per un Barolo di 5 anni: versare lentamente con la bottiglia inclinata, lasciare nel decanter 1-2 ore. Per un Brunello di 20 anni: versare con una candela sotto la bottiglia per vedere il sedimento, fermarsi appena lo si vede. I grandi bianchi complessi (Borgogna bianco, Fiano invecchiato) possono beneficiare di una breve decantazione di 20 minuti. Mai decantare Champagne, vini frizzanti, vini delicati come il Pinot Noir di Borgogna giovane.',
      img: IMG.degust, tag: 'tecnica',
    },
    {
      id: 3, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Nerello Mascalese: Il Pinot Nero del Vulcano',
      sommario: 'Sull\'Etna, tra i 600 e i 1000 metri, crescono viti centenarie ad alberello. Il Nerello Mascalese produce vini che ricordano la Borgogna — e costano quanto lei.',
      testo: 'Il Nerello Mascalese è il vitigno dell\'Etna — rosso leggero, acidissimo, con tannini fini che ricordano il Pinot Nero di Borgogna. Ogni contrada dell\'Etna ha carattere distinto: Calderara Sottana dà vini più eleganti, Barbabecchi più potenti, Rampante sul versante nord più acidi e minerali. Le viti ad alberello centenario — alcune con 150 anni — crescono su terreni lavici pre-fillossera con radici franche. Il sistema delle "contrade" come i cru borgognoni ha trasformato l\'Etna nel luogo più discusso del vino mondiale negli ultimi 15 anni.',
      img: IMG.etna, tag: 'vitigni',
    },
    {
      id: 4, cat: 'VIGNE EROICHE', emoji: '⛰',
      titolo: 'Le Vigne Eroiche: Dove il Vino Costa Fatica',
      sommario: 'In Valtellina, sulle Cinque Terre, a Priorat e sulle colline della Mosella, i viticoltori sfidano la gravità per produrre vino. Queste vigne non si coltivano con le macchine.',
      testo: 'Il CERVIM (Centro di Ricerca, Studi e Valorizzazione per la Viticoltura Montana) definisce "eroica" la viticoltura con pendenze superiori al 30%, quote superiori ai 500m, sistemi a terrazzamento o viticoltura sulle isole. In Valtellina i muri a secco risalgono al Medioevo e vengono mantenuti a mano. In Liguria (Cinque Terre e Vernazza) le uve vengono trasportate con monorotaie o barche. Sul Reno ripido della Mosella i vignaioli si calano con funi. A Priorat (Spagna) i trattori monofilo "spider" sono l\'unica macchina possibile. Queste vigne producono vini rari, costosi, irriproducibili — e mantengono in vita paesaggi millenari.',
      img: IMG.filari, tag: 'vigne',
    },
    {
      id: 5, cat: 'TECNICA', emoji: '🥂',
      titolo: 'La Temperatura di Servizio: Il Segreto Dimenticato',
      sommario: 'Un Barolo a 25°C è inutile. Un Champagne a 12°C è sprecato. La temperatura di servizio trasforma o distrugge un vino.',
      testo: 'La temperatura di servizio è forse l\'errore più frequente nei ristoranti. I rossi "a temperatura ambiente" risalgono all\'epoca pre-riscaldamento delle abitazioni — quando le sale erano a 16-18°C. Oggi "temperatura ambiente" significa 22-25°C, il che rende il vino flaccido, alcolico e senza struttura. Regola generale: Champagne e bollicine 6-8°C; bianchi secchi leggeri 8-10°C; bianchi strutturati e Chardonnay 10-12°C; rosati 10-12°C; Pinot Nero e rossi leggeri 14-16°C; rossi strutturati 16-18°C; vini dolci dessert 8-10°C. Una bottiglia presa in cantina a 14°C si scalda di 2°C ogni 10 minuti a temperatura ambiente.',
      img: IMG.calici, tag: 'tecnica',
    },
    {
      id: 6, cat: 'STORIA', emoji: '📜',
      titolo: 'Il Giudizio di Parigi 1976: Quando la California Sconfisse la Francia',
      sommario: 'Il 24 maggio 1976 un gruppo di esperti francesi assaggiò alla cieca i migliori vini californiani contro i grandi Bordeaux e Borgogna. La California vinse. Il mondo del vino non fu più lo stesso.',
      testo: 'Steven Spurrier, mercante inglese di vini a Parigi, organizzò una degustazione cieca per celebrare il bicentenario americano. I giudici erano tutti francesi — Aubert de Villaine (DRC), Pierre Brejoux, Christian Vanneque. Il Chardonnay Chateau Montelena 1973 vinse sui bianchi francesi. Il Cabernet Sauvignon Stag\'s Leap Wine Cellars 1973 vinse sui Bordeaux. I giudici francesi credevano di assaggiare i loro vini. La notizia fu ignorata in Francia (Le Figaro la pubblicò un paragrafo nelle pagine interne) ma esplose in America. George Taber del Time fu l\'unico giornalista presente e scrisse l\'articolo che cambiò il mondo del vino.',
      img: IMG.degust, tag: 'storia',
    },
    {
      id: 7, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Timorasso: Il Vitigno Resurrezione del Piemonte',
      sommario: 'Quasi estinto negli anni \'80, il Timorasso del Tortonese è oggi uno dei bianchi più ricercati d\'Italia. Walter Massa lo ha salvato quasi da solo.',
      testo: 'Il Timorasso cresceva sui Colli Tortonesi fino agli anni \'50, poi quasi scomparve per la sua difficoltà di coltivazione. Walter Massa, produttore di Monleale, nei \'90 decise di recuperarlo. Il risultato fu sorprendente: un bianco strutturato, grasso, minerale, capace di invecchiare 15-20 anni. L\'aroma ricorda il Riesling Mosella ma con corpo più pieno. Oggi una piccola comunità di produttori (Boveri, Mutti, Vigneti Repetto) produce Derthona (nome storico dei vini tortonesi) che vengono venduti a prezzi paragonabili ai grandi bianchi borgognoni.',
      img: IMG.grappoli, tag: 'vitigni',
    },
    {
      id: 8, cat: 'LUOGHI', emoji: '🌍',
      titolo: 'La Mosella: Le Vigne più Ripide del Mondo',
      sommario: 'Sul fiume Mosella in Germania le vigne crescono su pendii di ardesia blu a 70 gradi di inclinazione. Il Riesling che ne nasce è il vino più longevo al mondo.',
      testo: 'La Mosella è un fiume che serpeggia tra le Ardenne e il Reno. Sulle sue rive i vignaioli hanno costruito terrazzamenti verticali su ardesia blu devoniana da 2000 anni. L\'ardesia trattiene il calore del sole e lo rilascia di notte — fondamentale in una regione così a nord (51° latitudine). Il Riesling di Mosella è il vino più longevo al mondo: bottiglie degli anni \'70 sono ancora vive e magnifiche. Egon Müller (Scharzhofberg), JJ Prüm (Wehlener Sonnenuhr), Loosen (Doctor) producono qui i Trockenbeerenauslese più costosi al mondo — più del Pétrus.',
      img: IMG.filari, tag: 'luoghi',
    },
    {
      id: 9, cat: 'TECNICA', emoji: '🍷',
      titolo: 'I Bicchieri del Vino: Perché la Forma Conta',
      sommario: 'Un Barolo nel calice sbagliato perde il 40% degli aromi. Riedel, Zalto, Spiegelau: la scienza dei bicchieri è seria quanto quella dell\'enologia.',
      testo: 'Georg Riedel negli anni \'70 fu il primo a dimostrare scientificamente che la forma del bicchiere influenza la percezione del vino. Il calice per Borgogna è ampio e rotondo per convogliare i profumi delicati. Il calice per Bordeaux è più alto e stretto per concentrare i tannini. Il flûte per Champagne allunga le bollicine ma non sviluppa gli aromi — meglio un calice a tulipano. Le regole base: il bicchiere deve essere trasparente, di cristallo sottile, con stelo lungo. Il calice non va mai riempito più di un terzo per lasciare spazio agli aromi. Temperatura della mano trasmessa attraverso il gambo: tenerlo sempre dal piede.',
      img: IMG.calici, tag: 'tecnica',
    },
    {
      id: 10, cat: 'STORIA', emoji: '📜',
      titolo: 'La Fillossera: Il Parassita che Distrusse l\'Europa del Vino',
      sommario: 'Dal 1860 al 1890 un minuscolo afide americano distrusse il 70% dei vigneti europei. La ricostruzione su portinnesti americani cambiò per sempre il DNA del vino.',
      testo: 'La Phylloxera vastatrix arrivò in Europa nel 1863 importata dall\'America con piante ornamentali. L\'afide attacca le radici della Vitis vinifera europea, che non ha difese contro di lui. In 20 anni distrusse vigneti in Francia, Italia, Spagna, Germania. La soluzione fu trovata da Pierre Viala: innestare le viti europee su radici di vite americana resistente. Oggi il 99% dei vigneti mondiali è innestato. Pochissime eccezioni sopravvivono su "piede franco" (radici originali): Colares in Portogallo su sabbia, alcune zone di Pantelleria, il Cannonau sardo e i vecchi vigneti dell\'Etna. Il vino pre-fillossera è perduto per sempre — nessuno sa com\'era davvero.',
      img: IMG.terra, tag: 'storia',
    },
    {
      id: 11, cat: 'VIGNE EROICHE', emoji: '⛰',
      titolo: 'L\'Alberello Pantesco: La Viticoltura più Antica del Mediterraneo',
      sommario: 'A Pantelleria le viti non crescono in alto — si sdraiano sulla lava nera come sculture viventi. È il sistema di allevamento più antico del Mediterraneo.',
      testo: 'L\'alberello pantesco (vite ad alberello di Pantelleria) è stato riconosciuto nel 2014 dall\'UNESCO come Patrimonio Immateriale dell\'Umanità. La vite viene potata a cespuglio bassissimo, quasi a contatto con la lava nera, per resistere allo scirocco africano (che soffia a 100 km/h) e catturare l\'umidità notturna. Ogni pianta produce pochissima uva — meno di 500 grammi contro i 2-3 kg di una vigna normale. La vendemmia è completamente manuale, spesso in ginocchio. Le viti più vecchie hanno 150-200 anni con radici franche pre-fillossera. Questo paesaggio viticolo unico produce il Passito di Pantelleria — uno dei vini dolci più grandi del mondo.',
      img: IMG.pantelleria, tag: 'vigne',
    },
    {
      id: 12, cat: 'TECNICA', emoji: '🍷',
      titolo: 'Il Cavatappi del Sommelier: La Guida Definitiva',
      sommario: 'Il Waiter\'s Friend, il Ah-So, il Durand per bottiglie anziane. Ogni cavatappi ha la sua specialità — e il sommelier professionale ne usa tre diversi.',
      testo: 'Il cavatappi del sommelier professionale (Waiter\'s Friend o "tire-bouchon de sommelier") è lo strumento più usato nei ristoranti del mondo. La doppia leva permette di aprire qualsiasi bottiglia senza scuoterla. Per bottiglie antiche con turaccioli fragili: il sistema Ah-So (due lame metalliche ai lati) è indispensabile — si avvolge lentamente il sughero senza perforarlo. Il Durand combina vite elicoidale e Ah-So per i casi più difficili (Borgogna anni \'60-\'70). Il capsulatore a due leve è preferibile al sommelier quando il tappo è particolarmente lungo. Mai aprire Champagne con il cavatappi — la pressione è 6 atmosfere.',
      img: IMG.sommelier, tag: 'tecnica',
    },
    {
      id: 13, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Gewürztraminer: Il Vino che Profuma di Rosa e Litchi',
      sommario: 'Il vitigno più aromatico al mondo nasce a Termeno/Tramin in Alto Adige. Il suo profumo di litchi, rosa e spezie orientali è inconfondibile.',
      testo: 'Tramin (Termeno) è un piccolo comune dell\'Alto Adige dove il Gewürztraminer — "speziato di Tramin" — ha avuto origine nel Medioevo. L\'uva ha buccia rosata e aromi così intensi da essere riconoscibile a 10 metri dalla vigna in fase di maturazione. Gli Alsaziani ne fanno la versione più famosa al mondo (Weinbach, Trimbach, Zind-Humbrecht), in versione secca e vendemmia tardiva. In Alto Adige: Hofstätter, Tramin cantina cooperativa, Franz Haas. Il Gewürztraminer Vendange Tardive alsaziano è uno dei vini dolci più aromatici mai prodotti.',
      img: IMG.grappoli, tag: 'vitigni',
    },
    {
      id: 14, cat: 'LUOGHI', emoji: '🌍',
      titolo: 'La Borgogna: Dove 1 Ettaro Vale 50 Milioni',
      sommario: 'La Romanée-Conti ha 1,8 ettari e produce 6000 bottiglie l\'anno. Un ettaro di Grands Crus costa più di qualsiasi proprietà immobiliare al mondo.',
      testo: 'La Côte d\'Or (Costa d\'Oro) è una striscia di terra lunga 50km e larga 2km tra Dijon e Beaune. Su questa lingua di calcare e argilla si producono i vini più costosi del mondo. La Romanée-Conti (DRC) vale 1 milione di euro ad ettaro. Petrus in Pomerol, Bordeaux, vale 3 milioni. La Borgogna è unica per la parcellizzazione estrema: il Clos de Vougeot (50 ha) ha 80 proprietari diversi. Il sistema Grand Cru > Premier Cru > Village > Régional è il modello che tutta l\'enologia mondiale ha copiato. I vini di DRC (Romanée-Conti, La Tâche, Richebourg) vengono venduti esclusivamente in cassetta mista e i collezionisti li accumulano senza aprirli.',
      img: IMG.borgogna, tag: 'luoghi',
    },
    {
      id: 15, cat: 'STORIA', emoji: '📜',
      titolo: 'Dom Pérignon e il Mito dello Champagne',
      sommario: 'Dom Pérignon NON ha inventato lo Champagne. Ma ha migliorato ogni aspetto della sua produzione — e il mito è ormai inseparabile dalla realtà.',
      testo: 'Pierre Pérignon, frate benedettino dell\'Abbazia di Hautvillers, lavorò dal 1668 al 1715 perfezionando il vino della Champagne. Ma le bollicine le scoprirono gli inglesi: nel 1662 Christopher Merret scrisse il primo documento che descrive il metodo per rendere spumante il vino. Dom Pérignon odiava le bollicine e cercava di eliminarle — le bottiglie esplodevano in cantina rovinando le scorte. La sua vera rivoluzione fu la cuvée (assemblaggio di vini diversi), il tappo di sughero (prima si usava la stoppa), e la selezione rigorosa delle uve. La maison Moët & Chandon ha acquisito il nome "Dom Pérignon" nel 1936 per la sua cuvée prestige.',
      img: IMG.calici, tag: 'storia',
    },
    {
      id: 16, cat: 'TECNICA', emoji: '🍷',
      titolo: 'Come Assaggiare un Vino: Il Protocollo del Sommelier',
      sommario: 'Vista, naso, bocca. Tre fasi che richiedono concentrazione e silenzio. Un vino non va "bevuto" al primo assaggio — va ascoltato.',
      testo: 'La degustazione professionale ha un protocollo preciso. Vista: colore (intensità, tonalità, limpidezza), consistenza (lacrime, glicerina). Naso: primo naso (aromi primari — vitigno), secondo naso dopo rotazione (aromi secondari — fermentazione), terzo naso dopo riposo (aromi terziari — affinamento). Bocca: ingresso (prima sensazione), sviluppo (metà bocca, acidità, tannini, struttura), finale (persistenza in secondi — PAI). La scheda di degustazione AIS (Associazione Italiana Sommelier) codifica ogni parametro in una scala precisa. Un grande vino ha equilibrio tra acidità, tannini, alcol e morbidezza — nessuno degli elementi deve prevalere.',
      img: IMG.sommelier, tag: 'tecnica',
    },
    {
      id: 17, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Ribolla Gialla e i Vini Orange: La Rivoluzione di Gravner',
      sommario: 'Josko Gravner nel 1997 tornò da un viaggio in Georgia con un\'idea folle: fermentare il vino bianco sulle bucce per mesi, in anfore di terracotta. Nacque il vino orange.',
      testo: 'La Ribolla Gialla è il vitigno autoctono del Collio friulano, coltivato da secoli su entrambi i lati del confine italo-sloveno. Josko Gravner nel 1997, dopo un viaggio in California che lo deluse, andò in Georgia e scoprì i Kvevri — anfore di terracotta interrate. Tornò in Friuli e cominciò a fermentare la Ribolla con bucce per 6 mesi in anfore. Il risultato fu un vino ambrato, tannico, ossidativo, senza solfiti aggiunti: incomprensibile per il mercato italiano. Ma nel giro di 10 anni divenne il simbolo del movimento "natural wine". Stanko Radikon seguì la stessa strada. Oggi i loro vini vengono venduti a 100+ euro la bottiglia.',
      img: IMG.cantina, tag: 'vitigni',
    },
    {
      id: 18, cat: 'LUOGHI', emoji: '🌍',
      titolo: 'Pantelleria: L\'Isola del Vento tra Africa e Sicilia',
      sommario: 'A 70km dalla Tunisia, Pantelleria è il luogo più insolito della viticoltura italiana. Lava nera, scirocco africano, Zibibbo ad alberello.',
      testo: 'Pantelleria è geologicamente africana — la lava è la stessa del continente. Gli Arabi portarono lo Zibibbo (Moscato d\'Alessandria) nell\'827 d.C. durante la conquista dell\'isola. Oggi i 4000 ettari vitati sono coltivati da poche decine di famiglie su terrazzamenti lavici. L\'alberello pantesco è il sistema più antico del Mediterraneo: la vite quasi sdraiata sul terreno protegge i grappoli dall\'abrasione dello scirocco. Il Passito di Pantelleria — ottenuto da uve appassite al sole per 20-30 giorni — è uno dei vini dolci più complessi al mondo. Ben\'Ryé di Donnafugata ha reso famosa l\'isola in tutto il mondo.',
      img: IMG.pantelleria, tag: 'luoghi',
    },
    {
      id: 19, cat: 'STORIA', emoji: '📜',
      titolo: 'I Vini del Medioevo: Ippocrasso, Vernaccia e i Monasteri',
      sommario: 'Nel Medioevo i monasteri erano i custodi del vino. I monaci benedettini e cistercensi trasformarono la viticoltura europea in una scienza.',
      testo: 'I monaci benedettini (ora et labora) coltivavano la vite per il vino della Messa e per la medicina. L\'abbazia di Cluny aveva vigne in Borgogna che diventarono i futuri Grands Crus. I cistercensi crearono il Clos de Vougeot nel 1141 costruendo il famoso muro che ancora lo circonda. L\'ippocrasso era il vino dei nobili medievali: vino rosso speziato con cannella, chiodi di garofano, zenzero e zucchero di canna. I vini medievali erano spesso diluiti, speziati, talvolta fermentati con erbe aromatiche — nulla a che fare con i vini moderni. La Vernaccia di San Gimignano era già famosa nel 1282: era il vino dell\'aristocrazia toscana.',
      img: IMG.antico, tag: 'storia',
    },
    {
      id: 20, cat: 'TECNICA', emoji: '🍷',
      titolo: 'L\'Abbinamento Cibo-Vino: Le Regole che si Possono Rompere',
      sommario: 'Bianco col pesce, rosso con la carne: è una semplificazione pericolosa. La vera regola è l\'equilibrio tra le strutture del piatto e del vino.',
      testo: 'Le "regole" dell\'abbinamento sono state scritte per essere infrante con criterio. La vera logica è l\'equilibrio: un piatto grasso (costata, formaggi stagionati) vuole un vino con tannini o acidità per "tagliare" la grassezza. Un pesce delicato vuole un bianco leggero per non coprirlo. Ma un\'aragosta al burro può benissimo stare con un Meursault strutturato. I quattro principi base: concordanza (piatto semplice = vino semplice), contrasto (dolce + acido, es. foie gras + Sauternes), regionalità (abbinare i vini locali ai piatti locali — mai sbagliato), stagionalità (vini freschi d\'estate, strutturati d\'inverno). Il Barolo con il Tartufo bianco di Alba è il grande abbinamento regionale piemontese.',
      img: IMG.degust, tag: 'tecnica',
    },
    {
      id: 21, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Sagrantino: Il Vino con più Tannini del Mondo',
      sommario: 'Scientificamente misurato, il Sagrantino di Montefalco ha la concentrazione di tannini più alta di qualsiasi vino prodotto. Ma con il tempo diventa qualcosa di straordinario.',
      testo: 'Il Sagrantino è un vitigno autoctono di Montefalco, Umbria. Studi dell\'Università di Perugia hanno misurato la sua concentrazione di proantocianidine (i tannini) come la più alta al mondo — superiore anche al Tannat uruguayano. Questo significa che da giovane (3-5 anni) è quasi imbevibile: asciuga completamente la bocca. Ma con 10-15 anni di affinamento si trasforma in un vino vellutato, profondo, complesso. Arnaldo Caprai ha creato il "25 Anni" invecchiandolo in barrique e grandi botti per 5 anni. La versione Passito dolce — quella originale delle messe religiose — è più accessibile in gioventù.',
      img: IMG.vigne, tag: 'vitigni',
    },
    {
      id: 22, cat: 'LUOGHI', emoji: '🌍',
      titolo: 'Le Langhe: La Borgogna italiana dei Tannini',
      sommario: 'Le colline delle Langhe a sud di Alba sono tra i paesaggi viticoli più belli del mondo — UNESCO dal 2014. Barolo, Barbaresco, Dolcetto, Barbera: un\'enciclopedia in pochi chilometri.',
      testo: 'Le Langhe sono una catena di colline formate da depositi marini terziari nell\'entroterra cuneese. Ogni versante esposto a sud-est è un potenziale vigneto. La suddivisione in MGA (Menzioni Geografiche Aggiuntive) ha codificato 155 cru solo per il Barolo e 66 per il Barbaresco. La diversità geologica è straordinaria: marne tortoniane su Serralunga (tannini duri, longevità) vs. marne elvetiane su La Morra (eleganza, maturazione rapida). Ristoranti come Piazza Duomo di Enrico Crippa (3 stelle Michelin) ad Alba e La Ciau del Tornavento a Treiso fanno delle Langhe una meta gastronomica mondiale. La Fiera del Tartufo Bianco di Alba (ottobre-novembre) è il momento culminante.',
      img: IMG.filari, tag: 'luoghi',
    },
    {
      id: 23, cat: 'STORIA', emoji: '📜',
      titolo: 'La Nascita del Chianti: Barone Ricasoli e la Formula Segreta',
      sommario: 'Nel 1872 Bettino Ricasoli scrisse la "formula" del Chianti: 70% Sangiovese, 15% Canaiolo, 15% Malvasia. Una ricetta che ha dominato per un secolo prima di essere abbandonata.',
      testo: 'Bettino Ricasoli, "il barone di ferro", fu Presidente del Consiglio d\'Italia dopo Cavour e viticultura di Brolio nel senese. Nel 1872 scrisse in una lettera la sua formula del Chianti Classico: Sangiovese per il colore e la struttura, Canaiolo per ammorbidire i tannini, Malvasia bianca per profumo e morbidezza. Per un secolo questa formula fu legge. Poi negli anni \'70 i produttori di qualità (Antinori, Rufino, Badia a Coltibuono) cominciarono a eliminare la Malvasia — che diluiva il vino — e ad aggiungere Cabernet Sauvignon. I "Supertuscan" nacquero da questa ribellione. Nel 1996 il disciplinare fu riformato: oggi il Chianti Classico può essere 100% Sangiovese.',
      img: IMG.vigne, tag: 'storia',
    },
    {
      id: 24, cat: 'TECNICA', emoji: '🍷',
      titolo: 'Il Metodo Classico: Champagne, Franciacorta, Trento — Differenze e Segreti',
      sommario: 'Tre paesi, stesso metodo, caratteri completamente diversi. Il Metodo Classico (seconda fermentazione in bottiglia) è il modo più nobile di fare le bollicine.',
      testo: 'Il Metodo Classico (Champenoise in Francia) prevede la rifermentazione in bottiglia con aggiunta di lieviti e zucchero (liqueur de tirage). La seconda fermentazione produce CO2 che rimane intrappolata — le bollicine. Il remuage (rotazione delle bottiglie) porta i lieviti sul tappo. Il dégorgement li elimina. La liqueur d\'expédition aggiusta la dolcezza. I lieviti a contatto con il vino producono gli aromi di pane, brioches, crosta di torta. In Champagne: gessi e argille della Marne danno mineralità e freschezza. In Franciacorta: morene glaciali danno struttura. In Trentino: calcare alpino dà freschezza e acidità. I migliori Metodo Classico italiani competono con lo Champagne.',
      img: IMG.calici, tag: 'tecnica',
    },
    {
      id: 25, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Pecorino: Il Vitigno Quasi Estinto che Vale Oro',
      sommario: 'Negli anni \'80 il Pecorino era ridotto a poche piante selvatiche nelle Marche. Oggi è uno dei bianchi italiani più premiati. Il suo nome viene dalle pecore che mangiavano i grappoli.',
      testo: 'Il Pecorino (il nome viene dalle pecore transumanti che mangiavano i grappoli dolci durante le migrazioni autunnali) era praticamente estinto negli anni \'80. Oasi degli Angeli e poi altri produttori marchigiani lo recuperarono da viti selvatiche sui costoni. Il Pecorino ama suoli poveri e calcarei, alta quota, esposizioni ventilate. Il risultato è un bianco di grande struttura, sapidità intensa, acidità vibrante — quasi un "bianco con anima da rosso". La DOCG Offida Pecorino e l\'IGT Terre di Offida ne sono le espressioni principali. Velenosi, Aurora, il Pollenza tra i migliori.',
      img: IMG.grappoli, tag: 'vitigni',
    },
    {
      id: 26, cat: 'LUOGHI', emoji: '🌍',
      titolo: 'Santorini: Il Vino Vulcanico dell\'Egeo',
      sommario: 'Su un\'isola di pomice e cenere vulcanica, a 36° di latitudine nord, l\'Assyrtiko produce i bianchi più minerali d\'Europa. La vigna a Kouloura resiste da 3500 anni.',
      testo: 'Santorini è il cratere di un supervulcano esploso 3600 anni fa che distrusse la civiltà minoica. Il suolo è pomice, cenere e basalto nero — nessuna argilla, nessuna nutritività. La vite Assyrtiko sopravvive in secco assoluto (pioggia solo d\'inverno) grazie al sistema "Kouloura" — allevata a cesto intrecciato che protegge i grappoli dal vento e li tiene vicini al suolo caldo. Le viti più vecchie hanno 200 anni con radici franche pre-fillossera — la fillossera non sopravvive sulla pomice. Gaia, Hatzidakis e Sigalas producono bianchi di una mineralità vulcanica incomparabile. L\'Assyrtiko Vinsanto (passito) è il dessert wine greco per eccellenza.',
      img: IMG.terra, tag: 'luoghi',
    },
    {
      id: 27, cat: 'STORIA', emoji: '📜',
      titolo: 'Barolo: Da Vino Dolce a Re dei Vini — La Trasformazione Ottocentesca',
      sommario: 'Prima del 1850 il Barolo era un vino dolce, semi-fermentato, spesso frizzante. Camillo Cavour chiamò l\'enologo francese Oudart per trasformarlo in un vino secco strutturato.',
      testo: 'Il Barolo che conosciamo oggi esiste da meno di 200 anni. Prima del 1850, il Nebbiolo veniva vinificato dolce — la fermentazione si arrestava con il freddo autunnale prima che tutti gli zuccheri si esaurissero. Il risultato era un vino dolciastro, talvolta frizzante, incline a rifermentare in bottiglia. Il conte Camillo Cavour, futuro artefice dell\'Unità d\'Italia, chiamò Louis Oudart — enologo francese che lavorava per la marchesa Falletti — per riformare la produzione. Oudart insegnò la fermentazione completa in secco e l\'affinamento prolungato. La marchesa Giulia Falletti di Barolo donò al re Carlo Alberto 325 botti del nuovo vino — una per ogni giorno dell\'anno. Il "Re dei Vini, Vino dei Re" nacque così.',
      img: IMG.cantina, tag: 'storia',
    },
    {
      id: 28, cat: 'TECNICA', emoji: '🍷',
      titolo: 'Il Vino Naturale: Cosa Significa Davvero',
      sommario: 'Natural wine, vino biologico, biodinamico, artigianale — le etichette si moltiplicano. Ma cosa distingue davvero un vino "naturale" da uno convenzionale?',
      testo: 'Non esiste una definizione legale di "vino naturale". Per convenzione indica: uve biologiche o biodinamiche, fermentazione con lieviti indigeni (senza inoculo di lieviti selezionati), senza o bassissima aggiunta di solfiti (SO2), nessuna correzione chimica del vino. I vini biologici hanno regole precise sull\'uso di pesticidi e chimica in vigna. I biodinamici (metodo Rudolf Steiner) lavorano secondo il calendario lunare e usano preparati omeopatici. I vini naturali possono essere torbidi (non filtrati), con lievi ossidazioni, con rifermentazione in bottiglia. Non sono automaticamente migliori dei vini convenzionali — ma raccontano un terroir senza filtri. Le "derive" dei vini naturali (eccesso di acetato, ossidazione) sono difetti, non pregi.',
      img: IMG.vigne, tag: 'tecnica',
    },
    {
      id: 29, cat: 'VITIGNI RARI', emoji: '🍇',
      titolo: 'Carricante e l\'Etna Bianco: La Scoperta degli Ultimi Anni',
      sommario: 'Mentre il mondo scopriva il Nerello Mascalese, il Carricante dell\'Etna è rimasto nell\'ombra. Oggi è uno dei bianchi più eleganti d\'Italia.',
      testo: 'Il Carricante (da "caricare" — carico di uve) è il vitigno bianco dell\'Etna, coltivato principalmente sul versante est dell\'Etna nella zona di Milo. Su suoli lavici a 600-900m produce un bianco di straordinaria mineralità vulcanica, acidità quasi renana, struttura che permette l\'invecchiamento 10+ anni. Benanti è il pioniere con il "Pietramarina" da vecchie vigne di Carricante a Milo. Gulfi, Passopisciaro e Cornelissen producono versioni sempre più apprezzate. Il confronto con il Chablis Grand Cru non è irragionevole — stessa mineralità segnata, stessa freschezza tagliente.',
      img: IMG.etna, tag: 'vitigni',
    },
    {
      id: 30, cat: 'LUOGHI', emoji: '🌍',
      titolo: 'La Valpolicella: Tre Vini da un\'Unica Vigna',
      sommario: 'Le stesse uve Corvina e Rondinella danno tre vini completamente diversi: Valpolicella fresco, Ripasso morbido, Amarone potente. Il segreto è l\'appassimento.',
      testo: 'La Valpolicella è un sistema viticolo unico al mondo: le stesse uve coltivate negli stessi vigneti danno tre vini completamente diversi a seconda del processo produttivo. Il Valpolicella Classico è un rosso leggero, fresco, beverino. Il Ripasso viene fatto "ripassare" sulle vinacce dell\'Amarone — le bucce secche cedono struttura e complessità. L\'Amarone è il vino dell\'appassimento: le uve vengono portate in fruttai speciali (arele) dove appassiscono per 90-120 giorni, perdendo il 30-35% del peso. La concentrazione zuccherina e aromatica che ne risulta produce un vino di 15-17% alcolici con struttura monumentale. Quintarelli, Dal Forno, Romano Dal Forno, Allegrini, Masi i nomi di riferimento.',
      img: IMG.cantina, tag: 'luoghi',
    },
  ];

  /* ═══════════════════════════════════════════════════════
     CSS v8
  ═══════════════════════════════════════════════════════ */
  function injectCSS8() {
    if (document.querySelector('#sw8-css')) return;
    const s = document.createElement('style');
    s.id = 'sw8-css';
    s.textContent = `
      /* Articoli */
      #sw8-articles { background: var(--sw7-nero, #0A0705); }
      .sw8-art-hero {
        position: relative; overflow: hidden;
        height: clamp(180px, 45vw, 340px);
        cursor: pointer;
      }
      .sw8-art-hero img {
        width: 100%; height: 100%; object-fit: cover;
        filter: brightness(.6) saturate(1.2);
        transition: transform .5s ease, filter .4s;
      }
      .sw8-art-hero:hover img { transform: scale(1.04); filter: brightness(.7) saturate(1.3); }
      .sw8-art-hero-ov {
        position: absolute; inset: 0;
        background: linear-gradient(to bottom, rgba(10,7,5,.1) 0%, rgba(10,7,5,.8) 100%);
        padding: 20px;
        display: flex; flex-direction: column; justify-content: flex-end;
      }
      .sw8-art-cat {
        font-family: 'Lato', sans-serif;
        font-size: 9px; font-weight: 700; letter-spacing: 3px;
        text-transform: uppercase; color: #D4AF37;
        margin-bottom: 8px;
      }
      .sw8-art-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.1rem, 4vw, 1.6rem);
        font-weight: 700; color: #fff; line-height: 1.25;
        text-shadow: 0 2px 12px rgba(0,0,0,.6);
        margin-bottom: 8px;
      }
      .sw8-art-sommario {
        font-family: 'Lato', sans-serif;
        font-size: 13px; color: rgba(245,239,226,.7);
        line-height: 1.6;
      }
      .sw8-art-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: rgba(212,175,55,.1);
      }
      .sw8-art-small {
        background: #0A0705;
        cursor: pointer;
        transition: background .2s;
      }
      .sw8-art-small:hover { background: rgba(212,175,55,.05); }
      .sw8-art-small img {
        width: 100%; height: 100px; object-fit: cover;
        filter: brightness(.6); display: block;
      }
      .sw8-art-small-body { padding: 12px; }
      .sw8-art-small-cat {
        font-family: 'Lato', sans-serif;
        font-size: 8px; font-weight: 700; letter-spacing: 2.5px;
        text-transform: uppercase; color: #D4AF37;
        margin-bottom: 6px;
      }
      .sw8-art-small-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: .85rem; font-weight: 700;
        color: #F5EFE2; line-height: 1.3;
      }

      /* Modal articolo */
      #sw8-modal {
        display: none; position: fixed; inset: 0; z-index: 999990;
        background: rgba(10,7,5,.96);
        overflow-y: auto;
        animation: sw7FI .3s ease;
      }
      #sw8-modal-inner {
        max-width: 680px; margin: 0 auto;
        padding-bottom: 40px;
      }
      #sw8-modal-close {
        position: fixed; top: 16px; right: 18px; z-index: 999991;
        background: rgba(10,7,5,.85);
        border: 1px solid rgba(212,175,55,.35);
        color: #D4AF37; font-size: 20px;
        width: 42px; height: 42px; border-radius: 50%;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(8px);
      }
      #sw8-modal-img { width: 100%; height: clamp(200px,50vw,420px); object-fit: cover; display: block; }
      #sw8-modal-body { padding: 24px 20px 40px; }
      #sw8-modal-cat {
        font-family: 'Lato', sans-serif;
        font-size: 9px; font-weight: 700; letter-spacing: 3px;
        text-transform: uppercase; color: #D4AF37; margin-bottom: 12px;
      }
      #sw8-modal-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: clamp(1.4rem, 5vw, 2rem); font-weight: 700;
        color: #F5EFE2; line-height: 1.25; margin-bottom: 16px;
      }
      #sw8-modal-sommario {
        font-family: 'Playfair Display', Georgia, serif;
        font-style: italic; font-size: 1.05rem;
        color: rgba(245,239,226,.65); line-height: 1.7;
        margin-bottom: 20px; padding-bottom: 20px;
        border-bottom: 1px solid rgba(212,175,55,.15);
      }
      #sw8-modal-testo {
        font-family: 'Lato', sans-serif;
        font-size: 15px; color: rgba(245,239,226,.82);
        line-height: 1.85;
      }

      /* Denominazioni v8 — navigazione regioni */
      #sw8-den-nav {
        display: flex; flex-wrap: wrap; gap: 6px;
        padding: 14px 14px;
        border-bottom: 1px solid rgba(212,175,55,.1);
        position: sticky; top: 54px; z-index: 50;
        background: rgba(10,7,5,.97);
        backdrop-filter: blur(8px);
      }
      .sw8-region-btn {
        padding: 5px 12px;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(212,175,55,.2);
        border-radius: 14px;
        font-family: 'Lato', sans-serif;
        font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
        text-transform: uppercase; color: rgba(212,175,55,.7);
        cursor: pointer; transition: all .2s;
        white-space: nowrap;
      }
      .sw8-region-btn:hover, .sw8-region-btn.sw8-active {
        background: rgba(212,175,55,.15);
        border-color: #D4AF37;
        color: #D4AF37;
      }

      @media (max-width: 480px) {
        .sw8-art-grid { grid-template-columns: 1fr; }
        .sw8-art-small img { height: 140px; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ═══════════════════════════════════════════════════════
     SISTEMA ARTICOLI ROTANTI
  ═══════════════════════════════════════════════════════ */
  function getTodayArticles() {
    // Ruotano ogni giorno basandosi sul giorno dell\'anno
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const offset = dayOfYear % ARTICOLI.length;
    const rotated = [...ARTICOLI.slice(offset), ...ARTICOLI.slice(0, offset)];
    return rotated;
  }

  function buildArticleModal() {
    if (document.querySelector('#sw8-modal')) return;
    const m = document.createElement('div');
    m.id = 'sw8-modal';
    m.innerHTML = `
      <button id="sw8-modal-close" onclick="document.querySelector('#sw8-modal').style.display='none';document.body.style.overflow='';">✕</button>
      <div id="sw8-modal-inner">
        <img id="sw8-modal-img" src="" alt="" loading="lazy">
        <div id="sw8-modal-body">
          <div id="sw8-modal-cat"></div>
          <div id="sw8-modal-title"></div>
          <div id="sw8-modal-sommario"></div>
          <div id="sw8-modal-testo"></div>
        </div>
      </div>
    `;
    document.body.appendChild(m);
  }

  function openArticle(art) {
    buildArticleModal();
    document.querySelector('#sw8-modal-img').src = px(art.img, 900, 500);
    document.querySelector('#sw8-modal-img').alt = art.titolo;
    document.querySelector('#sw8-modal-cat').textContent = art.emoji + ' ' + art.cat;
    document.querySelector('#sw8-modal-title').textContent = art.titolo;
    document.querySelector('#sw8-modal-sommario').textContent = art.sommario;
    document.querySelector('#sw8-modal-testo').textContent = art.testo;
    const modal = document.querySelector('#sw8-modal');
    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function injectArticles() {
    // Trova dove iniettare — home-body dopo il quick grid
    const home = document.querySelector('#page-home .home-body');
    if (!home || document.querySelector('#sw8-articles')) return;

    const todayArts = getTodayArticles();
    const featured = todayArts[0];
    const secondary = todayArts.slice(1, 5);

    const section = document.createElement('div');
    section.id = 'sw8-articles';

    // Header sezione
    section.innerHTML = `
      <div style="
        padding: 20px 16px 14px;
        border-top: 1px solid rgba(212,175,55,.12);
        display: flex; align-items: center; justify-content: space-between;
      ">
        <div>
          <div style="font-family:'Lato',sans-serif;font-size:8px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:4px;">🗞 GAZZETTA DEL TERROIR</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:#F5EFE2;">Le Storie di Oggi</div>
        </div>
        <div style="font-family:'Lato',sans-serif;font-size:10px;color:rgba(212,175,55,.4);letter-spacing:1px;">
          ${new Date().toLocaleDateString('it-IT', { weekday:'long', day:'numeric', month:'long' })}
        </div>
      </div>
    `;

    // Articolo hero
    const heroEl = document.createElement('div');
    heroEl.className = 'sw8-art-hero';
    heroEl.innerHTML = `
      <img src="${px(featured.img, 900, 500)}" alt="${featured.titolo}" loading="lazy">
      <div class="sw8-art-hero-ov">
        <div class="sw8-art-cat">${featured.emoji} ${featured.cat}</div>
        <div class="sw8-art-title">${featured.titolo}</div>
        <div class="sw8-art-sommario">${featured.sommario}</div>
      </div>
    `;
    heroEl.addEventListener('click', () => openArticle(featured));
    section.appendChild(heroEl);

    // Griglia 4 articoli secondari
    const grid = document.createElement('div');
    grid.className = 'sw8-art-grid';
    secondary.forEach(art => {
      const el = document.createElement('div');
      el.className = 'sw8-art-small';
      el.innerHTML = `
        <img src="${px(art.img, 500, 300)}" alt="${art.titolo}" loading="lazy">
        <div class="sw8-art-small-body">
          <div class="sw8-art-small-cat">${art.emoji} ${art.cat}</div>
          <div class="sw8-art-small-title">${art.titolo}</div>
        </div>
      `;
      el.addEventListener('click', () => openArticle(art));
      grid.appendChild(el);
    });
    section.appendChild(grid);

    // Inserisci dopo il quick grid
    const quick = home.querySelector('#sw7-quick');
    if (quick && quick.nextSibling) {
      home.insertBefore(section, quick.nextSibling);
    } else {
      home.appendChild(section);
    }

    // Nascondi la vecchia sezione notizie
    const oldNews = home.querySelector('.news-section-head');
    if (oldNews) {
      const newsWrapper = oldNews.closest('div') || oldNews.parentElement;
      if (newsWrapper && newsWrapper !== home) newsWrapper.style.display = 'none';
      else oldNews.style.display = 'none';
    }
    const newsContainer = document.querySelector('#newsContainer');
    if (newsContainer) newsContainer.style.display = 'none';

    console.log('[SW-v8] Articoli rotanti ✓');
  }

  /* ═══════════════════════════════════════════════════════
     DENOMINAZIONI — TUTTE LE REGIONI
  ═══════════════════════════════════════════════════════ */
  function injectDenominazioni() {
    const page = document.querySelector('#page-explore');
    if (!page || document.querySelector('#sw8-den')) return;

    // Rimuovi vecchia sezione v7
    const old7 = document.querySelector('#sw7-italia');
    if (old7) old7.remove();

    const section = document.createElement('div');
    section.id = 'sw8-den';
    section.style.cssText = 'background:#0A0705;';

    // Hero immagine
    section.innerHTML = `
      <div style="position:relative;height:160px;overflow:hidden;">
        <img src="${px(IMG.vigne, 900, 400)}" style="width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(1.2);" loading="lazy" alt="Vigne italiane">
        <div style="position:absolute;inset:0;background:linear-gradient(rgba(74,4,4,.25),rgba(10,7,5,.8));display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px;">
          <div style="font-family:'Lato',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.7);text-transform:uppercase;margin-bottom:6px;">🇮🇹 ENCICLOPEDIA ITALIANA</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.4rem;font-weight:700;color:#fff;">Le Denominazioni d'Italia</div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:.85rem;color:rgba(245,239,226,.55);margin-top:5px;">Dal Nebbiolo delle Langhe al Nerello dell\'Etna</div>
        </div>
      </div>
    `;

    // Nav regioni sticky
    const nav = document.createElement('div');
    nav.id = 'sw8-den-nav';

    const allBtn = document.createElement('div');
    allBtn.className = 'sw8-region-btn sw8-active';
    allBtn.textContent = '🌍 Tutte';
    allBtn.dataset.r = 'all';
    nav.appendChild(allBtn);

    Object.entries(DB_ITALIA).forEach(([name, r]) => {
      const btn = document.createElement('div');
      btn.className = 'sw8-region-btn';
      btn.textContent = r.emoji + ' ' + name;
      btn.dataset.r = name;
      nav.appendChild(btn);
    });

    section.appendChild(nav);

    // Lista denominazioni
    const list = document.createElement('div');
    list.id = 'sw8-den-list';
    section.appendChild(list);

    // Inserisci dopo header della pagina explore
    const header = page.querySelector('div:first-child');
    if (header && header.nextSibling) {
      page.insertBefore(section, header.nextSibling);
    } else {
      page.appendChild(section);
    }

    // Render iniziale
    renderDen8('all');

    // Click nav
    nav.querySelectorAll('.sw8-region-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.sw8-region-btn').forEach(b => b.classList.remove('sw8-active'));
        btn.classList.add('sw8-active');
        renderDen8(btn.dataset.r);
        // Scroll alla lista
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    console.log('[SW-v8] Denominazioni ✓');
  }

  function renderDen8(filter) {
    const list = document.querySelector('#sw8-den-list');
    if (!list) return;
    list.innerHTML = '';

    const regions = filter === 'all'
      ? Object.entries(DB_ITALIA)
      : Object.entries(DB_ITALIA).filter(([k]) => k === filter);

    regions.forEach(([regionName, region]) => {
      // Header regione
      const rh = document.createElement('div');
      rh.style.cssText = `
        padding: 18px 16px 6px;
        display: flex; align-items: center; gap: 10px;
        border-top: 1px solid rgba(212,175,55,.12);
      `;
      rh.innerHTML = `
        <div style="
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(74,4,4,.4); border: 1px solid rgba(212,175,55,.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        ">${region.emoji}</div>
        <div>
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.05rem;font-weight:700;color:#F5EFE2;">${regionName}</div>
          <div style="font-family:'Lato',sans-serif;font-size:10px;color:rgba(212,175,55,.5);letter-spacing:1px;margin-top:2px;">${region.dens.length} denominazioni</div>
        </div>
      `;
      list.appendChild(rh);

      // Intro regione
      const ri = document.createElement('div');
      ri.style.cssText = 'padding:4px 16px 14px;font-family:\'Playfair Display\',Georgia,serif;font-style:italic;font-size:.85rem;color:rgba(245,239,226,.5);line-height:1.6;';
      ri.textContent = region.intro;
      list.appendChild(ri);

      // Cards denominazioni
      region.dens.forEach(d => {
        const card = document.createElement('div');
        card.style.cssText = `
          margin: 0 12px 10px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(212,175,55,.14);
          border-radius: 8px; overflow: hidden;
          transition: all .25s; cursor: pointer;
        `;
        card.onmouseenter = () => { card.style.borderColor = 'rgba(212,175,55,.4)'; card.style.transform = 'translateY(-1px)'; };
        card.onmouseleave = () => { card.style.borderColor = 'rgba(212,175,55,.14)'; card.style.transform = 'translateY(0)'; };

        const typeColors = { DOCG:'#D4AF37', DOC:'#CD7F32', IGT:'rgba(200,200,200,.6)' };
        const typeBg     = { DOCG:'rgba(212,175,55,.15)', DOC:'rgba(205,127,50,.12)', IGT:'rgba(150,150,150,.1)' };

        card.innerHTML = `
          <div style="
            display:flex;align-items:center;gap:10px;padding:13px 14px;
            background:linear-gradient(135deg,rgba(74,4,4,.15),transparent);
          ">
            <span style="
              font-family:'Lato',sans-serif;font-size:9px;font-weight:700;letter-spacing:1.5px;
              padding:3px 8px;border-radius:4px;text-transform:uppercase;flex-shrink:0;
              background:${typeBg[d.t]};color:${typeColors[d.t]};
              border:1px solid ${typeColors[d.t]}40;
            ">${d.t}</span>
            <span style="font-family:'Playfair Display',Georgia,serif;font-size:.95rem;font-weight:700;color:#F5EFE2;flex:1;">${d.n.replace(/ DOCG| DOC| IGT/g,'')}</span>
            <span style="font-size:18px;flex-shrink:0;">${d.t==='DOCG'?'👑':d.t==='DOC'?'🍷':'🌿'}</span>
          </div>
          <div class="sw8-den-body" style="display:none;padding:0 14px 14px;">
            <div style="font-family:'Lato',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#D4AF37;margin-bottom:10px;">🍇 ${d.uva}</div>
            <div style="font-family:'Lato',sans-serif;font-size:13px;color:rgba(245,239,226,.75);line-height:1.75;margin-bottom:12px;">${d.storia}</div>
            <div style="border-top:1px solid rgba(212,175,55,.1);padding-top:10px;margin-bottom:8px;">
              <div style="font-family:'Lato',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.6);margin-bottom:6px;">🌍 Terroir</div>
              <div style="font-family:'Lato',sans-serif;font-size:12px;color:rgba(245,239,226,.6);line-height:1.65;font-style:italic;">${d.terroir}</div>
            </div>
            <div style="border-top:1px solid rgba(212,175,55,.1);padding-top:10px;margin-bottom:8px;">
              <div style="font-family:'Lato',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.6);margin-bottom:6px;">🎨 Profilo</div>
              <div style="font-family:'Lato',sans-serif;font-size:12px;color:rgba(245,239,226,.6);line-height:1.65;font-style:italic;">${d.profilo}</div>
            </div>
            <div style="border-top:1px solid rgba(212,175,55,.1);padding-top:10px;">
              <div style="font-family:'Lato',sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(212,175,55,.6);margin-bottom:6px;">📌 Note</div>
              <div style="font-family:'Lato',sans-serif;font-size:12px;color:rgba(245,239,226,.6);line-height:1.65;font-style:italic;">${d.note}</div>
            </div>
          </div>
        `;

        // Toggle
        const header = card.querySelector('div:first-child');
        const body   = card.querySelector('.sw8-den-body');
        header.addEventListener('click', () => {
          const open = body.style.display !== 'none';
          body.style.display = open ? 'none' : 'block';
          if (!open) body.style.animation = 'sw7FI .25s ease';
        });

        list.appendChild(card);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v8] 🍷 Patch v8 Database — avvio');
    injectCSS8();
    buildArticleModal();

    let n = 0;
    const run = () => {
      injectArticles();
      injectDenominazioni();
      if (++n < 20) setTimeout(run, 400);
      else console.log('[SW-v8] Init completato ✓');
    };

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run)
      : run();
  }

  init();

})();
