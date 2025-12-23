/**
 * 桌面小鸟助手 - 消息系统
 * 负责管理小鸟的各种对话消息和智能响应
 */

class PetMessages {
    // 构造函数，接收pet实例作为参数
    constructor(pet) {
        // 保存对pet对象的引用
        this.pet = pet;

        // 消息池 - 分类存储各种类型的消息
        this.messagePools = {
            // 问候语消息池
            greetings: [
                '你好！我是{name}！',        // 包含变量{name}
                '欢迎回来！',
                '今天过得怎么样？',
                '需要我帮忙吗？',
                '见到你真高兴！😊'
            ],

            // 基于时间的消息池（根据一天中的不同时段）
            timeBased: {
                morning: [    // 早晨（5:00-12:00）
                    '早上好！新的一天开始了！',
                    '早餐吃了吗？',
                    '今天也要加油哦！'
                ],
                afternoon: [  // 下午（12:00-18:00）
                    '下午好！工作还顺利吗？',
                    '喝杯茶休息一下吧',
                    '阳光真好啊'
                ],
                evening: [    // 晚上（18:00-22:00）
                    '晚上好！',
                    '今天辛苦了',
                    '该休息一下了'
                ],
                night: [      // 夜晚（22:00-5:00）
                    '这么晚了还不睡？',
                    '晚安！好梦',
                    '我要去睡觉了 Zzz'
                ]
            },

            // API相关消息池
            apiRelated: {
                loading: [    // 加载中
                    '正在努力加载数据...',
                    '请稍等一下',
                    '马上就好'
                ],
                success: [    // 成功
                    '成功啦！🎉',
                    '干得漂亮！',
                    '一切顺利！'
                ],
                error: [      // 错误
                    '出错了...😟',
                    '好像有点问题',
                    '再试一次吧'
                ]
            },

            // 随机消息池
            random: [
                '我喜欢唱歌！',
                '外面的天气怎么样？',
                '你最喜欢什么颜色？',
                '我会飞哦！',
                '猜猜我在想什么？',
                '今天是个好日子！',
                '让我们一起玩吧！',
                '我有点饿了...',
                '时间过得真快！',
                '保持微笑！😄'
            ]
        };
    }

    /**
     * 随机说话
     * @param {string} category - 消息类别，默认'random'
     */
    speakRandom(category = 'random') {
        let messages = [];  // 存储要选择的消息数组

        // 根据类别选择不同的消息池
        if (category === 'time') {
            // 获取基于当前时间的消息
            messages = this.getTimeBasedMessages();
        } else if (this.messagePools[category]) {
            // 如果指定的类别存在，使用该类别消息
            messages = this.messagePools[category];
        } else {
            // 默认使用随机消息池
            messages = this.messagePools.random;
        }

        // 如果有可用消息
        if (messages.length > 0) {
            // 随机选择一条消息
            let message = messages[Math.floor(Math.random() * messages.length)];
            // 替换消息中的变量（如{name}）
            message = this.replaceVariables(message);
            // 让小鸟说出消息，显示3秒
            this.pet.speak(message, 3000);
        }
    }

    /**
     * 获取基于时间的消息
     * 根据当前时间返回合适的消息数组
     * @returns {Array} 时间对应的消息数组
     */
    getTimeBasedMessages() {
        const hour = new Date().getHours();  // 获取当前小时（0-23）

        // 根据小时范围返回不同的消息
        if (hour >= 5 && hour < 12) {
            // 早晨：5:00-12:00
            return this.messagePools.timeBased.morning;
        } else if (hour >= 12 && hour < 18) {
            // 下午：12:00-18:00
            return this.messagePools.timeBased.afternoon;
        } else if (hour >= 18 && hour < 22) {
            // 晚上：18:00-22:00
            return this.messagePools.timeBased.evening;
        } else {
            // 夜晚：22:00-5:00
            return this.messagePools.timeBased.night;
        }
    }

