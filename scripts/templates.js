function PokemonCardHTML(image, name, id, type) {
  return `
    <div class="pokemon-card">

        <img src=${image} alt="" class="pokemon-img"/>

        <div class="pokemon-circle ${type}"></div>

        <div class="pokemon-description">
          <h2>${name}</h2>
          <p># ${id}</p>
          <div class="pokemon-types" id="pokemon_types">
            <span class="type ${type}">${type}</span>
            <span class="type electric">electric</span>
            <span class="type fighting">fighting</span>
          </div>
        </div>

    </div>`;
}
