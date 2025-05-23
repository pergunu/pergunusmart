// Global Variables
let currentScreen = 'opening';
let participantData = {};
let examData = {};
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let unansweredQuestions = [];
let timerInterval;
let examDuration = 120; // in minutes
let timeLeft = examDuration * 60; // in seconds
let selectedOptions = {};
let allQuestions = [];
let examType = '';
let examSubject = '';
let examClass = '';

// DOM Elements
const openingScreen = document.getElementById('openingScreen');
const termsScreen = document.getElementById('termsScreen');
const participantForm = document.getElementById('participantForm');
const examSelection = document.getElementById('examSelection');
const examScreen = document.getElementById('examScreen');
const resultsScreen = document.getElementById('resultsScreen');

// Audio Elements
const openingAudio = document.getElementById('openingAudio');
const correctAudio = new Audio('assets/audio/jawabanbenar.mp3');
const wrongAudio = new Audio('assets/audio/jawbansalah.mp3');
const applauseAudio = new Audio('assets/audio/applause.mp3');
const buttonAudio = new Audio('assets/audio/audiotombol.mp3');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load questions from JSON (in a real app, this would be from a server)
    loadSampleQuestions();
    
    // Set up event listeners
    setupEventListeners();
    
    // Play opening audio once
    openingAudio.play();
});

function setupEventListeners() {
    // Login Screen
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    
    // Terms Screen
    document.getElementById('agreeTerms').addEventListener('change', function() {
        document.getElementById('continueBtn').disabled = !this.checked;
    });
    document.getElementById('continueBtn').addEventListener('click', showParticipantForm);
    
    // Participant Form
    document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', toggleParticipantFields);
    });
    document.getElementById('getLocation').addEventListener('click', getCurrentLocation);
    document.getElementById('participantDataForm').addEventListener('submit', handleParticipantFormSubmit);
    
    // Exam Selection
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.addEventListener('click', selectClassLevel);
    });
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', selectSubject);
    });
    document.querySelectorAll('.exam-type-btn').forEach(btn => {
        btn.addEventListener('click', selectExamType);
    });
    document.getElementById('submitLicense').addEventListener('click', verifyLicenseCode);
    document.getElementById('startExamBtn').addEventListener('click', startExam);
    
    // Exam Screen
    document.getElementById('finishExamBtn').addEventListener('click', finishExam);
    document.getElementById('skipQuestionBtn').addEventListener('click', skipQuestion);
    document.getElementById('unansweredBtn').addEventListener('click', showUnansweredQuestions);
    
    // Results Screen
    document.getElementById('printCertificateBtn').addEventListener('click', printCertificate);
    document.getElementById('retakeExamBtn').addEventListener('click', retakeExam);
    
    // Floating Buttons
    document.getElementById('shareBtn').addEventListener('click', shareWebsite);
    document.getElementById('whatsappBtn').addEventListener('click', contactAdmin);
    document.getElementById('questionBankBtn').addEventListener('click', showQuestionBankModal);
    document.getElementById('adminBtn').addEventListener('click', showAdminPanelModal);
    
    // Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('modalSubmitBtn').addEventListener('click', handleModalSubmit);
}

// Screen Navigation Functions
function handleLogin() {
    const loginCode = document.getElementById('loginCode').value;
    const defaultCode = '12345';
    
    if (loginCode === defaultCode) {
        buttonAudio.play();
        openingScreen.style.display = 'none';
        termsScreen.style.display = 'flex';
        currentScreen = 'terms';
    } else {
        alert('Kode login salah. Silakan coba lagi.');
    }
}

function showParticipantForm() {
    buttonAudio.play();
    termsScreen.style.display = 'none';
    participantForm.style.display = 'flex';
    currentScreen = 'participant';
}

