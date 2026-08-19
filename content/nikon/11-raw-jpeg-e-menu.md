---
title: "RAW, JPEG e configurazione del menu"
description: "Formati file, spazio colore e le impostazioni di menu da sistemare una volta per tutte sulla tua Nikon."
slug: raw-jpeg-e-menu
order: 11
module: 1
brand: nikon
quiz:
  - question: "Qual è la differenza sostanziale fra un file NEF e un JPEG prodotti dalla stessa fotocamera?"
    options:
      - "Il NEF ha più megapixel"
      - "Il NEF conserva i dati grezzi del sensore, il JPEG ha già elaborazione e compressione irreversibili"
      - "Il JPEG è più nitido perché non compresso"
      - "Il NEF si può aprire solo con software Nikon"
    correctIndex: 1
    explanation: "Il NEF contiene i dati del sensore con 12-14 bit per canale e nessuna scelta creativa definitiva; il JPEG è un'immagine a 8 bit già sviluppata, con bilanciamento, contrasto e nitidezza applicati in modo irreversibile."
  - question: "Quanti livelli di luminosità per canale registra un NEF a 14 bit rispetto a un JPEG a 8 bit?"
    options:
      - "256 contro 16384"
      - "16384 contro 256"
      - "1024 contro 512"
      - "Sono identici, cambia solo il peso del file"
    correctIndex: 1
    explanation: "14 bit significano 16384 livelli per canale contro i 256 del JPEG a 8 bit: è questa la ragione per cui il NEF consente recuperi molto più spinti su ombre e alte luci."
  - question: "Quando ha davvero senso scattare in JPEG anziché in NEF?"
    options:
      - "Sempre, il RAW è solo per professionisti"
      - "Quando servono consegne immediate e in grandi quantità, con condizioni di luce controllate"
      - "Solo in bianco e nero"
      - "Quando si usa il flash"
    correctIndex: 1
    explanation: "Eventi sportivi da consegnare in tempo reale, foto di reportage aziendale, sessioni molto lunghe: quando la velocità conta più della latitudine di sviluppo, il JPEG ben impostato è una scelta professionale legittima."
  - question: "Quale impostazione di menu conviene sistemare per prima su una Nikon appena acquistata?"
    options:
      - "L'effetto miniatura"
      - "Qualità immagine su NEF, spazio colore, data e ora, sequenza numerica file e formattazione della scheda"
      - "La luminosità del display al massimo"
      - "Lo zoom digitale"
    correctIndex: 1
    explanation: "Sono le impostazioni che determinano qualità del file e ordine dell'archivio: sistemarle una volta evita problemi che si scoprono solo mesi dopo, quando non sono più rimediabili."
challenge:
  title: "Configura la tua Nikon una volta per tutte"
  steps:
    - "Imposta la qualità immagine su NEF (RAW), o NEF+JPEG fine se ti serve una consegna immediata, dal menu di ripresa."
    - "Verifica spazio colore (sRGB), data e ora corrette con fuso orario, e imposta la sequenza numerica file su ON."
    - "Configura il controllo automatico della sensibilità ISO con massimo 3200 e tempo di posa minimo 1/125s, poi imposta il Picture Control su Neutro."
    - "Attiva le alte luci lampeggianti e l'istogramma RGB nelle opzioni di visualizzazione del menu di riproduzione, e imposta la revisione immagine su ON."
    - "Formatta la scheda dalla fotocamera (non dal computer) dopo aver scaricato tutto, e scatta una foto di prova per verificare che il file sia .NEF come previsto."
---

## Che cos'è un file NEF

Il NEF (Nikon Electronic Format) è la registrazione quasi grezza di ciò che il sensore ha misurato: un valore di luminosità per ciascun fotosito, a 12 o 14 bit di profondità, prima che qualunque scelta creativa venga applicata in modo definitivo.

Nel file sono comunque registrati bilanciamento del bianco, Picture Control e correzioni ottiche, ma come istruzioni allegate: il software di sviluppo li usa per costruire l'anteprima e tu puoi cambiarli in qualsiasi momento senza toccare i dati originali. È esattamente ciò che rende il RAW il formato di lavoro professionale: nessuna decisione presa in ripresa è irreversibile, tranne quelle fisiche — messa a fuoco, apertura, tempo, inquadratura.

Il prezzo è il peso (20-35 MB per scatto contro i 5-8 di un JPEG di pari risoluzione) e il fatto che serva uno sviluppo, perché il NEF non è direttamente pubblicabile. Nel menu di ripresa puoi scegliere fra profondità a 12 o 14 bit e fra compressione senza perdita e compressione standard: 14 bit senza perdita è la scelta di qualità, 12 bit compresso alleggerisce i file e velocizza la raffica.

## Quando il JPEG è la scelta giusta

Il JPEG è il file già sviluppato dalla fotocamera secondo le tue impostazioni: bilanciamento, contrasto, saturazione, nitidezza e riduzione rumore vengono applicati e poi l'immagine viene compressa a 8 bit per canale. È pronto da inviare, pesa poco, riempie il buffer molto più lentamente in raffica.

