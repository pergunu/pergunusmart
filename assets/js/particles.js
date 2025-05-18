<!-- Di bagian head -->
<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>

<!-- Atau jika menggunakan file lokal -->
<script src="assets/js/particles.min.js"></script>

// Perbaikan konfigurasi particles.js
document.addEventListener('DOMContentLoaded', function() {
    // Periksa apakah elemen particles-js ada sebelum diinisialisasi
    if (document.getElementById('particles-js')) {
        // Pastikan particlesJS terdefinisi
        if (typeof particlesJS !== 'undefined') {
            try {
                particlesJS('particles-js', {
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#ffffff"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            }
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": false
                        },
                        "size": {
                            "value": 3,
                            "random": true
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#ffffff",
                            "opacity": 0.4,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 2,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out"
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "grab"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        }
                    },
                    "retina_detect": true
                });
                
                // Tambahkan indikator sukses
                console.log('Particles.js berhasil diinisialisasi ✔️');
            } catch (error) {
                console.error('Error inisialisasi particles.js:', error);
                showParticlesFallback();
            }
        } else {
            console.warn('Particles.js tidak terdefinisi, menggunakan fallback');
            showParticlesFallback();
        }
    }
});

// Fallback jika particles.js gagal
function showParticlesFallback() {
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.style.background = 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)';
    }
}
