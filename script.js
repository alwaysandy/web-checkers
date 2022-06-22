// TODO NEXT
// Add king support

function createBoardArray() {
    // This is where all the game tile dom elements are saved
    const Board = [];
    for (let i = 0; i < 8; i++) {
        Board.push([]);
    }

    return Board;
}

function createCheckersArray() {
    // This array will keep track of checkers on Board
    const checkers = [];
    for (let i = 0; i < 8; i++) {
        checkers.push([]);
        for (let j = 0; j < 8; j++) {
            checkers[i].push(0);
        }
    }

    return checkers;
}

function createChecker() {
    return {
        colour: "",
        king: false,
        ableToJump: false,
    };
}

function createCheckerBoard(Board) {
    const boardDiv = document.querySelector('#board-div');
    for (let y = 0; y < 8; y++) {
        const line = document.createElement('div');
        line.classList.add('line');
        for (let x = 0; x < 8; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.x = x;
            tile.dataset.y = y;

            if (y % 2 == 0) {
                if (x % 2 == 0) {
                    tile.classList.add('white');
                } else {
                    tile.classList.add('black');
                }
            } else {
                if (x % 2 == 0) {
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
    if (colour == 'red') {
        checker.classList.add('red-checker');
    } else {
        checker.classList.add('black-checker')
    }
    
    checker.dataset.x = x;
    checker.dataset.y = y;
    Board[y][x].appendChild(checker);

    let checkerData = createChecker();
    checkerData.colour = colour;
    Checkers[y][x] = checkerData;
}

function placeCheckers(Board) {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 8; x++) {
            if (Board[y][x].classList.contains('black')) {
                placeChecker(Board, x, y, 'black')
            }
        }
    }

    for (let y = 5; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (Board[y][x].classList.contains('black')) {
                placeChecker(Board, x, y, 'red');
            }
        }
    }
}

function unselectTarget() {
    let selected = document.querySelector('.selected');
    if (selected) {
        selected.classList.remove('selected');
    }
}

function selectTarget(t) {
    if (t.target.classList.contains('tile')) {
        t.target.classList.add('selected');
    } else {
        t.target.parentNode.classList.add('selected');
    }
}

function unhighlightMoves() {
    let highlighted = document.querySelectorAll('.highlighted');
    if (highlighted) {
        highlighted.forEach((node) => {
            node.classList.remove('highlighted');
        });
    }
}

function highlightAllowedMoves(Board, t) {
    let x = parseInt(t.target.dataset.x);
    let y = parseInt(t.target.dataset.y);
    let color = getCheckerColour(x, y);
    let king = Checkers[y][x].king;
    
    if (color == 'black' || king) {
        if (moveAllowed(Board, x, y, 1, 1)) {
            Board[y + 1][x + 1].classList.add('highlighted');
        }
        if (moveAllowed(Board, x, y, -1, 1)) {
            Board[y + 1][x - 1].classList.add('highlighted');
        }
    }
    
    if (color == 'red' || king) {
        if (moveAllowed(Board, x, y, 1, -1)) {
            Board[y - 1][x + 1].classList.add('highlighted');
        }
        if (moveAllowed(Board, x, y, -1, -1)) {
            Board[y - 1][x - 1].classList.add('highlighted');
        }
    }
}

function moveAllowed(Board, x, y, dirX, dirY) {
    if (y + dirY < 8 && y + dirY >= 0) {
        if (x + dirX < 8 && x + dirX >= 0) {
            if (!Board[y + dirY][x + dirX].hasChildNodes()) {
                return true;
            }
        }
    }
}

function highlightAllowedJumps(Board, t) {
    let x = parseInt(t.dataset.x);
    let y = parseInt(t.dataset.y);
    let colour = getCheckerColour(x, y);
    let king = Checkers[y][x].king;
    if (colour == 'red' || king) {
        if (checkForJump(Board, x, y, 2, -2, colour)) {
            Board[y - 2][x + 2].classList.add('highlighted');
        }
        if (checkForJump(Board, x, y, -2, -2, colour)) {
            Board[y - 2][x - 2].classList.add('highlighted');
        }
    }

    if (colour == 'black' || king) {
        if (checkForJump(Board, x, y, 2, 2, colour)) {
            Board[y + 2][x + 2].classList.add('highlighted');
        }
        if (checkForJump(Board, x, y, -2, 2, colour)) {
            Board[y + 2][x - 2].classList.add('highlighted');
        }
    }
}

function checkForJumps(Board) {
    let checkers = [];
    let colour = turn;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (Checkers[y][x]) {
                if (Checkers[y][x].colour == colour) {
                    checkers.push([x, y]);
                }
            }
        }
    }
    
    checkers.forEach((checker) => {
        let x = checker[0];
        let y = checker[1];
        let king = Checkers[y][x].king;

        if (colour == "red" || king) {
            if (checkForJump(Board, x, y, 2, -2, colour) ||
            checkForJump(Board, x, y, -2, -2, colour)) {
                Board[y][x].firstChild.classList.add('ableToJump');
                mustJump = true;
            }
        }
        if (colour == "black" || king) {
            if (checkForJump(Board, x, y, -2, 2, colour) ||
            checkForJump(Board, x, y, 2, 2, colour)) {
                Board[y][x].firstChild.classList.add('ableToJump');
                mustJump = true;
            }
        }
    });
}

