document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn.querySelector('i');
    const userProfile = document.getElementById('user-profile');
    const userMenu = document.getElementById('user-menu');
    const chatInput = document.querySelector('.input-container textarea');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const historyItems = document.querySelectorAll('.history-item');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const logo = document.querySelector('.logo');
    const uploadBtn = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');
    const uploadPreview = document.querySelector('.upload-preview');
    const imagePreview = document.getElementById('image-preview');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const removeUploadBtn = document.getElementById('remove-upload');
    const voiceBtn = document.getElementById('voice-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsDropdown = document.getElementById('settings-dropdown');
    const roleDropdownBtn = document.getElementById('role-dropdown-btn');
    const knowledgeDropdownBtn = document.getElementById('knowledge-dropdown-btn');
    const roleModal = document.getElementById('role-modal');
    const customRoleModal = document.getElementById('custom-role-modal');
    const roleCards = document.querySelectorAll('.role-card');
    const customRoleForm = document.getElementById('custom-role-form');
    const closeBtns = document.querySelectorAll('.close-btn');
    
    // 当前上传的文件
    let currentUploadedFile = null;
    
    // 当前选择的角色
    let currentRole = 'default';
    
    // 语音合成相关变量
    let speechSynthesis = window.speechSynthesis;
    let autoSpeakEnabled = localStorage.getItem('autoSpeakEnabled') === 'true';
    
    // 初始化自动朗读开关状态
    const autoSpeakToggle = document.getElementById('auto-speak-toggle');
    if (autoSpeakToggle) {
        autoSpeakToggle.checked = autoSpeakEnabled;
        autoSpeakToggle.addEventListener('change', function() {
            autoSpeakEnabled = this.checked;
            localStorage.setItem('autoSpeakEnabled', autoSpeakEnabled);
        });
    }
    
    // 初始化侧边栏菜单
    initSidebarMenu();
    
    // 添加返回主页功能
    logo.addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });
    logo.style.cursor = 'pointer';
    
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
    
    // 聊天输入框自动调整高度
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // 文件上传处理
    uploadBtn.addEventListener('click', function() {
        fileUpload.click();
    });
    
    fileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            currentUploadedFile = file;
            
            // 显示预览区域
            uploadPreview.style.display = 'flex';
            
            // 根据文件类型显示不同的预览
            if (file.type.startsWith('image/')) {
                // 图片预览
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                    fileInfo.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else {
                // 文档预览
                imagePreview.style.display = 'none';
                fileInfo.style.display = 'flex';
                fileName.textContent = file.name;
            }
        }
    });
    
    // 移除上传文件
    removeUploadBtn.addEventListener('click', function() {
        currentUploadedFile = null;
        uploadPreview.style.display = 'none';
        fileUpload.value = '';
    });
    
    // 语音输入功能
    voiceBtn.addEventListener('click', function() {
        // 检查浏览器是否支持语音识别
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'zh-CN';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = function() {
                // 显示正在录音的状态
                voiceBtn.classList.add('recording');
                voiceBtn.querySelector('i').classList.remove('fa-microphone');
                voiceBtn.querySelector('i').classList.add('fa-stop');
                showMessage('正在录音...', 'info');
            };
            
            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                chatInput.value += transcript;
                // 触发input事件以调整高度
                chatInput.dispatchEvent(new Event('input'));
            };
            
            recognition.onerror = function(event) {
                console.error('语音识别错误:', event.error);
                showMessage('语音识别失败: ' + event.error, 'error');
                resetVoiceButton();
            };
            
            recognition.onend = function() {
                resetVoiceButton();
            };
            
            // 如果按钮已经在录音状态，则停止录音
            if (voiceBtn.classList.contains('recording')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        } else {
            showMessage('您的浏览器不支持语音识别功能', 'error');
        }
    });
    
    function resetVoiceButton() {
        voiceBtn.classList.remove('recording');
        voiceBtn.querySelector('i').classList.remove('fa-stop');
        voiceBtn.querySelector('i').classList.add('fa-microphone');
    }
    
    // 设置下拉菜单功能
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        settingsDropdown.classList.toggle('show');
    });
    
    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(e) {
        if (!settingsBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.classList.remove('show');
        }
    });
    
    // 角色选择功能
    roleDropdownBtn.addEventListener('click', function() {
        settingsDropdown.classList.remove('show');
        roleModal.classList.add('show');
    });
    
    // 知识库管理功能
    const knowledgeModal = document.getElementById('knowledge-modal');
    const knowledgeUploadArea = document.getElementById('knowledge-upload-area');
    const knowledgeFileInput = document.getElementById('knowledge-file-input');
    const knowledgeList = document.getElementById('knowledge-list');
    const emptyKnowledgeState = document.getElementById('empty-knowledge-state');
    
    // 知识库文档存储
    let knowledgeDocuments = [];
    
    // 显示知识库管理模态框
    knowledgeDropdownBtn.addEventListener('click', function() {
        settingsDropdown.classList.remove('show');
        knowledgeModal.classList.add('show');
    });
    
    // 关闭模态框
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            roleModal.classList.remove('show');
            customRoleModal.classList.remove('show');
            knowledgeModal.classList.remove('show');
        });
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === roleModal) {
            roleModal.classList.remove('show');
        }
        if (e.target === customRoleModal) {
            customRoleModal.classList.remove('show');
        }
        if (e.target === knowledgeModal) {
            knowledgeModal.classList.remove('show');
        }
    });
    
    // 知识库文件上传处理
    knowledgeUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('active');
    });
    
    knowledgeUploadArea.addEventListener('dragleave', function() {
        this.classList.remove('active');
    });
    
    knowledgeUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('active');
        
        const files = e.dataTransfer.files;
        handleKnowledgeFiles(files);
    });
    
    knowledgeFileInput.addEventListener('change', function() {
        handleKnowledgeFiles(this.files);
    });
    
    // 处理知识库文件
    function handleKnowledgeFiles(files) {
        if (files.length === 0) return;
        
        Array.from(files).forEach(file => {
            // 检查文件类型
            const fileType = file.name.split('.').pop().toLowerCase();
            if (!['pdf', 'doc', 'docx', 'txt'].includes(fileType)) {
                showMessage(`不支持的文件类型: ${fileType}`, 'error');
                return;
            }
            
            // 创建文件对象
            const docId = 'doc-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            const docObj = {
                id: docId,
                name: file.name,
                type: fileType,
                size: file.size,
                date: new Date().toISOString(),
                file: file
            };
            
            // 添加到知识库
            addDocumentToKnowledge(docObj);
        });
        
        // 重置文件输入
        knowledgeFileInput.value = '';
    }
    
    // 添加文档到知识库
    function addDocumentToKnowledge(doc) {
        // 添加到内存中的知识库
        knowledgeDocuments.push(doc);
        
        // 保存到localStorage (仅保存元数据)
        saveKnowledgeDocuments();
        
        // 添加到UI
        addDocumentToUI(doc);
        
        // 显示成功消息
        showMessage(`已添加文档到知识库: ${doc.name}`, 'success');
    }
    
    // 保存知识库文档到localStorage
     function saveKnowledgeDocuments() {
         // 创建不包含文件对象的副本
         const docsToSave = knowledgeDocuments.map(doc => {
             const { file, ...docMeta } = doc;
             return docMeta;
         });
         
         localStorage.setItem('knowledgeDocuments', JSON.stringify(docsToSave));
     }
     
     // 添加文档到UI
     function addDocumentToUI(doc) {
         // 隐藏空状态
         if (emptyKnowledgeState) {
             emptyKnowledgeState.style.display = 'none';
         }
         
         // 创建文档项
         const docItem = document.createElement('div');
         docItem.className = 'knowledge-item';
         docItem.setAttribute('data-doc-id', doc.id);
         
         // 根据文件类型设置图标
         let iconClass = 'fa-file-alt';
         if (doc.type === 'pdf') iconClass = 'fa-file-pdf';
         else if (['doc', 'docx'].includes(doc.type)) iconClass = 'fa-file-word';
         
         // 格式化文件大小
         const fileSize = formatFileSize(doc.size);
         
         // 格式化日期
         const fileDate = new Date(doc.date).toLocaleDateString();
         
         docItem.innerHTML = `
             <div class="knowledge-item-icon">
                 <i class="fas ${iconClass}"></i>
             </div>
             <div class="knowledge-item-info">
                 <div class="knowledge-item-name">${doc.name}</div>
                 <div class="knowledge-item-meta">${fileSize} · ${fileDate}</div>
             </div>
             <div class="knowledge-item-actions">
                 <button class="delete-doc-btn" title="删除" data-doc-id="${doc.id}">
                     <i class="fas fa-trash"></i>
                 </button>
             </div>
         `;
         
         // 添加删除按钮事件
         docItem.querySelector('.delete-doc-btn').addEventListener('click', function() {
             const docId = this.getAttribute('data-doc-id');
             deleteDocument(docId);
             docItem.remove();
             
             // 如果没有文档了，显示空状态
             if (knowledgeDocuments.length === 0 && emptyKnowledgeState) {
                 emptyKnowledgeState.style.display = 'block';
             }
             
             showMessage('已从知识库中删除文档', 'info');
         });
         
         knowledgeList.appendChild(docItem);
     }
     
     // 删除知识库文档
     function deleteDocument(docId) {
         knowledgeDocuments = knowledgeDocuments.filter(doc => doc.id !== docId);
         saveKnowledgeDocuments();
     }
     
     // 格式化文件大小
     function formatFileSize(bytes) {
         if (bytes < 1024) return bytes + ' B';
         else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
         else return (bytes / 1048576).toFixed(1) + ' MB';
     }
     
     // 加载知识库文档
     function loadKnowledgeDocuments() {
         const savedDocs = JSON.parse(localStorage.getItem('knowledgeDocuments') || '[]');
         
         if (savedDocs.length > 0) {
             // 隐藏空状态
             if (emptyKnowledgeState) {
                 emptyKnowledgeState.style.display = 'none';
             }
             
             // 加载文档到内存和UI
             savedDocs.forEach(doc => {
                 knowledgeDocuments.push(doc);
                 addDocumentToUI(doc);
             });
         }
         
         // 加载知识库设置
         const autoUse = localStorage.getItem('autoUseKnowledge');
         if (autoUse !== null) {
             document.getElementById('auto-use-knowledge').checked = autoUse === 'true';
         }
         
         const threshold = localStorage.getItem('knowledgeThreshold');
         if (threshold !== null) {
             document.getElementById('knowledge-threshold').value = threshold;
         }
     }
     
     // 保存知识库设置
     document.getElementById('auto-use-knowledge').addEventListener('change', function() {
         localStorage.setItem('autoUseKnowledge', this.checked);
     });
     
     document.getElementById('knowledge-threshold').addEventListener('input', function() {
         localStorage.setItem('knowledgeThreshold', this.value);
     });
     
     // 知识库上传按钮事件
     document.getElementById('knowledge-upload-btn').addEventListener('click', function() {
         document.getElementById('knowledge-file-input').click();
     });
    
    // 角色卡片选择
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            
            if (role === 'custom') {
                // 打开自定义角色模态框
                roleModal.classList.remove('show');
                customRoleModal.classList.add('show');
            } else {
                // 设置当前角色
                setCurrentRole(role);
                roleModal.classList.remove('show');
                showMessage(`已切换到${this.querySelector('h4').textContent}角色`, 'success');
            }
        });
    });
    
    // 自定义角色表单提交
    customRoleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const roleName = document.getElementById('role-name').value;
        const roleDescription = document.getElementById('role-description').value;
        const rolePrompt = document.getElementById('role-prompt').value;
        const roleExample = document.getElementById('role-example').value;
        
        // 创建自定义角色
        const customRole = {
            id: 'custom_' + Date.now(),
            name: roleName,
            description: roleDescription,
            prompt: rolePrompt,
            example: roleExample
        };
        
        // 保存到本地存储
        saveCustomRole(customRole);
        
        // 设置为当前角色
        setCurrentRole(customRole.id);
        
        // 关闭模态框并显示成功消息
        customRoleModal.classList.remove('show');
        showMessage(`已创建并切换到${roleName}角色`, 'success');
        
        // 重置表单
        customRoleForm.reset();
    });
    
    // 保存自定义角色到本地存储
    function saveCustomRole(role) {
        let customRoles = JSON.parse(localStorage.getItem('customRoles') || '[]');
        customRoles.push(role);
        localStorage.setItem('customRoles', JSON.stringify(customRoles));
    }
    
    // 设置当前角色
    function setCurrentRole(roleId) {
        currentRole = roleId;
        localStorage.setItem('currentRole', roleId);
    }
    
    // 发送消息
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 网络状态监控
    let isOnline = navigator.onLine;
    let pendingMessage = null;

    // 监听网络状态变化
    window.addEventListener('online', function() {
        isOnline = true;
        showMessage('网络已恢复', 'success');
        
        // 如果有待发送的消息，自动重发
        if (pendingMessage) {
            showMessage('正在重新发送上一条消息', 'info');
            const { message, file } = pendingMessage;
            sendMessageToAI(message, file);
            pendingMessage = null;
        }
    });

    window.addEventListener('offline', function() {
        isOnline = false;
        showMessage('网络已断开，消息将在网络恢复后自动发送', 'error');
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message && !currentUploadedFile) return;
        
        // 添加用户消息到聊天区域
        const currentTime = getCurrentTime();
        addMessage('user', message, currentTime);
        
        // 清空输入框并重置高度
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // 处理文件上传
        let fileData = null;
        if (currentUploadedFile) {
            fileData = currentUploadedFile;
            currentUploadedFile = null;
            uploadPreview.style.display = 'none';
            fileUpload.value = '';
        }
        
        // 滚动到底部
        scrollToBottom();
        
        // 检查网络状态
        if (!isOnline) {
            pendingMessage = {
                message: message,
                file: fileData
            };
            showMessage('网络已断开，消息将在网络恢复后自动发送', 'error');
            return;
        }
        
        // 发送消息到AI
        sendMessageToAI(message, fileData);
    }
    
    // 发送消息到AI并处理响应
