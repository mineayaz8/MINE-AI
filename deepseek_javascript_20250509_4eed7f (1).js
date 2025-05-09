// Emotion state
const emotions = {
    joy: 0.5,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    neutral: 0.5
};

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const avatar = document.getElementById('avatar');
const emotionGraph = document.getElementById('emotion-graph');

// Animation frames for different emotions
const animations = {
    joy: ["(^_^)", "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧", "✧◝(⁰▿⁰)◜✧"],
    sadness: ["(´･_･`)", "(╥﹏╥)", "(っ˘̩╭╮˘̩)っ"],
    anger: ["(╬ Ò﹏Ó)", "ಠ_ಠ", "(ﾒ` ﾛ ´)︻デ═一"],
    neutral: ["(•_•)", "( •_•)>⌐■-■", "(⌐■_■)"]
};

// Initialize the chat
function initChat() {
    addMessage("AI", "Hello! I'm your emotional AI assistant. How can I help you today?", "neutral");
    updateEmotionGraph();
}

// Add message to chat
function addMessage(sender, text, emotion) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(`${sender.toLowerCase()}-message`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Animate avatar
    animateAvatar(emotion);
}

// Simulate emotion detection from text
function detectEmotion(text) {
    const positiveWords = ["happy", "joy", "love", "great", "wonderful"];
    const negativeWords = ["sad", "angry", "hate", "bad", "terrible"];
    
    let emotion = "neutral";
    let score = 0.5;
    
    if (positiveWords.some(word => text.toLowerCase().includes(word))) {
        emotion = "joy";
        score = 0.8;
    } else if (negativeWords.some(word => text.toLowerCase().includes(word))) {
        emotion = text.toLowerCase().includes("sad") ? "sadness" : "anger";
        score = 0.7;
    }
    
    return { emotion, score };
}

// Update emotional state
function updateEmotionalState(detectedEmotion) {
    // Decay existing emotions
    for (const emotion in emotions) {
        emotions[emotion] *= 0.8;
    }
    
    // Update with new emotion
    emotions[detectedEmotion.emotion] += detectedEmotion.score * 0.5;
    
    // Normalize
    const total = Object.values(emotions).reduce((sum, val) => sum + val, 0);
    for (const emotion in emotions) {
        emotions[emotion] /= total;
    }
    
    updateEmotionGraph();
}

// Animate avatar
function animateAvatar(emotion) {
    const frames = animations[emotion] || animations.neutral;
    let frameIndex = 0;
    
    const animationInterval = setInterval(() => {
        avatar.textContent = frames[frameIndex];
        frameIndex = (frameIndex + 1) % frames.length;
    }, 500);
    
    setTimeout(() => clearInterval(animationInterval), 3000);
}

// Update emotion graph visualization
function updateEmotionGraph() {
    emotionGraph.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.width = emotionGraph.offsetWidth - 20;
    canvas.height = emotionGraph.offsetHeight - 20;
    emotionGraph.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const colors = {
        joy: '#FFD700',
        sadness: '#1E90FF',
        anger: '#FF4500',
        fear: '#9932CC',
        surprise: '#FFA500',
        neutral: '#808080'
    };
    
    const barWidth = canvas.width / Object.keys(emotions).length;
    let x = 0;
    
    for (const [emotion, value] of Object.entries(emotions)) {
        const height = value * (canvas.height - 30);
        ctx.fillStyle = colors[emotion];
        ctx.fillRect(x, canvas.height - height, barWidth - 5, height);
        
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText(emotion, x, canvas.height - 5);
        
        x += barWidth;
    }
}

// Generate AI response
function generateAIResponse(userMessage) {
    // Simple response logic - replace with actual AI API call
    const responses = {
        greeting: ["Hello!", "Hi there!", "Greetings!"],
        question: ["That's an interesting question.", "Let me think about that...", "I'm not entirely sure."],
        default: ["I understand.", "Tell me more.", "That's fascinating."]
    };
    
    const userText = userMessage.toLowerCase();
    let responseType = "default";
    
    if (userText.includes("hello") || userText.includes("hi")) {
        responseType = "greeting";
    } else if (userText.includes("?") || 
               userText.includes("what") || 
               userText.includes("how")) {
        responseType = "question";
    }
    
    const possibleResponses = responses[responseType];
    return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
}

// Handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    if (message) {
        addMessage("User", message, "neutral");
        
        // Detect emotion from user input
        const detectedEmotion = detectEmotion(message);
        updateEmotionalState(detectedEmotion);
        
        // Generate and display AI response
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            const dominantEmotion = Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            addMessage("AI", aiResponse, dominantEmotion);
        }, 1000);
        
        userInput.value = '';
    }
}

// Event listeners
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
});

// Initialize chat
initChat();