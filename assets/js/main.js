// PERGUNU SMART - FINAL MAIN JS
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the app
  init();
});

// App State
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
  timeLeft: 90 * 60, // 90 minutes in seconds
  examStarted: false,
  isMuted: false,
  currentVolume: 0.7,
  audioContext: null
};

// Default codes
const DEFAULT_CODES = {
  LOGIN: '12345',
  CPNS: 'CPNSP3K-OPENLOCK',
  BANK_SOAL: 'BANKSOAL-OPENLOCK',
  ADMIN: '65614222'
};

// Motivational messages
const MOTIVATIONAL_MESSAGES = [
  { min: 0, max: 40, message: "Masih ada ruang untuk perbaikan. Teruslah belajar dan berlatih!" },
  { min: 41, max: 60, message: "Hasil yang cukup baik. Tingkatkan lagi pemahaman Anda!" },
  { min: 61, max: 75, message: "Kerja bagus! Anda telah menunjukkan pemahaman yang baik." },
  { min: 76, max: 85, message: "Prestasi yang sangat baik! Pertahankan semangat belajar Anda." },
  { min: 86, max: 95, message: "Luar biasa! Anda benar-benar menguasai materi ini." },
  { min: 96, max: 100, message: "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini." }
];

// Initialize the app
function init() {
  try {
    // Setup audio context
    setupAudioContext();
    
    // Set initial volume
    setAudioVolume(appState.currentVolume);
    
    // Setup event listeners
    setupEventListeners();
    
    // Load questions
    loadQuestions();
    
    // Play opening audio
    playOpeningAudio();
    
    // Check for admin access
    if (window.location.hash === '#admin') {
      toggleAdminPanel();
    }
    
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Terjadi kesalahan saat memulai aplikasi');
  }
}

// Setup audio context for better mobile compatibility
function setupAudioContext() {
  try {
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    appState.audioContext = new AudioContext();
    
    // Resume audio context on user interaction
    document.body.addEventListener('click', function() {
      if (appState.audioContext.state === 'suspended') {
        appState.audioContext.resume();
      }
    }, { once: true });
    
  } catch (error) {
    console.error('Audio context setup error:', error);
  }
}

// Play opening audio
function playOpeningAudio() {
  try {
    const openingAudio = document.getElementById('openingAudio');
    const playPromise = openingAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay prevented, showing play button');
        document.getElementById('audioPlayBtn').style.display = 'block';
      });
    }
  } catch (error) {
    console.error('Opening audio error:', error);
  }
}

// Set audio volume for all audio elements
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

// Toggle mute
function toggleMute() {
  try {
    appState.isMuted = !appState.isMuted;
    setAudioVolume(appState.isMuted ? 0 : appState.currentVolume);
    
    // Show/hide volume slider
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
      volumeSlider.style.display = appState.isMuted ? 'none' : 'block';
    }
    
  } catch (error) {
    console.error('Mute toggle error:', error);
  }
}

// Update volume from slider
function updateVolume() {
  try {
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
      appState.currentVolume = parseFloat(volumeSlider.value);
      setAudioVolume(appState.currentVolume);
    }
  } catch (error) {
    console.error('Volume update error:', error);
  }
}

// Show specific screen
function showScreen(screenName) {
  try {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show requested screen
    const screen = document.getElementById(screenName + 'Screen');
    if (screen) {
      screen.classList.add('active');
      appState.currentScreen = screenName;
      
      // Special handling for certain screens
      if (screenName === 'results') {
        generateCertificate();
      }
    }
    
  } catch (error) {
    console.error('Screen transition error:', error);
  }
}

// Generate certificate
function generateCertificate() {
  try {
    const score = Math.round((appState.correctCount / appState.questions.length) * 100);
    
    // Generate certificate code
    const now = new Date();
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
    playSound('applauseAudio');
    
  } catch (error) {
    console.error('Certificate generation error:', error);
  }
}

