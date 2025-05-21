// Update the generateCertificate function in main.js
function generateCertificate(score) {
    const certificateContainer = document.getElementById('certificatePreview');
    certificateContainer.innerHTML = '';
    
    // Create certificate wrapper
    const certificateWrapper = document.createElement('div');
    certificateWrapper.className = 'certificate-wrapper no-print';
    certificateWrapper.style.background = 'white';
    certificateWrapper.style.padding = '20px';
    certificateWrapper.style.borderRadius = '10px';
    certificateWrapper.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    certificateWrapper.style.marginBottom = '30px';
    
    // Create certificate content
    const certificateContent = document.createElement('div');
    certificateContent.className = 'certificate-content';
    certificateContent.style.position = 'relative';
    certificateContent.style.textAlign = 'center';
    certificateContent.style.padding = '40px';
    certificateContent.style.maxWidth = '800px';
    certificateContent.style.margin = '0 auto';
    certificateContent.style.backgroundImage = 'url("../assets/images/certificate.png")';
    certificateContent.style.backgroundSize = 'cover';
    certificateContent.style.backgroundPosition = 'center';
    certificateContent.style.backgroundRepeat = 'no-repeat';
    
    // Generate certificate code
    const now = new Date();
    const dateStr = `${now.getDate()}${now.getMonth() + 1}${now.getFullYear()}`;
    const randomCode = generateRandomCode(8);
    const certificateCode = `${participantData.fullName.toUpperCase().replace(/ /g, '_')}/${
        participantData.status.toUpperCase()}/${
        participantData.schoolLevel ? participantData.schoolLevel.toUpperCase() : 'UMUM'}/${
        examType.toUpperCase()}/${
        dateStr}/${
        randomCode}/PERGUNU-STB`;
    
    // Get motivation text based on score
    const motivationText = getMotivationText(score);
    
    // Certificate content HTML
    certificateContent.innerHTML = `
        <div style="position: relative; z-index: 2;">
            <h2 class="certificate-title" style="font-size: 36px; font-weight: 700; color: #2c3e50; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px;">
                SERTIFIKAT PRESTASI
            </h2>
            
            <p class="certificate-recipient" style="font-size: 18px; color: #555; margin-bottom: 10px;">
                Diberikan Kepada
            </p>
            
            <h3 style="font-size: 28px; color: #2c3e50; margin-bottom: 40px; border-bottom: 2px solid #3498db; display: inline-block; padding-bottom: 10px;">
                ${formatName(participantData.fullName)}
            </h3>
            
            <p class="certificate-description" style="font-size: 18px; line-height: 1.6; color: #555; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">
                Atas Partisipasi & Pencapaian Luar Biasa dalam <strong style="color: #2c3e50;">Ujian Pergunu Situbondo</strong><br><br>
                Sebagai penghargaan atas dedikasi dalam memahami materi ujian dan mengasah logika, sertifikat ini diberikan sebagai motivasi untuk terus berkembang.
            </p>
            
            <div class="certificate-score" style="font-size: 72px; font-weight: 700; color: #8e44ad; margin: 30px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                ${score}
            </div>
            
            <p class="certificate-motivation" style="font-style: italic; color: #555; margin-bottom: 40px; font-size: 16px;">
                ${motivationText}
            </p>
            
            <div style="display: flex; justify-content: space-between; margin-top: 60px;">
                <div style="text-align: left;">
                    <p style="margin: 0; color: #555;">Periode: Ditetapkan di:</p>
                    <p style="margin: 0; font-weight: 600; color: #2c3e50;">Situbondo, ${formatDate(now)}</p>
                </div>
                
                <div style="text-align: right;">
                    <p style="margin: 0 0 40px 0; font-weight: 600; color: #2c3e50;">Ketua Pergunu Situbondo</p>
                    <p style="margin: 0; color: #555;">Moh. Nuril Hudha, S.Pd., M.Si.</p>
                </div>
            </div>
            
            <div class="certificate-barcode" style="margin-top: 40px; text-align: center;">
                <p style="font-family: monospace; letter-spacing: 1px; color: #555; margin-bottom: 10px;">${certificateCode}</p>
                <img src="../assets/images/BARCODE.png" alt="Barcode" style="height: 60px;">
            </div>
        </div>
    `;
    
    // Create score summary (not for printing)
    const scoreSummary = document.createElement('div');
    scoreSummary.className = 'score-summary no-print';
    scoreSummary.style.background = '#f9f9f9';
    scoreSummary.style.padding = '20px';
    scoreSummary.style.borderRadius = '8px';
    scoreSummary.style.marginTop = '30px';
    
    scoreSummary.innerHTML = `
        <h3 style="margin-top: 0; color: #2c3e50;">Detail Nilai Ujian</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div>
                <p style="margin: 0; color: #555;">Total Soal</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #2c3e50;">${allQuestions.length}</p>
            </div>
            <div>
                <p style="margin: 0; color: #555;">Jawaban Benar</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #27ae60;">${correctAnswers}</p>
            </div>
            <div>
                <p style="margin: 0; color: #555;">Jawaban Salah</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #e74c3c;">${wrongAnswers}</p>
            </div>
            <div>
                <p style="margin: 0; color: #555;">Tidak Dijawab</p>
                <p style="margin: 0; font-size: 24px; font-weight: 600; color: #f39c12;">${allQuestions.length - correctAnswers - wrongAnswers}</p>
            </div>
        </div>
    `;
    
    // Append elements
    certificateWrapper.appendChild(certificateContent);
    certificateWrapper.appendChild(scoreSummary);
    certificateContainer.appendChild(certificateWrapper);
    
    // Update print button functionality
    document.getElementById('printCertificateBtn').onclick = function() {
        // Hide elements before printing
        const elementsToHide = document.querySelectorAll('.no-print');
        elementsToHide.forEach(el => el.style.display = 'none');
        
        // Print only the certificate content
        const printContent = certificateContent.innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
                <div style="width: 210mm; height: 297mm; padding: 20mm;">
                    ${printContent}
                </div>
            </div>
        `;
        
        window.print();
        
        // Restore original content
        document.body.innerHTML = originalContent;
        elementsToHide.forEach(el => el.style.display = '');
    };
}
