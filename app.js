/* =========================================================
   SHUBAM
   Era Guide — Actor Search System

   Current foundation:
   - Actor → Era database
   - Live actor suggestions
   - Partial matching
   - Basic typo tolerance
   - Actor → Era result
   - Dark / Light mode
   - English / Telugu toggle foundation

   IMPORTANT:
   This actor list is temporary.
   Later, we can move it into:

   data/actors.json

   without changing the search system.
========================================================= */


/* =========================================================
   ACTOR DATABASE
========================================================= */

const actorsData = [

  /* =========================
     GOLDEN ERA
  ========================== */

  {
    name: "NTR",
    era: "Golden Era",
    eraId: "golden",
    colour: "#ffdf09"
  },

  {
    name: "ANR",
    era: "Golden Era",
    eraId: "golden",
    colour: "#ffdf09"
  },


  /* =========================
     MASS ERA
  ========================== */

  {
    name: "Chiranjeevi",
    era: "Mass Era",
    eraId: "mass",
    colour: "#ff751f"
  },

  {
    name: "Balakrishna",
    era: "Mass Era",
    eraId: "mass",
    colour: "#ff751f"
  },

  {
    name: "Venkatesh",
    era: "Mass Era",
    eraId: "mass",
    colour: "#ff751f"
  },

  {
    name: "Nagarjuna",
    era: "Mass Era",
    eraId: "mass",
    colour: "#ff751f"
  },


  /* =========================
     STARS ERA
  ========================== */

  {
    name: "Mahesh Babu",
    era: "Stars Era",
    eraId: "stars",
    colour: "#c538ff"
  },

  {
    name: "Prabhas",
    era: "Stars Era",
    eraId: "stars",
    colour: "#c538ff"
  },

  {
    name: "Allu Arjun",
    era: "Stars Era",
    eraId: "stars",
    colour: "#c538ff"
  },


  /* =========================
     NEW WAVE ERA
  ========================== */

  {
    name: "Vijay Deverakonda",
    era: "New Wave Era",
    eraId: "new-wave",
    colour: "#1de90b"
  },

  {
    name: "Kiran Abbavaram",
    era: "New Wave Era",
    eraId: "new-wave",
    colour: "#1de90b"
  }

];


/* =========================================================
   ELEMENTS
========================================================= */

const actorSearch =
  document.getElementById("actorSearch");

const actorSuggestions =
  document.getElementById("actorSuggestions");

const actorSearchButton =
  document.getElementById("actorSearchButton");

const actorSearchResult =
  document.getElementById("actorSearchResult");

const themeToggle =
  document.getElementById("themeToggle");

const langToggle =
  document.getElementById("langToggle");


/* =========================================================
   SEARCH STATE
========================================================= */

let selectedSuggestionIndex = -1;


/* =========================================================
   TEXT NORMALIZATION
========================================================= */

/*
   Makes searching more forgiving.

   Example:

   "Allu Arjun"
   "allu arjun"
   " ALLU   ARJUN "

   all become:

   "allu arjun"
*/

function normalizeText(text) {

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

}


/* =========================================================
   LEVENSHTEIN DISTANCE
========================================================= */

/*
   Used for basic typo tolerance.

   Example:

   "allu arjn"

   is close enough to:

   "allu arjun"

   to suggest it.
*/

function levenshteinDistance(a, b) {

  const matrix = [];


  for (let i = 0; i <= b.length; i++) {

    matrix[i] = [i];

  }


  for (let j = 0; j <= a.length; j++) {

    matrix[0][j] = j;

  }


  for (let i = 1; i <= b.length; i++) {

    for (let j = 1; j <= a.length; j++) {

      if (b.charAt(i - 1) === a.charAt(j - 1)) {

        matrix[i][j] =
          matrix[i - 1][j - 1];

      } else {

        matrix[i][j] =
          Math.min(

            matrix[i - 1][j] + 1,

            matrix[i][j - 1] + 1,

            matrix[i - 1][j - 1] + 1

          );

      }

    }

  }


  return matrix[b.length][a.length];

}


