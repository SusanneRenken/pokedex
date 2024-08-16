let POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let TYPE_URL = "https://pokeapi.co/api/v2/type/";
let STAT_URL = "https://pokeapi.co/api/v2/stat/";

let allLoadedPokemons = [];

let loadedPokemons = 0;
let pokemonsPerLoad = 40;
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

  const pokemonList = await fetchDataJason(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
  );

  console.log("API Pokémons:", pokemonList); //DELETE

  await populatePokemonArray(pokemonList);

  console.log("allLoadedPokemons:", allLoadedPokemons); //DELETE
  renderPokemon();
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

async function getPokemonNames(Id) {
  let speciesData = await fetchDataJason(`${SPECIES_URL}${Id}`);
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
    const languageTypes = await getlanguageId(type.type.url);

    let typeObject = {
      [typeName]: languageTypes,
    };

    pokemonTypes.push(typeObject);
  }

  return pokemonTypes;
}

async function getlanguageId(url) {
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

function renderPokemon(pokemonToRender = allLoadedPokemons) {
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
    renderTypes(pokemon);
  }
}

function renderTypes(pokemon) {
  let content = document.getElementById(`pokemon_types_${pokemon.id}`);
  content.innerHTML = "";

  for (let pokemonTypes of pokemon.types) {
    let pokemonType = Object.keys(pokemonTypes)[0];
    let languageType = pokemonTypes[pokemonType][language];

    content.innerHTML += `<span class="type ${pokemonType}">${languageType}</span>`;
  }
}

async function loadMorePokemon() {
  loadedPokemons += pokemonsPerLoad;
  lastLoadedPokemonCount = loadedPokemons;
  let pokemonList = await fetchDataJason(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
  );

  await populatePokemonArray(pokemonList);

  renderPokemon();
}

function changeLanguage(newLanguage) {
  language = newLanguage;
  updateTexts();
  renderPokemon();
}

function handleSearch() {
  const query = searchInput.value.trim();
  const filteredPokemon = searchPokemon(query);
  renderPokemon(filteredPokemon);
}

function searchPokemon(query) {
  if (query.length === 0) return allLoadedPokemons;

  const isNumeric = /^\d+$/.test(query);

  return allLoadedPokemons.filter((pokemon) => {
    if (isNumeric) {
      return pokemon.id.toString().includes(query);
    } else if (query.length >= 3) {
      return pokemon.names[language]
        .toLowerCase()
        .includes(query.toLowerCase());
    }
    return allLoadedPokemons;
  });
}

function updateTexts() {
  const currentTranslation = translations[language] || translations["en"];

  // Update title
  const headline = document.getElementById("headline");
  headline.textContent = currentTranslation.title;

  // Update search placeholder
  const searchInput = document.getElementById("search_pokemon");
  searchInput.placeholder = currentTranslation.searchPlaceholder;

  // Update load button text
  const loadButton = document.getElementById("load_button");
  loadButton.textContent = currentTranslation.loadButton;

  const languageSelect = document.getElementById("language_select");
  languageSelect.value = language;
}