function toggleParticipantFields() {
    const isStudent = document.getElementById('student').checked;
    
    if (isStudent) {
        document.getElementById('studentFields').style.display = 'block';
        document.getElementById('generalFields').style.display = 'none';
    } else {
        document.getElementById('studentFields').style.display = 'none';
        document.getElementById('generalFields').style.display = 'block';
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        document.getElementById('locationStatus').textContent = 'Mendapatkan lokasi...';
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                document.getElementById('address').value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
                document.getElementById('locationStatus').textContent = 'Lokasi berhasil didapatkan';
            },
            error => {
                console.error('Error getting location:', error);
                document.getElementById('locationStatus').textContent = 'Gagal mendapatkan lokasi';
            }
        );
    } else {
        document.getElementById('locationStatus').textContent = 'Geolocation tidak didukung di browser ini';
    }
}

function handleParticipantFormSubmit(e) {
    e.preventDefault();
    buttonAudio.play();
    
    // Collect participant data
    participantData = {
        fullName: document.getElementById('fullName').value,
        status: document.querySelector('input[name="status"]:checked').value,
        timestamp: new Date().toISOString()
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
    }
    
    // In a real app, you would save this data to a database
    console.log('Participant data:', participantData);
    
    // Show exam selection screen
    participantForm.style.display = 'none';
    examSelection.style.display = 'flex';
    currentScreen = 'selection';
    
    // Show appropriate options based on participant type
    if (participantData.status === 'pelajar') {
        document.getElementById('studentOptions').style.display = 'block';
        document.getElementById('generalOptions').style.display = 'none';
        setupClassButtons(participantData.schoolLevel);
    } else {
        document.getElementById('studentOptions').style.display = 'none';
        document.getElementById('generalOptions').style.display = 'block';
    }
}

function setupClassButtons(schoolLevel) {
    const classButtonsContainer = document.getElementById('classButtons');
    classButtonsContainer.innerHTML = '';
    
    let classes = [];
    if (schoolLevel === 'sd') {
        classes = ['IV', 'V', 'VI'];
    } else if (schoolLevel === 'smp') {
        classes = ['VII', 'VIII', 'IX'];
    } else if (schoolLevel === 'sma') {
        classes = ['X', 'XI', 'XII'];
    }
    
    classes.forEach(cls => {
        const btn = document.createElement('button');
        btn.className = 'class-btn';
        btn.textContent = cls;
        btn.dataset.class = cls;
        btn.addEventListener('click', selectClassLevel);
        classButtonsContainer.appendChild(btn);
    });
}

function selectClassLevel(e) {
    buttonAudio.play();
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    examClass = e.target.dataset.class;
    checkExamReady();
}

function selectSubject(e) {
    buttonAudio.play();
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    examSubject = e.target.dataset.subject;
    examType = 'pelajar';
    checkExamReady();
}

