// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentScreen = 'opening';
    let participantData = {};
    let examData = {};
    let questions = [];
    let currentQuestionIndex = 0;
    let timer;
    let timeLeft = 120 * 60; // 120 minutes in seconds
    let score = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    let totalQuestions = 0;
    
    // Default codes
    const defaultCodes = {
        login: '12345',
        cpns: 'OPENLOCK-1926',
        bank: 'OPENLOCK-1926',
        admin: '65614222'
    };
    
    // Sample questions for demonstration
    const sampleQuestions = {
        agama: [
            {
                question: "Apa rukun Islam yang pertama?",
                options: {
                    a: "Shalat",
                    b: "Puasa",
                    c: "Syahadat",
                    d: "Zakat",
                    e: "Haji"
                },
                correctAnswer: "c",
                explanation: "Rukun Islam yang pertama adalah mengucapkan dua kalimat syahadat."
            }
        ],
        ppkn: [
            {
                question: "Pancasila sebagai dasar negara tercantum dalam?",
                options: {
                    a: "Pembukaan UUD 1945",
                    b: "Batang Tubuh UUD 1945",
                    c: "Penjelasan UUD 1945",
                    d: "Keputusan Presiden",
                    e: "Peraturan Pemerintah"
                },
                correctAnswer: "a",
                explanation: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 alinea keempat."
            }
        ],
        sejarah: [
            {
                question: "Kapan Indonesia merdeka?",
                options: {
                    a: "16 Agustus 1945",
                    b: "17 Agustus 1945",
                    c: "18 Agustus 1945",
                    d: "19 Agustus 1945",
                    e: "20 Agustus 1945"
                },
                correctAnswer: "b",
                explanation: "Indonesia merdeka pada tanggal 17 Agustus 1945."
            }
        ],
        ipa: [
            {
                question: "Planet terdekat dari matahari adalah?",
                options: {
                    a: "Venus",
                    b: "Bumi",
                    c: "Mars",
                    d: "Merkurius",
                    e: "Jupiter"
                },
                correctAnswer: "d",
                explanation: "Merkurius adalah planet terdekat dari matahari dalam tata surya kita."
            }
        ],
        ips: [
            {
                question: "Ibu kota provinsi Jawa Timur adalah?",
                options: {
                    a: "Surabaya",
                    b: "Malang",
                    c: "Sidoarjo",
                    d: "Kediri",
                    e: "Madiun"
                },
                correctAnswer: "a",
                explanation: "Ibu kota provinsi Jawa Timur adalah Surabaya."
            }
        ],
        matematika: [
            {
                question: "Berapakah hasil dari 7 x 8?",
                options: {
                    a: "48",
                    b: "54",
                    c: "56",
                    d: "64",
                    e: "72"
                },
                correctAnswer: "c",
                explanation: "Hasil dari 7 x 8 adalah 56."
            }
        ],
        bahasa_indonesia: [
            {
                question: "Apa yang dimaksud dengan antonim?",
                options: {
                    a: "Kata yang memiliki arti sama",
                    b: "Kata yang memiliki arti berlawanan",
                    c: "Kata yang berasal dari bahasa asing",
                    d: "Kata yang tidak baku",
                    e: "Kata yang jarang digunakan"
                },
                correctAnswer: "b",
                explanation: "Antonim adalah kata yang memiliki arti berlawanan."
            }
        ],
        bahasa_inggris: [
            {
                question: "What is the meaning of 'book' in Indonesian?",
                options: {
                    a: "Pensil",
                    b: "Buku",
                    c: "Meja",
                    d: "Papan tulis",
                    e: "Pulpen"
                },
                correctAnswer: "b",
                explanation: "Arti dari 'book' dalam bahasa Indonesia adalah 'buku'."
            }
        ],
        materi_extra: [
            {
                question: "Siapakah pencipta lagu Indonesia Raya?",
                options: {
                    a: "W.R. Supratman",
                    b: "C. Simanjuntak",
                    c: "Ismail Marzuki",
                    d: "Gesang",
                    e: "Ibu Sud"
                },
                correctAnswer: "a",
                explanation: "Lagu Indonesia Raya diciptakan oleh Wage Rudolf Supratman."
            }
        ],
        materi_khusus: [
            {
                question: "Apa nama kitab suci agama Hindu?",
                options: {
                    a: "Al-Quran",
                    b: "Alkitab",
                    c: "Tripitaka",
                    d: "Wedha",
                    e: "Talmud"
                },
                correctAnswer: "d",
                explanation: "Kitab suci agama Hindu adalah Wedha."
            }
        ],
        ujian_logika: [
            {
                question: "Jika semua manusia adalah makhluk hidup, dan Budi adalah manusia, maka:",
                options: {
                    a: "Budi adalah makhluk hidup",
                    b: "Budi bukan makhluk hidup",
                    c: "Semua makhluk hidup adalah Budi",
                    d: "Tidak ada yang benar",
                    e: "Semua benar"
                },
                correctAnswer: "a",
                explanation: "Jika semua manusia adalah makhluk hidup, dan Budi adalah manusia, maka Budi adalah makhluk hidup."
            }
        ],
        ujian_cpns: [
            {
                question: "Sistem pemerintahan Indonesia berdasarkan UUD 1945 adalah:",
                options: {
                    a: "Presidensial",
                    b: "Parlamen",
                    c: "Monarki",
                    d: "Federal",
                    e: "Komunis"
                },
                correctAnswer: "a",
                explanation: "Sistem pemerintahan Indonesia berdasarkan UUD 1945 adalah presidensial."
            }
        ]
    };
    
    // Motivational messages based on score
    const motivationalMessages = [
        { min: 0, max: 40, message: "Jangan menyerah! Teruslah belajar dan tingkatkan kemampuan Anda." },
        { min: 41, max: 60, message: "Hasil yang cukup baik. Tingkatkan lagi untuk hasil yang lebih maksimal!" },
        { min: 61, max: 80, message: "Kerja bagus! Anda sudah menguasai sebagian besar materi." },
        { min: 81, max: 95, message: "Luar biasa! Hampir sempurna dalam menguasai materi ini." },
        { min: 96, max: 100, message: "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini." }
    ];
    
    // DOM Elements
    const loginCodeInput = document.getElementById('loginCode');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const agreeTerms = document.getElementById('agreeTerms');
    const continueBtn = document.getElementById('continueBtn');
    const participantForm = document.getElementById('participantDataForm');
    const pelajarRadio = document.getElementById('pelajar');
    const umumRadio = document.getElementById('umum');
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    const startExamBtn = document.getElementById('startExamBtn');
    const cpnsLicenseForm = document.getElementById('cpnsLicenseForm');
    const verifyLicenseBtn = document.getElementById('verifyLicenseBtn');
    const licenseError = document.getElementById('licenseError');
    const examTimer = document.getElementById('examTimer');
    const currentQuestionElement = document.getElementById('currentQuestion');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const explanationBox = document.getElementById('explanationBox');
    const explanationText = document.getElementById('explanationText');
    const finishExamBtn = document.getElementById('finishExamBtn');
    const skipQuestionBtn = document.getElementById('skipQuestionBtn');
    const unansweredBtn = document.getElementById('unansweredBtn');
    const timeWarning = document.getElementById('timeWarning');
    const finalScore = document.getElementById('finalScore');
    const totalQuestionsStat = document.getElementById('totalQuestionsStat');
    const correctAnswersElement = document.getElementById('correctAnswers');
    const wrongAnswersElement = document.getElementById('wrongAnswers');
    const unansweredElement = document.getElementById('unanswered');
    const certificatePreview = document.getElementById('certificatePreview');
    const printCertificateBtn = document.getElementById('printCertificateBtn');
    const retakeExamBtn = document.getElementById('retakeExamBtn');
    const shareBtn = document.getElementById('shareBtn');
    const whatsappBtn = document.getElementById('whatsappBtn');
    const goToBtn = document.getElementById('goToBtn');
    const questionBankBtn = document.getElementById('questionBankBtn');
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    const musicBtn = document.getElementById('musicBtn');
    const musicPlayer = document.getElementById('musicPlayer');
    const closePlayerBtn = document.getElementById('closePlayerBtn');
    const musicPlaylist = document.getElementById('musicPlaylist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevTrackBtn = document.getElementById('prevTrackBtn');
    const nextTrackBtn = document.getElementById('nextTrackBtn');
    const volumeControl = document.getElementById('volumeControl');
    const volumeIcon = document.getElementById('volumeIcon');
    const goToMenu = document.getElementById('goToMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const websiteLinksList = document.getElementById('websiteLinksList');
    const adminAccess = document.getElementById('adminAccess');
    const adminAccessCode = document.getElementById('adminAccessCode');
    const verifyAdminBtn = document.getElementById('verifyAdminBtn');
    const adminError = document.getElementById('adminError');
    const bankAccessCode = document.getElementById('bankAccessCode');
    const accessBankBtn = document.getElementById('accessBankBtn');
    const bankError = document.getElementById('bankError');
    
    // Screen elements
    const screens = {
        opening: document.getElementById('openingScreen'),
        terms: document.getElementById('termsScreen'),
        participant: document.getElementById('participantForm'),
        examSelection: document.getElementById('examSelection'),
        exam: document.getElementById('examScreen'),
        results: document.getElementById('resultsScreen'),
        admin: document.getElementById('adminPanel'),
        bank: document.getElementById('questionBank')
    };
    
    // Audio elements
    const audioElements = {
        opening: new Audio('assets/audio/opening.mp3'),
        applause: new Audio('assets/audio/applause.mp3'),
        correct: new Audio('assets/audio/jawabanbenar.mp3'),
        wrong: new Audio('assets/audio/jawbansalah.mp3'),
        button: new Audio('assets/audio/audiotombol.mp3')
    };
    
    // Initialize particles.js
    particlesJS.load('particles-js', 'js/particles.json', function() {
        console.log('Particles.js loaded');
    });
    
    // Play opening audio
    audioElements.opening.play();
    
    // Event Listeners
    loginBtn.addEventListener('click', verifyLoginCode);
    agreeTerms.addEventListener('change', toggleContinueButton);
    continueBtn.addEventListener('click', showParticipantForm);
    pelajarRadio.addEventListener('change', toggleParticipantFields);
    umumRadio.addEventListener('change', toggleParticipantFields);
    getLocationBtn.addEventListener('click', getLocation);
    participantForm.addEventListener('submit', saveParticipantData);
    verifyLicenseBtn.addEventListener('click', verifyLicenseCode);
    startExamBtn.addEventListener('click', startExam);
    skipQuestionBtn.addEventListener('click', skipQuestion);
    unansweredBtn.addEventListener('click', showUnanswered);
    finishExamBtn.addEventListener('click', finishExam);
    printCertificateBtn.addEventListener('click', printCertificate);
    retakeExamBtn.addEventListener('click', retakeExam);
    shareBtn.addEventListener('click', shareWebsite);
    whatsappBtn.addEventListener('click', contactAdmin);
    goToBtn.addEventListener('click', showGoToMenu);
    questionBankBtn.addEventListener('click', showQuestionBankAccess);
    adminPanelBtn.addEventListener('click', showAdminAccess);
    musicBtn.addEventListener('click', toggleMusicPlayer);
    closePlayerBtn.addEventListener('click', closeMusicPlayer);
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevTrackBtn.addEventListener('click', playPreviousTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);
    volumeControl.addEventListener('input', changeVolume);
    closeMenuBtn.addEventListener('click', closeGoToMenu);
    verifyAdminBtn.addEventListener('click', verifyAdminCode);
    accessBankBtn.addEventListener('click', verifyBankCode);
    
    // Functions
    function verifyLoginCode() {
        playButtonSound();
        
        if (loginCodeInput.value === defaultCodes.login) {
            hideScreen('opening');
            showScreen('terms');
        } else {
            loginError.textContent = "Kode login salah. Silakan coba lagi.";
            loginError.style.display = "block";
        }
    }
    
    function toggleContinueButton() {
        playButtonSound();
        continueBtn.disabled = !agreeTerms.checked;
    }
    
    function showParticipantForm() {
        playButtonSound();
        hideScreen('terms');
        showScreen('participant');
    }
    
    function toggleParticipantFields() {
        playButtonSound();
        const pelajarFields = document.querySelectorAll('.pelajar-fields');
        const umumFields = document.querySelectorAll('.umum-fields');
        
        if (pelajarRadio.checked) {
            pelajarFields.forEach(field => field.style.display = 'block');
            umumFields.forEach(field => field.style.display = 'none');
        } else {
            pelajarFields.forEach(field => field.style.display = 'none');
            umumFields.forEach(field => field.style.display = 'block');
        }
    }
    
    function getLocation() {
        playButtonSound();
        locationStatus.textContent = "Mencoba mendapatkan lokasi...";
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    document.getElementById('address').value = `${latitude}, ${longitude}`;
                    locationStatus.textContent = "Lokasi berhasil didapatkan!";
                },
                error => {
                    console.error("Error getting location:", error);
                    locationStatus.textContent = "Gagal mendapatkan lokasi: " + error.message;
                }
            );
        } else {
            locationStatus.textContent = "Geolocation tidak didukung oleh browser Anda.";
        }
    }
    
    function saveParticipantData(e) {
        e.preventDefault();
        playButtonSound();
        
        // Collect participant data
        participantData = {
            fullName: document.getElementById('fullName').value,
            status: document.querySelector('input[name="status"]:checked').value,
            schoolName: document.getElementById('schoolName').value,
            studentId: document.getElementById('studentId').value,
            studentPurpose: document.getElementById('studentPurpose').value,
            schoolLevel: document.getElementById('schoolLevel').value,
            address: document.getElementById('address').value,
            whatsapp: document.getElementById('whatsapp').value,
            email: document.getElementById('email').value,
            generalPurpose: document.getElementById('generalPurpose').value
        };
        
        // Validate all required fields
        let isValid = true;
        
        if (!participantData.fullName) {
            isValid = false;
            alert("Nama lengkap harus diisi!");
        }
        
        if (participantData.status === 'pelajar') {
            if (!participantData.schoolName || !participantData.studentId || !participantData.studentPurpose || !participantData.schoolLevel) {
                isValid = false;
                alert("Semua data pelajar harus diisi!");
            }
        } else {
            if (!participantData.address || !participantData.whatsapp || !participantData.email || !participantData.generalPurpose) {
                isValid = false;
                alert("Semua data umum harus diisi!");
            }
        }
        
        if (isValid) {
            hideScreen('participant');
            showScreen('examSelection');
            setupExamSelection();
        }
    }
    
    function setupExamSelection() {
        if (participantData.status === 'pelajar') {
            document.querySelector('.pelajar-options').style.display = 'block';
            document.querySelector('.umum-options').style.display = 'none';
            
            // Setup class buttons based on school level
            const classButtonsContainer = document.getElementById('classButtons');
            classButtonsContainer.innerHTML = '';
            
            let classes = [];
            if (participantData.schoolLevel === 'SD') {
                classes = ['Kelas IV', 'Kelas V', 'Kelas VI'];
            } else if (participantData.schoolLevel === 'SMP') {
                classes = ['Kelas VII', 'Kelas VIII', 'Kelas IX'];
            } else {
                classes = ['Kelas X', 'Kelas XI', 'Kelas XII'];
            }
            
            classes.forEach(className => {
                const btn = document.createElement('button');
                btn.className = 'btn-subject';
                btn.textContent = className;
                btn.dataset.class = className.toLowerCase().replace(' ', '-');
                btn.addEventListener('click', function() {
                    playButtonSound();
                    document.querySelectorAll('#classButtons .btn-subject').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    checkExamReady();
                });
                classButtonsContainer.appendChild(btn);
            });
        } else {
            document.querySelector('.pelajar-options').style.display = 'none';
            document.querySelector('.umum-options').style.display = 'block';
            
            // Setup general exam options
            document.querySelectorAll('.umum-options .btn-subject').forEach(btn => {
                btn.addEventListener('click', function() {
                    playButtonSound();
                    document.querySelectorAll('.umum-options .btn-subject').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (this.dataset.subject === 'ujian_cpns') {
                        cpnsLicenseForm.style.display = 'block';
                    } else {
                        cpnsLicenseForm.style.display = 'none';
                        examData.subject = this.dataset.subject;
                        checkExamReady();
                    }
                });
            });
        }
        
        // Setup subject buttons
        document.querySelectorAll('.subject-selection .btn-subject').forEach(btn => {
            btn.addEventListener('click', function() {
                playButtonSound();
                document.querySelectorAll('.subject-selection .btn-subject').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                examData.subject = this.dataset.subject;
                checkExamReady();
            });
        });
    }
    
    function verifyLicenseCode() {
        playButtonSound();
        
        if (document.getElementById('cpnsLicenseCode').value === defaultCodes.cpns) {
            examData.subject = 'ujian_cpns';
            licenseError.style.display = 'none';
            checkExamReady();
        } else {
            licenseError.textContent = "Kode lisensi salah. Silakan coba lagi.";
            licenseError.style.display = "block";
        }
    }
    
    function checkExamReady() {
        if (participantData.status === 'pelajar') {
            const classSelected = document.querySelector('#classButtons .btn-subject.active');
            const subjectSelected = document.querySelector('.subject-selection .btn-subject.active');
            
            if (classSelected && subjectSelected) {
                examData.class = classSelected.dataset.class;
                examData.subject = subjectSelected.dataset.subject;
                startExamBtn.disabled = false;
            } else {
                startExamBtn.disabled = true;
            }
        } else {
            const subjectSelected = document.querySelector('.umum-options .btn-subject.active');
            
            if (subjectSelected) {
                if (subjectSelected.dataset.subject === 'ujian_cpns') {
                    if (document.getElementById('cpnsLicenseCode').value === defaultCodes.cpns) {
                        startExamBtn.disabled = false;
                    } else {
                        startExamBtn.disabled = true;
                    }
                } else {
                    startExamBtn.disabled = false;
                }
            } else {
                startExamBtn.disabled = true;
            }
        }
    }
    
    function startExam() {
        playButtonSound();
        hideScreen('examSelection');
        showScreen('exam');
        
        // Load questions based on selected subject
        questions = sampleQuestions[examData.subject] || [];
        totalQuestions = questions.length;
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        unanswered = 0;
        
        // Set timer (120 minutes by default)
        timeLeft = 120 * 60;
        updateTimerDisplay();
        timer = setInterval(updateTimer, 1000);
        
        // Update question counters
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        totalQuestionsElement.textContent = totalQuestions;
        
        // Display first question
        displayQuestion();
    }
    
    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionText.textContent = question.question;
            
            // Clear previous options
            optionsContainer.innerHTML = '';
            
            // Add new options
            for (const [key, value] of Object.entries(question.options)) {
                const optionBtn = document.createElement('button');
                optionBtn.className = 'option-btn';
                optionBtn.textContent = `${key.toUpperCase()}. ${value}`;
                optionBtn.dataset.option = key;
                optionBtn.addEventListener('click', selectAnswer);
                optionsContainer.appendChild(optionBtn);
            }
            
            // Hide explanation
            explanationBox.style.display = 'none';
        } else {
            finishExam();
        }
    }
    
    function selectAnswer(e) {
        playButtonSound();
        const selectedOption = e.target.dataset.option;
        const question = questions[currentQuestionIndex];
        
        // Disable all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.add('disabled');
            btn.removeEventListener('click', selectAnswer);
        });
        
        // Highlight selected option
        e.target.classList.add('selected');
        
        // Check if answer is correct
        if (selectedOption === question.correctAnswer) {
            e.target.classList.add('correct');
            playCorrectSound();
            score += 10; // 10 points per correct answer
            correctAnswers++;
        } else {
            e.target.classList.add('incorrect');
            playWrongSound();
            wrongAnswers++;
            
            // Highlight correct answer
            document.querySelector(`.option-btn[data-option="${question.correctAnswer}"]`).classList.add('correct');
        }
        
        // Show explanation
        explanationText.textContent = question.explanation;
        explanationBox.style.display = 'block';
        
        // Update counters
        currentQuestionIndex++;
        currentQuestionElement.textContent = currentQuestionIndex + 1;
    }
    
    function skipQuestion() {
        playButtonSound();
        unanswered++;
        currentQuestionIndex++;
        currentQuestionElement.textContent = currentQuestionIndex + 1;
        displayQuestion();
    }
    
    function showUnanswered() {
        playButtonSound();
        // Implement logic to show unanswered questions
        alert("Fitur ini akan menampilkan soal-soal yang belum dijawab.");
    }
    
    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            finishExam();
        } else if (timeLeft === 10 * 60) { // 10 minutes left
            showTimeWarning();
        } else if (timeLeft === 1 * 60) { // 1 minute left
            hideTimeWarning();
        }
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        examTimer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Make timer bigger when 10 minutes or less
        if (timeLeft <= 10 * 60) {
            examTimer.style.fontSize = '24px';
            examTimer.style.color = 'var(--error-color)';
        } else {
            examTimer.style.fontSize = '18px';
            examTimer.style.color = 'var(--primary-color)';
        }
    }
    
    function showTimeWarning() {
        timeWarning.style.display = 'block';
        setTimeout(() => {
            timeWarning.style.opacity = '1';
        }, 100);
    }
    
    function hideTimeWarning() {
        timeWarning.style.opacity = '0';
        setTimeout(() => {
            timeWarning.style.display = 'none';
        }, 500);
    }
    
    function finishExam() {
        playButtonSound();
        clearInterval(timer);
        
        // Calculate unanswered questions
        unanswered += questions.length - (correctAnswers + wrongAnswers);
        
        // Hide exam screen and show results
        hideScreen('exam');
        showScreen('results');
        
        // Display results
        finalScore.textContent = Math.round((correctAnswers / totalQuestions) * 100);
        totalQuestionsStat.textContent = totalQuestions;
        correctAnswersElement.textContent = correctAnswers;
        wrongAnswersElement.textContent = wrongAnswers;
        unansweredElement.textContent = unanswered;
        
        // Generate certificate
        generateCertificate();
        
        // Play applause sound
        audioElements.applause.play();
    }
    
    function generateCertificate() {
        // Generate certificate code
        const now = new Date();
        const dateStr = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                          Math.random().toString(36).substring(2, 6).toUpperCase();
        
        const certificateCode = `${participantData.fullName.toUpperCase().replace(/ /g, '_')}/${
            participantData.status.toUpperCase()}/${
            participantData.schoolLevel ? participantData.schoolLevel.toUpperCase() : 'UMUM'}/${
            examData.subject.toUpperCase()}/${
            dateStr}/${
            randomCode}/PERGUNU-STB`;
        
        // Get motivation message based on score
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        let motivation = "";
        
        for (const msg of motivationalMessages) {
            if (percentage >= msg.min && percentage <= msg.max) {
                motivation = msg.message;
                break;
            }
        }
        
        // Create certificate HTML
        certificatePreview.innerHTML = `
            <div class="certificate-content">
                <div class="certificate-title">SERTIFIKAT PRESTASI</div>
                <div class="certificate-recipient">Diberikan Kepada</div>
                <div class="certificate-recipient-name">${participantData.fullName}</div>
                <div class="certificate-text">Atas Partisipasi & Pencapaian Luar Biasa dalam <strong>Ujian Pergunu Situbondo</strong></div>
                <div class="certificate-text">Sebagai penghargaan atas dedikasi dalam memahami materi ujian dan mengasah logika, sertifikat ini diberikan sebagai motivasi untuk terus berkembang.</div>
                <div class="certificate-score">Nilai: ${percentage}</div>
                <div class="certificate-motivation">${motivation}</div>
                <div class="certificate-footer">
                    <div class="certificate-code">Kode Sertifikat: ${certificateCode}</div>
                    <div class="certificate-date">Ditetapkan di: Situbondo, ${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div class="certificate-signature">
                        <div>Ketua Pergunu Situbondo</div>
                        <div style="margin-top: 30px; font-weight: bold;">Moh. Nuril Hudha, S.Pd., M.Si.</div>
                    </div>
                    <div class="certificate-barcode">
                        <img src="assets/images/BARCODE.png" alt="Barcode">
                    </div>
                </div>
            </div>
        `;
    }
    
    function printCertificate() {
        playButtonSound();
        window.print();
    }
    
    function retakeExam() {
        playButtonSound();
        hideScreen('results');
        showScreen('examSelection');
    }
    
    function shareWebsite() {
        playButtonSound();
        if (navigator.share) {
            navigator.share({
                title: 'Ujian Online PERGUNU Situbondo',
                text: 'Ikuti ujian online dari PERGUNU Situbondo sekarang!',
                url: 'http://is.gd/ujianonline'
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareUrl = 'http://is.gd/ujianonline';
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = shareUrl;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('Link telah disalin ke clipboard: ' + shareUrl);
        }
    }
    
    function contactAdmin() {
        playButtonSound();
        const phoneNumber = '6285647709114';
        const message = 'Assalamualaikum mas admin, saya mau tanya sesuatu nih…';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    function showGoToMenu() {
        playButtonSound();
        goToMenu.style.display = 'block';
        
        // Load website links (in a real app, these would come from a database or settings)
        const links = [
            { name: 'Website PERGUNU', url: 'https://pergunu.github.io/pergunusmart/' },
            { name: 'Contoh Link 1', url: 'http://example.com' },
            { name: 'Contoh Link 2', url: 'http://anothersite.com' }
        ];
        
        websiteLinksList.innerHTML = '';
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.name;
            a.target = '_blank';
            li.appendChild(a);
            websiteLinksList.appendChild(li);
        });
    }
    
    function closeGoToMenu() {
        playButtonSound();
        goToMenu.style.display = 'none';
    }
    
    function showQuestionBankAccess() {
        playButtonSound();
        bankAccess.style.display = 'flex';
    }
    
    function verifyBankCode() {
        playButtonSound();
        
        if (bankAccessCode.value === defaultCodes.bank) {
            bankError.style.display = 'none';
            bankAccess.style.display = 'none';
            hideScreen(currentScreen);
            showScreen('bank');
            currentScreen = 'bank';
            
            // Show bank content
            document.querySelector('.bank-content').style.display = 'block';
            
            // Load questions (in a real app, this would come from a database)
            loadQuestionBank();
        } else {
            bankError.textContent = "Kode bank soal salah. Silakan coba lagi.";
            bankError.style.display = "block";
        }
    }
    
    function loadQuestionBank() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        // Combine all questions from all subjects
        let allQuestions = [];
        for (const [subject, qs] of Object.entries(sampleQuestions)) {
            qs.forEach(q => {
                q.subject = subject;
                allQuestions.push(q);
            });
        }
        
        // Display questions
        allQuestions.forEach((q, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            
            let difficultyClass = '';
            let difficultyText = '';
            
            // In a real app, difficulty would be part of the question data
            if (index % 3 === 0) {
                difficultyClass = 'easy';
                difficultyText = 'Mudah';
            } else if (index % 3 === 1) {
                difficultyClass = 'medium';
                difficultyText = 'Sedang';
            } else {
                difficultyClass = 'hard';
                difficultyText = 'Sulit';
            }
            
            questionItem.innerHTML = `
                <div class="question-item-header">
                    <span class="question-item-subject">${q.subject.toUpperCase()}</span>
                    <span class="question-item-difficulty ${difficultyClass}">${difficultyText}</span>
                </div>
                <div class="question-item-text">${q.question}</div>
                <div class="question-item-options">
                    ${Object.entries(q.options).map(([key, value]) => `
                        <div class="question-item-option ${key === q.correctAnswer ? 'correct' : ''}">
                            ${key.toUpperCase()}. ${value}
                        </div>
                    `).join('')}
                </div>
                <div class="question-item-actions">
                    <button class="question-item-btn edit">Edit</button>
                    <button class="question-item-btn delete">Hapus</button>
                    <button class="question-item-btn preview">Preview</button>
                </div>
            `;
            
            questionList.appendChild(questionItem);
        });
    }
    
    function showAdminAccess() {
        playButtonSound();
        adminAccess.style.display = 'flex';
    }
    
    function verifyAdminCode() {
        playButtonSound();
        
        if (adminAccessCode.value === defaultCodes.admin) {
            adminError.style.display = 'none';
            adminAccess.style.display = 'none';
            hideScreen(currentScreen);
            showScreen('admin');
            currentScreen = 'admin';
        } else {
            adminError.textContent = "Kode admin salah. Silakan coba lagi.";
            adminError.style.display = "block";
        }
    }
    
    function toggleMusicPlayer() {
        playButtonSound();
        if (musicPlayer.style.display === 'block') {
            closeMusicPlayer();
        } else {
            musicPlayer.style.display = 'block';
            
            // Load music playlist (in a real app, these would come from settings)
            const tracks = [
                { name: 'Musik Relaksasi 1', url: 'https://example.com/music1.mp3' },
                { name: 'Musik Relaksasi 2', url: 'https://example.com/music2.mp3' },
                { name: 'Musik Relaksasi 3', url: 'https://example.com/music3.mp3' }
            ];
            
            musicPlaylist.innerHTML = '';
            tracks.forEach(track => {
                const trackItem = document.createElement('div');
                trackItem.className = 'playlist-item';
                trackItem.textContent = track.name;
                trackItem.addEventListener('click', () => playTrack(track.url));
                musicPlaylist.appendChild(trackItem);
            });
        }
    }
    
    function closeMusicPlayer() {
        musicPlayer.style.display = 'none';
    }
    
    function playTrack(url) {
        // In a real app, this would play the selected track
        console.log('Playing:', url);
    }
    
    function togglePlayPause() {
        // In a real app, this would toggle play/pause
        console.log('Toggle play/pause');
    }
    
    function playPreviousTrack() {
        // In a real app, this would play previous track
        console.log('Previous track');
    }
    
    function playNextTrack() {
        // In a real app, this would play next track
        console.log('Next track');
    }
    
    function changeVolume() {
        const volume = volumeControl.value / 100;
        // In a real app, this would change audio volume
        console.log('Volume:', volume);
        
        // Update volume icon
        if (volume == 0) {
            volumeIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            volumeIcon.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }
    
    function hideScreen(screenName) {
        screens[screenName].style.display = 'none';
    }
    
    function showScreen(screenName) {
        screens[screenName].style.display = 'flex';
        currentScreen = screenName;
    }
    
    function playButtonSound() {
        audioElements.button.currentTime = 0;
        audioElements.button.play();
    }
    
    function playCorrectSound() {
        audioElements.correct.currentTime = 0;
        audioElements.correct.play();
    }
    
    function playWrongSound() {
        audioElements.wrong.currentTime = 0;
        audioElements.wrong.play();
    }
});
