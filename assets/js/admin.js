// Admin Panel Functionality for PERGUNU SMART

// DOM Elements
const saveLoginCodeBtn = document.getElementById('saveLoginCode');
const saveCpnsCodeBtn = document.getElementById('saveCpnsCode');
const saveBankCodeBtn = document.getElementById('saveBankCode');
const saveAdminCodeBtn = document.getElementById('saveAdminCode');
const saveSettingsBtn = document.getElementById('saveSettings');
const generateQuestionBtn = document.getElementById('generateQuestionBtn');
const saveQuestionBtn = document.getElementById('saveQuestionBtn');
const resetQuestionBtn = document.getElementById('resetQuestionBtn');
const searchBtn = document.getElementById('searchBtn');

// Current codes and settings (in a real app, these would be saved to a database)
let currentCodes = {
    login: '12345',
    cpns: 'CPNSP3K-OPENLOCK',
    bank: 'BANKSOAL-OPENLOCK',
    admin: '65614222'
};

let currentSettings = {
    examTimer: 90,
    chairmanName: "Moh. Nuril Hudha, S.Pd., M.Si.",
    welcomeMessage: "Selamat datang di Sistem Ujian Online PERGUNU Situbondo",
    infoMessage: "Waktu ujian adalah 90 menit. Pastikan koneksi internet stabil selama ujian berlangsung.",
    enabledExams: {
        sd: true,
        smp: true,
        sma: true,
        logika: true,
        cpns: true
    },
    motivationalMessages: [
        { min: 0, max: 40, message: "Masih ada ruang untuk perbaikan. Teruslah belajar dan berlatih!" },
        { min: 41, max: 60, message: "Hasil yang cukup baik. Tingkatkan lagi pemahaman Anda!" },
        { min: 61, max: 75, message: "Kerja bagus! Anda telah menunjukkan pemahaman yang baik." },
        { min: 76, max: 85, message: "Prestasi yang sangat baik! Pertahankan semangat belajar Anda." },
        { min: 86, max: 95, message: "Luar biasa! Anda benar-benar menguasai materi ini." },
        { min: 96, max: 100, message: "Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini." }
    ]
};

// Initialize admin panel
function initAdminPanel() {
    // Load current settings into form
    document.getElementById('examTimerSetting').value = currentSettings.examTimer;
    document.getElementById('chairmanName').value = currentSettings.chairmanName;
    document.getElementById('welcomeMessage').value = currentSettings.welcomeMessage;
    document.getElementById('infoMessage').value = currentSettings.infoMessage;
    
    // Set checkbox states
    document.getElementById('enableSD').checked = currentSettings.enabledExams.sd;
    document.getElementById('enableSMP').checked = currentSettings.enabledExams.smp;
    document.getElementById('enableSMA').checked = currentSettings.enabledExams.sma;
    document.getElementById('enableLogika').checked = currentSettings.enabledExams.logika;
    document.getElementById('enableCPNS').checked = currentSettings.enabledExams.cpns;
    
    // Load current codes
    document.getElementById('currentLoginCode').value = currentCodes.login;
    document.getElementById('currentCpnsCode').value = currentCodes.cpns;
    document.getElementById('currentBankCode').value = currentCodes.bank;
    document.getElementById('currentAdminCode').value = currentCodes.admin;
    
    // Set up event listeners
    setupAdminEventListeners();
    
    // Load questions for editing
    loadQuestionsForEditing();
}

