let POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let TYPE_URL = "https://pokeapi.co/api/v2/type/";
let STAT_URL = "https://pokeapi.co/api/v2/stat/";

let allLoadedPokemons = [];

let loadedPokemons = 0;
let pokemonsPerLoad = 5;
let languages = ["en", "de", "fr", "es"];
let language = "de";

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

  let pokemonList = await fetchDataJason(
    `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
  );

  console.log("API Pokémons:", pokemonList); //DELETE

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

  console.log("allLoadedPokemons:", allLoadedPokemons);
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
    let languageTypes = await getlanguageId(type.type.url);

    let typeObject = {
      [typeName]: languageTypes
    };

    pokemonTypes.push(typeObject);
  }

  return pokemonTypes;
}

async function getlanguageId(url) {
  let typeData = await fetchDataJason(url);
  let languageTypes = {};

  for (let language of languages) {
    let languageType = typeData.names.find(
      (name) => name.language.name === language
    )?.name || "Unknown";
    languageTypes[language] = languageType;
  }

  return languageTypes;
}

// async function renderTypes(pokemonData) {
//   let content = document.getElementById(`pokemon_types_${pokemonData.id}`);

//   for (let pokemonTypes of pokemonData.types) {
//     let pokemonType = pokemonTypes.type.name;
//     let languageType = await getlanguageId(pokemonTypes.type.url);

//     content.innerHTML += `<span class="type ${pokemonType}">${languageType}</span>`;
//   }
// }

// async function loadMorePokemon() {
//   let content = document.getElementById("pokemon_cards");
//   let pokemonList = await fetchDataJason(
//     `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerLoad}&offset=${loadedPokemons}`
//   );
//   // console.log("API Pokémons:", pokemonList); //DELETE

//   await renderPokemon(pokemonList, content);
//   loadedPokemons += pokemonsPerLoad;
//   lastLoadedPokemonCount = loadedPokemons;
// }

// async function renderPokemon(pokemonList, content) {
//   for (let pokemon of pokemonList.results) {
//     let pokemonData = await fetchDataJason(pokemon.url);
//     let image = pokemonData.sprites.other["home"].front_default;
//     let languageName = await getlanguageName(pokemonData.id);
//     let pokemonMainType = pokemonData.types[0].type.name;

//     content.innerHTML += pokemonCardHTML(
//       image,
//       languageName,
//       pokemonData.id,
//       pokemonMainType
//     );
//     renderTypes(pokemonData);
//     pushPokemonsToArray(pokemonData.id, languageName);
//   }
//   console.log("Loaded Pokémons:", allLoadedPokemons); //DELETE
// }

// async function pushPokemonsToArray(id, name) {
//   allLoadedPokemons.push({
//     id: id,
//     name: name,
//   });
// }

// async function changeLanguage(newLanguage) {
//   allLoadedPokemons = [];
//   language = newLanguage;
//   updateTexts();
//   await reloadAllPokemon();
// }

// async function reloadAllPokemon() {
//   let content = document.getElementById("pokemon_cards");
//   content.innerHTML = "";
//   loadedPokemons = 0;
//   await loadMorePokemon();
// }

// async function searchPokemon(searchTerm) {
//   searchTerm = searchTerm.toLowerCase();

//   let content = document.getElementById("pokemon_cards");

//   if (searchTerm.length >= 3) {
//     const searchResults = allLoadedPokemons.filter((pokemon) =>
//       pokemon.name.toLowerCase().includes(searchTerm)
//     );

//     console.log("Suchergebnisse:", searchResults); //DELETE
//     await renderSearchedPokemon(searchResults, content);
//   }
// }

// async function renderSearchedPokemon(searchResults, content) {
//   content.innerHTML = "";

//   for (let pokemon of searchResults) {
//     let pokemonData = await fetchDataJason(`${POKEMON_URL}${pokemon.id}`);
//     let image = pokemonData.sprites.other["home"].front_default;
//     let languageName = await getlanguageName(pokemonData.id);
//     let pokemonMainType = pokemonData.types[0].type.name;

//     content.innerHTML += pokemonCardHTML(
//       image,
//       languageName,
//       pokemonData.id,
//       pokemonMainType
//     );
//     renderTypes(pokemonData);
//   }
//   console.log("Loaded Pokémons:", allLoadedPokemons); //DELETE
// }

// function updateTexts() {
//   const currentTranslation = translations[language] || translations["en"];

//   // Update title
//   const headline = document.getElementById("headline");
//   headline.textContent = currentTranslation.title;

//   // Update search placeholder
//   const searchInput = document.getElementById("search_pokemon");
//   searchInput.placeholder = currentTranslation.searchPlaceholder;

//   // Update load button text
//   const loadButton = document.getElementById("load_button");
//   loadButton.textContent = currentTranslation.loadButton;

//   const languageSelect = document.getElementById("language_select");
//   languageSelect.value = language;
// }
