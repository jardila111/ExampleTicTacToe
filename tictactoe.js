const xImageURL = "https://img.freepik.com/premium-vector/twitter-new-x-logo-design-vector_1340851-70.jpg"
const oImageURL = "https://1000logos.net/wp-content/uploads/2020/08/Opera-Logo-2013.jpg"

const freeBoxes =[];
const takenBoxes = []; // Empty dictionary for mapping of box id to owner

function assignSpaces(item, owner) {
    const img = document.createElement('img');
    img.src = owner === 'X' ? xImageURL : oImageURL;
    
    let index = parseInt(item.id);
    takenBoxes[index] = owner;

    item.appendChild(img);
    item.removeEventListener('click', onClick);

    index = freeBoxes.indexOf(item);
    freeBoxes.splice(index, 1);
}

function onClick(event) {
    assignSpaces(event.currentTarget, 'X');
    if (isGameOver()) {
        displayWinner();
    } else {
        computerChooseO();
    }
}

function computerChooseO() {
    if (freeBoxes.length === 0) {
        return; // no empty items, do nothing
    }

    const randomIndex = computerChooseMove();
    const chosenItem = freeBoxes[randomIndex];
    assignSpaces(chosenItem, 'O');
    if (isGameOver()) {
        displayWinner();
    }
}
const gridItems = document.querySelectorAll('#grid div');
for (const item of gridItems) {
    item.addEventListener('click', onClick);
    freeBoxes.push(item);
}

function isGameOver() {
    if (getWinner() === 'X' || getWinner() === 'O') {
        return true;
    }
    if(freeBoxes.length === 0) {
        return true;
    }
    return false;
}

function displayWinner() {
    // Display winner message by using winner: if winner is 'X' or 'O', display 'X wins!' or 'O wins!'
    // Otherwise display 'Tie!'
    let winner = getWinner();
    // if (winner === 'X') {
    //     alert('You wins!');
    // } else if (winner === 'O') {
    //     alert('You lose!');
    // } else {
    //     alert('Tie!');
    // }
    const resultContainer = document.querySelector('#result');
    const headingMessage = document.createElement('h1');
    if (winner === 'X') {
        headingMessage.textContent = 'You wins!';
    } else if (winner === 'O') {
        headingMessage.textContent = 'You lose!';
    } else {
        headingMessage.textContent = 'Tie!';
    }
    resultContainer.appendChild(headingMessage);

    // remove all remainding event listeners
    for (const item of gridItems) {
        item.removeEventListener('click', onClick);
    }
}

function getWinner() {
    let rowResult = checkBoxes("0", "1", "2") || checkBoxes("3", "4", "5") || checkBoxes("6", "7", "8");
    if (rowResult !== null) {
        return rowResult;
    }
    let colResult = checkBoxes("0", "3", "6") || checkBoxes("1", "4", "7") || checkBoxes("2", "5", "8");
    if (colResult !== null) {
        return colResult;
    }
    const diagResult = checkBoxes("0", "4", "8") || checkBoxes("2", "4", "6");
    if (diagResult !== null) {
        return diagResult;
    }
    return null;
}

function checkBoxes(first, second, third) {
    if (takenBoxes[first] !== undefined &&
        takenBoxes[second] === takenBoxes[first] &&
        takenBoxes[second] === takenBoxes[third]
    )
        return takenBoxes[first];
    return null;
}

function computerChooseMove() {
    // First see if O can win in the next move. If so, return the winning move
    for (let i = 0; i < freeBoxes.length; i++) {
        const cell = freeBoxes[i];
        const index = parseInt(cell.id);

        // Temporarily mark this spot for O
        const previousValue = takenBoxes[index];
        takenBoxes[index] = 'O';

        // Check if that makes O win
        const winner = getWinner();

        // Undo the change
        takenBoxes[index] = previousValue;

        if (winner === 'O') {
            return i;  // index in freeBoxes
        }
    }

    // Second, see if opponent can win in the next move. If so, make that move so the opponent doesn't win
    for (let i = 0; i < freeBoxes.length; i++) {
        const cell = freeBoxes[i];
        const index = parseInt(cell.id);

        const previousValue = takenBoxes[index];
        takenBoxes[index] = 'X';

        const winner = getWinner();

        takenBoxes[index] = previousValue;

        if (winner === 'X') {
            return i;  // block this move
        }
    }

    // If none of the above, just make a random move
    return Math.floor(Math.random() * freeBoxes.length);
}