// Database simulation using localStorage
function initDatabase() {
    if (!localStorage.getItem('questions')) {
        const sampleQuestions = [
            {
                id: '1',
                category: 'pelajar',
                subject: 'agama',
                question: 'Siapakah nabi pertama dalam Islam?',
                options: {
                    a: 'Adam',
                    b: 'Ibrahim',
                    c: 'Musa',
                    d: 'Muhammad',
                    e: 'Isa'
                },
                correctAnswer: 'a',
                explanation: 'Nabi Adam adalah manusia pertama sekaligus nabi pertama dalam Islam.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                category: 'pelajar',
                subject: 'ppkn',
                question: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea keberapa?',
                options: {
                    a: 'Pertama',
                    b: 'Kedua',
                    c: 'Ketiga',
                    d: 'Keempat',
                    e: 'Kelima'
                },
                correctAnswer: 'd',
                explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea keempat Pembukaan UUD 1945.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                category: 'umum',
                subject: 'tes-iq',
                question: 'Jika 2 + 2 = 4, dan 3 + 3 = 6, maka 4 + 4 = ?',
                options: {
                    a: '6',
                    b: '7',
                    c: '8',
                    d: '9',
                    e: '10'
                },
                correctAnswer: 'c',
                explanation: 'Pola penjumlahan menunjukkan bahwa a + a = 2a, sehingga 4 + 4 = 8.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '4',
                category: 'pelajar',
                subject: 'ipa',
                question: 'Planet terdekat dari matahari adalah?',
                options: {
                    a: 'Venus',
                    b: 'Bumi',
                    c: 'Mars',
                    d: 'Merkurius',
                    e: 'Jupiter'
                },
                correctAnswer: 'd',
                explanation: 'Merkurius adalah planet terdekat dari matahari dalam tata surya kita.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '5',
                category: 'pelajar',
                subject: 'ips',
                question: 'Ibu kota negara Indonesia adalah?',
                options: {
                    a: 'Jakarta',
                    b: 'Bandung',
                    c: 'Surabaya',
                    d: 'Medan',
                    e: 'Yogyakarta'
                },
                correctAnswer: 'a',
                explanation: 'Jakarta adalah ibu kota negara Indonesia sejak kemerdekaan.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '6',
                category: 'pelajar',
                subject: 'matematika',
                question: 'Hasil dari 7 × 8 adalah?',
                options: {
                    a: '48',
                    b: '54',
                    c: '56',
                    d: '64',
                    e: '72'
                },
                correctAnswer: 'c',
                explanation: 'Perkalian 7 dengan 8 menghasilkan 56.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '7',
                category: 'pelajar',
                subject: 'bahasa-indonesia',
                question: 'Sinonim dari kata "bahagia" adalah?',
                options: {
                    a: 'Sedih',
                    b: 'Senang',
                    c: 'Marah',
                    d: 'Kecewa',
                    e: 'Takut'
                },
                correctAnswer: 'b',
                explanation: 'Sinonim dari "bahagia" adalah "senang" yang memiliki arti yang mirip.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '8',
                category: 'pelajar',
                subject: 'bahasa-inggris',
                question: 'What is the English word for "buku"?',
                options: {
                    a: 'Pen',
                    b: 'Book',
                    c: 'Table',
                    d: 'Chair',
                    e: 'Door'
                },
                correctAnswer: 'b',
                explanation: 'The English word for "buku" is "book".',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '9',
                category: 'pelajar',
                subject: 'materi-extra',
                question: 'Warna yang dihasilkan dari campuran merah dan kuning adalah?',
                options: {
                    a: 'Hijau',
                    b: 'Biru',
                    c: 'Ungu',
                    d: 'Oranye',
                    e: 'Coklat'
                },
                correctAnswer: 'd',
                explanation: 'Campuran warna merah dan kuning menghasilkan oranye.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '10',
                category: 'pelajar',
                subject: 'materi-khusus',
                question: 'Lambang negara Indonesia adalah?',
                options: {
                    a: 'Garuda Pancasila',
                    b: 'Singa',
                    c: 'Elang',
                    d: 'Harimau',
                    e: 'Kerbau'
                },
                correctAnswer: 'a',
                explanation: 'Garuda Pancasila adalah lambang negara Indonesia.',
                point: 1,
                createdAt: new Date().toISOString()
            },
            {
                id: '11',
                category: 'umum',
                subject: 'ujian-cpns',
                question: 'Negara Indonesia menganut sistem pemerintahan?',
                options: {
                    a: 'Presidensial',
                    b: 'Parlamenter',
                    c: 'Monarki',
                    d: 'Federal',
                    e: 'Komunis'
                },
                correctAnswer: 'a',
                explanation: 'Indonesia menganut sistem pemerintahan presidensial.',
                point: 1,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('questions', JSON.stringify(sampleQuestions));
    }
    
    if (!localStorage.getItem('participants')) {
        localStorage.setItem('participants', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('examSettings')) {
        localStorage.setItem('examSettings', JSON.stringify({
            timer: 120,
            chairman: 'Moh. Nuril Hudha, S.Pd., M.Si.',
            greeting: 'Selamat Datang di Ujian Online PERGUNU Situbondo',
            info: 'Informasi penting akan ditampilkan di sini oleh admin',
            motivations: JSON.stringify({
                "90-100": "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.",
                "80-89": "Hasil yang sangat baik! Anda telah menunjukkan pemahaman yang mendalam tentang materi.",
                "70-79": "Kerja bagus! Anda memiliki pemahaman yang baik tentang materi ujian.",
                "60-69": "Hasil yang cukup baik. Ada beberapa area yang masih bisa ditingkatkan.",
                "50-59": "Anda telah menyelesaikan ujian. Pertimbangkan untuk mempelajari kembali materi yang kurang dikuasai.",
                "0-49": "Tetap semangat! Hasil ini adalah awal untuk belajar lebih giat lagi."
            }),
            points: 1,
            randomize: true,
            count: 10
        }));
    }
}

function saveParticipant(participant) {
    const participants = JSON.parse(localStorage.getItem('participants')) || [];
    participants.push(participant);
    localStorage.setItem('participants', JSON.stringify(participants));
}

function saveQuestion(question) {
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    questions.push(question);
    localStorage.setItem('questions', JSON.stringify(questions));
}

function getParticipants() {
    return JSON.parse(localStorage.getItem('participants')) || [];
}

function getQuestions() {
    return JSON.parse(localStorage.getItem('questions')) || [];
}

function saveExamSettings(settings) {
    localStorage.setItem('examSettings', JSON.stringify(settings));
}

function getExamSettings() {
    return JSON.parse(localStorage.getItem('examSettings'));
}

// Initialize database when script loads
initDatabase();
