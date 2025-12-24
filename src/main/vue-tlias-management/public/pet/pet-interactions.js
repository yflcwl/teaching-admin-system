/**
 * 桌面小鸟助手 - 交互模块
 * 负责管理键盘控制、鼠标跟随、拖放等交互功能
 */

class PetInteractions {
    // 构造函数，接收pet实例作为参数
    constructor(pet) {
        // 保存对pet对象的引用
        this.pet = pet;
        // 初始化键盘控制
        this.initKeyboardControls();
    }

    /**
     * 初始化键盘控制
     * 为小鸟添加上下左右移动和其他快捷键
     */
    initKeyboardControls() {
        // 监听键盘按下事件
        document.addEventListener('keydown', (e) => {
            // 获取宠物容器
            const container = document.getElementById(this.pet.config.containerId);

            // 检查容器是否存在且当前焦点在容器内
            // 注意：这里使用closest检查当前焦点元素是否在容器内，但通常宠物容器不是可聚焦元素
            // 这个判断逻辑可能需要调整，或者直接移除焦点判断
            if (!container || !document.activeElement.closest(`#${this.pet.config.containerId}`)) {
                return;
            }

            // 将按键转换为小写进行比较
            switch(e.key.toLowerCase()) {
                // 上方向键或W键 - 向上移动
                case 'arrowup':
                case 'w':
                    this.movePet(0, -10);  // Y坐标减少10px（向上）
                    break;

                // 下方向键或S键 - 向下移动
                case 'arrowdown':
                case 's':
                    this.movePet(0, 10);   // Y坐标增加10px（向下）
                    break;

                // 左方向键或A键 - 向左移动
                case 'arrowleft':
                case 'a':
                    this.movePet(-10, 0);  // X坐标减少10px（向左）
                    break;

                // 右方向键或D键 - 向右移动
                case 'arrowright':
                case 'd':
                    this.movePet(10, 0);   // X坐标增加10px（向右）
                    break;

                // 空格键 - 跳跃
                case ' ':
                    e.preventDefault();  // 防止页面滚动
                    this.pet.jump();    // 调用跳跃方法
                    break;

                // F键 - 喂食
                case 'f':
                    this.pet.feed();
                    break;

                // M键 - 随机改变心情
                case 'm':
                    const moods = ['happy', 'sad', 'angry', 'excited'];
                    const randomMood = moods[Math.floor(Math.random() * moods.length)];
                    this.pet.changeMood(randomMood);
                    break;

                // H键 - 隐藏小鸟
                case 'h':
                    this.pet.hide();
                    break;

                // R键 - 显示小鸟
                case 'r':
                    this.pet.show();
                    break;

                // 可以继续添加更多快捷键
            }
        });
    }

    /**
     * 移动宠物
     * @param {number} dx - X方向移动距离（正数向右，负数向左）
     * @param {number} dy - Y方向移动距离（正数向下，负数向上）
     */
    movePet(dx, dy) {
        // 更新位置
        this.pet.state.x += dx;
        this.pet.state.y += dy;

        // 获取容器元素
        const container = this.pet.elements.container.parentElement;

        // 限制X坐标在容器范围内（0到容器宽度-小鸟宽度）
        this.pet.state.x = Math.max(0, Math.min(
            container.clientWidth - this.pet.config.size,
            this.pet.state.x
        ));

        // 限制Y坐标在容器范围内（0到容器高度-小鸟高度）
        this.pet.state.y = Math.max(0, Math.min(
            container.clientHeight - this.pet.config.size,
            this.pet.state.y
        ));

        // 更新小鸟的实际显示位置
        this.pet.updatePosition();
    }

