const DATA_URLS = {
  cards: "data/cards.json",
  movies: "data/movies.json",
  eras: "data/eras.json",
  memes: "data/memes.json",
  faq: "data/faq.json"
};

const state = { cards: [], movies: [], eras: [], memes: [], faq: [] };

const eraMeta = {
  golden: { icon:"🟡", label:"Golden Era", cls:"golden", color:"#ffdf09" },
  mass: { icon:"🟠", label:"Mass Era", cls:"mass", color:"#ff751f" },
  stars: { icon:"🟣", label:"Stars Era", cls:"stars", color:"#c538ff" },
  "new-wave": { icon:"🟢", label:"New Wave Era", cls:"new-wave", color:"#1de90b" }
};

async function loadData() {
  for (const [key, url] of Object.entries(DATA_URLS)) {
    try {
      const res = await fetch(url);
      state[key] = await res.json();
    } catch (e) {
      console.warn(`Could not load ${url}`, e);
      state[key] = [];
    }
  }
  renderAll();
}

function renderAll() {
  renderCards();
  renderEras();
  renderMovies();
  renderMemes();
  renderFaq();
  document.getElementById("cardSummary").innerHTML = `
    <span>🎴 113 physical cards</span>
    <span>🔢 72 number cards</span>
    <span>⚡ 40 special cards</span>
    <span>👑 1 AADHI</span>`;
}

function eraLabel(era) {
  return eraMeta[era] ? `${eraMeta[era].icon} ${eraMeta[era].label}` : "No Era";
}

function renderCards() {
  const q = document.getElementById("cardSearch").value.toLowerCase();
  const type = document.getElementById("cardTypeFilter").value;
  const era = document.getElementById("cardEraFilter").value;
  const cards = state.cards.filter(c => {
    const matchesQ = `${c.name} ${c.type} ${c.era || ""} ${c.number || ""}`.toLowerCase().includes(q);
    const matchesType = type === "all" || c.type === type;
    const matchesEra = era === "all" || (era === "none" ? !c.era : c.era === era);
    return matchesQ && matchesType && matchesEra;
  });

  document.getElementById("cardsGrid").innerHTML = cards.map(c => {
    const meta = c.era ? eraMeta[c.era] : eraMeta["none"];
    return `<article class="card-item">
      <div class="card-chip ${meta ? "era-"+meta.cls : "era-none"}">${c.display || c.number || "★"}</div>
      <div class="meta">${c.count || 1} card${(c.count||1) === 1 ? "" : "s"} · ${c.type}</div>
      <h3>${c.name}</h3>
      <div class="meta">${c.era ? eraLabel(c.era) : "No Era / No Number"}</div>
      <p>${c.description || ""}</p>
    </article>`;
  }).join("") || `<div class="card-item"><h3>No cards found</h3><p class="meta">Try another search or filter.</p></div>`;
}

function renderEras() {
  document.getElementById("eraGrid").innerHTML = state.eras.map(e => `
    <article class="era-card ${e.id}">
      <div class="era-icon">${eraMeta[e.id]?.icon || "🎬"}</div>
      <h3>${e.name}</h3>
      <p>${e.description}</p>
      <div class="actor-list"><strong>Current actors:</strong><br>${e.actors.join(", ")}</div>
    </article>`).join("");
}

function renderMovies() {
  const q = document.getElementById("movieSearch").value.toLowerCase();
  const era = document.getElementById("movieEraFilter").value;
  const movies = state.movies.filter(m => {
    const hay = `${m.title} ${m.actor || ""} ${m.era || ""}`.toLowerCase();
    return hay.includes(q) && (era === "all" || m.era === era);
  });
  document.getElementById("movieCount").textContent = `${movies.length} movie${movies.length === 1 ? "" : "s"} shown · Collection grows independently from the 113 physical cards.`;
  document.getElementById("movieGrid").innerHTML = movies.map(m => `
    <article class="movie-item">
      <div class="meta">${eraLabel(m.era)} · ${m.letters ? m.letters + " letters" : "Letter count pending"}</div>
      <h3>${m.title}</h3>
      <div class="meta">${m.actor || ""}</div>
      ${m.note ? `<div class="tag">${m.note}</div>` : ""}
    </article>`).join("") || `<div class="movie-item"><h3>No movies found</h3><p class="meta">Your collection can be populated in data/movies.json.</p></div>`;
}

function renderMemes() {
  const q = document.getElementById("memeSearch").value.toLowerCase();
  const era = document.getElementById("memeEraFilter").value;
  const memes = state.memes.filter(m => {
    return `${m.dialogue} ${m.actor || ""}`.toLowerCase().includes(q) && (era === "all" || m.era === era);
  });
  document.getElementById("memeGrid").innerHTML = memes.map(m => `
    <article class="meme-item">
      <div class="meta">${eraLabel(m.era)}</div>
      <blockquote>“${m.dialogue}”</blockquote>
      <div class="tag">${m.actor || "Meme dialogue"}</div>
    </article>`).join("") || `<div class="meme-item"><h3>No meme dialogues yet</h3><p class="meta">Add them later in data/memes.json.</p></div>`;
}

function renderFaq() {
  document.getElementById("faqList").innerHTML = state.faq.map((f, i) => `
    <article class="faq-item">
      <button class="faq-q" aria-expanded="false">${f.question}<span>＋</span></button>
      <div class="faq-a">${f.answer}</div>
    </article>`).join("");
  document.querySelectorAll(".faq-q").forEach(btn => btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("open");
    btn.setAttribute("aria-expanded", item.classList.contains("open"));
    btn.querySelector("span").textContent = item.classList.contains("open") ? "−" : "＋";
  }));
}

["cardSearch","cardTypeFilter","cardEraFilter"].forEach(id => document.getElementById(id).addEventListener("input", renderCards));
["movieSearch","movieEraFilter"].forEach(id => document.getElementById(id).addEventListener("input", renderMovies));
["memeSearch","memeEraFilter"].forEach(id => document.getElementById(id).addEventListener("input", renderMemes));

document.getElementById("randomMovie").addEventListener("click", () => {
  if (!state.movies.length) return alert("The movie collection is ready for your data.");
  const movie = state.movies[Math.floor(Math.random() * state.movies.length)];
  document.getElementById("movieSearch").value = movie.title;
  document.getElementById("movieEraFilter").value = "all";
  renderMovies();
  document.getElementById("movies").scrollIntoView({behavior:"smooth"});
});

document.getElementById("themeToggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("shubham-theme", next);
});

const savedTheme = localStorage.getItem("shubham-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

document.getElementById("langToggle").addEventListener("click", () => {
  alert("Telugu content is structured into the site and can be added to the data/content layer when you provide the translations.");
});

document.getElementById("movieForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("formNote").textContent = "Suggestion captured for review. To connect this form to a real submission service, add the endpoint later.";
  e.target.reset();
});

loadData();
