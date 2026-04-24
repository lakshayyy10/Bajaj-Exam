# BFHL Hierarchy API

Round 1 submission for the SRM Full Stack Engineering Challenge.

A small Node/Express service that takes a list of parent→child edges
(like `"A->B"`) and returns the trees, any cycles, and a quick summary.
Ships with a plain HTML/CSS/JS frontend to poke at the API.

## Layout

```
backend/    Express API, POST /bfhl
frontend/   Static single-page UI
```

## Running locally

```bash
cd backend
npm install
npm start
```

The API boots on `http://localhost:3000`. Open `frontend/index.html`
directly in the browser, or serve the folder with any static server.

## Deployment

Backend is hosted on Render, frontend on Netlify.
Live URLs will be added once deployed.
