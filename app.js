/* =========================================================
   SHUBAM
   Write. Shuffle. Play.

   Main website logic

   IMPORTANT:
   Content is intentionally kept data-driven.
   Later we can move/update:
   - 113 physical cards
   - movie collection
   - meme dialogues
   - era / actor information
   - FAQs

   without rebuilding the website.
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let cardsData = [];
let moviesData = [];
let memesData = [];
let erasData = [];
let faqData = [];

let currentLanguage = "en";


/* =========================================================
   DEFAULT / STARTER DATA

   These are temporary foundation entries.
   We will replace them with your official data later.
========================================================= */


/* ---------- ERAS ---------- */

erasData = [

  {
    id: "golden",
    name: "Golden Era",
    colour: "#ffdf09",
    emoji: "🟡",
    actors: [
      "NTR",
      "ANR"
    ],
    description:
      "The Golden Era represents the classic generation of Telugu cinema."
  },

  {
    id: "mass",
    name: "Mass Era",
    colour: "#ff751f",
    emoji: "🟠",
    actors: [
      "Chiranjeevi",
      "Balakrishna",
      "Venkatesh",
      "Nagarjuna"
    ],
    description:
      "The Mass Era represents the generation of iconic mass and family entertainers."
  },

  {
    id: "stars",
    name: "Stars Era",
    colour: "#c538ff",
    emoji: "🟣",
    actors: [
      "Mahesh Babu",
      "Prabhas",
      "Allu Arjun"
    ],
    description:
      "The Stars Era represents the modern generation of Telugu cinema stars."
  },

  {
    id: "new-wave",
    name: "New Wave Era",
    colour: "#1de90b",
    emoji: "🟢",
    actors: [
      "Vijay Deverakonda",
      "Kiran Abbavaram"
    ],
    description:
      "The New Wave Era represents the newer generation of Telugu cinema."
  }

];


/* ---------- STARTER CARDS ---------- */

cardsData = [

  {
    id: "sample-1",
    name: "Sample Number Card",
    type: "number",
    number: 3,
    era: "stars",
    description:
      "Temporary card entry. Official card data will be added later."
  },

  {
    id: "sample-dd",
    name: "Double Dhamaka",
    type: "power",
    era: "mass",
    description:
      "Give any two cards from your hand to one player when the official conditions are met."
  },

  {
    id: "sample-cut",
    name: "CUT",
    type: "power",
    era: "mass",
    description:
      "Can stop Double Dhamaka or the +4 effect of All Time Industry Hittu when the official conditions are met."
  },

  {
    id: "sample-interval",
    name: "Interval Bang",
    type: "power",
    era: "golden",
    description:
      "The next player misses one turn."
  },

  {
    id: "sample-bomma",
    name: "Blockbuster Bomma",
    type: "wild",
    era: "stars",
    description:
      "Changes the current Era to the Era of the card."
  },

  {
    id: "sample-atih",
    name: "All Time Industry Hittu",
    type: "power",
    era: "new-wave",
    description:
      "Reverse the direction and create the +4 effect."
  },

  {
    id: "aadhi",
    name: "AADHI",
    type: "unique",
    era: null,
    description:
      "The unique ultimate power card. Swap your entire hand with another player's entire hand."
  }

];


/* ---------- STARTER MOVIES ---------- */

moviesData = [

  {
    id: "sample-movie",
    title: "Sample Movie",
    actor: "Sample Actor",
    era: "stars",
    notes: "Temporary database entry."
  }

];


/* ---------- STARTER MEMES ---------- */

memesData = [

  {
    id: "sample-meme",
    dialogue: "Sample meme dialogue",
    era: "mass",
    notes: "Temporary entry."
  }

];


/* ---------- FAQ ---------- */

