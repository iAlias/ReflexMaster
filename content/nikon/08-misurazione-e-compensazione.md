---
title: "Misurazione esposimetrica e compensazione"
description: "Matrix, spot e media pesata al centro, compenso EV e la tecnica dell'esporre a destra."
slug: misurazione-e-compensazione
order: 8
module: 1
brand: nikon
quiz:
  - question: "Ritratto in controluce contro un cielo luminoso, misurazione matrix. Cosa ottieni e come rimedi?"
    options:
      - "Volto ben esposto: nessun intervento"
      - "Volto scuro: serve una compensazione positiva di +1/+2 EV o la misurazione spot sul viso"
      - "Volto bruciato: serve una compensazione negativa"
      - "Cielo scuro e volto corretto: nessun intervento"
    correctIndex: 1
    explanation: "La matrix valuta l'intera scena dominata dal cielo e sottoespone il soggetto. Si compensa in positivo o si misura in spot direttamente sul volto."
  - question: "Che cosa misura la misurazione spot della tua Nikon?"
    options:
      - "L'intero fotogramma con pesi uguali"
      - "Un cerchio di circa 3,5 mm (il 2,5% dell'inquadratura) centrato sul punto AF selezionato"
      - "Solo le zone in ombra"
      - "La temperatura colore della scena"
    correctIndex: 1
    explanation: "Sulle Nikon la spot è legata al punto AF attivo, non necessariamente al centro: è un vantaggio operativo notevole, perché misuri esattamente dove metti a fuoco."
  - question: "In che cosa consiste la tecnica ETTR (esporre a destra)?"
    options:
      - "Spostare il soggetto sul lato destro dell'inquadratura"
      - "Esporre il più possibile verso le alte luci senza bruciarle, per massimizzare il rapporto segnale-rumore"
      - "Sottoesporre sempre di un terzo di stop per proteggere le luci"
      - "Usare la misurazione spot sul punto più chiaro della scena"
    correctIndex: 1
    explanation: "Il NEF registra molti più livelli negli stop alti: portando l'istogramma a destra senza tagliare si ottengono ombre più pulite, poi si riporta la luminosità in sviluppo."
  - question: "Con la compensazione dell'esposizione impostata a -1 EV in modalità A, cosa cambia?"
    options:
      - "L'apertura si chiude di uno stop"
      - "La fotocamera sceglie un tempo più rapido di uno stop rispetto alla misurazione"
      - "Gli ISO scendono automaticamente di uno stop"
      - "Nulla, la compensazione funziona solo in M"
    correctIndex: 1
    explanation: "In A l'apertura la decidi tu: per sottoesporre di uno stop la fotocamera accorcia il tempo. In S accadrebbe il contrario, agendo sull'apertura."
challenge:
  title: "Il cartoncino grigio e i suoi inganni"
  steps:
    - "Procurati tre superfici: una bianca (un foglio), una grigio medio (il retro di una scatola di cartone opaco va bene) e una nera (una maglietta scura)."
    - "In modalità A, f/5.6, ISO 200, riempi l'inquadratura con ciascuna superficie e scatta: osserva che tutte e tre risultano grigie nell'immagine finale."
    - "Ripeti applicando la compensazione: +1,7 EV sul bianco e -1,7 EV sul nero, poi verifica che ora bianco e nero appaiano corretti."
    - "Passa in misurazione spot e ripeti la prova su una scena mista (un volto in controluce), misurando prima sul viso e poi sullo sfondo."
    - "Annota per ciascuna prova l'istogramma risultante: è il modo più rapido per capire come l'esposimetro ragiona."
---

## Come ragiona l'esposimetro

L'esposimetro della tua Nikon non sa che cosa stai fotografando. Misura la luce riflessa dalla scena e calcola l'esposizione che renderebbe quella luminosità media pari a un grigio medio, storicamente il 18% di riflettanza. È un'ipotesi statisticamente ragionevole — la maggior parte delle scene reali si aggira su quella media — ma diventa clamorosamente sbagliata nei casi estremi.

Ecco perché una distesa di neve viene resa grigia e sporca: l'esposimetro la considera una scena troppo chiara e la scurisce. E perché un gatto nero su un divano nero viene reso grigio slavato: la scena è troppo scura per la sua ipotesi e viene schiarita. Non è un difetto della fotocamera, è il limite logico di qualunque misurazione di luce riflessa: la macchina misura la luce, non conosce il soggetto.

## Le modalità di misurazione

La tua Nikon offre tre modalità principali (quattro sui corpi superiori), selezionabili con il pulsante i o dal menu di ripresa.

**Matrix** è la predefinita: il sensore RGB dedicato analizza la scena per zone, luminosità, colore e distanza del soggetto, confrontandola con un database di scene di riferimento. Tiene conto del punto AF attivo, presumendo che lì si trovi il soggetto. È la più affidabile nell'80% delle situazioni e quella con cui lavorare per impostazione predefinita.

