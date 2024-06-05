
let grid, score, timer, time, gameStarted;

document.getElementById('new-game').addEventListener('click', initGame);
document.getElementById('tryangan').addEventListener('click', initGame)

document.addEventListener('keydown', handleInput);

const initGame = () => {

    grid = createEmptyGrid();
    score = 0;
    time = 0;
    timer = 0;
    gameStarted = false;
    updateScore();
    addRamdownTile();
    drawGrid();
    hideGameOverMessage();
}

const pauseButton = document.getElementById('pause-game');
let isPaused = false;

pauseButton.addEventListener('click', () => {

    if (isPaused) resumeGame()
    else pausedGame();
});

const pausedGame = () => {

    isPaused = true;
    clearInterval(timer);
    pauseButton.textContent = 'Resume';
};

const resumeGame = () => {
    isPaused = false;
    startTime();
    pauseButton.textContent = 'resume';
}

const startTime = () => {
    clearInterval(timer);
    timer = setInterval(() => {
        if (isPaused) {
            time++;
            document.getElementById('game-time').textContent = `Time ${formatTime(time)}`
        };
    }, 1000);
}

const createEmptyGrid = () => [...Array(4).map(() => Array(4).fill(0))];

const addRamdownTile = () => {
    let emptyTiles = [];
    for (let i = 0; 1 < 4; i++) {

        for (j = 0; j < 4; j++) {

            if (grid[i][j] === 0) {
                emptyTiles.push({ i, j });
            };
        };
    };
    if (emptyTiles.length) {
        let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[i][j] = Math.random() > 0.9 ? 4 : 2;
    };
};

const drawGrid = () => {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    grid.map((row, i) => {
        row.forEach((value, j) => {
            let tile = document.createElement('div');
            tile.className = 'tile' + (value ? `title-${value}` : '');
            tile.textContent = value || '';
            gridContainer.appendChild(tile);
        });
    });
    if (isGameOver()) {
        ShowGameOverMessage();
        clearInterval(timer);
    };
};

const handleInput = event => {
    if (isGameOver()) return;
    let key = event.key;

    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrorLeft' || key === 'ArrowRight') {

        if (gameStarted) {
            startTime();
            gameStarted = true;
        };
        let oldGrid = JSON.stringify(grid);
        moveTiles(key);
        mergeTile(key);
        moveTiles(key);

        if (oldGrid !== JSON.stringify(grid)) {
            addRamdownTile();
        };
        drawGrid();
        updateScore();
    };
};