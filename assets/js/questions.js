// This file would contain all the questions for the exam
// For demo purposes, we'll include a few sample questions

const questionBank = {
    agama: [
        {
            question: "Berapakah jumlah Rukun Iman?",
            options: ["4", "5", "6", "7", "8"],
            answer: "C",
            explanation: "Rukun Iman ada 6 yaitu: 1. Iman kepada Allah, 2. Iman kepada Malaikat, 3. Iman kepada Kitab-kitab, 4. Iman kepada Rasul, 5. Iman kepada Hari Kiamat, 6. Iman kepada Qada dan Qadar."
        },
        {
            question: "Siapakah nama malaikat yang bertugas menyampaikan wahyu?",
            options: ["Mikail", "Israfil", "Izrail", "Jibril", "Ridwan"],
            answer: "D",
            explanation: "Malaikat Jibril bertugas menyampaikan wahyu dari Allah kepada para Nabi dan Rasul."
        }
    ],
    ppkn: [
        {
            question: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 pada alinea keberapa?",
            options: ["Pertama", "Kedua", "Ketiga", "Keempat", "Tidak tercantum"],
            answer: "D",
            explanation: "Pancasila sebagai dasar negara tercantum dalam Pembukaan UUD 1945 alinea keempat."
        },
        {
            question: "Lambang sila pertama Pancasila adalah...",
            options: ["Padi dan kapas", "Bintang", "Rantai", "Kepala banteng", "Pohon beringin"],
            answer: "B",
            explanation: "Lambang sila pertama (Ketuhanan Yang Maha Esa) adalah bintang."
        }
    ],
    // Add more questions for other subjects...
    logika: [
        {
            question: "Jika semua A adalah B dan semua B adalah C, maka:",
            options: ["Semua A adalah C", "Beberapa A adalah C", "Semua C adalah A", "Tidak ada hubungan antara A dan C", "Beberapa C adalah A"],
            answer: "A",
            explanation: "Jika semua A adalah B dan semua B adalah C, maka dapat disimpulkan bahwa semua A adalah C."
        },
        {
            question: "2, 4, 8, 16, ... Berapakah angka berikutnya?",
            options: ["24", "32", "64", "128", "256"],
            answer: "B",
            explanation: "Pola ini adalah perkalian 2 setiap angka (2×2=4, 4×2=8, 8×2=16, 16×2=32)."
        }
    ],
    cpns: [
        {
            question: "Yang termasuk asas-asas umum penyelenggaraan negara menurut UU No. 28 Tahun 1999 adalah:",
            options: ["Asas kepastian hukum", "Asas profesionalitas", "Asas akuntabilitas", "Semua benar", "Tidak ada yang benar"],
            answer: "D",
            explanation: "Semua pilihan merupakan asas-asas umum penyelenggaraan negara menurut UU No. 28 Tahun 1999."
        },
        {
            question: "Tujuan negara Indonesia tercantum dalam Pembukaan UUD 1945 alinea ke:",
            options: ["Pertama", "Kedua", "Ketiga", "Keempat", "Tidak tercantum"],
            answer: "D",
            explanation: "Tujuan negara Indonesia tercantum dalam Pembukaan UUD 1945 alinea keempat."
        }
    ]
};

function loadQuestions(subject) {
    return questionBank[subject] || [];
}
