/**
 * Login System for PERGUNU Exam Platform
 * Handles participant login and code verification
 */

class LoginSystem {
  constructor() {
    this.loginCode = "12345"; // Default login code
    this.loadSettings();
    this.initEventListeners();
  }

  loadSettings() {
    const savedCode = localStorage.getItem('loginCode');
    if (savedCode) {
      this.loginCode = savedCode;
    }
  }

  saveSettings() {
    localStorage.setItem('loginCode', this.loginCode);
  }

  initEventListeners() {
    // Main login form
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.handleLogin());
    }

    // Admin code change
    const saveLoginCodeBtn = document.getElementById('saveLoginCode');
    if (saveLoginCodeBtn) {
      saveLoginCodeBtn.addEventListener('click', () => this.handleCodeChange());
    }

    // Participant form validation
    const participantForm = document.getElementById('participantDataForm');
    if (participantForm) {
      participantForm.addEventListener('submit', (e) => {
        if (!this.validateParticipantForm()) {
          e.preventDefault();
        }
      });
    }
  }

  handleLogin() {
    const enteredCode = document.getElementById('loginCode')?.value;
    if (!enteredCode) return;

    if (enteredCode === this.loginCode) {
      // Successful login
      document.getElementById('openingScreen').style.display = 'none';
      document.getElementById('termsScreen').style.display = 'flex';
    } else {
      alert('Kode login salah. Silakan coba lagi.');
      const codeInput = document.getElementById('loginCode');
      if (codeInput) {
        codeInput.value = '';
        codeInput.focus();
      }
    }
  }

  handleCodeChange() {
    const newCode = document.getElementById('newLoginCode')?.value;
    const currentCode = document.getElementById('currentLoginCode')?.value;

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

    this.loginCode = newCode;
    this.saveSettings();

    if (document.getElementById('currentLoginCode')) {
      document.getElementById('currentLoginCode').value = newCode;
      document.getElementById('newLoginCode').value = '';
    }

    alert('Kode login berhasil diperbarui');
  }

  validateParticipantForm() {
    const form = document.getElementById('participantDataForm');
    if (!form) return false;

    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    // Validate numeric fields
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

    // Validate email
    const email = document.getElementById('email');
    if (email && email.value && !this.validateEmail(email.value)) {
      alert('Masukkan alamat email yang valid');
      email.style.borderColor = '#e74c3c';
      isValid = false;
    }

    return isValid;
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.loginSystem = new LoginSystem();
});
