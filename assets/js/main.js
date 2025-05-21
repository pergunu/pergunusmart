/**
 * EXAM MANAGEMENT SCRIPT
 * Ujian Online PERGUNU Situbondo
 * Versi Final
 */

// Variabel Global untuk State Ujian
let examState = {
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    startTime: null,
    timerInterval: null,
    examDuration: 120 // dalam menit
};

/**
 * Initialize Exam
 */
function initializeExam() {
    console.log('Memulai ujian...');
    
    try {
        // Load exam details from localStorage
        const examDetails = JSON.parse(localStorage.getItem('currentExam'));
        const participantData = JSON.parse(localStorage.getItem('currentParticipant'));
        
        if (!examDetails || !participantData) {
            throw new Error('Data ujian tidak valid');
        }
        
        // Set exam info
        setExamInfo(examDetails, participantData);
        
        // Load questions based on exam type
        loadQuestions(examDetails);
        
        // Initialize exam state
        initExamState();
        
        // Start timer
        startTimer();
        
        // Display first question
        displayCurrentQuestion();
        
        // Setup exam navigation
        setupExamNavigation();
        
    } catch (error) {
        console.error('Error initializing exam:', error);
        showNotification('Gagal memulai ujian. Silakan coba lagi.', 'error');
        showScreen('exam-selection-screen');
    }
}

/**
 * Set Exam Information
 */
function setExamInfo(examDetails, participantData) {
    const examTitle = document.getElementById('exam-title');
    const examCategory = document.getElementById('exam-category');
    
    if (examDetails.type === 'pelajar') {
        examTitle.textContent = `Ujian ${examDetails.subject}`;
        examCategory.textContent = `Kategori: Pelajar ${examDetails.schoolLevel} Kelas ${examDetails.grade}`;
    } else {
        examTitle.textContent = examDetails.examType === 'tes-iq' ? 'Tes IQ' : 'Ujian CPNS/P3K';
        examCategory.textContent = 'Kategori: Umum';
    }
    
    // Set exam duration from admin settings or use default
    examState.examDuration = parseInt(localStorage.getItem('examTimer')) || 120;
}

/**
 * Load Questions
 */
function loadQuestions(examDetails) {
    // In a real app, this would fetch from server
    // For demo, we'll use localStorage or sample questions
    let allQuestions = JSON.parse(localStorage.getItem('questionBank')) || getSampleQuestions();
    
    // Filter questions based on exam type
    if (examDetails.type === 'pelajar') {
        examState.questions = allQuestions.filter(q => 
            q.category === examDetails.subject && q.type === 'pelajar'
        );
    } else {
        examState.questions = allQuestions.filter(q => 
            q.type === 'umum' && q.examType === examDetails.examType
        );
    }
    
    // Randomize questions if setting is enabled
    if (localStorage.getItem('randomizeQuestions') !== 'false') {
        examState.questions = shuffleArray(examState.questions);
    }
    
    // Limit number of questions based on admin setting
    const questionCount = parseInt(localStorage.getItem('questionCount')) || 10;
    examState.questions = examState.questions.slice(0, questionCount);
    
    if (examState.questions.length === 0) {
        throw new Error('Tidak ada soal yang tersedia untuk ujian ini');
    }
}

/**
 * Get Sample Questions (Fallback)
 */
function getSampleQuestions() {
    // This should match the sample questions in main.js
    return [
        // Agama (Pelajar)
        {
            id: '1',
            type: 'pelajar',
            category: 'AGAMA',
            question: 'Apa nama kitab suci umat Islam?',
            options: {
                A: 'Injil',
                B: 'Taurat',
                C: 'Al-Quran',
                D: 'Weda',
                E: 'Tripitaka'
            },
            correctAnswer: 'C',
            explanation: 'Kitab suci umat Islam adalah Al-Quran yang diturunkan kepada Nabi Muhammad SAW.',
            image: null
        },
        // PPKN (Pelajar)
        {
            id: '2',
            type: 'pelajar',
            category: 'PPKN',
            question: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 pada alinea keberapa?',
            options: {
                A: 'Pertama',
                B: 'Kedua',
                C: 'Ketiga',
                D: 'Keempat',
                E: 'Kelima'
            },
            correctAnswer: 'D',
            explanation: 'Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 alinea keempat.',
            image: null
        },
        // ... (tambahkan lebih banyak contoh soal sesuai kebutuhan)
    ];
}