// Set up admin event listeners
function setupAdminEventListeners() {
    // Save code buttons
    saveLoginCodeBtn.addEventListener('click', () => {
        const newCode = document.getElementById('newLoginCode').value;
        const currentCode = document.getElementById('currentLoginCode').value;
        
        if (currentCode === currentCodes.login) {
            currentCodes.login = newCode;
            alert('Kode Login berhasil diperbarui!');
            document.getElementById('currentLoginCode').value = newCode;
            document.getElementById('newLoginCode').value = '';
        } else {
            alert('Kode Login lama tidak sesuai!');
        }
    });
    
    saveCpnsCodeBtn.addEventListener('click', () => {
        const newCode = document.getElementById('newCpnsCode').value;
        const currentCode = document.getElementById('currentCpnsCode').value;
        
        if (currentCode === currentCodes.cpns) {
            currentCodes.cpns = newCode;
            alert('Kode CPNS/P3K berhasil diperbarui!');
            document.getElementById('currentCpnsCode').value = newCode;
            document.getElementById('newCpnsCode').value = '';
        } else {
            alert('Kode CPNS/P3K lama tidak sesuai!');
        }
    });
    
    saveBankCodeBtn.addEventListener('click', () => {
        const newCode = document.getElementById('newBankCode').value;
        const currentCode = document.getElementById('currentBankCode').value;
        
        if (currentCode === currentCodes.bank) {
            currentCodes.bank = newCode;
            alert('Kode Bank Soal berhasil diperbarui!');
            document.getElementById('currentBankCode').value = newCode;
            document.getElementById('newBankCode').value = '';
        } else {
            alert('Kode Bank Soal lama tidak sesuai!');
        }
    });
    
    saveAdminCodeBtn.addEventListener('click', () => {
        const newCode = document.getElementById('newAdminCode').value;
        const currentCode = document.getElementById('currentAdminCode').value;
        
        if (currentCode === currentCodes.admin) {
            currentCodes.admin = newCode;
            alert('Kode Admin berhasil diperbarui!');
            document.getElementById('currentAdminCode').value = newCode;
            document.getElementById('newAdminCode').value = '';
        } else {
            alert('Kode Admin lama tidak sesuai!');
        }
    });
    
    // Save settings
    saveSettingsBtn.addEventListener('click', () => {
        currentSettings.examTimer = parseInt(document.getElementById('examTimerSetting').value) || 90;
        currentSettings.chairmanName = document.getElementById('chairmanName').value;
        currentSettings.welcomeMessage = document.getElementById('welcomeMessage').value;
        currentSettings.infoMessage = document.getElementById('infoMessage').value;
        
        currentSettings.enabledExams = {
            sd: document.getElementById('enableSD').checked,
            smp: document.getElementById('enableSMP').checked,
            sma: document.getElementById('enableSMA').checked,
            logika: document.getElementById('enableLogika').checked,
            cpns: document.getElementById('enableCPNS').checked
        };
        
        alert('Pengaturan berhasil disimpan!');
    });
    
    // Question bank functionality
    generateQuestionBtn.addEventListener('click', generateQuestionWithAI);
    saveQuestionBtn.addEventListener('click', saveQuestion);
    resetQuestionBtn.addEventListener('click', resetQuestionForm);
    searchBtn.addEventListener('click', searchQuestions);
}

// Load questions for editing
function loadQuestionsForEditing() {
    // In a real app, this would be an API call to get questions
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';
    
    // Mock data - in a real app, this would come from a database
    const mockQuestions = [
        {
            id: 1,
            category: 'agama',
            level: 'sd',
            text: 'Siapakah nabi pertama dalam Islam?',
            options: ['Adam', 'Nuh', 'Ibrahim', 'Musa', 'Muhammad'],
            correctAnswer: 'A',
            explanation: 'Nabi Adam adalah manusia pertama sekaligus nabi pertama dalam Islam.'
        },
        {
            id: 2,
            category: 'ppkn',
            level: 'smp',
            text: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea ke...',
            options: ['1', '2', '3', '4', 'Tidak ada yang benar'],
            correctAnswer: 'D',
            explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea ke-4 Pembukaan UUD 1945.'
        }
    ];
    
    mockQuestions.forEach(question => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.dataset.id = question.id;
        
        questionItem.innerHTML = `
            <h4>${question.text}</h4>
            <p><strong>Kategori:</strong> ${question.category.toUpperCase()} | 
            <strong>Tingkat:</strong> ${question.level.toUpperCase()} | 
            <strong>Jawaban benar:</strong> ${question.correctAnswer}</p>
            <div class="question-actions">
                <button class="btn-primary edit-question" data-id="${question.id}">Edit</button>
                <button class="btn-danger delete-question" data-id="${question.id}">Hapus</button>
                <button class="btn-secondary preview-question" data-id="${question.id}">Preview</button>
            </div>
        `;
        
        questionsList.appendChild(questionItem);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.edit-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.target.dataset.id;
            editQuestion(questionId);
        });
    });
    
    document.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.target.dataset.id;
            deleteQuestion(questionId);
        });
    });
    
    document.querySelectorAll('.preview-question').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const questionId = e.target.dataset.id;
            previewQuestion(questionId);
        });
    });
}

