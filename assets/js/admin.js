// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('adminPanel')) {
        setupAdminPanel();
    }
    
    if (document.getElementById('questionBankPanel')) {
        setupQuestionBank();
    }
});

function setupAdminPanel() {
    // Load current settings
    loadAdminSettings();
    
    // Set up event listeners
    document.getElementById('saveLoginCode').addEventListener('click', saveLoginCode);
    document.getElementById('saveExamCode').addEventListener('click', saveExamCode);
    document.getElementById('saveQuestionBankCode').addEventListener('click', saveQuestionBankCode);
    document.getElementById('saveAdminCode').addEventListener('click', saveAdminCode);
    document.getElementById('updateChairmanName').addEventListener('click', updateChairmanName);
    document.getElementById('updateMotivationText').addEventListener('click', updateMotivationText);
    document.getElementById('updateWelcomeText').addEventListener('click', updateWelcomeText);
    document.getElementById('updateInfoText').addEventListener('click', updateInfoText);
    document.getElementById('updatePointSystem').addEventListener('click', updatePointSystem);
    document.getElementById('toggleShuffle').addEventListener('change', toggleShuffleQuestions);
    document.getElementById('updateQuestionLimit').addEventListener('click', updateQuestionLimit);
    document.getElementById('updateTimer').addEventListener('click', updateExamTimer);
    document.getElementById('toggleExamType').addEventListener('change', toggleExamType);
}

function loadAdminSettings() {
    // In a real app, this would load from a database
    document.getElementById('newLoginCode').value = '12345';
    document.getElementById('currentLoginCode').value = '12345';
    document.getElementById('newExamCode').value = 'OPENLOCK-1945';
    document.getElementById('currentExamCode').value = 'OPENLOCK-1945';
    document.getElementById('newQuestionBankCode').value = 'OPENLOCK-1926';
    document.getElementById('currentQuestionBankCode').value = 'OPENLOCK-1926';
    document.getElementById('newAdminCode').value = '65614222';
    document.getElementById('currentAdminCode').value = '65614222';
    document.getElementById('chairmanName').value = 'Moh. Nuril Hudha, S.Pd., M.Si.';
    document.getElementById('welcomeText').value = 'Sistem ujian online terintegrasi untuk mengukur kemampuan akademik dan logika';

// Load share links
    const shareLinks = JSON.parse(localStorage.getItem('shareLinks') || '[]');
    updateShareLinksTable(shareLinks);
}

// Add new functions for share links
function updateShareLinksTable(links) {
    const tbody = document.querySelector('#shareLinksTable tbody');
    tbody.innerHTML = '';
    
    links.forEach((link, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${link.platform}</td>
            <td>${link.label}</td>
            <td>
                <button class="action-btn edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editShareLink);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteShareLink);
    });
}

function addShareLink() {
    const platform = document.getElementById('sharePlatform').value;
    const label = document.getElementById('shareLabel').value;
    const url = document.getElementById('shareUrl').value;
    const icon = document.getElementById('shareIcon').value;
    
    if (!label || !url) {
        alert('Label dan URL harus diisi');
        return;
    }
    
    const shareLinks = JSON.parse(localStorage.getItem('shareLinks') || '[]');
    shareLinks.push({ platform, label, url, icon });
    localStorage.setItem('shareLinks', JSON.stringify(shareLinks));
    
    updateShareLinksTable(shareLinks);
    resetShareForm();
    alert('Link berhasil ditambahkan');
}

function editShareLink() {
    const index = this.dataset.index;
    const shareLinks = JSON.parse(localStorage.getItem('shareLinks'));
    const link = shareLinks[index];
    
    document.getElementById('sharePlatform').value = link.platform;
    document.getElementById('shareLabel').value = link.label;
    document.getElementById('shareUrl').value = link.url;
    document.getElementById('shareIcon').value = link.icon;
    
    // Change add button to update button temporarily
    const addBtn = document.getElementById('addShareLink');
    addBtn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
    addBtn.onclick = function() {
        updateShareLink(index);
    };
}

function updateShareLink(index) {
    const platform = document.getElementById('sharePlatform').value;
    const label = document.getElementById('shareLabel').value;
    const url = document.getElementById('shareUrl').value;
    const icon = document.getElementById('shareIcon').value;
    
    if (!label || !url) {
        alert('Label dan URL harus diisi');
        return;
    }
    
    const shareLinks = JSON.parse(localStorage.getItem('shareLinks'));
    shareLinks[index] = { platform, label, url, icon };
    localStorage.setItem('shareLinks', JSON.stringify(shareLinks));
    
    updateShareLinksTable(shareLinks);
    resetShareForm();
    alert('Link berhasil diperbarui');
    
    // Restore add button
    const addBtn = document.getElementById('addShareLink');
    addBtn.innerHTML = '<i class="fas fa-plus"></i> Tambah Link';
    addBtn.onclick = addShareLink;
}