/* =========================================================
   ACTOR MATCH SCORE
========================================================= */

function getMatchScore(query, actorName) {

  const q =
    normalizeText(query);

  const name =
    normalizeText(actorName);


  if (!q) return 0;


  /* Exact match */

  if (name === q) {

    return 1000;

  }


  /* Starts with query */

  if (name.startsWith(q)) {

    return 800;

  }


  /* Any word starts with query */

  const words =
    name.split(" ");


  if (
    words.some(word =>
      word.startsWith(q)
    )
  ) {

    return 700;

  }


  /* Query appears anywhere */

  if (name.includes(q)) {

    return 600;

  }


  /* Individual query words */

  const queryWords =
    q.split(" ");


  let wordScore = 0;


  queryWords.forEach(queryWord => {

    words.forEach(word => {

      if (word.includes(queryWord)) {

        wordScore += 100;

      }

    });

  });


  if (wordScore > 0) {

    return 400 + wordScore;

  }


  /* Typo tolerance */

  const distance =
    levenshteinDistance(q, name);


  const allowedDistance =
    q.length <= 4
      ? 1
      : q.length <= 7
        ? 2
        : 3;


  if (distance <= allowedDistance) {

    return 200 - distance;

  }


  /*
     Also compare against individual words.

     This helps with:

     "arjn"

     → Allu Arjun
  */

  let closestWordDistance =
    Infinity;


  words.forEach(word => {

    const distance =
      levenshteinDistance(q, word);


    if (distance < closestWordDistance) {

      closestWordDistance =
        distance;

    }

  });


  if (
    closestWordDistance <=
    allowedDistance
  ) {

    return 150 - closestWordDistance;

  }


  return -1;

}


/* =========================================================
   FIND ACTOR MATCHES
========================================================= */

function findActorMatches(query) {

  const cleanQuery =
    normalizeText(query);


  if (!cleanQuery) {

    return [];

  }


  return actorsData

    .map(actor => ({

      actor,

      score:
        getMatchScore(
          cleanQuery,
          actor.name
        )

    }))

    .filter(item =>
      item.score >= 0
    )

    .sort(
      (a, b) =>
        b.score - a.score
    )

    .map(item =>
      item.actor
    );

}


/* =========================================================
   SHOW SUGGESTIONS
========================================================= */

function showSuggestions(matches) {

  if (!actorSuggestions) return;


  actorSuggestions.innerHTML = "";


  if (!matches.length) {

    hideSuggestions();

    return;

  }


  /*
     Limit suggestions so the dropdown
     doesn't become unnecessarily huge.
  */

  const visibleMatches =
    matches.slice(0, 8);


  visibleMatches.forEach(
    (actor, index) => {

      const button =
        document.createElement("button");


      button.type = "button";


      button.className =
        "actor-suggestion";


      button.setAttribute(
        "role",
        "option"
      );


      button.setAttribute(
        "data-index",
        index
      );


      button.innerHTML = `

        <span>
          ${escapeHTML(actor.name)}
        </span>

      `;


      button.addEventListener(
        "click",
        () => {

          selectSuggestion(actor);

        }
      );


      actorSuggestions.appendChild(
        button
      );

    }
  );


  selectedSuggestionIndex = -1;


  actorSuggestions.classList.add(
    "visible"
  );

}


/* =========================================================
   HIDE SUGGESTIONS
========================================================= */

function hideSuggestions() {

  if (!actorSuggestions) return;


  actorSuggestions.classList.remove(
    "visible"
  );


  actorSuggestions.innerHTML = "";


  selectedSuggestionIndex = -1;

}


/* =========================================================
   SELECT SUGGESTION
========================================================= */

function selectSuggestion(actor) {

  if (!actorSearch) return;


  actorSearch.value =
    actor.name;


  hideSuggestions();


  showActorResult(actor);

}


/* =========================================================
   KEYBOARD NAVIGATION
========================================================= */

