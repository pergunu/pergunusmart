// DOM Elements
const screens = document.querySelectorAll('.screen');
const examCodeInput = document.getElementById('exam-code');
const enterBtn = document.getElementById('enter-btn');
const agreeTermsCheckbox = document.getElementById('agree-terms');
const continueBtn = document.getElementById('continue-btn');
const participantForm = document.getElementById('participant-data');
const studentRadio = document.getElementById('student');
const generalRadio = document.getElementById('general');
const studentFields = document.getElementById('student-fields');
const generalFields = document.getElementById('general-fields');
const startExamBtn = document.getElementById('start-exam-btn');
const examScreen = document.getElementById('exam-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const timerSpan = document.getElementById('timer');
const finishExamBtn = document.getElementById('finish-exam-btn');
const skipQuestionBtn = document.getElementById('skip-question-btn');
const unansweredBtn = document.getElementById('unanswered-btn');
const answerExplanation = document.getElementById('answer-explanation');
const explanationText = document.getElementById('explanation-text');
const resultsScreen = document.getElementById('results-screen');
const scorePercentage = document.getElementById('score-percentage');
const totalAnswered = document.getElementById('total-answered');
const correctAnswers = document.getElementById('correct-answers');
const wrongAnswers = document.getElementById('wrong-answers');
const viewCertificateBtn = document.getElementById('view-certificate-btn');
const retakeExamBtn = document.getElementById('retake-exam-btn');
const certificateScreen = document.getElementById('certificate-screen');
const certName = document.getElementById('cert-name');
const certScore = document.getElementById('cert-score');
const certMotivation = document.getElementById('cert-motivation');
const certPeriod = document.getElementById('cert-period');
const certificateCode = document.getElementById('certificate-code');
const printCertificateBtn = document.getElementById('print-certificate-btn');
const backToResultsBtn = document.getElementById('back-to-results-btn');
const sdLevels = document.getElementById('sd-levels');
const smpLevels = document.getElementById('smp-levels');
const smaLevels = document.getElementById('sma-levels');
const studentLevels = document.getElementById('student-levels');
const generalLevels = document.getElementById('general-levels');
const cpnsLicense = document.getElementById('cpns-license');
const verifyCpnsBtn = document.getElementById('verify-cpns');
const cpnsCodeInput = document.getElementById('cpns-code');
const timeWarning = document.getElementById('time-warning');
const adminPanelBtn = document.getElementById('admin-panel-btn');
const questionBankBtn = document.getElementById('question-bank-btn');
const shareBtn = document.getElementById('share-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');
const goToBtn = document.getElementById('go-to-btn');
const floatingButtons = document.querySelectorAll('.floating-btn');
const adminPanel = document.getElementById('admin-panel');
const questionBank = document.getElementById('question-bank');
const openingAudio = document.getElementById('opening-audio');
const correctAudio = document.getElementById('correct-audio');
const wrongAudio = document.getElementById('wrong-audio');
const buttonAudio = document.getElementById('button-audio');
const applauseAudio = document.getElementById('applause-audio');
const backgroundAudio = document.getElementById('background-audio');

// Default codes
const DEFAULT_LOGIN_CODE = '12345';
const DEFAULT_CPNS_CODE = 'OPENLOCK-1926';
const DEFAULT_ADMIN_CODE = '65614222';
const DEFAULT_QUESTION_BANK_CODE = 'OPENLOCK-1926';

// Exam variables
let currentScreen = 0;
let questions = [];
let currentQuestionIndex = 0;
let answeredQuestions = [];
let correctCount = 0;
let wrongCount = 0;
let unansweredCount = 0;
let timerInterval;
let examDuration = 120; // in minutes
let remainingTime = examDuration * 60; // in seconds
let selectedSubject = '';
let selectedLevel = '';
let participantData = {};
let isStudent = true;

// Initialize the app
function init() {
    // Set default exam code for development
    examCodeInput.value = DEFAULT_LOGIN_CODE;
    
    // Set current date for certificate
    const now = new Date();
    const formattedDate = `${now.getDate()}${now.getMonth()+1}${now.getFullYear()}`;
    certPeriod.textContent = `Ditetapkan di: Situbondo, ${formatDate(now)}`;
    
    // Event listeners
    enterBtn.addEventListener('click', validateExamCode);
    agreeTermsCheckbox.addEventListener('change', toggleContinueButton);
    continueBtn.addEventListener('click', goToNextScreen);
    participantForm.addEventListener('submit', saveParticipantData);
    studentRadio.addEventListener('change', toggleParticipantFields);
    generalRadio.addEventListener('change', toggleParticipantFields);
    startExamBtn.addEventListener('click', startExam);
    finishExamBtn.addEventListener('click', finishExam);
    skipQuestionBtn.addEventListener('click', skipQuestion);
    unansweredBtn.addEventListener('click', showUnansweredQuestions);
    viewCertificateBtn.addEventListener('click', showCertificate);
    retakeExamBtn.addEventListener('click', retakeExam);
    printCertificateBtn.addEventListener('click', printCertificate);
    backToResultsBtn.addEventListener('click', goBackToResults);
    verifyCpnsBtn.addEventListener('click', verifyCpnsCode);
    adminPanelBtn.addEventListener('click', toggleAdminPanel);
    questionBankBtn.addEventListener('click', toggleQuestionBank);
    shareBtn.addEventListener('click', shareWebsite);
    whatsappBtn.addEventListener('click', contactAdmin);
    goToBtn.addEventListener('click', showGoToLinks);
    
    // Level selection buttons
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', selectLevel);
    });
    
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', selectSubject);
    });
    
    // Floating buttons
    floatingButtons.forEach(btn => {
        btn.addEventListener('click', playButtonSound);
    });
    
    // Show first screen
    showScreen(0);
    
    // Load questions (in a real app, this would be from a server)
    loadSampleQuestions();
    
    // Start background music
    backgroundAudio.volume = 0.3;
    backgroundAudio.play();
}

