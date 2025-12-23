/**
 * 桌面小鸟助手 - 动画系统
 * 负责管理小鸟的所有动画效果
 */

class PetAnimations {
    // 构造函数，接收pet实例作为参数
    constructor(pet) {
        // 保存对pet对象的引用
        this.pet = pet;
        // 创建一个Set来记录当前正在播放的动画（避免重复播放）
        this.currentAnimations = new Set();
    }

    /**
     * 播放动画
     * @param {string} name - 动画名称
     * @param {number} duration - 动画持续时间（毫秒），默认1000ms
     */
    playAnimation(name, duration = 1000) {
        // 如果动画已经在播放中，直接返回，避免重复
        if (this.currentAnimations.has(name)) return;

        // 将动画名称添加到当前动画集合中
        this.currentAnimations.add(name);

        // 获取宠物容器元素
        const petElement = this.pet.elements.container;
        // 添加动画对应的CSS类名（触发动画）
        petElement.classList.add(`pet-animate-${name}`);

        // 设置定时器，在动画结束后移除CSS类
        setTimeout(() => {
            // 移除动画CSS类
            petElement.classList.remove(`pet-animate-${name}`);
            // 从当前动画集合中移除该动画
            this.currentAnimations.delete(name);
        }, duration);
    }

    /**
     * 添加动画CSS样式到页面
     * 这个方法会创建并插入包含所有动画定义的style标签
     */
    addAnimationStyles() {
        // 创建一个style元素来存放动画CSS
        const style = document.createElement('style');
        // 设置style元素的内容（所有动画的CSS定义）
        style.textContent = `
            /* 跳跃动画 */
            .pet-animate-jump {
                animation: pet-jump 0.5s ease-out;
            }

            @keyframes pet-jump {
                0% { transform: translateY(0); }
                50% { transform: translateY(-50px); }
                100% { transform: translateY(0); }
            }

            /* 旋转动画 - 原地旋转360度 */
            .pet-animate-spin {
                animation: pet-spin 1s linear;
            }

            @keyframes pet-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* 缩放动画 - 呼吸效果 */
            .pet-animate-pulse {
                animation: pet-pulse 0.5s ease-in-out;
            }

            @keyframes pet-pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }

            /* 摇摆动画 - 左右摇摆 */
            .pet-animate-wiggle {
                animation: pet-wiggle 0.5s ease-in-out;
            }

            @keyframes pet-wiggle {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(10deg); }
                75% { transform: rotate(-10deg); }
            }

            /* 闪烁动画 - 透明度变化 */
            .pet-animate-blink {
                animation: pet-blink 0.3s ease-in-out;
            }

            @keyframes pet-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }

            /* 庆祝动画 - 复杂的缩放旋转组合 */
            .pet-animate-celebrate {
                animation: pet-celebrate 1s ease-out;
            }

            @keyframes pet-celebrate {
                0% { transform: scale(1); }
                25% { transform: scale(1.3) rotate(10deg); }
                50% { transform: scale(1.1) rotate(-10deg); }
                75% { transform: scale(1.2) rotate(5deg); }
                100% { transform: scale(1); }
            }

            /* 错误动画 - 左右抖动 */
            .pet-animate-error {
                animation: pet-error 0.5s ease-in-out;
            }

            @keyframes pet-error {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }

            /* 加载动画 - 翅膀扇动效果 */
            .pet-animate-loading .pet-wing-left,
            .pet-animate-loading .pet-wing-right {
                animation: pet-loading-flap 0.3s infinite alternate;
            }

            @keyframes pet-loading-flap {
                0% { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(-10px) rotate(20deg); }
            }
        `;
        // 将style元素添加到文档的head部分
        document.head.appendChild(style);
    }

    /**
     * 跳跃动画 - 宠物向上跳起再落下
     */
    jump() {
        this.playAnimation('jump', 500);
    }

    /**
     * 旋转动画 - 宠物原地旋转一圈
     */
    spin() {
        this.playAnimation('spin', 1000);
    }

    /**
     * 脉动动画 - 缩放呼吸效果
     */
    pulse() {
        this.playAnimation('pulse', 500);
    }

    /**
     * 摇摆动画 - 左右摇摆
     */
    wiggle() {
        this.playAnimation('wiggle', 500);
    }

    /**
     * 闪烁动画 - 透明度变化闪烁
     */
    blink() {
        this.playAnimation('blink', 300);
    }

    /**
     * 庆祝动画 - 复杂的庆祝效果
     */
    celebrate() {
        this.playAnimation('celebrate', 1000);

        // 添加额外的庆祝效果（如粒子效果）
        this.createCelebrationEffects();
    }

    /**
     * 错误动画 - 表示错误的抖动效果
     */
    showError() {
        this.playAnimation('error', 500);
    }

