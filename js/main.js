/**
 * MAIN APPLICATION SCRIPT
 * Ujian Online PERGUNU Situbondo
 * Versi Final
 */

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplikasi Ujian Online PERGUNU dimuat');
    
    try {
        // Inisialisasi Particles.js
        initParticles();
        
        // Inisialisasi Audio
        initAudio();
        
        // Setup Screen Management
        setupScreenManagement();
        
        // Setup Login Screen
        setupLoginScreen();
        
        // Setup Terms Screen
        setupTermsScreen();
        
        // Setup Participant Form
        setupParticipantForm();
        
        // Setup Exam Selection
        setupExamSelection();
        
        // Setup Floating Buttons
        setupFloatingButtons();
        
        // Setup Admin Verification
        setupAdminVerification();
        
        // Play opening audio
        playOpeningAudio();
        
    } catch (error) {
        console.error('Error in initialization:', error);
        showErrorNotification('Terjadi kesalahan saat memulai aplikasi. Silakan refresh halaman.');
    }
});

// ==================== FUNGSI UTAMA ====================

/**
 * Inisialisasi Particles.js untuk background animasi
 */
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });
}

/**
 * Inisialisasi Audio Elements
 */
function initAudio() {
    // Set volume untuk semua audio
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = 0.5; // Set volume ke 50%
    });
}

/**
 * Manajemen Screen/Tampilan
 */
function setupScreenManagement() {
    window.currentScreen = 'opening-screen';
    window.screens = document.querySelectorAll('.screen');
    
    // Fungsi untuk menampilkan screen tertentu
    window.showScreen = function(screenId) {
        console.log('Pindah ke screen:', screenId);
        
        // Sembunyikan semua screen
        window.screens.forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Tampilkan screen yang diminta
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            window.currentScreen = screenId;
        } else {
            console.error('Screen tidak ditemukan:', screenId);
        }
        
        // Update floating buttons visibility
        updateFloatingButtonsVisibility();
        
        // Play button sound
        playButtonSound();
    };
}

/**
 * Setup Login Screen
 */
function setupLoginScreen() {
    const loginBtn = document.getElementById('login-btn');
    const loginCodeInput = document.getElementById('login-code');
    
    if (!loginBtn || !loginCodeInput) {
        console.error('Element login tidak ditemukan');
        return;
    }
    
    // Default login code
    window.loginCode = localStorage.getItem('loginCode') || '12345';
    
    loginBtn.addEventListener('click', function() {
        const enteredCode = loginCodeInput.value.trim();
        
        if (enteredCode === window.loginCode) {
            showScreen('terms-screen');
        } else {
            showNotification('Kode login salah. Silakan coba lagi.', 'error');
        }
    });
    
    // Enter key untuk login
    loginCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
}

/**
 * Setup Terms Screen
 */
function setupTermsScreen() {
    const agreeTermsCheckbox = document.getElementById('agree-terms');
    const continueBtn = document.getElementById('continue-btn');
    
    if (!agreeTermsCheckbox || !continueBtn) {
        console.error('Element terms tidak ditemukan');
        return;
    }
    
    agreeTermsCheckbox.addEventListener('change', function() {
        continueBtn.disabled = !this.checked;
    });
    
    continueBtn.addEventListener('click', function() {
        showScreen('participant-form-screen');
    });
}

/**
 * Setup Participant Form
 */
function setupParticipantForm() {
    const participantForm = document.getElementById('participant-form');
    const studentRadio = document.getElementById('student');
    const generalRadio = document.getElementById('general');
    const studentFields = document.getElementById('student-fields');
    const generalFields = document.getElementById('general-fields');
    const getLocationBtn = document.getElementById('get-location');
    
    if (!participantForm) {
        console.error('Form peserta tidak ditemukan');
        return;
    }
    
    // Toggle student/general fields
    studentRadio.addEventListener('change', function() {
        if (this.checked) {
            studentFields.style.display = 'block';
            generalFields.style.display = 'none';
        }
    });
    
    generalRadio.addEventListener('change', function() {
        if (this.checked) {
            studentFields.style.display = 'none';
            generalFields.style.display = 'block';
        }
    });
    
    // Get GPS location
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getParticipantLocation);
    }
    
    // Form submission
    participantForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitParticipantForm();
    });
}