// Show screen by index
function showScreen(index) {
    screens.forEach((screen, i) => {
        screen.classList.toggle('active', i === index);
    });
    currentScreen = index;
    
    // Special cases
    if (index === 4) { // Exam screen
        startTimer();
    }
    
    if (index === 6) { // Certificate screen
        generateCertificate();
        applauseAudio.play();
    }
}

// Validate exam code
function validateExamCode() {
    playButtonSound();
    const code = examCodeInput.value.trim();
    
    if (code === DEFAULT_LOGIN_CODE) {
        showScreen(1);
    } else {
        alert('Kode ujian salah. Silakan coba lagi.');
        examCodeInput.focus();
    }
}

// Toggle continue button based on terms agreement
function toggleContinueButton() {
    continueBtn.disabled = !agreeTermsCheckbox.checked;
}

// Go to next screen
function goToNextScreen() {
    playButtonSound();
    showScreen(currentScreen + 1);
}

// Toggle participant fields based on status
function toggleParticipantFields() {
    isStudent = studentRadio.checked;
    
    if (isStudent) {
        studentFields.style.display = 'block';
        generalFields.style.display = 'none';
    } else {
        studentFields.style.display = 'none';
        generalFields.style.display = 'block';
    }
}

// Save participant data
function saveParticipantData(e) {
    e.preventDefault();
    playButtonSound();
    
    // Get form values
    participantData = {
        fullname: document.getElementById('fullname').value.trim(),
        status: isStudent ? 'pelajar' : 'umum',
        purpose: isStudent ? document.getElementById('student-purpose').value : document.getElementById('general-purpose').value,
        level: isStudent ? document.querySelector('input[name="school-level"]:checked').value : 'umum',
        classLevel: ''
    };
    
    if (isStudent) {
        participantData.school = document.getElementById('school').value.trim();
        participantData.nis = document.getElementById('nis').value.trim();
    } else {
        participantData.address = document.getElementById('address').value.trim();
        participantData.whatsapp = document.getElementById('whatsapp').value.trim();
        participantData.email = document.getElementById('email').value.trim();
    }
    
    // Validate
    if (!participantData.fullname) {
        alert('Nama lengkap harus diisi');
        return;
    }
    
    if (isStudent && (!participantData.school || !participantData.nis)) {
        alert('Data sekolah harus lengkap');
        return;
    }
    
    if (!isStudent && (!participantData.address || !participantData.whatsapp || !participantData.email)) {
        alert('Data umum harus lengkap');
        return;
    }
    
    // Go to next screen
    showScreen(3);
    
    // Show appropriate level options
    if (isStudent) {
        studentLevels.style.display = 'block';
        generalLevels.style.display = 'none';
        
        if (participantData.level === 'SD') {
            sdLevels.style.display = 'flex';
            smpLevels.style.display = 'none';
            smaLevels.style.display = 'none';
        } else if (participantData.level === 'SMP') {
            sdLevels.style.display = 'none';
            smpLevels.style.display = 'flex';
            smaLevels.style.display = 'none';
        } else {
            sdLevels.style.display = 'none';
            smpLevels.style.display = 'none';
            smaLevels.style.display = 'flex';
        }
    } else {
        studentLevels.style.display = 'none';
        generalLevels.style.display = 'block';
    }
}

