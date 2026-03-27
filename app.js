const form = document.getElementById("pokemon-form");
const cardsInput = document.getElementById("num-cards");
const typeSelect = document.getElementById("type-select");
const container = document.getElementById("cards-container");
const statusMessage = document.getElementById("status-message");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const numCards = Number(cardsInput.value);
  const type = typeSelect.value;

  statusMessage.textContent = "Summoning Pokémon cards...";
  container.innerHTML = "";
  submitBtn.disabled = true;

  try {
    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);

    if (!typeResponse.ok) {
      throw new Error("Unable to load type data.");
    }

    const typeData = await typeResponse.json();
    const allPokemons = typeData.pokemon.map((entry) => entry.pokemon);

    const selected = allPokemons
      .sort(() => Math.random() - 0.5)
      .slice(0, numCards);

    const pokemonResponses = await Promise.all(
      selected.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
    );

    statusMessage.textContent = `Showing ${pokemonResponses.length} ${type} Pokémon cards.`;

    pokemonResponses.forEach((pokemon) => {
      const types = pokemon.types.map((typeInfo) => typeInfo.type.name);
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3>${pokemon.name.toUpperCase()}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p class="card-meta">#${pokemon.id}</p>
        <p class="card-meta">Base EXP: ${pokemon.base_experience ?? "N/A"}</p>
        <div class="type-pill">${types.join(" · ")}</div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Could not load Pokémon right now. Please try again.";
  } finally {
    submitBtn.disabled = false;
  }
});
