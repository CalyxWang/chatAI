// AI Life Coach 后端服务器
// 使用Node.js和Express框架，处理前端请求并转发到火山方舟DeepSeek R1 API

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

// 创建Express应用实例
const app = express();
const PORT = process.env.PORT || 3000;

// 火山方舟API配置
const API_CONFIG = {
    url: process.env.VOLC_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: process.env.VOLC_API_KEY,
    model: process.env.VOLC_MODEL_ID,
    timeout: parseInt(process.env.API_TIMEOUT) || 60000, // 60秒超时
    temperature: parseFloat(process.env.API_TEMPERATURE) || 0.6,
    stream: process.env.API_STREAM === 'true' || true
};

// 验证必需的环境变量
if (!API_CONFIG.apiKey) {
    console.error('❌ 错误: 缺少必需的环境变量 VOLC_API_KEY');
    process.exit(1);
}

if (!API_CONFIG.model) {
    console.error('❌ 错误: 缺少必需的环境变量 VOLC_MODEL_ID');
    process.exit(1);
}

// 中间件配置
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'file://'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 聊天API路由
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        
        // 验证请求参数
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: '消息内容不能为空'
            });
        }
        
        if (message.length > 1000) {
            return res.status(400).json({
                error: '消息长度不能超过1000个字符'
            });
        }
        
        console.log('收到聊天请求:', { messageLength: message.length, historyLength: history.length });
        
        // 构建消息历史
        const messages = buildMessageHistory(message, history);
        
        // 调用火山方舟API
        const aiResponse = await callDeepSeekAPI(messages);
        
        // 返回响应
        res.json({
            content: aiResponse,
            timestamp: new Date().toISOString()
        });
        
        console.log('AI回复成功发送');
        
    } catch (error) {
        console.error('聊天API错误:', error);
        
        // 错误响应
        res.status(500).json({
            error: error.message || '服务器内部错误，请稍后重试'
        });
    }
});

// 构建消息历史记录
function buildMessageHistory(currentMessage, history) {
    // 系统提示词 - 定义AI生活教练的角色
    const systemPrompt = `你是一位专业的AI生活教练，具有以下特质和能力：

**角色定位：**
- 你是一位温暖、耐心、专业的生活指导师
- 具备心理学、职业规划、人际关系等多领域知识
- 善于倾听，能够理解用户的情感和需求

**指导原则：**
1. **倾听理解**：认真倾听用户的困惑和想法，给予充分的理解和共情
2. **个性化建议**：根据用户的具体情况提供针对性的建议和指导
3. **积极正面**：保持积极乐观的态度，鼓励用户成长和进步
4. **实用可行**：提供具体可执行的建议和行动计划
5. **循序渐进**：帮助用户制定合理的目标和步骤

**专业领域：**
- 个人成长与自我提升
- 职业发展与规划
- 人际关系与沟通技巧
- 情绪管理与心理健康
- 时间管理与效率提升
- 生活规划与目标设定

**沟通风格：**
- 使用温暖友好的语调
- 适当使用鼓励性的语言
- 提问引导用户深入思考
- 分享相关的案例或方法
- 给出具体的行动建议

请根据用户的问题和情况，提供专业、贴心、实用的生活指导建议。`;
    
    const messages = [
        {
            role: 'system',
            content: systemPrompt
        }
    ];
    
    // 添加历史对话（最近5轮对话）
    const recentHistory = history.slice(-10).filter(msg => 
        msg.role === 'user' || msg.role === 'assistant'
    );
    
    messages.push(...recentHistory.map(msg => ({
        role: msg.role,
        content: msg.content
    })));
    
    // 添加当前用户消息
    messages.push({
        role: 'user',
        content: currentMessage
    });
    
    return messages;
}

// 调用火山方舟DeepSeek API
async function callDeepSeekAPI(messages) {
    const requestBody = {
        model: API_CONFIG.model,
        messages: messages,
        temperature: API_CONFIG.temperature,
        stream: false, // 暂时使用非流式响应，简化处理
        max_tokens: 2000
    };
    
    console.log('调用DeepSeek API:', {
        url: API_CONFIG.url,
        model: API_CONFIG.model,
        messagesCount: messages.length
    });
    
    const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody),
        timeout: API_CONFIG.timeout
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('API调用失败:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
        });
        
        // 解析错误信息
        let errorMessage = '调用AI服务失败';
        try {
            const errorData = JSON.parse(errorText);
            if (errorData.error && errorData.error.message) {
                errorMessage = errorData.error.message;
            }
        } catch (e) {
            // 忽略JSON解析错误
        }
        
        throw new Error(`API调用失败: ${errorMessage}`);
    }
    
    const data = await response.json();
    
    // 验证响应格式
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('API响应格式错误:', data);
        throw new Error('AI服务响应格式错误');
    }
    
    const aiMessage = data.choices[0].message.content;
    
    if (!aiMessage || typeof aiMessage !== 'string') {
        throw new Error('AI回复内容为空');
    }
    
    console.log('AI回复成功:', { length: aiMessage.length });
    return aiMessage;
}

// 健康检查路由
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        error: '请求的资源不存在'
    });
});

// 全局错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    
    res.status(500).json({
        error: '服务器内部错误'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`\n🚀 AI Life Coach 服务器已启动`);
    console.log(`📍 本地访问地址: http://localhost:${PORT}`);
    console.log(`🤖 API端点: http://localhost:${PORT}/api/chat`);
    console.log(`💡 健康检查: http://localhost:${PORT}/api/health`);
    console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}\n`);
});

// 优雅关闭处理
process.on('SIGTERM', () => {
    console.log('\n收到SIGTERM信号，正在优雅关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n收到SIGINT信号，正在优雅关闭服务器...');
    process.exit(0);
});

// 未捕获异常处理
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    process.exit(1);
});