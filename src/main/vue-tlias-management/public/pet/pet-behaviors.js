/**
 * 桌面小鸟助手 - 行为模块
 * 负责管理小鸟的日常行为和状态变化
 */

class PetBehaviors {
    // 构造函数，接收pet实例作为参数
    constructor(pet) {
        // 保存对pet对象的引用
        this.pet = pet;
        // 行为定时器存储对象，用于管理各种行为的定时器
        this.behaviors = {
            wander: null,  // 漫游定时器
            sleep: null,   // 睡眠定时器
            idle: null     // 空闲行为定时器
        };
    }

    /**
     * 初始化行为系统
     * 设置小鸟的基本行为模式
     */
    init() {
        console.log('🐦 行为系统已初始化');

        // 如果配置中启用了自动漫游
        if (this.pet.config.autoWander) {
            // 开始自动漫游行为
            this.startWandering();
        }

        // 开始空闲时的随机行为
        this.startIdleBehavior();

        // 开始能量消耗（模拟真实生物的能量系统）
        this.startEnergyConsumption();
    }

    /**
     * 开始自动漫游
     * 让小鸟在屏幕上随机移动
     */
    startWandering() {
        // 如果已有漫游定时器，先清除
        if (this.behaviors.wander) {
            clearInterval(this.behaviors.wander);
        }

        // 设置每100ms执行一次的漫游定时器
        this.behaviors.wander = setInterval(() => {
            // 如果正在拖拽或睡觉中，不执行漫游
            if (this.pet.state.isDragging || this.pet.state.isSleeping) return;

            // 随机生成X、Y方向的移动距离（-speed到+speed之间）
            const moveX = (Math.random() - 0.5) * this.pet.config.speed * 2;
            const moveY = (Math.random() - 0.5) * this.pet.config.speed * 2;

            // 更新位置
            this.pet.state.x += moveX;
            this.pet.state.y += moveY;

            // 获取容器元素，确保小鸟不会移出容器边界
            const container = this.pet.elements.container.parentElement;
            // 限制X坐标在容器范围内
            this.pet.state.x = Math.max(0, Math.min(
                container.clientWidth - this.pet.config.size,  // 最大X坐标
                this.pet.state.x
            ));
            // 限制Y坐标在容器范围内
            this.pet.state.y = Math.max(0, Math.min(
                container.clientHeight - this.pet.config.size, // 最大Y坐标
                this.pet.state.y
            ));

            // 更新小鸟的显示位置
            this.pet.updatePosition();

            // 10%的概率改变移动方向（通过调整direction状态）
            if (Math.random() > 0.9) {
                this.pet.state.direction *= -1;
            }

        }, 100); // 每100毫秒执行一次
    }

    /**
     * 停止漫游
     */
    stopWandering() {
        if (this.behaviors.wander) {
            clearInterval(this.behaviors.wander);
            this.behaviors.wander = null;  // 清除定时器引用
        }
    }

    /**
     * 开始空闲行为
     * 小鸟在空闲时随机做一些动作
     */
    startIdleBehavior() {
        // 每5秒检查一次是否执行空闲行为
        this.behaviors.idle = setInterval(() => {
            // 睡觉或拖拽时不执行空闲行为
            if (this.pet.state.isSleeping || this.pet.state.isDragging) return;

            // 生成随机数决定执行什么行为
            const chance = Math.random();

            if (chance > 0.98) {  // 2%的概率说随机的话
                // 随机话语数组
                const messages = [
                    '有点无聊...',
                    '想找点事情做',
                    '看看窗外',
                    '整理羽毛',
                    '唱首歌吧'
                ];
                // 随机选择一条消息
                const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                // 显示消息2秒
                this.pet.speak(randomMsg, 2000);

            } else if (chance > 0.96) {  // 2%的概率跳跃
                this.pet.jump();

            } else if (chance > 0.94) {  // 2%的概率改变心情
                const moods = ['happy', 'normal', 'curious'];
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                this.pet.changeMood(randomMood);
            }

        }, 5000); // 每5秒执行一次
    }

