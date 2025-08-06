// 登录验证脚本

// 在页面加载时检查用户是否已登录
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// 检查用户是否已登录
function checkAuth() {
    // 检查本地存储中是否有登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // 如果当前页面不是登录页面，但用户未登录，则重定向到登录页面
    if (currentPage !== 'index.html' && currentPage !== '' && !isLoggedIn) {
        // 保存当前页面URL，以便登录后重定向回来
        localStorage.setItem('redirectUrl', window.location.href);
        window.location.href = 'index.html';
    }
    
    // 如果当前页面是登录页面，但用户已登录，则重定向到主页
    if ((currentPage === 'index.html' || currentPage === '') && isLoggedIn) {
        window.location.href = 'dashboard.html';
    }
}

// 设置登录状态
function setLoggedIn(username) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('loginTime', new Date().toISOString());
}

// 清除登录状态
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('redirectUrl');
    // 保留注册用户数据，但清除当前会话信息
    window.location.href = 'index.html';
}