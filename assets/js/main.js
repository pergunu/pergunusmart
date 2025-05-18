// PERGUNU SMART - REVISED MAIN JS
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app with enhanced features
  initApp();
});

// Enhanced App State with additional properties
const appState = {
  currentScreen: 'welcome',
  participantData: {},
  examData: {},
  questions: [],
  currentQuestionIndex: 0,
  answeredQuestions: 0,
  correctCount: 0,
  wrongCount: 0,
  timerInterval: null,
  timeLeft: 90 * 60,
  examStarted: false,
  isMuted: false,
  currentVolume: 0.7,
  audioContext: null,
  particlesInitialized: false
};

// Default codes with enhanced security
const DEFAULT_CODES = {
  LOGIN: '12345',
  CPNS: 'CPNSP3K-OPENLOCK',
  BANK_SOAL: 'BANKSOAL-OPENLOCK',
  ADMIN: '65614222'
};

// Enhanced motivational messages
const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 40, message: "Masih ada ruang untuk perbaikan. Teruslah belajar dan berlatih!" },
  { min: 41, max: 60, message: "Hasil yang cukup baik. Tingkatkan lagi pemahaman Anda!" },
  { min: 61, max: 75, message: "Kerja bagus! Anda telah menunjukkan pemahaman yang baik." },
  { min: 76, max: 85, message: "Prestasi yang sangat baik! Pertahankan semangat belajar Anda." },
  { min: 86, max: 95, message: "Luar biasa! Anda benar-benar menguasai materi ini." },
  { min: 96, max: 100, message: "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini." }
];

// Initialize the app with all enhancements
function initApp() {
  try {
    // Setup audio system
    initAudioSystem();
    
    // Setup floating buttons
    initFloatingButtons();
    
    // Setup particles animation
    initParticles();
    
    // Load questions
    loadQuestions();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Play opening audio
    playAudio('openingAudio');
    
    // Check for admin access
    if (window.location.hash === '#admin') {
      toggleAdminPanel();
    }
    
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Terjadi kesalahan saat memulai aplikasi');
  }
}

// Initialize audio system with better error handling
function initAudioSystem() {
  try {
    // Create audio context for better mobile compatibility
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    appState.audioContext = new AudioContext();
    
    // Resume audio context on first user interaction
    document.addEventListener('click', function initAudio() {
      if (appState.audioContext.state === 'suspended') {
        appState.audioContext.resume();
      }
      document.removeEventListener('click', initAudio);
    }, { once: true });
    
    // Set initial volume
    setAudioVolume(appState.currentVolume);
    
  } catch (error) {
    console.error('Audio system initialization error:', error);
  }
}

// Initialize floating buttons with proper functionality
function initFloatingButtons() {
  const buttons = [
    { id: 'adminBtn', handler: toggleAdminPanel },
    { id: 'bankSoalBtn', handler: toggleBankPanel },
    { id: 'goToBtn', handler: toggleGoToPanel },
    { id: 'shareBtn', handler: toggleSharePanel },
    { id: 'whatsappBtn', handler: openWhatsApp }
  ];
  
  buttons.forEach(button => {
    const btn = document.getElementById(button.id);
    if (btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        playAudio('buttonAudio');
        button.handler();
      });
    }
  });
  
  // Volume control buttons
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  
  if (muteBtn) {
    muteBtn.addEventListener('click', function() {
      playAudio('buttonAudio');
      toggleMute();
    });
  }
  
  if (volumeSlider) {
    volumeSlider.addEventListener('input', updateVolume);
  }
}

// Initialize particles.js with gradient background
function initParticles() {
  if (typeof particlesJS !== 'undefined' && !appState.particlesInitialized) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 1, direction: "none", random: true }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
    appState.particlesInitialized = true;
    
    // Add gradient background
    const canvas = document.querySelector('#particles-js canvas');
    if (canvas) {
      canvas.style.background = 'linear-gradient(135deg, #FF8C00 70%, #90EE90 30%)';
    }
  }
}

