//Written by Augustina Vornehm

//submit contact form

document.getElementById("homepage-contact-form").addEventListener("submit", function (e) {
    let formData = new FormData(this);
    fetch(this.action, { method: "POST", body: formData })
        .then(response => response.text())
        .then(data => console.log(data));
    e.preventDefault(); // Prevents double submission
});


//mini game


const gameGrid = document.querySelector('.game-grid');
const gameSection = document.getElementById('memory-game');

// Game state variables
const images = [
  'assets/images/game1.png',
  'assets/images/game2.png',
  'assets/images/game3.png',
  'assets/images/game4.png',
  'assets/images/game5.png',
  'assets/images/game6.png'
];

let cardArray, hasFlippedCard, lockBoard, firstCard, secondCard;
let matchedPairs = 0;
let tries = 0;

// Check if the try counter already exists, if not create it
let tryDisplay = document.querySelector('.try-counter');
if (!tryDisplay) {
  tryDisplay = document.createElement('p');
  tryDisplay.classList.add('try-counter');
  tryDisplay.textContent = `Tries: 0`;
  gameSection.insertBefore(tryDisplay, gameGrid);
}

let highScoreDisplay = document.querySelector('.high-score');
if (!highScoreDisplay) {
  highScoreDisplay = document.createElement('p');
  highScoreDisplay.classList.add('high-score');
  highScoreDisplay.textContent = `High Score: ${localStorage.getItem('highScore') || 'N/A'}`;
  gameSection.appendChild(highScoreDisplay);
}

const tryAgainBtn = document.createElement('button');
tryAgainBtn.textContent = "Try Again";
tryAgainBtn.classList.add('try-again-btn');
tryAgainBtn.style.display = 'none';
tryAgainBtn.addEventListener('click', startGame);
gameSection.appendChild(tryAgainBtn);

function startGame() {
  // Reset everything
  cardArray = [...images, ...images];
  cardArray.sort(() => 0.5 - Math.random());
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
  matchedPairs = 0;
  tries = 0;
  tryDisplay.textContent = `Tries: 0`;  // Reset the try counter
  tryAgainBtn.style.display = 'none';  // Hide the "Try Again" button

  // Clear the game grid before adding new cards
  gameGrid.innerHTML = '';

  // Generate new card elements
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
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('flipped')) return;

  card.classList.add('flipped');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = card;
    return;
  }

  secondCard = card;
  tries++;
  tryDisplay.textContent = `Tries: ${tries}`;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.image === secondCard.dataset.image;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', () => flipCard(firstCard));
  secondCard.removeEventListener('click', () => flipCard(secondCard));
  matchedPairs++;

  if (matchedPairs === images.length) {
    setTimeout(() => {
      tryAgainBtn.style.display = 'inline-block';
      updateHighScore();
    }, 800);
  }

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

function updateHighScore() {
  // Check if the current tries are lower than the stored high score
  const currentHighScore = localStorage.getItem('highScore');
  if (!currentHighScore || tries < currentHighScore) {
    localStorage.setItem('highScore', tries);
    highScoreDisplay.textContent = `High Score: ${tries}`;
  }
}

// Start the game for the first time
startGame();
