// Exam logic and question handling
class ExamManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.timer = 120 * 60; // 120 minutes in seconds
        this.timerInterval = null;
        this.answeredQuestions = 0;
    }
    
    init(examData) {
        this.questions = examData.questions;
        this.timer = examData.duration * 60;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.answeredQuestions = 0;
        
        this.startTimer();
        this.displayCurrentQuestion();
        this.setupEventListeners();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        this.timer--;
        
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        
        document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Time warning
        if (this.timer === 10 * 60) { // 10 minutes left
            document.getElementById('timer').classList.add('warning');
            document.getElementById('time-warning').style.display = 'block';
        }
        
        if (this.timer === 60) { // 1 minute left
            document.getElementById('time-warning').style.display = 'none';
        }
        
        // Time's up
        if (this.timer <= 0) {
            this.finishExam();
        }
    }
    
    displayCurrentQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        document.getElementById('question-text').textContent = question.text;
        document.getElementById('option-a').textContent = question.options.A;
        document.getElementById('option-b').textContent = question.options.B;
        document.getElementById('option-c').textContent = question.options.C;
        document.getElementById('option-d').textContent = question.options.D;
        document.getElementById('option-e').textContent = question.options.E || '';
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.questions.length;
        document.getElementById('explanation').style.display = 'none';
        
        // Reset options
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'wrong');
            opt.style.pointerEvents = 'auto';
        });
    }
    
    setupEventListeners() {
        // Answer selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', () => {
                if (option.classList.contains('selected')) return;
                
                const selectedOption = option.getAttribute('data-option');
                const isCorrect = selectedOption === this.questions[this.currentQuestionIndex].correctAnswer;
                
                // Play sound
                const sound = isCorrect ? document.getElementById('correct-audio') : document.getElementById('wrong-audio');
                sound.currentTime = 0;
                sound.play();
                
                // Mark selected option
                document.querySelectorAll('.answer-option').forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'wrong');
                });
                
                option.classList.add('selected');
                option.classList.add(isCorrect ? 'correct' : 'wrong');
                
                // Show explanation
                document.getElementById('explanation-text').textContent = 
                    this.questions[this.currentQuestionIndex].explanation;
                document.getElementById('explanation').style.display = 'block';
                
                // Update score
                if (isCorrect) {
                    this.score += 10;
                    this.correctAnswers++;
                } else {
                    this.wrongAnswers++;
                }
                
                this.answeredQuestions++;
                
                // Disable further selection for this question
                document.querySelectorAll('.answer-option').forEach(opt => {
                    opt.style.pointerEvents = 'none';
                });
            });
        });
        
        // Skip question
        document.getElementById('skip-question').addEventListener('click', () => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.displayCurrentQuestion();
            } else {
                this.finishExam();
            }
        });
        
        // Unanswered questions
        document.getElementById('unanswered-questions').addEventListener('click', () => {
            alert(`Anda memiliki ${this.questions.length - this.answeredQuestions} soal yang belum dijawab.`);
        });
        
        // Finish exam
        document.getElementById('finish-exam').addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang?')) {
                this.finishExam();
            }
        });
    }
    
    finishExam() {
        clearInterval(this.timerInterval);
        
        // Calculate final score
        const finalScore = Math.round((this.correctAnswers / this.questions.length) * 100);
        
        // Save results
        const participantData = JSON.parse(localStorage.getItem('participantData'));
        const examResults = {
            participant: participantData,
            score: finalScore,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            totalQuestions: this.questions.length,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (in a real app, you would send this to a server)
        let allResults = JSON.parse(localStorage.getItem('examResults')) || [];
        allResults.push(examResults);
        localStorage.setItem('examResults', JSON.stringify(allResults));
        
        // Show results screen
        document.getElementById('exam-screen').classList.remove('active');
        document.getElementById('results-screen').classList.add('active');
        
        document.getElementById('total-answered').textContent = this.questions.length;
        document.getElementById('correct-answers').textContent = this.correctAnswers;
        document.getElementById('wrong-answers').textContent = this.wrongAnswers;
        document.getElementById('final-score').textContent = finalScore;
        
        // View certificate
        document.getElementById('view-certificate').addEventListener('click', () => {
            document.getElementById('results-screen').classList.remove('active');
            document.getElementById('certificate-screen').classList.add('active');
            
            // Generate certificate
            generateCertificate(participantData, finalScore);
        });
        
        // Retake exam
        document.getElementById('retake-exam').addEventListener('click', () => {
            document.getElementById('results-screen').classList.remove('active');
            document.getElementById('exam-screen').classList.add('active');
            this.init({
                questions: this.questions,
                duration: 120
            });
        });
    }
}

// Initialize exam manager
const examManager = new ExamManager();

// Sample exam data (in a real app, this would come from a server)
const sampleExamData = {
    questions: [
        {
            id: 1,
            text: "Apa ibukota Indonesia?",
            options: {
                A: "Jakarta",
                B: "Bandung",
                C: "Surabaya",
                D: "Medan",
                E: "Yogyakarta"
            },
            correctAnswer: "A",
            explanation: "Jakarta adalah ibukota Indonesia sejak tahun 1945."
        },
        {
            id: 2,
            text: "2 + 2 = ?",
            options: {
                A: "3",
                B: "4",
                C: "5",
                D: "6",
                E: "7"
            },
            correctAnswer: "B",
            explanation: "2 ditambah 2 sama dengan 4."
        }
    ],
    duration: 120
};

// Start exam when the page loads (for demo purposes)
document.addEventListener('DOMContentLoaded', function() {
    // This would be called when the exam screen is shown
    // examManager.init(sampleExamData);
});
