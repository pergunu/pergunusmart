// Question Bank Functionality
document.addEventListener('DOMContentLoaded', function() {
    const questionList = document.getElementById('question-list');
    const questionEditor = document.getElementById('question-editor');
    const aiGenerator = document.getElementById('ai-generator');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const aiGenerateBtn = document.getElementById('ai-generate-btn');
    const saveQuestionBtn = document.getElementById('save-question-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const generateQuestionsBtn = document.getElementById('generate-questions-btn');
    const cancelAiBtn = document.getElementById('cancel-ai-btn');
    const resetBankBtn = document.getElementById('reset-bank-btn');
    
    // Sample questions data (in a real app, this would be from a database)
    let questions = [
        {
            id: 1,
            category: 'agama',
            level: 'SD',
            text: 'Apa nama kitab suci umat Islam?',
            options: [
                { text: 'Al-Quran' },
                { text: 'Alkitab' },
                { text: 'Weda' },
                { text: 'Tripitaka' }
            ],
            correctAnswer: 0,
            explanation: 'Kitab suci umat Islam adalah Al-Quran yang diturunkan kepada Nabi Muhammad SAW.'
        },
        {
            id: 2,
            category: 'ppkn',
            level: 'SMP',
            text: 'Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 pada alinea keberapa?',
            options: [
                { text: 'Pertama' },
                { text: 'Kedua' },
                { text: 'Ketiga' },
                { text: 'Keempat' }
            ],
            correctAnswer: 3,
            explanation: 'Pancasila tercantum dalam Pembukaan UUD 1945 alinea keempat setelah kalimat "maka disusunlah Kemerdekaan Kebangsaan Indonesia itu dalam suatu Undang-Undang Dasar Negara Indonesia".'
        }
    ];
    
    // Initialize question editor form
    questionEditor.innerHTML = `
        <div class="form-group">
            <label>Kategori:</label>
            <select id="question-category">
                <option value="agama">AGAMA</option>
                <option value="ppkn">PPKN</option>
                <option value="sejarah">SEJARAH</option>
                <option value="ipa">IPA</option>
                <option value="ips">IPS</option>
                <option value="matematika">MATEMATIKA</option>
                <option value="indonesia">BAHASA INDONESIA</option>
                <option value="inggris">BAHASA INGGRIS</option>
                <option value="extra">MATERI EXTRA</option>
                <option value="khusus">MATERI KHUSUS</option>
                <option value="logika">UJIAN LOGIKA</option>
                <option value="cpns">UJIAN CPNS/P3K</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Tingkat:</label>
            <select id="question-level">
                <option value="sd">SD</option>
                <option value="smp">SMP</option>
                <option value="sma">SMA/SMK</option>
                <option value="umum">Umum</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Pertanyaan:</label>
            <textarea id="question-text-editor" rows="3"></textarea>
        </div>
        
        <div class="form-group">
            <label>Gambar (opsional):</label>
            <input type="file" id="question-image" accept="image/*">
        </div>
        
        <div class="form-group">
            <label>Opsi Jawaban:</label>
            <div class="option-group">
                <label>A:</label>
                <input type="text" id="option-a">
                <input type="radio" name="correct-answer" value="a" checked>
                <label>Benar</label>
            </div>
            <div class="option-group">
                <label>B:</label>
                <input type="text" id="option-b">
                <input type="radio" name="correct-answer" value="b">
                <label>Benar</label>
            </div>
            <div class="option-group">
                <label>C:</label>
                <input type="text" id="option-c">
                <input type="radio" name="correct-answer" value="c">
                <label>Benar</label>
            </div>
            <div class="option-group">
                <label>D:</label>
                <input type="text" id="option-d">
                <input type="radio" name="correct-answer" value="d">
                <label>Benar</label>
            </div>
            <div class="option-group">
                <label>E:</label>
                <input type="text" id="option-e">
                <input type="radio" name="correct-answer" value="e">
                <label>Benar</label>
            </div>
        </div>
        
        <div class="form-group">
            <label>Penjelasan Jawaban:</label>
            <textarea id="explanation-editor" rows="3"></textarea>
        </div>
        
        <div class="editor-actions">
            <button id="save-question-btn" class="btn-gradient">Simpan Soal</button>
            <button id="cancel-edit-btn" class="btn-outline">Batal</button>
        </div>
    `;
    
    // Load questions into the list
    function loadQuestions() {
        questionList.innerHTML = '';
        
        questions.forEach(question => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.dataset.id = question.id;
            
            const questionHeader = document.createElement('div');
            questionHeader.className = 'question-item-header';
            
            const questionCategory = document.createElement('span');
            questionCategory.className = 'question-item-category';
            questionCategory.textContent = question.category.toUpperCase();
            
            const questionLevel = document.createElement('span');
            questionLevel.className = 'question-item-level';
            questionLevel.textContent = question.level.toUpperCase();
            
            const questionText = document.createElement('div');
            questionText.className = 'question-item-text';
            questionText.textContent = question.text;
            
            const questionOptions = document.createElement('div');
            questionOptions.className = 'question-item-options';
            
            question.options.forEach((option, index) => {
                const optionText = document.createElement('div');
                optionText.textContent = `${String.fromCharCode(65 + index)}. ${option.text} ${index === question.correctAnswer ? '✓' : ''}`;
                questionOptions.appendChild(optionText);
            });
            
            const questionActions = document.createElement('div');
            questionActions.className = 'question-item-actions';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'question-item-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editQuestion(question.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'question-item-btn';
            deleteBtn.textContent = 'Hapus';
            deleteBtn.addEventListener('click', () => deleteQuestion(question.id));
            
            questionHeader.appendChild(questionCategory);
            questionHeader.appendChild(questionLevel);
            
            questionActions.appendChild(editBtn);
            questionActions.appendChild(deleteBtn);
            
            questionItem.appendChild(questionHeader);
            questionItem.appendChild(questionText);
            questionItem.appendChild(questionOptions);
            questionItem.appendChild(questionActions);
            
            questionList.appendChild(questionItem);
        });
    }
    
    // Add new question
    addQuestionBtn.addEventListener('click', function() {
        questionEditor.style.display = 'block';
        aiGenerator.style.display = 'none';
        
        // Reset form
        document.getElementById('question-category').value = 'agama';
        document.getElementById('question-level').value = 'sd';
        document.getElementById('question-text-editor').value = '';
        document.getElementById('option-a').value = '';
        document.getElementById('option-b').value = '';
        document.getElementById('option-c').value = '';
        document.getElementById('option-d').value = '';
        document.getElementById('option-e').value = '';
        document.querySelector('input[name="correct-answer"][value="a"]').checked = true;
        document.getElementById('explanation-editor').value = '';
        
        // Reset save button to default behavior
        saveQuestionBtn.onclick = function() {
            const category = document.getElementById('question-category').value;
            const level = document.getElementById('question-level').value;
            const text = document.getElementById('question-text-editor').value.trim();
            const optionA = document.getElementById('option-a').value.trim();
            const optionB = document.getElementById('option-b').value.trim();
            const optionC = document.getElementById('option-c').value.trim();
            const optionD = document.getElementById('option-d').value.trim();
            const optionE = document.getElementById('option-e').value.trim();
            const correctAnswer = document.querySelector('input[name="correct-answer"]:checked').value;
            const explanation = document.getElementById('explanation-editor').value.trim();
            
            if (!text || !optionA || !optionB || !optionC || !optionD) {
                alert('Harap isi semua bidang yang diperlukan (minimal sampai opsi D).');
                return;
            }
            
            const options = [
                { text: optionA },
                { text: optionB },
                { text: optionC },
                { text: optionD }
            ];
            
            if (optionE) {
                options.push({ text: optionE });
            }
            
            const newQuestion = {
                id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
                category: category,
                level: level,
                text: text,
                options: options,
                correctAnswer: correctAnswer.charCodeAt(0) - 97,
                explanation: explanation
            };
            
            questions.push(newQuestion);
            loadQuestions();
            questionEditor.style.display = 'none';
            alert('Soal berhasil disimpan!');
        };
    });
    
    // Save question
    saveQuestionBtn.addEventListener('click', function() {
        const category = document.getElementById('question-category').value;
        const level = document.getElementById('question-level').value;
        const text = document.getElementById('question-text-editor').value.trim();
        const optionA = document.getElementById('option-a').value.trim();
        const optionB = document.getElementById('option-b').value.trim();
        const optionC = document.getElementById('option-c').value.trim();
        const optionD = document.getElementById('option-d').value.trim();
        const optionE = document.getElementById('option-e').value.trim();
        const correctAnswer = document.querySelector('input[name="correct-answer"]:checked').value;
        const explanation = document.getElementById('explanation-editor').value.trim();
        
        if (!text || !optionA || !optionB || !optionC || !optionD) {
            alert('Harap isi semua bidang yang diperlukan (minimal sampai opsi D).');
            return;
        }
        
        const options = [
            { text: optionA },
            { text: optionB },
            { text: optionC },
            { text: optionD }
        ];
        
        if (optionE) {
            options.push({ text: optionE });
        }
        
        const newQuestion = {
            id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
            category: category,
            level: level,
            text: text,
            options: options,
            correctAnswer: correctAnswer.charCodeAt(0) - 97,
            explanation: explanation
        };
        
        questions.push(newQuestion);
        loadQuestions();
        questionEditor.style.display = 'none';
        alert('Soal berhasil disimpan!');
    });
    
    // Cancel editing
    cancelEditBtn.addEventListener('click', function() {
        questionEditor.style.display = 'none';
    });
    
    // AI Generate questions
    aiGenerateBtn.addEventListener('click', function() {
        aiGenerator.style.display = 'block';
        questionEditor.style.display = 'none';
    });
    
    // Generate questions with AI (simulated)
    generateQuestionsBtn.addEventListener('click', function() {
        const prompt = document.getElementById('ai-prompt').value.trim();
        const count = parseInt(document.getElementById('ai-question-count').value);
        
        if (!prompt) {
            alert('Masukkan prompt untuk AI terlebih dahulu.');
            return;
        }
        
        if (count < 1 || count > 10) {
            alert('Jumlah soal harus antara 1-10.');
            return;
        }
        
        // Simulate AI generation (in a real app, this would call an API)
        alert(`Sedang menghasilkan ${count} soal berdasarkan prompt: "${prompt}"\n\nIni hanya simulasi. Dalam aplikasi nyata, ini akan memanggil API AI.`);
        
        // For demo purposes, just hide the AI generator
        aiGenerator.style.display = 'none';
    });
    
    // Cancel AI generation
    cancelAiBtn.addEventListener('click', function() {
        aiGenerator.style.display = 'none';
    });
    
    // Reset question bank
    resetBankBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin mereset bank soal? Semua soal akan dihapus.')) {
            questions = [];
            loadQuestions();
            alert('Bank soal telah direset.');
        }
    });
    
    // Edit question
    function editQuestion(id) {
        const question = questions.find(q => q.id === id);
        if (!question) return;
        
        document.getElementById('question-category').value = question.category;
        document.getElementById('question-level').value = question.level;
        document.getElementById('question-text-editor').value = question.text;
        document.getElementById('option-a').value = question.options[0].text;
        document.getElementById('option-b').value = question.options[1].text;
        document.getElementById('option-c').value = question.options[2].text;
        document.getElementById('option-d').value = question.options[3].text;
        document.getElementById('option-e').value = question.options[4] ? question.options[4].text : '';
        document.querySelector(`input[name="correct-answer"][value="${String.fromCharCode(97 + question.correctAnswer)}"]`).checked = true;
        document.getElementById('explanation-editor').value = question.explanation;
        
        questionEditor.style.display = 'block';
        aiGenerator.style.display = 'none';
        
        // Update save button to handle editing
        saveQuestionBtn.onclick = function() {
            const category = document.getElementById('question-category').value;
            const level = document.getElementById('question-level').value;
            const text = document.getElementById('question-text-editor').value.trim();
            const optionA = document.getElementById('option-a').value.trim();
            const optionB = document.getElementById('option-b').value.trim();
            const optionC = document.getElementById('option-c').value.trim();
            const optionD = document.getElementById('option-d').value.trim();
            const optionE = document.getElementById('option-e').value.trim();
            const correctAnswer = document.querySelector('input[name="correct-answer"]:checked').value;
            const explanation = document.getElementById('explanation-editor').value.trim();
            
            if (!text || !optionA || !optionB || !optionC || !optionD) {
                alert('Harap isi semua bidang yang diperlukan (minimal sampai opsi D).');
                return;
            }
            
            const options = [
                { text: optionA },
                { text: optionB },
                { text: optionC },
                { text: optionD }
            ];
            
            if (optionE) {
                options.push({ text: optionE });
            }
            
            // Update the question
            question.category = category;
            question.level = level;
            question.text = text;
            question.options = options;
            question.correctAnswer = correctAnswer.charCodeAt(0) - 97;
            question.explanation = explanation;
            
            loadQuestions();
            questionEditor.style.display = 'none';
            alert('Soal berhasil diperbarui!');
            
            // Reset save button to default behavior
            saveQuestionBtn.onclick = arguments.callee;
        };
    }
    
    // Delete question
    function deleteQuestion(id) {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            questions = questions.filter(q => q.id !== id);
            loadQuestions();
            alert('Soal berhasil dihapus.');
        }
    }
    
    // Initial load
    loadQuestions();
});
