// 主题管理功能

// 可用的主题列表
const themes = [
    {
        id: 'default',
        name: '默认主题',
        description: '几何图案主题',
        primaryColor: '#4f46e5',
        secondaryColor: '#10b981'
    },
    {
        id: 'waves',
        name: '波浪主题',
        description: '流动的波浪图案',
        primaryColor: '#8b5cf6',
        secondaryColor: '#06b6d4'
    },
    {
        id: 'grid',
        name: '网格主题',
        description: '现代网格图案',
        primaryColor: '#ec4899',
        secondaryColor: '#f59e0b'
    },
    {
        id: 'bubbles',
        name: '气泡主题',
        description: '轻盈的气泡图案',
        primaryColor: '#3b82f6',
        secondaryColor: '#14b8a6'
    }
];

// 初始化主题管理
function initThemeManager() {
    // 添加角落元素
    addCornerElements();
    
    // 加载保存的主题
    loadSavedTheme();
    
    // 添加主题切换事件监听
    document.addEventListener('themeChanged', handleThemeChange);
}

// 添加角落元素
function addCornerElements() {
    const cornerTopRight = document.createElement('div');
    cornerTopRight.className = 'corner-top-right';
    
    const cornerBottomLeft = document.createElement('div');
    cornerBottomLeft.className = 'corner-bottom-left';
    
    document.body.appendChild(cornerTopRight);
    document.body.appendChild(cornerBottomLeft);
}

// 加载保存的主题
function loadSavedTheme() {
    const savedThemeMode = localStorage.getItem('theme');
    const savedThemePattern = localStorage.getItem('themePattern');
    
    // 设置主题模式（亮色/暗色）
    if (savedThemeMode === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // 设置主题图案
    if (savedThemePattern) {
        setThemePattern(savedThemePattern);
    } else {
        // 默认主题
        setThemePattern('default');
    }
}

// 设置主题图案
function setThemePattern(themeId) {
    // 移除所有主题类
    document.body.classList.remove('theme-default', 'theme-waves', 'theme-grid', 'theme-bubbles');
    
    // 添加选定的主题类
    document.body.classList.add(`theme-${themeId}`);
    
    // 保存主题选择
    localStorage.setItem('themePattern', themeId);
    
    // 触发主题变更事件
    const event = new CustomEvent('themeChanged', { detail: { themeId } });
    document.dispatchEvent(event);
}

// 处理主题变更
function handleThemeChange(event) {
    const themeId = event.detail.themeId;
    const theme = themes.find(t => t.id === themeId);
    
    if (theme) {
        // 更新CSS变量
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    }
}

// 获取所有可用主题
function getAllThemes() {
    return themes;
}

// 获取当前主题
function getCurrentTheme() {
    const themeId = localStorage.getItem('themePattern') || 'default';
    return themes.find(t => t.id === themeId) || themes[0];
}

// 导出函数
window.themeManager = {
    init: initThemeManager,
    setTheme: setThemePattern,
    getAllThemes: getAllThemes,
    getCurrentTheme: getCurrentTheme
};

// 页面加载完成后初始化主题管理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题管理
    initThemeManager();
});