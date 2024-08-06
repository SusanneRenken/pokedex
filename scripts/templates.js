function PokemonCardHTML(image, name) {
  return `
    <div class="pokemon-card">

        <img src=${image} alt="" class="pokemon-img"/>

        <div class="pokemon-circle"></div>

        <div class="pokemon-description">
          <h2>${name}</h2>
          <p>Description</p>
        </div>

    </div>`;
}
