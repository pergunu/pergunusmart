// Main application controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { 
                value: 80, 
                density: { 
                    enable: true, 
                    value_area: 800 
                } 
            },
            color: { 
                value: "#ffffff" 
            },
            shape: { 
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });

    // Audio and loading functions
    function initAudio() {
        try {
            const openingAudio = document.getElementById('opening-audio');
            if (openingAudio) {
                openingAudio.volume = 0.5;
                openingAudio.play().catch(e => console.log("Autoplay prevented:", e));
            }
        } catch (e) {
            console.log("Audio error:", e);
        }
    }

    function initLoading() {
        const progressBar = document.querySelector('.progress');
        if (progressBar) {
            let progress = 0;
            const loadingInterval = setInterval(() => {
                progress += 5;
                progressBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(loadingInterval);
                }
            }, 200);
        }
    }

    // Exam code verification
    function initExamCodeVerification() {
        const enterExamBtn = document.getElementById('enter-exam');
        if (enterExamBtn) {
            enterExamBtn.addEventListener('click', function() {
                const examCode = document.getElementById('exam-code').value;
                if (examCode === '12345') {
                    document.getElementById('opening-screen').classList.remove('active');
                    document.getElementById('terms-screen').classList.add('active');
                } else {
                    alert('Kode ujian salah! Silakan masukkan kode yang valid.');
                }
            });
        }
    }

    // Terms agreement
    function initTermsAgreement() {
        const agreeTerms = document.getElementById('agree-terms');
        const continueToForm = document.getElementById('continue-to-form');
        
        if (agreeTerms && continueToForm) {
            agreeTerms.addEventListener('change', function() {
                continueToForm.disabled = !this.checked;
            });
            
            continueToForm.addEventListener('click', function() {
                document.getElementById('terms-screen').classList.remove('active');
                document.getElementById('form-screen').classList.add('active');
            });
        }
    }

    // Participant form
    function initParticipantForm() {
        const participantForm = document.getElementById('participant-form');
        const studentFields = document.getElementById('student-fields');
        const generalFields = document.getElementById('general-fields');
        
        if (participantForm && studentFields && generalFields) {
            // Toggle between student and general fields
            document.querySelectorAll('input[name="status"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'pelajar') {
                        studentFields.style.display = 'block';
                        generalFields.style.display = 'none';
                    } else {
                        studentFields.style.display = 'none';
                        generalFields.style.display = 'block';
                    }
                });
            });

            // Geolocation
            const getLocationBtn = document.getElementById('get-location');
            const locationStatus = document.getElementById('location-status');
            
            if (getLocationBtn && locationStatus) {
                getLocationBtn.addEventListener('click', function() {
                    locationStatus.textContent = 'Mendapatkan lokasi...';
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            position => {
                                const lat = position.coords.latitude;
                                const lng = position.coords.longitude;
                                document.getElementById('address').value = `${lat}, ${lng}`;
                                locationStatus.textContent = 'Lokasi berhasil didapatkan!';
                            },
                            error => {
                                console.error('Error getting location:', error);
                                locationStatus.textContent = 'Gagal mendapatkan lokasi: ' + error.message;
                            }
                        );
                    } else {
                        locationStatus.textContent = 'Geolocation tidak didukung oleh browser Anda.';
                    }
                });
            }

            // Form submission
            participantForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate form
                let isValid = true;
                const inputs = this.querySelectorAll('input[required], select[required]');
                inputs.forEach(input => {
                    if (!input.value) {
                        isValid = false;
                        input.style.border = '1px solid red';
                    } else {
                        input.style.border = '';
                    }
                });
                
                if (!isValid) {
                    alert('Harap isi semua field yang wajib diisi!');
                    return;
                }
                
                // Save participant data
                const participantData = {
                    fullname: document.getElementById('fullname').value,
                    status: document.querySelector('input[name="status"]:checked').value,
                    purpose: document.querySelector('input[name="status"]:checked').value === 'pelajar' 
                        ? document.getElementById('student-purpose').value 
                        : document.getElementById('general-purpose').value,
                    level: document.querySelector('input[name="status"]:checked').value === 'pelajar' 
                        ? document.getElementById('school-level').value 
                        : null,
                    school: document.querySelector('input[name="status"]:checked').value === 'pelajar' 
                        ? document.getElementById('school').value 
                        : null,
                    nis: document.querySelector('input[name="status"]:checked').value === 'pelajar' 
                        ? document.getElementById('nis').value 
                        : null,
                    address: document.querySelector('input[name="status"]:checked').value === 'umum' 
                        ? document.getElementById('address').value 
                        : null,
                    whatsapp: document.querySelector('input[name="status"]:checked').value === 'umum' 
                        ? document.getElementById('whatsapp').value 
                        : null,
                    email: document.querySelector('input[name="status"]:checked').value === 'umum' 
                        ? document.getElementById('email').value 
                        : null,
                    timestamp: new Date().toISOString()
                };
                
                localStorage.setItem('participantData', JSON.stringify(participantData));
                
                // Navigate to level selection
                document.getElementById('form-screen').classList.remove('active');
                document.getElementById('level-screen').classList.add('active');
                
                // Show appropriate levels
                if (participantData.status === 'pelajar') {
                    document.getElementById('student-levels').style.display = 'block';
                    document.getElementById('general-levels').style.display = 'none';
                } else {
                    document.getElementById('student-levels').style.display = 'none';
                    document.getElementById('general-levels').style.display = 'block';
                }
            });
        }
    }

    // Level selection
    function initLevelSelection() {
        // Student level selection
        document.querySelectorAll('.grade-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.grade-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
                document.getElementById('subject-selection').style.display = 'block';
                document.getElementById('general-subjects').style.display = 'none';
                document.getElementById('start-exam').disabled = false;
            });
        });

        // Exam type selection
        document.querySelectorAll('.exam-option').forEach(option => {
            option.addEventListener('click', function() {
                const examType = this.getAttribute('data-exam');
                
                if (examType === 'ujian-cpns') {
                    document.getElementById('cpns-license').style.display = 'block';
                    document.getElementById('start-exam').disabled = true;
                } else {
                    document.getElementById('cpns-license').style.display = 'none';
                    document.getElementById('subject-selection').style.display = 'block';
                    document.getElementById('general-subjects').style.display = 'block';
                    document.getElementById('start-exam').disabled = false;
                }
            });
        });

        // CPNS license verification
        const verifyLicenseBtn = document.getElementById('verify-license');
        if (verifyLicenseBtn) {
            verifyLicenseBtn.addEventListener('click', function() {
                const licenseCode = document.getElementById('license-code').value;
                if (licenseCode === 'OPENLOCK-1926') {
                    document.getElementById('license-message').textContent = 'Kode valid!';
                    document.getElementById('license-message').style.color = 'green';
                    document.getElementById('subject-selection').style.display = 'block';
                    document.getElementById('general-subjects').style.display = 'block';
                    document.getElementById('start-exam').disabled = false;
                } else {
                    document.getElementById('license-message').textContent = 'Kode tidak valid!';
                    document.getElementById('license-message').style.color = 'red';
                }
            });
        }

        // Subject selection
        document.querySelectorAll('.subject-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.subject-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        // Start exam button
        const startExamBtn = document.getElementById('start-exam');
        if (startExamBtn) {
            startExamBtn.addEventListener('click', function() {
                document.getElementById('level-screen').classList.remove('active');
                document.getElementById('exam-screen').classList.add('active');
                initExam();
            });
        }
    }

    // Floating buttons functionality
    function initFloatingButtons() {
        // Share button
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                document.getElementById('share-modal').classList.add('active');
            });
        }

        // WhatsApp button
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', function() {
                document.getElementById('whatsapp-modal').classList.add('active');
            });
        }

        // Links button
        const linksBtn = document.getElementById('links-btn');
        if (linksBtn) {
            linksBtn.addEventListener('click', function() {
                document.getElementById('links-modal').classList.add('active');
            });
        }

        // Question bank button
        const questionBankBtn = document.getElementById('question-bank-btn');
        if (questionBankBtn) {
            questionBankBtn.addEventListener('click', function() {
                document.getElementById('question-bank-modal').classList.add('active');
            });
        }

        // Admin panel button
        const adminPanelBtn = document.getElementById('admin-panel-btn');
        if (adminPanelBtn) {
            adminPanelBtn.addEventListener('click', function() {
                document.getElementById('admin-panel-modal').classList.add('active');
            });
        }

        // Music button
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn) {
            musicBtn.addEventListener('click', function() {
                const musicPlayer = document.getElementById('music-player');
                if (musicPlayer) {
                    musicPlayer.classList.toggle('hidden');
                }
            });
        }

        // Close modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').classList.remove('active');
            });
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });

        // Copy link
        const copyLinkBtn = document.getElementById('copy-link');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', function() {
                const urlInput = document.getElementById('share-url');
                if (urlInput) {
                    urlInput.select();
                    document.execCommand('copy');
                    alert('Link berhasil disalin!');
                }
            });
        }

        // Send WhatsApp message
        const sendWhatsappBtn = document.getElementById('send-whatsapp');
        if (sendWhatsappBtn) {
            sendWhatsappBtn.addEventListener('click', function() {
                const message = encodeURIComponent(document.getElementById('whatsapp-message').value);
                window.open(`https://wa.me/6285647709114?text=${message}`, '_blank');
            });
        }
    }

    // Music player
    function initMusicPlayer() {
        const musicTracks = [
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
        ];
        
        let currentTrack = 0;
        const audio = new Audio(musicTracks[currentTrack]);
        audio.volume = 0.5;
        
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function() {
                if (audio.paused) {
                    audio.play();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    audio.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
        
        const prevTrackBtn = document.getElementById('prev-track');
        if (prevTrackBtn) {
            prevTrackBtn.addEventListener('click', function() {
                currentTrack = (currentTrack - 1 + musicTracks.length) % musicTracks.length;
                audio.src = musicTracks[currentTrack];
                audio.play();
                document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';
                updateNowPlaying();
            });
        }
        
        const nextTrackBtn = document.getElementById('next-track');
        if (nextTrackBtn) {
            nextTrackBtn.addEventListener('click', function() {
                currentTrack = (currentTrack + 1) % musicTracks.length;
                audio.src = musicTracks[currentTrack];
                audio.play();
                document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';
                updateNowPlaying();
            });
        }
        
        const volumeControl = document.getElementById('volume-control');
        if (volumeControl) {
            volumeControl.addEventListener('input', function() {
                audio.volume = this.value;
            });
        }
        
        const closeMusicBtn = document.getElementById('close-music');
        if (closeMusicBtn) {
            closeMusicBtn.addEventListener('click', function() {
                document.getElementById('music-player').classList.add('hidden');
            });
        }
        
        audio.addEventListener('ended', function() {
            currentTrack = (currentTrack + 1) % musicTracks.length;
            audio.src = musicTracks[currentTrack];
            audio.play();
            updateNowPlaying();
        });
        
        function updateNowPlaying() {
            const nowPlaying = document.getElementById('now-playing');
            if (nowPlaying) {
                nowPlaying.textContent = `Track ${currentTrack + 1}`;
            }
        }
    }

    // Initialize all components
    initAudio();
    initLoading();
    initExamCodeVerification();
    initTermsAgreement();
    initParticipantForm();
    initLevelSelection();
    initFloatingButtons();
    initMusicPlayer();
});

