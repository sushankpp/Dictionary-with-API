const mainContainer = document.getElementById('main-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const body = document.getElementById('body');
const themeToggle = document.getElementById('toggler')
const checkbox = document.getElementById('theme-checkbox')

checkbox.addEventListener('change', ()=>{
  body.classList.toggle('dark');
})

let word = 'word';

fetchAndDisplay(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

searchBtn.addEventListener('click', () => {
  word = searchInput.value.trim();

  if (word) {
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetchAndDisplay(API_URL);
  } else {
    console.log('Please enter a word');
  }
});

function createResultContainer(words) {
  const resultContainerEl = document.createElement('section');

  if (!Array.isArray(words) || words.length === 0) {
    resultContainerEl.innerHTML = '<p>No words found</p>';
    return resultContainerEl;
  }

  const word = words[0];

  resultContainerEl.innerHTML = `
        <div class="keymeaning">
          <div class="initial-meanings">
            <h1>${word.word || 'NO words found'}</h1>
            <p class="phonetic">${word.phonetic || 'NO phonetics found'}</p>
          </div>
          ${generatePhoneticsHTML(word.phonetics)}
          </div>
          ${generateMeaningsHTML(word.meanings)}
      `;

  return resultContainerEl;
}

function generatePhoneticsHTML(phonetics) {
  if (!phonetics || phonetics.length === 0) {
    return '';
  }

  const validAudio = phonetics.find((phoneticsObj) => phoneticsObj.audio);

  if (!validAudio) {
    return '';
  }

  return `
      <summary class="audio-section">
        <i class="fa-duotone fa-play play-audio"></i>
        <audio
          src="${validAudio.audio || 'no audio found'}"
          class="audio"
          controls
        ></audio>
      </summary>
    `;
}

function generateMeaningsHTML(meanings) {
  if (!meanings || meanings.length === 0) {
    return '';
  }

  return meanings
    .map(
      (meaningObj) =>
        `
          <summary class="meaning">
            <h2 class="part-of-speech">${
              meaningObj.partOfSpeech || 'no part of speech found'
            }</h2>
            <p class="text">meaning</p>
            <ul class="definition-lists">
              ${generateMeaningList(meaningObj.definitions)}
            </ul>
            <p class="synonyms">
              synonyms: <span class="value">${
                meaningObj.synonyms
                  ? meaningObj.synonyms.join(', ')
                  : 'no synonyms found'
              }</span>
            </p>
          </summary>
        `
    )
    .join('');
}

function generateMeaningList(definitions) {
  if (definitions === 0 || !definitions) {
    return '<li> No defnition found </li>';
  }

  return definitions
    .map(
      (definition, index) =>
        `
        <li>${definition.definition} </li>
    `
    )
    .join('');
}

function fetchAndDisplay(url) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const resultCont = createResultContainer(data);
      mainContainer.innerHTML = '';
      mainContainer.appendChild(resultCont);
    })
    .catch((error) => {
      console.log(error);
    });
}
