const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonItem = document.getElementById('pokemonItem')

const maxRecords = 2000
const limit = 50
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener('click', e => {
    const element = e.target;

    if (element === pokemonList) return;

    const pokemon = element.closest('li.pokemon');

    pokemonItem.innerHTML = '';
 
    pokeApi.getPokemon(pokemon.dataset.id)
        .then(pokemonData => {
            const pokemonHtml = convertPokemonToCard(pokemonData);
            pokemonItem.innerHTML = pokemonHtml;
            pokemonItem.style.display = 'flex';
            
            const close = pokemonItem.querySelector('.card-close');
                close.addEventListener('click', () => {
                pokemonItem.style.display = 'none';
            })
        });
})

function convertPokemonToCard(pokemon) {
    
    return `
        <div class="pokemon-card ${pokemon.type}">
            <div class="pokemon-card-close">
                <div class="card-close">X</div>
            </div>
            <div class="pokemon-card-specs">
                <div class="pokemon-card-title">
                    <div class="pokemon-card-name">${pokemon.name}</div>
                    <div class="pokemon-card-number">#${pokemon.number}</div>
                </div>
                <div class="pokemon-card-types">
                    <ul>
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ul>
                </div>
                <div class="pokemon-card-image">
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </div>
            <div class="pokemon-card-details">
                <div>Habilidades</div>
                <ul>
                    ${pokemon.abilities.map((ability) => `<li>${ability}</li>`).join('')}
                </ul>
                <div>Movimentos</div>
                <ul>
                ${pokemon.moves.map((move) => `<li>${move}</li>`).join('')}
                </ul>
            </div>
        </div>
    `
}