// Generate question with AI (mock implementation)
function generateQuestionWithAI() {
    const prompt = document.getElementById('aiPrompt').value;
    const category = document.getElementById('questionCategory').value;
    const level = document.getElementById('questionLevel').value;
    
    if (!prompt) {
        alert('Masukkan prompt untuk menghasilkan soal!');
        return;
    }
    
    // Show loading state
    generateQuestionBtn.disabled = true;
    generateQuestionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    // In a real app, this would call an AI API
    // Here we use a mock implementation with setTimeout
    setTimeout(() => {
        // Mock generated question based on category
        let generatedQuestion = {
            text: '',
            options: [],
            correctAnswer: 'A',
            explanation: ''
        };
        
        switch(category) {
            case 'agama':
                generatedQuestion.text = `Dalam ${level === 'easy' ? 'dasar' : level === 'medium' ? 'menengah' : 'lanjutan'} pengetahuan agama, ${prompt}`;
                generatedQuestion.options = ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'];
                generatedQuestion.explanation = 'Penjelasan untuk jawaban yang benar';
                break;
            case 'ppkn':
                generatedQuestion.text = `Dalam materi PPKn tingkat ${level}, ${prompt}`;
                generatedQuestion.options = ['Pilihan 1', 'Pilihan 2', 'Pilihan 3', 'Pilihan 4', 'Pilihan 5'];
                generatedQuestion.explanation = 'Penjelasan berdasarkan peraturan yang berlaku';
                break;
            // Add more cases for other categories
            default:
                generatedQuestion.text = `Pertanyaan tentang ${category}: ${prompt}`;
                generatedQuestion.options = ['Jawaban A', 'Jawaban B', 'Jawaban C', 'Jawaban D', 'Jawaban E'];
                generatedQuestion.explanation = 'Penjelasan jawaban yang benar';
        }
        
        // Fill the form with generated question
        document.getElementById('questionTextArea').value = generatedQuestion.text;
        document.getElementById('optionA').value = generatedQuestion.options[0];
        document.getElementById('optionB').value = generatedQuestion.options[1];
        document.getElementById('optionC').value = generatedQuestion.options[2];
        document.getElementById('optionD').value = generatedQuestion.options[3];
        document.getElementById('optionE').value = generatedQuestion.options[4];
        document.getElementById('correctOption').value = generatedQuestion.correctAnswer;
        document.getElementById('explanation').value = generatedQuestion.explanation;
        
        // Reset button state
        generateQuestionBtn.disabled = false;
        generateQuestionBtn.innerHTML = 'Generate Soal';
        
        alert('Soal berhasil digenerate! Silakan review sebelum menyimpan.');
    }, 2000);
}

// Save question to database
function saveQuestion() {
    const category = document.getElementById('questionCategory').value;
    const level = document.getElementById('questionLevel').value;
    const text = document.getElementById('questionTextArea').value;
    const options = [
        document.getElementById('optionA').value,
        document.getElementById('optionB').value,
        document.getElementById('optionC').value,
        document.getElementById('optionD').value,
        document.getElementById('optionE').value
    ];
    const correctAnswer = document.getElementById('correctOption').value;
    const explanation = document.getElementById('explanation').value;
    
    // Validate inputs
    if (!text || options.some(opt => !opt) || !explanation) {
        alert('Harap isi semua field!');
        return;
    }
    
    // In a real app, this would be an API call to save the question
    console.log('Question saved:', {
        category,
        level,
        text,
        options,
        correctAnswer,
        explanation
    });
    
    alert('Soal berhasil disimpan!');
    resetQuestionForm();
    loadQuestionsForEditing();
}

// Reset question form
function resetQuestionForm() {
    document.getElementById('questionTextArea').value = '';
    document.getElementById('optionA').value = '';
    document.getElementById('optionB').value = '';
    document.getElementById('optionC').value = '';
    document.getElementById('optionD').value = '';
    document.getElementById('optionE').value = '';
    document.getElementById('correctOption').value = 'A';
    document.getElementById('explanation').value = '';
    document.getElementById('aiPrompt').value = '';
}