    /**
     * 启用鼠标跟随
     * 小鸟会轻微地跟随鼠标移动，类似"注视"鼠标的效果
     */
    enableMouseFollow() {
        const container = this.pet.elements.container.parentElement;

        // 监听鼠标在容器内的移动
        container.addEventListener('mousemove', (e) => {
            // 如果正在拖拽或睡觉中，不执行跟随
            if (this.pet.state.isDragging || this.pet.state.isSleeping) return;

            // 获取容器相对于视口的位置
            const rect = container.getBoundingClientRect();
            // 计算鼠标在容器内的相对坐标
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // 计算小鸟的中心点坐标
            const birdCenterX = this.pet.state.x + this.pet.config.size / 2;
            const birdCenterY = this.pet.state.y + this.pet.config.size / 2;

            // 计算鼠标与小鸟中心的距离差
            const dx = mouseX - birdCenterX;
            const dy = mouseY - birdCenterY;

            // 小鸟轻微跟随鼠标移动（乘以0.01使移动平缓）
            this.pet.state.x += dx * 0.01;
            this.pet.state.y += dy * 0.01;

            // 限制在容器内
            this.pet.state.x = Math.max(0, Math.min(
                container.clientWidth - this.pet.config.size,
                this.pet.state.x
            ));
            this.pet.state.y = Math.max(0, Math.min(
                container.clientHeight - this.pet.config.size,
                this.pet.state.y
            ));

            // 更新位置
            this.pet.updatePosition();

            // 眼睛跟随鼠标移动
            this.updateEyeDirection(dx, dy);
        });
    }

    /**
     * 更新眼睛方向
     * 让小鸟的眼睛"看"向鼠标位置
     * @param {number} dx - 鼠标与小鸟中心的X距离
     * @param {number} dy - 鼠标与小鸟中心的Y距离
     */
    updateEyeDirection(dx, dy) {
        // 计算眼睛的最大偏移量（小鸟大小的2%）
        const eyeOffset = this.pet.config.size * 0.02;

        // 计算眼睛应该偏移的量，限制在最大偏移范围内
        // 乘以0.1使偏移平缓，不是完全跟随鼠标
        const eyeMoveX = Math.max(-eyeOffset, Math.min(eyeOffset, dx * 0.1));
        const eyeMoveY = Math.max(-eyeOffset, Math.min(eyeOffset, dy * 0.1));

        // 确保眼睛元素存在
        if (this.pet.elements.eyeLeft && this.pet.elements.eyeRight) {
            // 左眼的原始位置（从左边25%的位置开始）
            const leftEyeOriginalX = this.pet.config.size * 0.25;
            // 右眼的原始位置（从右边25%的位置开始，但需要转换坐标）
            // 注意：右眼使用的是right属性，所以计算方式不同
            const rightEyeOriginalX = this.pet.config.size * 0.75 - this.pet.config.size * 0.15;
            // 眼睛的Y位置（从顶部25%的位置）
            const eyeOriginalY = this.pet.config.size * 0.25;

            // 计算应用偏移后的位置
            const leftEyeX = leftEyeOriginalX + eyeMoveX;
            const rightEyeX = rightEyeOriginalX + eyeMoveX;
            const eyeY = eyeOriginalY + eyeMoveY;

            // 应用偏移到左眼
            this.pet.elements.eyeLeft.style.left = `${leftEyeX}px`;
            this.pet.elements.eyeLeft.style.top = `${eyeY}px`;

            // 应用偏移到右眼
            // 注意：右眼使用right属性，所以需要重新计算
            // 小鸟总宽度 - 右眼新位置 = right属性的值
            this.pet.elements.eyeRight.style.right =
                `${this.pet.config.size - rightEyeX - this.pet.config.size * 0.15}px`;
            this.pet.elements.eyeRight.style.top = `${eyeY}px`;
        }
    }

