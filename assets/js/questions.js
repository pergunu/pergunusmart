// PERGUNU SMART - FINAL QUESTIONS.JS
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
      },
      {
        id: 3,
        text: "Apa nama kitab suci yang diturunkan kepada Nabi Muhammad SAW?",
        options: ["Taurat", "Zabur", "Injil", "Al-Qur'an", "Shuhuf"],
        correctAnswer: "D",
        explanation: "Al-Qur'an adalah kitab suci yang diturunkan kepada Nabi Muhammad SAW sebagai penyempurna kitab-kitab sebelumnya."
      }
    ],
    smp: [
      {
        id: 101,
        text: "Apa hukum melaksanakan shalat Jum'at bagi laki-laki muslim?",
        options: ["Sunnah", "Wajib", "Mubah", "Makruh", "Haram"],
        correctAnswer: "B",
        explanation: "Shalat Jum'at hukumnya wajib bagi laki-laki muslim yang sudah baligh dan berakal."
      },
      {
        id: 102,
        text: "Berapa jumlah ayat dalam surat Al-Fatihah?",
        options: ["5", "6", "7", "8", "9"],
        correctAnswer: "C",
        explanation: "Surat Al-Fatihah terdiri dari 7 ayat dan merupakan surat pembuka dalam Al-Qur'an."
      }
    ],
    sma: [
      {
        id: 201,
        text: "Apa nama ilmu yang mempelajari tentang cara membaca Al-Qur'an dengan benar?",
        options: ["Fiqih", "Tauhid", "Tajwid", "Tafsir", "Hadits"],
        correctAnswer: "C",
        explanation: "Ilmu Tajwid adalah ilmu yang mempelajari tentang cara membaca Al-Qur'an dengan benar sesuai dengan makhraj dan sifat huruf."
      }
    ]
  },
  ppkn: {
    sd: [
      {
        id: 301,
        text: "Pancasila sebagai dasar negara tercantum dalam pembukaan UUD 1945 alinea ke...",
        options: ["1", "2", "3", "4", "Tidak ada yang benar"],
        correctAnswer: "D",
        explanation: "Pancasila sebagai dasar negara tercantum dalam alinea ke-4 Pembukaan UUD 1945."
      }
    ],
    smp: [
      {
        id: 401,
        text: "Lambang negara Indonesia adalah...",
        options: ["Garuda", "Harimau", "Elang", "Rajawali", "Merpati"],
        correctAnswer: "A",
        explanation: "Garuda Pancasila adalah lambang negara Indonesia yang diresmikan pemakaiannya pada 11 Februari 1950."
      }
    ],
    sma: [
      {
        id: 501,
        text: "BPUPKI dibentuk pada tanggal...",
        options: ["1 Maret 1945", "29 April 1945", "1 Juni 1945", "22 Juni 1945", "17 Agustus 1945"],
        correctAnswer: "A",
        explanation: "BPUPKI (Badan Penyelidik Usaha-usaha Persiapan Kemerdekaan Indonesia) dibentuk pada 1 Maret 1945."
      }
    ]
  },
  matematika: {
    sd: [
      {
        id: 601,
        text: "Hasil dari 25 + 37 adalah...",
        options: ["52", "53", "62", "63", "72"],
        correctAnswer: "C",
        explanation: "25 + 37 = 62. Penjumlahan dilakukan dengan menambahkan satuan (5+7=12, tulis 2 simpan 1) kemudian puluhan (2+3=5 plus simpanan 1 menjadi 6)."
      }
    ],
    smp: [
      {
        id: 701,
        text: "Nilai dari 3² + 4² adalah...",
        options: ["5", "7", "12", "25", "49"],
        correctAnswer: "D",
        explanation: "3² = 9 dan 4² = 16. Jadi 9 + 16 = 25."
      }
    ],
    sma: [
      {
        id: 801,
        text: "Turunan pertama dari f(x) = 3x² + 2x - 5 adalah...",
        options: ["3x + 2", "6x + 2", "6x - 5", "3x² + 2", "6x² + 2x"],
        correctAnswer: "B",
        explanation: "Turunan dari 3x² adalah 6x, turunan dari 2x adalah 2, dan turunan dari konstanta (-5) adalah 0. Jadi f'(x) = 6x + 2."
      }
    ]
  },
  logika: [
    {
      id: 901,
      text: "Jika semua A adalah B dan semua B adalah C, maka...",
      options: [
        "Semua A adalah C",
        "Semua C adalah A",
        "Beberapa A bukan C",
        "Beberapa C bukan B",
        "Tidak dapat disimpulkan"
      ],
      correctAnswer: "A",
      explanation: "Ini adalah contoh silogisme. Jika semua A adalah B dan semua B adalah C, maka pasti semua A adalah C."
    },
    {
      id: 902,
      text: "A, B, C, D, E, F, G. Huruf apakah yang berikutnya?",
      options: ["H", "I", "J", "K", "L"],
      correctAnswer: "A",
      explanation: "Ini adalah deret huruf alfabet yang berurutan, sehingga setelah G adalah H."
    }
  ],
  cpns: [
    {
      id: 1001,
      text: "Menurut UUD 1945, kekuasaan yudikatif dilaksanakan oleh...",
      options: [
        "Presiden",
        "DPR",
        "Mahkamah Agung",
        "BPK",
        "Komisi Yudisial"
      ],
      correctAnswer: "C",
      explanation: "Kekuasaan yudikatif menurut UUD 1945 dilaksanakan oleh Mahkamah Agung dan badan peradilan di bawahnya."
    },
    {
      id: 1002,
      text: "Asas pemilihan umum di Indonesia adalah...",
      options: [
        "Langsung, umum, bebas, rahasia, jujur, dan adil",
        "Langsung, umum, bebas, terbuka, jujur, dan adil",
        "Langsung, umum, bebas, rahasia, transparan, dan adil",
        "Tidak langsung, umum, bebas, rahasia, jujur, dan adil",
        "Langsung, terbatas, bebas, rahasia, jujur, dan adil"
      ],
      correctAnswer: "A",
      explanation: "Asas pemilu di Indonesia adalah Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil (LUBER JURDIL)."
    }
  ]
};

