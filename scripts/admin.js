// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Save login code
    document.getElementById('save-login-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-login-code').value;
        if (newCode) {
            document.getElementById('current-login-code').value = newCode;
            alert('Kode login berhasil diperbarui!');
        } else {
            alert('Harap masukkan kode login baru.');
        }
    });
    
    // Save CPNS exam code
    document.getElementById('save-cpns-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-cpns-code').value;
        if (newCode) {
            document.getElementById('current-cpns-code').value = newCode;
            alert('Kode ujian CPNS berhasil diperbarui!');
        } else {
            alert('Harap masukkan kode ujian CPNS baru.');
        }
    });
    
    // Save question bank code
    document.getElementById('save-bank-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-bank-code').value;
        if (newCode) {
            document.getElementById('current-bank-code').value = newCode;
            alert('Kode bank soal berhasil diperbarui!');
        } else {
            alert('Harap masukkan kode bank soal baru.');
        }
    });
    
    // Save admin code
    document.getElementById('save-admin-code').addEventListener('click', function() {
        const newCode = document.getElementById('new-admin-code').value;
        if (newCode) {
            document.getElementById('current-admin-code').value = newCode;
            alert('Kode admin berhasil diperbarui!');
        } else {
            alert('Harap masukkan kode admin baru.');
        }
    });
    
    // Load questions for editing
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-question').value.toLowerCase();
        const questions = getQuestions();
        const questionList = document.getElementById('question-list');
        
        questionList.innerHTML = '';
        
        const filteredQuestions = searchTerm ? 
            questions.filter(q => q.question.toLowerCase().includes(searchTerm)) : 
            questions.slice(0, 10); // Show first 10 if no search term
        
        if (filteredQuestions.length === 0) {
            questionList.innerHTML = '<p>Tidak ada soal yang ditemukan.</p>';
            return;
        }
        
        filteredQuestions.forEach(q => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            questionDiv.innerHTML = `
                <h4>${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}</h4>
                <p>Kategori: ${q.category === 'pelajar' ? 'Pelajar' : 'Umum'} | Mata: ${q.subject.toUpperCase()}</p>
                <div class="question-actions">
                    <button class="btn-small edit-question" data-id="${q.id}">Edit</button>
                    <button class="btn-small delete-question" data-id="${q.id}">Hapus</button>
                </div>
            `;
            questionList.appendChild(questionDiv);
        });
        
        // Set up edit buttons
        document.querySelectorAll('.edit-question').forEach(btn => {
            btn.addEventListener('click', function() {
                const questionId = this.getAttribute('data-id');
                editQuestion(questionId);
            });
        });
        
        // Set up delete buttons
        document.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', function() {
                const questionId = this.getAttribute('data-id');
                if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
                    deleteQuestion(questionId);
                    this.closest('.question-item').remove();
                }
            });
        });
    });
    
    // Load review questions
    document.getElementById('review-category').addEventListener('change', updateReviewQuestions);
    document.getElementById('review-subject').addEventListener('change', updateReviewQuestions);
    
    // Initialize review subjects dropdown
    updateReviewSubjects();
    updateReviewQuestions();
});

function editQuestion(questionId) {
    const questions = getQuestions();
    const question = questions.find(q => q.id === questionId);
    
    if (!question) {
        alert('Soal tidak ditemukan.');
        return;
    }
    
    // Populate form
    document.getElementById('question-category').value = question.category;
    document.getElementById('question-subject').value = question.subject;
    document.getElementById('question-text').value = question.question;
    
    // Set options
    document.querySelector('.option-text[data-option="a"]').value = question.options.a;
    document.querySelector('.option-text[data-option="b"]').value = question.options.b;
    document.querySelector('.option-text[data-option="c"]').value = question.options.c;
    document.querySelector('.option-text[data-option="d"]').value = question.options.d;
    document.querySelector('.option-text[data-option="e"]').value = question.options.e;
    
    // Set correct answer
    document.querySelector(`input[name="correct-option"][value="${question.correctAnswer}"]`).checked = true;
    
    document.getElementById('explanation').value = question.explanation;
    document.getElementById('question-point').value = question.point;
    
    // Switch to add question tab
    document.querySelector('.tab-btn[data-tab="add-question"]').click();
    
    // Scroll to form
    document.getElementById('question-text').scrollIntoView({ behavior: 'smooth' });
}

function deleteQuestion(questionId) {
    const questions = getQuestions().filter(q => q.id !== questionId);
    localStorage.setItem('questions', JSON.stringify(questions));
}

function updateReviewSubjects() {
    const category = document.getElementById('review-category').value;
    const subjectSelect = document.getElementById('review-subject');
    
    // Clear existing options except the first one
    while (subjectSelect.options.length > 1) {
        subjectSelect.remove(1);
    }
    
    if (category === 'all') return;
    
    const questions = getQuestions();
    const subjects = [...new Set(questions
        .filter(q => category === 'all' || q.category === category)
        .map(q => q.subject)
    )];
    
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject.toUpperCase();
        subjectSelect.appendChild(option);
    });
}

function updateReviewQuestions() {
    const category = document.getElementById('review-category').value;
    const subject = document.getElementById('review-subject').value;
    const questions = getQuestions();
    
    const filteredQuestions = questions.filter(q => {
        return (category === 'all' || q.category === category) && 
               (subject === 'all' || q.subject === subject);
    });
    
    document.getElementById('total-questions-count').textContent = filteredQuestions.length;
    
    const questionsTable = document.getElementById('questions-table');
    questionsTable.innerHTML = `
        <tr>
            <th>Pertanyaan</th>
            <th>Kategori</th>
            <th>Mata</th>
            <th>Point</th>
        </tr>
    `;
    
    filteredQuestions.forEach(q => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}</td>
            <td>${q.category === 'pelajar' ? 'Pelajar' : 'Umum'}</td>
            <td>${q.subject.toUpperCase()}</td>
            <td>${q.point}</td>
        `;
        questionsTable.appendChild(row);
    });
}
