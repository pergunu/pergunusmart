// Implementasi logika quiz akan ditempatkan di sini
document.addEventListener('DOMContentLoaded', function() {
    // Variabel quiz
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let timeLeft = 90 * 60; // 90 menit dalam detik
    let questions = [];
    
    // Fungsi untuk memulai quiz
    function startQuiz() {
        // Implementasi memulai quiz
        console.log('Quiz dimulai');
        startTimer();
        loadQuestion();
    }
    
    // Fungsi untuk memulai timer
    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                finishQuiz();
            }
            
            // Perbesar timer jika sisa 10 menit
            if (timeLeft <= 600) {
                document.getElementById('timer').classList.add('warning');
            }
        }, 1000);
    }
    
    // Fungsi untuk memperbarui tampilan timer
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Fungsi untuk memuat pertanyaan
    function loadQuestion() {
        // Implementasi memuat pertanyaan
        console.log('Memuat pertanyaan', currentQuestion);
    }
    
    // Fungsi untuk menangani jawaban
    function handleAnswer(selectedOption) {
        // Implementasi penanganan jawaban
        console.log('Jawaban dipilih:', selectedOption);
    }
    
    // Fungsi untuk menyelesaikan quiz
    function finishQuiz() {
        clearInterval(timer);
        // Implementasi menyelesaikan quiz
        console.log('Quiz selesai');
    }
    
    // Fungsi untuk melewati pertanyaan
    function skipQuestion() {
        // Implementasi melewati pertanyaan
        console.log('Pertanyaan dilewati');
    }
    
    // Fungsi untuk melihat pertanyaan yang belum dijawab
    function viewUnanswered() {
        // Implementasi melihat pertanyaan yang belum dijawab
        console.log('Melihat pertanyaan yang belum dijawab');
    }
    
    // Fungsi untuk menyelesaikan quiz sekarang
    function finishNow() {
        if (confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang? Soal yang belum dijawab akan dianggap salah.')) {
            finishQuiz();
        }
    }
    
    // Event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('option')) {
            handleAnswer(e.target.dataset.option);
        }
        
        if (e.target.id === 'skipBtn') {
            skipQuestion();
        }
        
        if (e.target.id === 'unansweredBtn') {
            viewUnanswered();
        }
        
        if (e.target.id === 'finishBtn') {
            finishNow();
        }
    });
    
    // Ekspor fungsi yang diperlukan
    window.startQuiz = startQuiz;
});