/**
 * Initialize Exam State
 */
function initExamState() {
    examState.currentQuestionIndex = 0;
    examState.answers = {};
    examState.startTime = new Date().getTime();
    examState.timerInterval = null;
}

/**
 * Start Timer
 */
function startTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = examState.examDuration * 60; // Convert to seconds
    
    // Update timer immediately
    updateTimerDisplay(timerElement, timeLeft);
    
    // Start timer interval
    examState.timerInterval = setInterval(() => {
        timeLeft--;
        
        // Update display
        updateTimerDisplay(timerElement, timeLeft);
        
        // Check if time is up
        if (timeLeft <= 0) {
            clearInterval(examState.timerInterval);
            finishExam(true);
        }
        
        // Warning when 10 minutes left
        if (timeLeft === 600) {
            showTimeWarning();
        }
    }, 1000);
}

/**
 * Update Timer Display
 */
function updateTimerDisplay(timerElement, seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    timerElement.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    
    // Change style when 10 minutes left
    if (seconds <= 600) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
}

/**
 * Show Time Warning
 */
function showTimeWarning() {
    const notification = document.getElementById('exam-notification');
    notification.textContent = 'Perhatian! Ujian akan berakhir dalam waktu 10 menit. Mohon pastikan semua jawaban telah diselesaikan sebelum waktu habis.';
    notification.classList.add('show', 'warning');
    
    setTimeout(() => {
        notification.classList.remove('show', 'warning');
    }, 10000);
}

/**
 * Display Current Question
 */
function displayCurrentQuestion() {
    const currentQuestion = examState.questions[examState.currentQuestionIndex];
    const questionText = document.getElementById('question-text');
    const answerOptions = document.getElementById('answer-options');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    
    // Update question number
    currentQuestionElement.textContent = examState.currentQuestionIndex + 1;
    totalQuestionsElement.textContent = examState.questions.length;
    
    // Set question text
    questionText.textContent = currentQuestion.question;
    
    // Clear previous options
    answerOptions.innerHTML = '';
    
    // Add new options
    for (const [key, value] of Object.entries(currentQuestion.options)) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.id = `answer-${key}`;
        radio.value = key;
        
        // Check if this option was previously selected
        if (examState.answers[examState.currentQuestionIndex] === key) {
            radio.checked = true;
            showAnswerExplanation(currentQuestion, key === currentQuestion.correctAnswer);
        }
        
        const label = document.createElement('label');
        label.htmlFor = `answer-${key}`;
        label.textContent = `${key}. ${value}`;
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        
        // Add click event
        optionDiv.addEventListener('click', function() {
            selectAnswer(key, currentQuestion);
        });
        
        answerOptions.appendChild(optionDiv);
    }
}

/**
 * Select Answer
 */
function selectAnswer(selectedKey, currentQuestion) {
    // Save answer
    examState.answers[examState.currentQuestionIndex] = selectedKey;
    
    // Show explanation
    showAnswerExplanation(currentQuestion, selectedKey === currentQuestion.correctAnswer);
    
    // Disable all options after selection
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    // Play sound
    playAnswerSound(selectedKey === currentQuestion.correctAnswer);
}

/**
 * Show Answer Explanation
 */
function showAnswerExplanation(question, isCorrect) {
    const explanationDiv = document.getElementById('answer-explanation');
    const explanationText = document.getElementById('explanation-text');
    
    explanationText.textContent = question.explanation;
    explanationDiv.style.display = 'block';
    
    // Highlight selected answer
    const selectedOption = document.querySelector(`input[name="answer"]:checked`).parentElement;
    
    if (isCorrect) {
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('wrong');
        // Also highlight correct answer
        const correctOption = document.querySelector(`input[value="${question.correctAnswer}"]`).parentElement;
        correctOption.classList.add('correct');
    }
}

/**
 * Play Answer Sound
 */
