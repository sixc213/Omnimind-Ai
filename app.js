// app.js - OmniMind with Real Grok API Integration
let messages = [
    { 
        type: 'ai', 
        text: "Hello! I'm OmniMind, powered by Grok. How can I help make information more accessible for you today?" 
    }
];

let isVoiceEnabled = false;
let conversationHistory = [
    { role: "system", content: "You are OmniMind, a helpful accessibility-focused AI. Always prioritize clarity, simplicity, and inclusivity. Adapt your language for cognitive, physical, or sensory needs. Use plain language, offer to simplify further, and suggest alternatives like audio or visual aids." }
];

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
let GROK_API_KEY = ""; // ← User will fill this in

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    // Add to history
    conversationHistory.push({ role: "user", content: text });

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    const container = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'message ai';
    typingDiv.innerHTML = `<div class="message-bubble">Thinking<span class="dots">...</span></div>`;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;

    try {
        if (!GROK_API_KEY) {
            throw new Error("Please set your Grok API key first.");
        }

        const response = await fetch(GROK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({
                model: "grok-4.3",           // or "grok-3" depending on availability
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 800
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.choices[0].message.content;

        // Add to history
        conversationHistory.push({ role: "assistant", content: aiReply });

        // Remove typing indicator
        document.getElementById(typingId).remove();

        addMessage('ai', aiReply);

        // Voice output if enabled
        if (isVoiceEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(aiReply);
            utterance.rate = 0.95;
            speechSynthesis.speak(utterance);
        }

    } catch (error) {
        document.getElementById(typingId).remove();
        addMessage('ai', `⚠️ Error: ${error.message}. Make sure you have entered a valid Grok API key.`);
        console.error(error);
    }
}

function addMessage(type, text) {
    messages.push({ type, text });
    renderMessages();
}

function renderMessages() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';
    
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.type}`;
        div.innerHTML = `<div class="message-bubble">${msg.text}</div>`;
        container.appendChild(div);
    });
    
    container.scrollTop = container.scrollHeight;
}

function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const icon = document.querySelector('.voice-btn i');
    icon.classList.toggle('fa-microphone', !isVoiceEnabled);
    icon.classList.toggle('fa-microphone-slash', isVoiceEnabled);
    
    addMessage('ai', isVoiceEnabled ? 
        "✅ Voice input & output enabled. Speak naturally!" : 
        "🔇 Voice mode turned off.");
}

// Theme Toggle (same as before)
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    toggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

function startDemo() {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        document.getElementById('user-input').focus();
    }, 800);
}

// Add API Key input (temporary UI helper)
function addApiKeyInput() {
    const demoContainer = document.querySelector('.demo-container');
    const keyDiv = document.createElement('div');
    keyDiv.style.marginTop = '12px';
    keyDiv.style.fontSize = '0.85rem';
    keyDiv.innerHTML = `
        <input type="password" id="api-key-input" placeholder="Enter your Grok API key (xAI)" 
               style="width: 100%; padding: 8px; border-radius: 8px; background: #1e2a4a; color: white; border: 1px solid #00d4ff;">
        <button onclick="saveApiKey()" style="margin-top: 8px; padding: 6px 12px; background: #00d4ff; color: #0a0f1c; border: none; border-radius: 6px; cursor: pointer;">
            Save API Key
        </button>
        <small style="display:block; margin-top: 6px; color: #888;">Get key at <a href="https://console.x.ai" target="_blank">console.x.ai</a></small>
    `;
    demoContainer.appendChild(keyDiv);
}

function saveApiKey() {
    const keyInput = document.getElementById('api-key-input');
    GROK_API_KEY = keyInput.value.trim();
    if (GROK_API_KEY) {
        addMessage('ai', "✅ Grok API key saved! You can now have real conversations.");
        keyInput.value = '';
    }
}

// Initialize
window.onload = function() {
    renderMessages();
    initTheme();
    addApiKeyInput();   // Helper for easy key input
    console.log('%cOmniMind + Grok API Ready 🚀\nEnter your xAI API key to activate real AI.', 'color:#00d4ff; font-size:16px;');
};
