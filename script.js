// TODO add way to change amount of checker rows

function createBoardArray() {
    // This is where all the game tile dom elements are saved
    const Board = [];
    for (let i = 0; i < sizeY; i++) {
        Board.push([]);
    }

    return Board;
}

function createCheckersArray() {
    // This array will keep track of checkers on Board
    const checkers = [];
    for (let i = 0; i < sizeY; i++) {
        checkers.push([]);
        for (let j = 0; j < sizeX; j++) {
            checkers[i].push(0);
        }
    }

    return checkers;
}

function createCheckerBoard(Board) {
    const boardDiv = document.querySelector('#board-div');
    for (let y = 0; y < sizeY; y++) {
        const line = document.createElement('div');
        line.classList.add('line');
        for (let x = 0; x < sizeX; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;

            if (y % 2 === 0) {
                if (x % 2 === 0) {
                    tile.classList.add('white');
                } else {
                    tile.classList.add('black');
                }
            } else {
                if (x % 2 === 0) {
                    tile.classList.add('black');
                } else {
                    tile.classList.add('white');
                }
            }

            Board[y].push(tile);
            line.appendChild(tile);
        }

        boardDiv.appendChild(line);
    }
}

function placeChecker(Board, x, y, colour) {
    let checker = document.createElement('div')
    checker.classList.add('checker');
    if (colour === 'red') {
        checker.classList.add('red-checker');
    } else {
        checker.classList.add('black-checker')
    }
    
    checker.dataset.x = x;
    checker.dataset.y = y;
    Board[y][x].appendChild(checker);

    let checkerData = {
        colour: colour,
        king: false,
    }

    Checkers[y][x] = checkerData;
}

function placeCheckers(Board) {
    for (let y = 0; y < checkerRows; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Board[y][x].classList.contains('black')) {
                placeChecker(Board, x, y, 'black')
            }
        }
    }

    for (let y = sizeY - checkerRows; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Board[y][x].classList.contains('black')) {
                placeChecker(Board, x, y, 'red');
            }
        }
    }
}

function unselectTile(Board) {
    if (selectedTile[0] !== -1) {
        Board[selectedTile[1]][selectedTile[0]].classList.remove('selected');
    }
    selectedTile[0] = -1;
    selectedTile[1] = -1;
}

function selectTile(Board, x, y) {
    Board[y][x].classList.add('selected');
    selectedTile[0] = x;
    selectedTile[1] = y;
}

function clearValidMoves(Board) {
    for (let move of validMoves) {
        Board[move[1]][move[0]].classList.remove('highlighted');
    }
    validMoves = [];
}

function findValidMoves(x, y) {
    let colour = Checkers[y][x].colour;
    let king = Checkers[y][x].king;
    
    if (colour === 'black' || king) {
        if (moveAllowed(x, y, 1, 1)) {
            validMoves.push([x + 1, y + 1]);
        }
        if (moveAllowed(x, y, -1, 1)) {
            validMoves.push([x - 1, y + 1]);
        }
    }
    
    if (colour === 'red' || king) {
        if (moveAllowed(x, y, 1, -1)) {
            validMoves.push([x + 1, y - 1]);
        }
        if (moveAllowed(x, y, -1, -1)) {
            validMoves.push([x - 1, y - 1]);
        }
    }
}

function highlightValidMoves(Board) {
    for (let move of validMoves) {
        Board[move[1]][move[0]].classList.add('highlighted');
    }
}

function moveAllowed(x, y, dirX, dirY) {
    if (y + dirY < sizeY && y + dirY >= 0) {
        if (x + dirX < sizeX && x + dirX >= 0) {
            if (!Checkers[y + dirY][x + dirX]) {
                return true;
            }
        }
    }
}

function findJumps(Board, x, y) {
    let colour = Checkers[y][x].colour;
    let king = Checkers[y][x].king;
    if (colour === 'red' || king) {
        if (checkForJump(x, y, 2, -2, colour)) {
            validMoves.push([x + 2, y - 2]);
        }
        if (checkForJump(x, y, -2, -2, colour)) {
            validMoves.push([x - 2, y - 2]);
        }
    }

    if (colour === 'black' || king) {
        if (checkForJump(x, y, 2, 2, colour)) {
            validMoves.push([x + 2, y + 2]);
        }
        if (checkForJump(x, y, -2, 2, colour)) {
            validMoves.push([x - 2, y + 2]);
        }
    }

    for (let move of validMoves) {
        Board[move[1]][move[0]].classList.add('highlighted');
    }
}

function checkIfJumpAvailable() {
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Checkers[y][x]) {
                if (Checkers[y][x].colour === turn) {
                    if (turn === "red" || Checkers[y][x].king) {
                        if (checkForJump(x, y, 2, -2) ||
                        checkForJump(x, y, -2, -2)) {
                            mustJump = true;
                            return true;
                        }
                    }
                    if (turn === "black" || Checkers[y][x].king) {
                        if (checkForJump(x, y, -2, 2) ||
                        checkForJump(x, y, 2, 2)) {
                            mustJump = true;
                            return true;
                        }
                    }
                }
            }
        }
    }

    return false;
}

