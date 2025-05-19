// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Code Management
    const saveCodeButtons = document.querySelectorAll('.code-management button');
    
    saveCodeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.code-section');
            const newCodeInput = section.querySelector('input:not([disabled])');
            const currentCodeInput = section.querySelector('input[disabled]');
            
            if (newCodeInput.value.trim() === '') {
                alert('Kode baru tidak boleh kosong!');
                return;
            }
            
            if (confirm('Apakah Anda yakin ingin mengubah kode ini?')) {
                currentCodeInput.value = newCodeInput.value;
                newCodeInput.value = '';
                alert('Kode berhasil diperbarui!');
                
                // Save to localStorage
                const codeType = section.querySelector('h3').textContent.toLowerCase();
                localStorage.setItem(`admin_${codeType.replace(/\s+/g, '-')}`, currentCodeInput.value);
            }
        });
    });
    
    // Load saved codes
    function loadSavedCodes() {
        const codeTypes = ['kode login', 'kode ujian cpns/p3k', 'kode bank soal', 'kode kontrol panel admin'];
        
        codeTypes.forEach(type => {
            const key = `admin_${type.replace(/\s+/g, '-')}`;
            const savedCode = localStorage.getItem(key);
            if (savedCode) {
                const section = document.querySelector(`h3:contains('${type}')`).closest('.code-section');
                if (section) {
                    section.querySelector('input[disabled]').value = savedCode;
                }
            }
        });
    }
    
    // Export Data
    const exportButtons = document.querySelectorAll('.export-buttons button');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.textContent.split(' ')[1].toLowerCase();
            alert(`Fitur export ke ${format} akan diimplementasikan sesuai kebutuhan`);
            // Actual implementation would generate and download the file
        });
    });
    
    // Exam Settings
    const saveSettingsBtn = document.querySelector('#exam-settings button');
    
    saveSettingsBtn.addEventListener('click', function() {
        const timer = document.getElementById('exam-timer').value;
        const points = document.getElementById('exam-points').value;
        const questions = document.getElementById('exam-questions').value;
        const randomize = document.getElementById('random-questions').checked;
        
        localStorage.setItem('exam_settings', JSON.stringify({
            timer,
            points,
            questions,
            randomize
        }));
        
        alert('Pengaturan ujian berhasil disimpan!');
    });
    
    // Certificate Settings
    const saveCertSettingsBtn = document.querySelector('#certificate-settings button');
    
    saveCertSettingsBtn.addEventListener('click', function() {
        const chairman = document.getElementById('chairman-name').value;
        const greeting = document.getElementById('greeting-text').value;
        const motivation = document.getElementById('motivation-text').value;
        const info = document.getElementById('periodic-info').value;
        
        localStorage.setItem('cert_settings', JSON.stringify({
            chairman,
            greeting,
            motivation,
            info
        }));
        
        alert('Pengaturan sertifikat berhasil disimpan!');
    });
    
    // Initialize
    loadSavedCodes();
    
    // Load exam settings if exists
    const savedExamSettings = localStorage.getItem('exam_settings');
    if (savedExamSettings) {
        const settings = JSON.parse(savedExamSettings);
        document.getElementById('exam-timer').value = settings.timer;
        document.getElementById('exam-points').value = settings.points;
        document.getElementById('exam-questions').value = settings.questions;
        document.getElementById('random-questions').checked = settings.randomize;
    }
    
    // Load certificate settings if exists
    const savedCertSettings = localStorage.getItem('cert_settings');
    if (savedCertSettings) {
        const settings = JSON.parse(savedCertSettings);
        document.getElementById('chairman-name').value = settings.chairman;
        document.getElementById('greeting-text').value = settings.greeting;
        document.getElementById('motivation-text').value = settings.motivation;
        document.getElementById('periodic-info').value = settings.info;
    }
});
