let currentLevel = 'easy';
let score = 0;
let currentQuestion = {};
let balloonInterval;

function setLevel(level) {
    currentLevel = level;
    document.getElementById('level-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    clearInterval(balloonInterval);
    generateQuestion();
}

function generateQuestion() {
    let maxNumber;
    switch (currentLevel) {
        case 'easy':
            maxNumber = 5;
            break;
        case 'medium':
            maxNumber = 10;
            break;
        case 'hard':
            maxNumber = 15;
            break;
    }
    const num1 = Math.floor(Math.random() * maxNumber) + 1;
    const num2 = Math.floor(Math.random() * maxNumber) + 1;
    currentQuestion = { num1, num2 };
    document.getElementById('question').textContent = `${num1} x ${num2} = ?`;
    generateBalloons(num1 * num2);
}

function generateBalloons(correctAnswer) {
    const balloonsContainer = document.getElementById('balloons');
    balloonsContainer.innerHTML = '';
    const correctPosition = Math.floor(Math.random() * 6);
    const positions = [];
    const colors = ['#ff8a65', '#4caf50', '#2196f3', '#ffeb3b', '#9c27b0', '#f44336'];
    const usedNumbers = new Set();

    for (let i = 0; i < 6; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        
        let leftPosition;
        do {
            leftPosition = Math.random() * 90;
        } while (positions.some(pos => Math.abs(pos - leftPosition) < 10)); // 10% aralık bırak
        
        positions.push(leftPosition);
        balloon.style.left = `${leftPosition}%`;
        balloon.style.top = '-70px';
        balloon.style.backgroundColor = colors[i % colors.length]; // Farklı renkler kullan
        
        let number;
        if (i === correctPosition) {
            number = correctAnswer;
            balloon.onclick = () => {
                score++;
                document.getElementById('score').textContent = score;
                clearInterval(balloonInterval);
                generateQuestion();
            };
        } else {
            do {
                const deviation = Math.floor(Math.random() * 5) + 1; // 1 ile 5 arasında sapma
                number = correctAnswer + (Math.random() < 0.5 ? -deviation : deviation);
            } while (number === correctAnswer || usedNumbers.has(number) || number < 0); // Eksik değer olmasın
            balloon.onclick = () => balloon.remove();
        }
        usedNumbers.add(number);
        balloon.textContent = number;
        balloonsContainer.appendChild(balloon);
    }
    startBalloonFall();
}

function startBalloonFall() {
    const balloons = document.querySelectorAll('.balloon');
    let delay = 0;
    balloons.forEach(balloon => {
        setTimeout(() => {
            balloon.style.opacity = 1; // Balon görünür hale gelir
            balloonInterval = setInterval(() => {
                const currentTop = parseFloat(balloon.style.top);
                if (currentTop < window.innerHeight) {
                    balloon.style.top = `${currentTop + 2}px`;
                } else {
                    balloon.remove();
                }
            }, 50);
        }, delay);
        delay += 1000; // Her balonun düşüşü arasında 1 saniye gecikme
    });
}

// Başlangıçta bir soru oluştur
generateQuestion(); 