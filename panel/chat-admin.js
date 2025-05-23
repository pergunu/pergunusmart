document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat admin functionality
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatAdminContainer';
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '100px';
    chatContainer.style.right = '30px';
    chatContainer.style.width = '350px';
    chatContainer.style.maxHeight = '500px';
    chatContainer.style.backgroundColor = 'white';
    chatContainer.style.borderRadius = '10px';
    chatContainer.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    chatContainer.style.zIndex = '1000';
    chatContainer.style.display = 'none';
    chatContainer.style.overflow = 'hidden';
    
    chatContainer.innerHTML = `
        <div class="chat-header" style="background: linear-gradient(45deg, #25D366, #128C7E); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">Chat Admin</h3>
            <button id="closeChat" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
        </div>
        <div id="chatMessages" style="height: 300px; overflow-y: auto; padding: 15px; background: #f5f5f5;"></div>
        <div class="chat-input" style="padding: 15px; background: white; border-top: 1px solid #eee;">
            <textarea id="chatMessageInput" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: none;" placeholder="Ketik pesan Anda..."></textarea>
            <button id="sendChatMessage" style="background: #25D366; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer;">Kirim</button>
        </div>
    `;
    
    document.body.appendChild(chatContainer);
    
    // Toggle chat visibility
    document.getElementById('whatsappBtn').addEventListener('click', function() {
        const chat = document.getElementById('chatAdminContainer');
        chat.style.display = chat.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close chat
    document.getElementById('closeChat').addEventListener('click', function() {
        document.getElementById('chatAdminContainer').style.display = 'none';
    });
    
    // Send message
    document.getElementById('sendChatMessage').addEventListener('click', function() {
        const input = document.getElementById('chatMessageInput');
        const message = input.value.trim();
        
        if (message) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageElement = document.createElement('div');
            messageElement.style.marginBottom = '10px';
            messageElement.style.padding = '8px 12px';
            messageElement.style.backgroundColor = '#DCF8C6';
            messageElement.style.borderRadius = '7.5px';
            messageElement.style.maxWidth = '80%';
            messageElement.style.float = 'right';
            messageElement.style.clear = 'both';
            messageElement.textContent = message;
            
            messagesContainer.appendChild(messageElement);
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // In a real app, this would send to a server/WhatsApp API
            simulateAdminReply(messagesContainer);
        }
    });
    
    function simulateAdminReply(messagesContainer) {
        setTimeout(() => {
            const replies = [
                 "Terima kasih atas pesan yang Anda kirimkan, Saat ini admin belum dapat membalas langsung melalui form chat ini.",
                  "Namun, Anda tetap bisa menghubungi kami melalui salah satu cara berikut : ketik oke",
                  "Kirim Email: pergunusitubondop@gmail.com atau Chat WhatsApp: 085647709114",
                  "Kami akan segera merespons pesan Anda secepat mungkin, Terima kasih atas pengertian dan kesabaran Anda."
                ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyElement = document.createElement('div');
            replyElement.style.marginBottom = '10px';
            replyElement.style.padding = '8px 12px';
            replyElement.style.backgroundColor = 'white';
            replyElement.style.borderRadius = '7.5px';
            replyElement.style.maxWidth = '80%';
            replyElement.style.float = 'left';
            replyElement.style.clear = 'both';
            replyElement.style.border = '1px solid #eee';
            replyElement.textContent = randomReply;
            
            messagesContainer.appendChild(replyElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 2000);
    }
});
 
