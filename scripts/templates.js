function PokemonCardHTML(image, name, id) {
  return `
    <div class="pokemon-card">

        <img src=${image} alt="" class="pokemon-img"/>

        <div class="pokemon-circle"></div>

        <div class="pokemon-description">
          <h2>${name}</h2>
          <p># ${id}</p>
        </div>

    </div>`;
}
