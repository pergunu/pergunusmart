// Form validation functions
document.addEventListener('DOMContentLoaded', function() {
    // Validate NIS (must be numeric)
    const nisInput = document.getElementById('nis');
    if (nisInput) {
        nisInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Validate WhatsApp number (must be numeric)
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Validate email format
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) {
                this.style.border = '1px solid red';
            } else {
                this.style.border = 'none';
            }
        });
    }
    
    // Validate school level selection
    const schoolLevel = document.getElementById('school-level');
    if (schoolLevel) {
        schoolLevel.addEventListener('change', function() {
            if (!this.value) {
                this.style.border = '1px solid red';
            } else {
                this.style.border = 'none';
            }
        });
    }
    
    // Validate purpose selection
    const studentPurpose = document.getElementById('student-purpose');
    if (studentPurpose) {
        studentPurpose.addEventListener('change', function() {
            if (!this.value) {
                this.style.border = '1px solid red';
            } else {
                this.style.border = 'none';
            }
        });
    }
    
    const generalPurpose = document.getElementById('general-purpose');
    if (generalPurpose) {
        generalPurpose.addEventListener('change', function() {
            if (!this.value) {
                this.style.border = '1px solid red';
            } else {
                this.style.border = 'none';
            }
        });
    }
});