// Play sound effect
function playSound(audioId) {
  try {
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Audio play error:', e));
    }
  } catch (error) {
    console.error('Sound play error:', error);
  }
}

// Start exam
function startExam() {
  try {
    // Filter questions based on exam data
    let filteredQuestions = [];
    
    if (appState.participantData.status === 'pelajar') {
      filteredQuestions = appState.questions.filter(q => 
        q.category === appState.examData.subject && 
        q.level === appState.examData.level
      );
    } else {
      filteredQuestions = appState.questions.filter(q => 
        q.category === appState.examData.category
      );
    }
    
    // Shuffle questions and select first 20
    appState.questions = shuffleArray(filteredQuestions).slice(0, 20);
    
    if (appState.questions.length === 0) {
      showError('Tidak ada soal yang tersedia untuk kategori ini');
      return;
    }
    
    // Reset exam state
    appState.currentQuestionIndex = 0;
    appState.answeredQuestions = 0;
    appState.correctCount = 0;
    appState.wrongCount = 0;
    appState.timeLeft = 90 * 60; // 90 minutes
    appState.examStarted = true;
    
    // Update UI
    document.getElementById('totalQuestions').textContent = appState.questions.length;
    document.getElementById('currentQuestion').textContent = 1;
    
    // Start timer
    startTimer();
    
    // Show first question
    showQuestion();
    
    // Play background music
    playBackgroundMusic();
    
    // Show exam screen
    showScreen('exam');
    
  } catch (error) {
    console.error('Exam start error:', error);
    showError('Gagal memulai ujian');
  }
}

// Start exam timer
function startTimer() {
  clearInterval(appState.timerInterval);
  
  appState.timerInterval = setInterval(() => {
    appState.timeLeft--;
    
    if (appState.timeLeft <= 0) {
      clearInterval(appState.timerInterval);
      finishExam();
      return;
    }
    
    // Update timer display
    const minutes = Math.floor(appState.timeLeft / 60);
    const seconds = appState.timeLeft % 60;
    const timerElement = document.getElementById('examTimer');
    
    if (timerElement) {
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
      
      // Add warning style when time is running out
      if (appState.timeLeft <= 600) { // 10 minutes
        timerElement.classList.add('timer-warning');
      }
    }
    
  }, 1000);
}

// Show current question
function showQuestion() {
  try {
    if (appState.currentQuestionIndex >= appState.questions.length) {
      finishExam();
      return;
    }
    
    const question = appState.questions[appState.currentQuestionIndex];
    
    // Update question text
    document.getElementById('questionText').textContent = question.text;
    
    // Update option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
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
    document.getElementById('answerFeedback').style.display = 'none';
    
    // Update current question number
    document.getElementById('currentQuestion').textContent = appState.currentQuestionIndex + 1;
    
  } catch (error) {
    console.error('Question display error:', error);
  }
}

// Handle answer selection
function handleAnswer(selectedOption) {
  try {
    playSound('buttonAudio');
    
    const question = appState.questions[appState.currentQuestionIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    
    // Disable all option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
      button.disabled = true;
      
      if (button.dataset.option === question.correctAnswer) {
        button.classList.add('correct');
      } else if (button.dataset.option === selectedOption && !isCorrect) {
        button.classList.add('incorrect');
      }
    });
    
    // Play correct/wrong sound
    playSound(isCorrect ? 'correctAudio' : 'wrongAudio');
    
    // Update counts
    if (isCorrect) {
      appState.correctCount++;
    } else {
      appState.wrongCount++;
    }
    
    appState.answeredQuestions++;
    
    // Show feedback
    document.getElementById('feedbackTitle').textContent = isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah';
    document.getElementById('feedbackText').textContent = isCorrect ? 'Anda telah memilih jawaban yang benar.' : `Jawaban Anda: ${selectedOption}`;
    document.getElementById('correctAnswerText').textContent = `Jawaban benar: ${question.correctAnswer}`;
    document.getElementById('answerFeedback').style.display = 'block';
    
  } catch (error) {
    console.error('Answer handling error:', error);
  }
}

