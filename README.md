# SHUBAM — GitHub Pages Website

Write. Shuffle. Play.

## Folder structure

- `index.html` — website structure
- `style.css` — visual design, responsive layout, dark/light themes
- `app.js` — search, filters, random movie, FAQ and UI behavior
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
