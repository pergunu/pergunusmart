// Variabel quiz
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 90 * 60; // 90 menit dalam detik
let questions = [];
let userAnswers = [];
let quizStarted = false;

// Inisialisasi quiz
function initQuiz() {
    const participantData = JSON.parse(localStorage.getItem('participantData'));
    loadQuestions(participantData);
    userAnswers = new Array(questions.length).fill(null);
    
    // Setup timer
    updateTimerDisplay();
    timer = setInterval(updateTimer, 1000);
    
    displayQuestion();
    
    // Event listeners
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('finishBtn').addEventListener('click', finishQuiz);
    document.getElementById('unansweredBtn').addEventListener('click', showUnansweredQuestions);
    
    quizStarted = true;
}

// Tampilkan pertanyaan
function displayQuestion() {
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }
    
    const question = questions[currentQuestion];
    const optionsContainer = document.getElementById('optionsContainer');
    
    document.getElementById('questionCounter').textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
    document.getElementById('questionText').textContent = question.text;
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        
        if (userAnswers[currentQuestion] === index) {
            optionElement.classList.add('selected');
            if (index === question.correctAnswer) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        }
        
        optionElement.innerHTML = `
            <div class="option-prefix">${String.fromCharCode(65 + index)}.</div>
            <div class="option-text">${option}</div>
        `;
        
        optionElement.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionElement);
    });
    
    if (userAnswers[currentQuestion] !== null) {
        const correctOption = document.querySelectorAll('.option')[question.correctAnswer];
        correctOption.classList.add('correct');
        
        document.getElementById('explanationText').textContent = question.explanation;
        document.getElementById('explanation').style.display = 'block';
        
        document.querySelectorAll('.option').forEach(option => {
            option.style.pointerEvents = 'none';
        });
    } else {
        document.getElementById('explanation').style.display = 'none';
    }
    
    updateNavigationButtons();
}

// Pilih jawaban
function selectAnswer(answerIndex) {
    if (!quizStarted || userAnswers[currentQuestion] !== null) return;
    
    const question = questions[currentQuestion];
    userAnswers[currentQuestion] = answerIndex;
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => option.classList.remove('selected', 'correct', 'incorrect'));
    options[answerIndex].classList.add('selected');
    
    if (answerIndex === question.correctAnswer) {
        options[answerIndex].classList.add('correct');
        playAudio('correct');
    } else {
        options[answerIndex].classList.add('incorrect');
        options[question.correctAnswer].classList.add('correct');
        playAudio('wrong');
    }
    
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('explanation').style.display = 'block';
    
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Fungsi lainnya tetap sama seperti sebelumnya
// ... (sisanya sama dengan kode quiz.js sebelumnya)

// Ekspor fungsi startQuiz
window.startQuiz = initQuiz;
