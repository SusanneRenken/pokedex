let loadedPokemons = 0;
const pokemonsPerLoad = 5;
let POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let TYPE_URL = "https://pokeapi.co/api/v2/type/";
let STAT_URL = "https://pokeapi.co/api/v2/stat/";
let language = "de";

async function init() {
  updateTexts();
  let content = document.getElementById("pokemon_cards");
  content.innerHTML = "";
  await loadMorePokemon();
}

async function loadMorePokemon() {
  let content = document.getElementById("pokemon_cards");
  let pokemonList = await fetchDataJason(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
  );

  await renderPokemon(pokemonList, content);

  loadedPokemons += pokemonsPerLoad;
}

async function fetchDataJason(apiUrl) {
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

async function renderPokemon(pokemonList, content) {
  for (let pokemon of pokemonList.results) {
    let pokemonData = await fetchDataJason(pokemon.url);
    let image = pokemonData.sprites.other["official-artwork"].front_default;
    let languageName = await getlanguageName(pokemonData.id);
    let pokemonMainType = pokemonData.types["0"].type.name;

    content.innerHTML += pokemonCardHTML(
      image,
      languageName,
      pokemonData.id,
      pokemonMainType
    );

    renderTypes(pokemonData);
  }
}

async function getlanguageName(Id) {
  let speciesData = await fetchDataJason(`${SPECIES_URL}${Id}`);
  let languageName = speciesData.names.find(
    (name) => name.language.name === language
  ).name;
  return languageName;
}

async function renderTypes(pokemonData) {
  let content = document.getElementById(`pokemon_types_${pokemonData.id}`);

  for (let pokemonTypes of pokemonData.types) {
    let pokemonType = pokemonTypes.type.name;
    let languageType = await getlanguageId(pokemonTypes.type.url);

    content.innerHTML += `<span class="type ${pokemonType}">${languageType}</span>`;
  }
}

async function getlanguageId(Url) {
  let typeData = await fetchDataJason(Url);
  let languageType = typeData.names.find(
    (name) => name.language.name === language
  ).name;
  return languageType;
}

async function changeLanguage(newLanguage) {
  language = newLanguage;
  updateTexts();
  await reloadAllPokemon();
}

async function reloadAllPokemon() {
  let content = document.getElementById("pokemon_cards");
  content.innerHTML = "";
  loadedPokemons = 0;
  await loadMorePokemon();
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