// Exam functionality
function initExam() {
    // Sample questions
    const questions = [
        {
            id: 1,
            text: "Apa ibukota Indonesia?",
            options: {
                A: "Jakarta",
                B: "Bandung",
                C: "Surabaya",
                D: "Medan",
                E: "Yogyakarta"
            },
            correctAnswer: "A",
            explanation: "Jakarta adalah ibukota Indonesia sejak tahun 1945."
        },
        {
            id: 2,
            text: "2 + 2 = ?",
            options: {
                A: "3",
                B: "4",
                C: "5",
                D: "6",
                E: "7"
            },
            correctAnswer: "B",
            explanation: "2 ditambah 2 sama dengan 4."
        }
    ];
    
    let currentQuestionIndex = 0;
    let score = 0;
    let answeredQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let timer = 120 * 60; // 120 minutes in seconds
    let timerInterval;
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
    
    // Display first question
    displayQuestion(questions[currentQuestionIndex]);
    
    // Answer selection
    document.querySelectorAll('.answer-option').forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('selected')) return;
            
            const selectedOption = this.getAttribute('data-option');
            const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
            
            // Play sound
            const sound = isCorrect ? document.getElementById('correct-audio') : document.getElementById('wrong-audio');
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
            
            // Mark selected option
            document.querySelectorAll('.answer-option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'wrong');
            });
            
            this.classList.add('selected');
            this.classList.add(isCorrect ? 'correct' : 'wrong');
            
            // Show explanation
            const explanationText = document.getElementById('explanation-text');
            const explanationDiv = document.getElementById('explanation');
            if (explanationText && explanationDiv) {
                explanationText.textContent = questions[currentQuestionIndex].explanation;
                explanationDiv.style.display = 'block';
            }
            
            // Update score
            if (isCorrect) {
                score += 10;
                correctAnswers++;
            } else {
                wrongAnswers++;
            }
            
            answeredQuestions++;
            
            // Disable further selection for this question
            document.querySelectorAll('.answer-option').forEach(opt => {
                opt.style.pointerEvents = 'none';
            });
        });
    });
    
    // Skip question
    const skipQuestionBtn = document.getElementById('skip-question');
    if (skipQuestionBtn) {
        skipQuestionBtn.addEventListener('click', function() {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                displayQuestion(questions[currentQuestionIndex]);
            } else {
                finishExam();
            }
        });
    }
    
    // Unanswered questions
    const unansweredQuestionsBtn = document.getElementById('unanswered-questions');
    if (unansweredQuestionsBtn) {
        unansweredQuestionsBtn.addEventListener('click', function() {
            alert(`Anda memiliki ${questions.length - answeredQuestions} soal yang belum dijawab.`);
        });
    }
    
    // Finish exam
    const finishExamBtn = document.getElementById('finish-exam');
    if (finishExamBtn) {
        finishExamBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menyelesaikan ujian sekarang?')) {
                finishExam();
            }
        });
    }
    
    // Display question
    function displayQuestion(question) {
        document.getElementById('question-text').textContent = question.text;
        document.getElementById('option-a').textContent = question.options.A;
        document.getElementById('option-b').textContent = question.options.B;
        document.getElementById('option-c').textContent = question.options.C;
        document.getElementById('option-d').textContent = question.options.D;
        document.getElementById('option-e').textContent = question.options.E || '';
        document.getElementById('current-question').textContent = currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = questions.length;
        
        const explanationDiv = document.getElementById('explanation');
        if (explanationDiv) {
            explanationDiv.style.display = 'none';
        }
        
        // Reset options
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'wrong');
            opt.style.pointerEvents = 'auto';
        });
    }
    
    // Update timer
    function updateTimer() {
        timer--;
        
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        
        // Time warning
        if (timer === 10 * 60) { // 10 minutes left
            if (timerElement) timerElement.classList.add('warning');
            const timeWarning = document.getElementById('time-warning');
            if (timeWarning) timeWarning.style.display = 'block';
        }
        
        if (timer === 60) { // 1 minute left
            const timeWarning = document.getElementById('time-warning');
            if (timeWarning) timeWarning.style.display = 'none';
        }
        
        // Time's up
        if (timer <= 0) {
            clearInterval(timerInterval);
            finishExam();
        }
    }
    
    // Finish exam
    function finishExam() {
        clearInterval(timerInterval);
        
        // Calculate final score
        const finalScore = Math.round((correctAnswers / questions.length) * 100);
        
        // Save results
        const participantData = JSON.parse(localStorage.getItem('participantData'));
        const examResults = {
            participant: participantData,
            score: finalScore,
            correctAnswers,
            wrongAnswers,
            totalQuestions: questions.length,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        let allResults = JSON.parse(localStorage.getItem('examResults')) || [];
        allResults.push(examResults);
        localStorage.setItem('examResults', JSON.stringify(allResults));
        
        // Show results screen
        document.getElementById('exam-screen').classList.remove('active');
        document.getElementById('results-screen').classList.add('active');
        
        document.getElementById('total-answered').textContent = questions.length;
        document.getElementById('correct-answers').textContent = correctAnswers;
        document.getElementById('wrong-answers').textContent = wrongAnswers;
        document.getElementById('final-score').textContent = finalScore;
        
        // View certificate
        const viewCertificateBtn = document.getElementById('view-certificate');
        if (viewCertificateBtn) {
            viewCertificateBtn.addEventListener('click', function() {
                document.getElementById('results-screen').classList.remove('active');
                document.getElementById('certificate-screen').classList.add('active');
                generateCertificate(participantData, finalScore);
            });
        }
        
        // Retake exam
        const retakeExamBtn = document.getElementById('retake-exam');
        if (retakeExamBtn) {
            retakeExamBtn.addEventListener('click', function() {
                document.getElementById('results-screen').classList.remove('active');
                document.getElementById('exam-screen').classList.add('active');
                initExam();
            });
        }
    }
}

