document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Manual question form submission
    const manualQuestionForm = document.getElementById('manualQuestionForm');
    manualQuestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const question = {
            category: document.getElementById('questionCategory').value,
            text: document.getElementById('questionText').value,
            options: {
                A: document.getElementById('optionA').value,
                B: document.getElementById('optionB').value,
                C: document.getElementById('optionC').value,
                D: document.getElementById('optionD').value,
                E: document.getElementById('optionE').value
            },
            correctAnswer: document.getElementById('correctAnswer').value,
            explanation: document.getElementById('explanation').value,
            image: document.getElementById('questionImage').files[0] ? 
                  URL.createObjectURL(document.getElementById('questionImage').files[0]) : null
        };
        
        // Save question to localStorage (in real app, this would be API call)
        saveQuestion(question);
        
        // Show success message
        showAlert('Soal berhasil disimpan!', 'success');
        
        // Reset form
        this.reset();
    });
    
    // AI question generation
    const aiQuestionForm = document.getElementById('aiQuestionForm');
    aiQuestionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const topic = document.getElementById('aiTopic').value;
        const category = document.getElementById('aiCategory').value;
        const difficulty = document.getElementById('aiDifficulty').value;
        const count = document.getElementById('aiQuestionCount').value;
        
        // Show loading
        const aiResults = document.getElementById('aiResults');
        aiResults.style.display = 'none';
        const generateBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = generateBtn.innerHTML;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        // Simulate AI generation (in real app, this would be API call)
        setTimeout(() => {
            const generatedQuestions = generateAiQuestions(topic, category, difficulty, count);
            displayAiQuestions(generatedQuestions);
            
            // Hide loading
            generateBtn.innerHTML = originalBtnText;
            generateBtn.disabled = false;
            aiResults.style.display = 'block';
        }, 2000);
    });
    
    // Save AI generated questions
    document.getElementById('saveAiQuestions').addEventListener('click', function() {
        const questions = JSON.parse(this.getAttribute('data-questions'));
        
        questions.forEach(q => {
            saveQuestion(q);
        });
        
        showAlert(`${questions.length} soal berhasil disimpan!`, 'success');
        document.getElementById('aiResults').style.display = 'none';
        document.getElementById('aiQuestionForm').reset();
    });
    
    // Load questions for management tab
    loadQuestionsForManagement();
});

function saveQuestion(question) {
    // Get existing questions from localStorage
    let questions = JSON.parse(localStorage.getItem('questions')) || [];
    
    // Add new question
    questions.push({
        id: Date.now(),
        ...question
    });
    
    // Save back to localStorage
    localStorage.setItem('questions', JSON.stringify(questions));
}

function generateAiQuestions(topic, category, difficulty, count) {
    // This is a simulation - in a real app, you would call an AI API
    const questions = [];
    
    for (let i = 0; i < count; i++) {
        questions.push({
            category: category,
            text: `Contoh soal tentang ${topic} (${difficulty}) - pertanyaan ${i + 1}`,
            options: {
                A: `Opsi A untuk pertanyaan ${i + 1}`,
                B: `Opsi B untuk pertanyaan ${i + 1}`,
                C: `Opsi C untuk pertanyaan ${i + 1}`,
                D: `Opsi D untuk pertanyaan ${i + 1}`,
                E: `Opsi E untuk pertanyaan ${i + 1}`
            },
            correctAnswer: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)],
            explanation: `Ini adalah penjelasan untuk jawaban pertanyaan ${i + 1} tentang ${topic}`
        });
    }
    
    return questions;
}

function displayAiQuestions(questions) {
    const container = document.getElementById('aiGeneratedQuestions');
    container.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionEl = document.createElement('div');
        questionEl.className = 'ai-question';
        questionEl.innerHTML = `
            <div class="ai-question-header">
                <h5>Soal ${index + 1}</h5>
                <span class="category-badge">${q.category}</span>
            </div>
            <div class="ai-question-text">${q.text}</div>
            <div class="ai-question-options">
                <div><strong>A:</strong> ${q.options.A}</div>
                <div><strong>B:</strong> ${q.options.B}</div>
                <div><strong>C:</strong> ${q.options.C}</div>
                <div><strong>D:</strong> ${q.options.D}</div>
                <div><strong>E:</strong> ${q.options.E}</div>
            </div>
            <div class="ai-question-answer">
                <strong>Jawaban benar:</strong> ${q.correctAnswer}
            </div>
            <div class="ai-question-explanation">
                <strong>Penjelasan:</strong> ${q.explanation}
            </div>
        `;
        container.appendChild(questionEl);
    });
    
    document.getElementById('saveAiQuestions').setAttribute('data-questions', JSON.stringify(questions));
}