Ci sono contesti professionali in cui è la scelta corretta: la partita da consegnare all'agenzia mentre è ancora in corso, un servizio aziendale con centinaia di ritratti in condizioni di luce identiche, la documentazione tecnica. La condizione è che il bilanciamento del bianco e l'esposizione siano corretti in ripresa, perché il margine di correzione è ridotto: già due stop di recupero su un JPEG mostrano bande e artefatti.

L'opzione NEF+JPEG è il compromesso: consegni il JPEG e conservi il NEF per le immagini che meritano uno sviluppo curato. Costa spazio, ma è la configurazione più usata negli eventi.

## Spazio colore e profili

Nel menu di ripresa trovi la scelta fra sRGB e Adobe RGB. sRGB è lo standard del web, dei social, dei laboratori di stampa di consumo e dei dispositivi mobili. Adobe RGB copre una gamma più ampia, soprattutto nei verdi e nei ciano, ed è utile solo se l'intera catena — monitor calibrato, software gestito, stampante professionale — è in grado di sfruttarla.

Un'osservazione tecnica che risolve la maggior parte dei dubbi: se scatti in NEF, lo spazio colore impostato nella fotocamera è irrilevante per il file grezzo, perché lo assegnerai in sviluppo. Riguarda solo il JPEG e l'anteprima. Nel dubbio, sRGB: un file Adobe RGB pubblicato sul web senza conversione appare spento e desaturato.

## Il menu da sistemare una volta per tutte

Ci sono impostazioni che si configurano il primo giorno e non si toccano più. Vale la pena dedicare loro dieci minuti.

**Qualità immagine**: NEF o NEF+JPEG fine (menu di ripresa). **Spazio colore**: sRGB. **Picture Control**: Neutro se lavori in NEF, Standard o Ritratto se consegni JPEG. **Controllo automatico ISO**: massimo 3200-6400 e tempo di posa minimo 1/125s. **Sequenza numerica file**: ON, così non ti ritroverai decine di file con lo stesso nome in archivio. **Data, ora e fuso orario**: fondamentali per ordinare cronologicamente scatti provenienti da corpi diversi.

Nel menu di riproduzione, alla voce delle opzioni di visualizzazione: **alte luci lampeggianti** attive, **istogramma RGB** attivo, **dati di ripresa** visibili. Nelle impostazioni personalizzate: **AE-L/AF-L configurato su AF-ON** per il back-button focus, **incrementi EV a 1/3 di stop** e, se il corpo lo prevede, **ritardo dell'esposizione** per le pose lunghe su treppiede.

Infine il controllo automatico della distorsione e la riduzione del vignettamento: attivi per i JPEG, mentre sul NEF verranno applicati in sviluppo. Non c'è motivo di lasciarli disattivati.

## Gestione della scheda e dell'archivio

La scheda va formattata dalla fotocamera, non dal computer: la formattazione dal corpo crea la struttura di cartelle corretta e riduce il rischio di errori di scrittura. Sulla tua Nikon si esegue dal menu impostazioni oppure tenendo premuti insieme i due pulsanti contrassegnati in rosso con la scritta FORMAT. Va fatta dopo ogni scarico completo e verificato, mai prima.

Due abitudini professionali che evitano disastri: non cancellare mai singole foto dalla fotocamera durante una sessione (la frammentazione aumenta il rischio di corruzione, e in quel momento non stai valutando lucidamente) e portare sempre una seconda scheda. Le schede si scelgono di marca affidabile e con velocità di scrittura adeguata: per lo scatto continuo in NEF servono almeno 60-90 MB/s di scrittura reale.

## Errori comuni

1. **Scattare in JPEG per risparmiare spazio, e accorgersene dopo un evento irripetibile.** Correzione: le schede costano meno di un matrimonio rifatto; usa NEF quando lo scatto non è ripetibile.
2. **Impostare Adobe RGB senza saperne il motivo.** Correzione: sRGB, a meno che tu non gestisca l'intera catena colore.
3. **Formattare la scheda dal computer o cancellare foto dal corpo per fare spazio.** Correzione: formattazione dalla fotocamera, dopo lo scarico verificato.
4. **Lasciare la sequenza numerica file su OFF.** Correzione: attivala, per evitare collisioni di nomi in archivio.

## Pro tip

Adotta un flusso di scarico a due copie fin dal primo giorno: appena rientri, copia le cartelle su disco di lavoro e su un secondo supporto (disco esterno o servizio cloud), verifica di poter aprire alcuni file, e solo allora formatta la scheda. La regola professionale è che un file esiste davvero solo quando si trova in due luoghi fisicamente distinti; finché è in un unico posto, non esiste ancora.

Il secondo consiglio riguarda la ripresa: quando la scena ha un contrasto molto forte, ricordati che il vantaggio del NEF sta soprattutto nelle ombre — e i sensori Nikon in questo sono particolarmente generosi. Le alte luci bruciate sono perse anche nel RAW, mentre quattro stop di ombre chiuse sono spesso recuperabili con rumore accettabile fino a ISO 800. Nel dubbio, quindi, proteggi le luci e lascia scendere le ombre: è la ragione tecnica per cui, davanti a un cielo molto luminoso, i professionisti espongono per il cielo e sollevano il terreno in sviluppo.