function playAnswerSound(isCorrect) {
    const audio = isCorrect ? 
        document.getElementById('correct-answer-audio') : 
        document.getElementById('wrong-answer-audio');
    
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio play error:', e));
    }
}

/**
 * Setup Exam Navigation
 */
function setupExamNavigation() {
    const finishExamBtn = document.getElementById('finish-exam-btn');
    const skipQuestionBtn = document.getElementById('skip-question-btn');
    const unansweredBtn = document.getElementById('unanswered-btn');
    
    // Finish exam button
    finishExamBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang? Soal yang belum dijawab akan dianggap salah.')) {
            finishExam(false);
        }
    });
    
    // Skip question button
    skipQuestionBtn.addEventListener('click', function() {
        moveToNextQuestion();
    });
    
    // Unanswered questions button
    unansweredBtn.addEventListener('click', function() {
        goToUnansweredQuestion();
    });
}

/**
 * Move to Next Question
 */
function moveToNextQuestion() {
    examState.currentQuestionIndex++;
    
    // Loop back to first question if at end
    if (examState.currentQuestionIndex >= examState.questions.length) {
        examState.currentQuestionIndex = 0;
    }
    
    displayCurrentQuestion();
}

/**
 * Go to Unanswered Question
 */
function goToUnansweredQuestion() {
    // Find first unanswered question
    let unansweredIndex = 0;
    while (unansweredIndex < examState.questions.length && examState.answers[unansweredIndex]) {
        unansweredIndex++;
    }
    
    if (unansweredIndex < examState.questions.length) {
        examState.currentQuestionIndex = unansweredIndex;
        displayCurrentQuestion();
    } else {
        showNotification('Semua soal sudah dijawab.', 'info');
    }
}

/**
 * Finish Exam
 */
function finishExam(isTimeUp) {
    // Clear timer
    clearInterval(examState.timerInterval);
    
    // Calculate results
    const results = calculateResults();
    
    // Generate certificate code
    const certificateCode = generateCertificateCode(results);
    
    // Save results
    saveExamResults(results, certificateCode);
    
    // Show results screen
    showResultsScreen(results, certificateCode);
}

/**
 * Calculate Results
 */
function calculateResults() {
    let correct = 0;
    let wrong = 0;
    const totalQuestions = examState.questions.length;
    
    for (let i = 0; i < totalQuestions; i++) {
        const userAnswer = examState.answers[i];
        const correctAnswer = examState.questions[i].correctAnswer;
        
        if (userAnswer === correctAnswer) {
            correct++;
        } else {
            wrong++;
        }
    }
    
    // Calculate score
    const pointPerQuestion = parseInt(localStorage.getItem('questionPoint')) || 1;
    const score = Math.round((correct / totalQuestions) * 100 * pointPerQuestion);
    
    return {
        totalQuestions,
        correct,
        wrong,
        unanswered: totalQuestions - correct - wrong,
        score
    };
}

/**
 * Generate Certificate Code
 */
function generateCertificateCode(results) {
    const participantData = JSON.parse(localStorage.getItem('currentParticipant'));
    const examDetails = JSON.parse(localStorage.getItem('currentExam'));
    const now = new Date();
    
    // Format date
    const dateStr = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    
    // Generate random code
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                       '-' + 
                       Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Build code parts
    const namePart = participantData.fullname.toUpperCase().replace(/ /g, '_');
    const statusPart = participantData.status.toUpperCase();
    
    let categoryPart = '';
    if (examDetails.type === 'pelajar') {
        categoryPart = `${examDetails.schoolLevel}/${examDetails.subject}`;
    } else {
        categoryPart = `UMUM/${examDetails.examType}`;
    }
    
    return `${namePart}/${statusPart}/${categoryPart}/${dateStr}/${randomCode}/PERGUNU-STB`;
}

/**
 * Save Exam Results
 */
function saveExamResults(results, certificateCode) {
    const participantData = JSON.parse(localStorage.getItem('currentParticipant'));
    const examDetails = JSON.parse(localStorage.getItem('currentExam'));
    
    const examResult = {
        participant: participantData,
        exam: examDetails,
        results: results,
        timestamp: new Date().toISOString(),
        certificateCode: certificateCode
    };
    
    // Save to exam history
    let examHistory = JSON.parse(localStorage.getItem('examHistory')) || [];
    examHistory.push(examResult);
    localStorage.setItem('examHistory', JSON.stringify(examHistory));
}