// Select level
function selectLevel(e) {
    playButtonSound();
    const level = e.target.dataset.level;
    participantData.classLevel = level;
    
    // Update UI
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    checkExamReady();
}

// Select subject
function selectSubject(e) {
    playButtonSound();
    selectedSubject = e.target.dataset.subject;
    
    // Update UI
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Show CPNS license if needed
    if (selectedSubject === 'cpns') {
        cpnsLicense.style.display = 'block';
        startExamBtn.disabled = true;
    } else {
        cpnsLicense.style.display = 'none';
        checkExamReady();
    }
}

// Verify CPNS code
function verifyCpnsCode() {
    playButtonSound();
    const code = cpnsCodeInput.value.trim();
    
    if (code === DEFAULT_CPNS_CODE) {
        checkExamReady();
    } else {
        alert('Kode lisensi salah. Silakan coba lagi.');
        cpnsCodeInput.focus();
    }
}

// Check if exam is ready to start
function checkExamReady() {
    const levelSelected = isStudent ? participantData.classLevel : true;
    const subjectSelected = selectedSubject !== '';
    const cpnsVerified = selectedSubject === 'cpns' ? cpnsCodeInput.value.trim() === DEFAULT_CPNS_CODE : true;
    
    startExamBtn.disabled = !(levelSelected && subjectSelected && cpnsVerified);
}

// Start exam
function startExam() {
    playButtonSound();
    
    // Filter questions based on selection
    let filteredQuestions = questions.filter(q => {
        if (isStudent) {
            return q.category === selectedSubject && q.level === participantData.level;
        } else {
            return q.category === selectedSubject;
        }
    });
    
    // Randomize questions if setting is enabled
    if (true) { // In a real app, check admin setting
        filteredQuestions = shuffleArray(filteredQuestions);
    }
    
    // Limit number of questions
    const questionCount = 10; // In a real app, get from admin setting
    questions = filteredQuestions.slice(0, questionCount);
    
    // Reset exam variables
    currentQuestionIndex = 0;
    answeredQuestions = [];
    correctCount = 0;
    wrongCount = 0;
    unansweredCount = questions.length;
    remainingTime = examDuration * 60;
    
    // Update UI
    totalQuestionsSpan.textContent = questions.length;
    
    // Show exam screen
    showScreen(4);
    displayQuestion();
}

// Display current question
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishExam();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update UI
    questionText.textContent = question.text;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    answerExplanation.style.display = 'none';
    
    // Add new options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.dataset.index = index;
        
        const optionLetter = document.createElement('span');
        optionLetter.className = 'option-letter';
        optionLetter.textContent = String.fromCharCode(65 + index) + '.';
        
        const optionText = document.createElement('span');
        optionText.className = 'option-text';
        optionText.textContent = option.text;
        
        optionElement.appendChild(optionLetter);
        optionElement.appendChild(optionText);
        
        optionElement.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionElement);
    });
    
    // Check if already answered
    const answeredQuestion = answeredQuestions.find(aq => aq.index === currentQuestionIndex);
    if (answeredQuestion) {
        showAnswerFeedback(answeredQuestion);
    }
}

