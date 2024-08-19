function pokemonCardHTML(image, name, id, type) {
  return `
    <div class="pokemon-card" onclick="renderSingleCard(${id}, true)">

        <img src=${image} alt="" class="pokemon-img"/>

        <div class="pokemon-circle ${type}"></div>

        <div class="pokemon-description">
          <h2>${name}</h2>
          <p># ${id}</p>
          <div class="pokemon-types" id="pokemon_types_${id}"></div>
        </div>

    </div>`;
}
function pokemonSingleCardHTML(image, name, id, type) {
  return `
        <img
        src=${image}
        alt="" class="single-img"/>

        <div class="single-circle ${type}"></div>

        <div class="line"></div>

        <div class="single-description">
          <h2>${name}</h2>
          <p># ${id}</p>
          <div class="pokemon-types" id="single_pokemon_types_${id}">
          </div>
          <table class="pokemon-details">
            <tr>
              <td id="detail_height">Height</td>
              <td>2 m</td>
            </tr>
            <tr>
              <td id="detail_weight">Weight</td>
              <td>100 kg</td>
            </tr>
            <tr>
              <td id="detail_experience">Expérience de base</td>
              <td>263</td>
            </tr>
            <tr>
              <td id="detail_abilities">Abilities</td>
              <td>overgrow, chlorophyll</td>
            </tr>
          </table>
          <div class="arrows">
            <img src="./assets/img/arrow-left.png" alt="" class="arrow-img" id="arrow_left" onclick="renderSingleCard(${id-1}, false)"/>
            <div></div>
            <img src="./assets/img/arrow-right.png" alt="" class="arrow-img" id="arrow_right" onclick="renderSingleCard(${id+1}, false)"/>
          </div>
      </div>`;
}
