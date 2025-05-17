// pergunu-smart/js/quiz.js
document.addEventListener('DOMContentLoaded', function() {
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
        // Load pertanyaan berdasarkan kategori peserta
        const participantData = JSON.parse(localStorage.getItem('participantData'));
        loadQuestions(participantData);
        
        // Inisialisasi array jawaban user
        userAnswers = new Array(questions.length).fill(null);
        
        // Setup timer
        updateTimerDisplay();
        timer = setInterval(updateTimer, 1000);
        
        // Tampilkan pertanyaan pertama
        displayQuestion();
        
        // Event listeners
        document.getElementById('nextBtn').addEventListener('click', nextQuestion);
        document.getElementById('finishBtn').addEventListener('click', finishQuiz);
        document.getElementById('unansweredBtn').addEventListener('click', showUnansweredQuestions);
        
        quizStarted = true;
    }
    
    // Memuat pertanyaan berdasarkan kategori peserta
    function loadQuestions(participantData) {
        // Contoh pertanyaan - dalam implementasi nyata, ambil dari database/API
        questions = generateSampleQuestions(participantData);
    }
    
    // Menampilkan pertanyaan saat ini
    function displayQuestion() {
        if (currentQuestion >= questions.length) {
            finishQuiz();
            return;
        }
        
        const question = questions[currentQuestion];
        const optionsContainer = document.getElementById('optionsContainer');
        
        // Update nomor pertanyaan
        document.getElementById('questionCounter').textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
        
        // Update teks pertanyaan
        document.getElementById('questionText').textContent = question.text;
        
        // Kosongkan opsi sebelumnya
        optionsContainer.innerHTML = '';
        
        // Tambahkan opsi jawaban
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            // Tambahkan kelas jika jawaban sudah dipilih
            if (userAnswers[currentQuestion] === index) {
                optionElement.classList.add('selected');
                
                // Tandai jawaban benar/salah
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
        
        // Tampilkan jawaban benar jika sudah dipilih
        if (userAnswers[currentQuestion] !== null) {
            const correctOption = document.querySelectorAll('.option')[question.correctAnswer];
            correctOption.classList.add('correct');
            
            // Tampilkan penjelasan
            document.getElementById('explanationText').textContent = question.explanation;
            document.getElementById('explanation').style.display = 'block';
            
            // Nonaktifkan opsi setelah memilih jawaban
            document.querySelectorAll('.option').forEach(option => {
                option.style.pointerEvents = 'none';
            });
        } else {
            document.getElementById('explanation').style.display = 'none';
        }
        
        // Update tombol navigasi
        updateNavigationButtons();
    }
    
    // Memilih jawaban
    function selectAnswer(answerIndex) {
        if (!quizStarted || userAnswers[currentQuestion] !== null) return;
        
        const question = questions[currentQuestion];
        userAnswers[currentQuestion] = answerIndex;
        
        // Tandai jawaban yang dipilih
        const options = document.querySelectorAll('.option');
        options.forEach(option => option.classList.remove('selected', 'correct', 'incorrect'));
        options[answerIndex].classList.add('selected');
        
        // Tampilkan feedback
        if (answerIndex === question.correctAnswer) {
            options[answerIndex].classList.add('correct');
            playSound('correct');
        } else {
            options[answerIndex].classList.add('incorrect');
            options[question.correctAnswer].classList.add('correct');
            playSound('wrong');
        }
        
        // Tampilkan penjelasan
        document.getElementById('explanationText').textContent = question.explanation;
        document.getElementById('explanation').style.display = 'block';
        
        // Nonaktifkan opsi setelah memilih jawaban
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
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
    
    // Update tombol navigasi
    function updateNavigationButtons() {
        const nextBtn = document.getElementById('nextBtn');
        
        if (currentQuestion === questions.length - 1) {
            nextBtn.innerHTML = '<i class="fas fa-stop"></i> Selesaikan';
            nextBtn.classList.add('danger');
            nextBtn.classList.remove('primary');
        } else {
            nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Lanjut';
            nextBtn.classList.add('primary');
            nextBtn.classList.remove('danger');
        }
    }
    
    // Menampilkan pertanyaan yang belum dijawab
    function showUnansweredQuestions() {
        const unansweredQuestions = [];
        userAnswers.forEach((answer, index) => {
            if (answer === null) unansweredQuestions.push(index);
        });
        
        if (unansweredQuestions.length > 0) {
            currentQuestion = unansweredQuestions[0];
            displayQuestion();
        } else {
            alert('Semua pertanyaan sudah dijawab!');
        }
    }
    
    // Update timer
    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            finishQuiz();
        }
        
        // Jika sisa waktu 10 menit, ubah tampilan timer
        if (timeLeft === 10 * 60) {
            const timerElement = document.getElementById('timer');
            timerElement.classList.add('timer-warning');
        }
    }
    
    // Update tampilan timer
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Menyelesaikan quiz
    function finishQuiz() {
        clearInterval(timer);
        quizStarted = false;
        calculateScore();
        saveResults();
        window.location.href = 'results.html';
    }
    
    // Menghitung skor
    function calculateScore() {
        score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].correctAnswer) {
                score++;
            }
        });
    }
    
    // Menyimpan hasil quiz
    function saveResults() {
        const participantData = JSON.parse(localStorage.getItem('participantData'));
        const examResults = {
            participant: participantData,
            questions: questions,
            userAnswers: userAnswers,
            correctAnswers: score,
            wrongAnswers: userAnswers.filter((answer, index) => 
                answer !== null && answer !== questions[index].correctAnswer
            ).length,
            skippedQuestions: userAnswers.filter(answer => answer === null).length,
            totalQuestions: questions.length,
            timeSpent: (90 * 60) - timeLeft,
            scorePercentage: Math.round((score / questions.length) * 100),
            examDate: new Date().toISOString()
        };
        
        localStorage.setItem('examResults', JSON.stringify(examResults));
    }
    
    // Memainkan suara
    function playSound(type) {
        const sound = new Audio(`assets/audio/${type}.mp3`);
        sound.play().catch(e => console.log('Autoplay prevented:', e));
    }
    
    // Fungsi untuk menghasilkan contoh pertanyaan
    function generateSampleQuestions(participantData) {
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
                    `Jawaban A untuk pertanyaan ${i + 1}`,
                    `Jawaban B untuk pertanyaan ${i + 1}`,
                    `Jawaban C untuk pertanyaan ${i + 1}`,
                    `Jawaban D untuk pertanyaan ${i + 1}`
                ],
                correctAnswer: correctAnswer,
                explanation: `Penjelasan untuk pertanyaan ${i + 1}. Jawaban yang benar adalah ${String.fromCharCode(65 + correctAnswer)} karena alasan tertentu.`,
                category: category,
                difficulty: 'sedang'
            });
        }
        
        return sampleQuestions;
    }
    
    // Mulai quiz
    function startQuiz() {
        initQuiz();
    }
    
    // Ekspor fungsi startQuiz
    window.startQuiz = startQuiz;
});
