// AI Life Coach 前端交互脚本
// 负责处理用户界面交互、消息发送接收和页面动态效果

// 全局变量定义
let isLoading = false; // 标记是否正在等待AI回复
let messageHistory = []; // 存储对话历史记录

// DOM元素引用
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const charCount = document.getElementById('charCount');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 应用初始化函数
function initializeApp() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 设置输入框焦点
    messageInput.focus();
    
    // 初始化对话历史
    initializeMessageHistory();
    
    console.log('AI Life Coach 应用已初始化');
}

// 绑定所有事件监听器
function bindEventListeners() {
    // 发送按钮点击事件
    sendButton.addEventListener('click', handleSendMessage);
    
    // 输入框键盘事件
    messageInput.addEventListener('keydown', handleKeyDown);
    messageInput.addEventListener('input', handleInputChange);
    
    // 输入框自动调整高度
    messageInput.addEventListener('input', autoResizeTextarea);
}

// 初始化消息历史记录
function initializeMessageHistory() {
    // 添加系统欢迎消息到历史记录
    messageHistory.push({
        role: 'assistant',
        content: '你好！我是你的AI生活教练。我会倾听你的想法，了解你的困惑，并为你提供个性化的建议和指导。无论是职业发展、人际关系、个人成长还是生活规划，我都会陪伴你一起探索和成长。请告诉我，今天有什么想要分享或讨论的吗？',
        timestamp: new Date().toISOString()
    });
}

// 处理键盘按键事件
function handleKeyDown(event) {
    // Enter键发送消息（Shift+Enter换行）
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
    }
}

// 处理输入内容变化
function handleInputChange() {
    const currentLength = messageInput.value.length;
    charCount.textContent = currentLength;
    
    // 字符数超限时的样式处理
    if (currentLength > 1000) {
        charCount.style.color = '#ff6b6b';
    } else if (currentLength > 800) {
        charCount.style.color = '#ffa726';
    } else {
        charCount.style.color = '#666';
    }
    
    // 控制发送按钮状态
    updateSendButtonState();
}

// 自动调整文本框高度
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// 更新发送按钮状态
function updateSendButtonState() {
    const hasContent = messageInput.value.trim().length > 0;
    const isValidLength = messageInput.value.length <= 1000;
    
    sendButton.disabled = !hasContent || !isValidLength || isLoading;
}

// 处理发送消息
async function handleSendMessage() {
    const message = messageInput.value.trim();
    
    // 验证消息内容
    if (!message || message.length > 1000 || isLoading) {
        return;
    }
    
    try {
        // 显示用户消息
        displayUserMessage(message);
        
        // 清空输入框
        clearInput();
        
        // 添加到历史记录
        messageHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
        
        // 显示加载状态
        showLoading();
        
        // 发送消息到后端
        const response = await sendMessageToAPI(message);
        
        // 隐藏加载状态
        hideLoading();
        
        // 显示AI回复
        if (response && response.content) {
            displayAIMessage(response.content);
            
            // 添加到历史记录
            messageHistory.push({
                role: 'assistant',
                content: response.content,
                timestamp: new Date().toISOString()
            });
        } else {
            throw new Error('AI回复格式错误');
        }
        
    } catch (error) {
        console.error('发送消息失败:', error);
        hideLoading();
        showError('发送消息失败，请稍后重试。错误信息：' + error.message);
    }
}

// 发送消息到API
async function sendMessageToAPI(message) {
    const requestBody = {
        message: message,
        history: messageHistory.slice(-10) // 只发送最近10条消息作为上下文
    };
    
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
}

// 显示用户消息
function displayUserMessage(message) {
    const messageElement = createMessageElement({
        content: message,
        isUser: true,
        timestamp: new Date()
    });
    
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

// 显示AI消息
function displayAIMessage(message) {
    const messageElement = createMessageElement({
        content: message,
        isUser: false,
        timestamp: new Date()
    });
    
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

// 创建消息元素
function createMessageElement({ content, isUser, timestamp }) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    const avatarIcon = document.createElement('span');
    avatarIcon.className = 'avatar-icon';
    avatarIcon.textContent = isUser ? '👤' : '🤖';
    avatarDiv.appendChild(avatarIcon);
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = content;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(timestamp);
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

// 格式化时间显示
function formatTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
        return '刚刚';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}小时前`;
    } else {
        return messageTime.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// 清空输入框
function clearInput() {
    messageInput.value = '';
    messageInput.style.height = 'auto';
    charCount.textContent = '0';
    charCount.style.color = '#666';
    updateSendButtonState();
    messageInput.focus();
}

// 显示加载状态
function showLoading() {
    isLoading = true;
    loadingIndicator.classList.add('show');
    updateSendButtonState();
}

// 隐藏加载状态
function hideLoading() {
    isLoading = false;
    loadingIndicator.classList.remove('show');
    updateSendButtonState();
}

// 显示错误消息
function showError(message) {
    const errorText = errorMessage.querySelector('.error-text');
    errorText.textContent = message;
    errorMessage.classList.add('show');
    
    // 5秒后自动隐藏错误消息
    setTimeout(() => {
        hideError();
    }, 5000);
}

// 隐藏错误消息
function hideError() {
    errorMessage.classList.remove('show');
}

// 滚动到底部
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// 导出函数供HTML调用
window.hideError = hideError;

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        messageInput.focus();
    }
});

// 窗口大小变化处理
window.addEventListener('resize', function() {
    scrollToBottom();
});

// 错误处理 - 全局错误捕获
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    showError('页面发生错误，请刷新页面重试');
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
    showError('网络请求失败，请检查网络连接');
});