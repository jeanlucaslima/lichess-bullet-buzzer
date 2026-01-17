# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lichess Bullet Buzzer is a Chrome extension (Manifest V3) that plays audio beeps at 1s, 2s, and 3s on the user's turn to help train bullet chess response time on lichess.org.

## Build Command

```bash
npm run build
```

This uses Vite to bundle `src/content/index.ts` into `dist/content.js`. Static assets from `public/` (manifest.json, beep WAV files) are copied to `dist/`.

## Architecture

- **Content Script**: `src/content/index.ts` - Injected into lichess.org pages
- **Extension Manifest**: `public/manifest.json` - Chrome extension configuration (Manifest V3)
- **Audio Assets**: `public/beep{1,2,3}.wav` - Sound files for timing alerts
- **Build Output**: `dist/` - Load this directory as an unpacked extension in Chrome

## Loading the Extension

1. Run `npm run build`
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder
