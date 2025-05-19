// Admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Access question bank
    const accessBankBtn = document.getElementById('access-bank');
    if (accessBankBtn) {
        accessBankBtn.addEventListener('click', function() {
            const bankCode = document.getElementById('bank-code').value;
            if (bankCode === 'OPENLOCK-1926') { // Default bank code
                document.getElementById('bank-content').style.display = 'block';
            } else {
                alert('Kode bank soal salah!');
            }
        });
    }
    
    // Access admin panel
    const accessAdminBtn = document.getElementById('access-admin');
    if (accessAdminBtn) {
        accessAdminBtn.addEventListener('click', function() {
            const adminCode = document.getElementById('admin-code').value;
            if (adminCode === '65614222') { // Default admin code
                document.getElementById('admin-content').style.display = 'block';
                
                // Load participant data
                loadParticipantData();
            } else {
                alert('Kode admin salah!');
            }
        });
    }
    
    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Deactivate all tab buttons
            document.querySelectorAll('.tab-btn').forEach(tabBtn => {
                tabBtn.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Method tabs in question bank
    document.querySelectorAll('.method-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Deactivate all method buttons
            document.querySelectorAll('.method-btn').forEach(methodBtn => {
                methodBtn.classList.remove('active');
            });
            
            // Hide all method contents
            document.querySelectorAll('.method-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected method
            this.classList.add('active');
            document.querySelector(`.method-content.${method}`).classList.add('active');
        });
    });
    
    // Save codes
    document.getElementById('save-login-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-login-code').value;
        if (newCode) {
            document.getElementById('current-login-code').value = newCode;
            alert('Kode login berhasil diubah!');
        } else {
            alert('Masukkan kode baru!');
        }
    });
    
    document.getElementById('save-cpns-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-cpns-code').value;
        if (newCode) {
            document.getElementById('current-cpns-code').value = newCode;
            alert('Kode ujian CPNS/P3K berhasil diubah!');
        } else {
            alert('Masukkan kode baru!');
        }
    });
    
    document.getElementById('save-bank-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-bank-code').value;
        if (newCode) {
            document.getElementById('current-bank-code').value = newCode;
            alert('Kode bank soal berhasil diubah!');
        } else {
            alert('Masukkan kode baru!');
        }
    });
    
    document.getElementById('save-admin-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-admin-code').value;
        if (newCode) {
            document.getElementById('current-admin-code').value = newCode;
            alert('Kode admin berhasil diubah!');
        } else {
            alert('Masukkan kode baru!');
        }
    });
    
    // Save exam settings
    document.getElementById('save-timer').addEventListener('click', function() {
        const timerValue = document.getElementById('exam-timer').value;
        if (timerValue && timerValue > 0) {
            alert(`Timer ujian berhasil diubah menjadi ${timerValue} menit!`);
        } else {
            alert('Masukkan nilai timer yang valid!');
        }
    });
    
    document.getElementById('save-point').addEventListener('click', function() {
        const pointValue = document.getElementById('question-point').value;
        alert(`Point per soal berhasil diubah menjadi ${pointValue}!`);
    });
    
    document.getElementById('save-count').addEventListener('click', function() {
        const countValue = document.getElementById('question-count').value;
        alert(`Jumlah soal berhasil diubah menjadi ${countValue}!`);
    });
    
    document.getElementById('save-shuffle').addEventListener('click', function() {
        const shuffleValue = document.querySelector('input[name="shuffle"]:checked').value;
        alert(`Pengacakan soal ${shuffleValue === 'on' ? 'diaktifkan' : 'dinonaktifkan'}!`);
    });
    
    document.getElementById('save-exam-status').addEventListener('click', function() {
        alert('Status ujian berhasil disimpan!');
    });
    
    // Save content settings
    document.getElementById('save-greeting').addEventListener('click', function() {
        alert('Pesan pembuka berhasil disimpan!');
    });
    
    document.getElementById('save-info').addEventListener('click', function() {
        alert('Informasi berkala berhasil disimpan!');
    });
    
    document.getElementById('save-chairman').addEventListener('click', function() {
        alert('Nama ketua berhasil disimpan!');
    });
    
    document.getElementById('save-motivation').addEventListener('click', function() {
        alert('Pesan motivasi berhasil disimpan!');
    });
    
    document.getElementById('add-music').addEventListener('click', function() {
        const musicLink = prompt('Masukkan link musik:');
        if (musicLink) {
            const textarea = document.getElementById('music-links');
            textarea.value += (textarea.value ? '\n' : '') + musicLink;
        }
    });
    
    document.getElementById('save-music').addEventListener('click', function() {
        alert('Link musik berhasil disimpan!');
    });
    
    // Export data
    document.getElementById('export-data').addEventListener('click', function() {
        const format = document.getElementById('export-format').value;
        alert(`Data peserta berhasil diexport dalam format ${format.toUpperCase()}!`);
    });
    
    // Export questions
    document.getElementById('export-questions').addEventListener('click', function() {
        alert('Soal ujian berhasil diexport!');
    });
    
    // Load participant data
    function loadParticipantData() {
        const allResults = JSON.parse(localStorage.getItem('examResults')) || [];
        const tableBody = document.querySelector('#participant-table tbody');
        tableBody.innerHTML = '';
        
        allResults.forEach((result, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${result.participant.fullname}</td>
                <td>${result.participant.status}</td>
                <td>${result.participant.level || 'Umum'}</td>
                <td>${result.participant.purpose}</td>
                <td>${result.score}</td>
                <td>${new Date(result.timestamp).toLocaleDateString()}</td>
                <td><button class="btn-small view-cert" data-index="${index}">Lihat</button></td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to view certificate buttons
        document.querySelectorAll('.view-cert').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                const result = allResults[index];
                
                // Show certificate
                document.getElementById('admin-panel-modal').classList.remove('active');
                document.getElementById('certificate-screen').classList.add('active');
                
                // Generate certificate
                generateCertificate(result.participant, result.score);
            });
        });
    }
});
