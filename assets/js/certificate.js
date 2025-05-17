// Implementasi logika sertifikat akan ditempatkan di sini
document.addEventListener('DOMContentLoaded', function() {
    // Fungsi untuk menghasilkan kode sertifikat
    function generateCertificateCode(name, category, level, examType) {
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getFullYear()}`;
        
        // Generate kode unik 8 karakter
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let uniqueCode = '';
        for (let i = 0; i < 8; i++) {
            if (i > 0 && i % 4 === 0) {
                uniqueCode += '-';
            }
            uniqueCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Format: NAMA/KATEGORI/LEVEL/JENISUJIAN/TANGGAL/KODEUNIK/PERGUNU-STB
        return `${name.toUpperCase()}/${category.toUpperCase()}/${level.toUpperCase()}/${examType.toUpperCase()}/${dateStr}/${uniqueCode}/PERGUNU-STB`;
    }
    
    // Fungsi untuk menghasilkan pesan motivasi berdasarkan skor
    function getMotivationMessage(score) {
        if (score >= 80) {
            return "SEMPURNA! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini!";
        } else if (score >= 60) {
            return "BAIK SEKALI! Anda memiliki pemahaman yang solid tentang materi ini.";
        } else if (score >= 40) {
            return "CUKUP BAIK. Tingkatkan lagi belajarnya!";
        } else {
            return "TERUS BERLATIH! Setiap kesalahan adalah kesempatan untuk belajar lebih baik lagi.";
        }
    }
    
    // Fungsi untuk menampilkan sertifikat
    function showCertificate(participantData, score) {
        const certificateCode = generateCertificateCode(
            participantData.fullName,
            participantData.status,
            participantData.level,
            participantData.exam
        );
        
        const motivationMessage = getMotivationMessage(score);
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = now.toLocaleDateString('id-ID', options);
        
        // Update elemen sertifikat
        document.getElementById('certificateCode').textContent = certificateCode;
        document.getElementById('participantName').textContent = participantData.fullName;
        document.getElementById('scoreValue').textContent = `${score}%`;
        document.getElementById('motivationMessage').textContent = motivationMessage;
        document.getElementById('certificateDate').textContent = `Ditetapkan di: Situbondo, ${dateStr}`;
        
        // Mainkan suara applause
        const applauseSound = new Audio('assets/audio/applause.mp3');
        applauseSound.play().catch(e => console.log('Autoplay prevented:', e));
    }
    
    // Ekspor fungsi yang diperlukan
    window.generateCertificateCode = generateCertificateCode;
    window.getMotivationMessage = getMotivationMessage;
    window.showCertificate = showCertificate;
});