/**
 * Get Participant Location via GPS
 */
function getParticipantLocation() {
    const locationStatus = document.getElementById('location-status');
    
    if (!navigator.geolocation) {
        locationStatus.textContent = 'GPS tidak didukung oleh browser Anda';
        return;
    }
    
    locationStatus.textContent = 'Mendapatkan lokasi...';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Gunakan nominatim untuk reverse geocoding
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(response => response.json())
                .then(data => {
                    const address = data.display_name || 'Lokasi tidak diketahui';
                    document.getElementById('address').value = address;
                    locationStatus.textContent = 'Lokasi berhasil didapatkan';
                })
                .catch(error => {
                    document.getElementById('address').value = `${lat}, ${lng}`;
                    locationStatus.textContent = 'Alamat tidak ditemukan, menggunakan koordinat';
                });
        },
        function(error) {
            locationStatus.textContent = 'Gagal mendapatkan lokasi: ' + error.message;
        },
        { timeout: 10000 }
    );
}

/**
 * Submit Participant Form
 */
function submitParticipantForm() {
    const fullname = document.getElementById('fullname').value.trim();
    const status = document.querySelector('input[name="status"]:checked').value;
    
    // Validasi form
    if (!fullname) {
        showNotification('Nama lengkap harus diisi', 'error');
        return;
    }
    
    if (status === 'pelajar') {
        const school = document.getElementById('school').value.trim();
        const nis = document.getElementById('nis').value.trim();
        
        if (!school || !nis) {
            showNotification('Nama sekolah dan NIS harus diisi untuk peserta pelajar', 'error');
            return;
        }
    } else {
        const address = document.getElementById('address').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!address || !whatsapp || !email) {
            showNotification('Alamat, nomor WhatsApp, dan email harus diisi untuk peserta umum', 'error');
            return;
        }
        
        // Validasi email sederhana
        if (!email.includes('@') || !email.includes('.')) {
            showNotification('Email tidak valid', 'error');
            return;
        }
    }
    
    // Simpan data peserta
    const participantData = {
        fullname,
        status,
        timestamp: new Date().toISOString()
    };
    
    if (status === 'pelajar') {
        participantData.school = document.getElementById('school').value.trim();
        participantData.nis = document.getElementById('nis').value.trim();
        participantData.purpose = document.getElementById('student-purpose').value;
        participantData.schoolLevel = document.getElementById('school-level').value;
    } else {
        participantData.address = document.getElementById('address').value.trim();
        participantData.whatsapp = document.getElementById('whatsapp').value.trim();
        participantData.email = document.getElementById('email').value.trim();
        participantData.purpose = document.getElementById('general-purpose').value;
    }
    
    localStorage.setItem('currentParticipant', JSON.stringify(participantData));
    
    // Lanjut ke pemilihan ujian
    showScreen('exam-selection-screen');
    setupExamSelection(participantData);
}

/**
 * Setup Exam Selection Screen
 */
function setupExamSelection(participantData) {
    const studentExamOptions = document.getElementById('student-exam-options');
    const generalExamOptions = document.getElementById('general-exam-options');
    
    if (participantData.status === 'pelajar') {
        studentExamOptions.style.display = 'block';
        generalExamOptions.style.display = 'none';
        setupStudentExamOptions(participantData);
    } else {
        studentExamOptions.style.display = 'none';
        generalExamOptions.style.display = 'block';
        setupGeneralExamOptions();
    }
    
    // Start exam button
    const startExamBtn = document.getElementById('start-exam-btn');
    if (startExamBtn) {
        startExamBtn.addEventListener('click', function() {
            startExamProcess(participantData);
        });
    }
}

/**
 * Setup Student Exam Options
 */
