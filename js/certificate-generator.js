// Certificate generation functionality
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
    applause.volume = 0.7;
    applause.play().catch(e => console.log("Audio play prevented:", e));
    
    // Print certificate
    document.getElementById('print-certificate').addEventListener('click', function() {
        window.print();
    });
    
    // Back to results
    document.getElementById('back-to-results').addEventListener('click', function() {
        document.getElementById('certificate-screen').classList.remove('active');
        document.getElementById('results-screen').classList.add('active');
    });
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
