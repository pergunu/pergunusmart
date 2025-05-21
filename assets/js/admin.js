document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const adminSections = document.querySelectorAll('.admin-section');
    const adminNavLinks = document.querySelectorAll('.admin-sidebar a');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const participantTable = document.querySelector('.participant-table tbody');
    const questionList = document.querySelector('.question-list');
    const addQuestionForm = document.querySelector('.add-question-form');
    const showAddQuestionBtn = document.querySelector('.btn-admin i.fa-plus');
    const cancelAddQuestionBtn = document.querySelector('.btn-admin.cancel');
    const exportButtons = document.querySelectorAll('.btn-admin i.fa-download');
    const searchInputs = document.querySelectorAll('.admin-search input');
    const searchButtons = document.querySelectorAll('.admin-search button');
    const settingGroups = document.querySelectorAll('.setting-group');
    const reportFilters = document.querySelector('.report-filters');
    const paginationButtons = document.querySelectorAll('.btn-pagination');
    
    // Sample data (in a real app, this would come from a server/database)
    const participants = [
        {
            id: 1,
            name: "Uswatun Hasanah",
            status: "Pelajar",
            school: "SMA Negeri 1 Situbondo",
            exam: "PPKN",
            score: 85,
            time: "16 Mei 2025, 10:15"
        },
        {
            id: 2,
            name: "Mohammad Ali",
            status: "Pelajar",
            school: "SMP Negeri 2 Situbondo",
            exam: "Agama",
            score: 92,
            time: "16 Mei 2025, 09:45"
        },
        {
            id: 3,
            name: "Siti Aminah",
            status: "Pelajar",
            school: "SMA Negeri 3 Situbondo",
            exam: "Matematika",
            score: 78,
            time: "16 Mei 2025, 09:30"
        },
        {
            id: 4,
            name: "Budi Santoso",
            status: "Umum",
            school: "-",
            exam: "CPNS",
            score: 65,
            time: "16 Mei 2025, 09:15"
        },
        {
            id: 5,
            name: "Ani Lestari",
            status: "Umum",
            school: "-",
            exam: "Logika",
            score: 88,
            time: "16 Mei 2025, 08:50"
        }
    ];

    const questions = {
        agama: [
            {
                id: 1,
                question: "Berapakah jumlah Rukun Iman?",
                options: ["4", "5", "6", "7", "8"],
                answer: "C",
                explanation: "Rukun Iman ada 6 yaitu: 1. Iman kepada Allah, 2. Iman kepada Malaikat, 3. Iman kepada Kitab-kitab, 4. Iman kepada Rasul, 5. Iman kepada Hari Kiamat, 6. Iman kepada Qada dan Qadar."
            },
            {
                id: 2,
                question: "Siapakah nama malaikat yang bertugas menyampaikan wahyu?",
                options: ["Mikail", "Israfil", "Izrail", "Jibril", "Ridwan"],
                answer: "D",
                explanation: "Malaikat Jibril bertugas menyampaikan wahyu dari Allah kepada para Nabi dan Rasul."
            }
        ],
        ppkn: [
            {
                id: 1,
                question: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 pada alinea keberapa?",
                options: ["Pertama", "Kedua", "Ketiga", "Keempat", "Tidak tercantum"],
                answer: "D",
                explanation: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 alinea keempat."
            }
        ]
    };

    // Current state
    let currentSection = 'dashboard';
    let currentSubject = 'agama';
    let currentSettingTab = 'Kode Akses';

    // Initialize the admin panel
    function initAdminPanel() {
        // Load participants
        renderParticipants();
        
        // Load questions for default subject
        renderQuestions(currentSubject);
        
        // Set up event listeners
        setupEventListeners();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Navigation links
        adminNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('href').substring(1);
                showSection(sectionId);
            });
        });

        // Tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabType = this.closest('.subject-tabs') ? 'subject' : 
                               this.closest('.settings-tabs') ? 'setting' : null;
                
                if (tabType === 'subject') {
                    currentSubject = this.textContent.toLowerCase();
                    renderQuestions(currentSubject);
                } else if (tabType === 'setting') {
                    currentSettingTab = this.textContent;
                    // In a real app, you would load different setting content here
                }
                
                // Update active state
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Add question form toggle
        if (showAddQuestionBtn) {
            showAddQuestionBtn.closest('button').addEventListener('click', function(e) {
                e.preventDefault();
                questionList.style.display = 'none';
                addQuestionForm.style.display = 'block';
            });
        }

        if (cancelAddQuestionBtn) {
            cancelAddQuestionBtn.addEventListener('click', function(e) {
                e.preventDefault();
                questionList.style.display = 'block';
                addQuestionForm.style.display = 'none';
            });
        }

        // Export buttons
        exportButtons.forEach(btn => {
            btn.closest('button').addEventListener('click', function(e) {
                e.preventDefault();
                const exportType = this.closest('#participants') ? 'participants' : 
                                   this.closest('#reports') ? 'reports' : null;
                exportData(exportType);
            });
        });

        // Search functionality
        searchButtons.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const searchTerm = searchInputs[index].value.trim().toLowerCase();
                if (searchTerm) {
                    if (index === 0) { // Participant search
                        searchParticipants(searchTerm);
                    } else { // Question search
                        searchQuestions(searchTerm);
                    }
                }
            });
        });

        // Pagination
        paginationButtons.forEach(button => {
            button.addEventListener('click', function() {
                // In a real app, this would load different pages of data
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                if (!this.querySelector('i')) {
                    this.classList.add('active');
                }
            });
        });

        // Form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.classList.contains('login-form')) continue;
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, this would submit data to the server
                alert('Data berhasil disimpan!');
            });
        });
    }

    // Show a specific section
    function showSection(sectionId) {
        adminSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        adminNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        currentSection = sectionId;
    }

    // Render participants table
    function renderParticipants() {
        participantTable.innerHTML = '';
        
        participants.forEach(participant => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${participant.id}</td>
                <td>${participant.name}</td>
                <td>${participant.status}</td>
                <td>${participant.school}</td>
                <td>${participant.exam}</td>
                <td>${participant.score}</td>
                <td>${participant.time}</td>
                <td>
                    <button class="btn-action view"><i class="fas fa-eye"></i></button>
                    <button class="btn-action delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            participantTable.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-action.view').forEach(btn => {
            btn.addEventListener('click', function() {
                viewParticipantDetails(this.closest('tr'));
            });
        });

        document.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteParticipant(this.closest('tr'));
            });
        });
    }

    // Render questions for a subject
    function renderQuestions(subject) {
        questionList.innerHTML = '';
        
        const subjectQuestions = questions[subject] || [];
        
        subjectQuestions.forEach((q, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            
            questionItem.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Soal #${index + 1}</span>
                    <span class="question-subject">${subject.toUpperCase()}</span>
                    <div class="question-actions">
                        <button class="btn-action edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-action delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="question-text">${q.question}</div>
                <div class="question-options">
                    ${q.options.map((opt, i) => `
                        <div class="option ${String.fromCharCode(65 + i) === q.answer ? 'correct' : ''}">
                            ${String.fromCharCode(65 + i)}. ${opt}
                        </div>
                    `).join('')}
                </div>
                <div class="question-explanation">
                    <strong>Penjelasan:</strong> ${q.explanation}
                </div>
            `;
            
            questionList.appendChild(questionItem);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-action.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                editQuestion(this.closest('.question-item'));
            });
        });

        document.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteQuestion(this.closest('.question-item'));
            });
        });
    }

    // View participant details
    function viewParticipantDetails(row) {
        const participantId = parseInt(row.cells[0].textContent);
        const participant = participants.find(p => p.id === participantId);
        
        // In a real app, this would show a detailed modal or page
        alert(`Detail Peserta:\n\nNama: ${participant.name}\nStatus: ${participant.status}\nSekolah: ${participant.school}\nUjian: ${participant.exam}\nNilai: ${participant.score}\nWaktu: ${participant.time}`);
    }

    // Delete participant
    function deleteParticipant(row) {
        if (confirm('Apakah Anda yakin ingin menghapus data peserta ini?')) {
            // In a real app, this would send a request to the server
            row.remove();
            alert('Data peserta berhasil dihapus!');
        }
    }

    // Edit question
    function editQuestion(questionItem) {
        // In a real app, this would populate the add question form with the question data
        questionList.style.display = 'none';
        addQuestionForm.style.display = 'block';
        alert('Fitur edit soal akan membuka form edit dengan data soal yang dipilih.');
    }

    // Delete question
    function deleteQuestion(questionItem) {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            // In a real app, this would send a request to the server
            questionItem.remove();
            alert('Soal berhasil dihapus!');
        }
    }

    // Search participants
    function searchParticipants(term) {
        const filtered = participants.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.school.toLowerCase().includes(term) ||
            p.exam.toLowerCase().includes(term)
        );
        
        // In a real app, this would update the table with filtered results
        alert(`Menampilkan ${filtered.length} peserta yang cocok dengan pencarian "${term}"`);
    }

    // Search questions
    function searchQuestions(term) {
        // In a real app, this would search across all questions
        alert(`Menampilkan soal-soal yang mengandung "${term}"`);
    }

    // Export data
    function exportData(type) {
        // In a real app, this would generate and download a file
        alert(`Mengekspor data ${type} dalam format Excel...`);
    }

    // Initialize the admin panel
    initAdminPanel();
});