    /**
     * 喂食
     * 增加小鸟的快乐值和能量
     */
    feed() {
        // 睡觉时不能喂食
        if (this.pet.state.isSleeping) {
            this.pet.speak('Zzz...（睡觉中）', 2000);
            return;
        }

        // 已经在吃食时不能再次喂食
        if (this.pet.state.isEating) return;

        // 设置吃食状态
        this.pet.state.isEating = true;
        // 增加快乐值（最多100）
        this.pet.state.happiness = Math.min(100, this.pet.state.happiness + 20);
        // 增加能量值（最多100）
        this.pet.state.energy = Math.min(100, this.pet.state.energy + 15);

        // 显示食物特效
        this.showFoodEffect();

        // 添加吃食动画类
        this.pet.elements.container.classList.add('pet-eating');

        this.pet.speak('好吃！谢谢！', 2000);

        // 1秒后恢复状态
        setTimeout(() => {
            this.pet.state.isEating = false;
            this.pet.elements.container.classList.remove('pet-eating');
        }, 1000);
    }

    /**
     * 显示食物效果
     * 创建食物粒子特效
     */
    showFoodEffect() {
        const container = this.pet.elements.container.parentElement;

        // 创建5个食物粒子
        for (let i = 0; i < 5; i++) {
            // 每个粒子延迟出现，形成序列效果
            setTimeout(() => {
                const food = document.createElement('div');
                food.className = 'pet-food-effect';
                // 随机位置（-20px到+20px之间）
                food.style.left = `${Math.random() * 40 - 20}px`;
                food.style.top = `${Math.random() * 40 - 20}px`;
                // 随机颜色（黄色系）
                food.style.backgroundColor = `hsl(${Math.random() * 60 + 10}, 100%, 60%)`;

                // 添加到小鸟容器中
                this.pet.elements.container.appendChild(food);

                // 1秒后移除粒子
                setTimeout(() => {
                    food.remove();
                }, 1000);
            }, i * 100); // 每个粒子延迟100ms
        }
    }

    /**
     * 跳舞
     * 消耗能量，大幅增加快乐值
     */
    dance() {
        // 睡觉时不能跳舞
        if (this.pet.state.isSleeping) {
            this.pet.speak('Zzz...（睡觉中）', 2000);
            return;
        }

        // 能量不足时不能跳舞
        if (this.pet.state.energy < 20) {
            this.pet.speak('太累了，跳不动了...', 2000);
            return;
        }

        // 添加跳舞动画类
        this.pet.elements.container.classList.add('pet-dancing');

        this.pet.speak('一起跳舞吧！💃', 3000);
        // 大幅增加快乐值
        this.pet.state.happiness = Math.min(100, this.pet.state.happiness + 30);
        // 消耗能量
        this.pet.state.energy = Math.max(0, this.pet.state.energy - 20);

        // 显示爱心特效
        this.showHeartEffect();

        // 3秒后停止跳舞
        setTimeout(() => {
            this.pet.elements.container.classList.remove('pet-dancing');
            this.pet.speak('跳得好开心！', 2000);
        }, 3000);
    }

