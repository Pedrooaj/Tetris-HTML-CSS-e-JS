const board = Array.from({length: 15}, () => Array(10).fill(0));


function drawBoard(){
    const tetrisBoard = document.querySelector('.tetris-board');
    tetrisBoard.innerHTML = '';

    board.forEach((row) => {
        row.forEach((cell) => {
            const div = document.createElement('div');
            div.classList.add('cell');

            if(cell){
                div.style.backgroundColor = "#f00";
            }
            tetrisBoard.appendChild(div);
        })
    })
}

drawBoard();


const pecas = [
    [[1,0],[1,0],[1,1]]
]

let currentPecas = pecas[0];
let position = {x: 4, y: 0};

function drawPeca() {
    currentPecas.forEach((row,y) => {
        row.forEach((cell, x) => {
            if(cell){
                board[position.y + y][position.x + x] = 1;
            }
        }
    )
    })
}

drawPeca();
drawBoard();

document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft'){
        position.x--;
    }else if(e.key === 'ArrowRight'){
        position.x++;
    }else if(e.key === 'ArrowDown'){
        position.y++;
    }
    drawBoard();
})

function checkCollision(offsetX = 0, offsetY = 0){
    return currentPecas.some((row, y) => {
        return row.some((cell, x) => {
            if(cell){
                const newX = position.x + x + offsetX;
                const newY = position.y + y + offsetY;
                return newX < 0 || newX >= board[0].length || newY >= board.length || board[newX][newY]; 
            }
            return false
        })
    })
}

document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft'){
        if(!checkCollision(1,0)){}
    }
})