function updateSuggestionHighlight() {

  if (!actorSuggestions) return;


  const suggestions =
    actorSuggestions.querySelectorAll(
      ".actor-suggestion"
    );


  suggestions.forEach(
    (item, index) => {

      item.classList.toggle(
        "active",
        index ===
        selectedSuggestionIndex
      );

    }
  );

}


function handleSuggestionKeyboard(event) {

  if (!actorSuggestions) return;


  const suggestions =
    actorSuggestions.querySelectorAll(
      ".actor-suggestion"
    );


  if (
    !actorSuggestions.classList.contains(
      "visible"
    )
  ) {

    return;

  }


  if (event.key === "ArrowDown") {

    event.preventDefault();


    selectedSuggestionIndex =
      Math.min(

        selectedSuggestionIndex + 1,

        suggestions.length - 1

      );


    updateSuggestionHighlight();

  }


  if (event.key === "ArrowUp") {

    event.preventDefault();


    selectedSuggestionIndex =
      Math.max(
        selectedSuggestionIndex - 1,
        0
      );


    updateSuggestionHighlight();

  }


  if (event.key === "Enter") {

    if (
      selectedSuggestionIndex >= 0 &&
      suggestions[selectedSuggestionIndex]
    ) {

      event.preventDefault();


      suggestions[
        selectedSuggestionIndex
      ].click();

    } else {

      searchActor();

    }

  }


  if (event.key === "Escape") {

    hideSuggestions();

  }

}


/* =========================================================
   SEARCH ACTOR
========================================================= */

function searchActor() {

  if (!actorSearch) return;


  const query =
    actorSearch.value.trim();


  hideSuggestions();


  if (!query) {

    clearActorResult();

    return;

  }


  const matches =
    findActorMatches(query);


  /*
     Exact actor found first.
  */

  const exactMatch =
    matches.find(
      actor =>
        normalizeText(actor.name) ===
        normalizeText(query)
    );


  if (exactMatch) {

    showActorResult(
      exactMatch
    );

    return;

  }


  /*
     If there is a strong suggestion,
     use the best match.

     This means a typo such as:

     "allu arjn"

     can still find:

     Allu Arjun
  */

  if (
    matches.length > 0 &&
    getMatchScore(
      query,
      matches[0].name
    ) >= 150
  ) {

    showActorResult(
      matches[0]
    );

    return;

  }


  /*
     Otherwise:
     No results.
  */

  showNoActorResult();

}


/* =========================================================
   SHOW ACTOR RESULT
========================================================= */

/* =========================================================
   SHOW ACTOR RESULT
========================================================= */

function showActorResult(actor) {

  if (!actorSearchResult) return;


  const iconSVG =
    eraIcons[actor.eraId] || "";


  actorSearchResult.innerHTML = `

    <div
      class="actor-result-card"
      style="--result-colour: ${actor.colour};"
    >

      <span
        class="actor-result-colour"
        style="
          background: ${actor.colour};
          color: ${actor.colour};
        "
      ></span>

      <div class="actor-result-content">

        <span class="result-label">
          This actor belongs to
        </span>

        <h4>
          ${escapeHTML(actor.name)}
        </h4>

        <span
          class="result-era"
          style="color: ${actor.colour};"
        >
          <span
            class="result-era-icon"
            style="color: ${actor.colour}; display: inline-flex; vertical-align: middle; margin-right: 6px;"
          >
            ${iconSVG}
          </span>
          ${escapeHTML(actor.era)}
        </span>

      </div>

    </div>

  `;

}
/* =========================================================
   ERA ICONS (SVG paths, matched to your era-colour-list)
========================================================= */

const eraIcons = {

  golden: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-3-7z" />
      <path d="M3 20h18" />
    </svg>
  `,

  mass: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  `,

  stars: `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  `,

  "new-wave": `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  `

};
/* =========================================================
   NO RESULT
========================================================= */

