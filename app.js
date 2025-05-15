document.getElementById("pokemon-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const numCards = document.getElementById("num-cards").value;
  const type = document.getElementById("type-select").value;
  const container = document.getElementById("cards-container");
  container.innerHTML = "Loading...";

  try {
    // Fetch all Pokémon of selected type
    const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const typeData = await typeRes.json();
    const allPokemons = typeData.pokemon.map(p => p.pokemon);

    // Pick random Pokémon up to the number requested
    const shuffled = allPokemons.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numCards);

    // Fetch individual Pokémon details
    const promises = selected.map(p =>
      fetch(p.url).then(res => res.json())
    );
    const results = await Promise.all(promises);

    // Display cards
    container.innerHTML = "";
    results.forEach(poke => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${poke.name.toUpperCase()}</h3>
        <img src="${poke.sprites.front_default}" alt="${poke.name}">
        <p><strong>ID:</strong> ${poke.id}</p>
        <p><strong>Type:</strong> ${poke.types.map(t => t.type.name).join(", ")}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "Something went wrong!";
  }
});