function selectExamType(e) {
    buttonAudio.play();
    document.querySelectorAll('.exam-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    examType = e.target.dataset.exam;
    
    if (examType === 'cpns') {
        document.getElementById('licenseForm').style.display = 'block';
    } else {
        document.getElementById('licenseForm').style.display = 'none';
        checkExamReady();
    }
}

function verifyLicenseCode() {
    const licenseCode = document.getElementById('licenseCode').value;
    const defaultCode = 'OPENLOCK-1945';
    
    if (licenseCode === defaultCode) {
        buttonAudio.play();
        checkExamReady();
    } else {
        alert('Kode lisensi salah. Silakan coba lagi.');
    }
}

function checkExamReady() {
    if ((examType === 'pelajar' && examSubject && examClass) || 
        (examType === 'logika') || 
        (examType === 'cpns' && document.getElementById('licenseCode').value === 'OPENLOCK-1945')) {
        document.getElementById('startExamBtn').style.display = 'block';
    } else {
        document.getElementById('startExamBtn').style.display = 'none';
    }
}

function startExam() {
    buttonAudio.play();
    examSelection.style.display = 'none';
    examScreen.style.display = 'block';
    currentScreen = 'exam';
    
    // Filter questions based on exam type and subject
    filterQuestions();
    
    // Initialize exam
    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    unansweredQuestions = [];
    selectedOptions = {};
    timeLeft = examDuration * 60;
    
    // Start timer
    startTimer();
    
    // Display first question
    displayQuestion();
}

function filterQuestions() {
    if (examType === 'pelajar') {
        allQuestions = sampleQuestions.filter(q => 
            q.subject === examSubject && q.level === participantData.schoolLevel
        );
    } else if (examType === 'logika') {
        allQuestions = sampleQuestions.filter(q => q.category === 'logika');
    } else if (examType === 'cpns') {
        allQuestions = sampleQuestions.filter(q => q.category === 'cpns');
    }
    
    // Shuffle questions if needed
    if (shouldShuffleQuestions()) {
        allQuestions = shuffleArray(allQuestions);
    }
    
    // Limit number of questions if needed
    const questionLimit = getQuestionLimit();
    if (allQuestions.length > questionLimit) {
        allQuestions = allQuestions.slice(0, questionLimit);
    }
}

function shouldShuffleQuestions() {
    // In a real app, this would check admin settings
    return true;
}

function getQuestionLimit() {
    // In a real app, this would check admin settings
    return 10; // Default to 10 questions
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 600 && timeLeft > 60) { // 10 minutes left
            document.getElementById('timeWarning').style.display = 'block';
        } else if (timeLeft <= 60) {
            document.getElementById('timeWarning').style.display = 'none';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerDisplay = document.getElementById('examTimer');
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 600) { // 10 minutes or less
        timerDisplay.style.fontSize = '24px';
        timerDisplay.style.color = '#e74c3c';
    } else {
        timerDisplay.style.fontSize = '18px';
        timerDisplay.style.color = 'white';
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= allQuestions.length) {
        finishExam();
        return;
    }
    
    const question = allQuestions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = allQuestions.length;
    
    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    const options = ['A', 'B', 'C', 'D', 'E'].slice(0, question.options.length);
    
    options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.innerHTML = `
            <span class="option-letter">${option}</span>
            ${question.options[index]}
        `;
        optionBtn.dataset.option = option;
        
        // Check if this option was previously selected
        if (selectedOptions[currentQuestionIndex] === option) {
            optionBtn.classList.add('selected');
            if (option === question.correctAnswer) {
                optionBtn.classList.add('correct');
            } else {
                optionBtn.classList.add('incorrect');
            }
            
            // Show explanation if answer was selected
            document.getElementById('answerExplanation').style.display = 'block';
            document.getElementById('explanationText').textContent = question.explanation;
        }
        
        optionBtn.addEventListener('click', () => selectAnswer(option, question.correctAnswer, question.explanation));
        optionsContainer.appendChild(optionBtn);
    });
    
    // Hide explanation for new questions
    if (!selectedOptions[currentQuestionIndex]) {
        document.getElementById('answerExplanation').style.display = 'none';
    }
    
    // Update exam info display
    updateExamInfoDisplay();
}

function updateExamInfoDisplay() {
    let subjectDisplay = '';
    if (examType === 'pelajar') {
        subjectDisplay = `${examSubject.toUpperCase()} - Kelas ${examClass}`;
    } else if (examType === 'logika') {
        subjectDisplay = 'UJIAN LOGIKA';
    } else if (examType === 'cpns') {
        subjectDisplay = 'UJIAN CPNS/P3K';
    }
    
    document.getElementById('examSubject').textContent = `Mata Ujian: ${subjectDisplay}`;
    
    if (examType === 'pelajar') {
        document.getElementById('examClass').textContent = `Kelas: ${examClass}`;
    } else {
        document.getElementById('examClass').textContent = '';
    }
}

