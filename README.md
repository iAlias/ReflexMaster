# Reflex Master

![Nuxt](https://img.shields.io/badge/Nuxt-3-00dc82)
![Vue](https://img.shields.io/badge/Vue-3-42b883)
![Test](https://img.shields.io/badge/test-Vitest-2a6e4e)
![Stato](https://img.shields.io/badge/stato-online-2a6e4e)

🌐 **Sito:** <https://ialias.github.io/ReflexMaster/>

Corso di fotografia reflex, costruito con **Nuxt 3 + Nuxt Content**.

Due percorsi separati per corpo macchina (**Canon** e **Nikon**), dall'anatomia della
reflex al triangolo dell'esposizione, composizione, ritratto, paesaggio, sport.

## Struttura

| Cartella | Cosa contiene |
|---|---|
| `content/canon`, `content/nikon` | le lezioni in Markdown (48 file) |
| `components/` | componenti Vue, inclusi i diagrammi SVG originali delle lezioni |
| `pages/`, `layouts/` | pagine e impaginazione del corso |
| `composables/`, `stores/`, `utils/` | logica: wizard di scelta del corpo macchina, stato |
| `public/` | immagini (Wikimedia, convertite in WebP) e asset statici |
| `tests/` | test Vitest |
| `docs/` | note e specifiche di progetto |
| `CREDITS.md` | crediti e licenze delle immagini — va tenuto aggiornato: le immagini Wikimedia sono CC BY-SA |

## Comandi

```bash
npm install
npm run dev        # sviluppo
npm run test       # Vitest
npm run generate   # build statica
```

La build statica finisce in `reflex-master-AI-Reflex/` (e in `dist/`): **non è
versionata**, sono ~11 MB rigenerabili con `npm run generate`.

## Stato

Contenuto e build sono pronti. Manca una decisione di prodotto, non del codice:
**gratis con pubblico, o a pagamento su Gumroad**. Finché quella decisione non è
presa, il corso non è raggiungibile da nessuno.