function checkForJump(Board, x, y, dirX, dirY, colour) {
    if (y + dirY < 8 && y + dirY >= 0) {
        if (x + dirX < 8 && x + dirX >= 0) {
            if (Checkers[y + dirY][x + dirX] == 0)
            {
                if ((colour == 'red' && 
                Checkers[y + (dirY / 2)][x + (dirX / 2)].colour == 'black') || 
                (colour == 'black' && 
                Checkers[y + (dirY / 2)][x + (dirX / 2)] == 'red'))
                {
                    return true;
                }
            }
        }
    }
}

function getCheckerColour(x, y) {
    if (Checkers[y][x]) {
        return Checkers[y][x].colour;
    }

    return false;
}

function isAbleToJump(t) {
    if (t.classList.contains('ableToJump'))
        return true;
    else if (t.hasChildNodes()) {
        return t.firstChild.classList.contains('ableToJump');
    }

    return false;
}

function clearAbleToJump() {
    let hasAbleToJump = document.querySelectorAll('.ableToJump');
    if (hasAbleToJump) {
        hasAbleToJump.forEach((ableToJump) => {
            ableToJump.classList.remove('ableToJump');
        });
    }
}

function checkForDoubleJump(Board, t) {
    highlightAllowedJumps(Board, t);
    return document.querySelectorAll('.highlighted').length > 0;
}

function removeJumpedPiece(Board, t) {
    let oldSpace = document.querySelector('.selected');
    let oldX = parseInt(oldSpace.dataset.x);
    let oldY = parseInt(oldSpace.dataset.y);
    let newX = parseInt(t.dataset.x);
    let newY = parseInt(t.dataset.y);

    let rX = (oldX + newX) / 2;
    let rY = (oldY + newY) / 2;
    Board[rY][rX].removeChild(Board[rY][rX].firstChild);
    Checkers[rY][rX] = 0;
}

function kingMe(Board, x, y) {
    Board[y][x].firstChild.classList.add('king');
    Checkers[y][x].king = true;
    justKinged = true;
}

function movePiece(Board, t) {
    const selected = document.querySelector('.selected').firstChild;
    let x = t.dataset.x;
    let y = t.dataset.y;
    let oldX = selected.dataset.x;
    let oldY = selected.dataset.y;
    selected.dataset.x = x;
    selected.dataset.y = y;
    Board[y][x].appendChild(selected);
    let movedPiece = Checkers[oldY][oldX];
    Checkers[oldY][oldX] = 0;
    Checkers[y][x] = movedPiece;

    let colour = getCheckerColour(x, y);
    if ((colour == 'black' && y == 7) ||
    (colour == 'red' && y == 0)) {
         kingMe(Board, x, y);
     }
}

function addEventListeners(Board) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', (t) => {
            // REWRITE ME
            // HELL PILE OF CODE THAT SOMEHOW WORKS
            let x = t.target.dataset.x;
            let y = t.target.dataset.y;
            colour = getCheckerColour(x, y);
            if (t.target.classList.contains('highlighted')) {
                if (mustJump) {
                    removeJumpedPiece(Board, t.target);
                    mustJump = false;
                    clearAbleToJump();
                    movePiece(Board, t.target);
                    unselectTarget();
                    unhighlightMoves();
                    if (!justKinged) {
                        if (checkForDoubleJump(Board, t.target)) {
                            mustJump = true;
                            selectTarget(t);
                        }
                    } else {
                        justKinged = false;
                    }
                } else {
                    movePiece(Board, t.target);
                    unselectTarget();
                    unhighlightMoves();
                    justKinged = false;
                }
                // Only run this in case there's no double jump
                if (!mustJump) {
                    turn = turn == 'red' ? 'black' : 'red';
                    checkForJumps(Board);
                }
            } else if (colour) {
                if ((turn == 'red' && colour == 'red') ||
                (turn == 'black' && colour == 'black') ||
                isAbleToJump(t.target)) {
                    unselectTarget();
                    selectTarget(t);
                    unhighlightMoves();
                    if(mustJump) {
                        highlightAllowedJumps(Board, t.target);
                    } else {
                        highlightAllowedMoves(Board, t);
                    }   
                }
            }
        });
    });
}

function startGame() {
    const Board = createBoardArray();
    createCheckerBoard(Board);
    // placeCheckers(Board);
    placeChecker(Board, 0, 7, 'red');
    placeChecker(Board, 1, 6, 'black');
    placeChecker(Board, 3, 6, 'black');
    placeChecker(Board, 5, 6, 'black');
    Board[7][0].firstChild.classList.add('king');
    Checkers[7][0].king = true;
    Board[7][0].firstChild.classList.add('ableToJump')
    Board[6][3].firstChild.classList.add('king');
    Checkers[6][3].king = true;
    addEventListeners(Board);
}

let turn = 'red';
let mustJump = true;
let justKinged = false;
const Checkers = createCheckersArray();

startGame();