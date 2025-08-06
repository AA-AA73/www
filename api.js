// DeepSeek AI API 调用模块

// API密钥
const API_KEY = "sk-bac5863977bf4915863033730d14566b";

// API端点
const API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

/**
 * 发送消息到DeepSeek AI并获取响应
 * @param {string} message - 用户消息
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} - AI响应文本
 */
async function sendToDeepSeekAI(message, options = {}) {
    try {
        // 准备请求数据
        const requestData = {
            model: options.model || "deepseek-chat",
            messages: [
                { role: "user", content: message }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 2000,
            stream: false
        };

        // 如果有系统角色设置，添加到消息中
        if (options.systemRole) {
            requestData.messages.unshift({
                role: "system",
                content: options.systemRole
            });
        }

        // 发送请求到DeepSeek API
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestData)
        });

        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API错误: ${errorData.error?.message || response.statusText}`);
        }

        // 解析响应数据
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("DeepSeek API调用失败:", error);
        throw error;
    }
}

/**
 * 流式发送消息到DeepSeek AI并获取响应
 * @param {string} message - 用户消息
 * @param {function} onChunk - 处理每个响应块的回调函数
 * @param {Object} options - 配置选项
 * @returns {Promise<void>}
 */
async function streamFromDeepSeekAI(message, onChunk, options = {}) {
    try {
        // 准备请求数据
        const requestData = {
            model: options.model || "deepseek-chat",
            messages: [
                { role: "user", content: message }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 2000,
            stream: true
        };

        // 如果有系统角色设置，添加到消息中
        if (options.systemRole) {
            requestData.messages.unshift({
                role: "system",
                content: options.systemRole
            });
        }

        // 发送请求到DeepSeek API
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestData)
        });

        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API错误: ${errorData.error?.message || response.statusText}`);
        }

        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            // 处理缓冲区中的完整事件
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices[0]?.delta?.content || "";
                        if (content) onChunk(content);
                    } catch (e) {
                        console.error("解析流式响应失败:", e);
                    }
                }
            }
        }
    } catch (error) {
        console.error("DeepSeek API流式调用失败:", error);
        throw error;
    }
}

// 导出API函数
export { sendToDeepSeekAI, streamFromDeepSeekAI };