function setupStudentExamOptions(participantData) {
    const sdGrades = document.getElementById('sd-grades');
    const smpGrades = document.getElementById('smp-grades');
    const smaGrades = document.getElementById('sma-grades');
    
    // Sembunyikan semua grade buttons terlebih dahulu
    sdGrades.style.display = 'none';
    smpGrades.style.display = 'none';
    smaGrades.style.display = 'none';
    
    // Tampilkan grade buttons sesuai school level
    if (participantData.schoolLevel === 'SD') {
        sdGrades.style.display = 'flex';
    } else if (participantData.schoolLevel === 'SMP') {
        smpGrades.style.display = 'flex';
    } else {
        smaGrades.style.display = 'flex';
    }
    
    // Subject selection
    const subjectButtons = document.querySelectorAll('.btn-subject');
    window.selectedSubject = null;
    
    subjectButtons.forEach(button => {
        button.addEventListener('click', function() {
            subjectButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            window.selectedSubject = this.dataset.subject;
            document.getElementById('start-exam-btn').disabled = false;
        });
    });
    
    // Grade selection
    const gradeButtons = document.querySelectorAll('.btn-grade');
    window.selectedGrade = null;
    
    gradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            gradeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            window.selectedGrade = this.textContent;
        });
    });
}

/**
 * Setup General Exam Options
 */
function setupGeneralExamOptions() {
    const examTypeButtons = document.querySelectorAll('.btn-exam-type');
    window.selectedExamType = null;
    
    examTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            examTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            window.selectedExamType = this.dataset.exam;
            
            // Tampilkan license form jika CPNS
            const licenseForm = document.getElementById('license-form');
            licenseForm.style.display = window.selectedExamType === 'ujian-cpns' ? 'block' : 'none';
            
            // Enable start button jika bukan CPNS
            if (window.selectedExamType !== 'ujian-cpns') {
                document.getElementById('start-exam-btn').disabled = false;
            }
        });
    });
    
    // License verification
    const verifyLicenseBtn = document.getElementById('verify-license');
    if (verifyLicenseBtn) {
        verifyLicenseBtn.addEventListener('click', function() {
            const enteredCode = document.getElementById('license-code').value.trim();
            const defaultCode = 'OPENLOCK-1945';
            
            if (enteredCode === defaultCode) {
                document.getElementById('license-message').textContent = 'Kode lisensi valid';
                document.getElementById('license-message').style.color = 'green';
                document.getElementById('start-exam-btn').disabled = false;
            } else {
                document.getElementById('license-message').textContent = 'Kode lisensi tidak valid';
                document.getElementById('license-message').style.color = 'red';
            }
        });
    }
}

/**
 * Start Exam Process
 */
function startExamProcess(participantData) {
    // Simpan detail ujian
    const examDetails = {
        type: participantData.status,
        timestamp: new Date().toISOString()
    };
    
    if (participantData.status === 'pelajar') {
        if (!window.selectedSubject) {
            showNotification('Silakan pilih mata ujian terlebih dahulu', 'error');
            return;
        }
        
        examDetails.subject = window.selectedSubject;
        examDetails.grade = window.selectedGrade || 'X';
        examDetails.schoolLevel = participantData.schoolLevel;
    } else {
        if (!window.selectedExamType) {
            showNotification('Silakan pilih jenis ujian terlebih dahulu', 'error');
            return;
        }
        
        // Validasi license untuk CPNS
        if (window.selectedExamType === 'ujian-cpns' && 
            document.getElementById('license-message').textContent !== 'Kode lisensi valid') {
            showNotification('Silakan verifikasi kode lisensi terlebih dahulu', 'error');
            return;
        }
        
        examDetails.examType = window.selectedExamType;
    }
    
    localStorage.setItem('currentExam', JSON.stringify(examDetails));
    
    // Mulai ujian
    showScreen('exam-screen');
    initializeExam();
}

/**
 * Setup Floating Buttons
 */
function setupFloatingButtons() {
    // Share button
    document.getElementById('share-btn').addEventListener('click', function() {
        shareWebsite();
    });
    
    // WhatsApp button
    document.getElementById('whatsapp-btn').addEventListener('click', function() {
        contactAdminWhatsApp();
    });
    
    // Go To button
    document.getElementById('go-to-btn').addEventListener('click', function() {
        toggleGoToMenu();
    });
    
    // Question Bank button
    document.getElementById('question-bank-btn').addEventListener('click', function() {
        showVerificationModal('Masukkan Kode Bank Soal:', 'question-bank-screen', 'OPENLOCK-1926');
    });
    
    // Admin Panel button
    document.getElementById('admin-panel-btn').addEventListener('click', function() {
        showVerificationModal('Masukkan Kode Admin:', 'admin-panel-screen', '65614222');
    });
    
    // Update visibility awal
    updateFloatingButtonsVisibility();
}

/**
 * Update Floating Buttons Visibility
 */
