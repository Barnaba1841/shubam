# SHUBHAM — GitHub Pages Website

Write. Shuffle. Play.

This project is intentionally data-driven.

## Folder structure

- `index.html` — website structure
- `style.css` — visual design, responsive layout, dark/light themes
- `app.js` — search, filters, random movie, FAQ and UI behavior
- `assets/shubham-logo.png` — official logo supplied for this project
- `data/cards.json` — physical 113-card reference
- `data/eras.json` — Era → actor classification
- `data/movies.json` — growing online movie collection
- `data/memes.json` — growing meme-dialogue collection
- `data/faq.json` — FAQ collection

## Updating the website

For normal content updates, edit the JSON files inside `data/`.

Examples:

- Add 50 movies → update `data/movies.json`
- Add meme dialogues → update `data/memes.json`
- Add FAQs → update `data/faq.json`
- Update the official actor list → update `data/eras.json`
- Update physical card information → update `data/cards.json`

You do **not** need to rebuild the website for these content updates.

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files and folders while keeping the same structure.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Select your main branch and `/ (root)`.
6. Save.

GitHub will provide the public Pages URL.

## Important

The starter data contains only the actors and card structure currently supplied. Replace placeholder movie data with the official Shubham collection when ready.

The site is designed so the fixed game rules and growing content remain separate.
