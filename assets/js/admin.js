// Admin Panel Functionality for PERGUNU SMART - FINAL VERSION

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
const addMusicBtn = document.getElementById('addMusicBtn');
const saveMusicBtn = document.getElementById('saveMusicBtn');
const addWebsiteBtn = document.getElementById('addWebsiteBtn');
const saveWebsiteBtn = document.getElementById('saveWebsiteBtn');
const enableMusicCheckbox = document.getElementById('enableMusic');
const musicVolumeSlider = document.getElementById('musicVolume');

// Current codes and settings
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
    ],
    musicSettings: {
        enabled: true,
        volume: 0.7,
        playlist: [
            { name: "Sholawat", url: "assets/audio/sholawat.mp3" }
        ]
    },
    websiteLinks: [
        { name: "Website PERGUNU Pusat", url: "https://pergunu.or.id" },
        { name: "PERGUNU Situbondo", url: "https://situbondo.pergunu.or.id" },
        { name: "Tombol Smart", url: "https://is.gd/pTombol" }
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
    
    // Load music settings
    enableMusicCheckbox.checked = currentSettings.musicSettings.enabled;
    musicVolumeSlider.value = currentSettings.musicSettings.volume;
    loadMusicList();

    // Enhanced Admin Panel with Statistics
function initAdminPanel() {
    // Load current settings
    loadAdminSettings();
    
    // Setup event listeners
    setupAdminEventListeners();
    
    // Initialize components
    loadMusicList();
    loadWebsiteList();
    loadQuestionsForEditing();

    
    // Load current settings
    loadAdminSettings();
    
    // Setup event listeners
    setupAdminEventListeners();
    
    // Load statistics
    loadParticipantStatistics();
    
    // Initialize bank soal panel
    initBankSoalPanel();
    
 // Set default codes
    document.getElementById('currentLoginCode').value = currentCodes.login;
    document.getElementById('currentCpnsCode').value = currentCodes.cpns;
    document.getElementById('currentBankCode').value = currentCodes.bank;
    document.getElementById('currentAdminCode').value = currentCodes.admin;
}
    
function loadParticipantStatistics() {
    // In a real app, this would come from a database
    const stats = {
        totalParticipants: 0,
        byCategory: {
            sd: 0,
            smp: 0,
            sma: 0,
            logika: 0,
            cpns: 0
        },
        averageScores: {
            sd: 0,
            smp: 0,
            sma: 0,
            logika: 0,
            cpns: 0
        }
    };
    
    // Update UI with statistics
    document.getElementById('totalParticipants').textContent = stats.totalParticipants;
    // Update other stats elements...
}

function saveQuestionPointValues() {
    const pointValues = {
        sd: parseInt(document.getElementById('pointValueSD').value) || 1,
        smp: parseInt(document.getElementById('pointValueSMP').value) || 1,
        sma: parseInt(document.getElementById('pointValueSMA').value) || 1,
        logika: parseInt(document.getElementById('pointValueLogika').value) || 1,
        cpns: parseInt(document.getElementById('pointValueCPNS').value) || 1
    };
    
    // Save to settings
    currentSettings.questionPointValues = pointValues;
    alert('Nilai point soal berhasil disimpan!');
}
    
    // Load website links
    loadWebsiteList();
    
    // Set up event listeners
    setupAdminEventListeners();
    
    // Load questions for editing
    loadQuestionsForEditing();
}

// Bank Soal Panel Implementation
function initBankSoalPanel() {
    // Load questions for editing
    loadQuestionsForEditing();
    
    // Setup event listeners
    document.getElementById('generateQuestionBtn').addEventListener('click', generateQuestionWithAI);
    document.getElementById('saveQuestionBtn').addEventListener('click', saveQuestion);
    document.getElementById('searchBtn').addEventListener('click', searchQuestions);
    
    // Add question category change handler
    document.getElementById('questionCategory').addEventListener('change', function() {
        const levelSelect = document.getElementById('questionLevel');
        if (this.value === 'logika' || this.value === 'cpns') {
            levelSelect.disabled = true;
        } else {
            levelSelect.disabled = false;
        }
    });
}

