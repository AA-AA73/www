document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initTheme();
    
    // 用户菜单切换
    initUserMenu();
    
    // 功能卡片点击事件
    initFeatureCards();
    
    // 快捷操作按钮点击事件
    initQuickActions();
    
    // 最近活动点击事件
    initRecentActivity();
    
    // 侧边栏菜单点击事件
    initSidebarMenu();
    
    // 显示用户名
    displayUsername();
    
    // 初始化历史管理
    initHistoryManager();
});

// 初始化主题
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);
    
    // 主题切换事件
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

// 初始化用户菜单
function initUserMenu() {
    const userProfile = document.querySelector('.user-profile');
    const userMenu = document.querySelector('.user-menu');
    const userMenuIcon = document.querySelector('.user-profile i');
    
    userProfile.addEventListener('click', function() {
        userMenu.classList.toggle('active');
        userMenuIcon.classList.toggle('fa-chevron-up');
        userMenuIcon.classList.toggle('fa-chevron-down');
    });
    
    // 点击其他区域关闭菜单
    document.addEventListener('click', function(event) {
        if (!userProfile.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.remove('active');
            userMenuIcon.classList.remove('fa-chevron-up');
            userMenuIcon.classList.add('fa-chevron-down');
        }
    });
    
    // 退出登录
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showMessage('正在退出登录...', 'info');
            setTimeout(function() {
                logout(); // 使用auth.js中的logout函数
            }, 1500);
        });
    }
    
    // 个人资料
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
}

// 初始化功能卡片
function initFeatureCards() {
    // 开始对话卡片
    const startChatCard = document.getElementById('start-chat-card');
    if (startChatCard) {
        startChatCard.addEventListener('click', function() {
            window.location.href = 'chat.html';
        });
    }
    
    // 历史记录卡片
    const historyCard = document.getElementById('history-card');
    if (historyCard) {
        historyCard.addEventListener('click', function() {
            openHistoryManager();
        });
    }
    
    // 收藏卡片
    const favoritesCard = document.getElementById('favorites-card');
    if (favoritesCard) {
        favoritesCard.addEventListener('click', function() {
            showMessage('收藏功能即将上线', 'info');
        });
    }
    
    // 设置卡片
    const settingsCard = document.getElementById('settings-card');
    if (settingsCard) {
        settingsCard.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
}

// 初始化快捷操作
function initQuickActions() {
    // 新对话按钮
    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            window.location.href = 'chat.html?new=true';
        });
    }
    
    // 搜索历史按钮
    const searchHistoryBtn = document.getElementById('search-history-btn');
    if (searchHistoryBtn) {
        searchHistoryBtn.addEventListener('click', function() {
            openHistoryManager();
        });
    }
    
    // 编辑资料按钮
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
    
    // 切换主题按钮
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.getElementById('theme-toggle-btn').click();
        });
    }
}

// 初始化最近活动
function initRecentActivity() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const activityType = this.getAttribute('data-type');
            const activityId = this.getAttribute('data-id');
            
            if (activityType === 'chat') {
                // 打开历史管理面板
                openHistoryManager();
            } else if (activityType === 'favorite') {
                showMessage('收藏功能即将上线', 'info');
            } else {
                showMessage('活动详情即将上线', 'info');
            }
        });
    });
}

// 初始化侧边栏菜单
function initSidebarMenu() {
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menuType = this.getAttribute('data-type');
            
            // 移除所有菜单项的active类
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            // 为当前点击的菜单项添加active类
            this.classList.add('active');
            
            if (menuType === 'home') {
                // 已经在主页，不做操作
            } else if (menuType === 'chat') {
                window.location.href = 'chat.html';
            } else if (menuType === 'history') {
                // 打开历史记录对话框
                openHistoryManager();
            } else if (menuType === 'favorites') {
                showMessage('收藏功能即将上线', 'info');
            } else if (menuType === 'settings') {
                window.location.href = 'profile.html';
            }
        });
    });
    
    // 处理用户菜单中的个人资料点击事件
    const profileMenuItem = document.getElementById('profile-menu-item');
    if (profileMenuItem) {
        profileMenuItem.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
    
    // 处理用户菜单中的退出登录点击事件
    const logoutMenuItem = document.querySelector('.user-menu .menu-item:last-child');
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', function() {
            showMessage('正在退出登录...', 'info');
            setTimeout(function() {
                // 清除用户登录信息
                localStorage.removeItem('isLoggedIn');
                // 跳转到登录页面
                window.location.href = 'index.html';
            }, 1500);
        });
    }
}

// 显示用户名
function displayUsername() {
    // 获取用户名显示元素
    const usernameDisplay = document.getElementById('username-display');
    const userProfileName = document.querySelector('.user-profile span');
    
    if (usernameDisplay) {
        // 从localStorage获取用户名，如果没有则使用默认值
        const username = localStorage.getItem('username') || '用户名';
        
        // 更新欢迎文本中的用户名
        usernameDisplay.textContent = username;
        
        // 同时更新侧边栏中的用户名
        if (userProfileName) {
            userProfileName.textContent = username;
        }
    }
}

// 初始化历史管理
function initHistoryManager() {
    // 使用history.js中的初始化函数
    if (window.historyManager && typeof window.historyManager.init === 'function') {
        window.historyManager.init();
    }
}

// 打开历史管理
function openHistoryManager() {
    // 使用history.js中的打开函数
    if (window.historyManager && typeof window.historyManager.open === 'function') {
        window.historyManager.open();
    }
}

// 关闭历史管理
function closeHistoryManager() {
    // 使用history.js中的关闭函数
    if (window.historyManager && typeof window.historyManager.close === 'function') {
        window.historyManager.close();
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 检查是否已存在消息框，如果有则移除
    const existingMessage = document.querySelector('.message-box');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建消息框
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageBox);
    
    // 显示消息框
    setTimeout(() => {
        messageBox.classList.add('show');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        messageBox.classList.remove('show');
        setTimeout(() => {
            messageBox.remove();
        }, 300);
    }, 3000);
}

// 添加消息框样式
function addMessageBoxStyles() {
    if (!document.getElementById('message-box-styles')) {
        const style = document.createElement('style');
        style.id = 'message-box-styles';
        style.textContent = `
            .message-box {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                background-color: #fff;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            
            .message-box.show {
                transform: translateX(0);
            }
            
            .message-box.info {
                background-color: #e0f2fe;
                color: #0369a1;
                border-left: 4px solid #0ea5e9;
            }
            
            .message-box.success {
                background-color: #dcfce7;
                color: #166534;
                border-left: 4px solid #10b981;
            }
            
            .message-box.error {
                background-color: #fee2e2;
                color: #b91c1c;
                border-left: 4px solid #ef4444;
            }
            
            .message-box.warning {
                background-color: #fef3c7;
                color: #92400e;
                border-left: 4px solid #f59e0b;
            }
            
            [data-theme="dark"] .message-box {
                background-color: #1f2937;
            }
            
            [data-theme="dark"] .message-box.info {
                background-color: #075985;
                color: #e0f2fe;
                border-left: 4px solid #0ea5e9;
            }
            
            [data-theme="dark"] .message-box.success {
                background-color: #065f46;
                color: #dcfce7;
                border-left: 4px solid #10b981;
            }
            
            [data-theme="dark"] .message-box.error {
                background-color: #991b1b;
                color: #fee2e2;
                border-left: 4px solid #ef4444;
            }
            
            [data-theme="dark"] .message-box.warning {
                background-color: #78350f;
                color: #fef3c7;
                border-left: 4px solid #f59e0b;
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载时添加消息框样式
addMessageBoxStyles();