**Media pesata al centro** media tutto il fotogramma dando più peso a un cerchio centrale di circa 8 mm (regolabile sui corpi superiori). È prevedibile e costante, apprezzata da chi lavora in modo sistematico e vuole risultati coerenti fra uno scatto e l'altro.

**Spot** legge un cerchio di circa 3,5 mm, pari al 2,5% dell'inquadratura, e — dettaglio importante sulle Nikon — lo fa in corrispondenza del punto AF selezionato, non necessariamente al centro. È lo strumento di precisione: teatro, concerti, un volto illuminato da un faretto in una sala buia. Richiede però di sapere cosa si sta misurando: puntata sulla pelle chiara di un viso va accompagnata da circa +1 EV, perché la pelle chiara è più riflettente del grigio medio.

I corpi più recenti offrono anche la **misurazione ponderata sulle alte luci**, pensata per gli spettacoli: privilegia la protezione delle zone più chiare, evitando di bruciare i faretti sul palco.

## La compensazione dell'esposizione

La compensazione è il modo più rapido per dire alla fotocamera che la sua ipotesi è sbagliata. Sulla tua Nikon si applica tenendo premuto il pulsante con il simbolo +/- accanto al pulsante di scatto e ruotando la ghiera di comando principale; il valore compare nel mirino e sul display.

Valori di riferimento che vale la pena memorizzare: neve o spiaggia in pieno sole da +1,3 a +2 EV; sposa in abito bianco in primo piano +1 EV; scena notturna con ampie zone nere da -1 a -2 EV; concerto con faretti su fondo nero da -1,3 a -2 EV; ritratto in controluce senza flash da +1 a +2 EV. Sono punti di partenza, da verificare sull'istogramma.

Attenzione a due dettagli operativi. Primo: la compensazione resta impostata anche dopo aver spento la fotocamera, ed è una delle cause più frequenti di scatti inspiegabilmente scuri il giorno dopo; l'indicatore +/- nel mirino resta acceso proprio per ricordartelo. Secondo: in M con ISO fisso la compensazione non ha effetto sull'esposizione, perché non c'è nessun parametro che la fotocamera possa muovere; funziona invece in M con ISO auto, agendo sulla sensibilità.

## Esporre a destra (ETTR)

Il sensore registra la luce in modo lineare: il primo stop dall'alto contiene metà di tutti i livelli disponibili, il secondo un quarto, e così via. Gli stop più scuri sono descritti da pochissimi livelli, ed è lì che il rumore diventa evidente.

Da questa asimmetria nasce la tecnica dell'esporre a destra: spostare l'esposizione il più possibile verso le alte luci senza tagliarle, così che la scena occupi gli stop alti, ricchi di informazione. In sviluppo si riporta la luminosità al valore desiderato, ottenendo ombre molto più pulite di quanto si sarebbe avuto esponendo "correttamente".

In pratica: attiva le alte luci lampeggianti e l'istogramma RGB nelle opzioni di visualizzazione, compensa in positivo finché il grafico sfiora il bordo destro senza appiattirsi, verifica che nessun canale lampeggi. Ha senso solo scattando in NEF, e va abbandonato quando la scena contiene alte luci speculari che devono restare bruciate (riflessi sul metallo, il sole nell'inquadratura).

## Errori comuni

1. **Lasciare la compensazione attiva da una sessione all'altra.** Correzione: azzerala per abitudine a fine sessione, e controlla l'indicatore nel mirino prima di iniziare.
2. **Usare la spot senza sapere su cosa si misura.** Puntata su una camicia bianca sottoespone di due stop l'intera scena. Correzione: misura su un tono medio, oppure compensa in base al tono che stai misurando.
3. **Combattere il controluce con la sola compensazione.** Si salva il volto ma il fondo si brucia del tutto. Correzione: usa il fill flash o un pannello riflettente, come vedremo nel modulo 2.
4. **Applicare ETTR a un JPEG.** Il JPEG ha già la curva applicata e i margini di recupero sono minimi. Correzione: usa ETTR solo in NEF, e mai al costo di alte luci tagliate.

## Pro tip

Configura il blocco dell'esposizione (pulsante AE-L/AF-L, impostandolo su solo AE-L nel menu delle impostazioni personalizzate) e usalo come i professionisti in situazioni difficili: misuri in spot su un tono medio della scena — l'erba, una parete color sabbia, il palmo della tua mano con +1 EV — blocchi l'esposizione, ricomponi l'inquadratura e scatti. È un metodo rapidissimo che elimina l'influenza di sfondi molto chiari o molto scuri sulla misurazione.

Il secondo consiglio è di lavorare con il bracketing di esposizione (pulsante BKT o menu di ripresa) quando la scena ha un contrasto estremo: tre scatti a -2, 0 e +2 EV in raffica ti danno un margine di sicurezza immediato e, se serve, la base per una fusione HDR. In paesaggio con cielo molto più luminoso del terreno è una prassi standard, non un ripiego: costa un secondo in ripresa e salva scatti che altrimenti sarebbero irrecuperabili.
