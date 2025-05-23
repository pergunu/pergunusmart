
// Fungsi untuk memuat questions.json dengan error handling
async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const questions = await response.json();
        
        // Validasi struktur data
        if (!Array.isArray(questions)) {
            throw new Error("Invalid data format: Expected array");
        }
        
        return questions;
    } catch (error) {
        console.error("Error loading questions:", error);
        
        // Return default questions jika error
        return [
            {
                id: 0,
                text: "Contoh pertanyaan karena error memuat data",
                options: ["Pilihan A", "Pilihan B", "Pilihan C"],
                correctAnswer: "A",
                explanation: "Ini adalah pertanyaan default karena terjadi error saat memuat data."
            }
        ];
    }
}

// Fungsi untuk menampilkan questions
async function initApp() {
    const questions = await loadQuestions();
    console.log("Questions loaded:", questions);
    
    // Implementasi logika aplikasi di sini
    // Contoh: menampilkan pertanyaan pertama
    if (questions.length > 0) {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <h1>${questions[0].text}</h1>
            <ul>
                ${questions[0].options.map((opt, i) => 
                    `<li>${String.fromCharCode(65 + i)}. ${opt}</li>`
                ).join('')}
            </ul>
            <p>Jawaban benar: ${questions[0].correctAnswer}</p>
        `;
    }
}

// Jalankan aplikasi
document.addEventListener('DOMContentLoaded', initApp);