function deleteShareLink() {
    if (!confirm('Apakah Anda yakin ingin menghapus link ini?')) return;
    
    const index = this.dataset.index;
    const shareLinks = JSON.parse(localStorage.getItem('shareLinks'));
    shareLinks.splice(index, 1);
    localStorage.setItem('shareLinks', JSON.stringify(shareLinks));
    
    updateShareLinksTable(shareLinks);
    alert('Link berhasil dihapus');
}

function resetShareForm() {
    document.getElementById('shareLabel').value = '';
    document.getElementById('shareUrl').value = '';
}

// Add event listener for the add share link button
document.getElementById('addShareLink').addEventListener('click', addShareLink);
    
    // Load motivation texts
    const motivationTexts = {
        '90-100': 'Sempurna! Anda sangat luar biasa dalam menguasai materi ini. Pertahankan prestasi ini.',
        '80-89': 'Hasil yang sangat memuaskan! Anda telah menunjukkan pemahaman yang mendalam.',
        '70-79': 'Kerja bagus! Anda memiliki pemahaman yang baik tentang materi ini.',
        '60-69': 'Hasil yang baik. Teruslah belajar untuk meningkatkan pemahaman Anda.',
        '50-59': 'Anda telah menyelesaikan ujian ini. Tinjau kembali materi untuk hasil yang lebih baik.',
        '0-49': 'Teruslah berusaha! Setiap kegagalan adalah langkah menuju kesuksesan.'
    };
    
    for (const range in motivationTexts) {
        document.getElementById(`motivation-${range}`).value = motivationTexts[range];
    }
    
    document.getElementById('infoText').value = 'Ujian online ini diselenggarakan oleh PERGUNU SITUBONDO. Hasil ujian akan dikirim via email dan WhatsApp setelah selesai.';
    document.getElementById('pointValue').value = '1';
    document.getElementById('shuffleQuestions').checked = true;
    document.getElementById('questionLimit').value = '10';
    document.getElementById('examTimer').value = '120';
    
    // Load exam type toggles
    const examTypes = ['agama', 'ppkn', 'sejarah', 'ipa', 'ips', 'matematika', 'bahasa_indonesia', 'bahasa_inggris', 'materi_extra', 'materi_khusus', 'logika', 'cpns'];
    examTypes.forEach(type => {
        document.getElementById(`toggle-${type}`).checked = true;
    });
}

function saveLoginCode() {
    const newCode = document.getElementById('newLoginCode').value;
    const currentCode = document.getElementById('currentLoginCode').value;
    
    if (!newCode || !currentCode) {
        alert('Kode baru dan kode saat ini harus diisi');
        return;
    }
    
    if (currentCode !== '12345') { // In a real app, this would check against the current code in database
        alert('Kode saat ini salah');
        return;
    }
    
    // In a real app, this would save to database
    document.getElementById('currentLoginCode').value = newCode;
    alert('Kode login berhasil diperbarui');
}

function saveExamCode() {
    const newCode = document.getElementById('newExamCode').value;
    const currentCode = document.getElementById('currentExamCode').value;
    
    if (!newCode || !currentCode) {
        alert('Kode baru dan kode saat ini harus diisi');
        return;
    }
    
    if (currentCode !== 'OPENLOCK-1945') {
        alert('Kode saat ini salah');
        return;
    }
    
    document.getElementById('currentExamCode').value = newCode;
    alert('Kode ujian CPNS berhasil diperbarui');
}

function saveQuestionBankCode() {
    const newCode = document.getElementById('newQuestionBankCode').value;
    const currentCode = document.getElementById('currentQuestionBankCode').value;
    
    if (!newCode || !currentCode) {
        alert('Kode baru dan kode saat ini harus diisi');
        return;
    }
    
    if (currentCode !== 'OPENLOCK-1926') {
        alert('Kode saat ini salah');
        return;
    }
    
    document.getElementById('currentQuestionBankCode').value = newCode;
    alert('Kode bank soal berhasil diperbarui');
}

function saveAdminCode() {
    const newCode = document.getElementById('newAdminCode').value;
    const currentCode = document.getElementById('currentAdminCode').value;
    
    if (!newCode || !currentCode) {
        alert('Kode baru dan kode saat ini harus diisi');
        return;
    }
    
    if (currentCode !== '65614222') {
        alert('Kode saat ini salah');
        return;
    }
    
    document.getElementById('currentAdminCode').value = newCode;
    alert('Kode admin berhasil diperbarui');
}