/**
 * Get questions by category and level
 * @param {string} category - The question category (e.g., 'agama', 'ppkn')
 * @param {string|null} level - The education level (e.g., 'sd', 'smp', 'sma')
 * @returns {Array} - Array of questions
 */
function getQuestions(category, level = null) {
  try {
    // Validate input
    if (!category || typeof category !== 'string') {
      throw new Error('Invalid category parameter');
    }

    // Get questions based on category and level
    if (level) {
      // For categorized questions (agama, ppkn, etc.)
      if (questionBank[category] && questionBank[category][level]) {
        return [...questionBank[category][level]]; // Return a copy to prevent modification
      }
      return [];
    } else {
      // For uncategorized questions (logika, cpns)
      if (questionBank[category]) {
        return [...questionBank[category]]; // Return a copy to prevent modification
      }
      return [];
    }
  } catch (error) {
    console.error('Error getting questions:', error);
    return [];
  }
}

/**
 * Get all available categories
 * @returns {Array} - Array of category names
 */
function getCategories() {
  return Object.keys(questionBank);
}

/**
 * Get levels available for a specific category
 * @param {string} category - The question category
 * @returns {Array|null} - Array of levels or null if uncategorized
 */
function getLevels(category) {
  if (!category || !questionBank[category]) return null;
  
  // Check if category has levels (sd, smp, sma)
  if (questionBank[category].sd) {
    return Object.keys(questionBank[category]);
  }
  
  return null;
}

/**
 * Get question by ID
 * @param {number} id - The question ID
 * @returns {Object|null} - The question object or null if not found
 */
function getQuestionById(id) {
  try {
    // Search through all categories and levels
    for (const category of getCategories()) {
      const levels = getLevels(category);
      
      if (levels) {
        // For categorized questions
        for (const level of levels) {
          const question = questionBank[category][level].find(q => q.id === id);
          if (question) return question;
        }
      } else {
        // For uncategorized questions
        const question = questionBank[category].find(q => q.id === id);
        if (question) return question;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting question by ID:', error);
    return null;
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getQuestions,
    getCategories,
    getLevels,
    getQuestionById,
    questionBank // For testing purposes only
  };
}
