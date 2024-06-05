
let grid, score, timer, time, gameStarted;

document.getElementById('new-game').addEventListener('click', initGame);
document.getElementById('tryangan').addEventListener('click', initGame)

document.addEventListener('keydown', handleInput);

const handleInput = () => {

    grid = createEmptyGrid();
    score = 0;
    time = 0;
    timer = 0;
    gameStarted = false;
    updateScore();
    addRamdownTitle();
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