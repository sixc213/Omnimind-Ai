// app.js
let messages = [
    { type: 'ai', text: "Hello! I'm OmniMind. How can I help make information more accessible for you today?" }
];

let isVoiceEnabled = false;

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

function addMessage(type, text) {
    messages.push({ type, text });
    renderMessages();
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';

    // Simulate real AI response with accessibility focus
    setTimeout(() => {
        let response = "Understood. How would you like me to adapt this?";
        
        const lower = text.toLowerCase();
        if (lower.includes('simple') || lower.includes('explain')) {
            response = "Here's a simplified version: I break down complex ideas into clear, short sentences with examples.";
        } else if (lower.includes('voice') || lower.includes('speak')) {
            response = "Voice mode activated. I can read responses aloud and accept spoken input.";
        } else if (lower.includes('dyslexia') || lower.includes('hard to read')) {
            response = "I can use dyslexia-friendly fonts, increased spacing, and audio narration.";
        }
        
        addMessage('ai', response);
        
        // Simulate speech if voice enabled
        if (isVoiceEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(response);
            speechSynthesis.speak(utterance);
        }
    }, 700);
}

function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const icon = document.querySelector('.voice-btn i');
    icon.classList.toggle('fa-microphone', !isVoiceEnabled);
    icon.classList.toggle('fa-microphone-slash', isVoiceEnabled);
    
    addMessage('ai', isVoiceEnabled ? 
        "Voice input & output enabled. Try speaking now!" : 
        "Voice mode turned off.");
}

// Theme Toggle
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
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
    setTimeout(() => document.getElementById('user-input').focus(), 800);
}

// Initialize everything
window.onload = function() {
    renderMessages();
    initTheme();
    console.log('%cOmniMind Professional Demo Loaded 🚀', 'color:#00d4ff; font-size:16px;');
};
