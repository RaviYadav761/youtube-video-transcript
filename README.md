# YouTube Transcript Generator (React.js + Tailwind CSS)

Sirf **React.js (JSX)** aur **Tailwind CSS** — koi TypeScript nahi.

## Chalane ka tarika

```sh
npm install
npm run dev
```

Phir browser me kholo: http://localhost:5173

`npm run dev` do cheezein saath me chalata hai:

- **Client** (Vite + React) — port 5173
- **Server** (Express) — port 5174, transcript laata hai

## Chhota server kyun chahiye?

Browser se seedha YouTube ko call karne par CORS block kar deta hai.
Isliye ek chhota Node/Express server transcript laata hai aur React app
usse `/api/transcript` par maangta hai.

## Features

- YouTube link (normal, Shorts, youtu.be, embed) se full transcript
- Ek click me poora transcript **Copy**
- **Translate** — kisi bhi language me (YouTube ke apne translation se)
- Video preview — click karo to video wahi play hota hai
- **Back to Top** button
- Poore reusable components

## Structure

```
index.html
vite.config.js
server/
  index.js        Express API (POST /api/transcript)
  youtube.js      transcript fetch + parse logic
src/
  main.jsx
  App.jsx
  index.css       Tailwind theme tokens
  components/
    ActionButton.jsx
    UrlSearchBar.jsx
    VideoMeta.jsx
    VideoPreview.jsx
    TranscriptCard.jsx
```
