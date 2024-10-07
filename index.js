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
const searchContainer = document.querySelector('.search-container');
const attributeContainer = document.querySelector('.attributes');

input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && input.value) {
    fetchData();
    if (searchContainer.classList.contains('false-input')) {
      searchContainer.classList.remove('false-input');
    }
  } else if (e.key === 'Enter' && !input.value) {
    searchContainer.classList.add('false-input')
  }
});

async function fetchData() {
  if (!input.value) {
    searchContainer.classList.add('false-input');
  } else if (input.value) {
    if (searchContainer.classList.contains('false-input')) {
      searchContainer.classList.remove('false-input');
    }
  }
  try {
    const pokemonName = input.value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      throw new Error('Could not find pokemon!')
    }

    const data = await response.json();

    console.log(data);


    // POKEMON-SPECIES
    const speciesURL = data.species.url;
    const speciesResponse = await fetch(speciesURL);
    const speciesData = await speciesResponse.json();
    console.log(speciesData);

    // BASIC DATA
    const pokemonSprite = data.sprites.front_default;
    const name = data.name;
    const dexNum = data.id;
    const type1 = data.types[0].type.name;

    // ELEMENT GRABS WITH DOM
    const imgElement = document.getElementById('pokemon-sprite');
    const nameElem = document.querySelector('.name-box');
    const type1Elem = document.querySelector('.type-1');
    const type2Elem = document.querySelector('.type-2');
    type2Elem.style.display = 'none';

    // if a second typing exits, show it
    if (data.types[1]) {
      const type2 = data.types[1].type.name;
      type2Elem.innerHTML = capitalizeFirstLetter(type2);
      type2Elem.style.backgroundColor = typeColors[type2];
      type2Elem.style.display = 'flex'; 
    }

    imgElement.src = pokemonSprite;
    nameElem.innerHTML = `${capitalizeFirstLetter(name)} - <span>#${addDexZeros(dexNum)}</span>`;
    type1Elem.innerHTML = capitalizeFirstLetter(type1);
    type1Elem.style.backgroundColor = typeColors[type1];

    type1Elem.style.display = 'flex';
    nameElem.style.display = 'block';
    imgElement.style.display = 'block';
  }
  catch(error) {
    console.log(error);
  };
};

// choose random pokemon via dex number
function chooseRandom() {
  const randomNum = Math.floor(Math.random() * (1025 - 1) + 2);
  input.value = randomNum;
  fetchData()
}