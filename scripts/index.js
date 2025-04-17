document.getElementById("homepage-contact-form").addEventListener("submit", function (e) {
    let formData = new FormData(this);
    fetch(this.action, { method: "POST", body: formData })
        .then(response => response.text())
        .then(data => console.log(data));
    e.preventDefault(); // Prevents double submission
});


const gameGrid = document.querySelector('.game-grid');

// List of 6 image sources (used twice to make 12 cards)
const images = [
  'assets/images/game1.png',
  'assets/images/game2.png',
  'assets/images/game3.png',
  'assets/images/game4.png',
  'assets/images/game5.png',
  'assets/images/game6.png'
];


let cardArray = [...images, ...images];
cardArray.sort(() => 0.5 - Math.random()); // Shuffle cards
gameGrid.innerHTML = ''; // Clear any existing cards

// Generate card elements
cardArray.forEach((src, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.image = src;

  card.innerHTML = `
    <div class="front"></div>
    <div class="back">
      <img src="${src}" alt="Memory image ${index + 1}" />
    </div>
  `;

  card.addEventListener('click', () => flipCard(card));
  gameGrid.appendChild(card);
});

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard(card) {
  if (lockBoard || card === firstCard) return;
  card.classList.add('flipped');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = card;
    return;
  }

  secondCard = card;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', () => flipCard(firstCard));
  secondCard.removeEventListener('click', () => flipCard(secondCard));
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}




