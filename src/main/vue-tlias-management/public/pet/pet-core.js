/**
 * 桌面小鸟助手 - 核心模块
 * 版本: 1.0.0
 * 这是一个完整的桌面宠物实现，包含小鸟的创建、交互和行为管理
 */

class DesktopPet {
    // 构造函数，初始化小鸟的配置和状态
    constructor() {
        // 默认配置对象
        this.config = {
            containerId: 'pet-container',           // 容器元素的ID
            name: '小鸟助手',                        // 小鸟的名字
            size: 80,                               // 小鸟的大小（像素）
            speed: 2,                               // 移动速度
            enableSound: false,                     // 是否启用声音
            autoWander: true,                       // 是否自动漫游
            mood: 'normal',                         // 初始心情
            colors: {                               // 颜色配置
                body: '#FFCC00',                    // 身体颜色（黄色）
                beak: '#FF9900',                    // 鸟嘴颜色（橙色）
                eye: '#000000',                     // 眼睛颜色（黑色）
                wing: '#FFAA00'                     // 翅膀颜色（浅橙色）
            }
        };

        // 小鸟的状态对象
        this.state = {
            x: 100,                                 // X坐标
            y: 100,                                 // Y坐标
            direction: 1,                           // 移动方向（1表示右，-1表示左）
            isDragging: false,                      // 是否正在被拖拽
            isSleeping: false,                      // 是否在睡觉
            isEating: false,                        // 是否在吃东西
            health: 100,                            // 健康值（0-100）
            happiness: 100,                         // 快乐值（0-100）
            energy: 100,                            // 能量值（0-100）
            speechBubble: null,                     // 对话气泡引用（将在createBirdElements中设置）
            speechTimeout: null                     // 说话气泡的定时器
        };

        // 存储DOM元素的引用
        this.elements = {};
        // 存储声音对象（如果启用声音）
        this.sounds = {};
        // 消息历史记录
        this.messages = [];
    }

    /**
     * 初始化小鸟
     * @param {Object} options 配置选项，可以覆盖默认配置
     */
    init(options = {}) {
        // 合并传入的配置到默认配置
        Object.assign(this.config, options);

        // 获取容器元素
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            console.error(`容器 #${this.config.containerId} 不存在`);
            return;
        }

        // 清空容器内容
        container.innerHTML = '';
        // 设置容器样式
        container.style.position = 'relative';      // 相对定位，作为小鸟的定位参考
        container.style.width = '100%';             // 宽度100%
        container.style.height = '500px';           // 固定高度500px
        container.style.overflow = 'hidden';        // 隐藏超出部分

        // 创建小鸟的DOM元素
        this.createBirdElements(container);

        // 设置初始位置（放在右下角）
        this.state.x = container.clientWidth - this.config.size - 50;
        this.state.y = container.clientHeight - this.config.size - 50;
        this.updatePosition();                      // 更新显示位置

        // 初始化事件监听器
        this.initEventListeners();

        // 初始化行为系统
        this.initBehaviors();

        // 如果启用声音，初始化声音系统
        if (this.config.enableSound) {
            this.initSounds();
        }

        // 保存到全局，方便调试和访问
        window.desktopPet = this;

