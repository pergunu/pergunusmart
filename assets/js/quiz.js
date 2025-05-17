// pergunu-smart/js/quiz.js
document.addEventListener('DOMContentLoaded', function() {
    // Variabel quiz
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 90 * 60; // 90 menit dalam detik
    let questions = [];
    let userAnswers = Array(20).fill(null); // Array untuk menyimpan jawaban user
    let quizStarted = false;
    
    // Inisialisasi quiz
    function initQuiz() {
        // Load pertanyaan berdasarkan kategori peserta
        const participantData = JSON.parse(localStorage.getItem('participantData'));
        loadQuestions(participantData);
        
        // Setup timer
        updateTimerDisplay();
        timer = setInterval(updateTimer, 1000);
        
        // Tampilkan pertanyaan pertama
        displayQuestion();
        
        // Event listeners
        document.getElementById('nextBtn').addEventListener('click', nextQuestion);
        document.getElementById('finishBtn').addEventListener('click', finishQuiz);
        document.getElementById('unansweredBtn').addEventListener('click', showUnansweredQuestions);
    }
    
    // Memuat pertanyaan berdasarkan kategori peserta
    function loadQuestions(participantData) {
        // Ini adalah contoh data pertanyaan - dalam implementasi nyata, Anda akan mengambil dari database/API
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
            }
            
            optionElement.innerHTML = `
                <div class="option-prefix">${String.fromCharCode(65 + index)}.</div>
                <div class="option-text">${option}</div>
            `;
            
            optionElement.addEventListener('click', () => selectAnswer(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // Sembunyikan penjelasan
        document.getElementById('explanation').style.display = 'none';
        
        // Update tombol navigasi
        updateNavigationButtons();
    }
    
    // Memilih jawaban
    function selectAnswer(answerIndex) {
        // Jika quiz sudah selesai, tidak bisa memilih jawaban lagi
        if (!quizStarted) return;
        
        const question = questions[currentQuestion];
        const options = document.querySelectorAll('.option');
        
        // Simpan jawaban user
        userAnswers[currentQuestion] = answerIndex;
        
        // Tandai jawaban yang dipilih
        options.forEach(option => option.classList.remove('selected', 'correct', 'incorrect'));
        options[answerIndex].classList.add('selected');
        
        // Tampilkan apakah jawaban benar/salah
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
        const finishBtn = document.getElementById('finishBtn');
        
        if (currentQuestion === questions.length - 1) {
            nextBtn.textContent = 'Selesaikan';
            nextBtn.innerHTML = '<i class="fas fa-stop"></i> Selesaikan';
        } else {
            nextBtn.textContent = 'Lanjut';
            nextBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Lanjut';
        }
    }
    
    // Menampilkan pertanyaan yang belum dijawab
    function showUnansweredQuestions() {
        const unansweredQuestions = userAnswers.map((answer, index) => 
            answer === null ? index : null
        ).filter(val => val !== null);
        
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
        
        // Jika waktu habis
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
        
        // Hitung skor
        calculateScore();
        
        // Simpan hasil
        saveResults();
        
        // Redirect ke halaman hasil
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
    
    // Fungsi untuk menghasilkan contoh pertanyaan (simulasi)
    function generateSampleQuestions(participantData) {
        // Ini hanya contoh - dalam implementasi nyata, Anda akan mengambil dari database
        const sampleQuestions = [];
        const categories = {
            pelajar: ['Agama', 'PPKN', 'Sejarah', 'IPA', 'IPS', 'Matematika', 'Bahasa Indonesia', 'Bahasa Inggris'],
            umum: ['Logika', 'CPNS/P3K']
        };
        
        const category = participantData.status === 'pelajar' ? 
            participantData.exam || 'IPA' : 
            participantData.purpose === 'cpns-p3k' ? 'CPNS/P3K' : 'Logika';
        
        for (let i = 0; i < 20; i++) {
            sampleQuestions.push({
                id: i + 1,
                text: `Ini adalah contoh pertanyaan ${i + 1} untuk kategori ${category}. Pertanyaan ini dimaksudkan untuk menguji pengetahuan Anda tentang topik tertentu.`,
                options: [
                    `Pilihan A untuk pertanyaan ${i + 1}`,
                    `Pilihan B untuk pertanyaan ${i + 1}`,
                    `Pilihan C untuk pertanyaan ${i + 1}`,
                    `Pilihan D untuk pertanyaan ${i + 1}`
                ],
                correctAnswer: Math.floor(Math.random() * 4), // Jawaban acak untuk contoh
                explanation: `Ini adalah penjelasan untuk pertanyaan ${i + 1}. Jawaban yang benar adalah ${String.fromCharCode(65 + Math.floor(Math.random() * 4))} karena alasan tertentu.`,
                category: category,
                difficulty: 'sedang'
            });
        }
        
        return sampleQuestions;
    }
    
    // Mulai quiz
    function startQuiz() {
        quizStarted = true;
        initQuiz();
    }
    
    // Ekspor fungsi startQuiz
    window.startQuiz = startQuiz;
});
