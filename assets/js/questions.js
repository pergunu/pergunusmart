// This file would contain the actual questions for the exam
// In a real application, this would likely come from a database

const questionBank = {
    agama: {
        sd: [
            {
                id: 1,
                text: "Berapa jumlah Rukun Islam?",
                options: ["3", "4", "5", "6", "7"],
                correctAnswer: "C",
                explanation: "Rukun Islam ada 5 yaitu: Syahadat, Shalat, Zakat, Puasa, dan Haji."
            },
            {
                id: 2,
                text: "Siapakah malaikat yang bertugas menyampaikan wahyu?",
                options: ["Mikail", "Israfil", "Izrail", "Jibril", "Ridwan"],
                correctAnswer: "D",
                explanation: "Malaikat Jibril bertugas menyampaikan wahyu dari Allah kepada para nabi dan rasul."
            }
            // Add more questions...
        ],
        smp: [
            // SMP level questions...
        ],
        sma: [
            // SMA level questions...
        ]
    },
    ppkn: {
        sd: [
            // PPKN questions for SD...
        ],
        smp: [
            // PPKN questions for SMP...
        ],
        sma: [
            // PPKN questions for SMA...
        ]
    },
    // Add more subjects...
    
    logika: [
        // Logic test questions...
    ],
    
    cpns: [
        // CPNS test questions...
    ]
};

// Function to get questions by category and level
function getQuestions(category, level = null) {
    if (level) {
        return questionBank[category][level] || [];
    } else {
        return questionBank[category] || [];
    }
}