    /**
     * 显示爱心效果
     * 跳舞时显示的爱心特效
     */
    showHeartEffect() {
        const container = this.pet.elements.container.parentElement;

        // 创建3个爱心
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'pet-heart-effect';
                heart.textContent = '❤️';  // 爱心表情
                // 随机位置
                heart.style.left = `${Math.random() * 40 - 20}px`;
                heart.style.top = `${Math.random() * 40 - 20}px`;

                this.pet.elements.container.appendChild(heart);

                // 1.5秒后移除爱心
                setTimeout(() => {
                    heart.remove();
                }, 1500);
            }, i * 500);  // 每个爱心延迟500ms
        }
    }

    /**
     * 睡觉
     * 恢复能量，停止其他行为
     */
    sleep() {
        // 已经在睡觉时不做处理
        if (this.pet.state.isSleeping) {
            this.pet.speak('我已经在睡觉了...', 2000);
            return;
        }

        // 设置睡觉状态
        this.pet.state.isSleeping = true;
        // 添加睡觉动画类
        this.pet.elements.container.classList.add('pet-sleeping');
        this.pet.speak('Zzz... 我要睡觉了', 2000);

        // 停止漫游
        this.stopWandering();

        // 设置睡眠时能量恢复定时器（每3秒恢复5点能量）
        const sleepRecovery = setInterval(() => {
            // 如果醒来，停止恢复
            if (!this.pet.state.isSleeping) {
                clearInterval(sleepRecovery);
                return;
            }

            // 恢复能量
            this.pet.state.energy = Math.min(100, this.pet.state.energy + 5);

            // 能量满了自动醒来
            if (this.pet.state.energy >= 100) {
                this.wakeUp();
            }
        }, 3000);

        // 保存恢复计时器引用
        this.behaviors.sleep = sleepRecovery;
    }

    /**
     * 叫醒
     * 结束睡眠状态，恢复行为
     */
    wakeUp() {
        // 不在睡觉时不做处理
        if (!this.pet.state.isSleeping) {
            this.pet.speak('我已经醒着啦！', 2000);
            return;
        }

        // 清除睡觉状态
        this.pet.state.isSleeping = false;
        // 移除睡觉动画类
        this.pet.elements.container.classList.remove('pet-sleeping');

        // 停止能量恢复定时器
        if (this.behaviors.sleep) {
            clearInterval(this.behaviors.sleep);
            this.behaviors.sleep = null;
        }

        // 如果配置了自动漫游，恢复漫游
        if (this.pet.config.autoWander) {
            this.startWandering();
        }

        this.pet.speak('早上好！睡得好香～', 2000);
    }

    /**
     * 改变心情
     * @param {string} mood - 心情类型
     */
    changeMood(mood) {
        // 有效心情列表
        const validMoods = ['happy', 'normal', 'sad', 'angry', 'excited', 'curious'];

        // 检查心情是否有效
        if (!validMoods.includes(mood)) {
            console.warn(`无效的心情: ${mood}`);
            return;
        }

        // 更新配置中的心情
        this.pet.config.mood = mood;

        // 移除之前的所有心情类
        validMoods.forEach(m => {
            this.pet.elements.body.classList.remove(`pet-${m}`);
        });

        // 添加新的心情类
        this.pet.elements.body.classList.add(`pet-${mood}`);

        // 根据心情调整颜色
        this.adjustColorByMood(mood);

        // 说话反馈当前心情
        this.pet.speak(`我现在感觉${this.getMoodText(mood)}`, 2000);
    }

    /**
     * 根据心情调整颜色
     * 不同心情对应不同颜色主题
     */
    adjustColorByMood(mood) {
        // 心情对应的颜色配置
        const colors = {
            happy: { body: '#FFCC00', beak: '#FF9900' },      // 开心 - 亮黄色
            sad: { body: '#CCCCCC', beak: '#AAAAAA' },       // 难过 - 灰色
            angry: { body: '#FF3300', beak: '#CC0000' },     // 生气 - 红色
            excited: { body: '#FF00CC', beak: '#CC0099' },   // 兴奋 - 粉色
            curious: { body: '#00CCFF', beak: '#0099CC' },   // 好奇 - 蓝色
            normal: { body: '#FFCC00', beak: '#FF9900' }     // 普通 - 黄色
        };

        // 如果心情有对应的颜色配置，应用颜色
        if (colors[mood]) {
            this.pet.elements.body.style.backgroundColor = colors[mood].body;
            this.pet.elements.beak.style.borderBottomColor = colors[mood].beak;
        }
    }

    /**
     * 获取心情文本描述
     */
    getMoodText(mood) {
        const moodTexts = {
            happy: '很开心！😊',
            normal: '还好',
            sad: '有点难过...😢',
            angry: '很生气！😠',
            excited: '很兴奋！🎉',
            curious: '很好奇？🤔'
        };

        return moodTexts[mood] || '普通';
    }

    /**
     * 开始能量消耗
     * 模拟真实生物的能量消耗系统
     */
    startEnergyConsumption() {
        // 每10秒执行一次能量消耗
        setInterval(() => {
            // 睡觉时不消耗能量
            if (this.pet.state.isSleeping) return;

            // 根据状态决定消耗速度：拖拽时消耗2点，其他情况消耗1点
            const consumption = this.pet.state.isDragging ? 2 : 1;
            this.pet.state.energy = Math.max(0, this.pet.state.energy - consumption);

            // 低能量提醒（30%以下能量）
            if (this.pet.state.energy < 30 && this.pet.state.energy > 0) {
                // 10%的概率提醒
                if (Math.random() > 0.9) {
                    this.pet.speak('有点累了...', 2000);
                }
            }

            // 能量耗尽自动睡觉
            if (this.pet.state.energy <= 0 && !this.pet.state.isSleeping) {
                this.pet.speak('太困了...我要睡觉了...', 2000);
                setTimeout(() => this.sleep(), 1000);
            }

            // 随时间缓慢恢复快乐值（20%的概率每10秒恢复1点）
            if (this.pet.state.happiness < 100 && Math.random() > 0.8) {
                this.pet.state.happiness = Math.min(100, this.pet.state.happiness + 1);
            }

        }, 10000); // 每10秒执行一次
    }

    /**
     * 响应API事件
     * 根据API调用结果调整小鸟行为
     */
    respondToApiEvent(event, data) {
        switch (event) {
            case 'api_success':
                this.pet.speak('接口调用成功！🎉', 2000);
                this.changeMood('happy');
                break;

            case 'api_error':
                this.pet.speak('接口出错了...😟', 2000);
                this.changeMood('sad');
                break;

            case 'api_loading':
                this.pet.speak('正在加载数据...⏳', 2000);
                this.changeMood('curious');
                break;

            case 'data_loaded':
                // 根据数据量决定反应
                if (data && data.count > 10) {
                    this.pet.speak(`加载了${data.count}条数据，好多呀！`, 3000);
                    this.dance();  // 数据多时跳舞庆祝
                } else {
                    this.pet.speak('数据加载完成！', 2000);
                }
                break;

            default:
                console.log(`🐦 收到未知API事件: ${event}`);
        }
    }
}

