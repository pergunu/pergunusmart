// Quiz functionality
let currentQuestion = 0;
let questions = [];
let userAnswers = [];
let timerInterval;
let examDuration = 120 * 60; // 120 minutes in seconds

function initExam() {
    // Load questions based on user selections
    const allQuestions = getQuestions();
    const status = document.querySelector('input[name="status"]:checked').value;
    
    if (status === 'pelajar') {
        const subject = document.querySelector('.btn-subject.active').getAttribute('data-subject');
        questions = allQuestions.filter(q => q.category === 'pelajar' && q.subject === subject);
    } else {
        const examType = document.querySelector('.btn-level.active').getAttribute('data-exam');
        questions = allQuestions.filter(q => q.category === 'umum' && q.subject === examType);
    }
    
    // Apply randomization if enabled
    const settings = JSON.parse(localStorage.getItem('examSettings'));
    if (settings && settings.randomize) {
        questions = shuffleArray(questions);
    }
    
    // Limit number of questions
    const questionCount = settings ? parseInt(settings.count) : 10;
    questions = questions.slice(0, questionCount);
    
    // Initialize user answers
    userAnswers = Array(questions.length).fill(null);
    
    // Start timer
    startTimer();
    
    // Display first question
    displayQuestion(currentQuestion);
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    
    // Update timer every second
    timerInterval = setInterval(() => {
        const minutes = Math.floor(examDuration / 60);
        const seconds = examDuration % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Show warning when 10 minutes left
        if (examDuration === 10 * 60) {
            document.getElementById('time-warning').style.display = 'block';
        }
        
        // Hide warning when 1 minute left
        if (examDuration === 60) {
            document.getElementById('time-warning').style.display = 'none';
        }
        
        // Make timer bigger when 10 minutes left
        if (examDuration <= 10 * 60) {
            timerElement.style.fontSize = '2rem';
            timerElement.style.color = 'var(--danger-color)';
        }
        
        // End exam when time is up
        if (examDuration <= 0) {
            clearInterval(timerInterval);
            finishExam();
            return;
        }
        
        examDuration--;
    }, 1000);
}

function displayQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    const question = questions[index];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressFill = document.getElementById('progress-fill');
    const questionCounter = document.getElementById('question-counter');
    
    // Update question text
    questionText.textContent = `${index + 1}. ${question.question}`;
    
    // Update options
    optionsContainer.innerHTML = '';
    for (const [key, value] of Object.entries(question.options)) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.option = key;
        
        const optionLetter = document.createElement('span');
        optionLetter.className = 'option-letter';
        optionLetter.textContent = key.toUpperCase();
        
        const optionText = document.createElement('span');
        optionText.className = 'option-text';
        optionText.textContent = value;
        
        optionDiv.appendChild(optionLetter);
        optionDiv.appendChild(optionText);
        
        // Mark if already answered
        if (userAnswers[index] === key) {
            optionDiv.classList.add('selected');
            if (key === question.correctAnswer) {
                optionDiv.classList.add('correct');
            } else {
                optionDiv.classList.add('wrong');
            }
        }
        
        optionDiv.addEventListener('click', () => selectAnswer(key));
        optionsContainer.appendChild(optionDiv);
    }
    
    // Update progress
    progressFill.style.width = `${((index + 1) / questions.length) * 100}%`;
    questionCounter.textContent = `${index + 1}/${questions.length}`;
    
    // Show explanation if answered
    if (userAnswers[index] !== null) {
        const explanation = document.getElementById('answer-explanation');
        const explanationText = document.getElementById('explanation-text');
        
        explanationText.textContent = question.explanation;
        explanation.style.display = 'block';
    } else {
        document.getElementById('answer-explanation').style.display = 'none';
    }
    
    // Update navigation buttons
    document.getElementById('skip-question').style.display = index < questions.length - 1 ? 'block' : 'none';
}

function selectAnswer(option) {
    if (userAnswers[currentQuestion] !== null) return; // Prevent changing answers
    
    const question = questions[currentQuestion];
    userAnswers[currentQuestion] = option;
    
    // Play sound effect
    const audio = document.getElementById(option === question.correctAnswer ? 'correct-audio' : 'wrong-audio');
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio error:", e));
    
    // Update UI
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
        
        if (opt.dataset.option === option) {
            opt.classList.add('selected');
            opt.classList.add(option === question.correctAnswer ? 'correct' : 'wrong');
        }
        
        if (opt.dataset.option === question.correctAnswer) {
            opt.classList.add('correct');
        }
    });
    
    // Show explanation
    const explanation = document.getElementById('answer-explanation');
    const explanationText = document.getElementById('explanation-text');
    
    explanationText.textContent = question.explanation;
    explanation.style.display = 'block';
    
    // Auto-advance to next question after delay if correct
    if (option === question.correctAnswer) {
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                displayQuestion(currentQuestion);
            }
        }, 1500);
    }
}

function finishExam() {
    clearInterval(timerInterval);
    
    // Calculate score
    let correctCount = 0;
    let totalPoints = 0;
    let maxPossiblePoints = 0;
    
    questions.forEach((q, i) => {
        maxPossiblePoints += q.point;
        if (userAnswers[i] === q.correctAnswer) {
            correctCount++;
            totalPoints += q.point;
        }
    });
    
    const score = Math.round((totalPoints / maxPossiblePoints) * 100);
    
    // Save results
    const participant = getParticipants().pop(); // Get the last participant
    participant.score = score;
    participant.correctAnswers = correctCount;
    participant.wrongAnswers = questions.length - correctCount;
    participant.completedAt = new Date().toISOString();
    
    // Update participants data
    const participants = getParticipants();
    participants[participants.length - 1] = participant;
    localStorage.setItem('participants', JSON.stringify(participants));
    
    // Show results
    showResults(correctCount, questions.length - correctCount, questions.length, score);
}

