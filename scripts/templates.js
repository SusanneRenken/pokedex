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

function pokemonSingleCardHTML(image, name, id, type, detailedData) {
  const abilitiesInCurrentLanguage = detailedData.abilities
    .map((ability) => ability[language])
    .join(", <br>");

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
            <td>${detailedData.height} m</td>
          </tr>
          <tr>
            <td id="detail_weight">Weight</td>
            <td>${detailedData.weight} kg</td>
          </tr>
          <tr>
            <td id="detail_experience">Base experience</td>
            <td>${detailedData.baseExperience}</td>
          </tr>
          <tr>
            <td id="detail_abilities">Abilities</td>
            <td>${abilitiesInCurrentLanguage}</td>
          </tr>
        </table>
          <div class="arrows">
            <img src="./assets/img/arrow-left.png" alt="" class="arrow-img" id="arrow_left" onclick="renderSingleCard(${
              id - 1
            }, false)"/>
            <div></div>
            <img src="./assets/img/arrow-right.png" alt="" class="arrow-img" id="arrow_right" onclick="renderSingleCard(${
              id + 1
            }, false)"/>
          </div>
      </div>`;
}
