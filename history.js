// 历史管理功能

// 历史数据结构示例
let chatHistory = {
    today: [],
    yesterday: [],
    earlier: []
};

// 当前选中的历史项
let selectedHistoryItem = null;

// 初始化历史管理
function initHistoryManager() {
    // 创建历史管理DOM
    createHistoryManagerDOM();
    
    // 加载历史数据
    loadChatHistory();
    
    // 绑定事件
    bindHistoryEvents();
}

// 创建历史管理DOM
function createHistoryManagerDOM() {
    const historyManagerHTML = `
        <div class="history-manager">
            <div class="history-panel">
                <div class="history-panel-header">
                    <h2>对话历史</h2>
                    <button class="history-panel-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="history-panel-search">
                    <div class="history-search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" id="history-search" placeholder="搜索对话历史...">
                    </div>
                </div>
                <div class="history-panel-content">
                    <div class="history-list">
                        <!-- 历史分组和项目将通过JS动态生成 -->
                    </div>
                    <div class="history-detail">
                        <!-- 历史详情将通过JS动态生成 -->
                        <div class="history-empty">
                            <i class="far fa-comment-dots"></i>
                            <h3>选择一个对话</h3>
                            <p>从左侧列表中选择一个对话查看详情</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', historyManagerHTML);
}

// 绑定历史管理事件
function bindHistoryEvents() {
    // 打开历史管理
    const historyButton = document.querySelector('.history-button');
    if (historyButton) {
        historyButton.addEventListener('click', openHistoryManager);
    }
    
    // 关闭历史管理
    const closeButton = document.querySelector('.history-panel-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeHistoryManager);
    }
    
    // 搜索历史
    const searchInput = document.getElementById('history-search');
    if (searchInput) {
        searchInput.addEventListener('input', searchHistory);
    }
    
    // 点击历史项
    document.addEventListener('click', function(e) {
        if (e.target.closest('.history-item')) {
            const historyItem = e.target.closest('.history-item');
            selectHistoryItem(historyItem);
        }
    });
    
    // 点击历史操作按钮
    document.addEventListener('click', function(e) {
        if (e.target.closest('.history-action-btn')) {
            e.stopPropagation(); // 阻止冒泡，避免触发选择历史项
            const actionButton = e.target.closest('.history-action-btn');
            const action = actionButton.dataset.action;
            const historyItem = actionButton.closest('.history-item');
            const historyId = historyItem.dataset.id;
            
            if (action === 'delete') {
                deleteHistoryItem(historyId);
            }
        }
    });
    
    // 点击历史管理背景关闭
    const historyManager = document.querySelector('.history-manager');
    if (historyManager) {
        historyManager.addEventListener('click', function(e) {
            if (e.target === historyManager) {
                closeHistoryManager();
            }
        });
    }
}

// 打开历史管理
function openHistoryManager() {
    const historyManager = document.querySelector('.history-manager');
    if (historyManager) {
        historyManager.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

// 关闭历史管理
function closeHistoryManager() {
    const historyManager = document.querySelector('.history-manager');
    if (historyManager) {
        historyManager.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
}

// 加载聊天历史
function loadChatHistory() {
    // 从localStorage加载历史数据
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
    }
    
    // 渲染历史列表
    renderHistoryList(chatHistory);
}

// 渲染历史列表
function renderHistoryList(history) {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    // 渲染今天的历史
    if (history.today && history.today.length > 0) {
        const todayGroup = createHistoryGroup('今天');
        history.today.forEach(item => {
            todayGroup.appendChild(createHistoryItem(item));
        });
        historyList.appendChild(todayGroup);
    }
    
    // 渲染昨天的历史
    if (history.yesterday && history.yesterday.length > 0) {
        const yesterdayGroup = createHistoryGroup('昨天');
        history.yesterday.forEach(item => {
            yesterdayGroup.appendChild(createHistoryItem(item));
        });
        historyList.appendChild(yesterdayGroup);
    }
    
    // 渲染更早的历史
    if (history.earlier && history.earlier.length > 0) {
        const earlierGroup = createHistoryGroup('更早');
        history.earlier.forEach(item => {
            earlierGroup.appendChild(createHistoryItem(item));
        });
        historyList.appendChild(earlierGroup);
    }
    
    // 如果没有历史记录
    if ((!history.today || history.today.length === 0) && 
        (!history.yesterday || history.yesterday.length === 0) && 
        (!history.earlier || history.earlier.length === 0)) {
        historyList.innerHTML = `
            <div class="history-empty">
                <i class="far fa-comment-dots"></i>
                <h3>暂无对话历史</h3>
                <p>开始一个新对话，它将显示在这里</p>
            </div>
        `;
    }
}

// 创建历史分组
function createHistoryGroup(title) {
    const group = document.createElement('div');
    group.className = 'history-group';
    group.innerHTML = `<div class="history-group-title">${title}</div>`;
    return group;
}

// 创建历史项
function createHistoryItem(item) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.dataset.id = item.id;
    
    historyItem.innerHTML = `
        <i class="far fa-comment"></i>
        <div class="history-content">
            <div class="history-title">${item.title}</div>
            <div class="history-time">${formatTime(item.time)}</div>
        </div>
        <div class="history-actions">
            <button class="history-action-btn" data-action="delete" title="删除">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    
    return historyItem;
}