// Enhanced audio functions
function playAudio(audioId) {
  if (appState.isMuted) return;
  
  const audio = document.getElementById(audioId);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play error:', e));
  }
}

function setAudioVolume(volume) {
  const audioElements = [
    'openingAudio', 'buttonAudio', 'correctAudio', 
    'wrongAudio', 'applauseAudio', 'bgAudio'
  ];
  
  audioElements.forEach(id => {
    const audio = document.getElementById(id);
    if (audio) audio.volume = volume;
  });
  
  appState.currentVolume = volume;
  
  // Update UI
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) {
    muteBtn.innerHTML = `<i class="fas fa-volume-${volume === 0 ? 'mute' : 'up'}"></i>`;
  }
  
  if (volume === 0) {
    appState.isMuted = true;
  } else {
    appState.isMuted = false;
  }
}

function toggleMute() {
  appState.isMuted = !appState.isMuted;
  setAudioVolume(appState.isMuted ? 0 : appState.currentVolume);
}

function updateVolume() {
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    const newVolume = parseFloat(volumeSlider.value);
    setAudioVolume(newVolume);
  }
}

// Panel toggle functions
function toggleAdminPanel() {
  const adminCode = prompt('Masukkan Kode Admin:');
  if (adminCode === DEFAULT_CODES.ADMIN) {
    document.getElementById('adminPanel').style.display = 'flex';
    playAudio('buttonAudio');
  } else if (adminCode) {
    alert('Kode Admin salah');
    playAudio('wrongAudio');
  }
}

function toggleBankPanel() {
  const bankCode = prompt('Masukkan Kode Bank Soal:');
  if (bankCode === DEFAULT_CODES.BANK_SOAL) {
    document.getElementById('bankSoalPanel').style.display = 'flex';
    playAudio('buttonAudio');
  } else if (bankCode) {
    alert('Kode Bank Soal salah');
    playAudio('wrongAudio');
  }
}