// Finish exam
function finishExam() {
  try {
    clearInterval(appState.timerInterval);
    appState.examStarted = false;
    
    // Stop background music
    const bgAudio = document.getElementById('bgAudio');
    if (bgAudio) {
      bgAudio.pause();
    }
    
    // Calculate score
    const score = Math.round((appState.correctCount / appState.questions.length) * 100);
    
    // Update results screen
    document.getElementById('finalScore').textContent = score;
    document.getElementById('totalQuestionsResult').textContent = appState.questions.length;
    document.getElementById('correctAnswers').textContent = appState.correctCount;
    document.getElementById('wrongAnswers').textContent = appState.wrongCount;
    document.getElementById('unanswered').textContent = appState.questions.length - appState.answeredQuestions;
    
    // Show results screen
    showScreen('results');
    
  } catch (error) {
    console.error('Exam finish error:', error);
    showError('Gagal menyelesaikan ujian');
  }
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

// Show error message
function showError(message) {
  try {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 5000);
    }
  } catch (error) {
    console.error('Error display error:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  try {
    // Audio play button
    document.getElementById('audioPlayBtn').addEventListener('click', playAllAudio);
    
    // Volume control
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    document.getElementById('volumeSlider').addEventListener('input', updateVolume);
    
    // Login screen
    document.getElementById('submitLogin').addEventListener('click', handleLogin);
    document.getElementById('loginCode').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
    
    // Terms screen
    document.getElementById('agreeTerms').addEventListener('change', (e) => {
      document.getElementById('continueBtn').disabled = !e.target.checked;
      playSound('buttonAudio');
    });
    document.getElementById('continueBtn').addEventListener('click', () => {
      playSound('buttonAudio');
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
        playSound('buttonAudio');
      });
    });
    
    // More event listeners...
    
  } catch (error) {
    console.error('Event listener setup error:', error);
  }
}

// More functions...

// DOM Elements
const screens = document.querySelectorAll('.screen');
const loginScreen = document.getElementById('welcomeScreen');
const termsScreen = document.getElementById('termsScreen');
const registrationScreen = document.getElementById('registrationScreen');
const examSelectionScreen = document.getElementById('examSelectionScreen');
const examScreen = document.getElementById('examScreen');
const resultsScreen = document.getElementById('resultsScreen');

// Audio Elements
const openingAudio = document.getElementById('openingAudio');
const buttonAudio = document.getElementById('buttonAudio');
const correctAudio = document.getElementById('correctAudio');
const wrongAudio = document.getElementById('wrongAudio');
const applauseAudio = document.getElementById('applauseAudio');
const bgAudio = document.getElementById('bgAudio');

// Login Screen
const loginCodeInput = document.getElementById('loginCode');
const submitLoginBtn = document.getElementById('submitLogin');
const loginError = document.getElementById('loginError');

// Terms Screen
const agreeTermsCheckbox = document.getElementById('agreeTerms');
const continueBtn = document.getElementById('continueBtn');

// Registration Form
const participantForm = document.getElementById('participantForm');
const statusRadios = document.querySelectorAll('input[name="status"]');
const pelajarFields = document.getElementById('pelajarFields');
const umumFields = document.getElementById('umumFields');

// Exam Selection
const pelajarExamOptions = document.getElementById('pelajarExamOptions');
const umumExamOptions = document.getElementById('umumExamOptions');
const examOptions = document.querySelectorAll('.exam-option');
const subjectOptions = document.querySelectorAll('.subject-option');
const generalOptions = document.querySelectorAll('.general-option');
const cpnsLicenseContainer = document.getElementById('cpnsLicenseContainer');
const licenseCodeInput = document.getElementById('licenseCode');
const submitLicenseBtn = document.getElementById('submitLicense');
const licenseError = document.getElementById('licenseError');