faqData = [

  {
    question: "How many players can play SHUBAM?",
    answer:
      "SHUBAM can be played by 2–10 players."
  },

  {
    question: "How many cards are in the physical deck?",
    answer:
      "The physical SHUBAM deck contains 113 playable/reference cards as defined by the official card list."
  },

  {
    question: "What are the four Eras?",
    answer:
      "Golden Era, Mass Era, Stars Era and New Wave Era."
  },

  {
    question: "Can I suggest a movie?",
    answer:
      "Yes. Use the Submit a Movie section to suggest a movie that is not currently in the online collection."
  },

  {
    question: "Will the movie collection change?",
    answer:
      "Yes. The online collection is designed to grow over time without changing the website structure."
  }

];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initialiseTheme();

  initialiseLanguage();

  renderEras();

  renderCards();

  renderMovies();

  renderMemes();

  renderFAQ();

  initialiseNavigation();

  initialiseSearch();

  initialiseRandomMovie();

  initialiseSubmitForm();

});


/* =========================================================
   THEME
========================================================= */

function initialiseTheme() {

  const toggle = document.getElementById("themeToggle");

  if (!toggle) return;


  const savedTheme =
    localStorage.getItem("shubam-theme");


  if (savedTheme === "light") {

    document.body.classList.add("light");

    toggle.textContent = "☾";

  } else {

    document.body.classList.remove("light");

    toggle.textContent = "☼";

  }


  toggle.addEventListener("click", () => {

    document.body.classList.toggle("light");


    const isLight =
      document.body.classList.contains("light");


    localStorage.setItem(
      "shubam-theme",
      isLight ? "light" : "dark"
    );


    toggle.textContent =
      isLight ? "☾" : "☼";

  });

}


/* =========================================================
   LANGUAGE
========================================================= */

function initialiseLanguage() {

  const toggle =
    document.getElementById("langToggle");

  if (!toggle) return;


  const savedLanguage =
    localStorage.getItem("shubam-language");


  if (savedLanguage === "te") {

    currentLanguage = "te";

    toggle.textContent = "EN";

    applyTelugu();

  } else {

    currentLanguage = "en";

    toggle.textContent = "తెలుగు";

    applyEnglish();

  }


  toggle.addEventListener("click", () => {

    if (currentLanguage === "en") {

      currentLanguage = "te";

      localStorage.setItem(
        "shubam-language",
        "te"
      );

      toggle.textContent = "EN";

      applyTelugu();

    } else {

      currentLanguage = "en";

      localStorage.setItem(
        "shubam-language",
        "en"
      );

      toggle.textContent = "తెలుగు";

      applyEnglish();

    }

  });

}


/* =========================================================
   LANGUAGE SYSTEM

   NOTE:
   You said you will provide the Telugu translations.
   Therefore these are placeholders only.
========================================================= */

const translations = {

  en: {

    heroText:
      "Choose your movie. Write it right. Play your cards. Be the first to empty your hand.",

    players:
      "Players",

    physicalCards:
      "Physical Cards",

    eras:
      "Eras",

    howTitle:
      "How to Play",

    howIntro:
      "Simple enough to learn quickly. Strategic enough to keep every round interesting.",

    getReady:
      "Get Ready",

    startGameTitle:
      "Start",

    match:
      "Match",

    powers:
      "Use Powers",

    shubamCall:
      "Say SHUBAM",

    finish:
      "Finish",

    cardsTitle:
      "All Cards",

    writeTitle:
      "How to Write Cards",

    eraTitle:
      "Era Guide",

    moviesTitle:
      "Movie Collection",

    memesTitle:
      "Meme Dialogues",

    faqTitle:
      "FAQ",

    submitTitle:
      "Submit a Movie"

  },


  te: {

    heroText:
      "TELUGU TRANSLATION WILL BE PROVIDED BY YOU.",

    players:
      "PLAYERS",

    physicalCards:
      "PHYSICAL CARDS",

    eras:
      "ERAS",

    howTitle:
      "HOW TO PLAY",

    howIntro:
      "TELUGU TRANSLATION WILL BE PROVIDED BY YOU.",

    getReady:
      "GET READY",

    startGameTitle:
      "START",

    match:
      "MATCH",

    powers:
      "USE POWERS",

    shubamCall:
      "SAY SHUBAM",

    finish:
      "FINISH",

    cardsTitle:
      "ALL CARDS",

    writeTitle:
      "HOW TO WRITE CARDS",

    eraTitle:
      "ERA GUIDE",

    moviesTitle:
      "MOVIE COLLECTION",

    memesTitle:
      "MEME DIALOGUES",

    faqTitle:
      "FAQ",

    submitTitle:
      "SUBMIT A MOVIE"

  }

};