// ========== 将行为系统集成到DesktopPet类中 ==========

/**
 * 初始化宠物行为系统
 */
DesktopPet.prototype.initBehaviors = function() {
    this.behaviorSystem = new PetBehaviors(this);
    this.behaviorSystem.init();
};

// 添加便捷方法，方便直接调用行为

/**
 * 喂食的便捷方法
 */
DesktopPet.prototype.feed = function() {
    if (this.behaviorSystem) {
        this.behaviorSystem.feed();
    }
};

/**
 * 跳舞的便捷方法
 */
DesktopPet.prototype.dance = function() {
    if (this.behaviorSystem) {
        this.behaviorSystem.dance();
    }
};

/**
 * 睡觉的便捷方法
 */
DesktopPet.prototype.sleep = function() {
    if (this.behaviorSystem) {
        this.behaviorSystem.sleep();
    }
};

/**
 * 叫醒的便捷方法
 */
DesktopPet.prototype.wakeUp = function() {
    if (this.behaviorSystem) {
        this.behaviorSystem.wakeUp();
    }
};

/**
 * 改变心情的便捷方法
 * @param {string} mood - 心情类型
 */
DesktopPet.prototype.changeMood = function(mood) {
    if (this.behaviorSystem) {
        this.behaviorSystem.changeMood(mood);
    }
};