    /**
     * 替换消息中的变量
     * 将消息中的占位符替换为实际值
     * @param {string} message - 原始消息
     * @returns {string} 替换后的消息
     */
    replaceVariables(message) {
        // 使用链式替换所有变量
        return message
            // 替换{name}为小鸟的名字
            .replace(/{name}/g, this.pet.config.name)
            // 替换{time}为当前时间（中文格式，如"14:30"）
            .replace(/{time}/g, new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',   // 2位小时
                minute: '2-digit'  // 2位分钟
            }))
            // 替换{date}为当前日期（中文格式，如"2024/12/17"）
            .replace(/{date}/g, new Date().toLocaleDateString('zh-CN'));
    }

    /**
     * 添加自定义消息
     * 允许动态添加新的消息到指定类别
     * @param {string} category - 消息类别
     * @param {string} message - 消息内容
     */
    addMessage(category, message) {
        // 如果类别不存在，创建空数组
        if (!this.messagePools[category]) {
            this.messagePools[category] = [];
        }
        // 将消息添加到指定类别
        this.messagePools[category].push(message);
    }

    /**
     * API响应消息
     * 根据API调用结果生成合适的反馈消息
     * @param {string} apiName - API接口名称（如"部门列表"）
     * @param {Object} data - API响应数据
     */
    speakForApiResponse(apiName, data) {
        let message = '';

        // 判断API调用是否成功（假设code=1表示成功）
        if (data && data.code === 1) {
            // 成功消息数组
            const successMessages = [
                `成功获取${apiName}数据！`,                // 通用成功消息
                `${apiName}接口调用成功`,                 // 接口名称反馈
                `收到了${data.data ? (data.data.length || 1) : 0}条数据`  // 数据量反馈
            ];
            // 随机选择一条成功消息
            message = successMessages[Math.floor(Math.random() * successMessages.length)];
        } else {
            // 错误消息数组
            const errorMessages = [
                `${apiName}接口好像出错了`,               // 具体接口错误
                '获取数据失败，检查一下吧',               // 通用错误消息
                '网络好像不太稳定'                       // 网络相关错误
            ];
            // 随机选择一条错误消息
            message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        }

        // 让小鸟说出消息，显示2.5秒
        this.pet.speak(message, 2500);
    }

    /**
     * 根据数据量生成反应
     * 根据数据条数给出不同的反馈
     * @param {number} count - 数据条数
     */
    reactToDataCount(count) {
        let reaction = '';

        // 根据数据量范围选择不同的反应
        if (count === 0) {
            reaction = '没有数据呢...';
        } else if (count < 5) {
            reaction = '数据不多呢';
        } else if (count < 20) {
            reaction = '数据量刚好！';
        } else if (count < 100) {
            reaction = '好多数据啊！';
        } else {
            reaction = '数据量爆炸了！';
        }

        // 让小鸟说出反应，显示2秒
        this.pet.speak(reaction, 2000);
    }
}

// ========== 将消息系统集成到DesktopPet类中 ==========

/**
 * 初始化宠物消息系统
 */
DesktopPet.prototype.initMessages = function() {
    this.messageSystem = new PetMessages(this);
};

/**
 * 随机说话的便捷方法
 * @param {string} category - 消息类别
 */
DesktopPet.prototype.speakRandom = function(category) {
    if (this.messageSystem) {
        this.messageSystem.speakRandom(category);
    }
};

/**
 * API响应消息的便捷方法
 * @param {string} apiName - API接口名称
 * @param {Object} data - 响应数据
 */
DesktopPet.prototype.speakForApiResponse = function(apiName, data) {
    if (this.messageSystem) {
        this.messageSystem.speakForApiResponse(apiName, data);
    }
};

/**
 * 数据量反应的便捷方法
 * @param {number} count - 数据条数
 */
DesktopPet.prototype.reactToDataCount = function(count) {
    if (this.messageSystem) {
        this.messageSystem.reactToDataCount(count);
    }
};