function updateChairmanName() {
    const newName = document.getElementById('chairmanName').value;
    
    if (!newName) {
        alert('Nama ketua tidak boleh kosong');
        return;
    }
    
    // In a real app, this would save to database
    alert(`Nama ketua berhasil diperbarui menjadi: ${newName}`);
}

function updateMotivationText() {
    const ranges = ['90-100', '80-89', '70-79', '60-69', '50-59', '0-49'];
    const updatedTexts = {};
    
    ranges.forEach(range => {
        updatedTexts[range] = document.getElementById(`motivation-${range}`).value;
        
        if (!updatedTexts[range]) {
            alert(`Teks motivasi untuk range ${range} tidak boleh kosong`);
            return;
        }
    });
    
    // In a real app, this would save to database
    alert('Teks motivasi berhasil diperbarui');
}

function updateWelcomeText() {
    const newText = document.getElementById('welcomeText').value;
    
    if (!newText) {
        alert('Teks sambutan tidak boleh kosong');
        return;
    }
    
    // In a real app, this would save to database
    alert(`Teks sambutan berhasil diperbarui menjadi: ${newText}`);
}

function updateInfoText() {
    const newText = document.getElementById('infoText').value;
    
    if (!newText) {
        alert('Teks informasi tidak boleh kosong');
        return;
    }
    
    // In a real app, this would save to database
    alert(`Teks informasi berhasil diperbarui menjadi: ${newText}`);
}

function updatePointSystem() {
    const pointValue = document.getElementById('pointValue').value;
    
    if (!pointValue || isNaN(pointValue) || pointValue < 1 || pointValue > 10) {
        alert('Nilai point harus antara 1-10');
        return;
    }
    
    // In a real app, this would save to database
    alert(`Sistem point berhasil diperbarui menjadi: ${pointValue} point per soal`);
}

function toggleShuffleQuestions() {
    const isChecked = document.getElementById('shuffleQuestions').checked;
    // In a real app, this would save to database
    console.log(`Shuffle questions: ${isChecked ? 'ON' : 'OFF'}`);
}

function updateQuestionLimit() {
    const limit = document.getElementById('questionLimit').value;
    
    if (!limit || isNaN(limit) || limit < 5 || limit > 150) {
        alert('Jumlah soal harus antara 5-150 dan kelipatan 5');
        return;
    }
    
    if (limit % 5 !== 0) {
        alert('Jumlah soal harus kelipatan 5');
        return;
    }
    
    // In a real app, this would save to database
    alert(`Jumlah soal berhasil diperbarui menjadi: ${limit} soal`);
}

function updateExamTimer() {
    const minutes = document.getElementById('examTimer').value;
    
    if (!minutes || isNaN(minutes) || minutes < 10 || minutes > 240) {
        alert('Waktu ujian harus antara 10-240 menit');
        return;
    }
    
    // In a real app, this would save to database
    alert(`Waktu ujian berhasil diperbarui menjadi: ${minutes} menit`);
}

function toggleExamType() {
    const examType = this.id.replace('toggle-', '');
    const isEnabled = this.checked;
    
    // In a real app, this would save to database
    console.log(`Exam type ${examType} is now ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
}

function setupQuestionBank() {
    // Load questions from "database"
    loadQuestionsFromDB();
    
    // Set up event listeners
    document.getElementById('addQuestionForm').addEventListener('submit', addNewQuestion);
    document.getElementById('aiGenerateBtn').addEventListener('click', generateQuestionWithAI);
    document.getElementById('searchQuestions').addEventListener('input', searchQuestions);
    document.getElementById('filterSubject').addEventListener('change', filterQuestionsBySubject);
    document.getElementById('filterLevel').addEventListener('change', filterQuestionsByLevel);
    document.getElementById('exportQuestions').addEventListener('click', exportQuestions);
}

function loadQuestionsFromDB() {
    // In a real app, this would load from a database
    const questionsTable = document.getElementById('questionsTable');
    questionsTable.innerHTML = `
        <tr>
            <th>No</th>
            <th>Pertanyaan</th>
            <th>Subjek</th>
            <th>Tingkat</th>
            <th>Kategori</th>
            <th>Aksi</th>
        </tr>
    `;
    
    sampleQuestions.forEach((question, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${question.text.substring(0, 50)}...</td>
            <td>${question.subject || question.category}</td>
            <td>${question.level || '-'}</td>
            <td>${question.category}</td>
            <td>
                <button class="edit-btn" data-id="${question.id}">Edit</button>
                <button class="delete-btn" data-id="${question.id}">Hapus</button>
                <button class="preview-btn" data-id="${question.id}">Preview</button>
            </td>
        `;
        questionsTable.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', editQuestion);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteQuestion);
    });
    
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', previewQuestion);
    });
}

