---
title: "Luce ed esposizione"
description: "Come sensore e otturatore trasformano la luce in immagine, cos'è uno stop e come leggere l'istogramma."
slug: luce-ed-esposizione
order: 2
module: 1
brand: nikon
quiz:
  - question: "Stai fotografando in modalità A a f/5.6 e la tua Nikon sceglie 1/125s. Chiudi a f/8: come cambia il tempo, a parità di luce?"
    options:
      - "Diventa 1/250s, perché serve meno luce"
      - "Diventa 1/60s, perché il diaframma lascia passare metà della luce"
      - "Resta 1/125s, il tempo non dipende dall'apertura"
      - "Diventa 1/500s, perché f/8 è più luminoso di f/5.6"
    correctIndex: 1
    explanation: "Da f/5.6 a f/8 c'è uno stop di luce in meno: la fotocamera compensa raddoppiando il tempo di posa, da 1/125s a 1/60s."
  - question: "L'istogramma di uno scatto sulla neve mostra tutti i dati addossati a sinistra, senza toccare il bordo destro. Cosa significa?"
    options:
      - "L'immagine è sovraesposta e ha perso le alte luci"
      - "L'immagine è sottoesposta: la neve risulterà grigia invece che bianca"
      - "L'immagine è perfettamente esposta"
      - "Il bilanciamento del bianco è sbagliato"
    correctIndex: 1
    explanation: "L'esposimetro cerca di rendere media ogni scena: sulla neve tende quindi a sottoesporre. Serve una compensazione positiva, tipicamente da +1 a +1,7 EV, per portare i toni verso destra."
  - question: "Cosa succede fisicamente nella tua Nikon quando premi a fondo il pulsante di scatto usando il mirino ottico?"
    options:
      - "Il sensore legge la luce direttamente, senza parti in movimento"
      - "Lo specchio si solleva, l'otturatore scopre il sensore per il tempo impostato, poi lo specchio ricade"
      - "Il pentaspecchio ruota per esporre il sensore"
      - "Il diaframma si chiude completamente per proteggere il sensore"
    correctIndex: 1
    explanation: "Lo specchio si alza (da qui il rumore e la vibrazione dello scatto reflex), le tendine dell'otturatore scoprono il sensore per il tempo impostato, poi tutto torna in posizione di visione."
  - question: "Un file sembra ben esposto sul display, ma l'istogramma è appiattito contro il bordo destro. A cosa devi credere?"
    options:
      - "Al display: se sembra giusto, lo è"
      - "All'istogramma: alcune alte luci sono bruciate e non recuperabili"
      - "A nessuno dei due, solo all'indicatore nel mirino"
      - "Al display, ma solo se la luminosità dello schermo è al massimo"
    correctIndex: 1
    explanation: "La luminosità percepita del display dipende dall'ambiente e dalle impostazioni; l'istogramma è la misura oggettiva. Dati tagliati a destra significano canali saturati, cioè dettaglio perso per sempre."
challenge:
  title: "Il test degli stop"
  steps:
    - "Metti la tua Nikon su treppiede o su un piano stabile, ghiera dei modi su M, e inquadra una scena statica ben illuminata."
    - "Imposta ISO 200 e f/8, poi regola il tempo con la ghiera di comando principale finché l'indicatore di esposizione nel mirino è centrato sullo zero."
    - "Scatta cinque foto cambiando solo il tempo: -2 stop, -1 stop, esposizione centrata, +1 stop, +2 stop (ogni stop raddoppia o dimezza il tempo)."
    - "Rivedi le cinque foto premendo il selettore multiplo verso l'alto fino a vedere l'istogramma: osserva la massa dei dati spostarsi da sinistra a destra."
    - "Ripeti la serie in modalità A, tenendo f/8 fisso e agendo solo sul compenso di esposizione: verifica che i risultati siano gli stessi."
---

## Che cosa significa esporre

Esporre significa decidere quanta luce raggiunge il sensore. Non è un'operazione tecnica fine a se stessa: è la prima scelta creativa che fai, perché la quantità di luce determina non solo quanto l'immagine sarà chiara o scura, ma anche quanto sarà nitido il movimento, quanto sfondo resterà a fuoco e quanto rumore comparirà nelle ombre.

La tua Nikon controlla la luce con tre soli parametri: l'apertura del diaframma nell'obiettivo, il tempo di apertura dell'otturatore, la sensibilità ISO del sensore. Le prossime lezioni li affronteranno uno per uno; qui costruiamo il linguaggio comune che li lega, perché senza quel linguaggio i valori numerici restano formule da memorizzare invece che strumenti da usare.

::exposure-triangle
::

## Il sensore e l'otturatore

Il sensore CMOS in formato DX della tua D3500 o D5600 è una griglia di milioni di fotositi: ciascuno accumula fotoni durante l'esposizione e li converte in un segnale elettrico, poi digitalizzato dal processore EXPEED. Più fotoni raccoglie un fotosito, più alto è il segnale rispetto al rumore elettronico di fondo: è questo il motivo, molto concreto, per cui una foto esposta bene già in ripresa è più pulita della stessa foto schiarita al computer.

Davanti al sensore, in condizione di riposo, ci sono lo specchio e le tendine dell'otturatore. Quando premi a fondo il pulsante di scatto avviene una sequenza meccanica precisa: lo specchio si solleva, il diaframma dell'obiettivo si chiude al valore impostato, la prima tendina scopre il sensore, trascorso il tempo di posa la seconda tendina lo ricopre, infine lo specchio ricade e il diaframma riapre. In Live View la sequenza è diversa, perché lo specchio resta già sollevato e la luce raggiunge il sensore in modo continuo.