// Exam Screen
const examTimer = document.getElementById('examTimer');
const questionText = document.getElementById('questionText');
const optionButtons = document.querySelectorAll('.option-btn');
const answerFeedback = document.getElementById('answerFeedback');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackText = document.getElementById('feedbackText');
const correctAnswerText = document.getElementById('correctAnswerText');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const skipQuestionBtn = document.getElementById('skipQuestionBtn');
const unansweredBtn = document.getElementById('unansweredBtn');
const finishExamBtn = document.getElementById('finishExamBtn');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');

// Results Screen
const finalScore = document.getElementById('finalScore');
const totalQuestionsResult = document.getElementById('totalQuestionsResult');
const correctAnswers = document.getElementById('correctAnswers');
const wrongAnswers = document.getElementById('wrongAnswers');
const unanswered = document.getElementById('unanswered');
const certificateCode = document.getElementById('certificateCode');
const certificateName = document.getElementById('certificateName');
const certificateAchievement = document.getElementById('certificateAchievement');
const certificateScore = document.getElementById('certificateScore');
const certificateMotivation = document.getElementById('certificateMotivation');
const certificateDate = document.getElementById('certificateDate');
const printCertificateBtn = document.getElementById('printCertificateBtn');
const retakeExamBtn = document.getElementById('retakeExamBtn');