// Search questions
function searchQuestions() {
    const searchTerm = document.getElementById('searchQuestion').value.toLowerCase();
    const filterCategory = document.getElementById('filterCategory').value;
    
    // In a real app, this would be an API call with filters
    const questionItems = document.querySelectorAll('.question-item');
    
    questionItems.forEach(item => {
        const questionText = item.querySelector('h4').textContent.toLowerCase();
        const questionCategory = item.querySelector('p').textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || questionText.includes(searchTerm);
        const matchesCategory = filterCategory === '' || questionCategory.includes(filterCategory.toLowerCase());
        
        if (matchesSearch && matchesCategory) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Edit question
function editQuestion(questionId) {
    // In a real app, this would fetch the question from database
    // Here we use mock data
    const mockQuestions = [
        {
            id: 1,
            category: 'agama',
            level: 'sd',
            text: 'Siapakah nabi pertama dalam Islam?',
            options: ['Adam', 'Nuh', 'Ibrahim', 'Musa', 'Muhammad'],
            correctAnswer: 'A',
            explanation: 'Nabi Adam adalah manusia pertama sekaligus nabi pertama dalam Islam.'
        },
        {
            id: 2,
            category: 'ppkn',
            level: 'smp',
            text: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea ke...',
            options: ['1', '2', '3', '4', 'Tidak ada yang benar'],
            correctAnswer: 'D',
            explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea ke-4 Pembukaan UUD 1945.'
        }
    ];
    
    const question = mockQuestions.find(q => q.id == questionId);
    
    if (question) {
        // Switch to add question tab
        document.querySelector('.bank-tab.active').classList.remove('active');
        document.querySelector('.bank-tab-content.active').classList.remove('active');
        
        document.querySelector('.bank-tab[data-tab="addQuestion"]').classList.add('active');
        document.getElementById('addQuestionTab').classList.add('active');
        
        // Fill the form
        document.getElementById('questionCategory').value = question.category;
        document.getElementById('questionLevel').value = question.level;
        document.getElementById('questionTextArea').value = question.text;
        document.getElementById('optionA').value = question.options[0];
        document.getElementById('optionB').value = question.options[1];
        document.getElementById('optionC').value = question.options[2];
        document.getElementById('optionD').value = question.options[3];
        document.getElementById('optionE').value = question.options[4];
        document.getElementById('correctOption').value = question.correctAnswer;
        document.getElementById('explanation').value = question.explanation;
        
        // Scroll to form
        document.getElementById('questionTextArea').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete question
function deleteQuestion(questionId) {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
        // In a real app, this would be an API call to delete the question
        console.log('Question deleted:', questionId);
        alert('Soal berhasil dihapus!');
        loadQuestionsForEditing();
    }
}

// Preview question
function previewQuestion(questionId) {
    // In a real app, this would fetch the question from database
    // Here we use mock data
    const mockQuestions = [
        {
            id: 1,
            category: 'agama',
            level: 'sd',
            text: 'Siapakah nabi pertama dalam Islam?',
            options: ['Adam', 'Nuh', 'Ibrahim', 'Musa', 'Muhammad'],
            correctAnswer: 'A',
            explanation: 'Nabi Adam adalah manusia pertama sekaligus nabi pertama dalam Islam.'
        },
        {
            id: 2,
            category: 'ppkn',
            level: 'smp',
            text: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea ke...',
            options: ['1', '2', '3', '4', 'Tidak ada yang benar'],
            correctAnswer: 'D',
            explanation: 'Pancasila sebagai dasar negara tercantum dalam alinea ke-4 Pembukaan UUD 1945.'
        }
    ];
    
    const question = mockQuestions.find(q => q.id == questionId);
    
    if (question) {
        const previewContainer = document.getElementById('questionPreview');
        
        previewContainer.innerHTML = `
            <h3>Preview Soal</h3>
            <div class="preview-question">
                <p><strong>Kategori:</strong> ${question.category.toUpperCase()} | 
                <strong>Tingkat:</strong> ${question.level.toUpperCase()}</p>
                <p class="question-text">${question.text}</p>
                <div class="preview-options">
                    <p><strong>A.</strong> ${question.options[0]}</p>
                    <p><strong>B.</strong> ${question.options[1]}</p>
                    <p><strong>C.</strong> ${question.options[2]}</p>
                    <p><strong>D.</strong> ${question.options[3]}</p>
                    <p><strong>E.</strong> ${question.options[4]}</p>
                </div>
                <p class="preview-answer"><strong>Jawaban benar:</strong> ${question.correctAnswer}</p>
                <p class="preview-explanation"><strong>Penjelasan:</strong> ${question.explanation}</p>
            </div>
        `;
        
        // Switch to preview tab
        document.querySelector('.bank-tab.active').classList.remove('active');
        document.querySelector('.bank-tab-content.active').classList.remove('active');
        
        document.querySelector('.bank-tab[data-tab="previewQuestion"]').classList.add('active');
        document.getElementById('previewQuestionTab').classList.add('active');
        
        // Scroll to preview
        previewContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminPanel);
