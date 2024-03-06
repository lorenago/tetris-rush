export const BLOCK_SIZE = 20
export const BOARD_WIDTH = 14
export const BOARD_HEIGHT = 30

export const EVENT_MOVEMENTS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    // UP: ' ',
    UP: 'ArrowUp',
    ROTATE: 'z',
    REVERSE_ROTATE: 'x'
}

export const PIECES = [
    {
        name: 'square',
        position: { x: ((BOARD_WIDTH / 2) - 1), y: 0},
        shape: [
        [1, 1],
        [1, 1]
        ],
        color: 'red'
    }, {
        name: 'line',
        position: { x: ((BOARD_WIDTH / 2) - 2), y: 0},
        shape: [
        [1, 1, 1, 1]
        ],
        color: 'royalblue'
    }, {
        name: 'arrow',
        position: { x: ((BOARD_WIDTH / 2) - 1), y: 0},
        shape: [
        [0, 1, 0],
        [1, 1, 1]
        ],
        color: 'orange'
    }, {
        name: 'snake',
        position: { x: ((BOARD_WIDTH / 2) - 1), y: 0},
        shape: [
        [1, 1, 0],
        [0, 1, 1]
        ],
        color: 'green'
    }, {
        name: 'reverseSnake',
        position: { x: ((BOARD_WIDTH / 2) - 1), y: 0},
        shape: [
        [0, 1, 1],
        [1, 1, 0]
        ],
        color: 'hotpink'
    }, {
        name: 'l',
        position: { x: (BOARD_WIDTH / 2) - 1, y: 0},
        shape: [
        [1, 0],
        [1, 0],
        [1, 1]
        ],
        color: 'purple'
    }, {
        name: 'reverseL',
        position: { x: (BOARD_WIDTH / 2) - 1, y: 0},
        shape: [
        [0, 1],
        [0, 1],
        [1, 1]
        ],
        color: 'brown'
    }
]