// Select answer
function selectAnswer(optionIndex) {
    const question = questions[currentQuestionIndex];
    const isCorrect = optionIndex === question.correctAnswer;
    
    // Record answer
    answeredQuestions.push({
        index: currentQuestionIndex,
        option: optionIndex,
        isCorrect: isCorrect
    });
    
    // Update counters
    if (isCorrect) {
        correctCount++;
        playCorrectSound();
    } else {
        wrongCount++;
        playWrongSound();
    }
    unansweredCount--;
    
    // Show feedback
    showAnswerFeedback({
        index: currentQuestionIndex,
        option: optionIndex,
        isCorrect: isCorrect
    });
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500);
}

// Show answer feedback
function showAnswerFeedback(answer) {
    const question = questions[answer.index];
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        if (index === answer.option) {
            option.classList.add(answer.isCorrect ? 'correct' : 'incorrect');
        } else if (index === question.correctAnswer) {
            option.classList.add('correct');
        }
    });
    
    // Show explanation
    explanationText.textContent = question.explanation;
    answerExplanation.style.display = 'block';
}

// Skip question
function skipQuestion() {
    playButtonSound();
    currentQuestionIndex++;
    displayQuestion();
}

// Show unanswered questions
function showUnansweredQuestions() {
    playButtonSound();
    const unanswered = [];
    
    for (let i = 0; i < questions.length; i++) {
        if (!answeredQuestions.some(aq => aq.index === i)) {
            unanswered.push(i);
        }
    }
    
    if (unanswered.length > 0) {
        currentQuestionIndex = unanswered[0];
        displayQuestion();
    } else {
        alert('Semua soal sudah dijawab.');
    }
}

// Start timer
function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        remainingTime--;
        
        // Update timer display
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timerSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Time warning
        if (remainingTime === 600) { // 10 minutes
            timerSpan.classList.add('warning');
            timeWarning.style.display = 'block';
        }
        
        if (remainingTime === 60) { // 1 minute
            timeWarning.style.display = 'none';
        }
        
        // End exam if time is up
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            finishExam();
        }
    }, 1000);
}

// Finish exam
function finishExam() {
    clearInterval(timerInterval);
    
    // Calculate score
    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Update results screen
    scorePercentage.textContent = score;
    totalAnswered.textContent = totalQuestions;
    correctAnswers.textContent = correctCount;
    wrongAnswers.textContent = wrongCount;
    
    // Show results screen
    showScreen(5);
}

// Show certificate
function showCertificate() {
    playButtonSound();
    showScreen(6);
}

// Generate certificate data
function generateCertificate() {
    // Participant name
    certName.textContent = participantData.fullname
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    // Score
    const score = Math.round((correctCount / questions.length) * 100);
    certScore.textContent = score;
    
    // Motivation text based on score
    let motivation = '';
    if (score >= 90) {
        motivation = 'Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.';
    } else if (score >= 70) {
        motivation = 'Bagus! Anda telah menunjukkan pemahaman yang baik. Tingkatkan terus kemampuan Anda.';
    } else if (score >= 50) {
        motivation = 'Cukup baik. Terus belajar untuk hasil yang lebih maksimal.';
    } else {
        motivation = 'Anda perlu lebih banyak belajar lagi. Jangan menyerah!';
    }
    certMotivation.textContent = motivation;
    
    // Certificate code
    const now = new Date();
    const randomCode = generateRandomCode();
    certificateCode.textContent = `${participantData.fullname.toUpperCase().replace(/ /g, '')}/${participantData.status.toUpperCase()}/${participantData.level.toUpperCase()}/${selectedSubject.toUpperCase()}/${formatDate(now, true)}/${randomCode}/PERGUNU-STB`;
}

// Retake exam
function retakeExam() {
    playButtonSound();
    showScreen(3);
}

// Print certificate
function printCertificate() {
    playButtonSound();
    window.print();
}

// Go back to results
function goBackToResults() {
    playButtonSound();
    showScreen(5);
}

// Toggle admin panel
function toggleAdminPanel() {
    playButtonSound();
    const isAdminPanelVisible = adminPanel.classList.contains('active');
    
    if (isAdminPanelVisible) {
        adminPanel.classList.remove('active');
    } else {
        // Prompt for admin code
        const code = prompt('Masukkan Kode Admin:');
        
        if (code === DEFAULT_ADMIN_CODE) {
            adminPanel.classList.add('active');
            questionBank.classList.remove('active');
        } else {
            alert('Kode admin salah.');
        }
    }
}