function loadQuestionsForManagement() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Memuat soal...</div>';
    
    // Simulate loading (in real app, this would be API call)
    setTimeout(() => {
        const questions = JSON.parse(localStorage.getItem('questions')) || [];
        
        if (questions.length === 0) {
            questionsList.innerHTML = '<div class="no-questions">Belum ada soal yang tersimpan.</div>';
            return;
        }
        
        questionsList.innerHTML = '';
        
        questions.forEach(q => {
            const questionEl = document.createElement('div');
            questionEl.className = 'question-item';
            questionEl.innerHTML = `
                <div class="question-item-header">
                    <input type="checkbox" class="question-checkbox" data-id="${q.id}">
                    <span class="question-category">${q.category}</span>
                    <span class="question-id">#${q.id}</span>
                </div>
                <div class="question-item-text">${q.text.substring(0, 100)}...</div>
                <div class="question-item-actions">
                    <button class="btn btn-sm btn-preview" data-id="${q.id}">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn btn-sm btn-edit" data-id="${q.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            `;
            questionsList.appendChild(questionEl);
        });
        
        // Add event listeners for preview and edit buttons
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.addEventListener('click', function() {
                const questionId = parseInt(this.getAttribute('data-id'));
                previewQuestion(questionId);
            });
        });
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const questionId = parseInt(this.getAttribute('data-id'));
                editQuestion(questionId);
            });
        });
        
        // Add event listener for delete selected
        document.getElementById('deleteSelected').addEventListener('click', deleteSelectedQuestions);
        
    }, 1000);
}

function previewQuestion(questionId) {
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
        showAlert('Soal tidak ditemukan!', 'error');
        return;
    }
    
    const modal = document.getElementById('questionPreviewModal');
    const content = document.getElementById('questionPreviewContent');
    
    document.getElementById('previewCategory').textContent = question.category;
    
    let html = `
        <div class="preview-question-text">${question.text}</div>
    `;
    
    if (question.image) {
        html += `
            <div class="preview-question-image">
                <img src="${question.image}" alt="Gambar soal">
            </div>
        `;
    }
    
    html += `
        <div class="preview-options">
            <div class="preview-option ${question.correctAnswer === 'A' ? 'correct' : ''}">
                <strong>A:</strong> ${question.options.A}
            </div>
            <div class="preview-option ${question.correctAnswer === 'B' ? 'correct' : ''}">
                <strong>B:</strong> ${question.options.B}
            </div>
            <div class="preview-option ${question.correctAnswer === 'C' ? 'correct' : ''}">
                <strong>C:</strong> ${question.options.C}
            </div>
            <div class="preview-option ${question.correctAnswer === 'D' ? 'correct' : ''}">
                <strong>D:</strong> ${question.options.D}
            </div>
            <div class="preview-option ${question.correctAnswer === 'E' ? 'correct' : ''}">
                <strong>E:</strong> ${question.options.E}
            </div>
        </div>
        <div class="preview-explanation">
            <h5>Penjelasan:</h5>
            <p>${question.explanation}</p>
        </div>
    `;
    
    content.innerHTML = html;
    
    // Set up edit and delete buttons
    document.getElementById('editQuestionBtn').onclick = function() {
        modal.style.display = 'none';
        editQuestion(questionId);
    };
    
    document.getElementById('deleteQuestionBtn').onclick = function() {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            deleteQuestion(questionId);
            modal.style.display = 'none';
        }
    };
    
    // Show modal
    modal.style.display = 'flex';
    
    // Close modal when clicking X
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function editQuestion(questionId) {
    // In a real app, this would open an edit form
    // For now, we'll just show an alert
    alert(`Edit soal #${questionId} akan dibuka di sini`);
}

function deleteQuestion(questionId) {
    let questions = JSON.parse(localStorage.getItem('questions')) || [];
    questions = questions.filter(q => q.id !== questionId);
    localStorage.setItem('questions', JSON.stringify(questions));
    showAlert('Soal berhasil dihapus!', 'success');
    loadQuestionsForManagement();
}

function deleteSelectedQuestions() {
    const checkboxes = document.querySelectorAll('.question-checkbox:checked');
    
    if (checkboxes.length === 0) {
        showAlert('Pilih soal yang ingin dihapus terlebih dahulu!', 'warning');
        return;
    }
    
    if (!confirm(`Apakah Anda yakin ingin menghapus ${checkboxes.length} soal terpilih?`)) {
        return;
    }
    
    let questions = JSON.parse(localStorage.getItem('questions')) || [];
    const originalCount = questions.length;
    
    checkboxes.forEach(cb => {
        const questionId = parseInt(cb.getAttribute('data-id'));
        questions = questions.filter(q => q.id !== questionId);
    });
    
    localStorage.setItem('questions', JSON.stringify(questions));
    showAlert(`${originalCount - questions.length} soal berhasil dihapus!`, 'success');
    loadQuestionsForManagement();
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 3000);
}
