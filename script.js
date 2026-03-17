let playerScore = 0;
let cpuScore = 0;
const WIN_SCORE = 10;

// Career statistics
let careerStats = {
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    recentResults: [] 
};

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    updateScoreboard();
});

// Load stats from localStorage
function loadStats() {
    const savedStats = localStorage.getItem('rps_career_stats');
    if (savedStats) {
        careerStats = JSON.parse(savedStats);
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('rps_career_stats', JSON.stringify(careerStats));
}

// Update scoreboard display
function updateScoreboard() {
    document.getElementById('total-games').textContent = careerStats.totalGames;
    document.getElementById('total-wins').textContent = careerStats.wins;
    document.getElementById('total-losses').textContent = careerStats.losses;
    document.getElementById('total-ties').textContent = careerStats.ties;
    
    const winRate = careerStats.totalGames > 0 
        ? Math.round((careerStats.wins / careerStats.totalGames) * 100) 
        : 0;
    document.getElementById('win-rate').textContent = winRate + '%';

    const recentList = document.getElementById('recent-list');
    recentList.innerHTML = '';
    careerStats.recentResults.slice(0, 10).forEach(result => {
        const item = document.createElement('div');
        item.className = `recent-item ${result.type}`;
        item.innerHTML = `
            <span>${result.player} vs ${result.cpu}</span>
            <span>${result.result}</span>
        `;
        recentList.appendChild(item);
    });
}

function addToCareerStats(playerMove, cpuMove, result) {
    careerStats.totalGames++;
    
    let resultType = '';
    let resultSymbol = '';
    
    if (result.includes('Tie')) {
        careerStats.ties++;
        resultType = 'tie';
        resultSymbol = '🤝';
    } else if (result.includes('You')) {
        careerStats.wins++;
        resultType = 'win';
        resultSymbol = '✅';
    } else {
        careerStats.losses++;
        resultType = 'loss';
        resultSymbol = '❌';
    }

    careerStats.recentResults.unshift({
        player: getEmoji(playerMove),
        cpu: getEmoji(cpuMove),
        result: resultSymbol,
        type: resultType
    });

    if (careerStats.recentResults.length > 10) careerStats.recentResults.pop();

    saveStats();
    updateScoreboard();
}

function getEmoji(choice) {
    const emojis = { rock: '👊', paper: '✋', scissors: '✌️', game: '🎮' };
    return emojis[choice] || choice;
}

const buttons = document.querySelectorAll('.choice-btn');
const messageEl = document.getElementById('message');
const resultTextEl = document.getElementById('result-text');
const playerScoreEl = document.getElementById('player-score');
const cpuScoreEl = document.getElementById('cpu-score');
const playerEmojiEl = document.getElementById('player-emoji');
const cpuEmojiEl = document.getElementById('cpu-emoji');
const displayArea = document.getElementById('display-area');
const resetBtn = document.getElementById('reset');
const resetStatsBtn = document.getElementById('reset-stats');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        playRound(button.id);
    });
});

document.addEventListener('keydown', (e) => {
    if (playerScore >= WIN_SCORE || cpuScore >= WIN_SCORE) return;
    const key = e.key.toLowerCase();
    if (key === 'r') playRound('rock');
    if (key === 'p') playRound('paper');
    if (key === 's') playRound('scissors');
});

resetBtn.addEventListener('click', resetGame);

resetStatsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all career stats?')) {
        careerStats = { totalGames: 0, wins: 0, losses: 0, ties: 0, recentResults: [] };
        saveStats();
        updateScoreboard();
    }
});

function getCpuChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * 3)];
}

function playRound(player) {
    if (playerScore >= WIN_SCORE || cpuScore >= WIN_SCORE) return;

    const cpu = getCpuChoice();
    let result = "";

    playerEmojiEl.textContent = getEmoji(player);
    cpuEmojiEl.textContent = getEmoji(cpu);

    if (player === cpu) {
        result = "It's a Tie! 🤝";
        flashBackground('#f39c12');
    } else if (
        (player === 'rock' && cpu === 'scissors') ||
        (player === 'paper' && cpu === 'rock') ||
        (player === 'scissors' && cpu === 'paper')
    ) {
        result = "Point for You! 🎉";
        playerScore++;
        flashBackground('#27ae60');
    } else {
        result = "Point for CPU! 🤖";
        cpuScore++;
        flashBackground('#e74c3c');
    }

    updateUI(player, cpu, result);
    checkWinner();
}

function flashBackground(color) {
    displayArea.style.backgroundColor = color;
    setTimeout(() => { displayArea.style.backgroundColor = ''; }, 300);
}

function updateUI(player, cpu, result) {
    messageEl.textContent = `You: ${player.toUpperCase()} | CPU: ${cpu.toUpperCase()}`;
    resultTextEl.textContent = result;
    playerScoreEl.textContent = playerScore;
    cpuScoreEl.textContent = cpuScore;
}

function checkWinner() {
    if (playerScore === WIN_SCORE) {
        resultTextEl.textContent = "🏆 YOU WIN THE GAME! 🏆";
        disableButtons(true);
        displayArea.classList.add('win-flash');
        addToCareerStats('game', 'game', 'win');
    } else if (cpuScore === WIN_SCORE) {
        resultTextEl.textContent = "💻 CPU WINS THE GAME! 💻";
        disableButtons(true);
        addToCareerStats('game', 'game', 'loss');
    }
}

function disableButtons(disabled) {
    buttons.forEach(button => button.disabled = disabled);
}

function resetGame() {
    playerScore = 0;
    cpuScore = 0;
    playerScoreEl.textContent = '0';
    cpuScoreEl.textContent = '0';
    resultTextEl.textContent = 'Make your move!';
    messageEl.textContent = 'First to 10 wins!';
    playerEmojiEl.textContent = '🤔';
    cpuEmojiEl.textContent = '🤖';
    displayArea.classList.remove('win-flash');
    disableButtons(false);
      }
