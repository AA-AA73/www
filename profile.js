document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    const userProfile = document.getElementById('user-profile');
    const userMenu = document.getElementById('user-menu');
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    const profileForms = document.querySelectorAll('.profile-form');
    const themeOptions = document.querySelectorAll('input[name="theme"]');
    const themePatternOptions = document.querySelectorAll('.theme-pattern-option');
    const logo = document.querySelector('.logo');
    
    // Logo点击事件 - 返回主页
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // 检查本地存储中是否有保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        document.getElementById('theme-dark').checked = true;
    } else if (savedTheme === 'light') {
        document.getElementById('theme-light').checked = true;
    } else if (savedTheme === 'system') {
        document.getElementById('theme-system').checked = true;
        // 这里可以添加检测系统主题的逻辑
    }
    
    // 检查本地存储中是否有保存的主题图案偏好
    const savedPattern = localStorage.getItem('themePattern') || 'default';
    document.querySelectorAll('.theme-pattern-option').forEach(option => {
        if (option.getAttribute('data-pattern') === savedPattern) {
            option.classList.add('active');
            document.body.setAttribute('data-pattern', savedPattern);
        }
    });
    
    // 应用主题图案
    applyThemePattern(savedPattern);
    
    // 切换主题
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            document.getElementById('theme-light').checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            document.getElementById('theme-dark').checked = true;
        }
    });
    
    // 主题选项切换
    themeOptions.forEach(option => {
        option.addEventListener('change', function() {
            const selectedTheme = this.value;
            localStorage.setItem('theme', selectedTheme);
            
            if (selectedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else if (selectedTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else if (selectedTheme === 'system') {
                // 这里可以添加检测系统主题的逻辑
                const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
                if (prefersDarkScheme.matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        });
    });
    
    // 用户菜单展开/收起
    userProfile.addEventListener('click', function() {
        userMenu.classList.toggle('active');
        const icon = userProfile.querySelector('i');
        if (userMenu.classList.contains('active')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
    
    // 点击其他地方关闭用户菜单
    document.addEventListener('click', function(e) {
        if (!userProfile.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
            const icon = userProfile.querySelector('i');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
    
    // 头像上传预览
    avatarUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
                // 这里可以添加上传头像到服务器的逻辑
                showMessage('头像已更新', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // 主题图案选项切换
    themePatternOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有选项的active类
            themePatternOptions.forEach(opt => opt.classList.remove('active'));
            // 为当前选项添加active类
            this.classList.add('active');
            
            const pattern = this.getAttribute('data-pattern');
            localStorage.setItem('themePattern', pattern);
            document.body.setAttribute('data-pattern', pattern);
            
            // 应用主题图案
            applyThemePattern(pattern);
        });
    });
    
    // 应用主题图案函数
    function applyThemePattern(pattern) {
        // 移除所有图案类
        document.body.classList.remove('theme-default', 'theme-waves', 'theme-grid', 'theme-bubbles');
        // 添加选中的图案类
        document.body.classList.add('theme-' + pattern);
        
        // 调用主题管理器的setTheme方法
        if (window.themeManager && typeof window.themeManager.setTheme === 'function') {
            window.themeManager.setTheme(pattern);
        }
    }
    
    // 表单提交处理
    profileForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单数据处理和提交到服务器的逻辑
            showMessage('保存成功', 'success');
        });
    });
    
    // 初始化侧边栏菜单
    initSidebarMenu();
    
    // 退出登录
    const logoutBtn = document.querySelector('.user-menu .menu-item:last-child');
    logoutBtn.addEventListener('click', function() {
        showMessage('正在退出登录...', 'info');
        setTimeout(function() {
            // 清除用户登录信息
            localStorage.removeItem('isLoggedIn');
            // 跳转到登录页面
            window.location.href = 'index.html';
        }, 1500);
    });
    
    // 个人资料菜单项
    const profileMenuItem = document.querySelector('.user-menu .menu-item:first-child');
    profileMenuItem.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });
    
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
                    window.location.href = 'dashboard.html';
                } else if (menuType === 'chat') {
                    window.location.href = 'chat.html';
                } else if (menuType === 'history') {
                    showMessage('历史记录功能在主页可用', 'info');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else if (menuType === 'favorites') {
                    showMessage('收藏功能即将上线', 'info');
                } else if (menuType === 'settings') {
                    // 已经在设置页面，不做操作
                }
            });
        });
    }
    
    // 辅助函数：显示消息
    function showMessage(message, type = 'info') {
        // 检查是否已存在消息元素
        let messageElement = document.querySelector('.message-box');
        
        if (!messageElement) {
            // 创建消息元素
            messageElement = document.createElement('div');
            messageElement.className = 'message-box';
            document.body.appendChild(messageElement);
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                .message-box {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 20px;
                    border-radius: 4px;
                    background-color: #4f46e5;
                    color: white;
                    font-size: 14px;
                    z-index: 1000;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .message-box.show {
                    opacity: 1;
                }
                .message-box.error {
                    background-color: #ef4444;
                }
                .message-box.success {
                    background-color: #10b981;
                }
            `;
            document.head.appendChild(style);
        }
        
        // 设置消息内容和类型
        messageElement.textContent = message;
        messageElement.className = 'message-box';
        if (type === 'error') messageElement.classList.add('error');
        if (type === 'success') messageElement.classList.add('success');
        
        // 显示消息
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // 3秒后隐藏消息
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 3000);
    }
});