function applyLanguage(language) {

  const dictionary =
    translations[language];

  if (!dictionary) return;


  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      const key =
        element.getAttribute("data-i18n");


      if (dictionary[key]) {

        element.textContent =
          dictionary[key];

      }

    });

}


function applyEnglish() {

  applyLanguage("en");

}


function applyTelugu() {

  applyLanguage("te");

}


/* =========================================================
   ERA GUIDE
========================================================= */

function renderEras() {

  const container =
    document.getElementById("eraGrid");

  if (!container) return;


  container.innerHTML = "";


  erasData.forEach(era => {

    const card =
      document.createElement("article");


    card.className = "era-card";


    card.style.setProperty(
      "--era-colour",
      era.colour
    );


    const actors =
      era.actors.join(", ");


    card.innerHTML = `

      <span class="eyebrow">
        ${era.emoji} ${era.id}
      </span>

      <h3>
        ${era.name}
      </h3>

      <p>
        ${era.description}
      </p>

      <div class="actors">
        Actors: ${actors}
      </div>

    `;


    container.appendChild(card);

  });

}


/* =========================================================
   CARD RENDERING
========================================================= */

function renderCards(
  searchTerm = "",
  typeFilter = "all",
  eraFilter = "all"
) {

  const container =
    document.getElementById("cardsGrid");

  const summary =
    document.getElementById("cardSummary");


  if (!container) return;


  const search =
    searchTerm.trim().toLowerCase();


  const filtered =
    cardsData.filter(card => {

      const matchesSearch =
        !search ||

        card.name
          .toLowerCase()
          .includes(search) ||

        card.description
          .toLowerCase()
          .includes(search);


      const matchesType =
        typeFilter === "all" ||
        card.type === typeFilter;


      const matchesEra =
        eraFilter === "all" ||

        (eraFilter === "none" && !card.era) ||

        card.era === eraFilter;


      return (
        matchesSearch &&
        matchesType &&
        matchesEra
      );

    });


  container.innerHTML = "";


  if (filtered.length === 0) {

    container.innerHTML = `

      <div class="empty-state">
        No cards found.
      </div>

    `;

  }


  filtered.forEach(card => {

    const element =
      document.createElement("article");


    element.className = "card-item";


    const era =
      erasData.find(
        item => item.id === card.era
      );


    const colour =
      era
        ? era.colour
        : "#ffffff";


    element.style.setProperty(
      "--card-colour",
      colour
    );


    const eraName =
      era
        ? `${era.emoji} ${era.name}`
        : "No Era";


    element.innerHTML = `

      <span class="movie-era">
        ${eraName}
      </span>

      <h3>
        ${card.name}
      </h3>

      <p>
        ${card.description}
      </p>

    `;


    container.appendChild(element);

  });


  if (summary) {

    summary.textContent =
      `${filtered.length} card${filtered.length === 1 ? "" : "s"} shown`;

  }

}


/* =========================================================
   MOVIE COLLECTION
========================================================= */