function toggleGoToPanel() {
  const panel = document.getElementById('goToPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  document.getElementById('sharePanel').style.display = 'none';
  playAudio('buttonAudio');
}

function toggleSharePanel() {
  const panel = document.getElementById('sharePanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  document.getElementById('goToPanel').style.display = 'none';
  document.getElementById('shareLink').value = window.location.href;
  playAudio('buttonAudio');
}

function openWhatsApp() {
  window.open('https://wa.me/6285647709114?text=Assalamualaikum%20mas%20admin,%20saya%20mau%20tanya%20sesuatu%20nih...', '_blank');
  playAudio('buttonAudio');
}

// Enhanced login handling
function handleLogin() {
  const loginCodeInput = document.getElementById('loginCode');
  const loginError = document.getElementById('loginError');
  
  playAudio('buttonAudio');
  
  if (loginCodeInput.value === DEFAULT_CODES.LOGIN) {
    loginError.textContent = '';
    showScreen('terms');
  } else {
    loginError.textContent = 'Kode Login salah. Silakan coba lagi.';
    loginCodeInput.focus();
    playAudio('wrongAudio');
    
    // Add shake animation
    loginCodeInput.classList.add('shake');
    setTimeout(() => {
      loginCodeInput.classList.remove('shake');
    }, 500);
  }
}

// Screen management
function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show requested screen
  const screen = document.getElementById(`${screenName}Screen`);
  if (screen) {
    screen.classList.add('active');
    appState.currentScreen = screenName;
    
    // Special handling for certain screens
    if (screenName === 'results') {
      generateCertificate();
    }
  }
}

// Certificate generation
function generateCertificate() {
  const score = Math.round((appState.correctCount / appState.questions.length) * 100);
  const now = new Date();
  
  // Generate certificate code
  const dateStr = `${now.getDate()}${now.getMonth()+1}${now.getFullYear()}`;
  const randomCode = Math.random().toString(36).substring(2,6).toUpperCase();
  
  let codeParts = [
    appState.participantData.fullName.replace(/\s+/g, '_').toUpperCase(),
    appState.participantData.status.toUpperCase(),
    appState.participantData.status === 'pelajar' ? appState.participantData.schoolLevel.toUpperCase() : '',
    appState.participantData.status === 'pelajar' ? appState.examData.subject.toUpperCase() : appState.examData.category.toUpperCase(),
    dateStr,
    `${randomCode}-${Math.random().toString(36).substring(2,5).toUpperCase()}`,
    'PERGUNU-STB'
  ];
  
  // Update certificate elements
  document.getElementById('certificateCode').textContent = codeParts.join('/');
  document.getElementById('certificateName').textContent = appState.participantData.fullName;
  
  // Set achievement text
  let achievementText = '';
  if (appState.participantData.status === 'pelajar') {
    achievementText = `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Ujian Pergunu Situbondo</strong>`;
  } else {
    achievementText = appState.examData.category === 'cpns' 
      ? `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Sketsa Ujian CPNS/P3K Pergunu Situbondo</strong>`
      : `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Tes Logika Pergunu Situbondo</strong>`;
  }
  
  document.getElementById('certificateAchievement').innerHTML = achievementText;
  document.getElementById('certificateScore').textContent = score;
  
  // Set motivational message
  const motivation = MOTIVATIONAL_MESSAGES.find(m => score >= m.min && score <= m.max);
  document.getElementById('certificateMotivation').textContent = motivation ? motivation.message : '';
  
  // Format date
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('certificateDate').textContent = `Ditetapkan di: Situbondo, ${now.toLocaleDateString('id-ID', options)}`;
  
  // Play applause sound
  playAudio('applauseAudio');
}

// Setup all event listeners
function setupEventListeners() {
  // Login screen
  document.getElementById('submitLogin').addEventListener('click', handleLogin);
  document.getElementById('loginCode').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  
  // Terms screen
  document.getElementById('agreeTerms').addEventListener('change', (e) => {
    document.getElementById('continueBtn').disabled = !e.target.checked;
    playAudio('buttonAudio');
  });
  document.getElementById('continueBtn').addEventListener('click', () => {
    playAudio('buttonAudio');
    showScreen('registration');
  });
  
  // Registration form
  document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener('change', handleStatusChange);
  });
  document.getElementById('participantForm').addEventListener('submit', handleRegistrationSubmit);
  
  // Exam selection
  document.querySelectorAll('.exam-option').forEach(option => {
    option.addEventListener('click', () => {
      appState.examData.level = option.dataset.level;
      playAudio('buttonAudio');
    });
  });
  
  // More event listeners...
}
    subjectOptions.forEach(option => {
        option.addEventListener('click', () => {
            examData.subject = option.dataset.subject;
            playButtonSound();
            startExam();
        });
    });
    
    generalOptions.forEach(option => {
        option.addEventListener('click', () => {
            examData.category = option.dataset.category;
            playButtonSound();
            
            if (examData.category === 'cpns') {
                cpnsLicenseContainer.style.display = 'block';
            } else {
                startExam();
            }
        });
    });
    
    submitLicenseBtn.addEventListener('click', handleLicenseSubmit);
    licenseCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLicenseSubmit();
    });
    
    // Exam screen
    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleAnswer(button.dataset.option));
    });
    
    nextQuestionBtn.addEventListener('click', goToNextQuestion);
    skipQuestionBtn.addEventListener('click', skipQuestion);
    unansweredBtn.addEventListener('click', showUnansweredQuestions);
    finishExamBtn.addEventListener('click', finishExam);
    
    // Results screen
    printCertificateBtn.addEventListener('click', printCertificate);
    retakeExamBtn.addEventListener('click', retakeExam);
    
    // Floating buttons
    shareBtn.addEventListener('click', toggleSharePanel);
    whatsappBtn.addEventListener('click', openWhatsApp);
    goToBtn.addEventListener('click', toggleGoToPanel);
    bankSoalBtn.addEventListener('click', toggleBankSoalPanel);
    adminBtn.addEventListener('click', toggleAdminPanel);
    
    // Admin panel
    closeAdminBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
        playButtonSound();
    });
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            adminTabs.forEach(t => t.classList.remove('active'));
            adminTabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}Tab`).classList.add('active');
            playButtonSound();
        });
    });
    
    // Bank soal panel
    closeBankBtn.addEventListener('click', () => {
        bankSoalPanel.style.display = 'none';
        playButtonSound();
    });
    
    bankTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            bankTabs.forEach(t => t.classList.remove('active'));
            bankTabContents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}Tab`).classList.add('active');
            playButtonSound();
        });
    });
    
    // Share panel
    closeShareBtn.addEventListener('click', () => {
        sharePanel.style.display = 'none';
        playButtonSound();
    });
    
    copyLinkBtn.addEventListener('click', copyShareLink);
    
    // Go to panel
    closeGoToBtn.addEventListener('click', () => {
        goToPanel.style.display = 'none';
        playButtonSound();
    });
}