function showNoActorResult() {

  if (!actorSearchResult) return;


  actorSearchResult.innerHTML = `

    <div class="actor-no-result">

      <strong>
        Sorry, no results found.
      </strong>

      <span>
        We couldn't find that actor in the SHUBAM database.
      </span>

    </div>

  `;

}


/* =========================================================
   CLEAR RESULT
========================================================= */

function clearActorResult() {

  if (!actorSearchResult) return;


  actorSearchResult.innerHTML = "";

}


/* =========================================================
   LIVE SEARCH SUGGESTIONS
========================================================= */

if (actorSearch) {

  actorSearch.addEventListener(
    "input",
    () => {

      const query =
        actorSearch.value.trim();


      clearActorResult();


      if (!query) {

        hideSuggestions();

        return;

      }


      const matches =
        findActorMatches(query);


      showSuggestions(matches);

    }
  );


  actorSearch.addEventListener(
    "keydown",
    handleSuggestionKeyboard
  );

}


/* =========================================================
   SEARCH BUTTON
========================================================= */

if (actorSearchButton) {

  actorSearchButton.addEventListener(
    "click",
    searchActor
  );

}


/* =========================================================
   CLICK OUTSIDE → CLOSE SUGGESTIONS
========================================================= */

document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".actor-search-input-wrap"
      )
    ) {

      hideSuggestions();

    }

  }
);


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");


  div.textContent =
    value;


  return div.innerHTML;

}


/* =========================================================
   THEME TOGGLE
========================================================= */

function initialiseTheme() {

  if (!themeToggle) return;


  const savedTheme =
    localStorage.getItem(
      "shubam-theme"
    );


  if (savedTheme === "light") {

    document.body.classList.add(
      "light"
    );

    themeToggle.textContent = "☾";

  } else {

    document.body.classList.remove(
      "light"
    );

    themeToggle.textContent = "☼";

  }


  themeToggle.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light"
      );


      const isLight =
        document.body.classList.contains(
          "light"
        );


      localStorage.setItem(
        "shubam-theme",
        isLight
          ? "light"
          : "dark"
      );


      themeToggle.textContent =
        isLight
          ? "☾"
          : "☼";

    }
  );

}


/* =========================================================
   LANGUAGE TOGGLE FOUNDATION
========================================================= */

/*
   We are NOT inventing your Telugu translations.

   When you give me the official Telugu text,
   we will put it into this system.

   For now, the toggle remembers the user's choice
   without changing your English content.
*/

let currentLanguage =
  localStorage.getItem(
    "shubam-language"
  ) || "en";


function initialiseLanguage() {

  if (!langToggle) return;


  updateLanguageButton();


  langToggle.addEventListener(
    "click",
    () => {

      currentLanguage =
        currentLanguage === "en"
          ? "te"
          : "en";


      localStorage.setItem(
        "shubam-language",
        currentLanguage
      );


      updateLanguageButton();

    }
  );

}


function updateLanguageButton() {

  if (!langToggle) return;


  if (currentLanguage === "en") {

    langToggle.textContent =
      "తెలుగు";

    langToggle.title =
      "Switch to Telugu";

  } else {

    langToggle.textContent =
      "EN";

    langToggle.title =
      "Switch to English";

  }

}


/* =========================================================
   INITIALISE
========================================================= */

initialiseTheme();

initialiseLanguage();


/* =========================================================
   FUTURE DATA ARCHITECTURE
========================================================= */

/*

   LATER:

   Instead of keeping actors here, we can have:

   data/
      actors.json
      cards.json
      movies.json
      memes.json
      faq.json

   Example actors.json:

   [
     {
       "name": "Allu Arjun",
       "era": "Stars Era",
       "eraId": "stars",
       "colour": "#c538ff"
     }
   ]

   Then this JavaScript can load the database
   automatically.

   This means:

   ADD 50 ACTORS
       ↓
   Update actors.json

   ADD 500 MOVIES
       ↓
   Update movies.json

   CHANGE NOTHING
   in the actual website structure.
*/


/* =========================================================
   END — SHUBAM ERA GUIDE
========================================================= */