/**
 * Show Results Screen
 */
function showResultsScreen(results, certificateCode) {
    // Update results display
    document.getElementById('total-answered').textContent = results.totalQuestions;
    document.getElementById('correct-answers').textContent = results.correct;
    document.getElementById('wrong-answers').textContent = results.wrong + results.unanswered;
    document.getElementById('exam-score').textContent = results.score;
    
    // Store results for certificate
    localStorage.setItem('currentResults', JSON.stringify(results));
    localStorage.setItem('certificateCode', certificateCode);
    
    // Show results screen
    showScreen('results-screen');
    
    // Setup results buttons
    setupResultsButtons();
}

/**
 * Setup Results Buttons
 */
function setupResultsButtons() {
    const printCertificateBtn = document.getElementById('print-certificate-btn');
    const retakeExamBtn = document.getElementById('retake-exam-btn');
    
    printCertificateBtn.addEventListener('click', function() {
        showCertificateScreen();
    });
    
    retakeExamBtn.addEventListener('click', function() {
        showScreen('exam-selection-screen');
    });
}

/**
 * Show Certificate Screen
 */
function showCertificateScreen() {
    const results = JSON.parse(localStorage.getItem('currentResults'));
    const certificateCode = localStorage.getItem('certificateCode');
    const participantData = JSON.parse(localStorage.getItem('currentParticipant'));
    
    // Update certificate content
    document.getElementById('certificate-name').textContent = participantData.fullname;
    document.getElementById('certificate-score').textContent = results.score;
    document.getElementById('certificate-code').textContent = certificateCode;
    
    // Set current date
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('certificate-date').textContent = now.toLocaleDateString('id-ID', options);
    
    // Set chairman name from admin settings or default
    const chairmanName = localStorage.getItem('chairmanName') || 'Moh. Nuril Hudha, S.Pd., M.Si.';
    document.getElementById('certificate-chairman').textContent = chairmanName;
    
    // Set motivation message based on score
    setMotivationMessage(results.score);
    
    // Show certificate screen
    showScreen('certificate-screen');
    
    // Play applause sound
    playApplauseSound();
    
    // Setup certificate buttons
    setupCertificateButtons();
}

/**
 * Set Motivation Message
 */
function setMotivationMessage(score) {
    const motivationMessages = JSON.parse(localStorage.getItem('motivationMessages')) || [
        { minScore: 0, maxScore: 50, message: 'Terus berusaha dan tingkatkan lagi pemahaman Anda. Setiap kegagalan adalah langkah menuju kesuksesan.' },
        { minScore: 51, maxScore: 70, message: 'Hasil yang cukup baik. Pertahankan dan terus tingkatkan kemampuan Anda.' },
        { minScore: 71, maxScore: 85, message: 'Hasil yang sangat baik! Anda telah menguasai sebagian besar materi.' },
        { minScore: 86, maxScore: 100, message: 'Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.' }
    ];
    
    const motivation = motivationMessages.find(m => 
        score >= m.minScore && score <= m.maxScore
    );
    
    document.getElementById('certificate-motivation').textContent = 
        motivation ? motivation.message : '';
}

/**
 * Play Applause Sound
 */
function playApplauseSound() {
    const applauseAudio = document.getElementById('applause-audio');
    if (applauseAudio) {
        applauseAudio.currentTime = 0;
        applauseAudio.play().catch(e => console.log('Applause audio error:', e));
    }
}

/**
 * Setup Certificate Buttons
 */
function setupCertificateButtons() {
    const backToResultsBtn = document.getElementById('back-to-results-btn');
    const printBtn = document.getElementById('print-btn');
    
    backToResultsBtn.addEventListener('click', function() {
        showScreen('results-screen');
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
}

/**
 * Shuffle Array (for randomizing questions)
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Ekspos fungsi yang diperlukan
window.initializeExam = initializeExam;