function renderMovies(
  searchTerm = "",
  eraFilter = "all"
) {

  const container =
    document.getElementById("movieGrid");

  const count =
    document.getElementById("movieCount");


  if (!container) return;


  const search =
    searchTerm.trim().toLowerCase();


  const filtered =
    moviesData.filter(movie => {

      const matchesSearch =
        !search ||

        movie.title
          .toLowerCase()
          .includes(search) ||

        movie.actor
          .toLowerCase()
          .includes(search);


      const matchesEra =
        eraFilter === "all" ||
        movie.era === eraFilter;


      return (
        matchesSearch &&
        matchesEra
      );

    });


  container.innerHTML = "";


  if (filtered.length === 0) {

    container.innerHTML = `

      <div class="empty-state">

        No movies found.

      </div>

    `;

  }


  filtered.forEach(movie => {

    const element =
      document.createElement("article");


    element.className =
      "movie-card";


    const era =
      erasData.find(
        item => item.id === movie.era
      );


    const eraName =
      era
        ? `${era.emoji} ${era.name}`
        : "Unknown Era";


    element.innerHTML = `

      <span class="movie-era">
        ${eraName}
      </span>

      <h3>
        ${movie.title}
      </h3>

      <p>
        ${movie.actor}
      </p>

      ${
        movie.notes
          ? `<p>${movie.notes}</p>`
          : ""
      }

    `;


    container.appendChild(element);

  });


  if (count) {

    count.textContent =
      `${filtered.length} movie${filtered.length === 1 ? "" : "s"} shown`;

  }

}


/* =========================================================
   MEME COLLECTION
========================================================= */

function renderMemes(
  searchTerm = "",
  eraFilter = "all"
) {

  const container =
    document.getElementById("memeGrid");


  if (!container) return;


  const search =
    searchTerm.trim().toLowerCase();


  const filtered =
    memesData.filter(meme => {

      const matchesSearch =
        !search ||

        meme.dialogue
          .toLowerCase()
          .includes(search);


      const matchesEra =
        eraFilter === "all" ||
        meme.era === eraFilter;


      return (
        matchesSearch &&
        matchesEra
      );

    });


  container.innerHTML = "";


  if (filtered.length === 0) {

    container.innerHTML = `

      <div class="empty-state">
        No meme dialogues found.
      </div>

    `;

  }


  filtered.forEach(meme => {

    const element =
      document.createElement("article");


    element.className =
      "meme-card";


    const era =
      erasData.find(
        item => item.id === meme.era
      );


    element.innerHTML = `

      <blockquote>
        ${meme.dialogue}
      </blockquote>

      <small>
        ${era ? era.emoji + " " + era.name : ""}
      </small>

    `;


    container.appendChild(element);

  });

}


/* =========================================================
   FAQ
========================================================= */

function renderFAQ() {

  const container =
    document.getElementById("faqList");


  if (!container) return;


  container.innerHTML = "";


  faqData.forEach((faq, index) => {

    const item =
      document.createElement("article");


    item.className =
      "faq-item";


    item.innerHTML = `

      <button
        class="faq-question"
        type="button"
        aria-expanded="false"
      >

        <span>
          ${faq.question}
        </span>

        <span>
          +
        </span>

      </button>

      <div
        class="faq-answer"
        hidden
      >
        ${faq.answer}
      </div>

    `;


    const button =
      item.querySelector(".faq-question");


    const answer =
      item.querySelector(".faq-answer");


    button.addEventListener("click", () => {

      const open =
        button.getAttribute("aria-expanded")
          === "true";


      button.setAttribute(
        "aria-expanded",
        String(!open)
      );


      answer.hidden = open;


      button.lastElementChild.textContent =
        open ? "+" : "−";

    });


    container.appendChild(item);

  });

}


/* =========================================================
   SEARCH / FILTERS
========================================================= */