// Floating Buttons
const floatingButtons = document.querySelector('.floating-buttons');
const shareBtn = document.getElementById('shareBtn');
const whatsappBtn = document.getElementById('whatsappBtn');
const goToBtn = document.getElementById('goToBtn');
const bankSoalBtn = document.getElementById('bankSoalBtn');
const adminBtn = document.getElementById('adminBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const audioPlayBtn = document.getElementById('audioPlayBtn');

// Admin Panel
const adminPanel = document.getElementById('adminPanel');
const closeAdminBtn = document.getElementById('closeAdminBtn');
const adminTabs = document.querySelectorAll('.admin-tab');
const adminTabContents = document.querySelectorAll('.admin-tab-content');

// Bank Soal Panel
const bankSoalPanel = document.getElementById('bankSoalPanel');
const closeBankBtn = document.getElementById('closeBankBtn');
const bankTabs = document.querySelectorAll('.bank-tab');
const bankTabContents = document.querySelectorAll('.bank-tab-content');

// Share Panel
const sharePanel = document.getElementById('sharePanel');
const closeShareBtn = document.getElementById('closeShareBtn');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');

// Go To Panel
const goToPanel = document.getElementById('goToPanel');
const closeGoToBtn = document.getElementById('closeGoToBtn');

// App State
let currentScreen = 'welcome';
let participantData = {};
let examData = {};
let questions = [];
let currentQuestionIndex = 0;
let answeredQuestions = 0;
let correctCount = 0;
let wrongCount = 0;
let timerInterval;
let timeLeft = 90 * 60; // 90 minutes in seconds
let examStarted = false;
let isMuted = false;
let currentVolume = 0.7;

// Default codes
const DEFAULT_LOGIN_CODE = '12345';
const DEFAULT_CPNS_CODE = 'CPNSP3K-OPENLOCK';
const DEFAULT_BANK_SOAL_CODE = 'BANKSOAL-OPENLOCK';
const DEFAULT_ADMIN_CODE = '65614222';

// Motivational messages based on score
const MOTIVATIONAL_MESSAGES = [
    { min: 0, max: 40, message: "Masih ada ruang untuk perbaikan. Teruslah belajar dan berlatih!" },
    { min: 41, max: 60, message: "Hasil yang cukup baik. Tingkatkan lagi pemahaman Anda!" },
    { min: 61, max: 75, message: "Kerja bagus! Anda telah menunjukkan pemahaman yang baik." },
    { min: 76, max: 85, message: "Prestasi yang sangat baik! Pertahankan semangat belajar Anda." },
    { min: 86, max: 95, message: "Luar biasa! Anda benar-benar menguasai materi ini." },
    { min: 96, max: 100, message: "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini." }
];

// Initialize the app
function init() {
    // Set initial volume
    setAudioVolume(currentVolume);
    
    // Try to play opening audio
    playOpeningAudio();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load questions
    loadQuestions();
}

// Enhanced certificate generation
function generateCertificate(score) {
    // Generate certificate code
    const now = new Date();
    const dateStr = `${now.getDate()}${now.getMonth()+1}${now.getFullYear()}`;
    const randomCode = Math.random().toString(36).substring(2,6).toUpperCase();
    
    let codeParts = [
        participantData.fullName.replace(/\s+/g, '_').toUpperCase(),
        participantData.status.toUpperCase(),
        participantData.status === 'pelajar' ? participantData.schoolLevel.toUpperCase() : '',
        participantData.status === 'pelajar' ? examData.subject.toUpperCase() : examData.category.toUpperCase(),
        dateStr,
        `${randomCode}-${Math.random().toString(36).substring(2,5).toUpperCase()}`,
        'PERGUNU-STB'
    ];
    
    certificateCode.textContent = codeParts.join('/');
    certificateName.textContent = participantData.fullName;
    
    // Set achievement text based on exam type
    let achievementText = '';
    if (participantData.status === 'pelajar') {
        achievementText = `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Ujian Pergunu Situbondo</strong>`;
    } else {
        achievementText = examData.category === 'cpns' 
            ? `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Sketsa Ujian CPNS/P3K Pergunu Situbondo</strong>`
            : `Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Tes Logika Pergunu Situbondo</strong>`;
    }
    
    certificateAchievement.innerHTML = achievementText;
    certificateScore.textContent = score;
    
    // Set motivational message based on score
    const motivation = MOTIVATIONAL_MESSAGES.find(m => score >= m.min && score <= m.max);
    certificateMotivation.textContent = motivation ? motivation.message : '';
    
    // Format date
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    certificateDate.textContent = `Ditetapkan di: Situbondo, ${now.toLocaleDateString('id-ID', options)}`;
    
    // Play applause sound
    applauseAudio.currentTime = 0;
    applauseAudio.play().catch(e => console.log('Applause audio error:', e));
}

function getMotivationalMessage(score) {
    if (score >= 96) return "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.";
    if (score >= 86) return "Luar biasa! Anda benar-benar menguasai materi ini.";
    if (score >= 76) return "Prestasi yang sangat baik! Pertahankan semangat belajar Anda.";
    if (score >= 61) return "Kerja bagus! Anda telah menunjukkan pemahaman yang baik.";
    if (score >= 41) return "Hasil yang cukup baik. Tingkatkan lagi pemahaman Anda!";
    return "Masih ada ruang untuk perbaikan. Teruslah belajar dan berlatih!";
}

/ Enhanced CPNS license verification
function handleLicenseSubmit() {
    playButtonSound();
    
    if (licenseCodeInput.value === currentCodes.cpns) {
        licenseError.textContent = '';
        startExam();
    } else {
        licenseError.textContent = 'Kode Lisensi salah. Silakan coba lagi.';
        licenseCodeInput.focus();
    }
}
function playOpeningAudio() {
    const playPromise = openingAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay prevented, showing play button');
            audioPlayBtn.style.display = 'block';
        });
    }
}

function playAllAudio() {
    openingAudio.play().then(() => {
        audioPlayBtn.style.display = 'none';
    }).catch(error => {
        console.log('Audio play failed:', error);
    });
    
    bgAudio.play().catch(error => {
        console.log('Background audio play failed:', error);
    });
}

// Set audio volume for all audio elements
function setAudioVolume(volume) {
    openingAudio.volume = volume;
    buttonAudio.volume = volume;
    correctAudio.volume = volume;
    wrongAudio.volume = volume;
    applauseAudio.volume = volume;
    bgAudio.volume = volume;
}

// Toggle mute
function toggleMute() {
    isMuted = !isMuted;
    setAudioVolume(isMuted ? 0 : currentVolume);
    muteBtn.innerHTML = `<i class="fas fa-volume-${isMuted ? 'mute' : 'up'}"></i>`;
    volumeSlider.style.display = isMuted ? 'none' : 'block';
}

