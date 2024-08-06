let BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=10&offset=0";
let SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let STAT_URL = "https://pokeapi.co/api/v2/stat/";
let CHARACTERISTIC_URL = "https://pokeapi.co/api/v2/characteristic/";
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

async function getGermanName(pokemonId) {
  let speciesData = await fetchDataJason(`${SPECIES_URL}${pokemonId}`);
  let germanName = speciesData.names.find(
    (name) => name.language.name === language
  ).name;
  return germanName;
}

// async function getDescription(pokemonId) {
//     let characteristicData = await fetchDataJason(`${CHARACTERISTIC_URL}`);
    
//     // Finde die passende Charakteristik für das Pokémon
//     let pokemonCharacteristic = characteristicData.find(char => char.pokemon_id === pokemonId);
    
//     if (!pokemonCharacteristic) {
//       return "Keine Beschreibung verfügbar.";
//     }
    
//     // Finde die deutsche Beschreibung
//     let description = pokemonCharacteristic.descriptions.find(desc => desc.language.name === "de");
    
//     return description ? description.description : "Keine deutsche Beschreibung verfügbar.";
//   }

async function renderPokemon(pokemonList, content) {
  for (let pokemon of pokemonList.results) {
    let pokemonData = await fetchDataJason(pokemon.url);
    let image = pokemonData.sprites.other["official-artwork"].front_default;
    let germanName = await getGermanName(pokemonData.id);

    // let description = await getDescription(pokemonData.id);

    content.innerHTML += PokemonCardHTML(
      image,
      germanName,
      pokemonData.id,
    );
  }
}
