/* Imports */
import { renderFriend, renderMushroom } from './render-utils.js';
import { getRandomItem } from './utils.js';

/* Get DOM Elements */
const messageSection = document.getElementById('message-section');
const mushroomContainer = document.getElementById('mushroom-container');
const huntMushroomsButton = document.getElementById('hunt-mushrooms-button');
const addFriendForm = document.getElementById('add-friend-form');
const sayGoodbyeButton = document.getElementById('say-goodbye-button');
const friendsSection = document.getElementById('friends-section');

/* State */
let message = '';
let mushrooms = [{ type: 'porcini' }, { type: 'chanterelle' }, { type: 'morel' }];

let friends = [
    { name: 'Wilbur', satisfied: 0 },
    { name: 'Miss Piggy', satisfied: 0 },
    { name: 'Pumbaa', satisfied: 0 },
];

// static types and probabilities
const porcini = {
    type: 'porcini',
};
const chanterelle = {
    type: 'chanterelle',
};
const morel = {
    type: 'morel',
};

const amountFound = [0, 0, 0, 0, 1, 1, 1, 2];
const mushroomTypeFound = [porcini, porcini, porcini, morel, morel, chanterelle];

/* Events */

const foundMessage = ['No mushrooms found!', 'You found 1 mushroom', 'You found 2 mushrooms'];

huntMushroomsButton.addEventListener('click', () => {
    const found = getRandomItem(amountFound);

    for (let i = 0; i < found; i++) {
        const mushroomType = getRandomItem(mushroomTypeFound);
        const mushroom = {
            type: mushroomType.type,
        };
        mushrooms.push(mushroom);
    }

    message = foundMessage[found];

    displayMessage();
    displayMushrooms();
});

addFriendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addFriendForm);

    const friend = {
        name: formData.get('name'),
        satisfied: 0,
    };
    friends.push(friend);

    message = `You invited ${friend.name} to the mushroom festival!`;

    addFriendForm.reset();
    displayFriends();
});

sayGoodbyeButton.addEventListener('click', () => {
    const stillHungry = [];
    for (const friend of friends) {
        if (friend.satisfied < 3) {
            stillHungry.push(friend);
        }
    }
    friends = stillHungry;
    displayFriends();
});

/* Display Functions */
function displayMessage() {
    messageSection.textContent = message;
}

function displayMushrooms() {
    mushroomContainer.innerHTML = '';

    for (const mushroom of mushrooms) {
        const mushroomEl = renderMushroom(mushroom);
        mushroomContainer.append(mushroomEl);
    }
}

function displayFriends() {
    friendsSection.innerHTML = '';

    for (const friend of friends) {
        const friendEl = renderFriend(friend);

        friendEl.addEventListener('click', () => {
            if (!mushrooms.length) {
                message = "No mushrooms found! Keep on huntin'";
            } else if (friend.satisfied === 3) {
                message = `${friend.name} is full. Pick a different friend...`;
            } else {
                const mushroom = mushrooms.pop();
                friend.satisfied++;
                message = `${friend.name} enjoyed the ${mushroom.type}`;
            }
            displayMessage();
            displayMushrooms();
            displayFriends();
        });

        friendsSection.append(friendEl);
    }
}

displayMessage();
displayMushrooms();
displayFriends();
