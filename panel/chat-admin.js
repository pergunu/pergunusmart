/**
 * Chat Admin Interface
 * Provides WhatsApp-like chat functionality for admin communication
 */

class ChatAdmin {
  constructor() {
    this.initChatContainer();
    this.setupEventListeners();
  }

  // Update the initChatContainer method in ChatAdmin class
// Updated initChatContainer method with proper colors
initChatContainer() {
    if (document.getElementById('chatAdminContainer')) return;

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatAdminContainer';
    chatContainer.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        max-height: 500px;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
        overflow: hidden;
        font-family: 'Poppins', sans-serif;
        color: #333333;  /* Dark text for readability */
    `;

    chatContainer.innerHTML = `
        <div class="chat-header" style="background: linear-gradient(45deg, #25D366, #128C7E); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 16px; color: white;">Chat Admin</h3>
            <button id="closeChat" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
        </div>
        <div id="chatMessages" style="height: 300px; overflow-y: auto; padding: 15px; background: #f5f5f5; color: #333333;">
            <!-- Messages will appear here -->
        </div>
        <div class="chat-input" style="padding: 15px; background: white; border-top: 1px solid #eee;">
            <textarea id="chatMessageInput" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; resize: none; font-family: inherit; color: #333333;" placeholder="Ketik pesan Anda..."></textarea>
            <button id="sendChatMessage" style="background: #25D366; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-top: 10px; cursor: pointer; font-family: inherit;">Kirim</button>
        </div>
    `;

    document.body.appendChild(chatContainer);
}
  setupEventListeners() {
    // Toggle chat visibility
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => this.toggleChat());
    }

    // Close chat
    const closeChat = document.getElementById('closeChat');
    if (closeChat) {
      closeChat.addEventListener('click', () => this.hideChat());
    }

    // Send message
    const sendBtn = document.getElementById('sendChatMessage');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }

    // Handle Enter key in textarea
    const messageInput = document.getElementById('chatMessageInput');
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
  }

  toggleChat() {
    const chat = document.getElementById('chatAdminContainer');
    if (chat) {
      chat.style.display = chat.style.display === 'none' ? 'block' : 'none';
      if (chat.style.display === 'block') {
        document.getElementById('chatMessageInput')?.focus();
      }
    }
  }

  hideChat() {
    const chat = document.getElementById('chatAdminContainer');
    if (chat) chat.style.display = 'none';
  }

  sendMessage() {
    const input = document.getElementById('chatMessageInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    // Add user message
    this.addMessage(message, 'user');

    // Clear input
    input.value = '';
    
    // Simulate admin reply
    setTimeout(() => {
      this.addAdminReply();
    }, 1500);
  }

  addMessage(message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 7.5px;
      max-width: 80%;
      clear: both;
      word-wrap: break-word;
    `;

    if (type === 'user') {
      messageElement.style.cssText += `
        float: right;
        background: #DCF8C6;
      `;
    } else {
      messageElement.style.cssText += `
        float: left;
        background: white;
        border: 1px solid #eee;
      `;
    }

    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  addAdminReply() {
    const replies = [
      "Terima kasih atas pesan yang Anda kirimkan, Saat ini admin belum dapat membalas langsung melalui form chat ini.",
      "Namun, Anda tetap bisa menghubungi kami melalui salah satu cara berikut : ketik oke",
      "Kirim Email: pergunusitubondop@gmail.com atau Chat WhatsApp: 085647709114",
      "Kami akan segera merespons pesan Anda secepat mungkin, Terima kasih atas pengertian dan kesabaran Anda."
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    this.addMessage(randomReply, 'admin');
  }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.chatAdmin = new ChatAdmin();
});
