const frontPicture = 'deck.png';
const backImages = [
    'arya.jpg',
    'bran.jpg',
    'cercei.webp',
    'drogo.jpg',
    'jamie.jpg',
    'jaqen.jpg',
    'joffrey.webp',
    'khaleesi.webp',
    'lilfinger.webp',
    'ned.jpg',
    'oberyn.webp',
    'sansa.webp',
    'snow.webp',
    'tyrion.jpg',
];
const cards = Array.from({
    length: 14
}, (_, index) => index + 1).flatMap(value => [value, value]);
let flippedCards = [];
let currentPlayer = 1;
let matchedPairs = 0;
let score1 = 0;
let score2 = 0;
let isFlipping = false;
let player1Name = "";
let player2Name = "";
let gameOver = false;


window.addEventListener('load', () => {

    document.getElementById('name-popup').style.display = 'block';
});

function startGame() {
    // här får man namnen som man väljer
    player1Name = document.getElementById("player1Name").value.trim() || "Player 1";
    player2Name = document.getElementById("player2Name").value.trim() || "Player 2";


    document.getElementById('name-popup').style.display = 'none';


    document.getElementById('game-container').style.display = 'block';

    // uppdaterar titel och poäng
    updateTitle();
    document.getElementById('score1').textContent = `${player1Name} Score: 0`;
    document.getElementById('score2').textContent = `${player2Name} Score: 0`;

    // Startar spelet
    initializeGame();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');

    const frontFace = document.createElement('div');
    frontFace.classList.add('face', 'front');
    frontFace.style.backgroundImage = `url('${frontPicture}')`;
    card.appendChild(frontFace);

    const backFace = document.createElement('div');
    backFace.classList.add('face', 'back');
    backFace.style.backgroundImage = `url('${backImages[value - 1] || ''}')`;
    card.appendChild(backFace);

    card.addEventListener('click', () => flipCard(card, value));
    return card;
}

function flipCard(card, value) {
    if (!isFlipping && !card.classList.contains('flip') && flippedCards.length < 2) {
        card.classList.add('flip');
        flippedCards.push({
            card,
            value
        });

        if (flippedCards.length === 2) {
            isFlipping = true;
            setTimeout(() => checkMatch(), 1000);
        }
    }

    if (matchedPairs === 14 && flippedCards.length === 2) {
        setTimeout(() => {
            document.querySelectorAll('.card.flip').forEach(card => card.classList.remove('flip'));
            flippedCards = [];
            isFlipping = false;
        }, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.value === card2.value) {
        card1.card.removeEventListener('click', () => flipCard(card1.card, card1.value));
        card2.card.removeEventListener('click', () => flipCard(card2.card, card2.value));
        updateScore();
    } else {
        card1.card.classList.remove('flip');
        card2.card.classList.remove('flip');
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTitle();
    }

    flippedCards = [];
    isFlipping = false;

    const remainingCards = document.querySelectorAll('.card:not(.flip)');
    if (remainingCards.length === 0 && !gameOver) {
        gameOver = true;
        // visar vem som vunnit ronden/gamet
        setTimeout(() => {
            let winnerText = '';
            if (score1 > score2) {
                winnerText = `${player1Name} wins the round!`;
            } else if (score1 < score2) {
                winnerText = `${player2Name} wins the round!`;
            } else {
                winnerText = "Nobody wins, try again!";
            }

            document.getElementById('winner-text').textContent = winnerText;
            document.getElementById('winner-popup').style.display = 'block';
        }, 1000);
    }
}

function updateTitle() {
    document.getElementById('title').textContent = `Player ${currentPlayer === 1 ? player1Name : player2Name}'s Turn`;
}

function updateScore() {
    const pointsPerSet = 1;

    if (currentPlayer === 1) {
        score1 += pointsPerSet;
    } else {
        score2 += pointsPerSet;
    }

    document.getElementById('score1').textContent = `${player1Name} Score: ${score1}`;
    document.getElementById('score2').textContent = `${player2Name} Score: ${score2}`;

    matchedPairs++;

    if (matchedPairs === 14) {
        let winnerText = '';
        if (score1 > score2) {
            winnerText = `${player1Name} wins the round!`;
        } else if (score1 < score2) {
            winnerText = `${player2Name} wins the round!`;
        } else {
            winnerText = "Nobody wins, try again!";
        }

        document.getElementById('winner-text').textContent = winnerText;
        document.getElementById('winner-popup').style.display = 'block';
    }
}

function initializeGame() {
    shuffle(cards);
    const gameBoard = document.getElementById('game-board');

    gameBoard.innerHTML = '';

    cards.forEach(value => {
        const card = createCard(value);
        gameBoard.appendChild(card);
    });
}

function restartGame() {
    document.getElementById('winner-popup').style.display = 'none';

    document.getElementById('name-popup').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';

    initializeGame();
    gameOver = false;
}

initializeGame();
