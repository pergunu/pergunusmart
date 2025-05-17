// Variabel global quiz
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 90 * 60; // 90 menit dalam detik
let questions = [];
let userAnswers = [];
let quizStarted = false;

// Inisialisasi quiz
function initQuiz() {
    // Load pertanyaan dari localStorage atau generate contoh
    const participantData = JSON.parse(localStorage.getItem('participantData'));
    questions = loadQuestions(participantData);
    userAnswers = new Array(questions.length).fill(null);
    
    // Setup timer
    updateTimerDisplay();
    timer = setInterval(updateTimer, 1000);
    
    // Tampilkan pertanyaan pertama
    displayQuestion();
    
    // Setup event listeners
    setupEventListeners();
    
    quizStarted = true;
}

// Memuat pertanyaan
function loadQuestions(participantData) {
    // Contoh data pertanyaan - dalam implementasi nyata bisa dari API/database
    const sampleQuestions = [];
    const category = participantData.status === 'pelajar' ? 
        participantData.exam || 'IPA' : 
        participantData.purpose === 'cpns-p3k' ? 'CPNS/P3K' : 'Logika';
    
    for (let i = 0; i < 20; i++) {
        const correctAnswer = Math.floor(Math.random() * 4);
        sampleQuestions.push({
            id: i + 1,
            text: `Contoh pertanyaan ${i + 1} untuk kategori ${category}. Manakah jawaban yang benar?`,
            options: [
                `Opsi A untuk pertanyaan ${i + 1}`,
                `Opsi B untuk pertanyaan ${i + 1}`,
                `Opsi C untuk pertanyaan ${i + 1}`,
                `Opsi D untuk pertanyaan ${i + 1}`
            ],
            correctAnswer: correctAnswer,
            explanation: `Penjelasan untuk pertanyaan ${i + 1}. Jawaban yang benar adalah ${String.fromCharCode(65 + correctAnswer)} karena alasan tertentu.`,
            category: category,
            difficulty: 'sedang'
        });
    }
    
    return sampleQuestions;
}

// Menampilkan pertanyaan
function displayQuestion() {
    if (currentQuestion >= questions.length) {
        finishQuiz();
        return;
    }
    
    const question = questions[currentQuestion];
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Update tampilan
    document.getElementById('questionCounter').textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
    document.getElementById('questionText').textContent = question.text;
    optionsContainer.innerHTML = '';
    
    // Buat opsi jawaban
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        
        // Tandai jika sudah dijawab
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
    
    // Tampilkan penjelasan jika sudah dijawab
    if (userAnswers[currentQuestion] !== null) {
        const correctOption = document.querySelectorAll('.option')[question.correctAnswer];
        correctOption.classList.add('correct');
        
        document.getElementById('explanationText').textContent = question.explanation;
        document.getElementById('explanation').style.display = 'block';
        
        // Nonaktifkan interaksi setelah dijawab
        document.querySelectorAll('.option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
    } else {
        document.getElementById('explanation').style.display = 'none';
    }
    
    updateNavigationButtons();
}

// Memilih jawaban
function selectAnswer(answerIndex) {
    if (!quizStarted || userAnswers[currentQuestion] !== null) return;
    
    const question = questions[currentQuestion];
    userAnswers[currentQuestion] = answerIndex;
    
    // Update tampilan
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));
    options[answerIndex].classList.add('selected');
    
    // Beri feedback
    if (answerIndex === question.correctAnswer) {
        options[answerIndex].classList.add('correct');
        playAudio('correct');
    } else {
        options[answerIndex].classList.add('incorrect');
        options[question.correctAnswer].classList.add('correct');
        playAudio('wrong');
    }
    
    // Tampilkan penjelasan
    document.getElementById('explanationText').textContent = question.explanation;
    document.getElementById('explanation').style.display = 'block';
    
    // Nonaktifkan interaksi
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
}

// Update timer
function updateTimer() {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
        finishQuiz();
    }
    
    // Warning saat 10 menit terakhir
    if (timeLeft === 10 * 60) {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.classList.add('timer-warning');
        }
    }
}

// Update tampilan timer
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.getElementById('timer');
    
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Setup event listeners
function setupEventListeners() {
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const unansweredBtn = document.getElementById('unansweredBtn');
    
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (finishBtn) finishBtn.addEventListener('click', finishQuiz);
    if (unansweredBtn) unansweredBtn.addEventListener('click', showUnansweredQuestions);
}

// Pertanyaan berikutnya
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        finishQuiz();
    }
}

// Tampilkan pertanyaan yang belum dijawab
function showUnansweredQuestions() {
    const unanswered = userAnswers.map((ans, idx) => ans === null ? idx : null).filter(val => val !== null);
    
    if (unanswered.length > 0) {
        currentQuestion = unanswered[