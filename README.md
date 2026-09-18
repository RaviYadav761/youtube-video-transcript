# YouTube Transcript Generator

A React and Express app that fetches YouTube captions through the `youtube-transcript` package. It runs locally on ports `5173` and `5174`, and also exposes the same `/api/transcript` handler as a Vercel serverless function.

## Run locally

Requirements: Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

`npm run dev` starts both services with `concurrently`:

- Frontend: Vite + React at `http://localhost:5173`
- Backend: Express API at `http://localhost:5174`

## API

`POST http://localhost:5174/api/transcript`

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

The response contains the extracted video ID, the transcript `items` array, and joined `text`:

```json
{
  "videoId": "VIDEO_ID",
  "items": [
    { "text": "Transcript segment", "duration": 2.5, "offset": 0 }
  ],
  "text": "Transcript segment ..."
}
```

## Features

- Supports standard YouTube, Shorts, `youtu.be`, embed, and live URLs
- Local Express backend avoids browser CORS restrictions
- Loading and invalid URL or unavailable transcript errors
- Timestamped, scrollable transcript display
- Copy transcript to clipboard
- Download transcript as a `.txt` file

## Structure

```text
index.html
vite.config.js
server/
  index.js        Express API
  youtube.js      Video ID validation and package adapter
src/
  main.jsx
  App.jsx
  index.css
```
