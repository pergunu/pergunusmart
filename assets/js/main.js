// Fungsi untuk memainkan audio
function playAudio(type) {
    let audioFile;
    switch(type) {
        case 'button':
            audioFile = 'assets/audio/audiotombol.mp3';
            break;
        case 'correct':
            audioFile = 'assets/audio/jawabanbenar.mp3';
            break;
        case 'wrong':
            audioFile = 'assets/audio/jawbansalah.mp3';
            break;
        case 'applause':
            audioFile = 'assets/audio/applause.mp3';
            break;
        default:
            return;
    }
    
    const audio = new Audio(audioFile);
    audio.play().catch(e => console.log('Autoplay prevented:', e));
}

// Event listener untuk semua tombol
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            playAudio('button');
        });
    });
    
    // Login functionality
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const loginCode = document.getElementById('loginCode').value;
            if (loginCode === '12345') {
                window.location.href = 'terms.html';
            } else {
                alert('Kode login salah!');
            }
        });
    }
});

// Fungsi untuk membuka modal
function openModal(modalId) {
    document.getElementById('modalOverlay').style.display = 'block';
    document.getElementById(modalId).style.display = 'block';
}

// Fungsi untuk menutup modal
function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Inisialisasi modals
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
});
