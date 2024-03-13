import './style.scss'

// Importación parcial para evitar cargar el bundle completo
import Modal from 'bootstrap/js/dist/modal';

// Constantes
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS, PIECES, PIECE_IMAGE } from './const'

// 14. Tetris theme
const audio = new Audio('tetris.mp3')
audio.volume = 0.5

// 1. Inicializar el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('#puntuation')
const $section = document.querySelector('section')
const $gameOverModal = document.getElementById('gameOverModal')

// Player score
let score = 0
// Play speed
let playSpeed = 1000
// Request animation frame Id
let requestAnimationFrameId;
// Game Over glag
let gameIsOver = true;
// Time when game last update
let lastTimeUpdate;
// Time when game was started
let timeGameStart;
// Game pieces
let gamePieces;
// Drop count
let dropCounter = 0
// 4. Pieza del jugador
let piece

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. Board
const board = {
  shape: createBoard(BOARD_WIDTH, BOARD_HEIGHT),
  position: {
    x: 0, y: 0
  },
  color: 'gray'
}

function createBoard(width, height) {
  return Array(height).fill().map(() => Array(width).fill({ value: 0 }))
}

const GAME_PIECES = PIECES.map(piece => {
  return {
    ...piece,
    shape: piece.shape.map(row => {
      return row.map(pixel => ({
        value: pixel,
        color: piece.color,
        rgb: piece.rgb,
        image: piece.image
      }))
    })
  }
})

// 2. Game loop
// 10. Movimiento automático || autodrop
function update() {
  const time = Date.now();
  if (gameIsOver) { return; }
  const deltaTime = Math.max(time - lastTimeUpdate, 0)
  const playTime = time - timeGameStart;
  lastTimeUpdate = time

  // 16. Aumentar la velocidad del autodrop en función del tiempo jugado
  const playbackRate = 1 + (Math.floor(playTime / (audio.duration / 4 * 1000)) * 0.01)
  if (audio.playbackRate !== playbackRate) { audio.playbackRate = playbackRate }
  playSpeed = Math.max(1000 - (Math.floor(playTime / 1000) * 2), 100)

  dropCounter += deltaTime

  if (dropCounter > playSpeed) {
    movePiece('ArrowDown')
    dropCounter = 0
  }
  draw()
  window.cancelAnimationFrame(requestAnimationFrameId)
  requestAnimationFrameId = window.requestAnimationFrame(update)
}

// 4. Dibujamos la situación inicial.
function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  paintPieces(board)
  paintPieces(piece)

  $score.innerText = score
}

// 5. Colorear piezas o tablero
function paintPieces(obj) {
  obj.shape.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel.value === 1) {
        // Display custom images.
        let imgTag = new Image();
        imgTag.crossOrigin = "anonymous";
        imgTag.src = pixel.image || obj.image || PIECE_IMAGE;

        context.drawImage(imgTag, x + obj.position.x, y + obj.position.y, 1, 1);
      }
    })
  })
}

function movePiece(movement) {
  let rotatedPiece = []
  let previousShape = null
  switch (movement) {
    case EVENT_MOVEMENTS.LEFT:
      piece.position.x--
      if (checkCollision()) {
        piece.position.x++
      }
      break
    case EVENT_MOVEMENTS.RIGHT:
      piece.position.x++
      if (checkCollision()) {
        piece.position.x--
      }
      break
    case EVENT_MOVEMENTS.DOWN:
      piece.position.y++
      if (checkCollision()) {
        piece.position.y--
        solidifyPiece(piece)
        removeRows()
      }
      break
    case EVENT_MOVEMENTS.UP:
      piece.position.y++
      if (!checkCollision()) {
        movePiece(movement)
      } else {
        piece.position.y--
        solidifyPiece(piece)
        removeRows()
      }
      break
      
    // 13. Rotación de piezas
    // Rotación (horaria)
    case EVENT_MOVEMENTS.ROTATE:
      for(let i = 0; i < piece.shape[0].length; i++) {
        const row = []

        for (let j = piece.shape.length -1 ; j >= 0; j--) {
          row.push(piece.shape[j][i])
        }
        rotatedPiece.push(row)
      }

      previousShape = piece.shape
      piece.shape = rotatedPiece
      if (checkCollision()) {
        piece.shape = previousShape
      }
      break
    // Rotación inversa (antihoraria)
    // Revisar bug con la posición
    // case EVENT_MOVEMENTS.REVERSE_ROTATE:
    //   rotatedPiece = []

    //   for(let i = piece.shape[0].length; i >= 0; i--) {
    //     const row = []
    //     for (let j = 0; j < piece.shape.length; j++) {
    //       row.push(piece.shape[j][i])
    //     }
    //     rotatedPiece.push(row)
    //   }

    //   previousShape = piece.shape
    //   piece.shape = rotatedPiece
    //   if (checkCollision()) {
    //     piece.shape = previousShape
    //   }
    //   break
    default:
      break
  }
}

// 7. Comprobación de colisiones
function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((pixel, x) => {
      return ( pixel.value !== 0
        && board.shape[y + piece.position.y]?.[x + piece.position.x]?.value !== 0 )
    })
  })
}

// 8. Solidificación de las piezas.
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel.value === 1) {
        board.shape[y + piece.position.y][x + piece.position.x] = pixel
      }
    })
  })
  score += 5

  // Reset piece
  getRandomPiece()

  if (checkCollision() && !gameIsOver) {
    gameOver()
  }
}

// 12. Game Over
function gameOver() {
  gameIsOver = true;
  window.cancelAnimationFrame(requestAnimationFrameId)
  requestAnimationFrameId = undefined;
  audio.pause();

  const myModal = new Modal(document.getElementById('gameOverModal'))
  myModal.show($gameOverModal)
}

// 11. Elección de pieza aleatoria
function getRandomPiece() {
  piece = JSON.parse(JSON.stringify({
    ...GAME_PIECES[Math.floor(Math.random() * GAME_PIECES.length)]
  }))
}

// 9. Eliminación de líneas completas.
function removeRows() {
  const rowsToRemove = []
  let scoreToApply = 0
  board.shape.forEach((row, y) => {
    if (row.every(pixel => pixel.value === 1)) {
      rowsToRemove.push(y)
      scoreToApply += 20
    }
  })
  const multipleLineBonus = Math.max(rowsToRemove.length, 1) - 1
  scoreToApply += multipleLineBonus * 25
  rowsToRemove.forEach(y => {
    board.shape.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill({ value: 0 })
    board.shape.unshift(newRow)
  })
  score += scoreToApply
}

// Inicia el juego reseteando los valores por defecto
function initGame() {
  score = 0
  gameIsOver = false
  getRandomPiece()
  
  audio.playbackRate = 1;
  audio.currentTime = 0;
  audio.loop = true;
  audio.play();

  lastTimeUpdate = timeGameStart = Date.now();
  update()
}

// 6. Detección de movimientos
document.addEventListener('keydown', event => {
  movePiece(event.key)
})

$gameOverModal.addEventListener('hidden.bs.modal', event => {
  // Reset board game
  board.shape.forEach((row) => row.fill({ value: 0 }))
  initGame()
  const myModal = new Modal(document.getElementById('gameOverModal'))
  myModal.hide($gameOverModal)

})

// 15. User init play game interaction
$section?.addEventListener('click', () => {
  initGame()
  $section.remove()
})