function selectAnswer(selectedOption, correctAnswer, explanation) {
    if (selectedOptions[currentQuestionIndex]) return; // Prevent changing answers
    
    buttonAudio.play();
    selectedOptions[currentQuestionIndex] = selectedOption;
    
    const options = document.querySelectorAll('.option-btn');
    options.forEach(option => {
        option.disabled = true;
        
        if (option.dataset.option === correctAnswer) {
            option.classList.add('correct');
        } else if (option.dataset.option === selectedOption && selectedOption !== correctAnswer) {
            option.classList.add('incorrect');
        }
    });
    
    // Show explanation
    document.getElementById('answerExplanation').style.display = 'block';
    document.getElementById('explanationText').textContent = explanation;
    
    // Update scores
    if (selectedOption === correctAnswer) {
        correctAnswers++;
        correctAudio.play();
    } else {
        wrongAnswers++;
        wrongAudio.play();
    }
    
    // Automatically move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}

function skipQuestion() {
    buttonAudio.play();
    unansweredQuestions.push(currentQuestionIndex + 1); // +1 to make it 1-based
    currentQuestionIndex++;
    displayQuestion();
}

function showUnansweredQuestions() {
    buttonAudio.play();
    if (unansweredQuestions.length > 0) {
        alert(`Soal yang belum dijawab: ${unansweredQuestions.join(', ')}`);
    } else {
        alert('Semua soal telah dijawab.');
    }
}

function finishExam() {
    buttonAudio.play();
    clearInterval(timerInterval);
    
    // Calculate unanswered questions
    for (let i = 0; i < allQuestions.length; i++) {
        if (!selectedOptions[i] && !unansweredQuestions.includes(i + 1)) {
            unansweredQuestions.push(i + 1);
            wrongAnswers++; // Count unanswered as wrong
        }
    }
    
    // Calculate score
    const totalQuestions = allQuestions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Show results screen
    examScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
    currentScreen = 'results';
    
    // Display results
    document.getElementById('totalQuestionsResult').textContent = totalQuestions;
    document.getElementById('correctAnswers').textContent = correctAnswers;
    document.getElementById('wrongAnswers').textContent = wrongAnswers + (totalQuestions - correctAnswers - wrongAnswers);
    document.getElementById('finalScore').textContent = score;
    
    // Generate certificate
    generateCertificate(score);
    
    // Play applause
    applauseAudio.play();
    
    // Save participant results (in a real app, this would go to a database)
    saveParticipantResults(score);
}

function generateCertificate(score) {
    const certificateContainer = document.getElementById('certificatePreview');
    
    // Generate certificate code
    const now = new Date();
    const dateStr = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    const randomCode = generateRandomCode(8);
    
    const certificateCode = `${participantData.fullName.toUpperCase().replace(/ /g, '_')}/${
        participantData.status.toUpperCase()}/${
        participantData.schoolLevel ? participantData.schoolLevel.toUpperCase() : 'UMUM'}/${
        examType.toUpperCase()}/${
        dateStr}/${
        randomCode}/PERGUNU-STB`;
    
    // Get motivation text based on score
    const motivationText = getMotivationText(score);
    
    // Certificate HTML
    certificateContainer.innerHTML = `
        <div class="certificate-content">
            <h2 class="certificate-title">SERTIFIKAT PRESTASI</h2>
            <p class="certificate-recipient">Diberikan Kepada</p>
            <h3>${formatName(participantData.fullName)}</h3>
            
            <p class="certificate-description">
                Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Ujian Pergunu Situbondo</strong><br><br>
                Sebagai penghargaan atas dedikasi dalam memahami materi ujian dan mengasah logika, sertifikat ini diberikan sebagai motivasi untuk terus berkembang.
            </p>
            
            <div class="certificate-score">${score}</div>
            
            <p class="certificate-motivation">${motivationText}</p>
            
            <div class="certificate-footer">
                <div class="certificate-date">
                    <p>Periode: Ditetapkan di:</p>
                    <p>Situbondo, ${formatDate(now)}</p>
                </div>
                
                <div class="certificate-signature">
                    <p>Ketua Pergunu Situbondo</p>
                    <p>Moh. Nuril Hudha, S.Pd., M.Si.</p>
                </div>
            </div>
            
            <div class="certificate-barcode">
                <p>${certificateCode}</p>
                <img src="assets/images/BARCODE.png" alt="Barcode">
            </div>
        </div>
    `;
}

function formatName(name) {
    return name.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function generateRandomCode(length) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getMotivationText(score) {
    if (score >= 90) return "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.";
    if (score >= 80) return "Hasil yang sangat memuaskan! Anda telah menunjukkan pemahaman yang mendalam.";
    if (score >= 70) return "Kerja bagus! Anda memiliki pemahaman yang baik tentang materi ini.";
    if (score >= 60) return "Hasil yang baik. Teruslah belajar untuk meningkatkan pemahaman Anda.";
    if (score >= 50) return "Anda telah menyelesaikan ujian ini. Tinjau kembali materi untuk hasil yang lebih baik.";
    return "Teruslah berusaha! Setiap kegagalan adalah langkah menuju kesuksesan.";
}

function saveParticipantResults(score) {
    const resultData = {
        participant: participantData,
        examType,
        examSubject,
        examClass,
        score,
        correctAnswers,
        wrongAnswers,
        unanswered: unansweredQuestions.length,
        timestamp: new Date().toISOString(),
        certificateCode: document.querySelector('.certificate-barcode p').textContent
    };
    
    // In a real app, this would save to a database
    console.log('Result data:', resultData);
}

function printCertificate() {
    buttonAudio.play();
    window.print();
}

function retakeExam() {
    buttonAudio.play();
    resultsScreen.style.display = 'none';
    examSelection.style.display = 'flex';
    currentScreen = 'selection';
}

// Floating Button Functions
function shareWebsite() {
    buttonAudio.play();
    const url = 'http://is.gd/ujianonline';
    if (navigator.share) {
        navigator.share({
            title: 'Ujian Online PERGUNU SITUBONDO',
            text: 'Ikuti ujian online profesional dari PERGUNU SITUBONDO',
            url: url
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(url);
        });
    } else {
        fallbackShare(url);
    }
}

function fallbackShare(url) {
    // Fallback for browsers that don't support Web Share API
    const shareText = `Ujian Online PERGUNU SITUBONDO - ${url}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Link telah disalin ke clipboard!');
        }).catch(err => {
            console.log('Could not copy text: ', err);
            prompt('Salin link berikut:', url);
        });
    } else {
        prompt('Salin link berikut:', url);
    }
}

function contactAdmin() {
    buttonAudio.play();
    const phone = '6285647709114';
    const message = 'Assalamualaikum mas admin, saya mau tanya sesuatu nih…';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}

function showQuestionBankModal() {
    buttonAudio.play();
    document.getElementById('modalTitle').textContent = 'Masukkan Kode Bank Soal';
    document.getElementById('modalCodeInput').placeholder = 'Kode Bank Soal';
    document.getElementById('modalCodeInput').value = '';
    document.getElementById('modalSubmitBtn').dataset.action = 'questionBank';
    document.getElementById('codeModal').style.display = 'flex';
}

function showAdminPanelModal() {
    buttonAudio.play();
    document.getElementById('modalTitle').textContent = 'Masukkan Kode Admin';
    document.getElementById('modalCodeInput').placeholder = 'Kode Admin';
    document.getElementById('modalCodeInput').value = '';
    document.getElementById('modalSubmitBtn').dataset.action = 'adminPanel';
    document.getElementById('codeModal').style.display = 'flex';
}

function closeModal() {
    buttonAudio.play();
    document.getElementById('codeModal').style.display = 'none';
}

function handleModalSubmit() {
    buttonAudio.play();
    const code = document.getElementById('modalCodeInput').value;
    const action = document.getElementById('modalSubmitBtn').dataset.action;
    
    if (action === 'questionBank' && code === 'OPENLOCK-1926') {
        window.location.href = 'panel/bank-soal.html';
    } else if (action === 'adminPanel' && code === '65614222') {
        window.location.href = 'panel/admin.html';
    } else {
        alert('Kode yang dimasukkan salah. Silakan coba lagi.');
    }
}

// Sample Questions Data (in a real app, this would come from a database)
function loadSampleQuestions() {
    // This is just a sample - in a real app, you would load from JSON
    sampleQuestions = [
        // Agama questions
        {
            id: 1,
            subject: 'agama',
            level: 'sd',
            category: 'pelajar',
            text: 'Berapa jumlah Rukun Iman?',
            options: ['4', '5', '6', '7'],
            correctAnswer: 'C',
            explanation: 'Rukun Iman ada 6 yaitu: 1. Iman kepada Allah, 2. Iman kepada Malaikat, 3. Iman kepada Kitab-kitab, 4. Iman kepada Rasul, 5. Iman kepada Hari Kiamat, 6. Iman kepada Qada dan Qadar.'
        },
        {
            id: 2,
            subject: 'agama',
            level: 'smp',
            category: 'pelajar',
            text: 'Siapakah nama malaikat yang bertugas menyampaikan wahyu?',
            options: ['Mikail', 'Israfil', 'Jibril', 'Izrail'],
            correctAnswer: 'C',
            explanation: 'Malaikat Jibril bertugas menyampaikan wahyu dari Allah kepada para Nabi dan Rasul.'
        },
        // Add more sample questions for all subjects and categories...
        
        // Logika questions
        {
            id: 101,
            category: 'logika',
            text: 'Jika semua manusia adalah makhluk hidup, dan Budi adalah manusia, maka:',
            options: [
                'Budi adalah makhluk hidup',
                'Budi bukan makhluk hidup',
                'Beberapa manusia bukan makhluk hidup',
                'Tidak dapat disimpulkan'
            ],
            correctAnswer: 'A',
            explanation: 'Dari premis "semua manusia adalah makhluk hidup" dan "Budi adalah manusia", maka dapat disimpulkan bahwa "Budi adalah makhluk hidup".'
        },
        
        // CPNS questions
        {
            id: 201,
            category: 'cpns',
            text: 'Negara Kesatuan Republik Indonesia adalah negara yang berdasarkan Pancasila yang tercantum dalam Pembukaan UUD 1945 alinea ke:',
            options: ['1', '2', '3', '4'],
            correctAnswer: 'D',
            explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea keempat Pembukaan UUD 1945.'
        }
    ];
}

// Update the generateCertificate function in main.js
function generateCertificate(score) {
    const certificateContainer = document.getElementById('certificatePreview');
    certificateContainer.innerHTML = '';
    
    // Create certificate wrapper
    const certificateWrapper = document.createElement('div');
    certificateWrapper.className = 'certificate-wrapper no-print';
    certificateWrapper.style.background = 'white';
    certificateWrapper.style.padding = '20px';
    certificateWrapper.style.borderRadius = '10px';
    certificateWrapper.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    certificateWrapper.style.marginBottom = '30px';
    
    // Create certificate content
    const certificateContent = document.createElement('div');
    certificateContent.className = 'certificate-content';
    certificateContent.style.position = 'relative';
    certificateContent.style.textAlign = 'center';
    certificateContent.style.padding = '40px';
    certificateContent.style.maxWidth = '800px';
    certificateContent.style.margin = '0 auto';
    certificateContent.style.backgroundImage = 'url("../assets/images/certificate.png")';
    certificateContent.style.backgroundSize = 'cover';
    certificateContent.style.backgroundPosition = 'center';
    certificateContent.style.backgroundRepeat = 'no-repeat';
    
    // Generate certificate code
    const now = new Date();
    const dateStr = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    const randomCode = generateRandomCode(8);
    const certificateCode = `${participantData.fullName.toUpperCase().replace(/ /g, '_')}/${
        participantData.status.toUpperCase()}/${
        participantData.schoolLevel ? participantData.schoolLevel.toUpperCase() : 'UMUM'}/${
        examType.toUpperCase()}/${
        dateStr}/${
        randomCode}/PERGUNU-STB`;
    
    // Get motivation text based on score
    const motivationText = getMotivationText(score);
    
    // Certificate content HTML
    certificateContent.innerHTML = `
        <div style="position: relative; z-index: 2;">
            <h2 class="certificate-title" style="font-size: 36px; font-weight: 700; color: #2c3e50; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;">
                SERTIFIKAT PRESTASI
            </h2>
            
            <p class="certificate-recipient" style="font-size: 18px; color: #555; margin-bottom: 10px;">
                Diberikan Kepada
            </p>
            
            <h3 style="font-size: 28px; color: #2c3e50; margin-bottom: 40px; border-bottom: 2px solid #3498db; display: inline-block; padding-bottom: 10px;">
                ${formatName(participantData.fullName)}
            </h3>
            
            <p class="certificate-description" style="font-size: 18px; line-height: 1.6; color: #555; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">
                Atas Partisipasi & Pencapaian Luar Biasa dalam <strong style="color: #2c3e50;">Ujian Pergunu Situbondo</strong><br><br>
                Sebagai penghargaan atas dedikasi dalam memahami materi ujian dan mengasah logika, sertifikat ini diberikan sebagai motivasi untuk terus berkembang.
            </p>
            
            <div class="certificate-score" style="font-size: 72px; font-weight: 700; color: #8e44ad; margin: 30px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                ${score}
            </div>
            
            <p class="certificate-motivation" style="font-style: italic; color: #555; margin-bottom: 40px; font-size: 16px;">
                ${motivationText}
            </p>
            
            <div style="display: flex; justify-content: space-between; margin-top: 60px;">
                <div style="text-align: left;">
                    <p style="margin: 0; color: #555;">Periode: Ditetapkan di:</p>
                    <p style="margin: 0; font-weight: 600; color: #2c3e50;">Situbondo, ${formatDate(now)}</p>
                </div>
                
                <div style="text-align: right;">
                    <p style="margin: 0 0 40px 0; font-weight: 600; color: #2c3e50;">Ketua Pergunu Situbondo</p>
                    <p style="margin: 0; color: #555;">Moh. Nuril Hudha, S.Pd., M.Si.</p>
                </div>
            </div>
            
            <div class="certificate-barcode" style="margin-top: 40px; text-align: center;">
                <p style="font-family: monospace; letter-spacing: 1px; color: #555; margin-bottom: 10px;">${certificateCode}</p>
                <img src="../assets/images/BARCODE.png" alt="Barcode" style="height: 60px;">
            </div>
        </div>
    `;
    
    // Create score summary (not for printing)
    const scoreSummary = document.createElement('div');
    scoreSummary.className = 'score-summary no-print';
    scoreSummary.style.background = '#f9f9f9';
    scoreSummary.style.padding = '20px';
    scoreSummary.style.borderRadius = '8px';
    scoreSummary.style.marginTop = '30px';
    
    scoreSummary.innerHTML = `
        <h3 style="margin-top: 0; color: #2c3e50;">Detail Nilai Ujian</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div>
                <p style="margin: 0; color: #555;">Total Soal</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #2c3e50;">${allQuestions.length}</p>
            </div>
            <div>
                <p style="margin: 0; color: #555;">Jawaban Benar</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #27ae60;">${correctAnswers}</p>
            </div>
            <div>
                <p style="margin: 0; color: #555;">Jawaban Salah</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #e74c3c;">${wrongAnswers}</p>
            </div>
            <div>
                <p style="margin: 0; color: #555;">Tidak Dijawab</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #f39c12;">${allQuestions.length - correctAnswers - wrongAnswers}</p>
            </div>
        </div>
    `;
    
    // Append elements
    certificateWrapper.appendChild(certificateContent);
    certificateWrapper.appendChild(scoreSummary);
    certificateContainer.appendChild(certificateWrapper);
    
    // Update print button functionality
    document.getElementById('printCertificateBtn').onclick = function() {
        // Hide elements before printing
        const elementsToHide = document.querySelectorAll('.no-print');
        elementsToHide.forEach(el => el.style.display = 'none');
        
        // Print only the certificate content
        const printContent = certificateContent.innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                <div style="width: 210mm; height: 297mm; padding: 20mm;">
                    ${printContent}
                </div>
            </div>
        `;
        
        window.print();
        
        // Restore original content
        document.body.innerHTML = originalContent;
        elementsToHide.forEach(el => el.style.display = '');
    };
}