function sendMessageToAI(message, fileData) {
    // 显示AI正在输入的状态
    const aiAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzRmNDZlNSIvPgogICAgPHRleHQgeD0iMTYiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BSTwvdGV4dD4KPC9zdmc+";
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai-message typing';
    typingIndicator.innerHTML = `
        <div class="message-avatar">
            <img src="${aiAvatar}" alt="AI头像">
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();
    
    // 准备AI回复内容
    let aiResponse = "这是一个模拟的AI响应。在实际应用中，这里应该调用AI API来获取真实的响应。这个响应会逐字显示，模拟真人打字效果。您可以看到文字是如何一个字一个字地出现的，就像有人在实时输入一样。";
    
    // 检查是否需要使用知识库增强回答
    const autoUseKnowledge = document.getElementById('auto-use-knowledge')?.checked || false;
    if (autoUseKnowledge && knowledgeDocuments.length > 0) {
        const relevantDocs = findRelevantDocuments(message);
        if (relevantDocs.length > 0) {
            aiResponse = generateKnowledgeEnhancedResponse(message, relevantDocs);
        }
    }
    
    // 如果有文件上传，添加相关响应
    if (fileData) {
        aiResponse = `我已收到您上传的文件：${fileData.name}。\n${aiResponse}`;
    }
    
    // 根据当前角色调整响应
    if (currentRole !== 'default') {
        const roleName = document.querySelector(`.role-card[data-role="${currentRole}"] h4`)?.textContent || currentRole;
        aiResponse = `[以${roleName}角色回答]\n${aiResponse}`;
    }
    
    // 创建AI消息元素但不立即添加完整内容
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    const messageAvatar = document.createElement('div');
    messageAvatar.className = 'message-avatar';
    messageAvatar.innerHTML = `<img src="${aiAvatar}" alt="AI头像">`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    
    const textParagraph = document.createElement('p');
    textParagraph.textContent = ''; // 初始为空，将逐字填充
    messageText.appendChild(textParagraph);
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    
    // 添加操作按钮
    const actions = document.createElement('div');
    actions.className = 'message-actions';
    actions.innerHTML = `
        <button class="action-btn" title="点赞">
            <i class="fas fa-thumbs-up"></i>
        </button>
        <button class="action-btn" title="点踩">
            <i class="fas fa-thumbs-down"></i>
        </button>
        <button class="action-btn copy-btn" title="复制">
            <i class="fas fa-copy"></i>
        </button>
        <button class="action-btn export-btn" title="导出对话">
            <i class="fas fa-download"></i>
        </button>
        <button class="action-btn speak-btn" title="朗读回复">
            <i class="fas fa-volume-up"></i>
        </button>
    `;
    messageContent.appendChild(actions);
    
    messageDiv.appendChild(messageAvatar);
    messageDiv.appendChild(messageContent);
    
    // 延迟后开始流式输出
    setTimeout(() => {
        // 移除输入指示器
        chatMessages.removeChild(typingIndicator);
        
        // 添加消息元素到聊天区域
        chatMessages.appendChild(messageDiv);
        
        // 为复制按钮添加事件监听
        const copyBtn = actions.querySelector('.copy-btn');
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(textParagraph.textContent)
                .then(() => {
                    showMessage('已复制到剪贴板', 'success');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    showMessage('复制失败', 'error');
                });
        });
        
        // 为导出按钮添加事件监听
        const exportBtn = actions.querySelector('.export-btn');
        exportBtn.addEventListener('click', function() {
            showExportOptions(messageDiv);
        });
        
        // 为朗读按钮添加事件监听
        const speakBtn = actions.querySelector('.speak-btn');
        speakBtn.addEventListener('click', function() {
            speakText(textParagraph.textContent);
        });
        
        // 流式输出文本
        let index = 0;
        const characters = aiResponse.split('');
        
        function typeNextChar() {
            if (index < characters.length) {
                textParagraph.textContent += characters[index];
                index++;
                scrollToBottom();
                
                // 随机延迟，模拟真实打字速度
                const delay = Math.floor(Math.random() * 30) + 20; // 20-50ms
                setTimeout(typeNextChar, delay);
            } else {
                // 打字完成后保存聊天记录
                saveChatToHistory();
                
                // 如果启用了自动朗读，则自动朗读回复
                if (autoSpeakEnabled) {
                    speakText(textParagraph.textContent);
                }
            }
        }
        
        // 开始打字
        typeNextChar();
    }, 1000);
}

// 查找与用户消息相关的知识文档
function findRelevantDocuments(message) {
    // 在实际应用中，这里应该使用向量搜索或其他相关性算法
    // 这里使用简单的关键词匹配作为示例
    const threshold = parseInt(document.getElementById('knowledge-threshold')?.value || '70') / 100;
    
    return knowledgeDocuments.filter(doc => {
        // 简单的相关性检查：检查文档名称是否包含消息中的关键词
        const keywords = message.toLowerCase().split(/\s+/);
        const docName = doc.name.toLowerCase();
        
        // 计算匹配的关键词数量
        const matchCount = keywords.filter(keyword => 
            keyword.length > 3 && docName.includes(keyword)
        ).length;
        
        // 计算相关性分数
        const relevanceScore = keywords.length > 0 ? matchCount / keywords.length : 0;
        
        return relevanceScore >= threshold;
    });
}

// 使用语音合成API朗读文本
function speakText(text) {
    // 如果当前正在朗读，先停止
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音参数
    utterance.lang = 'zh-CN'; // 设置语言为中文
    utterance.rate = 1.0;     // 语速 (0.1 到 10)
    utterance.pitch = 1.0;    // 音调 (0 到 2)
    utterance.volume = 1.0;   // 音量 (0 到 1)
    
    // 获取可用的语音
    const voices = speechSynthesis.getVoices();
    
    // 尝试找到中文语音
    const chineseVoice = voices.find(voice => voice.lang.includes('zh'));
    if (chineseVoice) {
        utterance.voice = chineseVoice;
    }
    
    // 添加事件监听器
    utterance.onstart = function() {
        console.log('开始朗读');
        // 可以在这里添加UI反馈，例如显示一个朗读指示器
        document.querySelectorAll('.speak-btn').forEach(btn => {
            btn.classList.add('speaking');
        });
    };
    
    utterance.onend = function() {
        console.log('朗读结束');
        // 移除UI反馈
        document.querySelectorAll('.speak-btn').forEach(btn => {
            btn.classList.remove('speaking');
        });
    };
    
    utterance.onerror = function(event) {
        console.error('朗读错误:', event);
        document.querySelectorAll('.speak-btn').forEach(btn => {
            btn.classList.remove('speaking');
        });
    };
    
    // 开始朗读
    speechSynthesis.speak(utterance);
}

// 生成基于知识库的增强回复
function generateKnowledgeEnhancedResponse(message, relevantDocs) {
    // 在实际应用中，这里应该使用LLM基于知识文档生成回复
    // 这里使用简单的模板作为示例
    
    const docNames = relevantDocs.map(doc => doc.name).join('、');
    
    return `根据您的问题，我找到了以下相关知识文档：${docNames}。\n\n基于这些文档的内容，我可以告诉您：这是一个基于知识库增强的回答。在实际应用中，这里应该是AI根据知识文档内容生成的详细回答。知识库功能可以显著提高AI回答的准确性和相关性，特别是对于特定领域的专业问题。`;
}
    
    function addMessage(type, text, time) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const userAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzEwYjk4MSIvPgogICAgPHRleHQgeD0iMTYiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VPC90ZXh0Pgo8L3N2Zz4=";
        const aiAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgZmlsbD0iIzRmNDZlNSIvPgogICAgPHRleHQgeD0iMTYiIHk9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BSTwvdGV4dD4KPC9zdmc+";
        
        const avatar = type === 'user' ? userAvatar : aiAvatar;
        
        // 创建消息容器
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // 创建消息头像
        const messageAvatar = document.createElement('div');
        messageAvatar.className = 'message-avatar';
        messageAvatar.innerHTML = `<img src="${avatar}" alt="${type === 'user' ? '用户' : 'AI'}头像">`;
        
        // 创建消息文本区域
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        // 检查是否有文件上传
        if (currentUploadedFile && type === 'user') {
            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview';
            
            if (currentUploadedFile.type.startsWith('image/')) {
                // 图片预览
                const img = document.createElement('img');
                img.className = 'uploaded-image';
                const reader = new FileReader();
                reader.onload = function(e) {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(currentUploadedFile);
                filePreview.appendChild(img);
            } else {
                // 文档预览
                filePreview.innerHTML = `
                    <div class="file-icon"><i class="fas fa-file-alt"></i></div>
                    <div class="file-name">${currentUploadedFile.name}</div>
                `;
            }
            
            messageText.appendChild(filePreview);
        }
        
        // 添加文本内容
        const textParagraph = document.createElement('p');
        textParagraph.textContent = text;
        messageText.appendChild(textParagraph);
        
        // 创建时间标记
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = time;
        
        // 组装消息内容
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        // 如果是AI消息，添加操作按钮
        if (type === 'ai') {
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            actions.innerHTML = `
                <button class="action-btn" title="点赞">
                    <i class="fas fa-thumbs-up"></i>
                </button>
                <button class="action-btn" title="点踩">
                    <i class="fas fa-thumbs-down"></i>
                </button>
                <button class="action-btn copy-btn" title="复制">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn export-btn" title="导出对话">
                    <i class="fas fa-download"></i>
                </button>
            `;
            messageContent.appendChild(actions);
            
            // 为复制按钮添加事件监听
            const copyBtn = actions.querySelector('.copy-btn');
            copyBtn.addEventListener('click', function() {
                const textToCopy = textParagraph.textContent;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showMessage('已复制到剪贴板');
                    })
                    .catch(err => {
                        console.error('复制失败:', err);
                        showMessage('复制失败', 'error');
                    });
            });
            
            // 为导出按钮添加事件监听
            const exportBtn = actions.querySelector('.export-btn');
            exportBtn.addEventListener('click', function() {
                showExportOptions(messageDiv);
            });
        }
        
        // 组装完整消息
        messageDiv.appendChild(messageAvatar);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
    }
    
    // 显示导出选项
    function showExportOptions(messageElement) {
        // 创建导出选项弹出框
        const exportOptions = document.createElement('div');
        exportOptions.className = 'export-options';
        exportOptions.innerHTML = `
            <div class="export-header">导出对话</div>
            <div class="export-body">
                <button class="export-option" data-format="txt">
                    <i class="fas fa-file-alt"></i> 导出为TXT
                </button>
                <button class="export-option" data-format="pdf">
                    <i class="fas fa-file-pdf"></i> 导出为PDF
                </button>
            </div>
        `;
        
        // 定位弹出框
        const rect = messageElement.getBoundingClientRect();
        exportOptions.style.position = 'absolute';
        exportOptions.style.top = `${rect.bottom + window.scrollY}px`;
        exportOptions.style.right = '20px';
        exportOptions.style.zIndex = '1000';
        
        // 添加到页面
        document.body.appendChild(exportOptions);
        
        // 添加点击事件
        const exportButtons = exportOptions.querySelectorAll('.export-option');
        exportButtons.forEach(button => {
            button.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                exportChat(format);
                document.body.removeChild(exportOptions);
            });
        });
        
        // 点击其他区域关闭弹出框
        document.addEventListener('click', function closeExport(e) {
            if (!exportOptions.contains(e.target) && !messageElement.contains(e.target)) {
                if (document.body.contains(exportOptions)) {
                    document.body.removeChild(exportOptions);
                }
                document.removeEventListener('click', closeExport);
            }
        });
    }
    
    // 导出聊天记录
    function exportChat(format) {
        // 获取所有聊天消息
        const messages = Array.from(chatMessages.querySelectorAll('.message'));
        let content = '聊天记录\n\n';
        
        messages.forEach(message => {
            const isUser = message.classList.contains('user-message');
            const sender = isUser ? '用户' : 'AI';
            const text = message.querySelector('.message-text p').textContent;
            const time = message.querySelector('.message-time').textContent;
            
            content += `${sender} (${time}):\n${text}\n\n`;
        });
        
        if (format === 'txt') {
            // 导出为TXT
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `聊天记录_${new Date().toISOString().slice(0, 10)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showMessage('聊天记录已导出为TXT文件', 'success');
        } else if (format === 'pdf') {
            // 导出为PDF (需要引入额外的库，这里使用模拟方式)
            showMessage('PDF导出功能即将上线', 'info');
        }
    }
    
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // 切换聊天历史
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            historyItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 这里应该有加载对应聊天历史的逻辑
            const title = this.querySelector('.history-title').textContent;
            document.querySelector('.chat-header h2').textContent = title;
        });
    });
    
    // 新对话按钮
    newChatBtn.addEventListener('click', function() {
        // 清空聊天区域
        chatMessages.innerHTML = '';
        // 更新标题
        document.querySelector('.chat-header h2').textContent = '新对话';
        // 显示消息
        showMessage('已创建新对话', 'success');
    });
    
    // 退出登录
    const logoutBtn = document.querySelector('.menu-item:last-child');
    logoutBtn.addEventListener('click', function() {
        // 这里应该有退出登录的逻辑
        window.location.href = 'index.html';
    });
    
    // 个人资料菜单项
    const profileMenuItem = document.querySelector('.user-menu .menu-item:first-child');
    profileMenuItem.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });
    
    // 设置菜单项
    const settingsMenuItem = document.querySelector('.user-menu .menu-item:nth-child(2)');
    settingsMenuItem.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });
    
    // 退出登录菜单项
    const logoutMenuItem = document.querySelector('.user-menu .menu-item:last-child');
    logoutMenuItem.addEventListener('click', function() {
        showMessage('正在退出登录...', 'info');
        setTimeout(function() {
            // 清除用户登录信息
            localStorage.removeItem('isLoggedIn');
            // 跳转到登录页面
            window.location.href = 'index.html';
        }, 1500);
    });
    
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
    
    // 初始化时滚动到底部
    scrollToBottom();
    
    // 保存聊天记录到历史管理
    function saveChatToHistory() {
        // 获取所有消息
        const messages = [];
        const messageElements = document.querySelectorAll('.message');
        
        messageElements.forEach(element => {
            const isUser = element.classList.contains('user-message');
            const content = element.querySelector('.message-text').textContent;
            const time = new Date().toISOString();
            
            messages.push({
                sender: isUser ? 'user' : 'ai',
                content: content,
                time: time
            });
        });
        
        // 如果有消息，保存到历史管理
        if (messages.length > 0) {
            window.historyManager.save(messages);
        }
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
                    window.location.href = 'dashboard.html';
                } else if (menuType === 'chat') {
                    // 已经在聊天页面，不做操作
                } else if (menuType === 'history') {
                    showMessage('历史记录功能在主页可用', 'info');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else if (menuType === 'favorites') {
                    showMessage('收藏功能即将上线', 'info');
                } else if (menuType === 'settings') {
                    window.location.href = 'profile.html';
                }
            });
        });
    }
});