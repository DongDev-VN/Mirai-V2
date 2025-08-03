const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require('@dongdev/fca-unofficial');
const fs = require('fs-extra');

// Thêm global.nodemodule
global.nodemodule = {
    "fs-extra": require("fs-extra"),
    "path": require("path"),
    "moment-timezone": require("moment-timezone"),
    "string-similarity": require("string-similarity")
};

// Thêm time module
global.time = require("./utils/time.js");

if (!fs.existsSync('./utils/data')) {
    fs.mkdirSync('./utils/data', { recursive: true });
}

global.client = {
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: [],
    handleReaction: [],
    handleReply: [],
    mainPath: process.cwd(),
    configPath: "",
    getTime: global.time.getTime
};

global.data = {
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: [],
    allUserID: [],
    allCurrenciesID: [],
    allThreadID: []
};

global.utils = require("./utils/func.js");
global.config = require('./config.json');
global.configModule = {};
global.moduleData = [];
global.language = {};

const langFile = readFileSync(`${__dirname}/languages/${global.config.language || "vi"}.lang`, { encoding: 'utf-8' }).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (!global.language[head]) global.language[head] = {};
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Không tìm thấy khóa ngôn ngữ: ${args[0]}`;
    let text = langText[args[0]][args[1]];
    for (let i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
};

function onBot({ models }) {
    login({ appState: global.utils.parseCookies(fs.readFileSync('./cookie.txt', 'utf8')) }, async (loginError, api) => {
        if (loginError) return console.error(`Lỗi đăng nhập: ${loginError}`);
        api.setOptions(global.config.FCAOption);
        writeFileSync('./utils/data/fbstate.json', JSON.stringify(api.getAppState(), null, 2));
        global.config.version = '3.0.0';
        global.client.timeStart = new Date().getTime();
        global.client.api = api;
        const userId = api.getCurrentUserID();
        const user = await api.getUserInfo([userId]);
        const userName = user[userId]?.name || 'Không xác định';
        logger(`Đăng nhập thành công - ${userName} (${userId}) tại ${global.time.getTime('fullTime')}`, '[ ĐĂNG NHẬP ]');
        console.log(require('chalk').red("[ Ryan ] Kích hoạt thành công"));

        const loadModules = (path, collection, disabledList, type) => {
            const items = readdirSync(path).filter(file => file.endsWith('.js') && !file.includes('example') && !disabledList.includes(file));
            let loadedCount = 0;
            for (const file of items) {
                try {
                    const item = require(join(path, file));
                    const { config, run, onLoad, handleEvent } = item;
                    if (!config || !run || (type === 'commands' && !config.commandCategory)) {
                        throw new Error(`Lỗi định dạng trong ${type === 'commands' ? 'lệnh' : 'sự kiện'}: ${file}`);
                    }
                    if (global.client[collection].has(config.name)) {
                        throw new Error(`Tên ${type === 'commands' ? 'lệnh' : 'sự kiện'} đã tồn tại: ${config.name}`);
                    }
                    if (config.envConfig) {
                        global.configModule[config.name] = global.configModule[config.name] || {};
                        global.config[config.name] = global.config[config.name] || {};
                        for (const key in config.envConfig) {
                            global.configModule[config.name][key] = global.config[config.name][key] || config.envConfig[key] || '';
                            global.config[config.name][key] = global.configModule[config.name][key];
                        }
                    }
                    if (onLoad) onLoad({ api, models });
                    if (handleEvent) global.client.eventRegistered.push(config.name);
                    global.client[collection].set(config.name, item);
                    loadedCount++;
                } catch (error) {
                    console.error(`Lỗi khi tải ${type === 'commands' ? 'lệnh' : 'sự kiện'} ${file}:`, error.stack);
                }
            }
            if (loadedCount === 0) {
                console.log(`Không tìm thấy ${type === 'commands' ? 'lệnh' : 'sự kiện'} nào trong thư mục ${path}`);
            }
            return loadedCount;
        };

        const commandPath = join(global.client.mainPath, 'modules', 'commands');
        const eventPath = join(global.client.mainPath, 'modules', 'events');
        const loadedCommandsCount = loadModules(commandPath, 'commands', global.config.commandDisabled, 'commands');
        logger.loader(`Tải thành công ${loadedCommandsCount} lệnh tại ${global.time.getTime('fullTime')}`);
        const loadedEventsCount = loadModules(eventPath, 'events', global.config.eventDisabled, 'events');
        logger.loader(`Tải thành công ${loadedEventsCount} sự kiện tại ${global.time.getTime('fullTime')}`);

        logger.loader(`Thời gian tải nguồn: ${(Date.now() - global.client.timeStart)}ms`);
        writeFileSync('./config.json', JSON.stringify(global.config, null, 4), 'utf8');

        const listener = require('./includes/listen.js')({ api, models });
        
        function listenerCallback(error, event) {
            if (error) {
                if (JSON.stringify(error).includes("601051028565049")) {
                    const form = {
                        av: api.getCurrentUserID(),
                        fb_api_caller_class: "RelayModern",
                        fb_api_req_friendly_name: "FBScrapingWarningMutation",
                        variables: "{}",
                        server_timestamps: "true",
                        doc_id: "6339492849481770",
                    };
                    api.httpPost("https://www.facebook.com/api/graphql/", form, (e, i) => {
                        const res = JSON.parse(i);
                        if (e || res.errors) return logger("Lỗi: Không thể xóa cảnh cáo từ Facebook.", "lỗi");
                        if (res.data.fb_scraping_warning_clear.success) {
                            logger(`Xóa cảnh cáo Facebook thành công tại ${global.time.getTime('fullTime')}`, "[ THÀNH CÔNG ]");
                            global.handleListen = api.listenMqtt(listenerCallback);
                            setTimeout(() => (api.mqttClient.end(), connect_mqtt()), 1000 * 60 * 60 * 1);
                            logger("Kết nối MQTT thành công", '[ MQTT ]');
                        }
                    });
                } else {
                    return logger(`Lỗi xử lý sự kiện: ${JSON.stringify(error)}`, "lỗi");
                }
            }
            listener(event);
        }

        function connect_mqtt() {
            global.handleListen = api.listenMqtt(listenerCallback);
            setTimeout(() => (api.mqttClient.end(), connect_mqtt()), 1000 * 60 * 60 * 1);
            logger("Kết nối MQTT thành công", '[ MQTT ]');
        }

        connect_mqtt();
    });
}

(async () => {
    try {
        const { Sequelize, sequelize } = require("./includes/database/index.js");
        await sequelize.authenticate();
        const models = require('./includes/database/model.js')({ Sequelize, sequelize });
        logger("Kết nối cơ sở dữ liệu thành công", '[ CƠ SỞ DỮ LIỆU ]');
        onBot({ models });
    } catch (error) {
        console.error(`Lỗi kết nối cơ sở dữ liệu: ${error}`);
    }
})();

process.on("unhandledRejection", (err, p) => { console.error(`Lỗi không được xử lý: ${err}`) });