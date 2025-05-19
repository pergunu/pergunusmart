// Admin Panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Save code buttons
    document.getElementById('saveLoginCodeBtn').addEventListener('click', function() {
        alert("Kode login berhasil disimpan!");
    });
    
    document.getElementById('saveExamCodeBtn').addEventListener('click', function() {
        alert("Kode ujian CPNS berhasil disimpan!");
    });
    
    document.getElementById('saveQuestionCodeBtn').addEventListener('click', function() {
        alert("Kode bank soal berhasil disimpan!");
    });
    
    document.getElementById('saveAdminCodeBtn').addEventListener('click', function() {
        alert("Kode admin berhasil disimpan!");
    });
    
    // Save settings buttons
    document.getElementById('saveTimerBtn').addEventListener('click', function() {
        alert("Timer ujian berhasil disimpan!");
    });
    
    document.getElementById('saveChairmanBtn').addEventListener('click', function() {
        alert("Nama ketua berhasil disimpan!");
    });
    
    document.getElementById('savePointsBtn').addEventListener('click', function() {
        alert("Poin per soal berhasil disimpan!");
    });
    
    document.getElementById('saveQuestionCountBtn').addEventListener('click', function() {
        alert("Jumlah soal berhasil disimpan!");
    });
    
    document.getElementById('saveRandomizeBtn').addEventListener('click', function() {
        alert("Pengaturan acak soal berhasil disimpan!");
    });
    
    document.getElementById('saveWelcomeBtn').addEventListener('click', function() {
        alert("Teks sapa pembuka berhasil disimpan!");
    });
    
    document.getElementById('saveInfoBtn').addEventListener('click', function() {
        alert("Informasi berkala berhasil disimpan!");
    });
    
    document.getElementById('saveMotivationBtn').addEventListener('click', function() {
        alert("Pesan motivasi berhasil disimpan!");
    });
    
    document.getElementById('saveLinksBtn').addEventListener('click', function() {
        alert("Link website berhasil disimpan!");
    });
    
    document.getElementById('saveMusicBtn').addEventListener('click', function() {
        alert("Link musik berhasil disimpan!");
    });
    
    // Toggle exam buttons
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const exam = this.dataset.exam;
            const isActive = this.classList.contains('active');
            alert(`Ujian ${exam} ${isActive ? 'diaktifkan' : 'dinonaktifkan'}!`);
        });
    });
});
