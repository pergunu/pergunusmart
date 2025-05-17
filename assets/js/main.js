// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    // Variabel global
    let currentScreen = 'opening';
    let participantData = {};
    let examSettings = {
        loginCode: '12345',
        bankCode: 'BANKSOAL-OPENLOCK',
        cpnsCode: 'CPNSP3K-OPENLOCK',
        adminCode: '65614222'
    };
    
    // Inisialisasi elemen
    const openingScreen = document.getElementById('openingScreen');
    const mainContent = document.getElementById('mainContent');
    const floatingButtons = document.getElementById('floatingButtons');
    const modalOverlay = document.getElementById('modalOverlay');
    const loginBtn = document.getElementById('loginBtn');
    const loginCode = document.getElementById('loginCode');
    
    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    
    // Fungsi untuk menangani login
    function handleLogin() {
        if (loginCode.value === examSettings.loginCode) {
            // Login berhasil, tampilkan terms screen
            showTermsScreen();
        } else {
            alert('Kode login salah! Silakan coba lagi.');
        }
    }
    
    // Fungsi untuk menampilkan layar terms
    function showTermsScreen() {
        openingScreen.style.display = 'none';
        mainContent.innerHTML = `
            <div class="terms-screen">
                <div class="terms-container">
                    <h2 class="terms-title">Kebijakan & Persyaratan</h2>
                    <div class="terms-content">
                        <p>Selamat datang di PERGUNU SMART, platform ujian pengetahuan berbasis web yang dikembangkan oleh Cendhanu (Tim Kreator Digital Pergunu Situbondo). Dengan mengakses dan menggunakan aplikasi ini, Anda menyetujui untuk terikat oleh syarat dan ketentuan berikut:</p>
                        
                        <p><strong>1. Penggunaan Aplikasi</strong><br>
                        PERGUNU SMART ditujukan untuk tujuan pendidikan dan pengujian pengetahuan. Pengguna diharapkan menggunakan aplikasi ini dengan jujur dan bertanggung jawab.</p>
                        
                        <p><strong>2. Data Pribadi</strong><br>
                        Informasi pribadi yang dikumpulkan (nama, nomor telepon, email) hanya akan digunakan untuk keperluan validasi peserta dan penyampaian hasil ujian. Data tidak akan dibagikan kepada pihak ketiga tanpa izin.</p>
                        
                        <p><strong>3. Hak Kekayaan Intelektual</strong><br>
                        Seluruh konten, termasuk soal Ujian, desain antarmuka, dan sistem penilaian merupakan hak milik Pergunu Situbondo. Dilarang melakukan reproduksi, distribusi, atau modifikasi tanpa izin tertulis.</p>
                        
                        <p><strong>4. Ketentuan Ujian</strong><br>
                        Setiap peserta mendapatkan waktu yang telah ditentukan untuk menyelesaikan Ujian. Jawaban yang telah dikirim tidak dapat diubah. Sistem penilaian bersifat otomatis dan final.</p>
                        
                        <p><strong>5. Perilaku Pengguna</strong><br>
                        Dilarang keras melakukan kecurangan dalam bentuk apapun selama mengikuti ujian. Pelanggaran akan mengakibatkan pembatalan hasil dan larangan penggunaan aplikasi.</p>
                        
                        <p><strong>6. Pembaruan Sistem</strong><br>
                        Pergunu Situbondo berhak melakukan pembaruan, perbaikan, atau perubahan sistem tanpa pemberitahuan sebelumnya.</p>
                        
                        <p><strong>7. Tanggung Jawab</strong><br>
                        Pengguna bertanggung jawab penuh atas perangkat dan koneksi internet yang digunakan untuk mengakses aplikasi ini.</p>
                        
                        <p>Dengan melanjutkan, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan di atas.</p>
                    </div>
                    
                    <div class="terms-checkbox">
                        <input type="checkbox" id="agreeTerms" required>
                        <label for="agreeTerms">Saya telah membaca dan menyetujui syarat & ketentuan di atas</label>
                    </div>
                    
                    <button class="continue-btn" id="continueBtn" disabled>
                        Lanjutkan ke Pendaftaran <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Event listener untuk checkbox persetujuan
        const agreeCheckbox = document.getElementById('agreeTerms');
        const continueBtn = document.getElementById('continueBtn');
        
        agreeCheckbox.addEventListener('change', function() {
            continueBtn.disabled = !this.checked;
        });
        
        continueBtn.addEventListener('click', function() {
            if (!agreeCheckbox.checked) {
                alert('Anda harus menyetujui syarat dan ketentuan terlebih dahulu');
                return;
            }
            
            showRegistrationScreen();
        });
    }
    
    // Fungsi untuk menampilkan layar pendaftaran
    function showRegistrationScreen() {
        mainContent.innerHTML = `
            <div class="registration-screen">
                <div class="registration-container">
                    <h2 class="registration-title">Formulir Pendaftaran</h2>
                    <p class="registration-subtitle">Silakan isi data diri Anda dengan benar</p>
                    
                    <form id="registrationForm">
                        <div class="form-group">
                            <label for="fullName" class="form-label">Nama Lengkap</label>
                            <input type="text" id="fullName" class="form-control" required placeholder="Masukkan nama lengkap Anda">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <div class="status-options">
                                <div class="status-option active" data-status="pelajar">
                                    <i class="fas fa-user-graduate"></i> Pelajar
                                </div>
                                <div class="status-option" data-status="umum">
                                    <i class="fas fa-user-tie"></i> Umum
                                </div>
                            </div>
                        </div>
                        
                        <!-- Form untuk pelajar -->
                        <div class="form-group pelajar-fields" id="pelajarFields">
                            <div class="form-group">
                                <label for="schoolName" class="form-label">Nama Sekolah</label>
                                <input type="text" id="schoolName" class="form-control" required placeholder="Masukkan nama sekolah">
                            </div>
                            <div class="form-group">
                                <label for="nis" class="form-label">NIS (Nomor Induk Siswa)</label>
                                <input type="text" id="nis" class="form-control" required placeholder="Masukkan NIS">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Tujuan Ikut Ujian</label>
                                <div class="purpose-options">
                                    <div class="purpose-option active" data-purpose="tugas-sekolah">
                                        Tugas Sekolah
                                    </div>
                                    <div class="purpose-option" data-purpose="tugas-ulangan">
                                        Tugas Ulangan
                                    </div>
                                    <div class="purpose-option" data-purpose="tes-belajar">
                                        Tes dan Belajar
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Tingkat Sekolah</label>
                                <div class="level-options">
                                    <div class="level-option active" data-level="sd">
                                        SD
                                    </div>
                                    <div class="level-option" data-level="smp">
                                        SMP
                                    </div>
                                    <div class="level-option" data-level="sma">
                                        SMA/SMK
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Form untuk umum -->
                        <div class="form-group umum-fields" id="umumFields" style="display: none;">
                            <div class="form-group">
                                <label for="address" class="form-label">Alamat</label>
                                <input type="text" id="address" class="form-control" required placeholder="Masukkan alamat">
                            </div>
                            <div class="form-group">
                                <label for="whatsapp" class="form-label">Nomor WhatsApp Aktif</label>
                                <input type="tel" id="whatsapp" class="form-control" required placeholder="Masukkan nomor WhatsApp">
                            </div>
                            <div class="form-group">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" id="email" class="form-control" placeholder="Masukkan email (opsional)">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Tujuan Ikut Ujian</label>
                                <div class="purpose-options">
                                    <div class="purpose-option active" data-purpose="tes-iq">
                                        Tes IQ
                                    </div>
                                    <div class="purpose-option" data-purpose="cpns-p3k">
                                        Sketsa Ujian CPNS/P3K
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Field khusus CPNS/P3K -->
                            <div class="form-group cpns-fields" id="cpnsFields" style="display: none;">
                                <label for="cpnsCode" class="form-label">Kode Lisensi CPNS/P3K</label>
                                <input type="password" id="cpnsCode" class="form-control" placeholder="Masukkan kode lisensi">
                                <p class="note">Kode default: CPNSP3K-OPENLOCK</p>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" id="registerBtn">
                            <i class="fas fa-save"></i> Simpan & Ikut Ujian
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        // Event listeners untuk form pendaftaran
        const statusOptions = document.querySelectorAll('.status-option');
        statusOptions.forEach(option => {
            option.addEventListener('click', function() {
                document.querySelector('.status-option.active').classList.remove('active');
                this.classList.add('active');
                
                if (this.dataset.status === 'pelajar') {
                    document.getElementById('pelajarFields').style.display = 'block';
                    document.getElementById('umumFields').style.display = 'none';
                } else {
                    document.getElementById('pelajarFields').style.display = 'none';
                    document.getElementById('umumFields').style.display = 'block';
                }
            });
        });
        
        // Event listeners untuk tujuan ujian (umum)
        const purposeOptions = document.querySelectorAll('.purpose-option');
        purposeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const parent = this.closest('.purpose-options');
                parent.querySelector('.purpose-option.active').classList.remove('active');
                this.classList.add('active');
                
                if (this.dataset.purpose === 'cpns-p3k') {
                    document.getElementById('cpnsFields').style.display = 'block';
                } else {
                    document.getElementById('cpnsFields').style.display = 'none';
                }
            });
        });
        
        // Submit form pendaftaran
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            registerParticipant();
        });
    }
    
    // Fungsi untuk mendaftarkan peserta
    function registerParticipant() {
        const status = document.querySelector('.status-option.active').dataset.status;
        
        // Validasi form
        const fullName = document.getElementById('fullName').value;
        if (!fullName) {
            alert('Nama lengkap harus diisi');
            return;
        }
        
        if (status === 'pelajar') {
            const schoolName = document.getElementById('schoolName').value;
            const nis = document.getElementById('nis').value;
            
            if (!schoolName || !nis) {
                alert('Data pelajar harus lengkap');
                return;
            }
            
            participantData = {
                fullName,
                status,
                schoolName,
                nis,
                purpose: document.querySelector('.purpose-option.active').dataset.purpose,
                level: document.querySelector('.level-option.active').dataset.level
            };
        } else {
            const address = document.getElementById('address').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const purpose = document.querySelector('.purpose-option.active').dataset.purpose;
            
            if (!address || !whatsapp) {
                alert('Data umum harus lengkap');
                return;
            }
            
            // Validasi khusus CPNS/P3K
            if (purpose === 'cpns-p3k') {
                const cpnsCode = document.getElementById('cpnsCode').value;
                if (cpnsCode !== examSettings.cpnsCode) {
                    alert('Kode lisensi CPNS/P3K salah!');
                    return;
                }
            }
            
            participantData = {
                fullName,
                status,
                address,
                whatsapp,
                email: document.getElementById('email').value,
                purpose,
                level: purpose === 'cpns-p3k' ? 'cpns' : 'umum'
            };
        }
        
        // Simpan data peserta dan lanjutkan ke pemilihan ujian
        showExamSelectionScreen();
    }
    
    // Fungsi untuk menampilkan layar pemilihan ujian
    function showExamSelectionScreen() {
        mainContent.innerHTML = `
            <div class="exam-selection-screen">
                <div class="exam-container">
                    <h2 class="exam-title">Pilih Jenis Ujian</h2>
                    <p class="exam-subtitle">Silakan pilih jenis ujian yang ingin Anda ikuti</p>
                    
                    <div class="exam-options">
                        ${participantData.status === 'pelajar' ? `
                        <div class="exam-option active" data-exam="agama">
                            <i class="fas fa-mosque"></i> Agama
                        </div>
                        <div class="exam-option" data-exam="ppkn">
                            <i class="fas fa-landmark"></i> PPKN
                        </div>
                        <div class="exam-option" data-exam="sejarah">
                            <i class="fas fa-history"></i> Sejarah
                        </div>
                        <div class="exam-option" data-exam="ipa">
                            <i class="fas fa-flask"></i> IPA
                        </div>
                        <div class="exam-option" data-exam="ips">
                            <i class="fas fa-globe-asia"></i> IPS
                        </div>
                        <div class="exam-option" data-exam="matematika">
                            <i class="fas fa-square-root-alt"></i> Matematika
                        </div>
                        <div class="exam-option" data-exam="bahasa-indonesia">
                            <i class="fas fa-book-open"></i> Bahasa Indonesia
                        </div>
                        <div class="exam-option" data-exam="bahasa-inggris">
                            <i class="fas fa-language"></i> Bahasa Inggris
                        </div>
                        ` : `
                        <div class="exam-option active" data-exam="logika">
                            <i class="fas fa-brain"></i> Ujian Logika
                        </div>
                        ${participantData.purpose === 'cpns-p3k' ? `
                        <div class="exam-option" data-exam="cpns-p3k">
                            <i class="fas fa-user-tie"></i> Ujian CPNS/P3K
                        </div>
                        ` : ''}
                        `}
                    </div>
                    
                    <div class="exam-levels">
                        <h3 class="level-title">Pilih Tingkat Kesulitan</h3>
                        <div class="level-options">
                            <div class="level-option active" data-difficulty="mudah">
                                Mudah
                            </div>
                            <div class="level-option" data-difficulty="sedang">
                                Sedang
                            </div>
                            <div class="level-option" data-difficulty="sulit">
                                Sulit
                            </div>
                        </div>
                    </div>
                    
                    <div class="exam-info">
                        <p><i class="fas fa-info-circle"></i> Waktu ujian: 90 menit</p>
                        <p><i class="fas fa-info-circle"></i> Jumlah soal: 20 pertanyaan</p>
                    </div>
                    
                    <button class="btn btn-primary" id="startExamBtn">
                        <i class="fas fa-play"></i> Mulai Ujian Sekarang
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners untuk pilihan ujian
        const examOptions = document.querySelectorAll('.exam-option');
        examOptions.forEach(option => {
            option.addEventListener('click', function() {
                document.querySelector('.exam-option.active').classList.remove('active');
                this.classList.add('active');
            });
        });
        
        // Event listeners untuk tingkat kesulitan
        const levelOptions = document.querySelectorAll('.level-option');
        levelOptions.forEach(option => {
            option.addEventListener('click', function() {
                document.querySelector('.level-option.active').classList.remove('active');
                this.classList.add('active');
            });
        });
        
        // Mulai ujian
        document.getElementById('startExamBtn').addEventListener('click', function() {
            const selectedExam = document.querySelector('.exam-option.active').dataset.exam;
            const selectedDifficulty = document.querySelector('.level-option.active').dataset.difficulty;
            
            participantData.exam = selectedExam;
            participantData.difficulty = selectedDifficulty;
            
            startExam();
        });
    }
    
    // Fungsi untuk memulai ujian
    function startExam() {
        // Implementasi ujian akan di-handle oleh quiz.js
        console.log('Memulai ujian:', participantData);
        // Di sini Anda akan memuat quiz.js dan memulai ujian
        // Untuk contoh, kita akan langsung ke hasil
        showResultsScreen();
    }
    
    // Fungsi untuk menampilkan layar hasil
    function showResultsScreen() {
        mainContent.innerHTML = `
            <div class="results-screen">
                <div class="certificate-wrapper">
                    <div class="certificate-content">
                        <div class="certificate-header">
                            <div class="certificate-watermark">USWATUN HASANAH/PELAJAR/SMA/IPS/16052025/T9B3-S6M3/PERGUNU-STB</div>
                            <h2 class="certificate-title">SERTIFIKAT PRESTASI</h2>
                            <p class="certificate-subtitle">Diberikan Kepada</p>
                        </div>
                        
                        <div class="certificate-name">${participantData.fullName}</div>
                        
                        <div class="certificate-text">
                            Atas partisipasi dan pencapaian luar biasa dalam<br>
                            <strong>Ujian Pergunu Situbondo</strong>
                        </div>
                        
                        <div class="certificate-score">85%</div>
                        
                        <div class="certificate-message">
                            <p>BAIK SEKALI! Anda memiliki pemahaman yang solid tentang materi ini.</p>
                        </div>
                        
                        <div class="certificate-footer">
                            <div class="certificate-date">Ditetapkan di: Situbondo, 16 Mei 2025</div>
                            <div class="barcode-container">
                                <img src="assets/images/BARCODE.png" alt="Barcode">
                                <div class="barcode-text">KETUA PERGUNU SITUBONDO</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" id="printCertificateBtn">
                        <i class="fas fa-print"></i> Cetak Sertifikat
                    </button>
                    <button class="btn btn-secondary" id="retryExamBtn">
                        <i class="fas fa-redo"></i> Ulangi Ujian
                    </button>
                </div>
            </div>
        `;
        
        // Sembunyikan floating buttons di hasil
        floatingButtons.style.display = 'none';
        
        // Mainkan suara applause
        const applauseSound = new Audio('assets/audio/applause.mp3');
        applauseSound.play().catch(e => console.log('Autoplay prevented:', e));
        
        // Event listeners untuk hasil
        document.getElementById('printCertificateBtn').addEventListener('click', function() {
            window.print();
        });
        
        document.getElementById('retryExamBtn').addEventListener('click', function() {
            showExamSelectionScreen();
            floatingButtons.style.display = 'flex';
        });
    }
    
    // Inisialisasi modals
    initModals();
    
    // Fungsi untuk menginisialisasi modals
    function initModals() {
        // Modal share
        const shareBtn = document.getElementById('shareBtn');
        const shareModal = document.getElementById('shareModal');
        
        shareBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'block';
            shareModal.style.display = 'block';
        });
        
        // Modal goto
        const gotoBtn = document.getElementById('gotoBtn');
        const gotoModal = document.getElementById('gotoModal');
        
        gotoBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'block';
            gotoModal.style.display = 'block';
        });
        
        // Modal bank soal
        const bankBtn = document.getElementById('bankBtn');
        const bankModal = document.getElementById('bankModal');
        
        bankBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'block';
            bankModal.style.display = 'block';
        });
        
        // Modal admin
        const adminBtn = document.getElementById('adminBtn');
        const adminModal = document.getElementById('adminModal');
        
        adminBtn.addEventListener('click', function() {
            modalOverlay.style.display = 'block';
            adminModal.style.display = 'block';
        });
        
        // Tutup modal
        const modalCloses = document.querySelectorAll('.modal-close');
        modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                modalOverlay.style.display = 'none';
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        modalOverlay.addEventListener('click', function() {
            this.style.display = 'none';
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
        
        // Login bank soal
        const bankLoginBtn = document.getElementById('bankLoginBtn');
        const bankCode = document.getElementById('bankCode');
        
        bankLoginBtn.addEventListener('click', function() {
            if (bankCode.value === examSettings.bankCode) {
                document.querySelector('.bank-login').style.display = 'none';
                document.getElementById('bankContent').style.display = 'block';
                loadBankSoal();
            } else {
                alert('Kode bank soal salah!');
            }
        });
        
        // Login admin
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        const adminCode = document.getElementById('adminCode');
        
        adminLoginBtn.addEventListener('click', function() {
            if (adminCode.value === examSettings.adminCode) {
                document.querySelector('.admin-login').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                loadAdminPanel();
            } else {
                alert('Kode admin salah!');
            }
        });
    }
    
    // Fungsi untuk memuat bank soal
    function loadBankSoal() {
        const bankContent = document.getElementById('bankContent');
        bankContent.innerHTML = `
            <div class="bank-tabs">
                <div class="bank-tab active" data-tab="add">Tambah Soal</div>
                <div class="bank-tab" data-tab="manage">Kelola Soal</div>
            </div>
            
            <div class="bank-tab-content active" id="addTab">
                <form id="addQuestionForm">
                    <div class="form-group">
                        <label for="questionCategory">Kategori</label>
                        <select id="questionCategory" class="form-control" required>
                            <option value="">Pilih Kategori</option>
                            <option value="pelajar">Pelajar</option>
                            <option value="umum">Umum</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="subcategoryGroup" style="display: none;">
                        <label for="questionSubcategory">Subkategori</label>
                        <select id="questionSubcategory" class="form-control">
                            <option value="ipa">IPA</option>
                            <option value="ips">IPS</option>
                            <option value="matematika">Matematika</option>
                            <option value="agama">Agama</option>
                            <option value="ppkn">PPKN</option>
                            <option value="sejarah">Sejarah</option>
                            <option value="bahasa_indonesia">Bahasa Indonesia</option>
                            <option value="bahasa_inggris">Bahasa Inggris</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="umumSubcategoryGroup" style="display: none;">
                        <label for="umumSubcategory">Jenis Ujian</label>
                        <select id="umumSubcategory" class="form-control">
                            <option value="logika">Logika</option>
                            <option value="cpns-p3k">CPNS/P3K</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="questionLevel">Tingkat Kesulitan</label>
                        <select id="questionLevel" class="form-control" required>
                            <option value="">Pilih Tingkat</option>
                            <option value="mudah">Mudah</option>
                            <option value="sedang">Sedang</option>
                            <option value="sulit">Sulit</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="questionText">Pertanyaan</label>
                        <textarea id="questionText" class="form-control" rows="3" required placeholder="Masukkan pertanyaan"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Pilihan Jawaban</label>
                        <div class="option-input">
                            <span class="option-prefix">A.</span>
                            <input type="text" id="optionA" class="form-control" placeholder="Pilihan A" required>
                        </div>
                        <div class="option-input">
                            <span class="option-prefix">B.</span>
                            <input type="text" id="optionB" class="form-control" placeholder="Pilihan B" required>
                        </div>
                        <div class="option-input">
                            <span class="option-prefix">C.</span>
                            <input type="text" id="optionC" class="form-control" placeholder="Pilihan C" required>
                        </div>
                        <div class="option-input">
                            <span class="option-prefix">D.</span>
                            <input type="text" id="optionD" class="form-control" placeholder="Pilihan D" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="correctAnswer">Jawaban Benar</label>
                        <select id="correctAnswer" class="form-control" required>
                            <option value="">Pilih Jawaban Benar</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="explanation">Penjelasan Jawaban</label>
                        <textarea id="explanation" class="form-control" rows="3" required placeholder="Masukkan penjelasan jawaban"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelAddQuestion">
                            <i class="fas fa-times"></i> Batal
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Simpan Soal
                        </button>
                    </div>
                </form>
                
                <div class="ai-generator">
                    <h4><i class="fas fa-robot"></i> Generator Soal AI</h4>
                    <p>Masukkan topik untuk menghasilkan soal secara otomatis:</p>
                    <input type="text" id="aiPrompt" class="form-control" placeholder="Contoh: Soal matematika dasar tentang aljabar untuk pelajar SMP">
                    <button class="btn btn-success" id="generateAiQuestion">
                        <i class="fas fa-magic"></i> Generate dengan AI
                    </button>
                </div>
            </div>
            
            <div class="bank-tab-content" id="manageTab">
                <div class="question-filters">
                    <div class="form-group">
                        <label for="filterCategory">Filter Kategori</label>
                        <select id="filterCategory" class="form-control">
                            <option value="">Semua Kategori</option>
                            <option value="pelajar">Pelajar</option>
                            <option value="umum">Umum</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="filterSubcategory">Filter Subkategori</label>
                        <select id="filterSubcategory" class="form-control" disabled>
                            <option value="">Semua Subkategori</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="filterLevel">Filter Tingkat</label>
                        <select id="filterLevel" class="form-control">
                            <option value="">Semua Tingkat</option>
                            <option value="mudah">Mudah</option>
                            <option value="sedang">Sedang</option>
                            <option value="sulit">Sulit</option>
                        </select>
                    </div>
                </div>
                
                <div class="question-list" id="questionList">
                    <!-- Daftar soal akan dimuat di sini -->
                </div>
            </div>
        `;
        
        // Event listeners untuk tab bank soal
        const bankTabs = document.querySelectorAll('.bank-tab');
        bankTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelector('.bank-tab.active').classList.remove('active');
                this.classList.add('active');
                
                document.querySelector('.bank-tab-content.active').classList.remove('active');
                document.getElementById(`${this.dataset.tab}Tab`).classList.add('active');
            });
        });
        
        // Event listener untuk perubahan kategori
        document.getElementById('questionCategory').addEventListener('change', function() {
            const category = this.value;
            document.getElementById('subcategoryGroup').style.display = category === 'pelajar' ? 'block' : 'none';
            document.getElementById('umumSubcategoryGroup').style.display = category === 'umum' ? 'block' : 'none';
        });
        
        // Submit form tambah soal
        document.getElementById('addQuestionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            // Implementasi penyimpanan soal
            alert('Soal berhasil ditambahkan!');
            this.reset();
        });
        
        // Generate soal dengan AI
        document.getElementById('generateAiQuestion').addEventListener('click', function() {
            const prompt = document.getElementById('aiPrompt').value;
            if (!prompt) {
                alert('Silakan masukkan prompt untuk menghasilkan soal!');
                return;
            }
            
            // Simulasi generate soal dengan AI
            alert('Fitur generate soal dengan AI akan diimplementasikan lebih lanjut');
        });
        
        // Filter soal
        document.getElementById('filterCategory').addEventListener('change', function() {
            const category = this.value;
            document.getElementById('filterSubcategory').disabled = !category;
            
            // Implementasi filter soal
        });
    }
    
    // Fungsi untuk memuat panel admin
    function loadAdminPanel() {
        const adminContent = document.getElementById('adminContent');
        adminContent.innerHTML = `
            <div class="admin-tabs">
                <div class="admin-tab active" data-tab="codes">Kelola Kode</div>
                <div class="admin-tab" data-tab="settings">Pengaturan</div>
                <div class="admin-tab" data-tab="exams">Kelola Ujian</div>
                <div class="admin-tab" data-tab="messages">Pesan Motivasi</div>
            </div>
            
            <div class="admin-tab-content active" id="codesTab">
                <div class="code-section">
                    <h4><i class="fas fa-key"></i> Kode Login</h4>
                    <div class="form-group">
                        <label for="newLoginCode">Kode Login Baru</label>
                        <input type="password" id="newLoginCode" class="form-control" placeholder="Masukkan kode login baru">
                    </div>
                    <div class="form-group">
                        <label for="currentLoginCode">Kode Login Lama</label>
                        <input type="text" id="currentLoginCode" class="form-control" value="${examSettings.loginCode}" readonly>
                    </div>
                    <button class="btn btn-primary" id="saveLoginCode">
                        <i class="fas fa-save"></i> Simpan Kode
                    </button>
                </div>
                
                <div class="code-section">
                    <h4><i class="fas fa-key"></i> Kode Ujian CPNS/P3K</h4>
                    <div class="form-group">
                        <label for="newCpnsCode">Kode Ujian Baru</label>
                        <input type="password" id="newCpnsCode" class="form-control" placeholder="Masukkan kode ujian baru">
                    </div>
                    <div class="form-group">
                        <label for="currentCpnsCode">Kode Ujian Lama</label>
                        <input type="text" id="currentCpnsCode" class="form-control" value="${examSettings.cpnsCode}" readonly>
                    </div>
                    <button class="btn btn-primary" id="saveCpnsCode">
                        <i class="fas fa-save"></i> Simpan Kode
                    </button>
                </div>
                
                <div class="code-section">
                    <h4><i class="fas fa-key"></i> Kode Bank Soal</h4>
                    <div class="form-group">
                        <label for="newBankCode">Kode Bank Baru</label>
                        <input type="password" id="newBankCode" class="form-control" placeholder="Masukkan kode bank baru">
                    </div>
                    <div class="form-group">
                        <label for="currentBankCode">Kode Bank Lama</label>
                        <input type="text" id="currentBankCode" class="form-control" value="${examSettings.bankCode}" readonly>
                    </div>
                    <button class="btn btn-primary" id="saveBankCode">
                        <i class="fas fa-save"></i> Simpan Kode
                    </button>
                </div>
                
                <div class="code-section">
                    <h4><i class="fas fa-key"></i> Kode Kontrol Panel Admin</h4>
                    <div class="form-group">
                        <label for="newAdminCode">Kode Admin Baru</label>
                        <input type="password" id="newAdminCode" class="form-control" placeholder="Masukkan kode admin baru">
                    </div>
                    <div class="form-group">
                        <label for="currentAdminCode">Kode Admin Lama</label>
                        <input type="text" id="currentAdminCode" class="form-control" value="${examSettings.adminCode}" readonly>
                    </div>
                    <button class="btn btn-primary" id="saveAdminCode">
                        <i class="fas fa-save"></i> Simpan Kode Admin
                    </button>
                </div>
            </div>
            
            <div class="admin-tab-content" id="settingsTab">
                <div class="setting-section">
                    <h4><i class="fas fa-toggle-on"></i> Aktifkan/Nonaktifkan Ujian</h4>
                    <div class="form-group">
                        <label>Kategori Utama</label>
                        <div class="toggle-buttons">
                            <button class="btn btn-success" id="enablePelajar">
                                <i class="fas fa-check"></i> Aktifkan Pelajar
                            </button>
                            <button class="btn btn-danger" id="disablePelajar">
                                <i class="fas fa-times"></i> Nonaktifkan Pelajar
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Subkategori Pelajar</label>
                        <div class="subcategory-toggles">
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="ipa">
                                <i class="fas fa-check"></i> IPA
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="ips">
                                <i class="fas fa-check"></i> IPS
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="matematika">
                                <i class="fas fa-check"></i> Matematika
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="agama">
                                <i class="fas fa-check"></i> Agama
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="ppkn">
                                <i class="fas fa-check"></i> PPKN
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="sejarah">
                                <i class="fas fa-check"></i> Sejarah
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="bahasa_indonesia">
                                <i class="fas fa-check"></i> Bahasa Indonesia
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="pelajar" data-subcategory="bahasa_inggris">
                                <i class="fas fa-check"></i> Bahasa Inggris
                            </button>
                        </div>
                        <button class="btn btn-sm btn-danger" id="disableAllPelajar">
                            <i class="fas fa-times"></i> Nonaktifkan Semua
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label>Kategori Umum</label>
                        <div class="toggle-buttons">
                            <button class="btn btn-success" id="enableUmum">
                                <i class="fas fa-check"></i> Aktifkan Umum
                            </button>
                            <button class="btn btn-danger" id="disableUmum">
                                <i class="fas fa-times"></i> Nonaktifkan Umum
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Subkategori Umum</label>
                        <div class="subcategory-toggles">
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="umum" data-subcategory="logika">
                                <i class="fas fa-check"></i> Logika
                            </button>
                            <button class="btn btn-sm btn-success toggle-subcategory" data-category="umum" data-subcategory="cpns-p3k">
                                <i class="fas fa-check"></i> CPNS/P3K
                            </button>
                        </div>
                        <button class="btn btn-sm btn-danger" id="disableAllUmum">
                            <i class="fas fa-times"></i> Nonaktifkan Semua
                        </button>
                    </div>
                </div>
                
                <div class="setting-section">
                    <h4><i class="fas fa-clock"></i> Pengaturan Timer Ujian</h4>
                    <div class="form-group">
                        <label for="examDuration">Durasi Ujian (menit)</label>
                        <input type="number" id="examDuration" class="form-control" value="90" min="10" max="180">
                    </div>
                    <button class="btn btn-primary" id="saveExamDuration">
                        <i class="fas fa-save"></i> Simpan Durasi
                    </button>
                </div>
                
                <div class="setting-section">
                    <h4><i class="fas fa-user-tie"></i> Pengaturan Nama Ketua</h4>
                    <div class="form-group">
                        <label for="chairmanName">Nama Ketua Pergunu</label>
                        <input type="text" id="chairmanName" class="form-control" value="Moh. Nuril Hudha, S.Pd., M.Si.">
                    </div>
                    <button class="btn btn-primary" id="saveChairmanName">
                        <i class="fas fa-save"></i> Simpan Nama
                    </button>
                </div>
            </div>
            
            <div class="admin-tab-content" id="examsTab">
                <div class="exam-stats">
                    <div class="stat-card">
                        <div class="stat-value">1,245</div>
                        <div class="stat-label">Total Peserta</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">856</div>
                        <div class="stat-label">Peserta Pelajar</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">389</div>
                        <div class="stat-label">Peserta Umum</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">72%</div>
                        <div class="stat-label">Rata-rata Nilai</div>
                    </div>
                </div>
                
                <div class="exam-list">
                    <h4>Daftar Ujian Terakhir</h4>
                    <table class="exam-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Peserta</th>
                                <th>Jenis Ujian</th>
                                <th>Nilai</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Uswatun Hasanah</td>
                                <td>Pelajar - IPA</td>
                                <td>85%</td>
                                <td>16 Mei 2025</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Budi Santoso</td>
                                <td>Umum - Logika</td>
                                <td>78%</td>
                                <td>15 Mei 2025</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Siti Aminah</td>
                                <td>Pelajar - Matematika</td>
                                <td>92%</td>
                                <td>15 Mei 2025</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="admin-tab-content" id="messagesTab">
                <div class="message-section">
                    <h4><i class="fas fa-comment"></i> Teks Sapa Pembuka</h4>
                    <div class="form-group">
                        <textarea id="welcomeMessage" class="form-control" rows="3">Selamat datang di platform ujian online PERGUNU SMART. Silakan masukkan kode login untuk memulai.</textarea>
                    </div>
                    <button class="btn btn-primary" id="saveWelcomeMessage">
                        <i class="fas fa-save"></i> Simpan Pesan
                    </button>
                </div>
                
                <div class="message-section">
                    <h4><i class="fas fa-award"></i> Pesan Motivasi Sertifikat</h4>
                    <div class="form-group">
                        <label>Nilai 80-100%</label>
                        <textarea id="excellentMessage" class="form-control" rows="2">SEMPURNA! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini!</textarea>
                    </div>
                    <div class="form-group">
                        <label>Nilai 60-79%</label>
                        <textarea id="goodMessage" class="form-control" rows="2">BAIK SEKALI! Anda memiliki pemahaman yang solid tentang materi ini.</textarea>
                    </div>
                    <div class="form-group">
                        <label>Nilai 40-59%</label>
                        <textarea id="averageMessage" class="form-control" rows="2">CUKUP BAIK. Tingkatkan lagi belajarnya!</textarea>
                    </div>
                    <div class="form-group">
                        <label>Nilai 0-39%</label>
                        <textarea id="poorMessage" class="form-control" rows="2">TERUS BERLATIH! Setiap kesalahan adalah kesempatan untuk belajar lebih baik lagi.</textarea>
                    </div>
                    <button class="btn btn-primary" id="saveMotivationMessages">
                        <i class="fas fa-save"></i> Simpan Semua Pesan
                    </button>
                </div>
                
                <div class="message-section">
                    <h4><i class="fas fa-info-circle"></i> Informasi Berkala</h4>
                    <div class="form-group">
                        <textarea id="periodicInfo" class="form-control" rows="3">Informasi penting tentang ujian akan ditampilkan di sini.</textarea>
                    </div>
                    <button class="btn btn-primary" id="savePeriodicInfo">
                        <i class="fas fa-save"></i> Simpan Informasi
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners untuk tab admin
        const adminTabs = document.querySelectorAll('.admin-tab');
        adminTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelector('.admin-tab.active').classList.remove('active');
                this.classList.add('active');
                
                document.querySelector('.admin-tab-content.active').classList.remove('active');
                document.getElementById(`${this.dataset.tab}Tab`).classList.add('active');
            });
        });
        
        // Simpan kode login
        document.getElementById('saveLoginCode').addEventListener('click', function() {
            const newCode = document.getElementById('newLoginCode').value;
            if (newCode) {
                examSettings.loginCode = newCode;
                document.getElementById('currentLoginCode').value = newCode;
                document.getElementById('newLoginCode').value = '';
                alert('Kode login berhasil diubah!');
            } else {
                alert('Silakan masukkan kode baru!');
            }
        });
        
        // Simpan kode CPNS/P3K
        document.getElementById('saveCpnsCode').addEventListener('click', function() {
            const newCode = document.getElementById('newCpnsCode').value;
            if (newCode) {
                examSettings.cpnsCode = newCode;
                document.getElementById('currentCpnsCode').value = newCode;
                document.getElementById('newCpnsCode').value = '';
                alert('Kode CPNS/P3K berhasil diubah!');
            } else {
                alert('Silakan masukkan kode baru!');
            }
        });
        
        // Simpan kode bank soal
        document.getElementById('saveBankCode').addEventListener('click', function() {
            const newCode = document.getElementById('newBankCode').value;
            if (newCode) {
                examSettings.bankCode = newCode;
                document.getElementById('currentBankCode').value = newCode;
                document.getElementById('newBankCode').value = '';
                alert('Kode bank soal berhasil diubah!');
            } else {
                alert('Silakan masukkan kode baru!');
            }
        });
        
        // Simpan kode admin
        document.getElementById('saveAdminCode').addEventListener('click', function() {
            const newCode = document.getElementById('newAdminCode').value;
            if (newCode) {
                examSettings.adminCode = newCode;
                document.getElementById('currentAdminCode').value = newCode;
                document.getElementById('newAdminCode').value = '';
                alert('Kode admin berhasil diubah!');
            } else {
                alert('Silakan masukkan kode baru!');
            }
        });
        
        // Toggle kategori dan subkategori
        document.getElementById('enablePelajar').addEventListener('click', function() {
            alert('Kategori Pelajar diaktifkan');
        });
        
        document.getElementById('disablePelajar').addEventListener('click', function() {
            alert('Kategori Pelajar dinonaktifkan');
        });
        
        document.getElementById('enableUmum').addEventListener('click', function() {
            alert('Kategori Umum diaktifkan');
        });
        
        document.getElementById('disableUmum').addEventListener('click', function() {
            alert('Kategori Umum dinonaktifkan');
        });
        
        // Toggle subkategori
        document.querySelectorAll('.toggle-subcategory').forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.dataset.category;
                const subcategory = this.dataset.subcategory;
                alert(`Subkategori ${subcategory} untuk kategori ${category} diaktifkan/dinonaktifkan`);
            });
        });
        
        // Nonaktifkan semua subkategori
        document.getElementById('disableAllPelajar').addEventListener('click', function() {
            alert('Semua subkategori Pelajar dinonaktifkan');
        });
        
        document.getElementById('disableAllUmum').addEventListener('click', function() {
            alert('Semua subkategori Umum dinonaktifkan');
        });
        
        // Simpan durasi ujian
        document.getElementById('saveExamDuration').addEventListener('click', function() {
            const duration = document.getElementById('examDuration').value;
            if (duration >= 10 && duration <= 180) {
                alert(`Durasi ujian disimpan: ${duration} menit`);
            } else {
                alert('Durasi harus antara 10-180 menit');
            }
        });
        
        // Simpan nama ketua
        document.getElementById('saveChairmanName').addEventListener('click', function() {
            const name = document.getElementById('chairmanName').value;
            if (name) {
                alert(`Nama ketua disimpan: ${name}`);
            } else {
                alert('Silakan masukkan nama ketua');
            }
        });
        
        // Simpan pesan sapa
        document.getElementById('saveWelcomeMessage').addEventListener('click', function() {
            const message = document.getElementById('welcomeMessage').value;
            if (message) {
                alert('Pesan sapa pembuka disimpan');
            } else {
                alert('Silakan masukkan pesan sapa');
            }
        });
        
        // Simpan pesan motivasi
        document.getElementById('saveMotivationMessages').addEventListener('click', function() {
            alert('Semua pesan motivasi disimpan');
        });
        
        // Simpan informasi berkala
        document.getElementById('savePeriodicInfo').addEventListener('click', function() {
            const info = document.getElementById('periodicInfo').value;
            if (info) {
                alert('Informasi berkala disimpan');
            } else {
                alert('Silakan masukkan informasi berkala');
            }
        });
    }
});