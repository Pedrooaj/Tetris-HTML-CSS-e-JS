const board = Array.from({ length: 15 }, () => Array(10).fill(0));
let score = 0;

const cores = ["#00FFFF", "#FFFF00", "#800080", "#00FF00", "#FF0000", "#0000FF", "#FFA500"];

const pecas = [
    { shape: [[1, 0], [1, 0], [1, 1]], color: cores[0] }, // Peça L
    { shape: [[1, 0], [1, 0], [1, 0]], color: cores[1] }, // Peça I
    { shape: [[1, 1], [0, 0], [0, 0]], color: cores[2] }, // Peça O
    { shape: [[1, 0], [0, 0], [0, 0]], color: cores[3] }, // Peça Z
    { shape: [[1, 0], [1, 1], [0, 0]], color: cores[4] }, // Peça S
    { shape: [[1, 1], [1, 1], [0, 0]], color: cores[5] }, // Peça O
    { shape: [[1, 0], [1, 1], [0, 1]], color: cores[6] }  // Peça T
];

let currentPeca = pecas[0];
let position = { x: 4, y: 0 };

function drawBoard() {
    const tetrisBoard = document.querySelector('.tetris-board');
    tetrisBoard.innerHTML = '';

    board.forEach((row) => {
        row.forEach((cell) => {
            const div = document.createElement('div');
            div.classList.add('cell');
            if (cell) {
                div.style.backgroundColor = cell.color;
            }
            tetrisBoard.appendChild(div);
        });
    });
}

function drawPeca() {
    currentPeca.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[position.y + y][position.x + x] = { filled: 1, color: currentPeca.color };
            }
        });
    });
}

function clearPeca() {
    currentPeca.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[position.y + y][position.x + x] = 0;
            }
        });
    });
}

drawPeca();
drawBoard();

document.addEventListener('keydown', (e) => {
    clearPeca();

    if (e.key === 'ArrowLeft') {
        if (!checkCollision(-1, 0)) {
            position.x--;
        }
    } else if (e.key === 'ArrowRight') {
        if (!checkCollision(1, 0)) {
            position.x++;
        }
    } else if (e.key === 'ArrowDown') {
        if (!checkCollision(0, 1)) {
            position.y++;
        }
    } else if (e.key === 'ArrowUp') {
        rotatePeca();
    }

    drawPeca();
    drawBoard();
});

function checkCollision(offsetX = 0, offsetY = 0) {
    return currentPeca.shape.some((row, y) => {
        return row.some((cell, x) => {
            if (cell) {
                const newX = position.x + x + offsetX;
                const newY = position.y + y + offsetY;
                return newX < 0 || newX >= board[0].length || newY >= board.length || board[newY][newX];
            }
            return false;
        });
    });
}


    function rotatePeca() {
        const rotatedPeca = currentPeca.shape[0].map((_, i) =>
            currentPeca.shape.map(row => row[i]).reverse()
        );
        if (position.x + rotatedPeca[0].length > board[0].length) {
            position.x = board[0].length - rotatedPeca[0].length; 
        }
    
        if (!checkCollision(0, 0, rotatedPeca)) {
            currentPeca.shape = rotatedPeca;
        } else {
          
            if (!checkCollision(-1, 0, rotatedPeca)) {
                position.x--;  
                currentPeca.shape = rotatedPeca;
            } else if (!checkCollision(1, 0, rotatedPeca)) {
                position.x++;  
                currentPeca.shape = rotatedPeca;
            } else if (!checkCollision(0, -1, rotatedPeca)) {
                position.y--;  
                currentPeca.shape = rotatedPeca;
            }
        }
    }
    



function clearLines() {
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(cell => cell.filled === 1)) {
            board.splice(y, 1);
            board.unshift(Array(10).fill(0));
            score += 100;
            updateScore();
            y++;
        }
    }
}

function updateScore() {
    document.getElementById('score').textContent = `${score}`;
}

function fixPeca() {
    currentPeca.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                board[position.y + y][position.x + x] = { filled: 1, color: currentPeca.color };
            }
        });
    });
    clearLines();
}

function resetPeca() {
    position = { x: 4, y: 0 };
    currentPeca = pecas[Math.floor(Math.random() * pecas.length)];

    if (checkCollision(0, 0)) {
        alert('Game Over!');
        board.forEach(row => row.fill(0));
        score = 0;
        updateScore();
        drawBoard();
    }
}

function drop() {
    clearPeca();
    if (!checkCollision(0, 1)) {
        position.y++;
    } else {
        fixPeca();
        resetPeca();
    }
    drawPeca();
    drawBoard();
}

setInterval(drop, 1000);