// Handle login
function handleLogin() {
    playButtonSound();
    
    if (loginCodeInput.value === DEFAULT_LOGIN_CODE) {
        loginError.textContent = '';
        showScreen('terms');
    } else {
        loginError.textContent = 'Kode Login salah. Silakan coba lagi.';
        loginCodeInput.focus();
    }
}

// Handle status change in registration form
function handleStatusChange(e) {
    playButtonSound();
    
    if (e.target.value === 'pelajar') {
        pelajarFields.style.display = 'block';
        umumFields.style.display = 'none';
    } else {
        pelajarFields.style.display = 'none';
        umumFields.style.display = 'block';
    }
}

// Handle registration form submission
function handleRegistrationSubmit(e) {
    e.preventDefault();
    playButtonSound();
    
    // Collect participant data
    participantData = {
        fullName: document.getElementById('fullName').value,
        status: document.querySelector('input[name="status"]:checked').value,
        purpose: '',
        schoolLevel: ''
    };
    
    if (participantData.status === 'pelajar') {
        participantData.schoolName = document.getElementById('schoolName').value;
        participantData.studentId = document.getElementById('studentId').value;
        participantData.purpose = document.getElementById('studentPurpose').value;
        participantData.schoolLevel = document.getElementById('schoolLevel').value;
    } else {
        participantData.address = document.getElementById('address').value;
        participantData.whatsapp = document.getElementById('whatsapp').value;
        participantData.email = document.getElementById('email').value;
        participantData.purpose = document.getElementById('generalPurpose').value;
        
        // If purpose is CPNS, set exam category
        if (participantData.purpose === 'cpns') {
            examData.category = 'cpns';
        }
    }
    
    // Show exam selection based on status
    showScreen('examSelection');
    
    if (participantData.status === 'pelajar') {
        pelajarExamOptions.style.display = 'block';
        umumExamOptions.style.display = 'none';
    } else {
        pelajarExamOptions.style.display = 'none';
        umumExamOptions.style.display = 'block';
        
        // If purpose is CPNS, show license container
        if (participantData.purpose === 'cpns') {
            cpnsLicenseContainer.style.display = 'block';
        }
    }
}

// Handle CPNS license submission
function handleLicenseSubmit() {
    playButtonSound();
    
    if (licenseCodeInput.value === DEFAULT_CPNS_CODE) {
        licenseError.textContent = '';
        startExam();
    } else {
        licenseError.textContent = 'Kode Lisensi salah. Silakan coba lagi.';
        licenseCodeInput.focus();
    }
}

