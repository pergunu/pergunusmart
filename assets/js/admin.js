// Admin-specific JavaScript functions
document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings from localStorage
    loadSettings();
    
    // Handle form submissions
    document.querySelectorAll('.admin-section form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
            alert('Pengaturan berhasil disimpan!');
        });
    });
});

function loadSettings() {
    // Load timer setting
    const savedTimer = localStorage.getItem('examTimer');
    if (savedTimer) {
        document.getElementById('examTimer').value = savedTimer;
    }
    
    // Load chairman name
    const savedChairman = localStorage.getItem('chairmanName');
    if (savedChairman) {
        document.getElementById('chairmanName').value = savedChairman;
    }
    
    // Load motivation messages
    const savedMotivations = localStorage.getItem('motivationMessages');
    if (savedMotivations) {
        document.getElementById('motivationMessages').value = savedMotivations;
    }
    
    // Load opening text
    const savedOpening = localStorage.getItem('openingText');
    if (savedOpening) {
        document.getElementById('openingText').value = savedOpening;
    }
    
    // Load info text
    const savedInfo = localStorage.getItem('infoText');
    if (savedInfo) {
        document.getElementById('infoText').value = savedInfo;
    }
}

function saveSettings() {
    // Save timer setting
    localStorage.setItem('examTimer', document.getElementById('examTimer').value);
    
    // Save chairman name
    localStorage.setItem('chairmanName', document.getElementById('chairmanName').value);
    
    // Save motivation messages
    localStorage.setItem('motivationMessages', document.getElementById('motivationMessages').value);
    
    // Save opening text
    localStorage.setItem('openingText', document.getElementById('openingText').value);
    
    // Save info text
    localStorage.setItem('infoText', document.getElementById('infoText').value);
}
