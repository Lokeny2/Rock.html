// Current State
let pScore = 0;
let cpuScore = 0;
const WIN_LIMIT = 10;
const emojiMap = { rock: '👊', paper: '✋', scissors: '✌️' };

// Career Stats
let stats = JSON.parse(localStorage.getItem('rps_stats')) || { wins: 0, losses: 0, total: 0 };

// Selectors
const pScoreEl = document.getElementById('p-score');
const cpuScoreEl = document.getElementById('cpu-score');
const pEmojiEl = document.getElementById('p-emoji');
const cpuEmojiEl = document.getElementById('cpu-emoji');
const resultEl = document.getElementById('result-text');
const choiceBtns = document.querySelectorAll('.choice-btn');

// Initial Setup
updateStatsUI();

// Event Listeners
choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => play(btn.id));
});

document.getElementById('reset-game-btn').addEventListener('click', resetGame);
document.getElementById('reset-stats-btn').addEventListener('click', resetStats);

function updateStatsUI() {
    document.getElementById('c-wins').textContent = stats.wins;
    document.getElementById('c-losses').textContent = stats.losses;
    const rate = stats.total ? Math.round((stats.wins / stats.total) * 100) : 0;
    document.getElementById('c-rate').textContent = rate + '%';
}

function play(playerChoice) {
    if (pScore >= WIN_LIMIT || cpuScore >= WIN_LIMIT) return;

    const choices = ['rock', 'paper', 'scissors'];
    const cpuChoice = choices[Math.floor(Math.random() * 3)];
    
    pEmojiEl.textContent = emojiMap[playerChoice];
    cpuEmojiEl.textContent = emojiMap[cpuChoice];

    let result = "";
    if (playerChoice === cpuChoice) {
        result = "It's a Tie!";
    } else if (
        (playerChoice === 'rock' && cpuChoice === 'scissors') || 
        (playerChoice === 'paper' && cpuChoice === 'rock') || 
        (playerChoice === 'scissors' && cpuChoice === 'paper')
    ) {
        result = "Point for You!";
        pScore++;
    } else {
        result = "Point for CPU!";
        cpuScore++;
    }

    pScoreEl.textContent = pScore;
    cpuScoreEl.textContent = cpuScore;
    resultEl.textContent = result;

    checkEnd();
}

function checkEnd() {
    if (pScore === WIN_LIMIT || cpuScore === WIN_LIMIT) {
        const isPlayerWinner = pScore === WIN_LIMIT;
        resultEl.textContent = isPlayerWinner ? "🏆 GAME WON!" : "💀 GAME LOST!";
        
        choiceBtns.forEach(btn => btn.disabled = true);
        
        // Update Career Stats
        stats.total++;
        if (isPlayerWinner) stats.wins++; else stats.losses++;
        localStorage.setItem('rps_stats', JSON.stringify(stats));
        updateStatsUI();
    }
}

function resetGame() {
    pScore = 0; 
    cpuScore = 0;
    pScoreEl.textContent = '0';
    cpuScoreEl.textContent = '0';
    resultEl.textContent = 'Ready?';
    pEmojiEl.textContent = '🤔';
    cpuEmojiEl.textContent = '🤖';
    choiceBtns.forEach(btn => btn.disabled = false);
}

function resetStats() {
    if(confirm("Clear all lifetime stats?")) {
        stats = { wins: 0, losses: 0, total: 0 };
        localStorage.removeItem('rps_stats');
        updateStatsUI();
    }
}
