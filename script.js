let POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let STAT_URL = "https://pokeapi.co/api/v2/stat/";

let allLoadedPokemons = [];

let loadedPokemons = 0;
let pokemonsPerLoad = 20;
let languages = ["en", "de", "fr", "es"];
let language = "de";

const searchInput = document.getElementById("search_pokemon");
searchInput.addEventListener("input", handleSearch);

async function fetchDataJason(apiUrl) {
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

async function init() {
  console.log("API Pokémons:"); //DELETE
  showLoading();

  const pokemonList = await fetchDataJason(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
  );

  console.log("API Pokémons:", pokemonList); //DELETE

  await populatePokemonArray(pokemonList);

  console.log("allLoadedPokemons:", allLoadedPokemons); //DELETE
  renderPokemon(allLoadedPokemons);
  hideLoading();
}

async function populatePokemonArray(pokemonList) {
  for (const pokemon of pokemonList.results) {
    let pokemonData = await fetchDataJason(pokemon.url);
    let pokemonId = pokemonData.id;
    let pokemonImage = pokemonData.sprites.other["home"].front_default;

    let pokemonNames = await getPokemonNames(pokemonId);
    let pokemonTypes = await getPokemonTypes(pokemonData);

    allLoadedPokemons.push({
      id: pokemonId,
      names: pokemonNames,
      image: pokemonImage,
      types: pokemonTypes,
    });
  }  
}

async function getPokemonNames(id) {
  let speciesData = await fetchDataJason(`${SPECIES_URL}${id}`);
  let names = {};

  for (let language of languages) {
    let languageName =
      speciesData.names.find((name) => name.language.name === language)?.name ||
      "Unknown";

    names[language] = languageName;
  }

  return names;
}

async function getPokemonTypes(pokemonData) {
  let pokemonTypes = [];

  for (let type of pokemonData.types) {
    let typeName = type.type.name;
    const languageTypes = await getTypesNames(type.type.url);

    let typeObject = {
      [typeName]: languageTypes,
    };

    pokemonTypes.push(typeObject);
  }

  return pokemonTypes;
}

async function getTypesNames(url) {
  const typeData = await fetchDataJason(url);
  let languageTypes = {};

  for (let language of languages) {
    let languageType =
      typeData.names.find((name) => name.language.name === language)?.name ||
      "Unknown";
    languageTypes[language] = languageType;
  }

  return languageTypes;
}

// async function getPokemonDetails(id){

// }

function renderPokemon(pokemonToRender) {
  let content = document.getElementById("pokemon_cards");
  content.innerHTML = "";

  for (let pokemon of pokemonToRender) {
    let id = pokemon.id;
    let image = pokemon.image;
    let languageName = pokemon.names[language];
    let pokemonMainType = Object.keys(pokemon.types[0])[0];

    content.innerHTML += pokemonCardHTML(
      image,
      languageName,
      id,
      pokemonMainType
    );
    renderTypes("pokemon_types_", pokemon, "type");
  }
}

function renderSingleCard(id, open) {
  let content = document.getElementById("single_card");
  content.innerHTML = "";

  let selectedPokemon = allLoadedPokemons.find((pokemon) => pokemon.id === id);
  let image = selectedPokemon.image;
  let languageName = selectedPokemon.names[language];
  let pokemonMainType = Object.keys(selectedPokemon.types[0])[0];

  content.innerHTML += pokemonSingleCardHTML(
    image,
    languageName,
    id,
    pokemonMainType
  );
  showArrows(id);
  renderTypes("single_pokemon_types_", selectedPokemon, "single-type");
  updateSingleTexts();
  if (open) {
    toggleOverlay();
  };
}

function showArrows(id) {
  let arrowLeft = document.getElementById("arrow_left");
  let arrowRight = document.getElementById("arrow_right");
  let numberLoadedPokemons = allLoadedPokemons.length;

  if (id == 1) {
    arrowLeft.classList.add("d-none");  
  }
  if (id == numberLoadedPokemons) {
    arrowRight.classList.add("d-none");  
  }
}

function renderTypes(prefix, pokemon, typeclass) {
  let content = document.getElementById(`${prefix}${pokemon.id}`);
  content.innerHTML = "";

  for (let pokemonTypes of pokemon.types) {
    let pokemonType = Object.keys(pokemonTypes)[0];
    let languageType = pokemonTypes[pokemonType][language];

    content.innerHTML += `<span class="${typeclass} ${pokemonType}">${languageType}</span>`;
  }
}

async function loadMorePokemon() {
  showLoading();
  loadedPokemons += pokemonsPerLoad;
  lastLoadedPokemonCount = loadedPokemons;
  let pokemonList = await fetchDataJason(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
  );

  await populatePokemonArray(pokemonList);

  renderPokemon(allLoadedPokemons);
  hideLoading();
}

function showLoading() {
  document.querySelector(".loading").style.display = "flex";
  document.querySelector(".load-Btn-content").style.display = "none";
}

function hideLoading() {
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".load-Btn-content").style.display = "flex";
}

function changeLanguage(newLanguage) {
  language = newLanguage;
  updateTexts();
  renderPokemon(allLoadedPokemons);
}

function handleSearch() {
  const query = searchInput.value.trim();
  const filteredPokemon = searchPokemon(query);
  renderPokemon(filteredPokemon);
}

function searchPokemon(query) {
  if (query.length === 0) return allLoadedPokemons;

  query = query.toLowerCase().trim();
  const isNumeric = /^\d+$/.test(query);

  return allLoadedPokemons.filter((pokemon) =>
    filterPokemon(pokemon, query, isNumeric)
  );
}

function filterPokemon(pokemon, query, isNumeric) {
  if (isNumeric) {
    return searchById(pokemon, query);
  } else if (query.length >= 3) {
    return searchByNameOrType(pokemon, query);
  }
  return allLoadedPokemons;
}

function searchById(pokemon, query) {
  return pokemon.id === parseInt(query);
}

function searchByNameOrType(pokemon, query) {
  const nameMatch = pokemon.names[language].toLowerCase().includes(query);

  const typeMatch = pokemon.types.some((typeObj) => {
    const typeName = Object.keys(typeObj)[0];
    return (
      typeName.toLowerCase().includes(query) ||
      typeObj[typeName][language].toLowerCase().includes(query)
    );
  });

  return nameMatch || typeMatch;
}

function updateTexts() {
  const currentTranslation = translations[language] || translations["en"];

  const headline = document.getElementById("headline");
  headline.textContent = currentTranslation.title;

  const searchInput = document.getElementById("search_pokemon");
  searchInput.placeholder = currentTranslation.searchPlaceholder;

  const loadButton = document.getElementById("load_button");
  loadButton.textContent = currentTranslation.loadButton;

  const languageSelect = document.getElementById("language_select");
  languageSelect.value = language;
}

function updateSingleTexts() {
  const currentTranslation = translations[language] || translations["en"];

  const height = document.getElementById("detail_height");
  height.textContent = currentTranslation.detailHeight;

  const weight = document.getElementById("detail_weight");
  weight.textContent = currentTranslation.detailWeight;

  const experience = document.getElementById("detail_experience");
  experience.textContent = currentTranslation.detailExperience;

  const abilities = document.getElementById("detail_abilities");
  abilities.textContent = currentTranslation.detailAbilities;
}

function toggleOverlay() {
  let refOverlay = document.getElementById("overlay");
  refOverlay.classList.toggle("d-none");

  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
}

function bubblingPrevention(event) {
  event.stopPropagation();
}
