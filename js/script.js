document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let currentScreen = 'opening';
    let participantData = {};
    let examData = {};
    let selectedSubject = '';
    let currentQuestionIndex = 0;
    let answers = [];
    let timerInterval;
    let timeLeft = 120 * 60; // 120 minutes in seconds
    let examQuestions = [];
    
    // DOM Elements
    const screens = {
        opening: document.getElementById('opening-screen'),
        terms: document.getElementById('terms-screen'),
        participantForm: document.getElementById('participant-form'),
        examSelection: document.getElementById('exam-selection'),
        exam: document.getElementById('exam-screen'),
        results: document.getElementById('results-screen'),
        certificate: document.getElementById('certificate-screen')
    };
    
    const examCodeInput = document.getElementById('exam-code');
    const enterBtn = document.getElementById('enter-btn');
    const agreeCheckbox = document.getElementById('agree-checkbox');
    const continueBtn = document.getElementById('continue-btn');
    const participantForm = document.getElementById('participant-data-form');
    const studentFields = document.getElementById('student-fields');
    const generalFields = document.getElementById('general-fields');
    const statusRadios = document.querySelectorAll('input[name="status"]');
    const startExamBtn = document.getElementById('start-exam-btn');
    const studentExamOptions = document.getElementById('student-exam-options');
    const generalExamOptions = document.getElementById('general-exam-options');
    const gradeOptions = document.getElementById('grade-options');
    const cpnsLicense = document.getElementById('cpns-license');
    const licenseCodeInput = document.getElementById('license-code');
    const verifyLicenseBtn = document.getElementById('verify-license');
    const examSubjectBtns = document.querySelectorAll('.btn-exam-subject');
    const generalPurposeSelect = document.getElementById('general-purpose');
    const examTitle = document.getElementById('exam-title');
    const timerElement = document.getElementById('timer');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const questionNumber = document.querySelector('.question-number');
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options-container');
    const answerExplanation = document.querySelector('.answer-explanation');
    const finishExamBtn = document.getElementById('finish-exam-btn');
    const skipQuestionBtn = document.getElementById('skip-question-btn');
    const unansweredBtn = document.getElementById('unanswered-btn');
    const timeWarning = document.getElementById('time-warning');
    const totalQuestionsEl = document.getElementById('total-questions');
    const correctAnswersEl = document.getElementById('correct-answers');
    const wrongAnswersEl = document.getElementById('wrong-answers');
    const examScoreEl = document.getElementById('exam-score');
    const viewCertificateBtn = document.getElementById('view-certificate-btn');
    const retakeExamBtn = document.getElementById('retake-exam-btn');
    const certificatePrint = document.getElementById('certificate-print');
    const participantNameEl = document.querySelector('.participant-name');
    const certificateDateEl = document.getElementById('certificate-date');
    const certificateCodeEl = document.getElementById('certificate-code');
    const scoreValueEl = document.querySelector('.score-value');
    const motivationTextEl = document.querySelector('.motivation-text');
    const printCertificateBtn = document.getElementById('print-certificate-btn');
    const backToResultsBtn = document.getElementById('back-to-results-btn');
    const floatingButtons = document.querySelector('.floating-buttons');
    const shareBtn = document.getElementById('share-btn');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const goToBtn = document.getElementById('go-to-btn');
    const bankSoalBtn = document.getElementById('bank-soal-btn');
    const adminPanelBtn = document.getElementById('admin-panel-btn');
    const codeModal = document.getElementById('code-modal');
    const accessCodeInput = document.getElementById('access-code');
    const submitCodeBtn = document.getElementById('submit-code');
    const shareModal = document.getElementById('share-modal');
    const shareLinkInput = document.getElementById('share-link');
    const whatsappModal = document.getElementById('whatsapp-modal');
    const whatsappMessage = document.getElementById('whatsapp-message');
    const sendWhatsappBtn = document.getElementById('send-whatsapp');
    const goToModal = document.getElementById('go-to-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const getLocationBtn = document.getElementById('get-location');
    const locationStatus = document.getElementById('location-status');
    const periodicInfo = document.getElementById('periodic-info');
    
    // Audio elements
    const openingAudio = document.getElementById('opening-audio');
    const applauseAudio = document.getElementById('applause-audio');
    const correctAudio = new Audio('assets/audio/jawabanbenar.mp3');
    const wrongAudio = new Audio('assets/audio/jawabansalah.mp3');
    const buttonAudio = new Audio('assets/audio/audiotombol.mp3');
    
    // Default codes
    const DEFAULT_EXAM_CODE = '12345';
    const DEFAULT_LICENSE_CODE = 'OPENLOCK-1926';
    const DEFAULT_ADMIN_CODE = '65614222';
    
    // Initialize particles.js
    particlesJS.load('particles-js', 'js/particles.json', function() {
        console.log('Particles.js loaded');
    });
    
    // Event Listeners
    enterBtn.addEventListener('click', validateExamCode);
    agreeCheckbox.addEventListener('change', toggleContinueButton);
    continueBtn.addEventListener('click', showParticipantForm);
    
    statusRadios.forEach(radio => {
        radio.addEventListener('change', toggleParticipantFields);
    });
    
    participantForm.addEventListener('submit', saveParticipantData);
    generalPurposeSelect.addEventListener('change', toggleCPNSLicense);
    verifyLicenseBtn.addEventListener('click', verifyLicenseCode);
    
    examSubjectBtns.forEach(btn => {
        btn.addEventListener('click', selectExamSubject);
    });
    
    startExamBtn.addEventListener('click', startExam);
    finishExamBtn.addEventListener('click', finishExam);
    skipQuestionBtn.addEventListener('click', skipQuestion);
    unansweredBtn.addEventListener('click', showUnanswered);
    viewCertificateBtn.addEventListener('click', showCertificate);
    retakeExamBtn.addEventListener('click', retakeExam);
    printCertificateBtn.addEventListener('click', printCertificate);
    backToResultsBtn.addEventListener('click', backToResults);
    
    // Floating buttons
    shareBtn.addEventListener('click', showShareModal);
    whatsappBtn.addEventListener('click', showWhatsappModal);
    goToBtn.addEventListener('click', showGoToModal);
    bankSoalBtn.addEventListener('click', showBankSoalModal);
    adminPanelBtn.addEventListener('click', showAdminPanelModal);
    
    // Modal buttons
    submitCodeBtn.addEventListener('click', submitAccessCode);
    sendWhatsappBtn.addEventListener('click', sendWhatsappMessage);
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Location button
    getLocationBtn.addEventListener('click', getLocation);
    
    // Functions
    function validateExamCode() {
        const code = examCodeInput.value.trim();
        
        if (code === DEFAULT_EXAM_CODE) {
            playButtonSound();
            showScreen('terms');
            currentScreen = 'terms';
        } else {
            alert('Kode ujian tidak valid. Silakan coba lagi.');
            examCodeInput.value = '';
            examCodeInput.focus();
        }
    }
    
    function toggleContinueButton() {
        continueBtn.disabled = !agreeCheckbox.checked;
    }
    
    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the selected screen
        screens[screenName].classList.add('active');
        
        // Special cases
        if (screenName === 'certificate') {
            generateCertificate();
            applauseAudio.play();
        }
    }
    
    function showParticipantForm() {
        playButtonSound();
        showScreen('participantForm');
        currentScreen = 'participantForm';
    }
    
    function toggleParticipantFields() {
        const isStudent = document.getElementById('student').checked;
        
        if (isStudent) {
            studentFields.style.display = 'block';
            generalFields.style.display = 'none';
        } else {
            studentFields.style.display = 'none';
            generalFields.style.display = 'block';
        }
    }
    
    function toggleCPNSLicense() {
        const purpose = generalPurposeSelect.value;
        cpnsLicense.style.display = purpose === 'ujian-cpns' ? 'block' : 'none';
        startExamBtn.disabled = purpose === 'ujian-cpns';
    }
    
    function verifyLicenseCode() {
        const code = licenseCodeInput.value.trim();
        
        if (code === DEFAULT_LICENSE_CODE) {
            playButtonSound();
            startExamBtn.disabled = false;
            licenseCodeInput.style.borderColor = '#4CAF50';
        } else {
            licenseCodeInput.style.borderColor = '#F44336';
            alert('Kode lisensi tidak valid. Silakan coba lagi.');
        }
    }
    
    function saveParticipantData(e) {
        e.preventDefault();
        playButtonSound();
        
        // Get form data
        const isStudent = document.getElementById('student').checked;
        participantData = {
            fullname: document.getElementById('fullname').value.trim(),
            status: isStudent ? 'pelajar' : 'umum',
            purpose: isStudent ? document.getElementById('student-purpose').value : document.getElementById('general-purpose').value,
            timestamp: new Date().toISOString()
        };
        
        if (isStudent) {
            participantData.school = document.getElementById('school').value.trim();
            participantData.studentId = document.getElementById('student-id').value.trim();
            participantData.schoolLevel = document.querySelector('input[name="school-level"]:checked').value;
        } else {
            participantData.address = document.getElementById('address').value.trim();
            participantData.whatsapp = document.getElementById('whatsapp').value.trim();
            participantData.email = document.getElementById('email').value.trim();
            
            if (participantData.purpose === 'ujian-cpns') {
                participantData.licenseCode = licenseCodeInput.value.trim();
            }
        }
        
        // Validate all fields are filled
        for (const key in participantData) {
            if (participantData[key] === '') {
                alert('Harap isi semua data dengan lengkap!');
                return;
            }
        }
        
        // Save to localStorage (simulating server storage)
        localStorage.setItem('participantData', JSON.stringify(participantData));
        
        // Show exam selection screen
        showScreen('examSelection');
        currentScreen = 'examSelection';
        
        // Set exam options based on participant type
        if (participantData.status === 'pelajar') {
            studentExamOptions.style.display = 'block';
            generalExamOptions.style.display = 'none';
            
            // Generate grade options based on school level
            generateGradeOptions(participantData.schoolLevel);
        } else {
            studentExamOptions.style.display = 'none';
            generalExamOptions.style.display = 'block';
        }
    }
    
    function generateGradeOptions(schoolLevel) {
        gradeOptions.innerHTML = '';
        
        let grades = [];
        
        switch (schoolLevel) {
            case 'SD':
                grades = ['Kelas IV', 'Kelas V', 'Kelas VI'];
                break;
            case 'SMP':
                grades = ['Kelas VII', 'Kelas VIII', 'Kelas IX'];
                break;
            case 'SMA/SMK':
                grades = ['Kelas X', 'Kelas XI', 'Kelas XII'];
                break;
        }
        
        grades.forEach(grade => {
            const btn = document.createElement('button');
            btn.className = 'btn-exam-subject';
            btn.textContent = grade;
            btn.dataset.grade = grade;
            btn.addEventListener('click', function() {
                document.querySelectorAll('#grade-options button').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                examData.grade = grade;
                startExamBtn.disabled = false;
            });
            gradeOptions.appendChild(btn);
        });
    }
    
    function selectExamSubject(e) {
        playButtonSound();
        
        // Remove active class from all buttons
        examSubjectBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        e.target.classList.add('active');
        
        // Set selected subject
        selectedSubject = e.target.dataset.subject;
        examData.subject = selectedSubject;
        
        // Enable start exam button if all required data is set
        if (participantData.status === 'pelajar') {
            startExamBtn.disabled = !examData.grade;
        } else {
            if (participantData.purpose === 'ujian-cpns') {
                startExamBtn.disabled = !(examData.licenseVerified || participantData.licenseCode === DEFAULT_LICENSE_CODE);
            } else {
                startExamBtn.disabled = false;
            }
        }
    }
    
    function startExam() {
        playButtonSound();
        
        // Load questions based on selected subject
        examQuestions = loadQuestions(selectedSubject);
        
        // Initialize exam data
        examData = {
            ...examData,
            startTime: new Date().toISOString(),
            totalQuestions: examQuestions.length,
            correctAnswers: 0,
            wrongAnswers: 0,
            unanswered: examQuestions.length
        };
        
        // Start timer
        startTimer();
        
        // Show exam screen
        showScreen('exam');
        currentScreen = 'exam';
        
        // Display first question
        displayQuestion(0);
    }
    
    function loadQuestions(subject) {
        // In a real app, this would come from a server/database
        // For demo purposes, we'll use a simple question bank
        
        const questionBank = {
            agama: [
                {
                    question: "Berapakah jumlah Rukun Iman?",
                    options: ["4", "5", "6", "7", "8"],
                    answer: "C",
                    explanation: "Rukun Iman ada 6 yaitu: 1. Iman kepada Allah, 2. Iman kepada Malaikat, 3. Iman kepada Kitab-kitab, 4. Iman kepada Rasul, 5. Iman kepada Hari Kiamat, 6. Iman kepada Qada dan Qadar."
                }
            ],
            ppkn: [
                {
                    question: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 pada alinea keberapa?",
                    options: ["Pertama", "Kedua", "Ketiga", "Keempat", "Tidak tercantum"],
                    answer: "D",
                    explanation: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 alinea keempat."
                }
            ],
            // Add questions for other subjects...
            logika: [
                {
                    question: "Jika semua A adalah B dan semua B adalah C, maka:",
                    options: ["Semua A adalah C", "Beberapa A adalah C", "Semua C adalah A", "Tidak ada hubungan antara A dan C", "Beberapa C adalah A"],
                    answer: "A",
                    explanation: "Jika semua A adalah B dan semua B adalah C, maka dapat disimpulkan bahwa semua A adalah C."
                }
            ],
            cpns: [
                {
                    question: "Yang termasuk asas-asas umum penyelenggaraan negara menurut UU No. 28 Tahun 1999 adalah:",
                    options: ["Asas kepastian hukum", "Asas profesionalitas", "Asas akuntabilitas", "Semua benar", "Tidak ada yang benar"],
                    answer: "D",
                    explanation: "Semua pilihan merupakan asas-asas umum penyelenggaraan negara menurut UU No. 28 Tahun 1999."
                }
            ]
        };
        
        return questionBank[subject] || [];
    }
    
    function startTimer() {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finishExam(true);
                return;
            }
            
            // Update timer display
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            // Show warning when 10 minutes left
            if (timeLeft === 10 * 60) {
                showTimeWarning();
            }
            
            // Remove warning when 1 minute left
            if (timeLeft === 60) {
                hideTimeWarning();
            }
            
            // Make timer bigger when 10 minutes left
            if (timeLeft <= 10 * 60) {
                timerElement.classList.add('timer-warning');
            }
        }, 1000);
    }
    
    function showTimeWarning() {
        timeWarning.style.display = 'block';
        setTimeout(() => {
            timeWarning.style.display = 'none';
        }, 5000);
    }
    
    function hideTimeWarning() {
        timeWarning.style.display = 'none';
    }
    
    function displayQuestion(index) {
        if (index < 0 || index >= examQuestions.length) return;
        
        currentQuestionIndex = index;
        const question = examQuestions[index];
        
        // Update question number and text
        questionNumber.textContent = `Soal #${index + 1}`;
        questionText.textContent = question.question;
        
        // Update progress
        progressFill.style.width = `${((index + 1) / examQuestions.length) * 100}%`;
        progressText.textContent = `${index + 1}/${examQuestions.length}`;
        
        // Clear previous options and answer
        optionsContainer.innerHTML = '';
        answerExplanation.style.display = 'none';
        
        // Create new options
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.option = String.fromCharCode(65 + i); // A, B, C, etc.
            
            const optionLetter = document.createElement('span');
            optionLetter.className = 'option-letter';
            optionLetter.textContent = String.fromCharCode(65 + i);
            
            const optionText = document.createElement('span');
            optionText.className = 'option-text';
            optionText.textContent = option;
            
            optionElement.appendChild(optionLetter);
            optionElement.appendChild(optionText);
            
            // Check if this option was already answered
            if (answers[index] && answers[index].selected === String.fromCharCode(65 + i)) {
                optionElement.classList.add('selected');
                
                if (answers[index].isCorrect) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('wrong');
                }
                
                // Show explanation if answered
                answerExplanation.querySelector('p').textContent = question.explanation;
                answerExplanation.style.display = 'block';
            }
            
            optionElement.addEventListener('click', () => selectAnswer(index, String.fromCharCode(65 + i)));
            optionsContainer.appendChild(optionElement);
        });
    }
    
    function selectAnswer(questionIndex, selectedOption) {
        // If already answered, do nothing
        if (answers[questionIndex]) return;
        
        const question = examQuestions[questionIndex];
        const isCorrect = selectedOption === question.answer;
        
        // Play sound based on answer
        if (isCorrect) {
            correctAudio.play();
        } else {
            wrongAudio.play();
        }
        
        // Save answer
        answers[questionIndex] = {
            selected: selectedOption,
            isCorrect: isCorrect
        };
        
        // Update exam data
        if (isCorrect) {
            examData.correctAnswers++;
        } else {
            examData.wrongAnswers++;
        }
        examData.unanswered--;
        
        // Display the selected answer with feedback
        displayQuestion(questionIndex);
    }
    
    function skipQuestion() {
        playButtonSound();
        
        // Move to next question
        if (currentQuestionIndex < examQuestions.length - 1) {
            displayQuestion(currentQuestionIndex + 1);
        } else {
            // If last question, go to first question
            displayQuestion(0);
        }
    }
    
    function showUnanswered() {
        playButtonSound();
        
        // Find first unanswered question
        const unansweredIndex = answers.findIndex(answer => !answer);
        
        if (unansweredIndex !== -1) {
            displayQuestion(unansweredIndex);
        } else {
            alert('Semua soal telah dijawab.');
        }
    }
    
    function finishExam(timeout = false) {
        playButtonSound();
        clearInterval(timerInterval);
        
        // Calculate score
        const score = Math.round((examData.correctAnswers / examData.totalQuestions) * 100);
        
        // Update exam data
        examData = {
            ...examData,
            endTime: new Date().toISOString(),
            score: score,
            timeout: timeout
        };
        
        // Save exam results
        saveExamResults();
        
        // Show results screen
        showResults();
    }
    
    function saveExamResults() {
        // In a real app, this would be sent to a server
        const results = {
            participantData: participantData,
            examData: examData,
            answers: answers,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (simulating server storage)
        let allResults = JSON.parse(localStorage.getItem('examResults') || [];
        allResults.push(results);
        localStorage.setItem('examResults', JSON.stringify(allResults));
    }
    
    function showResults() {
        // Update results display
        totalQuestionsEl.textContent = examData.totalQuestions;
        correctAnswersEl.textContent = examData.correctAnswers;
        wrongAnswersEl.textContent = examData.wrongAnswers;
        examScoreEl.textContent = examData.score;
        
        // Show results screen
        showScreen('results');
        currentScreen = 'results';
    }
    
    function showCertificate() {
        playButtonSound();
        showScreen('certificate');
        currentScreen = 'certificate';
    }
    
    function generateCertificate() {
        // Format participant name
        const nameParts = participantData.fullname.split(' ');
        const formattedName = nameParts.map(part => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ');
        
        // Set certificate data
        participantNameEl.textContent = formattedName;
        scoreValueEl.textContent = examData.score;
        
        // Format date
        const date = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        certificateDateEl.textContent = date.toLocaleDateString('id-ID', options);
        
        // Generate certificate code
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                          Math.random().toString(36).substring(2, 6).toUpperCase();
        
        const certCode = `${participantData.fullname.toUpperCase().replace(/ /g, '')}/` +
                        `${participantData.status.toUpperCase()}/` +
                        `${participantData.schoolLevel ? participantData.schoolLevel.toUpperCase() : 'UMUM'}/` +
                        `${examData.subject.toUpperCase()}/` +
                        `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}/` +
                        `${randomCode}/PERGUNU-STB`;
        
        certificateCodeEl.textContent = certCode;
        
        // Set motivation text based on score
        let motivation = '';
        if (examData.score >= 90) {
            motivation = "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.";
        } else if (examData.score >= 75) {
            motivation = "Hasil yang sangat baik! Anda telah menunjukkan pemahaman yang mendalam tentang materi ujian.";
        } else if (examData.score >= 60) {
            motivation = "Hasil yang baik! Teruslah belajar dan tingkatkan pemahaman Anda untuk hasil yang lebih baik.";
        } else {
            motivation = "Jangan menyerah! Gunakan hasil ini sebagai motivasi untuk belajar lebih giat lagi.";
        }
        
        motivationTextEl.textContent = motivation;
    }
    
    function printCertificate() {
        playButtonSound();
        window.print();
    }
    
    function backToResults() {
        playButtonSound();
        showScreen('results');
    }
    
    function retakeExam() {
        playButtonSound();
        
        // Reset exam data
        examData = {};
        answers = [];
        timeLeft = 120 * 60;
        currentQuestionIndex = 0;
        
        // Show exam selection screen
        showScreen('examSelection');
    }
    
    // Floating button functions
    function showShareModal() {
        playButtonSound();
        shareModal.classList.add('active');
    }
    
    function showWhatsappModal() {
        playButtonSound();
        whatsappModal.classList.add('active');
    }
    
    function showGoToModal() {
        playButtonSound();
        goToModal.classList.add('active');
    }
    
    function showBankSoalModal() {
        playButtonSound();
        codeModal.dataset.type = 'bank-soal';
        codeModal.classList.add('active');
    }
    
    function showAdminPanelModal() {
        playButtonSound();
        codeModal.dataset.type = 'admin-panel';
        codeModal.classList.add('active');
    }
    
    function closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    function submitAccessCode() {
        playButtonSound();
        const code = accessCodeInput.value.trim();
        const modalType = codeModal.dataset.type;
        
        if (modalType === 'bank-soal' && code === DEFAULT_LICENSE_CODE) {
            alert('Bank soal akan dibuka di sini (simulasi)');
            closeModal();
        } else if (modalType === 'admin-panel' && code === DEFAULT_ADMIN_CODE) {
            alert('Panel admin akan dibuka di sini (simulasi)');
            closeModal();
        } else {
            alert('Kode akses tidak valid!');
            accessCodeInput.value = '';
            accessCodeInput.focus();
        }
    }
    
    function sendWhatsappMessage() {
        playButtonSound();
        const message = encodeURIComponent(whatsappMessage.value.trim());
        window.open(`https://wa.me/6285647709114?text=${message}`, '_blank');
        closeModal();
    }
    
    function getLocation() {
        playButtonSound();
        
        if (navigator.geolocation) {
            locationStatus.textContent = "Mendapatkan lokasi...";
            locationStatus.style.color = "#4e54c8";
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Reverse geocoding would be done with a proper API in a real app
                    document.getElementById('address').value = `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                    locationStatus.textContent = "Lokasi berhasil didapatkan";
                    locationStatus.style.color = "#4CAF50";
                },
                error => {
                    console.error("Error getting location:", error);
                    locationStatus.textContent = "Gagal mendapatkan lokasi: " + error.message;
                    locationStatus.style.color = "#F44336";
                }
            );
        } else {
            locationStatus.textContent = "Geolocation tidak didukung oleh browser Anda";
            locationStatus.style.color = "#F44336";
        }
    }
    
    function playButtonSound() {
        buttonAudio.currentTime = 0;
        buttonAudio.play();
    }
    
    // Initialize periodic info from localStorage
    const savedInfo = localStorage.getItem('periodicInfo');
    if (savedInfo) {
        periodicInfo.innerHTML = savedInfo;
    }
    
    // Print styles
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body * {
                visibility: hidden;
            }
            #certificate-print, #certificate-print * {
                visibility: visible;
            }
            #certificate-print {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            .certificate-actions {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});
