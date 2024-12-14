const basket = [];

const cardsContainer = document.getElementById('cards-container');
const basketContainer = document.getElementById('basket');

// Fetch data from JSON file
fetch('data/mycast.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        renderCards(data);
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
        card.addEventListener('click', () => addToBasket(item));
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
            <p>${item.name}</p>
            <button class="remove-button" onclick="removeFromBasket(${index})"> X </button>
        `;
        basketContainer.appendChild(basketItem);
    });
}

function addToBasket(item) {
    if (!basket.some(basketItem => basketItem.id === item.id)) {
        basket.push(item);
        renderBasket();
    } else {
        alert(`${item.name} is already in the basket!`);
    }
}

function removeFromBasket(index) {
    basket.splice(index, 1);
    renderBasket();
}
