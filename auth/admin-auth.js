// Admin Authentication Module
const AdminAuth = {
    // Default admin credentials
    adminCredentials: {
        username: "admin",
        password: "65614222" // Default admin password
    },

    // Initialize admin auth
    init: function() {
        this.loadCredentials();
        this.setupEventListeners();
    },

    // Load credentials from localStorage
    loadCredentials: function() {
        const savedCredentials = localStorage.getItem('adminCredentials');
        if (savedCredentials) {
            this.adminCredentials = JSON.parse(savedCredentials);
        }
    },

    // Save credentials to localStorage
    saveCredentials: function() {
        localStorage.setItem('adminCredentials', JSON.stringify(this.adminCredentials));
    },

    // Setup event listeners for admin panel
    setupEventListeners: function() {
        // For admin login form
        if (document.getElementById('adminLoginForm')) {
            document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdminLogin();
            });
        }

        // For password change form
        if (document.getElementById('changePasswordForm')) {
            document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePasswordChange();
            });
        }
    },

    // Handle admin login
    handleAdminLogin: function() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            // Successful login
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = '../panel/admin.html';
        } else {
            alert('Username atau password salah');
        }
    },

    // Handle password change
    handlePasswordChange: function() {
        const currentPassword = document.getElementById('currentAdminPassword').value;
        const newPassword = document.getElementById('newAdminPassword').value;
        const confirmPassword = document.getElementById('confirmAdminPassword').value;

        if (currentPassword !== this.adminCredentials.password) {
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

        // Update password
        this.adminCredentials.password = newPassword;
        this.saveCredentials();
        alert('Password admin berhasil diubah');
        document.getElementById('changePasswordForm').reset();
    },

    // Check if admin is logged in
    isLoggedIn: function() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    },

    // Protect admin routes
    protectAdminRoutes: function() {
        if (window.location.pathname.includes('/panel/') && !this.isLoggedIn()) {
            window.location.href = '../auth/admin-login.html';
        }
    },

    // Logout admin
    logout: function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = '../index.html';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AdminAuth.init();
    
    // Check if we're on an admin page
    if (window.location.pathname.includes('/panel/')) {
        AdminAuth.protectAdminRoutes();
    }
    
    // Add logout functionality if logout button exists
    if (document.getElementById('adminLogoutBtn')) {
        document.getElementById('adminLogoutBtn').addEventListener('click', function() {
            AdminAuth.logout();
        });
    }
});

// Export for Node.js environment (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminAuth;
}
