import  * as utils  from './utils.js'; 
import  * as data  from './data.js'; 
const darkModePreference = localStorage.getItem('darkMode');
const mainContainer = document.querySelector('.moves-container')




function populateMoveContainerSkeletons() {
  let mainContainerHTML = '';
  data.validTypes.forEach((type) => {
    mainContainerHTML += `
      <div id="${type}" class="move-type-container">
        ${utils.capitalizeFirstLetter(type)} Type
        <div class="type-name-underline"></div>
         <div class="moves-grid-box"></div>
      </div>
    `
  })
  mainContainer.innerHTML = mainContainerHTML

  if (darkModePreference === 'true') {
    document.querySelectorAll('.type-name-underline').forEach((line) => {
      line.style.backgroundColor = 'white'
    })
  }
}


async function fetchMoves() {
  populateMoveContainerSkeletons()
  const typeContainers = document.querySelectorAll('.move-type-container')
  for (let i = 1; i <= 919; i++) {
    const moveResponse = await fetch(`https://pokeapi.co/api/v2/move/${i}`);
    const moveData = await moveResponse.json();

    // console.log(moveData)

    const name = utils.fixDashedStrings(moveData.name);
    const type = moveData.type.name;
    let power = moveData.power;
    const pp = moveData.pp;
    const learnedByAmt = moveData.learned_by_pokemon.length;
    let description = moveData.flavor_text_entries.find(item => item.language.name == 'en')?.flavor_text;


    if (description === 'Dummy Data' || moveData.flavor_text_entries.length === 0) {
      description = 'N/A'
    }

    if (power === null) {
      power = '-'
    }

    typeContainers.forEach((container) => {
      if (container.id === type) {
        container.querySelector('.moves-grid-box').innerHTML += `
          <div id="move-${i}" style="border: 2px solid  ${data.typeColors[type]}; background: ${data.typeColors[type]}13" class="moves-text-container">
            <div class="name-type-box">
              #${i} - ${name}
              <img width="35" src="images/types/${type}.png">
            </div>
            <span>‣ Introduced in <span class="bolded-span">${utils.fixGenerationName(moveData.generation.name)}</span></span>
            <span class="learned-box">‣ This move can be learned by <span class="bolded-span">${learnedByAmt}</span> Pokémon.</span>

            <div class="description">‣ ${description}</div>
            <div class="short-info-box">
              <div class="power-box short"><span>Power</span>${power}</div>
              <div class="acc-box short"><span>Accuracy</span>-</div>
              <div class="pp-box short"><span>PP</span>${pp}</div>
            </div>
          </div>
        `
      }
      if (darkModePreference === 'true') {
        document.querySelectorAll('.moves-text-container').forEach((ability) => {
          ability.style.boxShadow = 'rgba(3, 3, 3, 0.4) 0px 7px 29px 0px';
        })
      }
    })

  }

  scrollToId();
}

async function init() {
  populateMoveContainerSkeletons();
  await fetchMoves();
  await populateDatalist();
  domReady = true;
}

function scrollToId() {
  const targetId = window.location.hash.substring(1);
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    targetElement.querySelector('.ability-name').style.color = '#0084ff'
  }
};

document.addEventListener('DOMContentLoaded', init);


// search bar
const moveSearchbarElem = document.querySelector('#moves-searchbar');
const moveSearchBtn = document.querySelector('#moves-search-button');
const clearSearchBtn = document.querySelector('.clear-search-button')

let domReady = false;



moveSearchbarElem.addEventListener('input', () => {
  if (moveSearchbarElem.value) {
    clearSearchBtn.style.display = 'flex';
  } else {
    clearSearchBtn.style.display = 'none';
  }
})

clearSearchBtn.addEventListener('click', () => {
  moveSearchbarElem.value = '';
  clearSearchBtn.style.display = 'none';
})

moveSearchBtn.addEventListener('click', () => {

  if (!domReady) {
    document.querySelector('.wait-loading').style.display = 'flex';
    setTimeout(() => {
      document.querySelector('.wait-loading').style.display = 'none';
    }, 3000)
  } else {
    const targetId = `move-${moveSearchbarElem.value.split('-')[0].trim()}`;
    console.log(targetId)
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
})

async function populateDatalist() {
  const response = await fetch('./data/moves.json');
  const data = await response.json();
  const datalistElem = document.querySelector('#moves-datalist');
  let datalistHTML = '';

  Object.values(data).forEach((value) => {
    datalistHTML += `<option value="${value.id} - ${utils.fixDashedStrings(value.name)}"></option>`
  })

  datalistElem.innerHTML = datalistHTML;
}

populateDatalist();

// Dark mode

const navbar = document.querySelector('.navbar');
const footerAnchor = document.querySelectorAll('footer div a');

if (darkModePreference === 'true') {

  document.querySelector('body').style.background = '#171D25';
  document.querySelector('*').style.color = 'white';
  document.querySelectorAll('.other').forEach((section) => {
    section.style.borderTopColor = 'white';
  })
  navbar.style.backgroundColor = '#171D25';
  footerAnchor.forEach((anchor) => {
    anchor.style.color = 'white'
  });
  document.querySelectorAll('.navbar a').forEach((button) => {
    button.style.filter = 'invert(100%)';
  })
}