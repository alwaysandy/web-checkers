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

function createChecker(x, y, colour) {
    let checker = document.createElement('div')
    checker.classList.add('checker');
    if (colour === 'red') {
        checker.classList.add('red-checker');
    } else {
        checker.classList.add('black-checker')
    }
    
    checker.dataset.x = x;
    checker.dataset.y = y;

    let checkerData = {
        colour: colour,
        king: false,
    }

    Checkers[y][x] = checkerData;
    
    return checker;
}

function placeCheckers(Board) {
    let checker;
    for (let y = 0; y < checkerRows; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Board[y][x].classList.contains('black')) {
                checker = createChecker(x, y, 'black')
                Board[y][x].appendChild(checker);
            }
        }
    }

    for (let y = sizeY - checkerRows; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Board[y][x].classList.contains('black')) {
                checker = createChecker(x, y, 'red');
                Board[y][x].appendChild(checker);
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

function moveAllowed(x, y, dirX, dirY) {
    if (y + dirY < sizeY && y + dirY >= 0) {
        if (x + dirX < sizeX && x + dirX >= 0) {
            if (!Checkers[y + dirY][x + dirX]) {
                return true;
            }
        }
    }
}

function highlightValidMoves(Board) {
    for (let move of validMoves) {
        Board[move[1]][move[0]].classList.add('highlighted');
    }
}

function findJumps(x, y) {
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
}

function checkForJump(x, y, dirX, dirY) {
    if (y + dirY < sizeY && y + dirY >= 0) {
        if (x + dirX < sizeX && x + dirX >= 0) {
            if (!Checkers[y + dirY][x + dirX])
            {   
                return (Checkers[y + (dirY / 2)][x + (dirX / 2)] && 
                    Checkers[y + (dirY / 2)][x + (dirX / 2)].colour !== turn); 
            }
        }
    }
}

function checkIfJumpAvailable() {
    for (let y = 0; y < sizeY; y++) {
        for (let x = 0; x < sizeX; x++) {
            if (Checkers[y][x] && Checkers[y][x].colour === turn) {
                findJumps(x, y);
                if (validMoves.length > 0) {
                    return true;
                }
            }
        }
    }

    return false;
}

function highlightJumps() {
    if (validMoves.length > 0) {
        for (let move of validMoves) {
            Board[move[1]][move[0]].classList.add('highlighted');
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
            if (Checkers[y][x] && Checkers[y][x].colour === turn) {
                findValidMoves(x, y);
                if (validMoves.length > 0) {
                    clearValidMoves(Board);
                    return false;
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
                
                if (!justKinged && mustJump) {
                    findJumps(x, y);
                    highlightJumps();
                }

                // There will only be a valid move if there's a double jump
                if (validMoves.length > 0) {
                    selectTile(Board, x, y);
                } else {
                    mustJump = false;
                }
                
                // Only run this in case there's no double jump
                if (!mustJump) {
                    turn = turn === 'red' ? 'black' : 'red';
                    if (checkIfJumpAvailable(Board)) {
                        mustJump = true;
                    } else if (checkForWin(Board)) {
                        turn = turn === 'red' ? 'BLACK' : 'RED';
                        alert(`WINNER WINNER CHICKEN DINNER ${turn} WINS`);
                    }
                }
            } else if (Checkers[y][x]) {
                if (turn === Checkers[y][x].colour) { 
                    unselectTile(Board);
                    selectTile(Board, x, y);
                    clearValidMoves(Board);
                    if(mustJump) {
                        findJumps(x, y);
                        highlightJumps();
                    } else {
                        findValidMoves(x, y);
                        highlightValidMoves(Board);
                    }   
                }
            }
        });
    });
}

function changeSize() {
    let x, y, rows;
    while(true) {
        y = parseInt(prompt("How many tiles tall should the board be?"));
        if (isNaN(y) || y < 3) {
            alert("Height value must be an integer >= 3");
        } else {
            sizeY = y;
            break;
        }
    }

    while(true) {
        x = parseInt(prompt("How many tiles wide should the board be?"))
        if (isNaN(x) || x < 3) {
            alert("Width value must be an integer >= 3");
        } else {
            sizeX = x;
            break;
        }
    }
    
    while(true) {
        rows = parseInt(prompt("How many rows of checkers per side?"));
        if (isNaN(rows) || rows < 1) {
            alert("Number of checker rows must be an integer >= 1");
        } else if (rows >= (sizeY / 2)){
            alert("Too many rows of checkers for size of board.")
        } else {
            checkerRows = rows;
            break;
        }
    }

    resetGame();
}

function resetGame() {
    for (let y = 0; y < Board.length; y++) {
        for (let x = 0; x < Board[0].length; x++) {
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
    addEventListeners(Board);
}

// Height of board
let sizeY = 8;
// Width of board
let sizeX = 8;
//Amount of initial rows of checkers
let checkerRows = 3;

let turn = 'red';
let mustJump = false;
let justKinged = false;
let Board = createBoardArray();
let Checkers = createCheckersArray();
let selectedTile = [-1, -1];
let validMoves = [];

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", resetGame);

const sizeButton = document.querySelector("#size");
sizeButton.addEventListener("click", changeSize);

startGame();
