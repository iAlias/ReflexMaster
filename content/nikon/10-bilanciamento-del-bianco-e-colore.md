---
title: "Bilanciamento del bianco e colore"
description: "Temperatura colore in Kelvin, preset, preimpostazione manuale con cartoncino grigio e Picture Control."
slug: bilanciamento-del-bianco-e-colore
order: 10
module: 1
brand: nikon
quiz:
  - question: "Fotografi in interno sotto lampade a incandescenza con il bilanciamento su Luce diurna. Che dominante ottieni?"
    options:
      - "Una dominante blu, molto fredda"
      - "Una dominante arancione, molto calda"
      - "Una dominante verde"
      - "Nessuna dominante: il bilanciamento non influisce sui JPEG"
    correctIndex: 1
    explanation: "Le lampade a incandescenza emettono intorno ai 2800-3000 K; impostando 5200 K (luce diurna) la fotocamera non corregge il calore della luce e l'immagine risulta arancione."
  - question: "Perché scattare in NEF rende il bilanciamento del bianco meno critico in ripresa?"
    options:
      - "Perché il NEF applica sempre il bilanciamento automatico"
      - "Perché nel NEF il valore è solo un'indicazione modificabile in sviluppo senza perdita di qualità"
      - "Perché il NEF elimina le dominanti automaticamente"
      - "Perché il NEF registra solo il bianco e nero"
    correctIndex: 1
    explanation: "Nel NEF i dati grezzi del sensore restano intatti: il bilanciamento è un'etichetta che puoi cambiare in sviluppo senza degradare il file, cosa che sul JPEG non è vera."
  - question: "A che serve la preimpostazione manuale del bilanciamento del bianco con cartoncino grigio?"
    options:
      - "A misurare l'esposizione corretta della scena"
      - "A dire alla fotocamera qual è il riferimento neutro sotto quella specifica luce"
      - "A calibrare la messa a fuoco dell'obiettivo"
      - "A ridurre il rumore alle alte sensibilità"
    correctIndex: 1
    explanation: "Fotografando il cartoncino sotto la luce di scena e memorizzandolo come preimpostazione, la fotocamera neutralizza esattamente quella dominante: è il metodo più preciso, indispensabile con luci miste o LED di bassa qualità."
  - question: "Vuoi accentuare i toni caldi di un tramonto. Cosa fai con il bilanciamento?"
    options:
      - "Imposto Incandescenza per raffreddare la scena"
      - "Imposto Nuvoloso o Ombra, che spingono l'immagine verso il caldo"
      - "Lascio l'automatico, che riconosce i tramonti"
      - "Passo in bianco e nero"
    correctIndex: 1
    explanation: "I preset Nuvoloso (circa 6000 K) e Ombra (circa 8000 K) dicono alla fotocamera che la luce è fredda: la compensazione scalda l'immagine, esaltando l'ora d'oro."
challenge:
  title: "La stessa scena, cinque bilanciamenti"
  steps:
    - "Metti un oggetto bianco o grigio neutro (un foglio, una tazza bianca) sotto una lampada di casa, con le tende chiuse per escludere la luce esterna."
    - "Scatta la stessa inquadratura con cinque impostazioni: Auto, Luce diurna, Incandescenza, Nuvoloso e la selezione diretta in Kelvin a 3000 K."
    - "Confronta gli scatti sul display e individua quale rende il bianco davvero bianco."
    - "Esegui ora una preimpostazione manuale: seleziona PRE nel menu del bilanciamento, tieni premuto finché lampeggia, fotografa il foglio riempiendo l'inquadratura e verifica che compaia la conferma di acquisizione."
    - "Ripeti l'intera prova vicino a una finestra con luce naturale e confronta i valori Kelvin corretti nei due ambienti."
---

## La temperatura colore

Ogni sorgente luminosa ha un colore proprio, misurato in gradi Kelvin. Più il valore è basso, più la luce è arancione; più è alto, più tende al blu. Sono valori che conviene conoscere a memoria: candela circa 1900 K, lampada a incandescenza 2800-3000 K, alba e tramonto 3000-4000 K, luce diurna a mezzogiorno 5200-5500 K, flash elettronico 5500 K, cielo coperto 6000-6500 K, ombra aperta sotto cielo azzurro 7000-8000 K.

Il nostro cervello compensa in automatico: un foglio di carta ci sembra bianco sia sotto una lampadina sia all'aperto. Il sensore no: registra fedelmente le proporzioni fra i canali rosso, verde e blu, e senza correzione quello stesso foglio risulta arancione in casa e azzurrino all'ombra. Il bilanciamento del bianco è la correzione che riporta il neutro al neutro.

Attenzione all'inversione che confonde tutti all'inizio: impostare un valore Kelvin *alto* scalda l'immagine, perché stai dicendo alla fotocamera che la luce è fredda e va compensata. Il numero descrive la luce presunta, non il risultato.

## I preset e il modo automatico