// 选择历史项
function selectHistoryItem(historyItem) {
    // 移除之前选中的项的高亮
    const previousSelected = document.querySelector('.history-item.active');
    if (previousSelected) {
        previousSelected.classList.remove('active');
    }
    
    // 高亮当前选中的项
    historyItem.classList.add('active');
    
    // 获取历史ID
    const historyId = historyItem.dataset.id;
    
    // 查找对应的历史数据
    let historyData = null;
    for (const group in chatHistory) {
        const found = chatHistory[group].find(item => item.id === historyId);
        if (found) {
            historyData = found;
            break;
        }
    }
    
    if (historyData) {
        // 更新当前选中的历史项
        selectedHistoryItem = historyData;
        
        // 渲染历史详情
        renderHistoryDetail(historyData);
    }
}

// 渲染历史详情
function renderHistoryDetail(historyData) {
    const historyDetail = document.querySelector('.history-detail');
    if (!historyDetail) return;
    
    // 如果有消息
    if (historyData.messages && historyData.messages.length > 0) {
        historyDetail.innerHTML = `
            <div class="history-detail-header">
                <div class="history-detail-title">${historyData.title}</div>
                <div class="history-detail-time">${formatTime(historyData.time)}</div>
            </div>
            <div class="history-detail-content">
                ${historyData.messages.map(message => createHistoryMessage(message)).join('')}
            </div>
        `;
    } else {
        // 如果没有消息
        historyDetail.innerHTML = `
            <div class="history-empty">
                <i class="far fa-comment-dots"></i>
                <h3>暂无对话内容</h3>
                <p>该对话没有保存任何消息</p>
            </div>
        `;
    }
}

// 创建历史消息
function createHistoryMessage(message) {
    return `
        <div class="history-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}">
            <div class="history-message-avatar">
                <img src="${message.sender === 'user' ? 'assets/user-avatar.png' : 'assets/ai-avatar.png'}" alt="${message.sender === 'user' ? '用户' : 'AI'}">
            </div>
            <div class="history-message-content">
                <div class="history-message-text">${message.content}</div>
                <div class="history-message-time">${formatTime(message.time)}</div>
            </div>
        </div>
    `;
}

