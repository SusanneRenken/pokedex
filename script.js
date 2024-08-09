let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=50git &offset=0";
let POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
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
    let germanName = await getGermanName(pokemonData.id);
    let pokemonType = await getPokemonType(pokemonData.id);

    content.innerHTML += PokemonCardHTML(
      image,
      germanName,
      pokemonData.id,
      pokemonType,
    );
  }
}

async function getGermanName(pokemonId) {
  let speciesData = await fetchDataJason(`${SPECIES_URL}${pokemonId}`);
  let germanName = speciesData.names.find(
    (name) => name.language.name === language
  ).name;
  return germanName;
}

async function getPokemonType(pokemonId) {
  let pokemonData = await fetchDataJason(`${POKEMON_URL}${pokemonId}`);
  let pokemonType = pokemonData.types["0"].type.name;
  return pokemonType;
}