// Load music list
function loadMusicList() {
    const musicList = document.getElementById('musicList');
    musicList.innerHTML = '';
    
    currentSettings.musicSettings.playlist.forEach((music, index) => {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.innerHTML = `
            <p>${index + 1}. ${music.name}</p>
            <div class="music-actions">
                <button class="btn-primary play-music" data-url="${music.url}"><i class="fas fa-play"></i></button>
                <button class="btn-danger delete-music" data-index="${index}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        musicList.appendChild(musicItem);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.play-music').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const audio = new Audio(e.target.dataset.url || e.target.parentElement.dataset.url);
            audio.volume = currentSettings.musicSettings.volume;
            audio.play().catch(e => console.log('Music play error:', e));
        });
    });
    
    document.querySelectorAll('.delete-music').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index || e.target.parentElement.dataset.index);
            currentSettings.musicSettings.playlist.splice(index, 1);
            loadMusicList();
        });
    });
}

// Load website list
function loadWebsiteList() {
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = '';
    
    currentSettings.websiteLinks.forEach((website, index) => {
        const websiteItem = document.createElement('div');
        websiteItem.className = 'website-item';
        websiteItem.innerHTML = `
            <p>${index + 1}. <a href="${website.url}" target="_blank">${website.name}</a></p>
            <div class="website-actions">
                <button class="btn-danger delete-website" data-index="${index}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        websiteList.appendChild(websiteItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-website').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index || e.target.parentElement.dataset.index);
            currentSettings.websiteLinks.splice(index, 1);
            loadWebsiteList();
            updateGoToPanel();
        });
    });
}

