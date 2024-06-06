// Declaración de variables globales
let grid, score, timer, time, gameStarted;

// Función para inicializar el juego
const initGame = () => {
    grid = createEmptyGrid(); // Crea una cuadrícula vacía
    score = 0; // Inicializa la puntuación
    time = 0; // Inicializa el tiempo
    timer = 0; // Inicializa el temporizador
    gameStarted = false; // Marca que el juego no ha comenzado
    updateScore(); // Actualiza la puntuación en la interfaz
    addRandomTile(); // Añade una ficha aleatoria en la cuadrícula
    addRandomTile(); // Añade otra ficha aleatoria en la cuadrícula
    drawGrid(); // Dibuja la cuadrícula en la interfaz
    hideGameOverMessage(); // Oculta el mensaje de fin de juego
}

// Elemento de botón de pausa
let pauseButton = document.getElementById('pause-resume');
let isPaused = false; // Estado de pausa del juego

// Evento para manejar el clic en el botón de pausa/reanudar
pauseButton.addEventListener('click', () => {
    if (isPaused) {
        resumeGame(); // Reanuda el juego si estaba pausado
    } else {
        pauseGame(); // Pausa el juego si estaba en marcha
    }
});

// Función para pausar el juego
const pauseGame = () => {
    isPaused = true; // Marca el juego como pausado
    clearInterval(timer); // Detiene el temporizador
    pauseButton.textContent = 'Resume'; // Cambia el texto del botón a "Reanudar"
}

// Función para reanudar el juego
const resumeGame = () => {
    isPaused = false; // Marca el juego como no pausado
    startTime(); // Inicia el temporizador
    pauseButton.textContent = 'Pause'; // Cambia el texto del botón a "Pausar"
}

// Función para iniciar el temporizador
const startTime = () => {
    clearInterval(timer); // Asegura que no haya múltiples temporizadores corriendo
    timer = setInterval(() => {
        if (!isPaused) { // Solo incrementa el tiempo si el juego no está pausado
            time++;
            document.getElementById('game-time').textContent = 'Time: ' + formatTime(time); // Actualiza el tiempo en la interfaz
        }
    }, 1000); // Incrementa el tiempo cada segundo
}

// Función para crear una cuadrícula vacía
const createEmptyGrid = () => {
    return [...Array(4)].map(() => Array(4).fill(0)); // Crea una matriz 4x4 llena de ceros
}

// Función para añadir una ficha aleatoria en la cuadrícula
const addRandomTile = () => {
    let emptyTiles = []; // Array para almacenar las celdas vacías
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) { // Encuentra las celdas vacías
                emptyTiles.push({ i, j }); // Añade la posición de la celda vacía al array
            }
        }
    }
    if (emptyTiles.length) { // Si hay celdas vacías
        let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]; // Selecciona una celda aleatoria
        grid[i][j] = Math.random() > 0.9 ? 4 : 2; // Añade un 4 o un 2 con cierta probabilidad
    }
}

// Función para dibujar la cuadrícula en la interfaz
const drawGrid = () => {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = ''; // Limpia el contenedor de la cuadrícula
    grid.forEach((row, i) => {
        row.forEach((value, j) => {
            let tile = document.createElement('div'); // Crea un nuevo div para cada celda
            tile.className = 'tile' + (value ? ` tile-${value}` : ''); // Asigna clases CSS según el valor
            tile.textContent = value || ''; // Muestra el valor de la celda
            gridContainer.appendChild(tile); // Añade la celda al contenedor
        });
    });

    if (isGameOver()) { // Verifica si el juego ha terminado
        showGameOverMessage(); // Muestra el mensaje de fin de juego
        clearInterval(timer); // Detiene el temporizador
    }
}

// Maneja la entrada del usuario (teclas de flecha)
const handleInput = event => {
    if (isGameOver()) {
        return; // No hace nada si el juego ha terminado
    }

    let key = event.key;
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
        if (!gameStarted) { // Inicia el temporizador al primer movimiento
            startTime(); // Inicia el temporizador
            gameStarted = true; // Marca el juego como iniciado
        }

        let oldGrid = JSON.stringify(grid); // Guarda el estado actual de la cuadrícula
        moveTiles(key); // Mueve las fichas según la tecla presionada
        mergeTiles(key); // Fusiona las fichas adyacentes según la tecla presionada
        moveTiles(key); // Mueve nuevamente para llenar los huecos
        if (oldGrid !== JSON.stringify(grid)) { // Si hubo algún cambio en la cuadrícula
            addRandomTile(); // Añade una ficha aleatoria
        }
        drawGrid(); // Redibuja la cuadrícula
        updateScore(); // Actualiza la puntuación
    }
}