// Toggle question bank
function toggleQuestionBank() {
    playButtonSound();
    const isQuestionBankVisible = questionBank.classList.contains('active');
    
    if (isQuestionBankVisible) {
        questionBank.classList.remove('active');
    } else {
        // Prompt for question bank code
        const code = prompt('Masukkan Kode Bank Soal:');
        
        if (code === DEFAULT_QUESTION_BANK_CODE) {
            questionBank.classList.add('active');
            adminPanel.classList.remove('active');
            document.getElementById('bank-content').style.display = 'block';
        } else {
            alert('Kode bank soal salah.');
        }
    }
}

// Share website
function shareWebsite() {
    playButtonSound();
    if (navigator.share) {
        navigator.share({
            title: 'Ujian Online PERGUNU Situbondo',
            text: 'Ikuti ujian online dari PERGUNU Situbondo sekarang!',
            url: 'http://is.gd/pergunusmart'
        }).catch(err => {
            console.log('Error sharing:', err);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        prompt('Salin link berikut untuk berbagi:', 'http://is.gd/pergunusmart');
    }
}

// Contact admin via WhatsApp
function contactAdmin() {
    playButtonSound();
    const message = encodeURIComponent('Assalamualaikum mas admin, saya mau tanya sesuatu nih...');
    window.open(`https://wa.me/6285647709114?text=${message}`, '_blank');
}

// Show Go To links
function showGoToLinks() {
    playButtonSound();
    alert('Daftar link akan ditampilkan di sini. Admin dapat mengedit daftar ini melalui panel admin.');
}

// Play button sound
function playButtonSound() {
    buttonAudio.currentTime = 0;
    buttonAudio.play();
}

// Play correct answer sound
function playCorrectSound() {
    correctAudio.currentTime = 0;
    correctAudio.play();
}

// Play wrong answer sound
function playWrongSound() {
    wrongAudio.currentTime = 0;
    wrongAudio.play();
}

// Format date for certificate
function formatDate(date, forCode = false) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    if (forCode) {
        return `${day < 10 ? '0' : ''}${day}${month < 10 ? '0' : ''}${month}${year}`;
    } else {
        return `${day} ${getMonthName(month)} ${year}`;
    }
}

// Get month name
function getMonthName(month) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month - 1];
}

// Generate random code
function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    result += '-';
    
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

// Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Load sample questions (in a real app, this would be from a server)
function loadSampleQuestions() {
    questions = [
        {
            category: 'agama',
            level: 'SD',
            text: 'Apa nama kitab suci umat Islam?',
            options: [
                { text: 'Al-Quran' },
                { text: 'Alkitab' },
                { text: 'Weda' },
                { text: 'Tripitaka' }
            ],
            correctAnswer: 0,
            explanation: 'Kitab suci umat Islam adalah Al-Quran yang diturunkan kepada Nabi Muhammad SAW.'
        },
        {
            category: 'ppkn',
            level: 'SMP',
            text: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 pada alinea keberapa?',
            options: [
                { text: 'Pertama' },
                { text: 'Kedua' },
                { text: 'Ketiga' },
                { text: 'Keempat' }
            ],
            correctAnswer: 3,
            explanation: 'Pancasila tercantum dalam Pembukaan UUD 1945 alinea keempat setelah kalimat "maka disusunlah Kemerdekaan Kebangsaan Indonesia itu dalam suatu Undang-Undang Dasar Negara Indonesia".'
        },
        {
            category: 'logika',
            level: 'umum',
            text: 'Jika semua A adalah B dan semua B adalah C, maka:',
            options: [
                { text: 'Semua A adalah C' },
                { text: 'Beberapa A adalah C' },
                { text: 'Semua C adalah A' },
                { text: 'Tidak ada yang benar' }
            ],
            correctAnswer: 0,
            explanation: 'Jika semua A adalah B dan semua B adalah C, maka dapat disimpulkan bahwa semua A adalah C.'
        }
    ];
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