function showResults(correct, wrong, total, score) {
    document.querySelector('#exam-screen').classList.remove('active');
    document.querySelector('#results-screen').classList.add('active');
    
    document.getElementById('correct-answers').textContent = correct;
    document.getElementById('wrong-answers').textContent = wrong;
    document.getElementById('total-questions').textContent = total;
    document.getElementById('final-score').textContent = score;
    
    // Generate certificate code
    const participant = getParticipants().pop();
    const date = new Date();
    const certCode = generateCertificateCode(participant, date);
    
    // Prepare certificate data
    const certData = {
        name: participant.fullname,
        score: score,
        date: date,
        code: certCode
    };
    
    // Set up certificate view button
    document.getElementById('view-certificate').addEventListener('click', () => showCertificate(certData));
    
    // Set up retake exam button
    document.getElementById('retake-exam').addEventListener('click', () => {
        document.querySelector('#results-screen').classList.remove('active');
        document.querySelector('#level-screen').classList.add('active');
        currentQuestion = 0;
        userAnswers = [];
    });
    
    // Show answers table
    const answersTable = document.getElementById('answers-table');
    answersTable.innerHTML = '';
    
    questions.forEach((q, i) => {
        const row = document.createElement('div');
        row.className = 'answer-row';
        
        const questionCell = document.createElement('div');
        questionCell.className = 'answer-cell';
        questionCell.textContent = `${i + 1}. ${q.question}`;
        
        const answerCell = document.createElement('div');
        answerCell.className = 'answer-cell';
        
        if (userAnswers[i] === null) {
            answerCell.textContent = 'Tidak dijawab';
            answerCell.style.color = 'var(--danger-color)';
        } else {
            answerCell.textContent = `Jawaban Anda: ${userAnswers[i].toUpperCase()} (${userAnswers[i] === q.correctAnswer ? 'Benar' : 'Salah'})`;
            answerCell.style.color = userAnswers[i] === q.correctAnswer ? 'var(--success-color)' : 'var(--danger-color)';
        }
        
        row.appendChild(questionCell);
        row.appendChild(answerCell);
        answersTable.appendChild(row);
    });
}

function showCertificate(data) {
    document.querySelector('#results-screen').classList.remove('active');
    document.querySelector('#certificate-screen').classList.add('active');
    
    // Play applause sound
    const applause = document.getElementById('applause-audio');
    applause.currentTime = 0;
    applause.play().catch(e => console.log("Audio error:", e));
    
    // Update certificate content
    document.getElementById('cert-name').textContent = data.name;
    document.getElementById('cert-score').textContent = data.score;
    document.getElementById('cert-date').textContent = `Ditetapkan di: Situbondo, ${formatDate(data.date)}`;
    document.getElementById('cert-code').textContent = data.code;
    
    // Set motivation text based on score
    const settings = JSON.parse(localStorage.getItem('examSettings'));
    const motivations = settings ? JSON.parse(settings.motivations) : {};
    let motivation = '';
    
    for (const [range, text] of Object.entries(motivations)) {
        const [min, max] = range.split('-').map(Number);
        if (data.score >= min && data.score <= max) {
            motivation = text;
            break;
        }
    }
    
    document.getElementById('cert-motivation').textContent = motivation;
    
    // Set up print button
    document.getElementById('print-certificate').addEventListener('click', () => {
        window.print();
    });
    
    // Set up back button
    document.getElementById('back-to-results').addEventListener('click', () => {
        document.querySelector('#certificate-screen').classList.remove('active');
        document.querySelector('#results-screen').classList.add('active');
    });
}

function generateCertificateCode(participant, date) {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                       '-' + 
                       Math.random().toString(36).substring(2, 5).toUpperCase();
    
    const dateStr = date.getDate().toString().padStart(2, '0') + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getFullYear();
    
    return `${participant.fullname.toUpperCase().replace(/ /g, '')}/${
        participant.status.toUpperCase()}/${
        participant.schoolLevel ? participant.schoolLevel.toUpperCase() : 'UMUM'}/${
        participant.purpose ? participant.purpose.toUpperCase().replace(/ /g, '_') : 'TEST'}/${
        dateStr}/${randomCode}/PERGUNU-STB`;
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Initialize quiz buttons
document.addEventListener('DOMContentLoaded', function() {
    // Subject buttons
    document.querySelectorAll('.btn-subject').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-subject').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('start-exam').disabled = false;
        });
    });
    
    // Level buttons
    document.querySelectorAll('.btn-level').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-level').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // For general levels, check if CPNS license is needed
            if (this.dataset.exam === 'ujian-cpns') {
                document.getElementById('start-exam').disabled = true;
            } else {
                document.getElementById('start-exam').disabled = false;
            }
        });
    });
    
    // Skip question
    document.getElementById('skip-question').addEventListener('click', function() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            displayQuestion(currentQuestion);
        }
    });
    
    // Unanswered questions
    document.getElementById('unanswered-questions').addEventListener('click', function() {
        const unanswered = userAnswers.findIndex(answer => answer === null);
        if (unanswered !== -1) {
            currentQuestion = unanswered;
            displayQuestion(currentQuestion);
        } else {
            alert('Semua soal telah dijawab.');
        }
    });
    
    // Finish exam
    document.getElementById('finish-exam').addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang? Soal yang belum dijawab akan dianggap salah.')) {
            finishExam();
        }
    });
});