// Start the exam
function startExam() {
    // Filter questions based on exam data
    let filteredQuestions = [];
    
    if (participantData.status === 'pelajar') {
        filteredQuestions = questions.filter(q => 
            q.category === examData.subject && 
            q.level === examData.level
        );
    } else {
        filteredQuestions = questions.filter(q => 
            q.category === examData.category
        );
    }
    
    // Shuffle questions and select first 20
    questions = shuffleArray(filteredQuestions).slice(0, 20);
    
    if (questions.length === 0) {
        alert('Tidak ada soal yang tersedia untuk kategori ini. Silakan pilih kategori lain.');
        return;
    }
    
    // Reset exam state
    currentQuestionIndex = 0;
    answeredQuestions = 0;
    correctCount = 0;
    wrongCount = 0;
    timeLeft = 90 * 60; // 90 minutes
    examStarted = true;
    
    // Update UI
    totalQuestionsSpan.textContent = questions.length;
    currentQuestionSpan.textContent = 1;
    
    // Start timer
    startTimer();
    
    // Show first question
    showQuestion();
    
    // Play background music
    bgAudio.play().catch(e => console.log('Background audio play error:', e));
    
    // Show exam screen
    showScreen('exam');
}

// Show current question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishExam();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // Update question text
    questionText.textContent = question.text;
    
    // Update option buttons
    optionButtons.forEach((button, index) => {
        const optionLetter = button.querySelector('.option-letter');
        const optionText = button.querySelector('.option-text');
        
        optionText.textContent = question.options[index];
        button.dataset.option = String.fromCharCode(65 + index); // A, B, C, D, E
        
        // Reset button styles
        button.classList.remove('correct', 'incorrect', 'selected');
        button.disabled = false;
    });
    
    // Hide feedback
    answerFeedback.style.display = 'none';
    
    // Update current question number
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

// Handle answer selection
function handleAnswer(selectedOption) {
    playButtonSound();
    
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    // Disable all option buttons
    optionButtons.forEach(button => {
        button.disabled = true;
        
        if (button.dataset.option === question.correctAnswer) {
            button.classList.add('correct');
        } else if (button.dataset.option === selectedOption && !isCorrect) {
            button.classList.add('incorrect');
        }
    });
    
    // Play correct/wrong sound
    if (isCorrect) {
        correctAudio.currentTime = 0;
        correctAudio.play().catch(e => console.log('Correct audio error:', e));
        correctCount++;
    } else {
        wrongAudio.currentTime = 0;
        wrongAudio.play().catch(e => console.log('Wrong audio error:', e));
        wrongCount++;
    }
    
    answeredQuestions++;
    
    // Show feedback
    feedbackTitle.textContent = isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah';
    feedbackText.textContent = isCorrect ? 'Anda telah memilih jawaban yang benar.' : `Jawaban Anda: ${selectedOption}`;
    correctAnswerText.textContent = `Jawaban benar: ${question.correctAnswer}`;
    answerFeedback.style.display = 'block';
}

// Go to next question
function goToNextQuestion() {
    playButtonSound();
    currentQuestionIndex++;
    showQuestion();
}

// Skip current question
function skipQuestion() {
    playButtonSound();
    currentQuestionIndex++;
    showQuestion();
}

// Show unanswered questions
function showUnansweredQuestions() {
    playButtonSound();
    
    // Find first unanswered question
    const unansweredIndex = questions.findIndex((q, index) => 
        index >= currentQuestionIndex && !q.answered
    );
    
    if (unansweredIndex !== -1) {
        currentQuestionIndex = unansweredIndex;
        showQuestion();
    } else {
        alert('Tidak ada soal yang belum dijawab.');
    }
}

// Finish exam
function finishExam() {
    playButtonSound();
    clearInterval(timerInterval);
    examStarted = false;
    
    // Stop background music
    bgAudio.pause();
    
    // Calculate score
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Update results screen
    finalScore.textContent = score;
    totalQuestionsResult.textContent = questions.length;
    correctAnswers.textContent = correctCount;
    wrongAnswers.textContent = wrongCount;
    unanswered.textContent = questions.length - answeredQuestions;
    
    // Generate certificate
    generateCertificate(score);
    
    // Play applause sound
    applauseAudio.currentTime = 0;
    applauseAudio.play().catch(e => console.log('Applause audio error:', e));
    
    // Show results screen
    showScreen('results');
}

