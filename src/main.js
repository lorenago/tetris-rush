import './style.css'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS, PIECES } from './const'

// 14. Tetris theme
const audio = new Audio('tetris.mp3')
audio.volume = 0.5

// 1. Inicializar el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('#puntuation')
const $section = document.querySelector('section')

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. Board
// const board = createBoard(width)
const board = {
  shape: createBoard(BOARD_WIDTH, BOARD_HEIGHT),
  position: {
    x: 0, y: 0
  },
  color: 'yellow'
}
function createBoard(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
  // return Array(height).fill().map(() => Array(width).fill({ value: 0, color: '' }))
}

// 4. Pieza del jugador
let piece

// 2. Game loop
let dropCounter = 0
let lastTime = 0
// 10. Movimiento automático || autodrop
// TODO: Disminuir tiempo a medida que aumenta la puntuación || tiempo de partida.
function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    movePiece('ArrowDown')
    dropCounter = 0
  }
  draw()
  window.requestAnimationFrame(update)
}

// 4. Dibujamos la situación inicial.
function draw() {
  context.fillStyle = '#000'
  context?.fillRect(0, 0, canvas.width, canvas.height)

  paintPieces(board)
  paintPieces(piece)

  $score.innerText = score
}

// 5. Colorear piezas o tablero
function paintPieces(obj) {
  obj.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = obj.color
        context.fillRect(x + obj.position.x, y + obj.position.y, 1, 1)
        // DISPLAY rectangles.
        // TODO: Pintar los cuadrados con bordes?
        // context.fillStyle = "hotpink";
        // context.fillRect(xPos, yPos, width, height);
        // context.lineWidth = 4;
        // context.strokeStyle = "royalblue";
        // context.strokeRect(x + 130, y, 1, 1);
        // context.fillStyle = "darkorange";
        // context.fillRect(x + 260, y, 1, 1);
        // context.clearRect(x + 285, y + 10, 1 - 50, 1 - 20);
      }
    })
  })
}

// 6. Detección de movimientos
document.addEventListener('keydown', event => {
  movePiece(event.key)
})

function movePiece(movement) {
  let rotatedPiece = []
  let previousShape = null
  // Revisar si queremos dejar tiempo al usuario o no XD.
  // dropCounter = 0
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
    
    // 13. Rotación de piezas
    // Rotación (horaria)
    case EVENT_MOVEMENTS.UP:
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
    // Revisar qué pasa con la posición
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
    return row.find((value, x) => {
      return ( value !== 0
        && board.shape[y + piece.position.y]?.[x + piece.position.x] !== 0 )

    })
  })
}

// 8. Solidificación de las piezas.
function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board.shape[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  score += 5

  // Reset piece
  getRandomPiece()

  if (checkCollision()) {
    gameOver()
  }

}

// 12. Game Over
function gameOver() {
  // Cambiar alert por pop up y en aceptar, volver a reproducir la música
  window.alert('Game Over!!! Sorry!')
  board.shape.forEach((row) => row.fill(0))
  getRandomPiece()
}

// 11. Elección de pieza aleatoria
function getRandomPiece() {
  piece = JSON.parse(JSON.stringify({
    ...PIECES[Math.floor(Math.random() * PIECES.length)]
  }))
}

// 9. Eliminación de líneas completas.
function removeRows() {
  const rowsToRemove = []
  let scoreToApply = 0
  board.shape.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
      scoreToApply += 20
    }
  })
  const multipleLineBonus = Math.max(rowsToRemove.length, 1) - 1
  scoreToApply += multipleLineBonus * 25
  rowsToRemove.forEach(y => {
    board.shape.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.shape.unshift(newRow)
  })
  score += scoreToApply
}

// 15. User init play game interaction
$section?.addEventListener('click', () => {
  getRandomPiece()
  update()

  audio.play()
  $section.remove()
})