    /**
     * 添加拖放区
     * 允许将小鸟拖放到指定区域
     * @param {string} selector - 拖放区的CSS选择器
     * @param {Function} onDropCallback - 拖放完成的回调函数
     */
    addDropZone(selector, onDropCallback) {
        const dropZone = document.querySelector(selector);
        if (!dropZone) return;  // 如果拖放区不存在，直接返回

        // 当拖动元素进入拖放区时
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();  // 必须调用，允许放置
            dropZone.style.backgroundColor = '#e3f2fd';  // 高亮显示拖放区
        });

        // 当拖动元素离开拖放区时
        dropZone.addEventListener('dragleave', () => {
            dropZone.style.backgroundColor = '';  // 恢复原始背景色
        });

        // 当在拖放区释放拖动元素时
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();  // 阻止浏览器默认行为
            dropZone.style.backgroundColor = '';  // 恢复背景色

            // 如果有回调函数，执行它
            if (onDropCallback) {
                onDropCallback();
            }

            // 小鸟说话反馈
            this.pet.speak('放到这里了！', 1500);
        });

        // 使小鸟可拖动
        this.makePetDraggable();
    }

    /**
     * 使宠物可拖动到其他区域
     * 实现HTML5的拖放API
     */
    makePetDraggable() {
        // 设置元素为可拖动
        this.pet.elements.container.draggable = true;

        // 拖动开始事件
        this.pet.elements.container.addEventListener('dragstart', (e) => {
            // 设置拖动的数据类型（必须设置至少一种格式的数据）
            e.dataTransfer.setData('text/plain', 'pet');
            // 设置拖动状态
            this.pet.state.isDragging = true;
            // 小鸟说话
            this.pet.speak('带我去别的地方！', 1500);
        });

        // 拖动结束事件
        this.pet.elements.container.addEventListener('dragend', () => {
            this.pet.state.isDragging = false;  // 清除拖动状态
        });
    }

    /**
     * 创建互动按钮
     * 在指定容器中添加控制小鸟的按钮
     * @param {string} containerSelector - 按钮容器的CSS选择器
     */
    createInteractionButtons(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;  // 如果容器不存在，直接返回

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'pet-interaction-buttons';
        buttonContainer.style.display = 'flex';      // 弹性布局
        buttonContainer.style.gap = '10px';          // 按钮间距
        buttonContainer.style.marginTop = '10px';    // 上边距

        // 按钮配置数组
        const buttons = [
            { text: '喂食', icon: '🍪', action: () => this.pet.feed() },
            { text: '跳舞', icon: '💃', action: () => this.pet.dance() },
            { text: '睡觉', icon: '😴', action: () => this.pet.sleep() },
            { text: '叫醒', icon: '⏰', action: () => this.pet.wakeUp() },
            { text: '开心', icon: '😊', action: () => this.pet.changeMood('happy') },
            { text: '隐藏', icon: '👻', action: () => this.pet.hide() }
        ];

        // 为每个按钮配置创建按钮元素
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = 'pet-interaction-btn';
            // 设置按钮内容（图标+文字）
            button.innerHTML = `${btn.icon} ${btn.text}`;

            // 按钮样式
            button.style.padding = '8px 12px';
            button.style.border = '1px solid #ddd';
            button.style.borderRadius = '6px';
            button.style.backgroundColor = 'white';
            button.style.cursor = 'pointer';
            button.style.fontSize = '12px';

            // 添加点击事件
            button.addEventListener('click', btn.action);

            // 将按钮添加到容器
            buttonContainer.appendChild(button);
        });

        // 将按钮容器添加到指定容器
        container.appendChild(buttonContainer);
    }
}

// ========== 将交互系统集成到DesktopPet类中 ==========

/**
 * 初始化宠物交互系统
 */
DesktopPet.prototype.initInteractions = function() {
    this.interactionSystem = new PetInteractions(this);
};

/**
 * 启用鼠标跟随的便捷方法
 */
DesktopPet.prototype.enableMouseFollow = function() {
    if (this.interactionSystem) {
        this.interactionSystem.enableMouseFollow();
    }
};

/**
 * 添加拖放区的便捷方法
 * @param {string} selector - 拖放区选择器
 * @param {Function} callback - 回调函数
 */
DesktopPet.prototype.addDropZone = function(selector, callback) {
    if (this.interactionSystem) {
        this.interactionSystem.addDropZone(selector, callback);
    }
};

/**
 * 创建互动按钮的便捷方法
 * @param {string} selector - 按钮容器选择器
 */
DesktopPet.prototype.createInteractionButtons = function(selector) {
    if (this.interactionSystem) {
        this.interactionSystem.createInteractionButtons(selector);
    }
};