function updateFloatingButtonsVisibility() {
    const floatingButtons = document.querySelector('.floating-buttons');
    if (!floatingButtons) return;
    
    const hiddenScreens = ['exam-screen', 'results-screen', 'certificate-screen', 
                          'admin-panel-screen', 'question-bank-screen'];
    
    if (hiddenScreens.includes(window.currentScreen)) {
        floatingButtons.style.display = 'none';
    } else {
        floatingButtons.style.display = 'flex';
    }
}

/**
 * Setup Admin Verification
 */
function setupAdminVerification() {
    window.codeVerificationModal = document.getElementById('code-verification-modal');
    window.verificationCodeInput = document.getElementById('verification-code');
    window.verifyCodeBtn = document.getElementById('verify-code-btn');
    window.cancelVerificationBtn = document.getElementById('cancel-verification-btn');
    window.verificationMessage = document.getElementById('verification-message');
    
    if (!window.codeVerificationModal) return;
    
    window.verifyCodeBtn.addEventListener('click', verifyCode);
    window.cancelVerificationBtn.addEventListener('click', hideVerificationModal);
    window.verificationCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyCode();
        }
    });
}

/**
 * Show Verification Modal
 */
function showVerificationModal(message, targetScreen, defaultCode) {
    window.verificationMessage.textContent = message;
    window.verificationCodeInput.value = '';
    window.verificationCallback = function() {
        const enteredCode = window.verificationCodeInput.value.trim();
        
        if (enteredCode === defaultCode) {
            hideVerificationModal();
            showScreen(targetScreen);
            
            // Inisialisasi screen khusus
            if (targetScreen === 'question-bank-screen') {
                initializeQuestionBank();
            } else if (targetScreen === 'admin-panel-screen') {
                initializeAdminPanel();
            }
        } else {
            showNotification('Kode verifikasi salah', 'error');
        }
    };
    
    window.codeVerificationModal.style.display = 'flex';
}

/**
 * Hide Verification Modal
 */
function hideVerificationModal() {
    window.codeVerificationModal.style.display = 'none';
}

/**
 * Verify Code
 */
function verifyCode() {
    if (window.verificationCallback) {
        window.verificationCallback();
    }
}

// ==================== FUNGSI BANTUAN ====================

/**
 * Play Opening Audio
 */
function playOpeningAudio() {
    const openingAudio = document.getElementById('opening-audio');
    if (openingAudio) {
        openingAudio.volume = 0.5;
        openingAudio.play().catch(e => console.log('Autoplay prevented:', e));
    }
}

/**
 * Play Button Sound
 */
function playButtonSound() {
    const buttonAudio = document.getElementById('button-audio');
    if (buttonAudio) {
        buttonAudio.currentTime = 0;
        buttonAudio.play().catch(e => console.log('Button audio error:', e));
    }
}

/**
 * Show Notification
 */
function showNotification(message, type) {
    const notification = document.getElementById('login-notification') || 
                         document.getElementById('exam-notification');
    
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'floating-notification show ' + type;
    
    setTimeout(() => {
        notification.className = 'floating-notification';
    }, 3000);
}

/**
 * Show Error Notification
 */
function showErrorNotification(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Share Website
 */
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Ujian Online PERGUNU Situbondo',
            text: 'Ikuti ujian online sekarang!',
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

/**
 * Fallback Share
 */
function fallbackShare() {
    window.open(`https://twitter.com/intent/tweet?text=Ikuti%20ujian%20online%20PERGUNU%20Situbondo%20di%20${encodeURIComponent(window.location.href)}`, '_blank');
}

/**
 * Contact Admin WhatsApp
 */
function contactAdminWhatsApp() {
    window.open('https://wa.me/6285647709114?text=Assalamualaikum%20admin,%20saya%20mau%20tanya%20tentang%20ujian%20online', '_blank');
}

/**
 * Toggle Go To Menu
 */
function toggleGoToMenu() {
    const goToMenu = document.getElementById('go-to-menu');
    if (goToMenu) {
        goToMenu.style.display = goToMenu.style.display === 'block' ? 'none' : 'block';
    }
}

// Inisialisasi fungsi yang akan digunakan di file lain
window.initializeExam = initializeExam;
window.initializeQuestionBank = initializeQuestionBank;
window.initializeAdminPanel = initializeAdminPanel;
