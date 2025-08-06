// DeepSeek AI API配置文件

// API密钥配置
const API_CONFIG = {
    // DeepSeek AI API密钥
    DEEPSEEK_API_KEY: 'sk-bac5863977bf4915863033730d14566b',
    // API基础URL
    API_BASE_URL: 'https://api.deepseek.com',  // 这里使用示例URL，实际使用时请替换为正确的API端点
    // 模型配置
    MODEL: 'deepseek-chat',  // 默认模型名称，根据实际可用模型调整
    // 请求超时时间（毫秒）
    TIMEOUT: 30000
};

// 导出配置
const CONFIG = {
    API: API_CONFIG
};