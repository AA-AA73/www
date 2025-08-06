document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const loginBtn = document.querySelector('#login-form .auth-btn');
    const registerBtn = document.querySelector('#register-form .auth-btn');
    const verificationBtn = document.querySelector('.verification-btn');
    
    // 切换登录/注册表单
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
    
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
    
    // 切换密码显示/隐藏
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
    
    // 验证码倒计时功能
    verificationBtn.addEventListener('click', function() {
        const phone = document.getElementById('register-phone').value;
        if (!validatePhone(phone)) {
            showMessage('请输入有效的手机号码');
            return;
        }
        
        // 模拟发送验证码
        let countdown = 60;
        const originalText = this.textContent;
        this.disabled = true;
        
        const timer = setInterval(() => {
            countdown--;
            this.textContent = `${countdown}秒后重试`;
            
            if (countdown <= 0) {
                clearInterval(timer);
                this.textContent = originalText;
                this.disabled = false;
            }
        }, 1000);
        
        // 这里应该有发送验证码的API调用
        showMessage('验证码已发送到您的手机');
    });
    
    // 登录表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            showMessage('请填写所有必填字段', 'error');
            return;
        }
        
        // 获取注册用户数据
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        
        // 查找用户
        const user = users.find(u => u.username === username || u.phone === username);
        
        // 验证用户是否存在和密码是否正确
        if (!user) {
            showMessage('用户不存在，请先注册', 'error');
            return;
        }
        
        if (user.password !== password) {
            showMessage('密码错误，请重试', 'error');
            return;
        }
        
        // 登录成功
        showMessage('登录成功，即将跳转...', 'success');
        
        // 设置登录状态
        setLoggedIn(user.username);
        
        // 检查是否有重定向URL
        const redirectUrl = localStorage.getItem('redirectUrl');
        
        // 登录成功后跳转
        setTimeout(() => {
            if (redirectUrl) {
                localStorage.removeItem('redirectUrl');
                window.location.href = redirectUrl;
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1500);
    });
    
    // 注册表单提交
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const phone = document.getElementById('register-phone').value;
        const verification = document.getElementById('register-verification').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        if (!username || !phone || !verification || !password || !confirmPassword) {
            showMessage('请填写所有必填字段', 'error');
            return;
        }
        
        if (!validatePhone(phone)) {
            showMessage('请输入有效的手机号码', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showMessage('两次输入的密码不一致', 'error');
            return;
        }
        
        if (!terms) {
            showMessage('请阅读并同意服务条款和隐私政策', 'error');
            return;
        }
        
        // 获取已注册用户
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        
        // 检查用户名是否已存在
        if (users.some(user => user.username === username)) {
            showMessage('用户名已存在，请使用其他用户名', 'error');
            return;
        }
        
        // 检查手机号是否已注册
        if (users.some(user => user.phone === phone)) {
            showMessage('该手机号已注册，请直接登录', 'error');
            return;
        }
        
        // 创建新用户对象
        const newUser = {
            username,
            phone,
            password,
            registerDate: new Date().toISOString()
        };
        
        // 添加到用户列表
        users.push(newUser);
        
        // 保存到本地存储
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // 注册成功
        showMessage('注册成功，即将跳转到登录页面...', 'success');
        
        // 注册成功后跳转到登录页面
        setTimeout(() => {
            loginTab.click();
            // 自动填充用户名
            document.getElementById('login-username').value = username;
            showMessage('注册成功！请登录', 'success');
        }, 1500);
    });
    
    // 辅助函数：验证手机号格式
    function validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
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
        
        // 移除所有类型类
        messageElement.classList.remove('error', 'success', 'info');
        
        // 设置消息内容和类型
        messageElement.textContent = message;
        messageElement.className = 'message-box';
        messageElement.classList.add(type); // 添加对应类型的类
        
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
    
    // 主题切换功能
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // 检查本地存储中是否有保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // 切换主题
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
});