// Certificate Generation and Handling
document.addEventListener('DOMContentLoaded', function() {
    // Generate certificate code
    function generateCertificateCode(results) {
        const participant = results.participant;
        const exam = results.exam;
        const date = new Date(results.timestamp);
        
        // Format name part (first 3 letters of first name + first 3 letters of last name)
        const nameParts = participant.fullname.split(' ');
        const namePart = (nameParts[0].substring(0, 3) + 
                         (nameParts.length > 1 ? nameParts[1].substring(0, 3) : '')).toUpperCase();
        
        // Format status part
        const statusPart = participant.status === 'pelajar' ? 'PELAJAR' : 'UMUM';
        
        // Format level part
        const levelPart = participant.status === 'pelajar' ? participant.level : exam.subject.toUpperCase();
        
        // Format date part
        const datePart = date.getDate().toString().padStart(2, '0') + 
                        (date.getMonth() + 1).toString().padStart(2, '0') + 
                        date.getFullYear().toString().substring(2);
        
        // Generate random part
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                          Math.random().toString(36).substring(2, 6).toUpperCase();
        
        return `${namePart}/${statusPart}/${levelPart}/${datePart}/${randomPart}/PERGUNU-STB`;
    }
    
    // Display certificate
    function displayCertificate() {
        const results = JSON.parse(localStorage.getItem('examResults'));
        const participant = results.participant;
        
        // Set certificate content
        document.getElementById('certificate-name').textContent = participant.fullname.toUpperCase();
        document.getElementById('certificate-score').textContent = `NILAI: ${results.score}`;
        
        // Set certificate code if not already set
        if (!results.certificateCode) {
            results.certificateCode = generateCertificateCode(results);
            localStorage.setItem('examResults', JSON.stringify(results));
        }
        document.getElementById('certificate-code').textContent = results.certificateCode;
        
        // Set date
        const date = new Date(results.timestamp);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('certificate-date').textContent = date.toLocaleDateString('id-ID', options);
        
        // Set motivational message based on score
        let motivationText = '';
        if (results.score >= 90) {
            motivationText = 'Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.';
        } else if (results.score >= 70) {
            motivationText = 'Bagus! Anda telah menunjukkan pemahaman yang baik. Tingkatkan lagi untuk hasil yang lebih baik.';
        } else if (results.score >= 50) {
            motivationText = 'Cukup baik. Anda memiliki dasar pemahaman, tetapi perlu belajar lebih giat lagi.';
        } else {
            motivationText = 'Jangan menyerah! Gunakan hasil ini sebagai motivasi untuk belajar lebih giat lagi.';
        }
        document.getElementById('certificate-motivation').textContent = motivationText;
        
        // Play applause sound
        const audio = new Audio('../assets/audio/applause.mp3');
        audio.play();
    }
    
    // Print certificate
    document.getElementById('print-certificate').addEventListener('click', function() {
        window.print();
    });
    
    // Initialize
    displayCertificate();
});
