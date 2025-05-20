// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
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

    // Play opening audio
    const openingAudio = document.getElementById('opening-audio');
    openingAudio.volume = 0.5;
    openingAudio.play().catch(e => console.log("Autoplay prevented:", e));

    // Button click sound
    const buttonAudio = document.getElementById('button-audio');
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            buttonAudio.currentTime = 0;
            buttonAudio.play().catch(e => console.log("Audio error:", e));
        });
    });

    // Initialize database
    initDatabase();

    // Load default exam code
    document.getElementById('exam-code').addEventListener('input', function() {
        document.getElementById('code-error').textContent = '';
    });

    // Enter exam code
    document.getElementById('enter-exam').addEventListener('click', function() {
        const examCode = document.getElementById('exam-code').value;
        if (examCode === '12345') {
            document.querySelector('#opening-screen').classList.remove('active');
            document.querySelector('#terms-screen').classList.add('active');
        } else {
            document.getElementById('code-error').textContent = 'Kode ujian salah. Silakan coba lagi.';
        }
    });

    // Terms agreement checkbox
    document.getElementById('agree-terms').addEventListener('change', function() {
        document.getElementById('continue-to-form').disabled = !this.checked;
    });

    // Continue to form
    document.getElementById('continue-to-form').addEventListener('click', function() {
        document.querySelector('#terms-screen').classList.remove('active');
        document.querySelector('#form-screen').classList.add('active');
    });

    // Toggle between student and general fields
    document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'pelajar') {
                document.getElementById('student-fields').style.display = 'block';
                document.getElementById('general-fields').style.display = 'none';
            } else {
                document.getElementById('student-fields').style.display = 'none';
                document.getElementById('general-fields').style.display = 'block';
            }
        });
    });

    // Get GPS location
    document.getElementById('get-location').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('address').value = data.display_name || 'Lokasi tidak diketahui';
                        })
                        .catch(error => {
                            document.getElementById('address').value = `Koordinat: ${lat}, ${lng}`;
                        });
                },
                error => {
                    alert('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.');
                }
            );
        } else {
            alert('Browser tidak mendukung geolocation.');
        }
    });

    // Submit participant form
    document.getElementById('participant-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let isValid = true;
        const status = document.querySelector('input[name="status"]:checked').value;
        
        if (status === 'pelajar') {
            if (!document.getElementById('school').value || 
                !document.getElementById('student-id').value || 
                !document.getElementById('student-purpose').value || 
                !document.getElementById('school-level').value) {
                isValid = false;
            }
        } else {
            if (!document.getElementById('address').value || 
                !document.getElementById('whatsapp').value || 
                !document.getElementById('email').value || 
                !document.getElementById('general-purpose').value) {
                isValid = false;
            }
        }
        
        if (!isValid) {
            alert('Harap isi semua data dengan lengkap dan benar.');
            return;
        }
        
        // Save participant data
        const participant = {
            fullname: document.getElementById('fullname').value,
            status: status,
            timestamp: new Date().toISOString()
        };
        
        if (status === 'pelajar') {
            participant.school = document.getElementById('school').value;
            participant.studentId = document.getElementById('student-id').value;
            participant.purpose = document.getElementById('student-purpose').value;
            participant.schoolLevel = document.getElementById('school-level').value;
        } else {
            participant.address = document.getElementById('address').value;
            participant.whatsapp = document.getElementById('whatsapp').value;
            participant.email = document.getElementById('email').value;
            participant.purpose = document.getElementById('general-purpose').value;
        }
        
        saveParticipant(participant);
        
        // Move to level selection screen
        document.querySelector('#form-screen').classList.remove('active');
        document.querySelector('#level-screen').classList.add('active');
        
        // Show appropriate levels based on status
        if (status === 'pelajar') {
            document.getElementById('student-levels').style.display = 'block';
            document.getElementById('general-levels').style.display = 'none';
            
            // Show appropriate grade levels based on school level
            document.getElementById('school-level').addEventListener('change', function() {
                document.getElementById('sd-levels').style.display = 'none';
                document.getElementById('smp-levels').style.display = 'none';
                document.getElementById('sma-levels').style.display = 'none';
                
                if (this.value === 'sd') {
                    document.getElementById('sd-levels').style.display = 'block';
                } else if (this.value === 'smp') {
                    document.getElementById('smp-levels').style.display = 'block';
                } else if (this.value === 'sma') {
                    document.getElementById('sma-levels').style.display = 'block';
                }
            });
        } else {
            document.getElementById('student-levels').style.display = 'none';
            document.getElementById('general-levels').style.display = 'block';
            
            // Show CPNS license input if selected
            document.getElementById('general-purpose').addEventListener('change', function() {
                if (this.value === 'ujian-cpns') {
                    document.getElementById('cpns-license').style.display = 'block';
                } else {
                    document.getElementById('cpns-license').style.display = 'none';
                }
            });
        }
    });

    // Verify CPNS license
    document.getElementById('verify-license').addEventListener('click', function() {
        const licenseCode = document.getElementById('license-code').value;
        if (licenseCode === 'OPENLOCK-1926') {
            document.getElementById('license-error').textContent = '';
            document.getElementById('start-exam').disabled = false;
        } else {
            document.getElementById('license-error').textContent = 'Kode lisensi salah. Silakan coba lagi.';
        }
    });

    // Start exam
    document.getElementById('start-exam').addEventListener('click', function() {
        // Initialize exam based on selections
        initExam();
        
        // Move to exam screen
        document.querySelector('#level-screen').classList.remove('active');
        document.querySelector('#exam-screen').classList.add('active');
    });

    // Floating buttons functionality
    document.getElementById('share-btn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Ujian Online PERGUNU Situbondo',
                text: 'Ikuti ujian online kami sekarang!',
                url: 'http://is.gd/ujianonline'
            }).catch(e => console.log('Share error:', e));
        } else {
            // Fallback for browsers that don't support Web Share API
            window.open('https://wa.me/?text=Ikuti%20ujian%20online%20PERGUNU%20Situbondo:%20http://is.gd/ujianonline', '_blank');
        }
    });

    document.getElementById('whatsapp-btn').addEventListener('click', function() {
        window.open('https://wa.me/6285647709114?text=Assalamualaikum%20mas%20admin,%20saya%20mau%20tanya%20sesuatu%20nih…', '_blank');
    });

    document.getElementById('go-to-btn').addEventListener('click', function() {
        document.getElementById('go-to-modal').classList.add('active');
    });

    document.getElementById('question-bank-btn').addEventListener('click', function() {
        document.getElementById('question-bank-modal').classList.add('active');
    });

    document.getElementById('admin-panel-btn').addEventListener('click', function() {
        document.getElementById('admin-panel-modal').classList.add('active');
    });

    // Close modals
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
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

    // Enter question bank
    document.getElementById('enter-bank').addEventListener('click', function() {
        const bankCode = document.getElementById('bank-code').value;
        if (bankCode === 'OPENLOCK-1926') {
            document.getElementById('bank-error').textContent = '';
            document.getElementById('bank-content').style.display = 'block';
        } else {
            document.getElementById('bank-error').textContent = 'Kode bank soal salah. Silakan coba lagi.';
        }
    });

    // Enter admin panel
    document.getElementById('enter-admin').addEventListener('click', function() {
        const adminCode = document.getElementById('admin-code').value;
        if (adminCode === '65614222') {
            document.getElementById('admin-error').textContent = '';
            document.getElementById('admin-content').style.display = 'block';
            loadAdminData();
        } else {
            document.getElementById('admin-error').textContent = 'Kode admin salah. Silakan coba lagi.';
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.bank-tabs, .admin-tabs');
            
            // Update active tab
            tabContainer.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            const contentContainer = tabContainer.nextElementSibling;
            contentContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            contentContainer.querySelector(`#${tabId}`).classList.add('active');
        });
    });

    // Method switching in question bank
    document.querySelectorAll('.method-btn').forEach(method => {
        method.addEventListener('click', function() {
            const methodId = this.getAttribute('data-method');
            
            // Update active method
            this.closest('.add-method').querySelectorAll('.method-btn').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            const contentContainer = this.closest('.method-content').parentElement;
            contentContainer.querySelectorAll('.method-content').forEach(c => c.classList.remove('active'));
            contentContainer.querySelector(`#${methodId}-method`).classList.add('active');
        });
    });

    // Save question
    document.getElementById('save-question').addEventListener('click', function() {
        const category = document.getElementById('question-category').value;
        const subject = document.getElementById('question-subject').value;
        const questionText = document.getElementById('question-text').value;
        const options = Array.from(document.querySelectorAll('.option-text')).map(input => input.value);
        const correctOption = document.querySelector('input[name="correct-option"]:checked').value;
        const explanation = document.getElementById('explanation').value;
        const point = document.getElementById('question-point').value;
        
        if (!questionText || options.some(opt => !opt) || !correctOption || !explanation) {
            alert('Harap isi semua data soal dengan lengkap.');
            return;
        }
        
        const question = {
            id: Date.now().toString(),
            category,
            subject,
            question: questionText,
            options: {
                a: options[0],
                b: options[1],
                c: options[2],
                d: options[3],
                e: options[4]
            },
            correctAnswer: correctOption,
            explanation,
            point: parseInt(point),
            createdAt: new Date().toISOString()
        };
        
        saveQuestion(question);
        alert('Soal berhasil disimpan!');
        
        // Reset form
        document.getElementById('question-text').value = '';
        document.querySelectorAll('.option-text').forEach(input => input.value = '');
        document.querySelector('input[name="correct-option"]').checked = true;
        document.getElementById('explanation').value = '';
    });

    // Reset question form
    document.getElementById('reset-question').addEventListener('click', function() {
        document.getElementById('question-text').value = '';
        document.querySelectorAll('.option-text').forEach(input => input.value = '');
        document.querySelector('input[name="correct-option"]').checked = true;
        document.getElementById('explanation').value = '';
    });

    // Generate questions with AI
    document.getElementById('generate-questions').addEventListener('click', function() {
        const prompt = document.getElementById('ai-prompt').value;
        if (!prompt) {
            alert('Harap masukkan prompt untuk generate soal.');
            return;
        }
        
        // Simulate AI generation (in a real app, this would call an API)
        document.getElementById('ai-results').innerHTML = `
            <div class="ai-question">
                <h4>Contoh Soal Hasil Generate:</h4>
                <p>${prompt.includes('sejarah') ? 
                    'Siapa yang memproklamasikan kemerdekaan Indonesia?' : 
                    'Berapakah hasil dari 2 + 2?'}</p>
                <div class="ai-options">
                    <p>A. ${prompt.includes('sejarah') ? 'Soekarno' : '3'}</p>
                    <p>B. ${prompt.includes('sejarah') ? 'Hatta' : '4'}</p>
                    <p>C. ${prompt.includes('sejarah') ? 'Soeharto' : '5'}</p>
                    <p>D. ${prompt.includes('sejarah') ? 'Habibie' : '6'}</p>
                </div>
                <p class="ai-explanation">${prompt.includes('sejarah') ? 
                    'Soekarno dan Hatta adalah tokoh yang memproklamasikan kemerdekaan Indonesia pada 17 Agustus 1945.' : 
                    'Hasil dari 2 + 2 adalah 4 sesuai dengan operasi penjumlahan dasar.'}</p>
                <button class="btn-small use-ai-question">Gunakan Soal Ini</button>
            </div>
        `;
    });

    // Save admin settings
    document.getElementById('save-settings').addEventListener('click', function() {
        const timer = document.getElementById('exam-timer').value;
        const chairman = document.getElementById('chairman-name').value;
        const greeting = document.getElementById('greeting-text-input').value;
        const info = document.getElementById('periodic-info-input').value;
        const motivations = document.getElementById('motivation-texts').value;
        const points = document.getElementById('question-points').value;
        const randomize = document.getElementById('randomize-questions').checked;
        const count = document.getElementById('question-count').value;
        
        // Save settings to localStorage
        localStorage.setItem('examSettings', JSON.stringify({
            timer,
            chairman,
            greeting,
            info,
            motivations,
            points,
            randomize,
            count
        }));
        
        alert('Pengaturan berhasil disimpan!');
    });

    // Export participants data
    document.getElementById('export-excel').addEventListener('click', function() {
        const participants = getParticipants();
        let csv = 'Nama,Status,Sekolah/NIS/Alamat,WhatsApp,Email,Tujuan,Tingkat,Timestamp\n';
        
        participants.forEach(p => {
            csv += `"${p.fullname}",${p.status},"${p.status === 'pelajar' ? 
                `${p.school}/${p.studentId}` : p.address}",${p.whatsapp || '-'},${p.email || '-'},${p.purpose},${p.schoolLevel || '-'},${p.timestamp}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `peserta-ujian-${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    });

    document.getElementById('export-word').addEventListener('click', function() {
        alert('Fitur export Word akan segera tersedia.');
    });
});

// Initialize database with sample questions
function initDatabase() {
    if (!localStorage.getItem('questions')) {
        const sampleQuestions = [
            {
                id: '1',
                category: 'pelajar',
                subject: 'agama',
                question: 'Siapakah nabi pertama dalam Islam?',
                options: {
                    a: 'Adam',
                    b: 'Ibrahim',
                    c: 'Musa',
                    d: 'Muhammad',
                    e: 'Isa'
                },
                correctAnswer: 'a',
                explanation: 'Nabi Adam adalah manusia pertama sekaligus nabi pertama dalam Islam.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                category: 'pelajar',
                subject: 'ppkn',
                question: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea keberapa?',
                options: {
                    a: 'Pertama',
                    b: 'Kedua',
                    c: 'Ketiga',
                    d: 'Keempat',
                    e: 'Kelima'
                },
                correctAnswer: 'd',
                explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea keempat Pembukaan UUD 1945.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                category: 'umum',
                subject: 'tes-iq',
                question: 'Jika 2 + 2 = 4, dan 3 + 3 = 6, maka 4 + 4 = ?',
                options: {
                    a: '6',
                    b: '7',
                    c: '8',
                    d: '9',
                    e: '10'
                },
                correctAnswer: 'c',
                explanation: 'Pola penjumlahan menunjukkan bahwa a + a = 2a, sehingga 4 + 4 = 8.',
                point: 1,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('questions', JSON.stringify(sampleQuestions));
    }
    
    if (!localStorage.getItem('participants')) {
        localStorage.setItem('participants', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('examSettings')) {
        localStorage.setItem('examSettings', JSON.stringify({
            timer: 120,
            chairman: 'Moh. Nuril Hudha, S.Pd., M.Si.',
            greeting: 'Selamat Datang di Ujian Online PERGUNU Situbondo',
            info: 'Informasi penting akan ditampilkan di sini oleh admin',
            motivations: JSON.stringify({
                "90-100": "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.",
                "80-89": "Hasil yang sangat baik! Anda telah menunjukkan pemahaman yang mendalam tentang materi.",
                "70-79": "Kerja bagus! Anda memiliki pemahaman yang baik tentang materi ujian.",
                "60-69": "Hasil yang cukup baik. Ada beberapa area yang masih bisa ditingkatkan.",
                "50-59": "Anda telah menyelesaikan ujian. Pertimbangkan untuk mempelajari kembali materi yang kurang dikuasai.",
                "0-49": "Tetap semangat! Hasil ini adalah awal untuk belajar lebih giat lagi."
            }),
            points: 1,
            randomize: true,
            count: 10
        }));
    }
}

// Save participant to database
function saveParticipant(participant) {
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    participants.push(participant);
    localStorage.setItem('participants', JSON.stringify(participants));
}

// Save question to database
function saveQuestion(question) {
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    questions.push(question);
    localStorage.setItem('questions', JSON.stringify(questions));
}

// Get all participants
function getParticipants() {
    return JSON.parse(localStorage.getItem('participants')) || [];
}

// Get all questions
function getQuestions() {
    return JSON.parse(localStorage.getItem('questions')) || [];
}

// Load admin data
function loadAdminData() {
    const settings = JSON.parse(localStorage.getItem('examSettings'));
    if (settings) {
        document.getElementById('exam-timer').value = settings.timer;
        document.getElementById('chairman-name').value = settings.chairman;
        document.getElementById('greeting-text-input').value = settings.greeting;
        document.getElementById('periodic-info-input').value = settings.info;
        document.getElementById('motivation-texts').value = settings.motivations;
        document.getElementById('question-points').value = settings.points;
        document.getElementById('randomize-questions').checked = settings.randomize;
        document.getElementById('question-count').value = settings.count;
    }
    
    // Load participants table
    const participants = getParticipants();
    const table = document.getElementById('participants-table');
    table.innerHTML = `
        <tr>
            <th>Nama</th>
            <th>Status</th>
            <th>Detail</th>
            <th>Tanggal</th>
        </tr>
    `;
    
    participants.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.fullname}</td>
            <td>${p.status === 'pelajar' ? 'Pelajar' : 'Umum'}</td>
            <td>${p.status === 'pelajar' ? 
                `${p.school} (${p.studentId})` : 
                `${p.address.substring(0, 20)}...`}</td>
            <td>${new Date(p.timestamp).toLocaleDateString()}</td>
        `;
        table.appendChild(row);
    });
}

// Initialize exam
function initExam() {
    // In a real implementation, this would load questions based on selections
    // and set up the exam timer, etc.
    console.log('Exam initialized');
}