// Update Go To panel with current website links
function updateGoToPanel() {
    const websiteList = document.querySelector('.website-list');
    websiteList.innerHTML = '';
    
    currentSettings.websiteLinks.forEach(website => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="${website.url}" target="_blank">${website.name}</a>`;
        websiteList.appendChild(listItem);
    });
}

// Set up all admin event listeners
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
        
        // Save motivational messages
        const motivationContainer = document.getElementById('motivationMessages');
        if (motivationContainer) {
            const messages = [];
            motivationContainer.querySelectorAll('.motivation-item').forEach(item => {
                const min = parseInt(item.querySelector('.motivation-min').value) || 0;
                const max = parseInt(item.querySelector('.motivation-max').value) || 0;
                const message = item.querySelector('.motivation-text').value;
                messages.push({ min, max, message });
            });
            currentSettings.motivationalMessages = messages;
        }
        
        alert('Pengaturan berhasil disimpan!');
    });
    
    // Music settings
    enableMusicCheckbox.addEventListener('change', (e) => {
        currentSettings.musicSettings.enabled = e.target.checked;
    });
    
    musicVolumeSlider.addEventListener('input', (e) => {
        currentSettings.musicSettings.volume = parseFloat(e.target.value);
    });
    
    // Add music
    addMusicBtn.addEventListener('click', () => {
        document.getElementById('newMusicUrl').value = '';
        document.getElementById('newMusicName').value = '';
    });
    
    saveMusicBtn.addEventListener('click', () => {
        const url = document.getElementById('newMusicUrl').value;
        const name = document.getElementById('newMusicName').value;
        
        if (url && name) {
            currentSettings.musicSettings.playlist.push({ name, url });
            loadMusicList();
            document.getElementById('newMusicUrl').value = '';
            document.getElementById('newMusicName').value = '';
            alert('Musik berhasil ditambahkan!');
        } else {
            alert('Harap isi nama dan URL musik!');
        }
    });
    
    // Add website
    addWebsiteBtn.addEventListener('click', () => {
        document.getElementById('newWebsiteUrl').value = '';
        document.getElementById('newWebsiteName').value = '';
    });
    
    saveWebsiteBtn.addEventListener('click', () => {
        const url = document.getElementById('newWebsiteUrl').value;
        const name = document.getElementById('newWebsiteName').value;
        
        if (url && name) {
            currentSettings.websiteLinks.push({ name, url });
            loadWebsiteList();
            updateGoToPanel();
            document.getElementById('newWebsiteUrl').value = '';
            document.getElementById('newWebsiteName').value = '';
            alert('Website berhasil ditambahkan!');
        } else {
            alert('Harap isi nama dan URL website!');
        }
    });
    
    // Question bank functionality
    generateQuestionBtn.addEventListener('click', generateQuestionWithAI);
    saveQuestionBtn.addEventListener('click', saveQuestion);
    resetQuestionBtn.addEventListener('click', resetQuestionForm);
    searchBtn.addEventListener('click', searchQuestions);
}

// Load questions for editing
function loadQuestionsForEditing() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';
    
    // Get all questions from all categories
    let allQuestions = [];
    for (const category in questionBank) {
        if (typeof questionBank[category] === 'object') {
            for (const level in questionBank[category]) {
                if (Array.isArray(questionBank[category][level])) {
                    allQuestions = allQuestions.concat(questionBank[category][level]);
                }
            }
        } else if (Array.isArray(questionBank[category])) {
            allQuestions = allQuestions.concat(questionBank[category]);
        }
    }
    
    // Render questions
    allQuestions.forEach(question => {
        const questionItem = document.createElement('div');
        questionItem.className = 'question-item';
        questionItem.dataset.id = question.id;
        
        questionItem.innerHTML = `
            <h4>${question.text}</h4>
            <p><strong>Kategori:</strong> ${question.category || 'UMUM'} | 
            <strong>Tingkat:</strong> ${question.level || '-'} | 
            <strong>Jawaban benar:</strong> ${question.correctAnswer}</p>
            <div class="question-actions">
                <button class="btn-primary edit-question" data-id="${question.id}">Edit</button>
                <button class="btn-danger delete-question" data-id="${question.id}">Hapus</button>
                <button class="btn-secondary preview-question" data-id="${question.id}">Preview</button>
            </div>
        `;
        
        questionsList.appendChild(questionItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-question').forEach(btn => {
        btn.addEventListener('click', () => editQuestion(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', () => deleteQuestion(btn.dataset.id));
    });
    
    document.querySelectorAll('.preview-question').forEach(btn => {
        btn.addEventListener('click', () => previewQuestion(btn.dataset.id));
    });
}

// Enhanced AI question generation
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
    
    // Simulate AI generation (in real app, this would call an API)
    setTimeout(() => {
        // Generate question based on category and level
        const generatedQuestion = generateAIQuestion(prompt, category, level);
        
        // Fill the form
        document.getElementById('questionTextArea').value = generatedQuestion.text;
        document.getElementById('optionA').value = generatedQuestion.options[0];
        document.getElementById('optionB').value = generatedQuestion.options[1];
        document.getElementById('optionC').value = generatedQuestion.options[2];
        document.getElementById('optionD').value = generatedQuestion.options[3];
        document.getElementById('optionE').value = generatedQuestion.options[4];
        document.getElementById('correctOption').value = generatedQuestion.correctAnswer;
        document.getElementById('explanation').value = generatedQuestion.explanation;
        
        // Reset button
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
    
    // Create new question object
    const newQuestion = {
        id: Date.now(), // Use timestamp as temporary ID
        category,
        level: category === 'logika' || category === 'cpns' ? null : level,
        text,
        options,
        correctAnswer,
        explanation
    };
    
    // Add to appropriate category in questionBank
    if (category === 'logika' || category === 'cpns') {
        if (!questionBank[category]) {
            questionBank[category] = [];
        }
        questionBank[category].push(newQuestion);
    } else {
        if (!questionBank[category]) {
            questionBank[category] = {};
        }
        if (!questionBank[category][level]) {
            questionBank[category][level] = [];
        }
        questionBank[category][level].push(newQuestion);
    }
    
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
    // Find the question in questionBank
    let questionToEdit = null;
    
    for (const category in questionBank) {
        if (typeof questionBank[category] === 'object') {
            for (const level in questionBank[category]) {
                if (Array.isArray(questionBank[category][level])) {
                    const foundQuestion = questionBank[category][level].find(q => q.id == questionId);
                    if (foundQuestion) {
                        questionToEdit = foundQuestion;
                        break;
                    }
                }
            }
        } else if (Array.isArray(questionBank[category])) {
            const foundQuestion = questionBank[category].find(q => q.id == questionId);
            if (foundQuestion) {
                questionToEdit = foundQuestion;
                break;
            }
        }
        if (questionToEdit) break;
    }
    
    if (questionToEdit) {
        // Switch to add question tab
        document.querySelector('.bank-tab.active').classList.remove('active');
        document.querySelector('.bank-tab-content.active').classList.remove('active');
        
        document.querySelector('.bank-tab[data-tab="addQuestion"]').classList.add('active');
        document.getElementById('addQuestionTab').classList.add('active');
        
        // Fill the form
        document.getElementById('questionCategory').value = questionToEdit.category;
        document.getElementById('questionLevel').value = questionToEdit.level || 'easy';
        document.getElementById('questionTextArea').value = questionToEdit.text;
        document.getElementById('optionA').value = questionToEdit.options[0];
        document.getElementById('optionB').value = questionToEdit.options[1];
        document.getElementById('optionC').value = questionToEdit.options[2];
        document.getElementById('optionD').value = questionToEdit.options[3];
        document.getElementById('optionE').value = questionToEdit.options[4];
        document.getElementById('correctOption').value = questionToEdit.correctAnswer;
        document.getElementById('explanation').value = questionToEdit.explanation;
        
        // Scroll to form
        document.getElementById('questionTextArea').scrollIntoView({ behavior: 'smooth' });
        
        // Store the question ID for update
        document.getElementById('questionTextArea').dataset.id = questionToEdit.id;
    }
}

// Delete question
function deleteQuestion(questionId) {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
        // Find and remove the question from questionBank
        for (const category in questionBank) {
            if (typeof questionBank[category] === 'object') {
                for (const level in questionBank[category]) {
                    if (Array.isArray(questionBank[category][level])) {
                        const index = questionBank[category][level].findIndex(q => q.id == questionId);
                        if (index !== -1) {
                            questionBank[category][level].splice(index, 1);
                            loadQuestionsForEditing();
                            return;
                        }
                    }
                }
            } else if (Array.isArray(questionBank[category])) {
                const index = questionBank[category].findIndex(q => q.id == questionId);
                if (index !== -1) {
                    questionBank[category].splice(index, 1);
                    loadQuestionsForEditing();
                    return;
                }
            }
        }
        
        alert('Soal berhasil dihapus!');
        loadQuestionsForEditing();
    }
}

// Preview question
function previewQuestion(questionId) {
    // Find the question in questionBank
    let questionToPreview = null;
    
    for (const category in questionBank) {
        if (typeof questionBank[category] === 'object') {
            for (const level in questionBank[category]) {
                if (Array.isArray(questionBank[category][level])) {
                    const foundQuestion = questionBank[category][level].find(q => q.id == questionId);
                    if (foundQuestion) {
                        questionToPreview = foundQuestion;
                        break;
                    }
                }
            }
        } else if (Array.isArray(questionBank[category])) {
            const foundQuestion = questionBank[category].find(q => q.id == questionId);
            if (foundQuestion) {
                questionToPreview = foundQuestion;
                break;
            }
        }
        if (questionToPreview) break;
    }
    
    if (questionToPreview) {
        const previewContainer = document.getElementById('questionPreview');
        
        previewContainer.innerHTML = `
            <h3>Preview Soal</h3>
            <div class="preview-question">
                <p><strong>Kategori:</strong> ${questionToPreview.category ? questionToPreview.category.toUpperCase() : 'UMUM'} | 
                <strong>Tingkat:</strong> ${questionToPreview.level ? questionToPreview.level.toUpperCase() : '-'}</p>
                <p class="question-text">${questionToPreview.text}</p>
                <div class="preview-options">
                    <p><strong>A.</strong> ${questionToPreview.options[0]}</p>
                    <p><strong>B.</strong> ${questionToPreview.options[1]}</p>
                    <p><strong>C.</strong> ${questionToPreview.options[2]}</p>
                    <p><strong>D.</strong> ${questionToPreview.options[3]}</p>
                    <p><strong>E.</strong> ${questionToPreview.options[4]}</p>
                </div>
                <p class="preview-answer"><strong>Jawaban benar:</strong> ${questionToPreview.correctAnswer}</p>
                <p class="preview-explanation"><strong>Penjelasan:</strong> ${questionToPreview.explanation}</p>
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