function checkForJump(x, y, dirX, dirY) {
    if (y + dirY < sizeY && y + dirY >= 0) {
        if (x + dirX < sizeX && x + dirX >= 0) {
            if (!Checkers[y + dirY][x + dirX])
            {   
                return (Checkers[y + (dirY / 2)][x + (dirX / 2)] && 
                    Checkers[y + (dirY / 2)][x + (dirX / 2)].colour !== turn); 
                /*if ((colour === 'red' && 
                Checkers[y + (dirY / 2)][x + (dirX / 2)].colour === 'black') || 
                (colour === 'black' && 
                Checkers[y + (dirY / 2)][x + (dirX / 2)].colour === 'red'))
                {
                    return true;
                }*/
            }
        }
    }
}

function removeJumpedPiece(Board, newX, newY) {
    let oldX = selectedTile[0];
    let oldY = selectedTile[1];

    let rmvX = (oldX + newX) / 2;
    let rmvY = (oldY + newY) / 2;
    Board[rmvY][rmvX].removeChild(Board[rmvY][rmvX].firstChild);
    Checkers[rmvY][rmvX] = 0;
}

function kingMe(Board, x, y) {
    Board[y][x].firstChild.classList.add('king');
    Checkers[y][x].king = true;
    justKinged = true;
}

function movePiece(Board, x, y) {
    let oldX = selectedTile[0];
    let oldY = selectedTile[1];
    const selectedChecker = Board[oldY][oldX].firstChild;

    selectedChecker.dataset.x = x;
    selectedChecker.dataset.y = y;
    Board[y][x].appendChild(selectedChecker);
    let movedPiece = Checkers[oldY][oldX];
    Checkers[oldY][oldX] = 0;
    Checkers[y][x] = movedPiece;

    justKinged = false;
    let colour = Checkers[y][x].colour;
    if (!Checkers[y][x].king) {
        if ((colour === 'black' && y === sizeY - 1) ||
        (colour === 'red' && y === 0)) {
            kingMe(Board, x, y);
        }
    }
}

function checkForWin(Board) {
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Checkers[y][x]) {
                if (Checkers[y][x].colour === turn) {
                    findValidMoves(x, y);
                    if (validMoves.length > 0) {
                        clearValidMoves(Board);
                        return false;
                    }
                }
            }
        }
    }


    return true;
}

function addEventListeners(Board) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', (t) => {
            // REWRITE ME
            // HELL PILE OF CODE THAT SOMEHOW WORKS
            let x = parseInt(t.target.dataset.x);
            let y = parseInt(t.target.dataset.y);
            if (validMoves.find((move) => move[0] === x && move[1] === y)) {
                if (mustJump) {
                    removeJumpedPiece(Board, x, y);
                }
                movePiece(Board, x, y);
                unselectTile(Board);
                clearValidMoves(Board);
                mustJump = false;
                if (!justKinged && mustJump) {
                    findJumps(Board, x, y);
                    if (validMoves.length > 0) {
                        selectTile(Board, x, y);
                        mustJump = true;
                    }
                }
                
                // Only run this in case there's no double jump
                if (!mustJump) {
                    turn = turn === 'red' ? 'black' : 'red';
                    if (!checkIfJumpAvailable(Board)) {
                        // checkForWin just checks whether there's an available move to make
                        if (checkForWin(Board)) {
                            turn = turn === 'red' ? 'BLACK' : 'RED';
                            alert(`WINNER WINNER CHICKEN DINNER ${turn} WINS`);
                        }
                    }
                }
            } else if (Checkers[y][x]) {
                if (turn === Checkers[y][x].colour) { 
                    unselectTile(Board);
                    selectTile(Board, x, y);
                    clearValidMoves(Board);
                    if(mustJump) {
                        findJumps(Board, x, y);
                    } else {
                        findValidMoves(x, y);
                        highlightValidMoves(Board);
                    }   
                }
            }
        });
    });
}

function resetGame() {
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Board[y][x].hasChildNodes()) {
                Board[y][x].firstChild.remove();
            }
            Board[y][x].remove();
        }
    }

    turn = "red";
    mustJump = false;
    justKinged = false;
    validMoves = [];
    selectedTile = [-1, -1];
    Board = createBoardArray();
    Checkers = createCheckersArray();
    startGame(Board);
}

function startGame() {
    createCheckerBoard(Board);
    placeCheckers(Board);
    if (checkerRows >= sizeY / 2) {
        alert("WARNING, TOO MANY CHECKER ROWS FOR SIZE OF BOARD");
    }

    addEventListeners(Board);
}

// Height of board
let sizeY = 3;
// Width of board
let sizeX = 3;
//Amount of initial rows of checkers
let checkerRows = 1;

let turn = 'red';
let mustJump = false;
let justKinged = false;
let Board = createBoardArray();
let Checkers = createCheckersArray();
let selectedTile = [-1, -1];
let validMoves = [];


const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", resetGame);
startGame();
