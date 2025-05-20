// Authentication Functions
function checkLoginCode(code) {
    const settings = getExamSettings();
    return code === settings.loginCode || code === '12345'; // Default code
}

function checkAdminCode(code) {
    const settings = getExamSettings();
    return code === settings.adminCode || code === '65614222'; // Default code
}

function checkBankCode(code) {
    const settings = getExamSettings();
    return code === settings.bankCode || code === 'OPENLOCK-1926'; // Default code
}

function checkCPNSCode(code) {
    const settings = getExamSettings();
    return code === settings.cpnsCode || code === 'OPENLOCK-1926'; // Default code
}

function saveLoginCode(code) {
    const settings = getExamSettings();
    settings.loginCode = code;
    saveExamSettings(settings);
}

function saveAdminCode(code) {
    const settings = getExamSettings();
    settings.adminCode = code;
    saveExamSettings(settings);
}

function saveBankCode(code) {
    const settings = getExamSettings();
    settings.bankCode = code;
    saveExamSettings(settings);
}

function saveCPNSCode(code) {
    const settings = getExamSettings();
    settings.cpnsCode = code;
    saveExamSettings(settings);
}

function isAuthenticated(type) {
    switch (type) {
        case 'admin':
            return localStorage.getItem('adminAuthenticated') === 'true';
        case 'bank':
            return localStorage.getItem('bankAuthenticated') === 'true';
        default:
            return false;
    }
}

function setAuthenticated(type, value) {
    switch (type) {
        case 'admin':
            localStorage.setItem('adminAuthenticated', value.toString());
            break;
        case 'bank':
            localStorage.setItem('bankAuthenticated', value.toString());
            break;
    }
}

function logout(type) {
    setAuthenticated(type, false);
    window.location.reload();
}

function requireAuth(type, redirect = 'index.html') {
    if (!isAuthenticated(type)) {
        window.location.href = redirect;
    }
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}

function generateStrongPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

function validatePasswordStrength(password) {
    // At least 8 characters
    if (password.length < 8) return false;
    
    // At least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    
    // At least one number
    if (!/[0-9]/.test(password)) return false;
    
    // At least one special character
    if (!/[^a-zA-Z0-9]/.test(password)) return false;
    
    return true;
}

function encryptData(data, key) {
    // Simple XOR encryption (not secure for production)
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

function decryptData(data, key) {
    // XOR decryption
    return encryptData(data, key); // XOR is symmetric
}

function generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return otp;
}

function validateOTP(otp, storedOTP) {
    return otp === storedOTP;
}

function generateSessionToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function setSessionToken(token) {
    sessionStorage.setItem('sessionToken', token);
}

function getSessionToken() {
    return sessionStorage.getItem('sessionToken');
}

function clearSessionToken() {
    sessionStorage.removeItem('sessionToken');
}

function setRememberMeToken(token) {
    localStorage.setItem('rememberMeToken', token);
}

function getRememberMeToken() {
    return localStorage.getItem('rememberMeToken');
}

function clearRememberMeToken() {
    localStorage.removeItem('rememberMeToken');
}

function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

function clearUserData() {
    sessionStorage.removeItem('userData');
}

function setPersistentUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

function getPersistentUserData() {
    return JSON.parse(localStorage.getItem('userData'));
}

function clearPersistentUserData() {
    localStorage.removeItem('userData');
}

function clearAllAuthData() {
    clearSessionToken();
    clearRememberMeToken();
    clearUserData();
    clearPersistentUserData();
}

function checkPermission(permission, user) {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
}

function hasRole(role, user) {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
}

function isAdmin(user) {
    return hasRole('admin', user);
}

function isModerator(user) {
    return hasRole('moderator', user);
}

function isUser(user) {
    return hasRole('user', user);
}

function isGuest(user) {
    return !user || hasRole('guest', user);
}

function getAuthHeaders() {
    const token = getSessionToken() || getRememberMeToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

function fakeAuthRequest(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'admin123') {
                resolve({
                    success: true,
                    token: generateSessionToken(),
                    user: {
                        id: 1,
                        username: 'admin',
                        email: 'admin@example.com',
                        roles: ['admin'],
                        permissions: ['read', 'write', 'delete']
                    }
                });
            } else if (username === 'user' && password === 'user123') {
                resolve({
                    success: true,
                    token: generateSessionToken(),
                    user: {
                        id: 2,
                        username: 'user',
                        email: 'user@example.com',
                        roles: ['user'],
                        permissions: ['read']
                    }
                });
            } else {
                reject({
                    success: false,
                    message: 'Invalid username or password'
                });
            }
        }, 1000);
    });
}

function fakeTokenCheck(token) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token && token.length === 36) { // UUID length
                resolve({
                    success: true,
                    user: {
                        id: token.includes('a') ? 1 : 2,
                        username: token.includes('a') ? 'admin' : 'user',
                        email: token.includes('a') ? 'admin@example.com' : 'user@example.com',
                        roles: token.includes('a') ? ['admin'] : ['user'],
                        permissions: token.includes('a') ? ['read', 'write', 'delete'] : ['read']
                    }
                });
            } else {
                reject({
                    success: false,
                    message: 'Invalid token'
                });
            }
        }, 500);
    });
}

function fakeLogout() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });
}

function setupAuthInterceptors() {
    // This would be used with fetch or axios to intercept requests
    // and add auth headers or handle 401 responses
    console.log('Auth interceptors setup');
}

function initAuth() {
    // Check for remember me token on page load
    const rememberMeToken = getRememberMeToken();
    if (rememberMeToken) {
        fakeTokenCheck(rememberMeToken)
            .then(response => {
                setSessionToken(response.token);
                setUserData(response.user);
            })
            .catch(() => {
                clearRememberMeToken();
            });
    }
}

// Initialize auth when script loads
initAuth();