// 搜索历史
function searchHistory(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // 如果搜索词为空，显示所有历史
        renderHistoryList(chatHistory);
        return;
    }
    
    // 搜索结果
    const searchResults = {
        today: [],
        yesterday: [],
        earlier: []
    };
    
    // 搜索今天的历史
    if (chatHistory.today) {
        searchResults.today = chatHistory.today.filter(item => {
            // 搜索标题
            if (item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // 搜索消息内容
            if (item.messages) {
                return item.messages.some(message => 
                    message.content.toLowerCase().includes(searchTerm)
                );
            }
            
            return false;
        });
    }
    
    // 搜索昨天的历史
    if (chatHistory.yesterday) {
        searchResults.yesterday = chatHistory.yesterday.filter(item => {
            // 搜索标题
            if (item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // 搜索消息内容
            if (item.messages) {
                return item.messages.some(message => 
                    message.content.toLowerCase().includes(searchTerm)
                );
            }
            
            return false;
        });
    }
    
    // 搜索更早的历史
    if (chatHistory.earlier) {
        searchResults.earlier = chatHistory.earlier.filter(item => {
            // 搜索标题
            if (item.title.toLowerCase().includes(searchTerm)) {
                return true;
            }
            
            // 搜索消息内容
            if (item.messages) {
                return item.messages.some(message => 
                    message.content.toLowerCase().includes(searchTerm)
                );
            }
            
            return false;
        });
    }
    
    // 渲染搜索结果
    renderHistoryList(searchResults);
}

// 删除历史项
function deleteHistoryItem(historyId) {
    // 确认删除
    if (!confirm('确定要删除这个对话吗？此操作不可撤销。')) {
        return;
    }
    
    // 从各个分组中查找并删除
    for (const group in chatHistory) {
        const index = chatHistory[group].findIndex(item => item.id === historyId);
        if (index !== -1) {
            chatHistory[group].splice(index, 1);
            break;
        }
    }
    
    // 保存更新后的历史
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // 重新渲染历史列表
    renderHistoryList(chatHistory);
    
    // 如果删除的是当前选中的项，清空详情区域
    if (selectedHistoryItem && selectedHistoryItem.id === historyId) {
        selectedHistoryItem = null;
        const historyDetail = document.querySelector('.history-detail');
        if (historyDetail) {
            historyDetail.innerHTML = `
                <div class="history-empty">
                    <i class="far fa-comment-dots"></i>
                    <h3>选择一个对话</h3>
                    <p>从左侧列表中选择一个对话查看详情</p>
                </div>
            `;
        }
    }
}

// 保存聊天记录
function saveChatHistory(messages) {
    if (!messages || messages.length === 0) return;
    
    // 生成唯一ID
    const historyId = 'chat_' + Date.now();
    
    // 提取第一条消息作为标题，如果太长则截断
    let title = messages[0].content;
    if (title.length > 30) {
        title = title.substring(0, 30) + '...';
    }
    
    // 创建历史项
    const historyItem = {
        id: historyId,
        title: title,
        time: new Date().toISOString(),
        messages: messages
    };
    
    // 根据日期分组
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000; // 昨天（今天的时间戳减去一天的毫秒数）
    
    const messageTime = new Date(historyItem.time).getTime();
    
    // 添加到对应的分组
    if (messageTime >= today) {
        // 今天
        chatHistory.today.unshift(historyItem);
    } else if (messageTime >= yesterday) {
        // 昨天
        chatHistory.yesterday.unshift(historyItem);
    } else {
        // 更早
        chatHistory.earlier.unshift(historyItem);
    }
    
    // 限制每个分组的数量
    const maxItemsPerGroup = 50;
    if (chatHistory.today.length > maxItemsPerGroup) {
        chatHistory.today = chatHistory.today.slice(0, maxItemsPerGroup);
    }
    if (chatHistory.yesterday.length > maxItemsPerGroup) {
        chatHistory.yesterday = chatHistory.yesterday.slice(0, maxItemsPerGroup);
    }
    if (chatHistory.earlier.length > maxItemsPerGroup) {
        chatHistory.earlier = chatHistory.earlier.slice(0, maxItemsPerGroup);
    }
    
    // 保存到localStorage
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    
    // 如果历史管理面板是打开的，更新历史列表
    const historyManager = document.querySelector('.history-manager');
    if (historyManager && historyManager.classList.contains('active')) {
        renderHistoryList(chatHistory);
    }
}

// 格式化时间
function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // 如果是今天
    if (date >= today) {
        return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // 如果是昨天
    if (date >= yesterday) {
        return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // 其他日期
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

// 导出函数
window.historyManager = {
    init: initHistoryManager,
    open: openHistoryManager,
    close: closeHistoryManager,
    save: saveChatHistory
};

// 页面加载完成后初始化历史管理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化历史管理
    initHistoryManager();
});