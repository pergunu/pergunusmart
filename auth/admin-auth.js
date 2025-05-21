/**
 * Admin Authentication System
 * Handles admin login, session management, and password changes
 */

class AdminAuth {
  constructor() {
    this.credentials = {
      username: "admin",
      password: "65614222" // Default admin password
    };
    this.loadCredentials();
    this.initEventListeners();
    this.protectRoutes();
  }

  loadCredentials() {
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      this.credentials = JSON.parse(savedCredentials);
    }
  }

  saveCredentials() {
    localStorage.setItem('adminCredentials', JSON.stringify(this.credentials));
  }

  initEventListeners() {
    // Admin login form
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Password change form
    const changePassForm = document.getElementById('changePasswordForm');
    if (changePassForm) {
      changePassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handlePasswordChange();
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  handleLogin() {
    const username = document.getElementById('adminUsername')?.value;
    const password = document.getElementById('adminPassword')?.value;

    if (username === this.credentials.username && password === this.credentials.password) {
      // Successful login
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = '../panel/admin.html';
    } else {
      alert('Username atau password salah');
    }
  }

  handlePasswordChange() {
    const currentPassword = document.getElementById('currentAdminPassword')?.value;
    const newPassword = document.getElementById('newAdminPassword')?.value;
    const confirmPassword = document.getElementById('confirmAdminPassword')?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Semua field harus diisi');
      return;
    }

    if (currentPassword !== this.credentials.password) {
      alert('Password saat ini salah');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password baru harus minimal 8 karakter');
      return;
    }

    this.credentials.password = newPassword;
    this.saveCredentials();
    alert('Password admin berhasil diubah');
    
    // Reset form
    const form = document.getElementById('changePasswordForm');
    if (form) form.reset();
  }

  isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }

  protectRoutes() {
    if (window.location.pathname.includes('/panel/') && !this.isLoggedIn()) {
      window.location.href = '../auth/admin-login.html';
    }
  }

  logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '../index.html';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminAuth = new AdminAuth();
});