// Generate certificate
function generateCertificate(participantData, score) {
    // Set certificate data
    document.getElementById('cert-name').textContent = participantData.fullname.toUpperCase();
    document.getElementById('cert-score').textContent = score;
    
    // Set current date
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('cert-date').textContent = now.toLocaleDateString('id-ID', options);
    
    // Generate certificate code
    const codeParts = [
        participantData.fullname.replace(/\s+/g, '-').toUpperCase(),
        participantData.status.toUpperCase(),
        participantData.level ? participantData.level : 'UMUM',
        'IPS', // This would be the actual subject in a real app
        now.toISOString().split('T')[0].replace(/-/g, ''),
        generateRandomCode(8),
        'PERGUNU-STB'
    ];
    
    document.getElementById('cert-code').textContent = codeParts.join('/');
    
    // Set motivation message based on score
    const motivationMessages = {
        '90-100': 'Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.',
        '80-89': 'Bagus! Anda telah menunjukkan pemahaman yang baik terhadap materi ujian.',
        '70-79': 'Cukup baik. Masih ada ruang untuk meningkatkan pemahaman Anda.',
        '60-69': 'Anda sudah berusaha, tetapi perlu belajar lebih giat lagi.',
        '0-59': 'Jangan menyerah! Gunakan hasil ini sebagai motivasi untuk belajar lebih giat.'
    };
    
    let motivationKey = '';
    if (score >= 90) motivationKey = '90-100';
    else if (score >= 80) motivationKey = '80-89';
    else if (score >= 70) motivationKey = '70-79';
    else if (score >= 60) motivationKey = '60-69';
    else motivationKey = '0-59';
    
    document.getElementById('motivation-message').textContent = motivationMessages[motivationKey];
    
    // Play applause sound
    const applause = document.getElementById('applause-audio');
    if (applause) {
        applause.volume = 0.7;
        applause.play().catch(e => console.log("Audio play prevented:", e));
    }
    
    // Print certificate
    const printCertificateBtn = document.getElementById('print-certificate');
    if (printCertificateBtn) {
        printCertificateBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Back to results
    const backToResultsBtn = document.getElementById('back-to-results');
    if (backToResultsBtn) {
        backToResultsBtn.addEventListener('click', function() {
            document.getElementById('certificate-screen').classList.remove('active');
            document.getElementById('results-screen').classList.add('active');
        });
    }
}

// Generate random code
function generateRandomCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