    /**
     * 显示/隐藏加载动画
     * @param {boolean} show - 是否显示加载动画
     */
    showLoading(show = true) {
        const petElement = this.pet.elements.container;

        if (show) {
            // 添加加载动画类
            petElement.classList.add('pet-animate-loading');
            // 显示加载提示（0表示不会自动消失）
            this.pet.speak('加载中...', 0);
        } else {
            // 移除加载动画类
            petElement.classList.remove('pet-animate-loading');
            // 隐藏说话气泡
            this.pet.elements.speechBubble.style.display = 'none';
        }
    }

    /**
     * 创建庆祝效果 - 生成粒子效果
     */
    createCelebrationEffects() {
        // 获取宠物的父容器
        const container = this.pet.elements.container.parentElement;

        // 创建10个庆祝粒子效果
        for (let i = 0; i < 10; i++) {
            // 设置延迟，让粒子依次出现
            setTimeout(() => {
                // 创建粒子元素
                const effect = document.createElement('div');
                effect.className = 'pet-celebration-effect';
                // 设置绝对定位
                effect.style.position = 'absolute';
                // 随机设置在宠物周围的位置
                effect.style.left = `${this.pet.state.x + Math.random() * this.pet.config.size}px`;
                effect.style.top = `${this.pet.state.y + Math.random() * this.pet.config.size}px`;
                // 设置粒子大小
                effect.style.width = '20px';
                effect.style.height = '20px';
                // 设置随机颜色
                effect.style.backgroundColor = this.getRandomColor();
                effect.style.borderRadius = '50%'; // 圆形
                // 应用浮动动画
                effect.style.animation = `celebration-float 1s ease-out forwards`;

                // 创建并添加动画关键帧样式
                const style = document.createElement('style');
                // 检查是否已经添加过动画样式
                if (!document.querySelector('#celebration-animation')) {
                    style.id = 'celebration-animation';
                    style.textContent = `
                        @keyframes celebration-float {
                            0% {
                                transform: translate(0, 0) scale(1);
                                opacity: 1;
                            }
                            100% {
                                transform: translate(
                                    ${Math.random() * 100 - 50}px,  // 随机水平位移
                                    ${-Math.random() * 100 - 50}px  // 随机向上位移
                                ) scale(0);  // 逐渐缩小到0
                                opacity: 0;  // 逐渐透明
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                // 将粒子添加到容器中
                container.appendChild(effect);

                // 1秒后移除粒子元素
                setTimeout(() => {
                    effect.remove();
                }, 1000);
            }, i * 100); // 每个粒子延迟100ms出现
        }
    }

    /**
     * 获取随机颜色
     * @returns {string} 随机颜色值
     */
    getRandomColor() {
        // 预定义的颜色数组
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
            '#118AB2', '#EF476F', '#7209B7', '#3A86FF'
        ];
        // 随机选择一个颜色
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * 设置翅膀拍打速度
     * @param {number} speed - 速度值（1-10），1最慢，10最快
     */
    setWingFlapSpeed(speed) {
        // speed: 1-10, 1最慢，10最快
        // 计算动画持续时间：1到10对应1s到0.1s
        const duration = 1 - (speed * 0.09); // 0.1s到1s

        // 创建样式元素来调整翅膀动画速度
        const style = document.createElement('style');
        style.id = 'wing-speed-adjustment';
        style.textContent = `
            .pet-wing-left, .pet-wing-right {
                animation-duration: ${duration}s !important;  // 使用!important确保覆盖原有样式
            }
        `;

        // 移除旧的样式（如果有的话）
        const oldStyle = document.querySelector('#wing-speed-adjustment');
        if (oldStyle) oldStyle.remove();

        // 添加新样式
        document.head.appendChild(style);
    }
}

// ========== 将动画系统集成到DesktopPet类中 ==========

/**
 * 初始化宠物动画系统
 * 这个方法会被DesktopPet类调用
 */
DesktopPet.prototype.initAnimations = function() {
    // 创建动画系统实例
    this.animationSystem = new PetAnimations(this);
    // 添加动画CSS样式
    this.animationSystem.addAnimationStyles();
};

/**
 * 播放指定动画
 * @param {string} name - 动画名称
 * @param {number} duration - 动画持续时间
 */
DesktopPet.prototype.playAnimation = function(name, duration) {
    // 如果有动画系统，调用其playAnimation方法
    if (this.animationSystem) {
        this.animationSystem.playAnimation(name, duration);
    }
};

/**
 * 跳跃动画的便捷方法
 */
DesktopPet.prototype.jumpAnimate = function() {
    if (this.animationSystem) {
        this.animationSystem.jump();
    }
};

/**
 * 庆祝动画的便捷方法
 */
DesktopPet.prototype.celebrate = function() {
    if (this.animationSystem) {
        this.animationSystem.celebrate();
    }
};

/**
 * 显示/隐藏加载动画的便捷方法
 * @param {boolean} show - 是否显示
 */
DesktopPet.prototype.showLoading = function(show) {
    if (this.animationSystem) {
        this.animationSystem.showLoading(show);
    }
};