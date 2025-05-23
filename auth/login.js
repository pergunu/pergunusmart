// Login Module
const LoginSystem = {
    // Default login code
    loginCode: "12345",
    
    // Initialize login system
    init: function() {
        this.loadSettings();
        this.setupEventListeners();
    },
    
    // Load settings from localStorage
    loadSettings: function() {
        const savedCode = localStorage.getItem('loginCode');
        if (savedCode) {
            this.loginCode = savedCode;
        }
    },
    
    // Save settings to localStorage
    saveSettings: function() {
        localStorage.setItem('loginCode', this.loginCode);
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // For main login form
        if (document.getElementById('loginBtn')) {
            document.getElementById('loginBtn').addEventListener('click', () => this.handleLogin());
        }
        
        // For admin code change
        if (document.getElementById('saveLoginCode')) {
            document.getElementById('saveLoginCode').addEventListener('click', () => this.handleCodeChange());
        }
    },
    
    // Handle login attempt
    handleLogin: function() {
        const enteredCode = document.getElementById('loginCode').value;
        
        if (enteredCode === this.loginCode) {
            // Successful login - proceed to terms screen
            document.getElementById('openingScreen').style.display = 'none';
            document.getElementById('termsScreen').style.display = 'flex';
        } else {
            alert('Kode login salah. Silakan coba lagi.');
            document.getElementById('loginCode').value = '';
            document.getElementById('loginCode').focus();
        }
    },
    
    // Handle code change in admin panel
    handleCodeChange: function() {
        const newCode = document.getElementById('newLoginCode').value;
        const currentCode = document.getElementById('currentLoginCode').value;
        
        if (!newCode || !currentCode) {
            alert('Kode baru dan kode saat ini harus diisi');
            return;
        }
        
        if (currentCode !== this.loginCode) {
            alert('Kode saat ini salah');
            return;
        }
        
        if (newCode.length < 4) {
            alert('Kode login harus minimal 4 digit');
            return;
        }
        
        // Update code
        this.loginCode = newCode;
        this.saveSettings();
        
        // Update UI
        document.getElementById('currentLoginCode').value = newCode;
        document.getElementById('newLoginCode').value = '';
        
        alert('Kode login berhasil diperbarui');
    },
    
    // Validate participant form
    validateParticipantForm: function() {
        const form = document.getElementById('participantDataForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        // Additional validation for specific fields
        const studentId = document.getElementById('studentId');
        if (studentId && studentId.value && isNaN(studentId.value)) {
            alert('NIS harus berupa angka');
            studentId.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        const whatsapp = document.getElementById('whatsapp');
        if (whatsapp && whatsapp.value && isNaN(whatsapp.value)) {
            alert('Nomor WhatsApp harus berupa angka');
            whatsapp.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        const email = document.getElementById('email');
        if (email && email.value && !this.validateEmail(email.value)) {
            alert('Masukkan alamat email yang valid');
            email.style.borderColor = '#e74c3c';
            isValid = false;
        }
        
        return isValid;
    },
    
    // Validate email format
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    LoginSystem.init();
    
    // Add validation to participant form
    if (document.getElementById('participantDataForm')) {
        document.getElementById('participantDataForm').addEventListener('submit', function(e) {
            if (!LoginSystem.validateParticipantForm()) {
                e.preventDefault();
            }
        });
    }
});

// Export for Node.js environment (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginSystem;
}