// Asigna la función initGame al evento de clic de los botones
document.getElementById('new-game').addEventListener('click', initGame);
document.getElementById('tryagain').addEventListener('click', initGame);

// Asigna la función handleInput al evento de tecla presionada
document.addEventListener('keydown', handleInput);

// Función para mover las fichas en la dirección indicada
const moveTiles = direction => {
    let isVertical = direction === 'ArrowUp' || direction === 'ArrowDown'; // Verifica si el movimiento es vertical
    let isForward = direction === 'ArrowRight' || direction === 'ArrowDown'; // Verifica si el movimiento es hacia adelante

    for (let i = 0; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) {
            let cell = isVertical ? grid[j][i] : grid[i][j]; // Obtiene el valor de la celda según la dirección
            if (cell) row.push(cell); // Añade la celda a la fila si no está vacía
        }

        let missing = 4 - row.length; // Calcula el número de celdas vacías
        let zeros = Array(missing).fill(0); // Crea un array de ceros para las celdas vacías
        row = isForward ? zeros.concat(row) : row.concat(zeros); // Ordena la fila según la dirección

        for (let j = 0; j < 4; j++) {
            if (isVertical) {
                grid[j][i] = row[j]; // Asigna los valores a la cuadrícula en la dirección vertical
            } else {
                grid[i][j] = row[j]; // Asigna los valores a la cuadrícula en la dirección horizontal
            }
        }
    }
}

// Función para fusionar las fichas en la dirección indicada
const mergeTiles = direction => {
    let isVertical = direction === 'ArrowUp' || direction === 'ArrowDown'; // Verifica si el movimiento es vertical
    let isForward = direction === 'ArrowRight' || direction === 'ArrowDown'; // Verifica si el movimiento es hacia adelante

    for (let i = 0; i < 4; i++) {
        for (let j = isForward ? 3 : 0; isForward ? j > 0 : j < 3; isForward ? j-- : j++) {
            let current = isVertical ? grid[j][i] : grid[i][j]; // Obtiene el valor de la celda actual
            let next = isVertical ? grid[isForward ? j - 1 : j + 1][i] : grid[i][isForward ? j - 1 : j + 1]; // Obtiene el valor de la celda siguiente
            if (current !== 0 && current === next) { // Verifica si las celdas pueden fusionarse
                let mergedTile = current * 2; // Fusiona las celdas y duplica el valor
                isVertical ? grid[j][i] = mergedTile : grid[i][j] = mergedTile;
                isVertical ? grid[isForward ? j - 1 : j + 1][i] = 0 : grid[i][isForward ? j - 1 : j + 1] = 0;
                score += mergedTile; // Actualiza la puntuación
                break; // Evita la doble fusión en un solo movimiento
            }
        }
    }
}

// Función para actualizar la puntuación en la interfaz
const updateScore = () => {
    document.getElementById('game-score').textContent = 'Score: ' + score; // Muestra la puntuación actual
}

// Función para formatear el tiempo en minutos y segundos
const formatTime = timeInSeconds => {
    let minutes = Math.floor(timeInSeconds / 60); // Calcula los minutos
    let seconds = timeInSeconds % 60; // Calcula los segundos
    return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0'); // Formatea el tiempo
}

// Función para verificar si el juego ha terminado
const isGameOver = () => {
    return isGridFull() && !canMakeMove(); // Verifica si la cuadrícula está llena y no hay movimientos posibles
}

// Función para verificar si la cuadrícula está llena
const isGridFull = () => {
    return grid.every(row => row.every(cell => cell !== 0)); // Verifica si todas las celdas están ocupadas
}

// Función para verificar si se puede realizar un movimiento
const canMakeMove = () => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let value = grid[i][j];
            if (value !== 0) {
                if (i < 3 && value === grid[i + 1][j]) return true; // Verifica movimientos verticales
                if (j < 3 && value === grid[i][j + 1]) return true; // Verifica movimientos horizontales
            }
        }
    }
    return false;
}

// Función para mostrar el mensaje de fin de juego
const showGameOverMessage = () => {
    const gameOverMessage = document.getElementById('game-over');
    gameOverMessage.style.cssText = 'display: block;'; // Muestra el mensaje de fin de juego
}

// Función para ocultar el mensaje de fin de juego
const hideGameOverMessage = () => {
    const gameOverMessage = document.getElementById('game-over');
    gameOverMessage.style.cssText = 'display: none;'; // Oculta el mensaje de fin de juego
    initGame(); // Inicializa el juego nuevamente
}

// Inicializa el juego al cargar el script
initGame();
