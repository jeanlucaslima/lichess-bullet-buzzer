# Lichess Bullet Buzzer

A Chrome extension (Manifest V3) that plays audio beeps at 1s, 2s, and 3s on your turn to help train bullet chess response time on [lichess.org](https://lichess.org).

## Features

- Beeps at 1s, 2s, and 3s into your turn
- Toggle on/off via an in-page UI
- Toggle state persists across page refreshes

## Build

```bash
npm install
npm run build
```

Vite bundles `src/content/index.ts` into `dist/content.js` and copies the manifest and beep WAV files from `public/` into `dist/`.

## Install in Chrome

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder
5. Visit lichess.org and start a game

## Project Structure

- `src/content/index.ts` — content script injected into lichess.org
- `public/manifest.json` — extension manifest
- `public/beep{1,2,3}.wav` — audio assets
- `dist/` — build output (load this as the unpacked extension)
