# Reflex Master — Design Doc

**Data:** 2026-07-03
**Stato:** Approvato in brainstorming, in attesa di review finale sul documento

## 1. Visione

Web app interattiva in italiano che insegna a usare una fotocamera reflex partendo da zero fino a un livello professionale. L'utente sceglie la propria marca (Canon o Nikon) in un wizard iniziale e segue un corso strutturato con lezioni testuali illustrate, quiz ed esercizi pratici, segnando il progresso lezione per lezione. Il corso NON è divulgativo/banale: l'obiettivo dichiarato è che al termine l'utente sappia impostare la fotocamera e scattare come un fotografo professionista.

**Requisiti chiave:**
- Wizard iniziale di scelta marca (Canon, Nikon) con percorsi di contenuto dedicati per marca
- Corso progressivo: fondamenta → composizione/tecnica → generi e contesti con trick base e avanzati
- Ogni lezione termina con esercizi: quiz a risposta multipla + sfida pratica dettagliata
- Progresso salvato in localStorage (nessun account, nessun backend)
- Design moderno, professionale, animazioni immersive (GSAP + ScrollTrigger, niente 3D/Three.js)
- Responsive completo: desktop e mobile
- Solo italiano

## 2. Stack tecnico

| Area | Scelta |
|---|---|
| Framework | Nuxt 3 (Vue 3, Composition API, `<script setup>`) |
| Contenuti | Nuxt Content — lezioni in Markdown con front-matter |
| Stato/progresso | Pinia + pinia-plugin-persistedstate (localStorage) |
| Animazioni | GSAP + ScrollTrigger; tilt/parallax via CSS transforms |
| Styling | CSS puro con custom properties (design tokens), mobile-first, nessun framework CSS pesante |
| Rendering | SSG (generazione statica) — nessun backend |
| Testing | Vitest + Vue Test Utils |
| Hosting | Da decidere in seguito (l'output SSG è compatibile con qualsiasi hosting statico) |

## 3. Struttura contenuti multi-marca

**Approccio scelto: contenuti totalmente separati per marca.**

```
content/
  canon/
    01-anatomia-della-reflex.md
    02-luce-ed-esposizione.md
    ...
  nikon/
    01-anatomia-della-reflex.md
    ...
```

- Stesso indice di argomenti per entrambe le marche, ma ogni file è scritto per la marca specifica: nomi reali di ghiere, pulsanti, voci di menu (es. "ghiera principale/Av su Canon" vs "ghiera dei comandi posteriore su Nikon"), terminologia propria (Av/Tv su Canon vs A/S su Nikon), foto del corpo macchina della marca.
- Costo accettato: una correzione a un concetto universale va replicata in entrambi i file.

**Front-matter di ogni lezione:**

```yaml
title: "Apertura e profondità di campo"
order: 3
module: 1
brand: canon
slug: apertura-e-profondita-di-campo
heroImage: /images/canon/03-hero.webp
description: "Come il diaframma controlla luce e sfocato"
quiz:
  - question: "..."
    options: ["...", "...", "...", "..."]
    correctIndex: 1
    explanation: "..."
challenge:
  title: "..."
  steps: ["...", "...", "..."]
```

## 4. Curriculum (24 lezioni, 3 moduli)

Il corso è progettato per portare l'utente a livello professionale: ogni lezione include impostazioni numeriche concrete, esempi reali, sezione "errori comuni" e "pro tip".

### Modulo 1 — Fondamenta tecniche (11 lezioni)
1. **Anatomia della reflex** — corpo, obiettivo, mirino, ghiere, pulsanti, display; nomi specifici per marca
2. **Luce ed esposizione** — come funziona sensore/otturatore, il concetto di stop, leggere l'istogramma
3. **Apertura e profondità di campo** — f/stop, diaframma, sfocato, diffrazione
4. **Tempi di scatto e movimento** — congelare vs mosso creativo, regola del reciproco, micromosso
5. **ISO e rumore** — sensibilità, ISO nativo, quando alzare, gestione del rumore
6. **Il triangolo dell'esposizione in pratica** — bilanciare i tre parametri, scenari con valori concreti
7. **Le modalità di scatto** — P / A(Av) / S(Tv) / M, quando usare ciascuna, modalità per marca
8. **Misurazione esposimetrica e compensazione** — valutativa/matrix, spot, media pesata; compensazione EV; esporre a destra (ETTR)
9. **Messa a fuoco da professionista** — AF-S/One Shot, AF-C/AI Servo, punti e aree AF, back-button focus, MF con focus peaking/conferma
10. **Bilanciamento del bianco e colore** — temperatura colore in Kelvin, WB personalizzato, cartoncino grigio
11. **RAW, JPEG e configurazione del menu** — formati, spazio colore, impostazioni menu essenziali per marca

### Modulo 2 — Composizione, luce e visione (5 lezioni)
12. **Composizione I** — regola dei terzi, linee guida, inquadratura, spazio negativo
13. **Composizione II** — geometria, ritmo, livelli di lettura, il momento decisivo
14. **La luce** — qualità (dura/morbida), direzione, ora d'oro e ora blu, controluce
15. **Obiettivi e lunghezze focali** — grandangolo/normale/tele, prospettiva e compressione, scelta dell'ottica per genere
16. **Flash e luce artificiale** — flash integrato vs esterno, TTL vs manuale, sincro tendina, fill flash, luce rimbalzata

### Modulo 3 — Generi, contesti e trick da pro (8 lezioni)
Ogni lezione di questo modulo segue lo schema: contesto → impostazioni consigliate (tabella con valori concreti per marca) → trick base → trick avanzati → errori da evitare.
17. **Ritratto** — aperture larghe, fuoco sull'occhio, focali, gestione dello sfondo
18. **Paesaggio** — iperfocale, treppiede, filtri ND/polarizzatore, bracketing
19. **Sport e azione** — raffica, AF continuo con tracking, tempi minimi, pre-focheggiatura
20. **Notturna e astrofotografia** — lunghe esposizioni, regola del 500, ISO alto, riduzione rumore, intervalometro
21. **Macro** — rapporto di riproduzione, MF, focus stacking, gestione della PDC minima
22. **Street e reportage** — zone focusing, discrezione, esposizione rapida, f/8 and be there
23. **Lunghe esposizioni creative** — panning, scie di luce, acqua setosa, filtri ND estremi
24. **Workflow del professionista** — gestione file e backup, culling, basi di sviluppo RAW, preparazione all'uscita fotografica

### Standard di qualità dei contenuti
- Ogni lezione: 800–1500 parole, tono professionale ma accessibile
- Impostazioni sempre con valori numerici concreti (es. "ritratto: f/1.8–f/2.8, 1/200s min, ISO auto max 1600")
- Riferimenti a pulsanti/menu con i nomi esatti della marca
- Sezioni ricorrenti: "Errori comuni" e "Pro tip" in ogni lezione
- Quiz: 3–5 domande a risposta multipla per lezione, con spiegazione della risposta
- Sfida pratica: esercizio dettagliato passo-passo da svolgere con la fotocamera reale

## 5. Flussi utente

### Wizard di onboarding (prima visita)
1. Hero di benvenuto animata a schermo intero (titolo + CTA)
2. Step "Che fotocamera hai?" — card grandi Canon/Nikon con effetto tilt
3. Riepilogo + "Inizia il corso" → dashboard
- Scelta salvata in Pinia/localStorage; visite successive saltano il wizard
- La marca è modificabile dalle impostazioni; il progresso è salvato **per marca** e cambiare marca non cancella nulla

### Dashboard del corso
- Lezioni raggruppate per modulo, card con numero, titolo, thumbnail, stato (✓ completata / in corso / da fare)
- Barra di progresso globale animata + progresso per modulo
- Accesso libero a tutte le lezioni (nessun blocco sequenziale); la "prossima lezione" è evidenziata

### Pagina lezione
- Markdown renderizzato con reveal progressivo allo scroll
- Barra di progresso di lettura in alto
- Sezione esercizi in fondo: quiz con feedback immediato (verde/rosso + spiegazione, tentativi illimitati), poi sfida pratica con checkbox "L'ho fatta"
- "Segna come completata" si abilita quando tutte le domande quiz hanno risposta corretta E la sfida è spuntata
- Navigazione lezione precedente/successiva

### Modello dati (localStorage via Pinia persisted)
```json
{
  "brand": "canon",
  "wizardCompleted": true,
  "progress": {
    "canon": {
      "apertura-e-profondita-di-campo": {
        "quizPassed": true,
        "challengeDone": true,
        "completedAt": "2026-07-03T18:00:00Z"
      }
    },
    "nikon": {}
  }
}
```

## 6. Design visivo e animazioni

**Direzione estetica:** tema scuro di default (richiamo alla camera oscura): sfondo quasi nero, tipografia grande e nitida, accento caldo ambra/arancio (luce di sicurezza della camera oscura) + accento secondario dinamico della marca (rosso Canon / giallo Nikon) via CSS custom properties.

**Animazioni (GSAP + ScrollTrigger):**
- Hero landing: reveal del titolo a caratteri sfalsati, "diaframma" SVG che si apre come una lente
- Wizard: transizioni slide+fade tra step (GSAP timeline), card marca con tilt 3D CSS al mouse
- Dashboard: reveal in cascata delle card allo scroll, progress bar animata
- Lezione: fade-up di paragrafi/immagini allo scroll; diagrammi SVG animati e interattivi (es. diaframma che si apre/chiude con uno slider, triangolo dell'esposizione che si disegna)
- Quiz: shake su risposta errata, check animato su corretta, celebrazione al completamento lezione
- Transizioni pagina: fade coordinato con le page transitions di Nuxt
- Accessibilità: `prefers-reduced-motion` rispettato ovunque (degradazione a fade semplici)

**Responsive:** mobile-first; colonna singola su mobile, menu hamburger, animazioni alleggerite al tocco (niente tilt, reveal semplificati).

## 7. Immagini

- **Diagrammi tecnici:** SVG creati ad-hoc, inline nei componenti Vue (animabili con GSAP)
- **Foto reali** (corpi macchina, ghiere, esempi fotografici): solo da fonti con licenza libera (Wikimedia Commons, Unsplash, Pexels), scaricate in `public/images/`, attribuzioni tracciate in `CREDITS.md`. Se non esiste un'immagine libera adeguata → SVG illustrativo al suo posto. Mai hotlinking né immagini protette da copyright.
- Tutte le immagini: `loading="lazy"`, dimensioni esplicite (no layout shift), WebP dove possibile

## 8. Gestione errori

- localStorage corrotto/assente → reset silenzioso allo stato iniziale (riparte il wizard)
- Immagine non caricata → placeholder SVG con l'icona della lezione
- Rotta inesistente → pagina 404 a tema
- Accesso a lezione di una marca senza wizard completato → redirect al wizard

## 9. Testing e qualità

- **Vitest:** unit test su store Pinia (logica progresso, completamento, cambio marca) e utility
- **Vue Test Utils:** test dei componenti chiave (quiz, wizard, card lezione)
- Verifica manuale end-to-end del flusso completo (wizard → lezione → quiz → completamento) su viewport desktop e mobile prima di dichiarare il lavoro finito
- Lighthouse come riferimento per performance/accessibilità

## 10. Fuori scope (v1)

- Account utente / sincronizzazione cross-device (il modello dati è già predisposto per un futuro backend)
- Marche oltre Canon e Nikon (la struttura a cartelle rende banale aggiungerle)
- Multi-lingua
- Video nelle lezioni
- Hosting/deploy (deciso in seguito; l'output è statico e portabile)
