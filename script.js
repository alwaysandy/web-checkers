// TODO NEXT
// Add king support

function createBoardArray() {
    const board = [];
    for (let i = 0; i < 8; i++) {
        board.push([]);
    }

    return board;
}

function createCheckerBoard(board) {
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

            board[y].push(tile);
            line.appendChild(tile);
        }

        boardDiv.appendChild(line);
    }

    return board;
}

function placeChecker(board, x, y, colour) {
    let checker = document.createElement('div')
    checker.classList.add('checker');
    if (colour == 'red') {
        checker.classList.add('red-checker');
    } else {
        checker.classList.add('black-checker')
    }
    
    checker.dataset.x = x;
    checker.dataset.y = y;
    board[y][x].appendChild(checker);
}

function placeCheckers(board) {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x].classList.contains('black')) {
                placeChecker(board, x, y, 'black')
            }
        }
    }

    for (let y = 5; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x].classList.contains('black')) {
                placeChecker(board, x, y, 'red');
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

function highlightAllowedMoves(board, t) {
    let x = parseInt(t.target.dataset.x);
    let y = parseInt(t.target.dataset.y);
    let color = getCheckerColour(board[y][x]);
    let king = board[y][x].firstChild.classList.contains('king');
    
    if (color == 'black' || king == true) {
        if (moveAllowed(board, x, y, 1, 1)) {
            board[y + 1][x + 1].classList.add('highlighted');
        }
        if (moveAllowed(board, x, y, -1, 1)) {
            board[y + 1][x - 1].classList.add('highlighted');
        }
    }
    
    if (color == 'red' || king == true) {
        if (moveAllowed(board, x, y, 1, -1)) {
            board[y - 1][x + 1].classList.add('highlighted');
        }
        if (moveAllowed(board, x, y, -1, -1)) {
            board[y - 1][x - 1].classList.add('highlighted');
        }
    }
}

function moveAllowed(board, x, y, dirX, dirY) {
    if (y + dirY < 8 && y + dirY >= 0) {
        if (x + dirX < 8 && x + dirX >= 0) {
            if (!board[y + dirY][x + dirX].hasChildNodes()) {
                return true;
            }
        }
    }
}

function highlightAllowedJumps(board, t) {
    let x = parseInt(t.dataset.x);
    let y = parseInt(t.dataset.y);
    let colour = getCheckerColour(board[y][x]);
    let king = board[y][x].firstChild.classList.contains('king');
    if (colour == 'red') {
        if (checkForJump(board, x, y, 2, -2, 'red')) {
            board[y - 2][x + 2].classList.add('highlighted');
        }
        if (checkForJump(board, x, y, -2, -2, 'red')) {
            board[y - 2][x - 2].classList.add('highlighted');
        }
        if (king) {
            if (checkForJump(board, x, y, 2, 2, 'red')) {
                board[y + 2][x + 2].classList.add('highlighted');
            }
            if (checkForJump(board, x, y, -2, 2, 'red')) {
                board[y + 2][x - 2].classList.add('highlighted');
            }
        }
    } else if (colour == 'black') {
        if (checkForJump(board, x, y, 2, 2, 'black')) {
            board[y + 2][x + 2].classList.add('highlighted');
        }
        if (checkForJump(board, x, y, -2, 2, 'black')) {
            board[y + 2][x - 2].classList.add('highlighted');
        }
        
        if (king) {
            if (checkForJump(board, x, y, 2, -2, 'black')) {
                board[y - 2][x + 2].classList.add('highlighted');
            }
            if (checkForJump(board, x, y, -2, -2, 'black')) {
                board[y - 2][x - 2].classList.add('highlighted');
            }
        }
    }
}

function checkForJumps(board, colour) {
    if (colour == 'red') {
        const checkers = document.querySelectorAll('.red-checker');
        checkers.forEach((checker) => {
            let x = parseInt(checker.dataset.x);
            let y = parseInt(checker.dataset.y);
            let king = board[y][x].firstChild.classList.contains('king');
            if (checkForJump(board, x, y, 2, -2, 'red') ||
            checkForJump(board, x, y, -2, -2, 'red')) {
                board[y][x].firstChild.classList.add('selectable');
                mustJump = true;
            }

            if (king) {
                if (checkForJump(board, x, y, -2, 2, 'red') ||
                checkForJump(board, x, y, 2, 2, 'red')) {
                    board[y][x].firstChild.classList.add('selectable');
                    mustJump = true;
                }
            }
        });
    } else if (colour == 'black') {
        const checkers = document.querySelectorAll('.black-checker');
        checkers.forEach((checker) => {
            let x = parseInt(checker.dataset.x);
            let y = parseInt(checker.dataset.y);
            let king = board[y][x].firstChild.classList.contains('king');
            if (checkForJump(board, x, y, -2, 2, 'black') ||
            checkForJump(board, x, y, 2, 2, 'black')) {
                board[y][x].firstChild.classList.add('selectable');
                mustJump = true;
            }

            if (king) {
                if (checkForJump(board, x, y, 2, -2, 'black') ||
                checkForJump(board, x, y, -2, -2, 'black')) {
                    board[y][x].firstChild.classList.add('selectable');
                    mustJump = true;
                }
            }
        });
    }
}

function checkForJump(board, x, y, dirX, dirY, colour) {
    if (y + dirY < 8 && y + dirY >= 0) {
        if (x + dirX < 8 && x + dirX >= 0) {
            if (!board[y + dirY][x + dirX].hasChildNodes())
            {
                if ((colour == 'red' && 
                getCheckerColour(board[y + (dirY / 2)][x + (dirX / 2)]) == 'black') || (colour == 'black' && 
                getCheckerColour(board[y + (dirY / 2)][x + (dirX / 2)]) == 'red'))
                {
                    return true;
                }
            }
        }
    }
}

function getCheckerColour(t) {
    if (t.classList.contains('checker')) {
        return t.classList.contains('red-checker') ? 'red' : 'black';
    } else if (t.hasChildNodes()) {
        return t.firstChild.classList.contains('red-checker') ? 'red' : 'black';
    }

    return false;
}

function isSelectable(t) {
    if (t.classList.contains('selectable'))
        return true;
    else if (t.hasChildNodes()) {
        return t.firstChild.classList.contains('selectable');
    }

    return false;
}

function clearSelectable() {
    let hasSelectable = document.querySelectorAll('.selectable');
    if (hasSelectable) {
        hasSelectable.forEach((selectable) => {
            selectable.classList.remove('selectable');
        });
    }
}

function checkForDoubleJump(board, t) {
    highlightAllowedJumps(board, t);
    return document.querySelectorAll('.highlighted').length > 0;
}

function removeJumpedPiece(board, t) {
    let oldSpace = document.querySelector('.selected');
    let oldX = parseInt(oldSpace.dataset.x);
    let oldY = parseInt(oldSpace.dataset.y);
    let newX = parseInt(t.dataset.x);
    let newY = parseInt(t.dataset.y);

    let rX = (oldX + newX) / 2;
    let rY = (oldY + newY) / 2;
    board[rY][rX].removeChild(board[rY][rX].firstChild);
}

function kingMe(board, x, y) {
    board[y][x].firstChild.classList.add('king');
}

function movePiece(board, t) {
    const selected = document.querySelector('.selected').firstChild;
    let x = t.dataset.x;
    let y = t.dataset.y;
    selected.dataset.x = x;
    selected.dataset.y = y;
    board[y][x].appendChild(selected);

    let colour = getCheckerColour(board[y][x]);
    console.log(colour, y);
    if (colour == 'black' && y == 7) {
        kingMe(board, x, y);
     } else if (colour == 'red' && y == 0) {
         kingMe(board, x, y);
     }
}

function addEventListeners(board) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile) => {
        tile.addEventListener('click', (t) => {
            // REWRITE ME

            colour = getCheckerColour(t.target)
            if (t.target.classList.contains('highlighted')) {
                if (mustJump) {
                    removeJumpedPiece(board, t.target);
                    mustJump = false;
                    clearSelectable();
                    movePiece(board, t.target);
                    unselectTarget();
                    unhighlightMoves();
                    if (checkForDoubleJump(board, t.target)) {
                        mustJump = true;
                        selectTarget(t);
                    }
                } else {
                    movePiece(board, t.target);
                    unselectTarget();
                    unhighlightMoves();
                }
                // Only run this in case there's no double jump
                if (!mustJump) {
                    turn = turn == 'red' ? 'black' : 'red';
                    checkForJumps(board, turn);
                }
            } else if (colour) {
                if (!mustJump) {
                    if ((turn == 'red' && colour == 'red') ||
                    (turn == 'black' && colour == 'black')) {
                        unselectTarget();
                        selectTarget(t);
                        unhighlightMoves();
                        highlightAllowedMoves(board, t);
                    }
                } else {
                    if (isSelectable(t.target) && 
                    ((turn == 'red' && colour == 'red') ||
                    (turn == 'black' && colour == 'black'))) {
                        unselectTarget();
                        selectTarget(t);
                        unhighlightMoves();
                        highlightAllowedJumps(board, t.target);
                    }
                }
            }
        });
    });
}

function startGame() {
    let board = createBoardArray();
    board = createCheckerBoard(board);
    //placeCheckers(board);
    placeChecker(board, 2, 7, 'red');
    placeChecker(board, 2, 5, 'black');
    placeChecker(board, 1, 4, 'black');
    addEventListeners(board);
}

let turn = 'black';
let mustJump = false;

startGame();