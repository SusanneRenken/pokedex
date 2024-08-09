function pokemonCardHTML(image, name, id, type) {
  return `
    <div class="pokemon-card">

        <img src=${image} alt="" class="pokemon-img"/>

        <div class="pokemon-circle ${type}"></div>

        <div class="pokemon-description">
          <h2>${name}</h2>
          <p># ${id}</p>
          <div class="pokemon-types" id="pokemon_types_${id}"></div>
        </div>

    </div>`;
}
