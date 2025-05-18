// Update setting-group untuk toggle ujian
const settingGroup = document.querySelector('.toggle-group');
settingGroup.innerHTML = `
    <label class="toggle-label">
        <input type="checkbox" id="toggle-agama" checked> AGAMA
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-ppkn" checked> PPKN
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-sejarah" checked> SEJARAH
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-ipa" checked> IPA
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-ips" checked> IPS
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-matematika" checked> MATEMATIKA
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-indonesia" checked> BAHASA INDONESIA
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-inggris" checked> BAHASA INGGRIS
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-extra" checked> MATERI EXTRA
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-khusus" checked> MATERI KHUSUS
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-logika" checked> UJIAN LOGIKA
    </label>
    <label class="toggle-label">
        <input type="checkbox" id="toggle-cpns" checked> UJIAN CPNS/P3K
    </label>
`;

// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Code saving functionality
    document.getElementById('save-login-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-login-code').value.trim();
        if (newCode) {
            document.getElementById('current-login-code').value = newCode;
            document.getElementById('new-login-code').value = '';
            alert('Kode login berhasil diperbarui!');
        } else {
            alert('Masukkan kode baru terlebih dahulu.');
        }
    });
    
    // Repeat for other code types
    document.getElementById('save-exam-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-exam-code').value.trim();
        if (newCode) {
            document.getElementById('current-exam-code').value = newCode;
            document.getElementById('new-exam-code').value = '';
            alert('Kode ujian CPNS berhasil diperbarui!');
        } else {
            alert('Masukkan kode baru terlebih dahulu.');
        }
    });
    
    document.getElementById('save-question-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-question-code').value.trim();
        if (newCode) {
            document.getElementById('current-question-code').value = newCode;
            document.getElementById('new-question-code').value = '';
            alert('Kode bank soal berhasil diperbarui!');
        } else {
            alert('Masukkan kode baru terlebih dahulu.');
        }
    });
    
    document.getElementById('save-admin-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-admin-code').value.trim();
        if (newCode) {
            document.getElementById('current-admin-code').value = newCode;
            document.getElementById('new-admin-code').value = '';
            alert('Kode admin berhasil diperbarui!');
        } else {
            alert('Masukkan kode baru terlebih dahulu.');
        }
    });
    
    // Timer setting
    document.getElementById('save-timer').addEventListener('click', function() {
        const minutes = parseInt(document.getElementById('exam-timer').value);
        if (minutes >= 5) {
            alert(`Timer ujian berhasil diatur menjadi ${minutes} menit.`);
            // In a real app, you would save this to a database
        } else {
            alert('Waktu ujian minimal 5 menit.');
        }
    });
    
    // Chairman name setting
    document.getElementById('save-chairman').addEventListener('click', function() {
        const name = document.getElementById('chairman-name-input').value.trim();
        if (name) {
            alert(`Nama ketua berhasil diperbarui menjadi: ${name}`);
            // In a real app, you would save this to a database
        } else {
            alert('Masukkan nama ketua terlebih dahulu.');
        }
    });
    
    // Welcome message setting
    document.getElementById('save-welcome').addEventListener('click', function() {
        const message = document.getElementById('welcome-message').value.trim();
        if (message) {
            alert('Pesan pembuka berhasil diperbarui.');
            // In a real app, you would save this to a database
        } else {
            alert('Masukkan pesan pembuka terlebih dahulu.');
        }
    });
    
    // Periodic info setting
    document.getElementById('save-periodic').addEventListener('click', function() {
        const info = document.getElementById('periodic-info-input').value.trim();
        if (info) {
            document.getElementById('periodic-info').innerHTML = info;
            alert('Informasi berkala berhasil diperbarui.');
            // In a real app, you would save this to a database
        } else {
            alert('Masukkan informasi berkala terlebih dahulu.');
        }
    });
    
    // Motivation messages setting
    document.getElementById('save-motivation').addEventListener('click', function() {
        const messages = document.getElementById('motivation-messages').value.trim();
        if (messages) {
            alert('Pesan motivasi berhasil diperbarui.');
            // In a real app, you would save this to a database
        } else {
            alert('Masukkan pesan motivasi terlebih dahulu.');
        }
    });
    
    // Question count setting
    document.getElementById('save-question-count').addEventListener('click', function() {
        const count = parseInt(document.getElementById('question-count').value);
        if (count % 5 === 0 || count % 10 === 0) {
            alert(`Jumlah soal berhasil diatur menjadi ${count}.`);
            // In a real app, you would save this to a database
        } else {
            alert('Jumlah soal harus kelipatan 5 atau 10.');
        }
    });
    
    // Randomize questions setting
    document.getElementById('save-randomize').addEventListener('click', function() {
        const isRandomized = document.getElementById('randomize-questions').checked;
        alert(`Pengacakan soal ${isRandomized ? 'diaktifkan' : 'dinonaktifkan'}.`);
        // In a real app, you would save this to a database
    });
});
