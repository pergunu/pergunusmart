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
    // Status initialization
    const initStatus = {
        particles: false,
        audio: false,
        questions: false
    };

    // Check particles initialization
    if (document.getElementById('particles-js')) {
        initStatus.particles = true;
    }

    // Check audio initialization
    if (typeof Audio !== 'undefined') {
        initStatus.audio = true;
    }

    // Check questions initialization
    if (questions && questions.length > 0) {
        initStatus.questions = true;
    }

    // Show initialization status
    showInitStatus(initStatus);
    
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
    
    // Subject buttons in participant form
    document.querySelectorAll('#student-fields .subject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#student-fields .subject-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            selectedSubject = this.dataset.subject;
        });
    });

    document.querySelectorAll('#general-fields .subject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#general-fields .subject-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            selectedSubject = this.dataset.subject;
            
            // Show CPNS license if needed
            if (selectedSubject === 'cpns') {
                cpnsLicense.style.display = 'block';
            } else {
                cpnsLicense.style.display = 'none';
            }
        });
    });

    // Get location functionality
    document.getElementById('get-location')?.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    document.getElementById('address').value = `Lat: ${lat}, Lng: ${lng}`;
                },
                error => {
                    alert('Tidak dapat mendapatkan lokasi: ' + error.message);
                }
            );
        } else {
            alert('Browser tidak mendukung geolocation.');
        }
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

    // Initialize admin panel
    initAdminPanel();
}

// Admin Panel Initialization
function initAdminPanel() {
    // Update setting-group untuk toggle ujian
    const settingGroup = document.querySelector('.toggle-group');
    if (settingGroup) {
        settingGroup.innerHTML = `
            <label class="toggle-label">
                <input type="checkbox" id="toggle-agama" checked> AGAMA
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-ppkn" checked> PPKN
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-sejarah" checked> SEJARAH
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-ipa" checked> IPA
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-ips" checked> IPS
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-matematika" checked> MATEMATIKA
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-indonesia" checked> BAHASA INDONESIA
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-inggris" checked> BAHASA INGGRIS
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-extra" checked> MATERI EXTRA
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-khusus" checked> MATERI KHUSUS
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-logika" checked> UJIAN LOGIKA
            </label>
            <label class="toggle-label">
                <input type="checkbox" id="toggle-cpns" checked> UJIAN CPNS/P3K
            </label>
        `;
    }

    // Update question-count options
    const questionCountSelect = document.getElementById('question-count');
    if (questionCountSelect) {
        questionCountSelect.innerHTML = '';
        [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150].forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.textContent = num;
            if (num === 10) option.selected = true;
            questionCountSelect.appendChild(option);
        });
    }

    // Add link management to admin panel
    const adminSettings = document.querySelector('.admin-settings');
    if (adminSettings) {
        const linkManagement = document.createElement('div');
        linkManagement.className = 'setting-group';
        linkManagement.innerHTML = `
            <label>Daftar Link (satu link per baris):</label>
            <textarea id="link-list" rows="5">http://is.gd/pergunusmart</textarea>
            <button id="save-links" class="btn-small">Simpan Link</button>
        `;
        adminSettings.appendChild(linkManagement);

        // Add event listener for saving links
        document.getElementById('save-links')?.addEventListener('click', function() {
            const links = document.getElementById('link-list').value.trim();
            if (links) {
                alert('Daftar link berhasil disimpan!');
            } else {
                alert('Masukkan daftar link terlebih dahulu.');
            }
        });
    }
}