function initialiseSearch() {

  const cardSearch =
    document.getElementById("cardSearch");

  const cardType =
    document.getElementById("cardTypeFilter");

  const cardEra =
    document.getElementById("cardEraFilter");


  function updateCards() {

    renderCards(

      cardSearch
        ? cardSearch.value
        : "",

      cardType
        ? cardType.value
        : "all",

      cardEra
        ? cardEra.value
        : "all"

    );

  }


  if (cardSearch) {

    cardSearch.addEventListener(
      "input",
      updateCards
    );

  }


  if (cardType) {

    cardType.addEventListener(
      "change",
      updateCards
    );

  }


  if (cardEra) {

    cardEra.addEventListener(
      "change",
      updateCards
    );

  }


  const movieSearch =
    document.getElementById("movieSearch");

  const movieEra =
    document.getElementById("movieEraFilter");


  function updateMovies() {

    renderMovies(

      movieSearch
        ? movieSearch.value
        : "",

      movieEra
        ? movieEra.value
        : "all"

    );

  }


  if (movieSearch) {

    movieSearch.addEventListener(
      "input",
      updateMovies
    );

  }


  if (movieEra) {

    movieEra.addEventListener(
      "change",
      updateMovies
    );

  }


  const memeSearch =
    document.getElementById("memeSearch");

  const memeEra =
    document.getElementById("memeEraFilter");


  function updateMemes() {

    renderMemes(

      memeSearch
        ? memeSearch.value
        : "",

      memeEra
        ? memeEra.value
        : "all"

    );

  }


  if (memeSearch) {

    memeSearch.addEventListener(
      "input",
      updateMemes
    );

  }


  if (memeEra) {

    memeEra.addEventListener(
      "change",
      updateMemes
    );

  }

}


/* =========================================================
   RANDOM MOVIE
========================================================= */

function initialiseRandomMovie() {

  const button =
    document.getElementById("randomMovie");


  if (!button) return;


  button.addEventListener("click", () => {

    if (moviesData.length === 0) return;


    const randomIndex =
      Math.floor(
        Math.random() * moviesData.length
      );


    const movie =
      moviesData[randomIndex];


    const movieSearch =
      document.getElementById("movieSearch");


    if (movieSearch) {

      movieSearch.value =
        movie.title;

    }


    renderMovies(
      movie.title,
      "all"
    );


    const movieSection =
      document.getElementById("movies");


    if (movieSection) {

      movieSection.scrollIntoView({
        behavior: "smooth"
      });

    }

  });

}


/* =========================================================
   SUBMIT MOVIE
========================================================= */

function initialiseSubmitForm() {

  const form =
    document.getElementById("movieForm");

  const note =
    document.getElementById("formNote");


  if (!form) return;


  form.addEventListener("submit", event => {

    event.preventDefault();


    const formData =
      new FormData(form);


    const movie =
      formData.get("movie");


    const actor =
      formData.get("actor");


    const notes =
      formData.get("notes");


    /*
      IMPORTANT:

      This currently does NOT add the submission
      directly to the official collection.

      Later we can connect this to:
      - GitHub Issues
      - Google Forms
      - Formspree
      - a database
      - another backend

      depending on how you want submissions handled.
    */


    console.log(
      "SHUBAM Movie Submission:",
      {
        movie,
        actor,
        notes
      }
    );


    if (note) {

      note.textContent =
        "Thank you! Your movie suggestion has been recorded for review.";

    }


    form.reset();

  });

}


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

function initialiseNavigation() {

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener("click", event => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {

          return;

        }


        const target =
          document.querySelector(targetId);


        if (!target) return;


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });

}


/* =========================================================
   FUTURE DATA LOADING FOUNDATION

   Later we can replace the temporary arrays above with:

   /data/cards.json
   /data/movies.json
   /data/memes.json
   /data/eras.json
   /data/faq.json

   Then the website can fetch them without changing
   the actual website structure.

   Example future function:

   async function loadData() {

      cardsData =
        await fetch("data/cards.json")
          .then(response => response.json());

      moviesData =
        await fetch("data/movies.json")
          .then(response => response.json());

      memesData =
        await fetch("data/memes.json")
          .then(response => response.json());

      erasData =
        await fetch("data/eras.json")
          .then(response => response.json());

      faqData =
        await fetch("data/faq.json")
          .then(response => response.json());

      renderEverything();
   }

========================================================= */


/* =========================================================
   END OF SHUBAM APP
========================================================= */
