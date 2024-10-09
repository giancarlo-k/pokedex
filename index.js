const typeColors = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};

const body = document.querySelector('body')


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const addDexZeros = (dexNum) => {
  return dexNum.toString().padStart(3, '0');
};

//---------------------------ASYNC/AWAIT FETCH--------------------------       

const input = document.getElementById('pokemon-name');
const pokeballBtn = document.querySelector('.pokeball-button');
const searchContainer = document.querySelector('.search-container');

const goldPokeballImg = document.querySelector('.gold-pokeball-icon');
const pokeballImg = document.querySelector('.normal-pokeball-icon');
const starIconImg = document.querySelector('.star-icon');

const amountCaughtElem = document.querySelector('.amount-caught-box span')


const getCaughtState = () => {
  const caughtState = JSON.parse(localStorage.getItem('caughtPokemon')) || {};
  return caughtState;
}

const saveCaughtState = (id, caught) => {
  const caughtState = getCaughtState();
  caughtState[id] = caught;
  localStorage.setItem('caughtPokemon', JSON.stringify(caughtState));
};

input.addEventListener('input', (event) => {
  showPokemonCard(event.target.value);
});


// choose random pokemon via dex number
function chooseRandom() {
  const randomNum = Math.floor(Math.random() * (151 - 1) + 2);
  return randomNum;
}

// DISPLAY ALL POKEMON
const allPokemonContainer = document.querySelector('.allPokemonContainer');


async function fetchAll() {
    
  let allHTML = '';

  for (let i = 1; i <= 151; i++) {
    const allPokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const allPokemonData = await allPokemonResponse.json();
    // const allSpeciesURL = allPokemonData.species.url;
    // const allSpeciesResponse = await fetch(allSpeciesURL);  
    // const allSpeciesData = await allSpeciesResponse.json(); 


    const eachName = capitalizeFirstLetter(allPokemonData.name);
    const eachID = addDexZeros(allPokemonData.id);
    const eachPic = allPokemonData.sprites.front_default;
    const shinySprite = allPokemonData.sprites.front_shiny;
    const eachType1 = allPokemonData.types[0].type.name;
    let eachType2 = ''
    let typeClass = 'single'
    if (allPokemonData.types[1]) {
      eachType2 = allPokemonData.types[1].type.name;
      typeClass = 'dual';
    } 

    const caughtState = getCaughtState();
    const isCaught = caughtState[eachID] ? '' : 'notCaught';
    
    allHTML += `
    <div class="pokemonCard" style="border-color:  ${typeColors[eachType1]}">
      <img src="images/pokeball.png" class="caught ${isCaught}">
      <p><span class="pokemon-card-name">${eachName}</span> - #<span class="pokemon-card-id">${eachID}</span></p>
      <img class="pokemon-sprite" src="${eachPic}">
      <div class='eachTypeBox ${typeClass}'>
        <div class="type-1" style="background-color: ${typeColors[eachType1]}">${capitalizeFirstLetter(eachType1)}</div>
        <div class="type-2"  style="background-color: ${typeColors[eachType2]}">${capitalizeFirstLetter(eachType2)}</div>
      </div>
    </div>
    `;      
  }

  allPokemonContainer.innerHTML = allHTML;
  
  const cards = document.querySelectorAll('.pokemonCard')
  let caughtCount = 0; // Initialize caught count

  cards.forEach((card) => {

    const caughtElem = card.querySelector('.caught');
    const cardID = card.querySelector('.pokemon-card-id').innerHTML;

    if (!caughtElem.classList.contains('notCaught')) {
      caughtCount++; 
    }

    caughtElem.addEventListener('click', () => {
      caughtElem.classList.toggle('notCaught')

      const isCaught = !caughtElem.classList.contains('notCaught');
      if (isCaught) {
        caughtCount++;
        amountCaughtElem.innerHTML++;
      } else {
        caughtCount--;
        amountCaughtElem.innerHTML--;
      }

      if (amountCaughtElem.innerHTML == '151') {
        starIconImg.style.display = 'flex';
        goldPokeballImg.style.display = 'flex';
        pokeballImg.style.display = 'none';
      } else {
        pokeballImg.style.display = 'flex';
        starIconImg.style.display = 'none';
        goldPokeballImg.style.display = 'none';
      }

      saveCaughtState(cardID, isCaught)
    })
  })

  amountCaughtElem.innerHTML = caughtCount; 
  if (caughtCount === 151) {
    starIconImg.style.display = 'flex';
    goldPokeballImg.style.display = 'flex';
    pokeballImg.style.display = 'none';
  } 

};


pokeballBtn.addEventListener('click', () => {
  const randomPokemon = chooseRandom()
  input.value = randomPokemon;
  showPokemonCard(randomPokemon);
})

fetchAll();


const showPokemonCard = (input) => {
  const cardElements = document.querySelectorAll('.pokemonCard')

  cardElements.forEach((card) => {
    const cardId = Number(card.querySelector('.pokemon-card-id').innerHTML);
    const cardName = card.querySelector('.pokemon-card-name').innerHTML.toLowerCase()

    if (cardId === Number(input) || cardName.includes(input)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none'
    }
  })
}

function catchAll() {
  const caughtElems = document.querySelectorAll('.caught');
  starIconImg.style.display = 'flex';
  goldPokeballImg.style.display = 'flex';
  pokeballImg.style.display = 'none';

  caughtElems.forEach((ball) => {
    const cardId = ball.closest('.pokemonCard').querySelector('.pokemon-card-id').innerHTML;

    if (ball.classList.contains('notCaught')) {
      ball.classList.remove('notCaught'); 
      amountCaughtElem.innerHTML++; 
      saveCaughtState(cardId, true); 
    }
  })
}