function updateVolume() {
    currentVolume = parseFloat(volumeSlider.value);
    setAudioVolume(currentVolume);
    
    if (currentVolume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        isMuted = true;
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        isMuted = false;
    }
}

// Update volume
function updateVolume() {
    currentVolume = parseFloat(volumeSlider.value);
    setAudioVolume(currentVolume);
    
    if (currentVolume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        isMuted = true;
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        isMuted = false;
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Audio play button
    audioPlayBtn.addEventListener('click', playAllAudio);
    
    // Volume control
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', updateVolume);
    
    // Login screen
    submitLoginBtn.addEventListener('click', handleLogin);
    loginCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Terms screen
    agreeTermsCheckbox.addEventListener('change', (e) => {
        continueBtn.disabled = !e.target.checked;
        playButtonSound();
    });
    continueBtn.addEventListener('click', () => {
        playButtonSound();
        showScreen('registration');
    });
    
    // Registration form
    statusRadios.forEach(radio => {
        radio.addEventListener('change', handleStatusChange);
    });
    participantForm.addEventListener('submit', handleRegistrationSubmit);
    
    // Exam selection
    examOptions.forEach(option => {
        option.addEventListener('click', () => {
            examData.level = option.dataset.level;
            playButtonSound();
        });
    });
    
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
function toggleAdminPanel() {
    playButtonSound();
    const adminCode = prompt('Masukkan Kode Admin:');
    
    if (adminCode === DEFAULT_ADMIN_CODE) {
        adminPanel.style.display = 'flex';
    } else if (adminCode) {
        alert('Kode Admin salah.');
    }
}

// Toggle bank soal panel
function toggleBankSoalPanel() {
    playButtonSound();
    const bankCode = prompt('Masukkan Kode Bank Soal:');
    
    if (bankCode === DEFAULT_BANK_SOAL_CODE) {
        bankSoalPanel.style.display = 'flex';
    } else if (bankCode) {
        alert('Kode Bank Soal salah.');
    }
}

// Toggle share panel
function toggleSharePanel() {
    playButtonSound();
    sharePanel.style.display = sharePanel.style.display === 'block' ? 'none' : 'block';
    goToPanel.style.display = 'none';
}

// Toggle go to panel
function toggleGoToPanel() {
    playButtonSound();
    goToPanel.style.display = goToPanel.style.display === 'block' ? 'none' : 'block';
    sharePanel.style.display = 'none';
}

// Open WhatsApp chat
function openWhatsApp() {
    playButtonSound();
    window.open('https://wa.me/6285647709114?text=Assalamualaikum%20mas%20admin,%20saya%20mau%20tanya%20sesuatu%20nih...', '_blank');
}

// Copy share link
function copyShareLink() {
    playButtonSound();
    shareLink.select();
    document.execCommand('copy');
    alert('Link telah disalin ke clipboard!');
}

// Play button sound
function playButtonSound() {
    buttonAudio.currentTime = 0;
    buttonAudio.play().catch(e => console.log('Button audio error:', e));
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

// Load questions (mock data)
function loadQuestions() {
    // In a real app, this would be an API call
    questions = [
        // Sample questions for different categories
        {
            id: 1,
            category: 'agama',
            level: 'sd',
            text: 'Siapakah nabi pertama dalam Islam?',
            options: ['Adam', 'Nuh', 'Ibrahim', 'Musa', 'Muhammad'],
            correctAnswer: 'A',
            explanation: 'Nabi Adam adalah manusia pertama sekaligus nabi pertama dalam Islam.'
        },
        {
            id: 2,
            category: 'ppkn',
            level: 'smp',
            text: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea ke...',
            options: ['1', '2', '3', '4', 'Tidak ada yang benar'],
            correctAnswer: 'D',
            explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea ke-4 Pembukaan UUD 1945.'
        },
        // Add more questions as needed
    ];
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