function addNewQuestion(e) {
    e.preventDefault();
    
    const formData = new FormData(document.getElementById('addQuestionForm'));
    const newQuestion = {
        id: Date.now(), // Use timestamp as temporary ID
        text: formData.get('questionText'),
        options: [
            formData.get('optionA'),
            formData.get('optionB'),
            formData.get('optionC'),
            formData.get('optionD')
        ].filter(opt => opt), // Remove empty options
        correctAnswer: formData.get('correctAnswer'),
        explanation: formData.get('explanation'),
        subject: formData.get('subject'),
        level: formData.get('level'),
        category: formData.get('category')
    };
    
    // Validate
    if (!newQuestion.text || newQuestion.options.length < 2 || !newQuestion.correctAnswer) {
        alert('Pertanyaan, minimal 2 opsi, dan jawaban benar harus diisi');
        return;
    }
    
    // In a real app, this would save to database
    sampleQuestions.push(newQuestion);
    loadQuestionsFromDB();
    document.getElementById('addQuestionForm').reset();
    alert('Pertanyaan berhasil ditambahkan');
}

function generateQuestionWithAI() {
    // In a real app, this would call an AI API
    alert('Fitur ini akan menghasilkan pertanyaan menggunakan AI. Di implementasi nyata, ini akan terhubung ke API AI seperti OpenAI.');
    
    // Simulate AI generation
    const subject = document.getElementById('subject').value;
    const level = document.getElementById('level').value;
    
    if (!subject || !level) {
        alert('Pilih subjek dan tingkat kesulitan terlebih dahulu');
        return;
    }
    
    // Mock AI response
    document.getElementById('questionText').value = `Contoh pertanyaan AI tentang ${subject} untuk tingkat ${level}. Ini akan diganti dengan hasil nyata dari API AI.`;
    document.getElementById('optionA').value = 'Pilihan A';
    document.getElementById('optionB').value = 'Pilihan B';
    document.getElementById('optionC').value = 'Pilihan C';
    document.getElementById('optionD').value = 'Pilihan D';
    document.getElementById('correctAnswer').value = 'A';
    document.getElementById('explanation').value = 'Ini adalah penjelasan yang dihasilkan AI untuk jawaban yang benar.';
}

function searchQuestions() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#questionsTable tr');
    
    rows.forEach((row, index) => {
        if (index === 0) return; // Skip header row
        
        const text = row.cells[1].textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterQuestionsBySubject() {
    const subject = this.value;
    const rows = document.querySelectorAll('#questionsTable tr');
    
    rows.forEach((row, index) => {
        if (index === 0) return;
        
        const rowSubject = row.cells[2].textContent.toLowerCase();
        if (subject === 'all' || rowSubject === subject.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterQuestionsByLevel() {
    const level = this.value;
    const rows = document.querySelectorAll('#questionsTable tr');
    
    rows.forEach((row, index) => {
        if (index === 0) return;
        
        const rowLevel = row.cells[3].textContent.toLowerCase();
        if (level === 'all' || rowLevel === level.toLowerCase()) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function editQuestion() {
    const questionId = parseInt(this.dataset.id);
    const question = sampleQuestions.find(q => q.id === questionId);
    
    if (!question) {
        alert('Pertanyaan tidak ditemukan');
        return;
    }
    
    // In a real app, this would open an edit modal
    alert(`Membuka editor untuk pertanyaan: ${question.text.substring(0, 50)}...`);
}

function deleteQuestion() {
    if (!confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) return;
    
    const questionId = parseInt(this.dataset.id);
    const index = sampleQuestions.findIndex(q => q.id === questionId);
    
    if (index !== -1) {
        sampleQuestions.splice(index, 1);
        loadQuestionsFromDB();
        alert('Pertanyaan berhasil dihapus');
    }
}

function previewQuestion() {
    const questionId = parseInt(this.dataset.id);
    const question = sampleQuestions.find(q => q.id === questionId);
    
    if (!question) {
        alert('Pertanyaan tidak ditemukan');
        return;
    }
    
    // In a real app, this would open a preview modal
    alert(`Preview pertanyaan:\n\n${question.text}\n\nOpsi:\n${question.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}\n\nJawaban benar: ${question.correctAnswer}\n\nPenjelasan: ${question.explanation}`);
}

function exportQuestions() {
    // In a real app, this would export to Excel or Word
    alert('Fitur ekspor akan mengunduh file Excel/Word berisi semua pertanyaan. Di implementasi nyata, ini akan menggunakan library seperti SheetJS atau Docx.');
}