// Show initialization status
function showInitStatus(status) {
    const statusContainer = document.createElement('div');
    statusContainer.className = 'init-status';
    statusContainer.style.position = 'fixed';
    statusContainer.style.bottom = '10px';
    statusContainer.style.left = '10px';
    statusContainer.style.zIndex = '1000';
    statusContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
    statusContainer.style.padding = '10px';
    statusContainer.style.borderRadius = '5px';
    statusContainer.style.color = 'white';
    statusContainer.style.fontFamily = 'Arial, sans-serif';
    statusContainer.style.fontSize = '12px';

    let statusHTML = '<h3 style="margin:0 0 5px 0;">Status Sistem:</h3>';
    statusHTML += `<p style="margin:3px 0;"><span class="status-icon">${status.particles ? '✔️' : '❌'}</span> Particles.js</p>`;
    statusHTML += `<p style="margin:3px 0;"><span class="status-icon">${status.audio ? '✔️' : '❌'}</span> Sistem Audio</p>`;
    statusHTML += `<p style="margin:3px 0;"><span class="status-icon">${status.questions ? '✔️' : '❌'}</span> Bank Soal</p>`;

    statusContainer.innerHTML = statusHTML;
    document.body.appendChild(statusContainer);

    // Hide after 5 seconds
    setTimeout(() => {
        statusContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(statusContainer);
        }, 500);
    }, 5000);
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
    let isValid = true;
    const requiredFields = [
        { field: participantData.fullname, message: 'Nama lengkap harus diisi' },
        { field: participantData.purpose, message: 'Tujuan ujian harus dipilih' }
    ];
    
    if (isStudent) {
        requiredFields.push(
            { field: participantData.school, message: 'Nama sekolah harus diisi' },
            { field: participantData.nis, message: 'NIS harus diisi' }
        );
    } else {
        requiredFields.push(
            { field: participantData.address, message: 'Alamat harus diisi' },
            { field: participantData.whatsapp, message: 'Nomor WhatsApp harus diisi' },
            { field: participantData.email, message: 'Email harus diisi' }
        );
    }
    
    for (const { field, message } of requiredFields) {
        if (!field) {
            alert(message);
            isValid = false;
            break;
        }
    }
    
    if (!isValid) return;
    
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
    const currentCode = document.getElementById('current-exam-code') ? document.getElementById('current-exam-code').value : DEFAULT_CPNS_CODE;
    
    if (code === currentCode) {
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
    const cpnsVerified = selectedSubject === 'cpns' ? cpnsCodeInput.value.trim() === (document.getElementById('current-exam-code') ? document.getElementById('current-exam-code').value : DEFAULT_CPNS_CODE) : true;
    
    startExamBtn.disabled = !(levelSelected && subjectSelected && cpnsVerified);
}

// Start exam
function startExam() {
    playButtonSound();
    
    // Filter questions based on selection
    let filteredQuestions = questions.filter(q => {
        if (isStudent) {
            return q.category === selectedSubject && q.level === participantData.level.toLowerCase();
        } else {
            return q.category === selectedSubject && q.level === 'umum';
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
    const links = document.getElementById('link-list') ? document.getElementById('link-list').value.trim().split('\n') : ['http://is.gd/pergunusmart'];
    let linksHtml = '<h3>Daftar Link:</h3><ul>';
    
    links.forEach(link => {
        if (link.trim()) {
            linksHtml += `<li><a href="${link.trim()}" target="_blank">${link.trim()}</a></li>`;
        }
    });
    
    linksHtml += '</ul>';
    alertModal('Daftar Link', linksHtml);
}

// Alert modal function
function alertModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <div class="modal-body">${content}</div>
            <button class="btn-gradient modal-close">Tutup</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
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

// Global error handling
window.addEventListener('error', function(event) {
    console.error('Error:', event.message, 'in', event.filename, 'line:', event.lineno);
    
    // Show user-friendly error notification
    const errorNotification = document.createElement('div');
    errorNotification.className = 'error-notification';
    errorNotification.innerHTML = `
        <div class="error-content">
            <span class="close-error">&times;</span>
            <h3>Terjadi Kesalahan</h3>
            <p>Maaf, terjadi masalah teknis. Silakan muat ulang halaman.</p>
            <p><small>${event.message}</small></p>
            <button class="btn-small" onclick="window.location.reload()">Muat Ulang</button>
        </div>
    `;
    
    document.body.appendChild(errorNotification);
    
    // Handler for close button
    errorNotification.querySelector('.close-error').addEventListener('click', function() {
        document.body.removeChild(errorNotification);
    });
});

// CSS for error notification
const errorStyle = document.createElement('style');
errorStyle.textContent = `
.error-notification {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}
.error-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 80%;
    position: relative;
}
.close-error {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
}
`;
document.head.appendChild(errorStyle);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
