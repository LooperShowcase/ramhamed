const cardscontainer = document.getElementById("cards");

let cards = [];
let firstcard, secondcard;
let lockBoard = false;
let score = 0;

let scoreBoard = document.getElementById("score");
scoreBoard.textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(cards);
    cards = [...data, ...data];
    shuffleCards();
    generatecards();
  });

function shuffleCards() {
  let currentIndex = cards.length;
  let randomIndex;
  let temporaryValue;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}
function generatecards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
        <div class="front">
            <img class="front-image" src="${card.image}" />
        </div>
        <div class="back"></div>
        `;
    cardscontainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipcard);
  }
}
function flipcard() {
  if (lockBoard) {
    return;
  }
  if (this === firstcard) {
    return;
  }
  this.classList.add("flipped");

  if (!firstcard) {
    firstcard = this;
    return;
  }
  secondcard = this;
  lockBoard = true;
  checkForMatch();
  scoreBoard.textContent = score;
}
function checkForMatch() {
  if (firstcard.dataset.name === secondcard.dataset.name) disablecards();
  else unflipcards();
}
function disablecards() {
  firstcard.removeEventListener("click", flipcard);
  secondcard.removeEventListener("click", flipcard);
  firstcard.removeEventListener("touchstart", flipcard);
  secondcard.removeEventListener("touchstar", flipcard);
  score++;
  if(score===9)
  startConfetti();
  unlockBoard();
}
function unflipcards() {
  setTimeout(() => {
    firstcard.classList.remove("flipped");
    secondcard.classList.remove("flipped");
    unlockBoard();
  }, 1000);
}
function unlockBoard() {
  firstcard = null;
  secondcard = null;
  lockBoard = false;
}
function restart() {
  shuffleCards();
  unlockBoard();
  score = 0;
  scoreBoard.textContent = score;
  cardscontainer.innerHTML = " ";
  generatecards();
  stopConfetti();
}