// Generate certificate
function generateCertificate(score) {
    // Generate certificate code
    const now = new Date();
    const dateStr = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    let codeParts = [
        participantData.fullName.replace(/\s+/g, '_').toUpperCase(),
        participantData.status.toUpperCase(),
        participantData.status === 'pelajar' ? participantData.schoolLevel.toUpperCase() : '',
        participantData.status === 'pelajar' ? examData.subject.toUpperCase() : examData.category.toUpperCase(),
        dateStr,
        `${randomCode}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
        'PERGUNU-STB'
    ];
    
    certificateCode.textContent = codeParts.join('/');
    
    // Set certificate content
    certificateName.textContent = participantData.fullName;
    
    let achievementText = '';
    if (participantData.status === 'pelajar') {
        achievementText = `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Ujian Pergunu Situbondo</strong>`;
    } else {
        if (examData.category === 'logika') {
            achievementText = `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Tes Logika Pergunu Situbondo</strong>`;
        } else {
            achievementText = `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Sketsa Ujian CPNS/P3K Pergunu Situbondo</strong>`;
        }
    }
    certificateAchievement.innerHTML = achievementText;
    
    certificateScore.textContent = score;
    
    // Set motivational message based on score
    const motivation = MOTIVATIONAL_MESSAGES.find(m => 
        score >= m.min && score <= m.max
    );
    certificateMotivation.textContent = motivation ? motivation.message : '';
    
    // Set date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    certificateDate.textContent = `Ditetapkan di: Situbondo, ${now.toLocaleDateString('id-ID', options)}`;
}

// Print certificate
function printCertificate() {
    playButtonSound();
    window.print();
}

// Retake exam
function retakeExam() {
    playButtonSound();
    showScreen('examSelection');
}

// Start exam timer
function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishExam();
            return;
        }
        
        // Update timer display
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        examTimer.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        // Add warning style when time is running out
        if (timeLeft <= 600) { // 10 minutes
            examTimer.classList.add('timer-warning');
        }
    }, 1000);
}

// Show specific screen
function showScreen(screenName) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    currentScreen = screenName;
    
    switch (screenName) {
        case 'welcome':
            loginScreen.classList.add('active');
            break;
        case 'terms':
            termsScreen.classList.add('active');
            break;
        case 'registration':
            registrationScreen.classList.add('active');
            break;
        case 'examSelection':
            examSelectionScreen.classList.add('active');
            break;
        case 'exam':
            examScreen.classList.add('active');
            break;
        case 'results':
            resultsScreen.classList.add('active');
            break;
    }
}

// Toggle admin panel
// Enhanced Audio Handling
function setupAudio() {
    // Set initial volume
    setAudioVolume(0.7);
    
    // Try to play opening audio
    playOpeningAudio();
    
    // Setup audio context for better mobile compatibility
    setupAudioContext();
}

function setupAudioContext() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        appState.audioContext = new AudioContext();
        
        // Resume audio context on user interaction
        document.addEventListener('click', function initAudio() {
            if (appState.audioContext.state === 'suspended') {
                appState.audioContext.resume();
            }
            document.removeEventListener('click', initAudio);
        });
    } catch (error) {
        console.error('Audio context setup error:', error);
    }
}

function playOpeningAudio() {
    try {
        const openingAudio = document.getElementById('openingAudio');
        const playPromise = openingAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Autoplay prevented:', error);
                // Show play button if needed
            });
        }
    } catch (error) {
        console.error('Opening audio error:', error);
    }
}

function playSound(audioId) {
    try {
        if (appState.isMuted) return;
        
        const audio = document.getElementById(audioId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play error:', e));
        }
    } catch (error) {
        console.error('Sound play error:', error);
    }
}

function setAudioVolume(volume) {
    try {
        const audioElements = [
            'openingAudio', 'buttonAudio', 'correctAudio', 
            'wrongAudio', 'applauseAudio', 'bgAudio'
        ];
        
        audioElements.forEach(id => {
            const audio = document.getElementById(id);
            if (audio) {
                audio.volume = volume;
            }
        });
        
        appState.currentVolume = volume;
        
        // Update mute state
        if (volume === 0) {
            appState.isMuted = true;
            document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            appState.isMuted = false;
            document.getElementById('muteBtn').innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    } catch (error) {
        console.error('Volume setting error:', error);
    }
}

function toggleMute() {
    try {
        appState.isMuted = !appState.isMuted;
        setAudioVolume(appState.isMuted ? 0 : appState.currentVolume);
    } catch (error) {
        console.error('Mute toggle error:', error);
    }
}

function updateVolume() {
    try {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            const newVolume = parseFloat(volumeSlider.value);
            setAudioVolume(newVolume);
        }
    } catch (error) {
        console.error('Volume update error:', error);
    }
}

// Enhanced Floating Buttons
function setupFloatingButtons() {
    const buttons = {
        adminBtn: toggleAdminPanel,
        bankSoalBtn: toggleBankSoalPanel,
        goToBtn: toggleGoToPanel,
        shareBtn: toggleSharePanel,
        whatsappBtn: openWhatsApp
    };
    
    Object.entries(buttons).forEach(([id, handler]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                playSound('buttonAudio');
                handler();
            });
        }
    });
    
    // Volume control
    document.getElementById('muteBtn').addEventListener('click', function() {
        playSound('buttonAudio');
        toggleMute();
    });
    
    document.getElementById('volumeSlider').addEventListener('input', updateVolume);
}

function toggleAdminPanel() {
    const adminCode = prompt('Masukkan Kode Admin:');
    if (adminCode === DEFAULT_CODES.ADMIN) {
        document.getElementById('adminPanel').style.display = 'flex';
    } else if (adminCode) {
        alert('Kode Admin salah');
    }
}

function toggleBankSoalPanel() {
    const bankCode = prompt('Masukkan Kode Bank Soal:');
    if (bankCode === DEFAULT_CODES.BANK_SOAL) {
        document.getElementById('bankSoalPanel').style.display = 'flex';
    } else if (bankCode) {
        alert('Kode Bank Soal salah');
    }
}

function toggleGoToPanel() {
    const panel = document.getElementById('goToPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    document.getElementById('sharePanel').style.display = 'none';
}

function toggleSharePanel() {
    const panel = document.getElementById('sharePanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    document.getElementById('goToPanel').style.display = 'none';
    
    // Update share link
    document.getElementById('shareLink').value = window.location.href;
}

function openWhatsApp() {
    window.open('https://wa.me/6285647709114?text=Assalamualaikum%20mas%20admin,%20saya%20mau%20tanya%20sesuatu%20nih...', '_blank');
}

// Enhanced Login Handling
function handleLogin() {
    playSound('buttonAudio');
    
    const loginCodeInput = document.getElementById('loginCode');
    const loginError = document.getElementById('loginError');
    
    if (loginCodeInput.value === DEFAULT_CODES.LOGIN) {
        loginError.textContent = '';
        showScreen('terms');
    } else {
        loginError.textContent = 'Kode Login salah. Silakan coba lagi.';
        loginCodeInput.focus();
        
        // Shake animation for error
        loginCodeInput.classList.add('shake');
        setTimeout(() => {
            loginCodeInput.classList.remove('shake');
        }, 500);
    }
}

// Initialize the app
function init() {
    setupAudio();
    setupFloatingButtons();
    loadQuestions();
    setupEventListeners();
    
    // Check for admin access
    if (window.location.hash === '#admin') {
        toggleAdminPanel();
    }
}

document.addEventListener('DOMContentLoaded', init);
