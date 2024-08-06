let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=3&offset=0&language=de";
let loadPokemons;
let numberPokemons;
let pokeImages = [
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
];

async function init() {
  loadPokemons = await fetchDataJason(BASE_URL);
  console.log("Geladene Pokémon außerhalb der Funktion:", loadPokemons);
  numberPokemons = loadPokemons.results.length;
  console.log("Anzahl der geladene Pokémon:", numberPokemons);
  renderPokemon();
}

async function fetchDataJason(apiUrl) {
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();
    console.log("Daten in der Funktion:", data);
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

async function renderPokemon() {
  let content = document.getElementById("pokemon_cards");
  content.innerHTML = "";

  for (let index = 0; index < numberPokemons; index++) {
    const image = pokeImages[index];
    const name = loadPokemons.results[index].name;
    let capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    content.innerHTML += PokemonCardHTML(image, capitalizedName);
  }
}