Ai tempi molto rapidi, oltre il tempo di sincronizzazione del flash (1/200s sulla D3500 e sulla D5600, 1/250s sulla D7500), le due tendine non scoprono mai il sensore per intero: si rincorrono lasciando una fessura che scorre lungo il fotogramma. È un dettaglio che tornerà utile parlando di flash, e che spiega perché il lampo non si può usare a qualsiasi tempo.

## Lo stop: l'unità di misura della luce

Uno **stop** è un raddoppio o un dimezzamento della quantità di luce. È l'unità con cui i fotografi ragionano da oltre un secolo, ed è potente proprio perché vale allo stesso modo per tutti e tre i parametri: se togli uno stop con l'apertura, puoi restituirlo con il tempo o con gli ISO, e l'esposizione finale sarà identica.

Sui tempi la progressione è immediata: 1/60s, 1/125s, 1/250s, 1/500s — ogni passo dimezza la luce. Sugli ISO è altrettanto lineare: 100, 200, 400, 800, 1600 — ogni passo la raddoppia. Sull'apertura la sequenza sembra arbitraria, ma non lo è: f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16 dimezzano l'area del foro a ogni passo verso destra, perché il numero f è un rapporto e la superficie dipende dal quadrato del diametro.

Le Nikon lavorano di norma a incrementi di 1/3 di stop: fra f/5.6 e f/8 trovi f/6.3 e f/7.1, fra 1/125s e 1/250s trovi 1/160s e 1/200s. Sono passi fini, utili per aggiustare l'esposizione senza stravolgere la resa. Nel menu impostazioni personalizzate, alla voce dedicata agli incrementi EV, puoi passare a 1/2 stop, ma il consiglio è restare su 1/3.

Ragionare in stop è ciò che permette decisioni rapide sul campo: "questa scena è due stop più buia della precedente, apro di uno stop e alzo gli ISO di uno" diventa, con l'esercizio, un pensiero immediato quanto cambiare marcia in auto.

## Leggere l'istogramma

L'istogramma è il grafico che conta quanti pixel dell'immagine cadono in ciascun livello di luminosità: le ombre a sinistra, i mezzitoni al centro, le alte luci a destra. Non esiste un istogramma giusto in assoluto — una scena notturna avrà legittimamente la massa a sinistra, una scena in spiaggia a destra — ma esistono due segnali inequivocabili di problema: dati appiattiti contro il bordo destro (alte luci bruciate, dettaglio irrecuperabile) e dati appiattiti contro il bordo sinistro (ombre chiuse nel nero, che schiarite mostreranno solo rumore).

Sulla tua Nikon lo richiami in riproduzione premendo il selettore multiplo verso l'alto o verso il basso finché compare la schermata con i grafici; nel menu di riproduzione, alla voce delle opzioni di visualizzazione, puoi abilitare sia l'istogramma RGB sia le alte luci lampeggianti. Il grafico di luminosità è più leggibile, quello RGB è più onesto: su soggetti molto saturi (un fiore rosso, una maglia gialla) un singolo canale può saturare mentre la luminanza complessiva sembra ancora sana.

Ricorda un punto essenziale: sia l'anteprima sia l'istogramma sono calcolati sul JPEG di anteprima, non sul file NEF. Il RAW conserva quasi sempre un po' più di margine nelle alte luci di quanto l'istogramma lasci pensare — e i sensori Nikon sono noti per la generosità nel recupero delle ombre. Se scatti in NEF puoi quindi lavorare con l'istogramma leggermente più spostato a destra: è la tecnica dell'esporre a destra, che affronteremo nella lezione sulla misurazione.

## Errori comuni

1. **Fidarsi dell'anteprima sul display.** In pieno sole lo schermo sembra scuro e si tende a sovraesporre; al buio sembra luminoso e si sottoespone. Correzione: verifica sempre con l'istogramma, non a occhio.
2. **Inseguire l'indicatore centrato in ogni situazione.** Portare l'indicatore dell'esposimetro sullo zero su una scena molto chiara o molto scura produce un risultato grigiastro. Correzione: usa il compenso di esposizione, tipicamente da +1 a +2 EV sulla neve e da -1 a -2 EV su una scena notturna con grandi zone nere.
3. **Contare di recuperare tutto in post-produzione.** Schiarire di due stop un file sottoesposto significa amplificare il rumore delle ombre in modo visibile già a ISO 800. Correzione: esponi bene in ripresa e usa lo sviluppo per rifinire, non per salvare.
4. **Confondere luminosità e contrasto.** Una foto piatta non è necessariamente sottoesposta: può avere l'esposizione corretta e semplicemente mancare di contrasto, cosa che si risolve con la luce o in sviluppo, non aprendo il diaframma.

## Pro tip

Attiva le alte luci lampeggianti nel menu di riproduzione: le aree bruciate lampeggeranno sull'anteprima. Insieme all'istogramma è il controllo più rapido dopo lo scatto e ti evita di scoprire il problema davanti al computer, quando ormai non c'è rimedio.

Impara poi a stimare le scene in stop rispetto a un riferimento noto. Un ottimo punto di partenza è la regola *sunny 16*: in pieno sole, a f/16, il tempo corretto è circa 1 diviso il valore ISO (a ISO 100, 1/100s). Da lì tutto è una questione di stop: ombra aperta circa 3 stop in meno, interno luminoso di giorno circa 6-7 stop in meno, strada illuminata di notte circa 10-11 stop in meno. Costruire questa scala mentale ti rende autonomo dall'esposimetro proprio nelle situazioni in cui l'esposimetro sbaglia, ed è una delle differenze più visibili fra un principiante e un professionista.
