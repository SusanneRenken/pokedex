let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=30git &offset=0";
let POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let TYPE_URL = "https://pokeapi.co/api/v2/type/";
let STAT_URL = "https://pokeapi.co/api/v2/stat/";
let language = "de";

async function init() {
  let content = document.getElementById("pokemon_cards");
  content.innerHTML = "";
  let pokemonList = await fetchDataJason(BASE_URL);
  console.log("Geladene Pokémon außerhalb der Funktion:", pokemonList);

  renderPokemon(pokemonList, content);
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
    console.log("PokeName:", languageName);
    renderTypes(pokemonData, pokemonData.id);
  }
}

async function getlanguageName(languageId) {
  let speciesData = await fetchDataJason(`${SPECIES_URL}${languageId}`);
  let languageName = speciesData.names.find(
    (name) => name.language.name === language
  ).name;
  return languageName;
}

async function renderTypes(pokemonData, id) {
  let content = document.getElementById(`pokemon_types_${id}`);

  for (let pokemonTypes of pokemonData.types) {
    let pokemonType = pokemonTypes.type.name;
    content.innerHTML += `<span class="type ${pokemonType}">${pokemonType}</span>`;
  }
}
