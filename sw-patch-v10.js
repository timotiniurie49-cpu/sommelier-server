/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SOMMELIER WORLD · PATCH v10                                    ║
 * ║                                                                  ║
 * ║  ✓ WINE_DB modulare (Regione → Denominazione → Vitigno)        ║
 * ║    Aggiunta una DOCG: una riga nel file, nessun altro tocco     ║
 * ║  ✓ Tooltip "?" abbinamenti — spiegazione tecnica del sommelier  ║
 * ║    con glossario dei termini enologici                           ║
 * ║  ✓ Sezione Contatti con form e alias email                      ║
 * ║  ✓ Miglioramenti UX: Hero dinamico, pull-to-refresh articoli    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * INSTALLAZIONE in index.html prima di </body>:
 *   <script src="sw-patch-v6.js"></script>
 *   <script src="sw-patch-v9.js"></script>
 *   <script src="sw-patch-v10.js"></script>
 *
 * ─────────────────────────────────────────────────────────────────
 * COME AGGIUNGERE UNA NUOVA DENOMINAZIONE — GUIDA RAPIDA
 *
 * 1. Trova la regione giusta nel WINE_DB qui sotto
 * 2. Aggiungi un oggetto nell'array 'denominazioni':
 *
 * { nome: 'Nome Denominazione', tipo: 'DOCG', // oppure 'DOC' o 'IGT'
 *   vitigni: 'Vitigno principale (altri)',
 *   desc: 'Breve descrizione del vino — stile, profumi, terroir.' }
 *
 * Fatto. Il sito si aggiorna automaticamente.
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     ████  WINE_DB  ████
     Struttura: Regione → Array di denominazioni
     Ogni denominazione: { nome, tipo, vitigni, desc }
     ═══════════════════════════════════════════════════════════════ */
  var WINE_DB = [

    {
      regione: 'Piemonte', flag: '🏔',
      intro: 'La Borgogna italiana. 17 DOCG — più di qualsiasi altra regione del mondo. Nebbiolo, Barbera, Moscato, Dolcetto, Arneis, Ruchè, Timorasso.',
      denominazioni: [
        { nome: 'Barolo', tipo: 'DOCG', vitigni: 'Nebbiolo',
          desc: 'Il Re dei vini. Marne delle Langhe. Viola appassita, tabacco, catrame, rosa secca. Tannini monumentali. Invecchia 30–50 anni. 155 MGA codificano ogni singolo cru.' },
        { nome: 'Barbaresco', tipo: 'DOCG', vitigni: 'Nebbiolo',
          desc: 'La Regina: Nebbiolo più elegante su tufo e sabbia. MGA top: Asili, Rabajà, Martinenga. Gaja, Giacosa, Produttori del Barbaresco.' },
        { nome: 'Barbera d\'Asti', tipo: 'DOCG', vitigni: 'Barbera',
          desc: 'Il vino della gente piemontese elevato a nobile. Ciliegia, mora, acidità vivace. La sottozona Nizza DOCG è il vertice assoluto.' },
        { nome: 'Asti / Moscato d\'Asti', tipo: 'DOCG', vitigni: 'Moscato Bianco',
          desc: 'Dolce frizzante delle colline astigiane. Pesca, albicocca, fiori d\'acacia. Gradazione 5–5,5%. Diverso dall\'Asti spumante classico.' },
        { nome: 'Alta Langa', tipo: 'DOCG', vitigni: 'Pinot Nero, Chardonnay',
          desc: 'Metodo Classico piemontese d\'eccellenza. Colline alte 250–500m. Frutta bianca, crosta di pane, mineralità calcarea. Contratto, Enrico Serafino.' },
        { nome: 'Barbaresco', tipo: 'DOCG', vitigni: 'Nebbiolo',
          desc: 'La Regina: Nebbiolo più elegante su tufo e sabbia. MGA top: Asili, Rabajà, Martinenga. Gaja, Giacosa, Produttori del Barbaresco.' },
        { nome: 'Gattinara', tipo: 'DOCG', vitigni: 'Nebbiolo (Spanna)',
          desc: 'Alto Piemonte. Nebbiolo su porfido rosso vulcanico. Più austero e minerale del Barolo. Travaglini, Antoniolo.' },
        { nome: 'Gavi / Cortese di Gavi', tipo: 'DOCG', vitigni: 'Cortese',
          desc: 'Bianco elegante di Alessandria. Agrumi, mandorla, fiori bianchi. Freschezza vivace. La Scolca, Villa Sparina, Broglia.' },
        { nome: 'Roero', tipo: 'DOCG', vitigni: 'Nebbiolo, Arneis',
          desc: 'Riva sinistra del Tanaro. Nebbiolo su sabbie terziarie. L\'Arneis bianco è la gemma locale: fiori, pera, mandorla. Matteo Correggia.' },
        { nome: 'Brachetto d\'Acqui', tipo: 'DOCG', vitigni: 'Brachetto',
          desc: 'Dolce rosato frizzante. Rosa, fragola, lampone. Irresistibile. Braida (Giacomo Bologna lo ha reso famoso nel mondo).' },
        { nome: 'Dogliani', tipo: 'DOCG', vitigni: 'Dolcetto',
          desc: 'Casa storica del Dolcetto. Prugna, ciliegia nera, mandorla amara. Tannini secchi caratteristici. Einaudi, Abbona, San Fereolo.' },
        { nome: 'Erbaluce di Caluso', tipo: 'DOCG', vitigni: 'Erbaluce',
          desc: 'Bianco del Canavese. Agrumi, fiori bianchi, note minerali. Anche nella versione passita Caluso Passito di grande complessità.' },
        { nome: 'Ruché di Castagnole Monferrato', tipo: 'DOCG', vitigni: 'Ruché',
          desc: 'Il più profumato del Piemonte. Rosa selvatica, geranio, spezie. Vitigno autoctono rarissimo. Montalbera, Accornero.' },
        { nome: 'Ghemme', tipo: 'DOCG', vitigni: 'Nebbiolo, Vespolina',
          desc: 'Alto Piemonte su porfido e argille. Nebbiolo austero e minerale. Cantalupo come riferimento storico.' },
        { nome: 'Langhe', tipo: 'DOC', vitigni: 'Nebbiolo, Chardonnay, Arneis (plurivitigno)',
          desc: 'DOC ombrello delle Langhe. Permette molti vitigni. Base per i vini IGT più famosi (Sori San Lorenzo, Langhe Nebbiolo).' },
        { nome: 'Barbera d\'Alba', tipo: 'DOC', vitigni: 'Barbera',
          desc: 'Barbera nelle Langhe. Acidità croccante, frutti rossi intensi, note speziate. Giacomo Conterno, Bruno Giacosa.' },
        { nome: 'Colli Tortonesi', tipo: 'DOC', vitigni: 'Timorasso, Barbera',
          desc: 'La casa del Timorasso (Derthona). Bianco strutturato e longevo quasi estinto negli anni \'80, ora tra i più ricercati d\'Italia. Walter Massa il salvatore.' },
      ]
    },

    {
      regione: 'Toscana', flag: '🌾',
      intro: '11 DOCG, cuore del vino italiano nel mondo. Sangiovese è il re: da Firenze a Montalcino, da Bolgheri al confine umbro.',
      denominazioni: [
        { nome: 'Brunello di Montalcino', tipo: 'DOCG', vitigni: 'Sangiovese Grosso (Brunello)',
          desc: 'Ferruccio Biondi-Santi lo isolò nel 1888. Il vino italiano più longevo: 50+ anni in bottiglia. Galestro e alberese su 4 versanti diversi. Biondi-Santi, Soldera, Poggio di Sotto.' },
        { nome: 'Chianti Classico', tipo: 'DOCG', vitigni: 'Sangiovese',
          desc: 'Il Gallo Nero, tra Firenze e Siena. Bando granducale del 1716 — uno dei primi sistemi di denominazione. La Gran Selezione è il vertice. Antinori, Fèlsina, Isole e Olena.' },
        { nome: 'Chianti', tipo: 'DOCG', vitigni: 'Sangiovese',
          desc: '7 sottozone (Rufina, Colli Fiorentini…). Sangiovese fresco e versatile. Rufina è la sottozona più longeva e strutturata. Frescobaldi, Selvapiana.' },
        { nome: 'Vino Nobile di Montepulciano', tipo: 'DOCG', vitigni: 'Prugnolo Gentile',
          desc: 'Citato dal 789 d.C. "D\'ogni vino re" (Redi, 1685). Prugnolo su argille e galestro. Avignonesi, Poliziano, Boscarelli.' },
        { nome: 'Morellino di Scansano', tipo: 'DOCG', vitigni: 'Sangiovese (Morellino)',
          desc: 'Maremma toscana. Sangiovese su argille costiere. Corpo pieno, tannini rotondi. Moris Farms, Rocca di Frassinello.' },
        { nome: 'Vernaccia di San Gimignano', tipo: 'DOCG', vitigni: 'Vernaccia',
          desc: 'Prima DOC italiana (1966), poi DOCG. Tufo pliocenico di San Gimignano. Mandorla, agrumi, finale leggermente amaro. Teruzzi, Panizzi.' },
        { nome: 'Carmignano', tipo: 'DOCG', vitigni: 'Sangiovese, Cabernet Sauvignon',
          desc: 'Primo Cabernet Sauvignon documentato in Italia (1700s). Villa di Capezzana come custode storico. Sangiovese + Cabernet su suoli calcarei.' },
        { nome: 'Montecucco Sangiovese', tipo: 'DOCG', vitigni: 'Sangiovese',
          desc: 'Nuovo cru tra Montalcino e la costa. Suoli calcarei e vulcanici. Collemassari, Basile, Poggi della Quercia.' },
        { nome: 'Bolgheri / Bolgheri Sassicaia', tipo: 'DOC', vitigni: 'Cabernet Sauvignon, Merlot, Cabernet Franc',
          desc: 'La rivoluzione dei Supertuscan. Sassicaia (DOC dedicata unica in Italia), Ornellaia, Masseto. Suoli limosi e argillosi sulla costa.' },
        { nome: 'Rosso di Montalcino', tipo: 'DOC', vitigni: 'Sangiovese Grosso',
          desc: 'Il Brunello giovane: stesso territorio, affinamento più breve. Porta avanti i produttori nei millesimi difficili. Ottimo rapporto qualità-prezzo.' },
        { nome: 'Maremma Toscana', tipo: 'DOC', vitigni: 'Vermentino, Sangiovese, Syrah',
          desc: 'Ampia DOC della costa maremmana. Terroir selvaggio tra Grosseto e il mare. Rocca di Frassinello, Sassotondo.' },
      ]
    },

    {
      regione: 'Veneto', flag: '🏛',
      intro: 'Prima regione italiana per volume. Dal Lago di Garda alle Dolomiti: Amarone, Soave, Valpolicella, Prosecco Conegliano-Valdobbiadene UNESCO 2019.',
      denominazioni: [
        { nome: 'Amarone della Valpolicella', tipo: 'DOCG', vitigni: 'Corvina, Corvinone, Rondinella',
          desc: 'Appassimento 90–120 giorni in fruttai. 15–17% alcol. Ciliegia sotto spirito, cioccolato, spezie orientali. Quintarelli, Dal Forno, Masi.' },
        { nome: 'Conegliano Valdobbiadene Prosecco Superiore', tipo: 'DOCG', vitigni: 'Glera',
          desc: 'Colline UNESCO 2019. Rive e Cartizze (107 ha, cru assoluto). Metodo Charmat. Mela verde, pera, fiori bianchi. Bisol, Nino Franco, Ruggeri.' },
        { nome: 'Soave Superiore', tipo: 'DOCG', vitigni: 'Garganega, Trebbiano di Soave',
          desc: 'Basalto vulcanico nel Classico. Mandorla, fiori bianchi, mineralità. Pieropan (il pioniere qualitativo), Gini, Prà, Inama.' },
        { nome: 'Recioto della Valpolicella', tipo: 'DOCG', vitigni: 'Corvina, Corvinone',
          desc: 'Vino dolce da appassimento — l\'Amarone è un Recioto fermentato per errore fino in secco. Prugna, cioccolato, dolcezza morbida.' },
        { nome: 'Valpolicella', tipo: 'DOC', vitigni: 'Corvina, Rondinella, Molinara',
          desc: 'Versione fresca e leggera. La stessa uva dell\'Amarone: tre vini dallo stesso vigneto (Valpolicella, Ripasso, Amarone).' },
        { nome: 'Valpolicella Ripasso', tipo: 'DOC', vitigni: 'Corvina, Corvinone, Rondinella',
          desc: 'Il Valpolicella "ripassato" sulle vinacce dell\'Amarone. Struttura e complessità in mezzo tra i due. Masi Campofiorin il capostipite.' },
        { nome: 'Bardolino', tipo: 'DOC', vitigni: 'Corvina, Rondinella',
          desc: 'Sponda veronese del Lago di Garda. Leggero, fresco, ciliegia. Chiaretto tra i migliori rosati italiani. Guerrieri Rizzardi.' },
      ]
    },

    {
      regione: 'Campania', flag: '🌋',
      intro: 'La Magna Grecia del vino. Fiano, Greco e Aglianico portati dai coloni greci 2700 anni fa. 4 DOCG irpine di assoluta eccellenza.',
      denominazioni: [
        { nome: 'Taurasi', tipo: 'DOCG', vitigni: 'Aglianico',
          desc: 'Il "Barolo del Sud". Aglianico su suoli vulcanici irpini a 400–700m. Ciliegia nera, tabacco, cuoio. Acidità tagliente. Affinamento min. 3 anni. Mastroberardino.' },
        { nome: 'Fiano di Avellino', tipo: 'DOCG', vitigni: 'Fiano',
          desc: 'Plinio lo chiamò "Vitis Apiana". Miele, noce, pera Williams, fumo. Struttura minerale, longevo 10+ anni. Feudi di San Gregorio, Ciro Picariello.' },
        { nome: 'Greco di Tufo', tipo: 'DOCG', vitigni: 'Greco',
          desc: 'Il "tufo" nel nome non è vulcanico ma zolfo — le miniere di Tufo (AV). Pesca bianca, mandorla, idrocarburi. Note solfuree uniche. Benito Ferrara.' },
        { nome: 'Aglianico del Taburno', tipo: 'DOCG', vitigni: 'Aglianico',
          desc: 'Variante beneventana dell\'Aglianico. Suoli argillosi e calcarei del Taburno. Più fresca e acida del Taurasi. Cantina del Taburno.' },
        { nome: 'Falanghina del Sannio', tipo: 'DOC', vitigni: 'Falanghina',
          desc: 'Bianco campano in ascesa. Frutto tropicale, agrumi, fiori. Freschezza vivace, bevibilità immediata. Feudi di San Gregorio, Mustilli.' },
      ]
    },

    {
      regione: 'Sicilia', flag: '☀️',
      intro: 'Il vulcano, il sale africano, il sole mediterraneo. L\'Etna come nuova Borgogna. Nero d\'Avola ambasciatore. Pantelleria paradiso del passito.',
      denominazioni: [
        { nome: 'Etna', tipo: 'DOC', vitigni: 'Nerello Mascalese (rosso), Carricante (bianco)',
          desc: '133 contrade come i crus borgognoni. Viti pre-fillossera ad alberello a 400–1000m. Nerello: fragola selvatica, grafite, mineralità vulcanica. Cornelissen, Passopisciaro, Benanti.' },
        { nome: 'Cerasuolo di Vittoria', tipo: 'DOCG', vitigni: 'Nero d\'Avola, Frappato',
          desc: 'Unica DOCG siciliana. Plateau ibleo. Nero d\'Avola porta struttura, Frappato eleganza e profumo. COS, Valle dell\'Acate.' },
        { nome: 'Passito di Pantelleria', tipo: 'DOC', vitigni: 'Zibibbo (Moscato d\'Alessandria)',
          desc: 'Isola vulcanica a 70km dalla Tunisia. Alberello pantesco UNESCO. Fico secco, dattero, miele d\'arancio. Ben\'Ryé di Donnafugata il più famoso.' },
        { nome: 'Marsala', tipo: 'DOC', vitigni: 'Grillo, Catarratto, Inzolia',
          desc: 'Vino liquoroso storico con sistema Solera. Fine, Superiore, Vergine (il più secco e complesso). Florio, Pellegrino. Non solo da cucina.' },
        { nome: 'Sicilia', tipo: 'DOC', vitigni: 'Nero d\'Avola, Catarratto, Grillo, Nerello',
          desc: 'DOC regionale ampia. Nero d\'Avola ambasciatore mondiale del rosso siciliano. Donnafugata, Planeta, Tasca d\'Almerita.' },
      ]
    },

    {
      regione: 'Sardegna', flag: '🏝',
      intro: 'L\'isola fuori dal tempo. Cannonau longevo (Grenache diventato sardo), Vermentino sapido su granito, Carignano centenario su sabbia.',
      denominazioni: [
        { nome: 'Vermentino di Gallura', tipo: 'DOCG', vitigni: 'Vermentino',
          desc: 'Unica DOCG sarda per bianchi. Graniti paleozoici della Gallura. Mineralità irraggiungibile altrove. Pesca bianca, erbe aromatiche. Capichera, Surrau.' },
        { nome: 'Cannonau di Sardegna', tipo: 'DOC', vitigni: 'Cannonau (Grenache)',
          desc: 'Arrivato con gli Aragonesi nel XIV sec. Le viti centenarie di Mamoiada su granito producono vini di straordinaria concentrazione. Giuseppe Sedilesu.' },
        { nome: 'Carignano del Sulcis', tipo: 'DOC', vitigni: 'Carignano (Carignan)',
          desc: 'Viti centenarie ad alberello su sabbia pre-fillossera nel Sulcis. Mora, fico, spezie. Cantina di Santadi "Terre Brune" il riferimento.' },
        { nome: 'Vernaccia di Oristano', tipo: 'DOC', vitigni: 'Vernaccia',
          desc: 'Il vino ossidativo sardo. Invecchiamento sous flor (fiore di levito). Mandorla, curry, marzapane. Simile al Fino di Jerez. Incompreso e straordinario.' },
      ]
    },

    {
      regione: 'Puglia', flag: '🌞',
      intro: 'Il tacco dello stivale. Primitivo e Negroamaro su terre rosse ferriche. Viti centenarie tra i paesaggi più antichi d\'Italia.',
      denominazioni: [
        { nome: 'Primitivo di Manduria Dolce Naturale', tipo: 'DOCG', vitigni: 'Primitivo',
          desc: 'Il Primitivo è lo Zinfandel californiano (DNA identico). Dolce Naturale: passito straordinario da uve Primitivo appassite. Prugna, fico, cioccolato fondente.' },
        { nome: 'Primitivo di Manduria', tipo: 'DOC', vitigni: 'Primitivo',
          desc: 'Suoli argillosi rossi ferrosi del Tavoliere. 14–17% alcol, struttura imponente. Gianfranco Fino "Es" ha rivoluzionato la denominazione. Pervini, Felline.' },
        { nome: 'Salice Salentino', tipo: 'DOC', vitigni: 'Negroamaro, Malvasia Nera',
          desc: 'Negroamaro (dal greco "nero" e lat. "amaro") autoctono del Salento. Mora, prugna, tabacco. Il rosato di Negroamaro è tra i migliori italiani. Taurino, Leone de Castris.' },
        { nome: 'Castel del Monte Nero di Troia Riserva', tipo: 'DOCG', vitigni: 'Nero di Troia',
          desc: 'Nero di Troia (Uva di Troia): vitigno autoctono pugliese. Tavoliere. Struttura e longevità inaspettate. Rivera, Torrevento.' },
      ]
    },

    {
      regione: 'Toscana — Denominazioni Secondarie', flag: '🌿',
      intro: 'Oltre le grandi DOCG, la Toscana ha un mosaico di denominazioni minori di grande interesse.',
      denominazioni: [
        { nome: 'Orcia', tipo: 'DOC', vitigni: 'Sangiovese',
          desc: 'Val d\'Orcia UNESCO. Sangiovese su travertino e argille. Cotignano, Trequanda, Pienza. Podere 414, Il Colle.' },
        { nome: 'Sovana', tipo: 'DOC', vitigni: 'Sangiovese, Aleatico',
          desc: 'Colline della Maremma interna. Sangiovese e Aleatico passito. Suoli tufacei di Pitigliano. Sassotondo.' },
        { nome: 'Cortona', tipo: 'DOC', vitigni: 'Syrah, Sangiovese, Chardonnay',
          desc: 'Suoli argillosi vicino Arezzo. Syrah ha trovato qui la sua casa toscana. Stefano Amerighi e il Syrah di Cortona come rivelazione mondiale.' },
      ]
    },

    {
      regione: 'Lombardia', flag: '🏙',
      intro: '5 DOCG e oltre 20 DOC. Dalla Franciacorta spumantistica alla Valtellina verticale. La regione più ricca d\'Italia ha i suoi vini di lusso.',
      denominazioni: [
        { nome: 'Franciacorta', tipo: 'DOCG', vitigni: 'Chardonnay, Pinot Nero, Pinot Bianco',
          desc: 'Il Metodo Classico italiano che compete con lo Champagne. Morene glaciali del Lago d\'Iseo. Ca\' del Bosco, Bellavista. Il Satèn (solo uve bianche) è unico.' },
        { nome: 'Valtellina Superiore', tipo: 'DOCG', vitigni: 'Nebbiolo (Chiavennasca)',
          desc: 'Terrazzamenti verticali su granito — muri a secco medievali mantenuti a mano. 5 sottozone: Sassella, Grumello, Inferno, Valgella, Maroggia. Nino Negri, Arpepe.' },
        { nome: 'Sforzato di Valtellina', tipo: 'DOCG', vitigni: 'Nebbiolo',
          desc: 'Nebbiolo appassito in Valtellina. 14%+ di alcol da uve secche. Ciliegia sotto spirito, cioccolato. Nino Negri "5 Stelle", Plozza.' },
        { nome: 'Lugana', tipo: 'DOC', vitigni: 'Turbiana (Trebbiano di Lugana)',
          desc: 'Riva sud del Lago di Garda. Suoli argillosi glaciali ricchi di calcare. Pesca, fiori bianchi, note minerali. Ca\' dei Frati, Zenato.' },
      ]
    },

    {
      regione: 'Piemonte — Alto Piemonte', flag: '⛰',
      intro: 'Le province di Novara, Vercelli e Biella producono Nebbiolo su porfido rosso vulcanico — diverso e complementare al Barolo.',
      denominazioni: [
        { nome: 'Gattinara', tipo: 'DOCG', vitigni: 'Nebbiolo (Spanna)',
          desc: 'Porfido rosso vulcanico del Vercellese. Nebbiolo austero, minerale, longevo. Struttura nordica. Travaglini, Antoniolo.' },
        { nome: 'Ghemme', tipo: 'DOCG', vitigni: 'Nebbiolo, Vespolina',
          desc: 'Colline novaresi. Nebbiolo su terreni alluvionali con porfido. Cantalupo il riferimento storico.' },
        { nome: 'Boca', tipo: 'DOC', vitigni: 'Nebbiolo, Vespolina, Uva Rara',
          desc: 'Alto Piemonte rarissimo. Porfido e granito. Antichi Vigneti di Cantalupo, Le Piane (rinascita moderna).' },
        { nome: 'Lessona', tipo: 'DOC', vitigni: 'Nebbiolo',
          desc: 'Soli 12 ettari totali — la più piccola denominazione piemontese. Sabbie porfiriche. Sella di Lessona, storica azienda.' },
      ]
    },

    {
      regione: 'Marche', flag: '🌊',
      intro: 'Tra Appennino e Adriatico. Verdicchio maestoso, Rosso Conero potente, Lacrima profumatissima. Un repertorio autoctono straordinario.',
      denominazioni: [
        { nome: 'Verdicchio dei Castelli di Jesi', tipo: 'DOC', vitigni: 'Verdicchio',
          desc: 'Mandorla amara, agrumi, erbe. Invecchia fino a 10+ anni. La Riserva DOCG è tra i grandi bianchi italiani. Bucci, Sartarelli, Garofoli.' },
        { nome: 'Offida', tipo: 'DOCG', vitigni: 'Pecorino, Passerina',
          desc: 'Il Pecorino era quasi estinto negli anni \'80. Oggi bianco di grande struttura e sapidità. Nome dalle pecore che mangiavano l\'uva. Velenosi, Aurora.' },
        { nome: 'Conero', tipo: 'DOCG', vitigni: 'Montepulciano',
          desc: 'Monte Conero sul Adriatico. Montepulciano su calcari scoscesi vicino al mare. Umani Ronchi Cumaro, Moroder.' },
        { nome: 'Lacrima di Morro d\'Alba', tipo: 'DOC', vitigni: 'Lacrima',
          desc: 'Il vino più profumato d\'Italia. Rosa selvatica, violetta, lampone. Tannini vellutati. Vitigno autoctono rarissimo. Stefano Mancinelli.' },
      ]
    },

    {
      regione: 'Umbria', flag: '🌲',
      intro: 'Il cuore verde d\'Italia. Sagrantino di Montefalco ha i tannini più alti al mondo. Orvieto è il bianco storico dei Papi.',
      denominazioni: [
        { nome: 'Montefalco Sagrantino', tipo: 'DOCG', vitigni: 'Sagrantino',
          desc: 'Tannini più alti scientificamente misurati. Da giovane è inaccessibile, dopo 10+ anni è vellutato e profondo. 37 mesi di affinamento obbligatori. Arnaldo Caprai.' },
        { nome: 'Torgiano Rosso Riserva', tipo: 'DOCG', vitigni: 'Sangiovese',
          desc: 'Lungarotti ha creato questa DOCG con il Rubesco Riserva Vigna Monticchio. Tannini fini, longevità notevole.' },
        { nome: 'Orvieto', tipo: 'DOC', vitigni: 'Trebbiano Toscano, Grechetto',
          desc: 'La rupe di tufo etrusca. Bianco storico dei papi del Rinascimento. Grechetto con Trebbiano su tufo. Classico secco fresco e immediato.' },
      ]
    },

    {
      regione: 'Friuli-Venezia Giulia', flag: '⛰',
      intro: 'La capitale italiana del vino bianco. Collio e COF producono bianchi tra i più complessi d\'Europa. Gravner e Radikon hanno inventato i vini orange.',
      denominazioni: [
        { nome: 'Collio / Collio Goriziano', tipo: 'DOC', vitigni: 'Ribolla Gialla, Friulano, Malvasia Istriana',
          desc: 'Flysch di Cormons (marne e arenarie). Gravner e Radikon: macerazione sulle bucce in anfore georgiane — nasce il vino orange. Schiopetto, Princic i classici.' },
        { nome: 'Ramandolo', tipo: 'DOCG', vitigni: 'Verduzzo Friulano',
          desc: 'Smallest DOCG italiana (pochi ha nel comune di Nimis). Passito dolce di straordinaria eleganza. Albicocca secca, miele. Giovanni Dri il custode.' },
        { nome: 'Rosazzo', tipo: 'DOCG', vitigni: 'Friulano, Pinot Bianco, Sauvignon',
          desc: 'Abbazia di Rosazzo come centro spirituale. Friulano strutturato su flysch. Livio Felluga, Bastianich.' },
        { nome: 'Colli Orientali del Friuli', tipo: 'DOC', vitigni: 'Ribolla, Schioppettino, Refosco, Picolit',
          desc: 'Il Picolit DOCG: vino dolce rarissimo da grappoli difficili. Schioppettino vitigno autoctono quasi scomparso. Ronchi di Cialla.' },
      ]
    },

    {
      regione: 'Trentino-Alto Adige', flag: '🏔',
      intro: 'Dolomiti UNESCO, tre culture (italiana, tedesca, ladina). Metodo Classico di Ferrari, Teroldego unico, Gewürztraminer di Tramin.',
      denominazioni: [
        { nome: 'Trento', tipo: 'DOC', vitigni: 'Chardonnay, Pinot Nero',
          desc: 'Ferrari fondato nel 1902 dopo aver studiato a Épernay. Solo Metodo Classico. Freschezza alpina, mineralità calcarea. Ferrari, Rotari, Letrari.' },
        { nome: 'Teroldego Rotaliano', tipo: 'DOC', vitigni: 'Teroldego',
          desc: 'Campo Rotaliano: piana alluvionale unica al mondo per questo vitigno. Mirtillo, viola, cioccolato. Foradori (versione naturale rivoluzionaria), Mezzacorona.' },
        { nome: 'Alto Adige / Südtirol', tipo: 'DOC', vitigni: 'Lagrein, Gewürztraminer, Pinot Grigio, Riesling',
          desc: '21 sottozone. Lagrein di Bolzano (mirtillo, cioccolato). Gewürztraminer di Tramin (rosa, litchi). Cantina Terlano invecchia bianchi 10+ anni.' },
      ]
    },

    {
      regione: 'Lazio', flag: '🏛',
      intro: 'Dai Castelli Romani vulcanici a Roma. Frascati e Cesanese custodiscono una tradizione millenaria a due passi dalla Capitale.',
      denominazioni: [
        { nome: 'Frascati Superiore', tipo: 'DOCG', vitigni: 'Malvasia Bianca di Candia, Trebbiano',
          desc: 'Il vino bianco di Roma per eccellenza. Tufi vulcanici dei Castelli Romani. Fresco, floreale, minerale. Casale Marchese, Villa Simone, Poggio Le Volpi.' },
        { nome: 'Cesanese del Piglio', tipo: 'DOCG', vitigni: 'Cesanese',
          desc: 'Il grande rosso laziale da riscoprire. Colline ciociare su calcari. Tannini presenti, acidità viva, frutti rossi. Giovanna Trisorio, Coletti Conti.' },
        { nome: 'Est! Est!! Est!!! di Montefiascone', tipo: 'DOC', vitigni: 'Trebbiano Toscano, Trebbiano Giallo',
          desc: 'Il nome più famoso della viticultura laziale. Il vescovo Fugger nel 1100 mandava avanti il domestico a valutare i vini delle osterie. Fresco e immediato.' },
      ]
    },

    {
      regione: 'Abruzzo', flag: '🌊',
      intro: 'Tra Gran Sasso e Adriatico. Montepulciano e Trebbiano regnano. Valentini ed Emidio Pepe li hanno elevati a mito mondiale.',
      denominazioni: [
        { nome: 'Montepulciano d\'Abruzzo Colline Teramane', tipo: 'DOCG', vitigni: 'Montepulciano',
          desc: 'Le colline più fresche del Teramano. Rese basse e affinamento lungo. Illuminati Zanna, Tollo, Valle Reale.' },
        { nome: 'Montepulciano d\'Abruzzo', tipo: 'DOC', vitigni: 'Montepulciano',
          desc: 'Valentini di Loreto Aprutino: il mito che invecchia le bottiglie 10+ anni. Emidio Pepe fermenta a piedi. Tannini morbidi, ciliegia, prugna, violetta.' },
        { nome: 'Cerasuolo d\'Abruzzo', tipo: 'DOC', vitigni: 'Montepulciano',
          desc: 'Rosato da Montepulciano. "Cerasuolo" = color ciliegia. Tra i migliori rosati d\'Italia. Struttura da rosso, freschezza da bianco.' },
        { nome: 'Trebbiano d\'Abruzzo', tipo: 'DOC', vitigni: 'Trebbiano Abruzzese',
          desc: 'Valentini produce il bianco longevo più misterioso d\'Italia. Non è il banale Trebbiano Toscano: il Trebbiano Abruzzese invecchia 20 anni.' },
      ]
    },

    {
      regione: 'Basilicata', flag: '🌋',
      intro: 'Il vulcano spento del Vulture custodisce l\'Aglianico più minerale d\'Italia. Elena Fucci ha sorpreso il mondo negli anni 2000.',
      denominazioni: [
        { nome: 'Aglianico del Vulture Superiore', tipo: 'DOCG', vitigni: 'Aglianico',
          desc: 'Basalto vulcanico del Monte Vulture a 300–700m. Grafit vulcanica, pepe, tabacco. 5 anni di affinamento obbligatori. Elena Fucci "Titolo", Paternoster.' },
        { nome: 'Aglianico del Vulture', tipo: 'DOC', vitigni: 'Aglianico',
          desc: 'La versione più accessibile dello stesso terroir vulcanico. Re Manfredi, D\'Angelo, Grifalco.' },
      ]
    },

    {
      regione: 'Calabria', flag: '🌊',
      intro: 'La punta dello stivale. Cirò è il vino più antico d\'Italia: i Greci di Crimisa lo producevano per gli atleti olimpici 2600 anni fa.',
      denominazioni: [
        { nome: 'Cirò', tipo: 'DOC', vitigni: 'Gaglioppo, Greco Bianco',
          desc: 'Crimisa → Cirò Marina. Colonia greca VI sec. a.C. Krimisa per i vincitori olimpici. Librandi il produttore più noto e moderno. Gaglioppo su suoli argillosi.' },
        { nome: 'Greco di Bianco', tipo: 'DOC', vitigni: 'Greco',
          desc: 'Passito rarissimo di Bianco (RC). Uve appassite su stuoie. Albicocca, fico, miele di agrumi. Pochissime bottiglie. Ceratti come unico produttore di qualità.' },
      ]
    },

    {
      regione: 'Emilia-Romagna', flag: '🌾',
      intro: 'Terra di Lambrusco frizzante e Albana DOCG. La Romagna del Sangiovese, il Gutturnio piacentino completano il mosaico.',
      denominazioni: [
        { nome: 'Romagna Albana', tipo: 'DOCG', vitigni: 'Albana',
          desc: 'Prima DOCG italiana per un bianco (1987). Albana nativa del Romagnolo. Versioni secche, amabili, dolci e passito. Tre Monti, Zerbina.' },
        { nome: 'Lambrusco di Sorbara', tipo: 'DOC', vitigni: 'Lambrusco di Sorbara',
          desc: 'Il Lambrusco più elegante. Scarsa allegagione → poca uva ma concentrata. Fragola selvatica, violetta, bassa gradazione. Paltrinieri, Cleto Chiarli.' },
        { nome: 'Lambrusco Grasparossa di Castelvetro', tipo: 'DOC', vitigni: 'Lambrusco Grasparossa',
          desc: 'Il più tannico e strutturato tra i Lambrusco. Colore intenso, mora, prugna. Perfetto con il bollito misto emiliano.' },
      ]
    },

    {
      regione: 'Liguria', flag: '🌊',
      intro: 'Terrazzamenti a picco sul mare. Uve trasportate a mano o con monorotaie. Rossese e Sciacchetrà sono gioielli rarissimi del Mediterraneo.',
      denominazioni: [
        { nome: 'Cinque Terre Sciacchetrà', tipo: 'DOC', vitigni: 'Bosco, Albarola, Vermentino',
          desc: 'Il passito più raro d\'Italia. Falesie UNESCO a picco sul mare. Poche centinaia di bottiglie l\'anno. Albicocca secca, miele, sale marino.' },
        { nome: 'Rossese di Dolceacqua', tipo: 'DOC', vitigni: 'Rossese',
          desc: 'Il rosso ligure più nobile. Confine con la Francia. Rossese su schisti: elegante, fine, note di rosa e spezie. A. Maccario Dringenberg.' },
        { nome: 'Riviera Ligure di Ponente', tipo: 'DOC', vitigni: 'Vermentino, Pigato, Rossese',
          desc: 'Pigato: versione ligure del Vermentino, più grasso e morbido. Su sabbie e schisti della riviera ponente.' },
      ]
    },

    {
      regione: 'Molise', flag: '🌿',
      intro: 'La regione vinicola meno conosciuta d\'Italia. Il Tintilia riscoperto è il simbolo del rinascimento vinicolo molisano.',
      denominazioni: [
        { nome: 'Tintilia del Molise', tipo: 'DOC', vitigni: 'Tintilia',
          desc: 'Quasi estinto negli anni \'80. Riscoperto da pochi appassionati. Frutti di bosco, spezie mediterranee, acidità viva. Roberto Lombardi, Claudio Cipressi.' },
        { nome: 'Biferno', tipo: 'DOC', vitigni: 'Montepulciano, Trebbiano',
          desc: 'La più nota denominazione molisana. Suoli calcarei e argillosi. Fontezoppa, Cipressi.' },
      ]
    },

    {
      regione: 'Valle d\'Aosta', flag: '🏔',
      intro: 'La più piccola denominazione d\'Italia. Vigneti a 300–1200m ai piedi del Monte Bianco. Vitigni alpini rarissimi in Europa.',
      denominazioni: [
        { nome: 'Valle d\'Aosta / Vallée d\'Aoste', tipo: 'DOC', vitigni: 'Petit Rouge, Fumin, Petite Arvine, Prié Blanc',
          desc: 'Una sola DOC per tutta la regione con 8 sottozone. Blanc de Morgex (Prié Blanc a 900–1200m) il più alto d\'Europa. Grosjean, Anselmet, Institut Agricole.' },
      ]
    },

  ]; // fine WINE_DB


  /* ═══════════════════════════════════════════════════════════════
     GLOSSARIO ENOLOGICO — termini usati nelle spiegazioni ?
     ═══════════════════════════════════════════════════════════════ */
  var GLOSSARIO = {
    'tannini': 'I tannini sono composti fenolici presenti nella buccia, semi e legno. In bocca danno la sensazione di "secchezza" tipica dei vini rossi strutturati. Reagiscono con le proteine della carne, ecco perché il rosso tannico e la carne rossa si sposano bene.',
    'acidità': 'L\'acidità è la freschezza del vino — la sensazione di salivazione che senti ai lati della lingua. Alta acidità (Barolo, Nebbiolo, Sangiovese) "taglia" i piatti grassi e rende il vino abbinabile a molti cibi.',
    'struttura': 'Con struttura si intende la "consistenza" del vino in bocca — il corpo, la densità. Un vino strutturato ha tannini presenti, alcol medio-alto, estratto secco elevato. Un piatto strutturato (brasato, selvaggina) vuole un vino strutturato.',
    'morbidezza': 'La morbidezza è la sensazione setosa e rotonda in bocca — opposta alla durezza dei tannini. È data da alcol, glicerina e residuo zuccherino. I vini morbidi (Amarone, Valpolicella Ripasso) si abbinano bene a carni grasse e formaggi stagionati.',
    'sapidità': 'La sapidità è la sensazione di "sale" in bocca, tipica di vini con alto contenuto di sali minerali (Vermentino, Greco di Tufo, bianchi costieri). Un vino sapido è perfetto con il pesce e i frutti di mare.',
    'complessità': 'Un vino complesso offre molti aromi e sfumature diverse che cambiano nel bicchiere nel tempo (prima il frutto, poi le spezie, poi la nota balsamica). La complessità si costruisce con anni di affinamento in legno e/o bottiglia.',
    'persistenza': 'La persistenza è la durata delle sensazioni gustative dopo aver deglutito il vino. Si misura in secondi (PAI, Persistenza Aromatica Intensa). Un grande vino ha 12–15+ secondi di persistenza.',
    'mineralità': 'La mineralità è una sensazione difficile da definire — ricorda pietra bagnata, gesso, grafite, iodio. È data dai sali minerali del suolo. Vini su granito (Vermentino di Gallura), basalto (Etna), kimmeridgiano (Chablis) hanno mineralità spiccata.',
  };


  /* ═══════════════════════════════════════════════════════════════
     ABBINAMENTI TECNICI — spiegazioni ? per ogni tipo di piatto
     ═══════════════════════════════════════════════════════════════ */
  var ABBINAMENTI_TECH = {

    'carne rossa': {
      vino: 'Barolo, Barbaresco, Brunello di Montalcino, Amarone',
      spiegazione: 'I tannini potenti del Nebbiolo e del Sangiovese reagiscono con le proteine delle carni rosse, "pulendo" il palato dalla grassezza. Il rapporto è chimico: i polifenoli del vino si legano alle proteine della carne formando un complesso gustativo equilibrato. L\'alta acidità del Barolo poi "taglia" il grasso, rendendo ogni boccone fresco come il primo.',
      termine: 'tannini',
    },

    'pesce grasso': {
      vino: 'Vermentino di Gallura, Greco di Tufo, Chablis, Vernaccia di San Gimignano',
      spiegazione: 'Il pesce grasso (salmone, anguilla, orata al forno) ha bisogno di un vino con alta acidità e sapidità per bilanciare la grassezza. Il Vermentino di Gallura — minerale su granito — "mima" l\'ambiente marino del pesce stesso. La sapidità del vino richiama il sale del mare.',
      termine: 'sapidità',
    },

    'pesce delicato': {
      vino: 'Vermentino leggero, Lugana, Frascati, Soave Classico',
      spiegazione: 'Un pesce delicato (branzino, sogliola, merluzzo) ha aromi fragili che un vino strutturato coprirebbe completamente. La regola è la concordanza: un piatto leggero vuole un vino leggero. L\'acidità del bianco esalta il sapore del pesce senza sopraffarlo.',
      termine: 'acidità',
    },

    'formaggi stagionati': {
      vino: 'Amarone, Barolo Riserva, Sagrantino, Sforzato di Valtellina',
      spiegazione: 'I formaggi stagionati (Parmigiano, Pecorino stagionato, Grana Padano) hanno grassezza intensa, proteine concentrate e note umami. Un vino molto strutturato con tannini potenti e acidità alta "contrasta" questa ricchezza, pulendo il palato e preparandolo al boccone successivo. È l\'abbinamento per contrasto più classico.',
      termine: 'struttura',
    },

    'formaggi freschi': {
      vino: 'Soave, Vermentino, Vernaccia, Pinot Grigio',
      spiegazione: 'I formaggi freschi (Mozzarella, Stracchino, Robiola) hanno delicatezza e cremosità. Un vino bianco fresco e leggero completa senza coprire. La lattosità del formaggio si sposa con la freschezza del vino in un abbinamento per concordanza.',
      termine: 'morbidezza',
    },

    'dessert al cioccolato': {
      vino: 'Amarone, Recioto della Valpolicella, Passito di Pantelleria, Moscato d\'Asti',
      spiegazione: 'La regola aurea: il dolce non può abbinarsi con un vino secco (il contrasto fa sembrare il vino "acido"). Il Recioto ha la dolcezza per "reggere" il cioccolato, mentre i suoi tannini dialogano con l\'amarezza del cacao. Regola generale: il vino deve essere almeno altrettanto dolce del dessert.',
      termine: 'morbidezza',
    },

    'pasta al pomodoro': {
      vino: 'Chianti Classico, Montepulciano d\'Abruzzo, Barbera d\'Asti',
      spiegazione: 'L\'acidità del pomodoro "chiama" un vino con acidità altrettanto vivace — altrimenti il vino sembra piatto per contrasto. Il Chianti Classico (Sangiovese) e il Montepulciano hanno un\'acidità naturale alta che si armonizza con quella del pomodoro. La regola della "concordanza di acidità".',
      termine: 'acidità',
    },

    'pasta al tartufo bianco': {
      vino: 'Barolo, Barbaresco, Langhe Nebbiolo',
      spiegazione: 'Il Tartufo Bianco d\'Alba e il Nebbiolo delle Langhe crescono a pochi chilometri di distanza. Il grande abbinamento regionale: la terra del tartufo e la terra del Barolo si fondono. Gli aromi terziari del Barolo (tabacco, cuoio, foglie secche) rispecchiano i profumi terragni del tartufo. La regola della regionalità.',
      termine: 'complessità',
    },

    'seafood crudi': {
      vino: 'Vermentino di Gallura, Greco di Tufo, Fiano di Avellino, Chablis',
      spiegazione: 'Ostriche, gamberi, scampi crudi hanno salinità naturale del mare e una texture delicata. Il Vermentino di Gallura su granito ha mineralità "marina" che echeggia il sapore degli shellfish. La salinità del vino amplifica quella del mare, creando un effetto di totale armonia. La regola della terroir-concordanza.',
      termine: 'mineralità',
    },

    'risotto': {
      vino: 'Gavi, Soave Superiore, Verdicchio dei Castelli di Jesi, Franciacorta (per i più cremosi)',
      spiegazione: 'Il risotto ha struttura cremosa data dall\'amido e dal burro. Un bianco strutturato con freschezza bilancia la grassezza. Il Gavi (Cortese) e il Soave hanno la struttura per reggere il piatto. Per un risotto ai funghi: Barolo giovane o Langhe Nebbiolo per l\'abbinamento umami-terra.',
      termine: 'struttura',
    },

    'pizza': {
      vino: 'Fiano di Avellino, Falanghina, Aglianico del Vulture, Birra (alternativa)',
      spiegazione: 'La pizza napoletana — pomodoro, mozzarella, basilico — vuole vini campani per la regola della regionalità. La Falanghina fresca "taglia" la mozzarella, mentre il Fiano più strutturato reggere bene le varianti più elaborate. Un Aglianico più leggero per le pizze rosse intense.',
      termine: 'acidità',
    },

    'selvaggina': {
      vino: 'Barolo Riserva, Sforzato di Valtellina, Sagrantino di Montefalco, Cannonau di Sardegna',
      spiegazione: 'La selvaggina (cinghiale, cervo, fagiano) ha proteine dense e sapori intensi di "selvatico". Servono vini con molti tannini per reagire con queste proteine e acidità alta per pulire il palato. Il Sagrantino — con i tannini più alti al mondo — è l\'abbinamento teoricamente perfetto. La potenza risponde alla potenza.',
      termine: 'tannini',
    },

    'baccalà mantecato': {
      vino: 'Soave Superiore, Lugana, Verdicchio di Matelica, Garganega',
      spiegazione: 'Il baccalà mantecato veneziano è ricco di grassezza (olio d\'oliva emulsionato) e sapidità marina. Un bianco strutturato e con buona acidità "taglia" la grassezza e amplifica la sapidità del merluzzo. Il Soave Superiore su basalto è l\'abbinamento veneto tradizionale per eccellenza.',
      termine: 'acidità',
    },

  };


  /* ═══════════════════════════════════════════════════════════════
     CSS v10
     ═══════════════════════════════════════════════════════════════ */
  function injectCSS10() {
    if (document.querySelector('#sw10-css')) return;
    var s = document.createElement('style');
    s.id = 'sw10-css';
    s.textContent = [

      /* ─ Tooltip ? abbinamenti ─ */
      '.sw10-q{display:inline-flex;align-items:center;justify-content:center;',
      'width:18px;height:18px;border-radius:50%;',
      'background:rgba(212,175,55,.18);border:1px solid rgba(212,175,55,.4);',
      'color:#D4AF37;font-size:10px;font-weight:700;cursor:pointer;',
      'vertical-align:middle;margin-left:6px;flex-shrink:0;',
      'transition:background .2s,transform .2s;line-height:1;}',
      '.sw10-q:hover{background:rgba(212,175,55,.35);transform:scale(1.15);}',

      '#sw10-tip{display:none;position:fixed;z-index:999995;',
      'max-width:min(380px,90vw);',
      'background:#1a1108;border:1px solid rgba(212,175,55,.35);',
      'border-radius:10px;padding:16px;',
      'box-shadow:0 8px 40px rgba(0,0,0,.7);',
      'animation:sw10ti .2s ease;}',
      '@keyframes sw10ti{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
      '#sw10-tip-close{position:absolute;top:8px;right:10px;',
      'color:rgba(212,175,55,.5);font-size:16px;cursor:pointer;',
      'width:24px;height:24px;display:flex;align-items:center;justify-content:center;}',
      '#sw10-tip-close:hover{color:#D4AF37;}',
      '#sw10-tip-vino{font-size:9px;font-weight:700;letter-spacing:2px;',
      'text-transform:uppercase;color:#D4AF37;margin-bottom:6px;}',
      '#sw10-tip-spiega{font-size:13px;color:rgba(245,239,226,.8);',
      'line-height:1.7;margin-bottom:10px;}',
      '#sw10-tip-termine{font-size:11px;color:rgba(245,239,226,.5);',
      'border-top:1px solid rgba(212,175,55,.15);padding-top:8px;',
      'line-height:1.6;font-style:italic;}',
      '#sw10-tip-termine strong{color:rgba(212,175,55,.7);font-style:normal;}',

      /* ─ Sezione WINE_DB nella pagina Denominazioni ─ */
      '#sw10-winedb{background:#0A0705;}',
      '.sw10-regione-hdr{',
      'padding:16px 14px 5px;display:flex;align-items:center;gap:10px;',
      'border-top:1px solid rgba(212,175,55,.1);cursor:pointer;',
      'transition:background .2s;}',
      '.sw10-regione-hdr:hover{background:rgba(212,175,55,.04);}',
      '.sw10-regione-badge{',
      'width:34px;height:34px;border-radius:50%;',
      'background:rgba(74,4,4,.35);border:1px solid rgba(212,175,55,.2);',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:17px;flex-shrink:0;}',
      '.sw10-den-row{',
      'padding:6px 14px;display:flex;align-items:flex-start;gap:8px;',
      'border-bottom:1px solid rgba(212,175,55,.05);}',
      '.sw10-den-row:last-child{border-bottom:none;}',
      '.sw10-den-badge{',
      'font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;',
      'flex-shrink:0;letter-spacing:1px;margin-top:2px;}',
      '.sw10-den-badge.DOCG{',
      'background:rgba(212,175,55,.12);color:#D4AF37;',
      'border:1px solid rgba(212,175,55,.25);}',
      '.sw10-den-badge.DOC{',
      'background:rgba(205,127,50,.1);color:#CD7F32;',
      'border:1px solid rgba(205,127,50,.2);}',
      '.sw10-den-badge.IGT{',
      'background:rgba(150,150,150,.1);color:rgba(200,200,200,.5);',
      'border:1px solid rgba(200,200,200,.15);}',
      '.sw10-den-info{flex:1;}',
      '.sw10-den-nome{font-size:13px;color:#F5EFE2;margin-bottom:2px;}',
      '.sw10-den-uva{font-size:10px;color:#D4AF37;letter-spacing:.5px;margin-bottom:2px;}',
      '.sw10-den-desc{font-size:11px;color:rgba(245,239,226,.5);',
      'line-height:1.6;font-style:italic;display:none;}',
      '.sw10-den-row:hover .sw10-den-desc{display:block;}',
      '.sw10-den-row:hover{background:rgba(212,175,55,.03);}',

      /* ─ Sezione Contatti ─ */
      '#sw10-contact{background:#0A0705;padding:0 0 40px;}',
      '#sw10-contact-inner{max-width:600px;margin:0 auto;padding:24px 16px 0;}',
      '.sw10-form-group{margin-bottom:14px;}',
      '.sw10-form-label{',
      'font-size:9px;font-weight:700;letter-spacing:2px;',
      'text-transform:uppercase;color:rgba(212,175,55,.55);',
      'display:block;margin-bottom:5px;}',
      '.sw10-form-input,.sw10-form-textarea{',
      'width:100%;padding:10px 12px;',
      'background:rgba(255,255,255,.05);',
      'border:1px solid rgba(212,175,55,.2);',
      'border-radius:8px;',
      'color:#F5EFE2;font-size:15px;',
      'font-family:\'Lato\',sans-serif;',
      'box-sizing:border-box;',
      'transition:border-color .2s;resize:none;}',
      '.sw10-form-input:focus,.sw10-form-textarea:focus{',
      'border-color:rgba(212,175,55,.55);',
      'outline:none;',
      'background:rgba(255,255,255,.07);}',
      '.sw10-form-textarea{height:110px;}',
      '.sw10-form-submit{',
      'width:100%;padding:13px;',
      'background:rgba(212,175,55,.15);',
      'border:1px solid rgba(212,175,55,.4);',
      'border-radius:8px;',
      'color:#D4AF37;',
      'font-family:\'Lato\',sans-serif;',
      'font-size:11px;font-weight:700;letter-spacing:3px;',
      'text-transform:uppercase;cursor:pointer;',
      'transition:all .22s;margin-top:6px;}',
      '.sw10-form-submit:hover{',
      'background:rgba(212,175,55,.25);',
      'border-color:#D4AF37;',
      'transform:translateY(-1px);}',
      '.sw10-contact-alt{',
      'text-align:center;margin-top:18px;',
      'font-size:12px;color:rgba(245,239,226,.4);',
      'line-height:1.8;}',
      '.sw10-contact-alt a{color:rgba(212,175,55,.6);text-decoration:none;}',
      '.sw10-contact-alt a:hover{color:#D4AF37;}',
      '#sw10-form-ok{',
      'display:none;text-align:center;padding:20px;',
      'color:#D4AF37;font-family:\'Playfair Display\',Georgia,serif;',
      'font-size:1.1rem;}',

    ].join('');
    document.head.appendChild(s);
  }


  /* ═══════════════════════════════════════════════════════════════
     TOOLTIP ABBINAMENTI
     ═══════════════════════════════════════════════════════════════ */
  function buildTipLayer() {
    if (document.querySelector('#sw10-tip')) return;
    var tip = document.createElement('div');
    tip.id = 'sw10-tip';
    tip.innerHTML =
      '<div id="sw10-tip-close" onclick="document.querySelector(\'#sw10-tip\').style.display=\'none\'">✕</div>' +
      '<div id="sw10-tip-vino"></div>' +
      '<div id="sw10-tip-spiega"></div>' +
      '<div id="sw10-tip-termine"></div>';
    document.body.appendChild(tip);
    document.addEventListener('click', function(e) {
      var tip = document.querySelector('#sw10-tip');
      if (tip && !tip.contains(e.target) && !e.target.classList.contains('sw10-q')) {
        tip.style.display = 'none';
      }
    });
  }

  function showTip(el, key) {
    buildTipLayer();
    var data = ABBINAMENTI_TECH[key];
    if (!data) return;
    var tip = document.querySelector('#sw10-tip');
    document.querySelector('#sw10-tip-vino').textContent = '🍷 Abbinamento consigliato: ' + data.vino;
    document.querySelector('#sw10-tip-spiega').textContent = data.spiegazione;
    var gloss = GLOSSARIO[data.termine] || '';
    document.querySelector('#sw10-tip-termine').innerHTML =
      gloss ? '<strong>📖 ' + data.termine.charAt(0).toUpperCase() + data.termine.slice(1) + ':</strong> ' + gloss : '';
    // Posiziona vicino al bottone
    var rect = el.getBoundingClientRect();
    tip.style.display = 'block';
    var top = rect.bottom + 8 + window.scrollY;
    var left = Math.min(rect.left, window.innerWidth - 400);
    left = Math.max(left, 8);
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
  }

  /* Aggiunge bottoni ? all'output del sommelier */
  function patchSommelierOutput() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(n) {
          if (n.nodeType !== 1) return;
          // Cerca dentro i risultati del sommelier
          var paras = n.querySelectorAll ? n.querySelectorAll('p,div') : [];
          paras.forEach(function(p) {
            if (p.dataset.sw10) return;
            var text = p.textContent.toLowerCase();
            Object.keys(ABBINAMENTI_TECH).forEach(function(key) {
              if (text.indexOf(key) !== -1 && !p.querySelector('.sw10-q')) {
                p.dataset.sw10 = '1';
                var btn = document.createElement('span');
                btn.className = 'sw10-q';
                btn.textContent = '?';
                btn.title = 'Perché questo abbinamento?';
                btn.addEventListener('click', function(e) {
                  e.stopPropagation();
                  showTip(btn, key);
                });
                p.appendChild(btn);
              }
            });
          });
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* Aggiunge ? statici alla sezione sommelier esistente */
  function addStaticQButtons() {
    var somPage = document.querySelector('#page-sommelier');
    if (!somPage || somPage.dataset.sw10q) return;
    somPage.dataset.sw10q = '1';

    // Cerca area output risultati
    var outputEl = somPage.querySelector('#abbResult, #result, .result, .abb-output, #outputArea');
    if (outputEl) {
      var obs = new MutationObserver(function() {
        var text = outputEl.textContent.toLowerCase();
        Object.keys(ABBINAMENTI_TECH).forEach(function(key) {
          if (text.indexOf(key) !== -1) {
            // Check se il bottone ? è già presente
            var existing = outputEl.querySelectorAll('.sw10-q[data-key="' + key + '"]');
            if (existing.length === 0) {
              var btn = document.createElement('span');
              btn.className = 'sw10-q';
              btn.dataset.key = key;
              btn.textContent = '?';
              btn.title = 'Perché ' + key + '?';
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                showTip(btn, key);
              });
              outputEl.appendChild(btn);
            }
          }
        });
      });
      obs.observe(outputEl, { childList: true, subtree: true, characterData: true });
    }
  }


  /* ═══════════════════════════════════════════════════════════════
     SEZIONE WINE_DB nella pagina Denominazioni (Explore)
     ═══════════════════════════════════════════════════════════════ */
  function injectWineDB() {
    var page = document.querySelector('#page-explore');
    if (!page || document.querySelector('#sw10-winedb')) return;

    // Nascondi vecchie sezioni denomination
    ['#sw9-den', '#sw8-den', '#sw7-italia'].forEach(function(sel) {
      var el = document.querySelector(sel);
      if (el) el.style.display = 'none';
    });

    var sec = document.createElement('div');
    sec.id = 'sw10-winedb';

    // Hero
    sec.innerHTML =
      '<div style="position:relative;height:140px;overflow:hidden;">' +
        '<img src="https://images.pexels.com/photos/442116/pexels-photo-442116.jpeg?auto=compress&cs=tinysrgb&w=900&h=400&dpr=1"' +
        ' style="width:100%;height:100%;object-fit:cover;filter:brightness(.45) saturate(1.2);" loading="lazy" alt="Vigne Italia">' +
        '<div style="position:absolute;inset:0;background:linear-gradient(rgba(74,4,4,.25),rgba(10,7,5,.88));' +
          'display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:16px;">' +
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.7);text-transform:uppercase;margin-bottom:4px;">📚 WINE_DB UFFICIALE</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.25rem;font-weight:700;color:#fff;">Denominazioni d\'Italia</div>' +
          '<div style="font-size:11px;color:rgba(245,239,226,.45);margin-top:4px;">Passa sopra ogni denominazione per leggere la descrizione</div>' +
        '</div>' +
      '</div>';

    // Nav pills regioni
    var nav = document.createElement('div');
    nav.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;padding:12px;' +
      'border-bottom:1px solid rgba(212,175,55,.1);' +
      'position:sticky;top:54px;z-index:50;' +
      'background:rgba(10,7,5,.97);backdrop-filter:blur(8px);';

    var allBtn = document.createElement('div');
    allBtn.className = 'sw9-rb sw9-ra';
    allBtn.textContent = '🌍 Tutte';
    allBtn.dataset.r = 'all';
    nav.appendChild(allBtn);

    WINE_DB.forEach(function(r) {
      var btn = document.createElement('div');
      btn.className = 'sw9-rb';
      btn.textContent = r.flag + ' ' + r.regione.split(' —')[0];
      btn.dataset.r = r.regione;
      nav.appendChild(btn);
    });
    sec.appendChild(nav);

    var list = document.createElement('div');
    list.id = 'sw10-winedb-list';
    sec.appendChild(list);

    var header = page.querySelector('div:first-child');
    if (header && header.nextSibling) {
      page.insertBefore(sec, header.nextSibling);
    } else {
      page.appendChild(sec);
    }

    renderWineDB('all');

    nav.querySelectorAll('.sw9-rb').forEach(function(btn) {
      btn.addEventListener('click', function() {
        nav.querySelectorAll('.sw9-rb').forEach(function(b) { b.classList.remove('sw9-ra'); });
        btn.classList.add('sw9-ra');
        renderWineDB(btn.dataset.r);
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    console.log('[SW-v10] WINE_DB injected ✓ —', WINE_DB.length, 'regioni,',
      WINE_DB.reduce(function(t, r) { return t + r.denominazioni.length; }, 0), 'denominazioni');
  }

  function renderWineDB(filter) {
    var list = document.querySelector('#sw10-winedb-list');
    if (!list) return;
    list.innerHTML = '';

    var regions = filter === 'all'
      ? WINE_DB
      : WINE_DB.filter(function(r) { return r.regione === filter; });

    regions.forEach(function(r) {
      // Header regione
      var rh = document.createElement('div');
      rh.className = 'sw10-regione-hdr';
      rh.innerHTML =
        '<div class="sw10-regione-badge">' + r.flag + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1rem;font-weight:700;color:#F5EFE2;">' + r.regione + '</div>' +
          '<div style="font-size:9px;color:rgba(212,175,55,.4);letter-spacing:1px;margin-top:1px;">' +
            r.denominazioni.filter(function(d) { return d.tipo === 'DOCG'; }).length + ' DOCG · ' +
            r.denominazioni.filter(function(d) { return d.tipo === 'DOC'; }).length + ' DOC' +
          '</div>' +
        '</div>' +
        '<div style="font-size:18px;color:rgba(212,175,55,.3);">›</div>';
      list.appendChild(rh);

      // Intro regione
      if (r.intro) {
        var ri = document.createElement('div');
        ri.style.cssText = 'padding:2px 14px 10px;font-family:\'Playfair Display\',Georgia,serif;' +
          'font-style:italic;font-size:.8rem;color:rgba(245,239,226,.4);line-height:1.6;';
        ri.textContent = r.intro;
        list.appendChild(ri);
      }

      // Denominazioni
      var container = document.createElement('div');
      container.style.cssText = 'padding:0 12px 8px;';
      r.denominazioni.forEach(function(d) {
        var row = document.createElement('div');
        row.className = 'sw10-den-row';
        row.innerHTML =
          '<div class="sw10-den-badge ' + d.tipo + '">' + d.tipo + '</div>' +
          '<div class="sw10-den-info">' +
            '<div class="sw10-den-nome">' + (d.tipo === 'DOCG' ? '👑 ' : '🍷 ') + d.nome + '</div>' +
            '<div class="sw10-den-uva">🍇 ' + d.vitigni + '</div>' +
            '<div class="sw10-den-desc">' + d.desc + '</div>' +
          '</div>';
        container.appendChild(row);
      });
      list.appendChild(container);

      var sp = document.createElement('div');
      sp.style.height = '6px';
      list.appendChild(sp);
    });
  }


  /* ═══════════════════════════════════════════════════════════════
     SEZIONE CONTATTI
     ═══════════════════════════════════════════════════════════════ */
  function injectContact() {
    if (document.querySelector('#sw10-contact')) return;

    // Cerca la pagina About o crea un tab Contatti
    var aboutPage = document.querySelector('#page-about, #page-contact, [data-page="about"]');

    var sec = document.createElement('div');
    sec.id = 'sw10-contact';
    sec.innerHTML =
      '<div id="sw10-contact-inner">' +

        // Header
        '<div style="text-align:center;padding:20px 0 18px;">' +
          '<div style="font-size:9px;font-weight:700;letter-spacing:3px;color:rgba(212,175,55,.5);text-transform:uppercase;margin-bottom:6px;">✉️ CONTATTI</div>' +
          '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.3rem;font-weight:700;color:#F5EFE2;">Scrivici</div>' +
          '<div style="font-size:12px;color:rgba(245,239,226,.45);margin-top:6px;line-height:1.7;">' +
            'Domande, collaborazioni con produttori, segnalazione di errori nel database.<br>' +
            'Risponderemo entro 48 ore.' +
          '</div>' +
        '</div>' +

        // Form
        '<div id="sw10-form-ok">✓ Messaggio inviato! Risponderemo presto.</div>' +
        '<form id="sw10-form" onsubmit="return false;">' +

          '<div class="sw10-form-group">' +
            '<label class="sw10-form-label">Nome</label>' +
            '<input class="sw10-form-input" id="sw10-fname" type="text" placeholder="Il tuo nome" autocomplete="name">' +
          '</div>' +

          '<div class="sw10-form-group">' +
            '<label class="sw10-form-label">Email</label>' +
            '<input class="sw10-form-input" id="sw10-femail" type="email" placeholder="la.tua@email.com" autocomplete="email">' +
          '</div>' +

          '<div class="sw10-form-group">' +
            '<label class="sw10-form-label">Argomento</label>' +
            '<select class="sw10-form-input" id="sw10-fsubject" style="appearance:none;cursor:pointer;">' +
              '<option value="">— Seleziona —</option>' +
              '<option value="produttore">Sono un produttore / cantina</option>' +
              '<option value="sommelier">Collaborazione come sommelier</option>' +
              '<option value="errore">Segnalazione errore nel database</option>' +
              '<option value="partnership">Partnership / pubblicità</option>' +
              '<option value="altro">Altro</option>' +
            '</select>' +
          '</div>' +

          '<div class="sw10-form-group">' +
            '<label class="sw10-form-label">Messaggio</label>' +
            '<textarea class="sw10-form-textarea" id="sw10-fmsg" placeholder="Scrivi qui il tuo messaggio..."></textarea>' +
          '</div>' +

          '<button class="sw10-form-submit" onclick="window._sw10Send && window._sw10Send()">✦ INVIA MESSAGGIO ✦</button>' +

        '</form>' +

        // Contatti diretti
        '<div class="sw10-contact-alt">' +
          'Oppure scrivici direttamente a<br>' +
          '<a href="mailto:info@sommelierworld.vin">info@sommelierworld.vin</a>' +
          '<br><br>' +
          '<span style="font-size:10px;">Sommelier World · sommelierworld.vin<br>' +
          'Per produttori: listing gratuito nella directory, piani premium disponibili.</span>' +
        '</div>' +

      '</div>';

    // Logica di invio (mailto fallback — il server può gestirlo)
    window._sw10Send = function() {
      var name = document.querySelector('#sw10-fname').value.trim();
      var email = document.querySelector('#sw10-femail').value.trim();
      var subject = document.querySelector('#sw10-fsubject').value;
      var msg = document.querySelector('#sw10-fmsg').value.trim();

      if (!name || !email || !msg) {
        alert('Per favore compila tutti i campi obbligatori.');
        return;
      }

      // Apre mailto come fallback
      var body = encodeURIComponent('Da: ' + name + '\nEmail: ' + email + '\nArgomento: ' + subject + '\n\n' + msg);
      window.location.href = 'mailto:info@sommelierworld.vin?subject=' + encodeURIComponent('[SW] ' + (subject || 'Messaggio')) + '&body=' + body;

      // Mostra conferma
      document.querySelector('#sw10-form').style.display = 'none';
      document.querySelector('#sw10-form-ok').style.display = 'block';
    };

    // Aggiungi come sezione finale nella home o in explore
    if (aboutPage) {
      aboutPage.appendChild(sec);
    } else {
      // Aggiungi alla fine della pagina home
      var homeBody = document.querySelector('#page-home .home-body');
      if (homeBody) homeBody.appendChild(sec);
      else document.querySelector('#page-home') && document.querySelector('#page-home').appendChild(sec);
    }

    console.log('[SW-v10] Contatti ok ✓');
  }


  /* ═══════════════════════════════════════════════════════════════
     BOTTONE CONTATTI NEL NAV
     ═══════════════════════════════════════════════════════════════ */
  function addContactTab() {
    var nav = document.querySelector('.tabs, .nav-tabs, .bottom-nav, nav');
    if (!nav || document.querySelector('[data-sw10-ctab]')) return;

    // Aggiunge voce nel menu se non esiste già
    var tabs = nav.querySelectorAll('.ntab');
    if (tabs.length === 0) return;

    var last = tabs[tabs.length - 1];
    if (last && !document.querySelector('.ntab[data-page="contact"]')) {
      var btn = document.createElement('div');
      btn.className = 'ntab';
      btn.dataset.page = 'contact';
      btn.dataset.sw10Ctab = '1';
      btn.innerHTML = '<span class="ico">✉️</span><span class="lbl">Contatti</span>';
      btn.addEventListener('click', function() {
        var contact = document.querySelector('#sw10-contact');
        if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      last.parentNode.insertBefore(btn, last.nextSibling);
    }
  }


  /* ═══════════════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════════════ */
  function init() {
    console.log('[SW-v10] Patch v10 — WINE_DB + Tooltip + Contatti — avvio');

    injectCSS10();
    buildTipLayer();
    patchSommelierOutput();

    var n = 0;
    function run() {
      injectWineDB();
      injectContact();
      addStaticQButtons();
      addContactTab();
      if (++n < 20) setTimeout(run, 400);
      else console.log('[SW-v10] Init completato ✓');
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', run)
      : run();
  }

  init();

})();