Sulla tua Nikon i preset si selezionano con il pulsante i o dal menu di ripresa: Auto, Incandescenza, Fluorescente (con sette sotto-tipi, dalle lampade a vapori di sodio ai LED a luce diurna), Luce diurna, Flash, Nuvoloso, Ombra, Scegli temperatura colore e Preimpostazione manuale.

L'automatico sui modelli recenti è affidabile in luce naturale ed è la scelta ragionevole per il lavoro quotidiano, specie in NEF. Ha però due debolezze note: le luci miste (interno con lampade calde e finestra fredda) lo mandano in oscillazione da uno scatto all'altro, e le scene dominate da un colore (una parete rossa, un prato) lo portano a compensare eccessivamente.

Sui corpi più recenti l'automatico si articola in due varianti: quella che conserva i colori caldi delle luci a incandescenza, adatta a interni e ritratti d'atmosfera, e quella che punta al bianco neutro, migliore per la riproduzione fedele di prodotti e documenti. Ogni preset, inoltre, si può regolare finemente sui due assi ambra-blu e verde-magenta: è il modo per correggere la dominante verde dei tubi fluorescenti senza uscire dai preset.

## La preimpostazione manuale

È il metodo preciso, e in molte situazioni professionali è l'unico affidabile. La procedura sulla tua Nikon: seleziona PRE nel menu del bilanciamento, tieni premuto il comando finché l'indicazione lampeggia nel mirino, inquadra un cartoncino grigio 18% o un foglio bianco neutro illuminato dalla stessa luce del soggetto, riempi l'inquadratura e scatta. Se la conferma di acquisizione compare, la misura è memorizzata; se l'operazione non riesce, correggi l'esposizione e ripeti.

Va rifatta ogni volta che cambia la luce: passando da una sala all'altra, quando il sole si abbassa, quando si accendono le luci artificiali. Nei set con luci LED economiche, che hanno spesso uno spettro irregolare e una dominante verde, la preimpostazione manuale è l'unico modo per ottenere incarnati credibili.

Una variante di campo utilissima quando non hai il cartoncino: fotografa il palmo della tua mano riempiendo l'inquadratura e usa quello come riferimento, poi correggi leggermente verso il freddo in sviluppo. La pelle non è neutra, ma è un riferimento costante e sempre disponibile.

## Picture Control e spazio colore

I Picture Control definiscono contrasto, saturazione, nitidezza e tonalità applicati al JPEG: Standard, Neutro, Saturo, Monocromatico, Ritratto, Paesaggio e, sui corpi recenti, Uniforme. Se scatti in NEF influenzano solo l'anteprima e i metadati; sul JPEG sono definitivi.

La scelta professionale, quando si lavora in NEF, è impostare Neutro o Uniforme: l'anteprima risulta più piatta ma è più onesta sul reale contenuto del file, e riduce il rischio di credere bruciata una zona che nel NEF è ancora recuperabile. Ogni Picture Control è regolabile nei suoi parametri e può essere salvato come personalizzato, comodo se consegni JPEG con una resa costante.

Lo spazio colore, nella stessa area di menu, propone sRGB e Adobe RGB. sRGB è lo standard del web e delle stampe di consumo; Adobe RGB ha una gamma più ampia e ha senso solo con un flusso di lavoro gestito dal colore fino alla stampa professionale. In dubbio, sRGB.

## Errori comuni

1. **Lasciare un preset attivo da una sessione all'altra.** Impostare Incandescenza la sera e ritrovarsi all'aperto il giorno dopo produce scatti azzurri. Correzione: azzera su Auto a fine sessione.
2. **Correggere le dominanti solo in post su file JPEG.** Il JPEG ha già applicato la correzione: cambiarla di molto degrada il colore e crea artefatti. Correzione: se lavori in JPEG, cura il bilanciamento in ripresa.
3. **Bilanciare su un bianco che non è neutro.** Molti fogli di carta hanno sbiancanti ottici e virano al blu sotto luce UV. Correzione: usa un cartoncino grigio 18% certificato.
4. **Cercare il neutro assoluto sempre.** Un tramonto neutralizzato perde la ragione stessa per cui l'hai fotografato. Correzione: bilancia per l'emozione, non per il grigio.

## Pro tip

Quando fotografi un evento con luci miste, scatta il primo fotogramma con un cartoncino grigio in mano al soggetto, sotto la luce di scena. Non serve conservarlo: in sviluppo userai il contagocce su quel cartoncino e applicherai il valore trovato a tutta la serie con un clic. Costa due secondi in ripresa e fa risparmiare mezz'ora davanti al computer, con risultati più coerenti di qualunque correzione a occhio.

Il secondo accorgimento riguarda i ritratti in ambiente: prima di correggere la dominante, chiediti se stia lavorando a tuo favore. La luce calda di un interno domestico o il blu dell'ora blu raccontano l'ora e il luogo dello scatto; azzerarli in nome della neutralità produce immagini tecnicamente corrette e narrativamente mute. I professionisti bilanciano sui toni della pelle e lasciano che l'ambiente conservi il suo colore: è una scelta consapevole, non una svista.
