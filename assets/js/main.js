// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
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
    }

    // Handle floating buttons
    const floatingButtons = document.querySelectorAll('.floating-btn');
    floatingButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonSound = document.getElementById('buttonSound');
            if (buttonSound) {
                buttonSound.play();
            }

            // Handle different floating buttons
            if (this.classList.contains('whatsapp-btn')) {
                window.open('https://wa.me/6285647709114?text=Assalamualaikum%20mas%20admin,%20saya%20mau%20tanya%20sesuatu%20nih...', '_blank');
            } else if (this.classList.contains('share-btn')) {
                navigator.share({
                    title: 'Ujian Online PERGUNU',
                    text: 'Ikuti ujian online dari PERGUNU Situbondo',
                    url: 'http://is.gd/ujianonline'
                }).catch(() => {
                    // Fallback for browsers that don't support Web Share API
                    prompt('Salin link berikut untuk membagikan:', 'http://is.gd/ujianonline');
                });
            } else if (this.classList.contains('bank-soal-btn')) {
                const code = prompt('Masukkan Kode Bank Soal:');
                if (code === 'OPENLOCK-1926') {
                    alert('Anda akan diarahkan ke Bank Soal');
                    // In a real app, this would redirect to the question bank
                } else {
                    alert('Kode Bank Soal salah');
                }
            } else if (this.classList.contains('admin-btn')) {
                const code = prompt('Masukkan Kode Kontrol Panel Admin:');
                if (code === '65614222') {
                    window.location.href = 'admin/index.html';
                } else {
                    alert('Kode Admin salah');
                }
            }
        });
    });
});

// Helper function to format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}
