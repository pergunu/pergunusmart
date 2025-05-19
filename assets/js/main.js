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

    // Login functionality
    const loginBtn = document.getElementById('login-btn');
    const loginCode = document.getElementById('login-code');
    
    loginBtn.addEventListener('click', function() {
        const code = loginCode.value.trim();
        if (code === '12345') {
            // Play button sound
            const audio = new Audio('assets/audio/audiotombol.mp3');
            audio.play();
            
            // Redirect to agreement page
            setTimeout(() => {
                window.location.href = 'agreement.html';
            }, 500);
        } else {
            alert('Kode login salah! Silakan coba lagi.');
            loginCode.focus();
        }
    });

    // Floating buttons functionality
    document.querySelector('.share-btn').addEventListener('click', function() {
        window.open('http://is.gd/ujianonline', '_blank');
    });

    document.querySelector('.whatsapp-btn').addEventListener('click', function() {
        window.open('https://wa.me/6285647709114?text=Assalamualaikum%20mas%20admin,%20saya%20mau%20tanya%20sesuatu%20nih...', '_blank');
    });

    document.querySelector('.admin-btn').addEventListener('click', function() {
        const adminCode = prompt('Masukkan Kode Admin:');
        if (adminCode === '65614222') {
            window.location.href = 'admin/panel.html';
        } else {
            alert('Kode admin salah!');
        }
    });

    // Auto focus on login code input
    loginCode.focus();
});