        console.log(`🐦 ${this.config.name} 已初始化`);
    }

    /**
     * 创建小鸟的DOM元素
     * 这个方法构建小鸟的所有视觉元素
     */
    createBirdElements(container) {
        // 小鸟容器 - 包裹所有小鸟元素的div
        const birdContainer = document.createElement('div');
        birdContainer.className = 'desktop-pet';    // CSS类名
        birdContainer.style.position = 'absolute';  // 绝对定位
        birdContainer.style.cursor = 'pointer';     // 鼠标指针样式
        birdContainer.style.transition = 'all 0.3s ease'; // 过渡动画效果

        // 小鸟身体 - 主要的外形
        const birdBody = document.createElement('div');
        birdBody.className = 'pet-body';
        birdBody.style.width = `${this.config.size}px`;            // 宽度
        birdBody.style.height = `${this.config.size}px`;           // 高度
        birdBody.style.backgroundColor = this.config.colors.body;  // 身体颜色
        birdBody.style.borderRadius = '50%';                       // 圆形
        birdBody.style.position = 'relative';                      // 相对定位
        birdBody.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';   // 阴影效果

        // 左眼睛
        const eyeLeft = document.createElement('div');
        eyeLeft.className = 'pet-eye pet-eye-left';
        eyeLeft.style.position = 'absolute';
        eyeLeft.style.width = `${this.config.size * 0.15}px`;      // 眼睛大小占身体的15%
        eyeLeft.style.height = `${this.config.size * 0.15}px`;
        eyeLeft.style.backgroundColor = this.config.colors.eye;
        eyeLeft.style.borderRadius = '50%';                        // 圆形眼睛
        eyeLeft.style.top = `${this.config.size * 0.25}px`;        // 距离顶部25%
        eyeLeft.style.left = `${this.config.size * 0.25}px`;       // 距离左边25%

        // 右眼睛
        const eyeRight = document.createElement('div');
        eyeRight.className = 'pet-eye pet-eye-right';
        eyeRight.style.position = 'absolute';
        eyeRight.style.width = `${this.config.size * 0.15}px`;
        eyeRight.style.height = `${this.config.size * 0.15}px`;
        eyeRight.style.backgroundColor = this.config.colors.eye;
        eyeRight.style.borderRadius = '50%';
        eyeRight.style.top = `${this.config.size * 0.25}px`;
        eyeRight.style.right = `${this.config.size * 0.25}px`;     // 距离右边25%

        // 鸟嘴 - 使用三角形实现
        const beak = document.createElement('div');
        beak.className = 'pet-beak';
        beak.style.position = 'absolute';
        beak.style.width = '0';                                    // 三角形技巧：宽度为0
        beak.style.height = '0';                                   // 三角形技巧：高度为0
        beak.style.borderLeft = `${this.config.size * 0.1}px solid transparent`;    // 左边透明
        beak.style.borderRight = `${this.config.size * 0.1}px solid transparent`;   // 右边透明
        beak.style.borderBottom = `${this.config.size * 0.15}px solid ${this.config.colors.beak}`;  // 底边为鸟嘴颜色
        beak.style.bottom = `${this.config.size * 0.15}px`;        // 距离底部15%
        beak.style.left = '50%';                                   // 水平居中
        beak.style.transform = 'translateX(-50%)';                 // 向左移动自身宽度的一半，实现居中

        // 左翅膀
        const wingLeft = document.createElement('div');
        wingLeft.className = 'pet-wing pet-wing-left';
        wingLeft.style.position = 'absolute';
        wingLeft.style.width = `${this.config.size * 0.4}px`;      // 翅膀宽度占身体的40%
        wingLeft.style.height = `${this.config.size * 0.2}px`;     // 翅膀高度占身体的20%
        wingLeft.style.backgroundColor = this.config.colors.wing;
        wingLeft.style.borderRadius = '50%';                       // 椭圆形翅膀
        wingLeft.style.bottom = `${this.config.size * 0.1}px`;     // 距离底部10%
        wingLeft.style.left = `${this.config.size * -0.1}px`;      // 向左延伸10%，超出身体

        // 右翅膀
        const wingRight = document.createElement('div');
        wingRight.className = 'pet-wing pet-wing-right';
        wingRight.style.position = 'absolute';
        wingRight.style.width = `${this.config.size * 0.4}px`;
        wingRight.style.height = `${this.config.size * 0.2}px`;
        wingRight.style.backgroundColor = this.config.colors.wing;
        wingRight.style.borderRadius = '50%';
        wingRight.style.bottom = `${this.config.size * 0.1}px`;
        wingRight.style.right = `${this.config.size * -0.1}px`;    // 向右延伸10%，超出身体

        // 组装小鸟：将各个部分添加到身体中
        birdBody.appendChild(eyeLeft);
        birdBody.appendChild(eyeRight);
        birdBody.appendChild(beak);
        birdBody.appendChild(wingLeft);
        birdBody.appendChild(wingRight);
        birdContainer.appendChild(birdBody);                       // 将身体添加到容器

        // 对话气泡 - 用于显示小鸟说话
        const speechBubble = document.createElement('div');
        speechBubble.className = 'pet-speech-bubble';
        speechBubble.style.position = 'absolute';
        speechBubble.style.bottom = `${this.config.size + 10}px`;  // 在小鸟身体下方10px
        speechBubble.style.left = '50%';                           // 水平居中
        speechBubble.style.transform = 'translateX(-50%)';         // 向左平移一半宽度，实现居中
        speechBubble.style.backgroundColor = 'white';              // 白色背景
        speechBubble.style.padding = '8px 12px';                   // 内边距
        speechBubble.style.borderRadius = '12px';                  // 圆角
        speechBubble.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)'; // 阴影
        speechBubble.style.fontSize = '12px';                      // 字体大小
        speechBubble.style.display = 'none';                       // 默认隐藏
        speechBubble.style.zIndex = '1000';                        // 确保在最上层
        speechBubble.style.minWidth = '80px';                      // 最小宽度
        speechBubble.style.maxWidth = '200px';                     // 最大宽度
        speechBubble.style.textAlign = 'center';                   // 文字居中

        // 气泡箭头 - 指向小鸟的三角箭头
        const bubbleArrow = document.createElement('div');
        bubbleArrow.style.position = 'absolute';
        bubbleArrow.style.top = '100%';                            // 在气泡底部
        bubbleArrow.style.left = '50%';                            // 水平居中
        bubbleArrow.style.transform = 'translateX(-50%)';          // 向左平移一半
        bubbleArrow.style.width = '0';                             // 三角形技巧
        bubbleArrow.style.height = '0';                            // 三角形技巧
        bubbleArrow.style.borderLeft = '8px solid transparent';    // 左边透明
        bubbleArrow.style.borderRight = '8px solid transparent';   // 右边透明
        bubbleArrow.style.borderTop = '8px solid white';           // 上边白色，形成向下箭头

        speechBubble.appendChild(bubbleArrow);
        birdContainer.appendChild(speechBubble);                    // 将气泡添加到容器

        // 将小鸟容器添加到页面容器
        container.appendChild(birdContainer);

        // 保存DOM元素引用，方便后续操作
        this.elements = {
            container: birdContainer,    // 小鸟整体容器
            body: birdBody,              // 小鸟身体
            eyeLeft,                     // 左眼
            eyeRight,                    // 右眼
            beak,                        // 鸟嘴
            wingLeft,                    // 左翅膀
            wingRight,                   // 右翅膀
            speechBubble                 // 对话气泡
        };

        // 添加CSS动画定义
        this.addCssAnimations();
    }

    /**
     * 添加CSS动画
     * 创建并注入包含所有动画关键帧的style标签
     */
    addCssAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            /* 翅膀扇动动画 */
            @keyframes pet-flap {
                0% { transform: translateY(0) rotate(0deg); }      // 初始位置
                50% { transform: translateY(-5px) rotate(10deg); } // 向上移动并旋转
                100% { transform: translateY(0) rotate(0deg); }    // 回到原位
            }

            /* 跳跃动画 */
            @keyframes pet-bounce {
                0%, 100% { transform: translateY(0); }             // 起始和结束位置
                50% { transform: translateY(-20px); }              // 跳到最高点
            }

            /* 摇摆动画（跳舞用） */
            @keyframes pet-shake {
                0%, 100% { transform: rotate(0deg); }              // 水平位置
                25% { transform: rotate(5deg); }                   // 向右倾斜
                75% { transform: rotate(-5deg); }                  // 向左倾斜
            }

            /* 睡觉动画（呼吸效果） */
            @keyframes pet-sleep {
                0%, 100% { transform: scale(1); opacity: 1; }      // 正常大小和透明度
                50% { transform: scale(0.95); opacity: 0.8; }      // 轻微缩小和变透明
            }

            /* 应用翅膀扇动动画 */
            .pet-wing-left, .pet-wing-right {
                animation: pet-flap 0.6s infinite alternate;       // 0.6秒无限循环，交替方向
            }

            /* 睡觉状态应用呼吸动画 */
            .pet-sleeping {
                animation: pet-sleep 2s infinite;                  // 2秒无限循环
                opacity: 0.8;                                      // 稍微透明
            }

            /* 跳舞状态应用摇摆动画 */
            .pet-dancing {
                animation: pet-shake 0.5s infinite;                // 0.5秒无限循环
            }

            /* 吃东西状态应用跳跃动画 */
            .pet-eating {
                animation: pet-bounce 0.3s ease-in-out;            // 0.3秒缓入缓出
            }
        `;
        document.head.appendChild(style);                          // 将样式添加到页面头部
    }

    /**
     * 初始化事件监听
     * 设置鼠标和点击事件处理
     */
    initEventListeners() {
        const pet = this.elements.container;  // 获取小鸟容器

        // 鼠标按下事件 - 开始拖动
        pet.addEventListener('mousedown', (e) => {
            this.state.isDragging = true;     // 设置拖拽状态
            pet.style.cursor = 'grabbing';    // 改变鼠标样式为抓取手
            this.speak('带我去兜风吧！', 1500); // 说话
            e.preventDefault();               // 阻止默认行为（如选择文本）
        });

        // 鼠标移动事件 - 处理拖动
        document.addEventListener('mousemove', (e) => {
            if (!this.state.isDragging) return;  // 如果不是拖拽状态，返回

            const container = pet.parentElement;               // 获取父容器
            const rect = container.getBoundingClientRect();    // 获取容器相对于视口的位置

            // 计算小鸟中心点应该在鼠标位置
            this.state.x = e.clientX - rect.left - this.config.size / 2;
            this.state.y = e.clientY - rect.top - this.config.size / 2;

            // 限制在容器边界内
            this.state.x = Math.max(0, Math.min(container.clientWidth - this.config.size, this.state.x));
            this.state.y = Math.max(0, Math.min(container.clientHeight - this.config.size, this.state.y));

            this.updatePosition();  // 更新显示位置
        });

        // 鼠标松开事件 - 停止拖动
        document.addEventListener('mouseup', () => {
            if (this.state.isDragging) {
                this.state.isDragging = false;      // 清除拖拽状态
                pet.style.cursor = 'pointer';       // 恢复鼠标样式
                this.speak('这里风景不错！', 1500); // 说话
            }
        });

        // 点击事件 - 互动
        pet.addEventListener('click', (e) => {
            if (this.state.isDragging) return;  // 如果是拖拽结束的点击，不处理

            // 双击事件 - 跳起来
            if (e.detail === 2) {
                this.jump();
                return;
            }

            // 单击事件 - 随机说话
            const messages = [
                '你好呀！',
                '点击我干嘛？',
                '需要帮忙吗？',
                '今天天气真好！',
                '我是一只快乐的小鸟'
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            this.speak(randomMsg, 2000);
        });

        // 右键菜单事件
        pet.addEventListener('contextmenu', (e) => {
            e.preventDefault();  // 阻止浏览器默认右键菜单
            this.showContextMenu(e.clientX, e.clientY);  // 显示自定义右键菜单
        });
    }

    /**
     * 显示上下文菜单（右键菜单）
     * @param {number} x - 菜单的X坐标
     * @param {number} y - 菜单的Y坐标
     */
    showContextMenu(x, y) {
        // 移除现有的菜单（如果存在）
        const existingMenu = document.querySelector('.pet-context-menu');
        if (existingMenu) existingMenu.remove();

        // 创建菜单容器
        const menu = document.createElement('div');
        menu.className = 'pet-context-menu';
        menu.style.position = 'fixed';                            // 固定定位
        menu.style.left = `${x}px`;                               // 设置X位置
        menu.style.top = `${y}px`;                                // 设置Y位置
        menu.style.backgroundColor = 'white';                     // 白色背景
        menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';      // 阴影
        menu.style.borderRadius = '8px';                          // 圆角
        menu.style.padding = '10px 0';                            // 内边距
        menu.style.zIndex = '9999';                               // 最高层级
        menu.style.minWidth = '150px';                            // 最小宽度

        // 菜单项定义
        const items = [
            { text: '喂食', action: () => this.feed() },
            { text: '跳舞', action: () => this.dance() },
            { text: '睡觉', action: () => this.sleep() },
            { text: '叫醒', action: () => this.wakeUp() },
            { text: '设置心情', action: () => this.changeMood('happy') },
            { text: '显示状态', action: () => this.showStatus() },
            { text: '隐藏小鸟', action: () => this.hide() },
            { text: '显示小鸟', action: () => this.show() }
        ];

        // 创建每个菜单项
        items.forEach(item => {
            const button = document.createElement('button');
            button.textContent = item.text;
            button.style.display = 'block';              // 块级显示
            button.style.width = '100%';                 // 宽度100%
            button.style.padding = '8px 15px';           // 内边距
            button.style.border = 'none';                // 无边框
            button.style.background = 'none';            // 透明背景
            button.style.textAlign = 'left';             // 文字左对齐
            button.style.cursor = 'pointer';             // 指针样式
            button.style.fontSize = '14px';              // 字体大小

            // 鼠标悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#f5f5f5';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = 'transparent';
            });

            // 点击事件
            button.addEventListener('click', () => {
                item.action();      // 执行菜单项对应的动作
                menu.remove();      // 移除菜单
            });

            menu.appendChild(button);
        });

        document.body.appendChild(menu);  // 将菜单添加到页面

        // 点击其他地方关闭菜单
        const closeMenu = () => {
            menu.remove();                       // 移除菜单
            document.removeEventListener('click', closeMenu);  // 移除事件监听
        };

        // 延迟添加点击事件，避免立即触发
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 10);
    }

    /**
     * 更新小鸟的位置
     * 根据state中的坐标更新CSS位置
     */
    updatePosition() {
        const pet = this.elements.container;
        pet.style.left = `${this.state.x}px`;  // 设置左边距
        pet.style.top = `${this.state.y}px`;   // 设置上边距
    }

    /**
     * 小鸟跳跃
     */
    jump() {
        if (this.state.isSleeping) return;  // 睡觉时不跳跃

        const pet = this.elements.container;
        const originalY = this.state.y;      // 保存原始Y坐标

        // 向上跳跃50px
        this.state.y -= 50;
        this.updatePosition();

        // 添加跳跃动画（向上快速）
        pet.style.transition = 'top 0.2s ease-out';

        // 200毫秒后回弹到原位
        setTimeout(() => {
            this.state.y = originalY;
            this.updatePosition();
            pet.style.transition = 'top 0.3s ease-in';  // 回弹较慢
        }, 200);

        // 500毫秒后恢复默认过渡
        setTimeout(() => {
            pet.style.transition = 'all 0.3s ease';
        }, 500);

        this.speak('哇！跳得好高！', 1500);  // 跳跃时说话
    }

    /**
     * 小鸟说话
     * @param {string} message - 要显示的消息
     * @param {number} duration - 显示持续时间（毫秒）
     */
    speak(message, duration = 3000) {
        const bubble = this.elements.speechBubble;

        // 清除之前设置的定时器（避免消息重叠）
        if (this.state.speechTimeout) {
            clearTimeout(this.state.speechTimeout);
        }

        // 设置新消息
        bubble.textContent = message;
        bubble.style.display = 'block';  // 显示气泡

        // 设置定时器自动隐藏气泡
        this.state.speechTimeout = setTimeout(() => {
            bubble.style.display = 'none';
        }, duration);

        // 记录消息历史
        this.messages.push({
            time: new Date(),    // 消息时间
            message: message     // 消息内容
        });

        // 控制台输出（方便调试）
        console.log(`🐦 ${this.config.name}: ${message}`);
    }

    /**
     * 初始化声音系统
     * 注意：需要添加实际的音频文件
     */
    initSounds() {
        // 可以使用Web Audio API或简单的audio元素
        console.log('声音系统已初始化（需要添加音频文件）');
    }

    /**
     * 显示小鸟状态
     */
    showStatus() {
        const status = `
            名字: ${this.config.name}
            健康: ${this.state.health}%
            快乐: ${this.state.happiness}%
            能量: ${this.state.energy}%
            状态: ${this.state.isSleeping ? '睡觉中' : '清醒'}
            心情: ${this.config.mood}
        `;

        this.speak(status, 5000);  // 显示5秒
    }

    /**
     * 隐藏小鸟
     */
    hide() {
        this.elements.container.style.display = 'none';  // 隐藏整个容器
        this.speak('我躲起来啦！', 2000);
    }

    /**
     * 显示小鸟
     */
    show() {
        this.elements.container.style.display = 'block';  // 显示容器
        this.speak('我回来啦！', 2000);
    }

    /**
     * 获取小鸟的当前状态（副本）
     * @returns {Object} 小鸟状态的副本
     */
    getState() {
        return { ...this.state };  // 返回状态的浅拷贝，防止外部修改内部状态
    }

    /**
     * 获取配置（副本）
     * @returns {Object} 配置的副本
     */
    getConfig() {
        return { ...this.config };  // 返回配置的浅拷贝
    }
}

// 导出到全局命名空间，以便在HTML中直接使用
if (typeof window !== 'undefined') {
    window.DesktopPet = DesktopPet;  // 将DesktopPet类挂载到window对象
}