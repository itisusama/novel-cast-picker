const basket = [];
const characters = [];
let celebrities = [];

const cardsContainer = document.getElementById('cards-container');
const basketContainer = document.getElementById('basket');
const characterModal = document.getElementById('character-modal');
const openModalButton = document.getElementById('open-modal');
const closeModalButton = document.getElementById('close-modal');
const addCharacterButton = document.getElementById('add-character');
const characterNameInput = document.getElementById('character-name');

// Fetch data and render celebrities
fetch('data/mycast.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        celebrities = data; // Store all celebrities initially
        renderCards(celebrities);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function renderCards(data) {
    cardsContainer.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <p>${item.name}</p>
        `;
        card.addEventListener('click', () => selectCharacterForCelebrity(item));
        cardsContainer.appendChild(card);
    });
}

function renderBasket() {
    basketContainer.innerHTML = '';
    basket.forEach((item, index) => {
        const basketItem = document.createElement('div');
        basketItem.className = 'basket-item';
        basketItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <p>${item.name} as <strong>${item.character}</strong></p>
            <button class="remove-button" onclick="removeFromBasket(${index})"> X </button>
        `;
        basketContainer.appendChild(basketItem);
    });
}

function addToBasket(celebrity, character) {
    basket.push({ ...celebrity, character });

    // Remove the celebrity from the available list
    celebrities = celebrities.filter(c => c.id !== celebrity.id);
    renderCards(celebrities);

    // Remove the character from the available list
    const charIndex = characters.indexOf(character);
    if (charIndex > -1) {
        characters.splice(charIndex, 1);
    }

    renderBasket();
}

// Modal logic
openModalButton.addEventListener('click', () => {
    characterModal.classList.add('visible');
});

closeModalButton.addEventListener('click', () => {
    characterModal.classList.remove('visible');
});

// Add character to list
addCharacterButton.addEventListener('click', () => {
    const characterName = characterNameInput.value.trim();
    if (characterName) {
        characters.push(characterName);
        alert(`Character "${characterName}" added successfully!`);
        characterNameInput.value = '';
    } else {
        alert('Please enter a valid character name.');
    }
});

function selectCharacterForCelebrity(celebrity) {
    if (characters.length === 0) {
        alert('Please add characters first.');
        return;
    }

    const character = prompt(
        `Select a character for ${celebrity.name}:\n` +
        characters.map((char, index) => `${index + 1}. ${char}`).join('\n')
    );

    const characterIndex = parseInt(character) - 1;
    if (characterIndex >= 0 && characterIndex < characters.length) {
        const selectedCharacter = characters[characterIndex];
        addToBasket(celebrity, selectedCharacter);
    } else {
        alert('Invalid selection.');
    }
}

function removeFromBasket(index) {
    const removedItem = basket.splice(index, 1)[0];

    // Re-add the celebrity back to the available list
    celebrities.push({ id: removedItem.id, name: removedItem.name, img: removedItem.img });
    renderCards(celebrities);

    // Re-add the character back to the available list
    characters.push(removedItem.character);

    renderBasket();
}
