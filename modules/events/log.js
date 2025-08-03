module.exports.config = {
    name: "log",
    eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
    version: "1.0.0",
    credits: "Mirai Team",
    description: "Ghi lại thông báo các hoạt động của bot!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;

    const botID = api.getCurrentUserID();
    const { allThreadID, threadInfo } = global.data;

    // Kiểm tra xem nhóm có bị vô hiệu hóa log không
    for (const singleThread of allThreadID) {
        const thread = global.data.threadData.get(singleThread) || {};
        if (thread.log === false) return;
    }

    // Lấy thông tin nhóm
    let threadInfoData = threadInfo.get(event.threadID);
    let nameThread = threadInfoData?.threadName || "Tên không tồn tại";

    try {
        const threadInfoApi = await api.getThreadInfo(event.threadID);
        nameThread = threadInfoApi.threadName || "Tên không tồn tại";
        threadInfo.set(event.threadID, threadInfoApi); // Cập nhật threadInfo
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin nhóm ${event.threadID} tại ${global.time.getTime('fullTime')}:`, error);
    }

    // Lấy tên người dùng
    const nameUser = global.data.userName.get(event.author) || (await Users.getNameUser(event.author)) || "Không xác định";

    // Sử dụng thời gian từ utils/time.js
    const time = global.time.getTime("fullTime"); // HH:mm:ss DD/MM/YYYY

    const formReport = "『 🌸 』 Thông báo Thêm/Kick 『 🌸 』" +
        "\n\n『 🌸 』 Box name: " + nameThread +
        "\n『 🌸 』 Thread ID: " + event.threadID +
        "\n『 🌸 』 Hành động: {task}" +
        "\n『 🌸 』 Tên người dùng: " + nameUser +
        "\n『 🌸 』 UserID: " + event.author +
        "\n\n『 🌸 』 Time: " + time;

    let task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const newName = event.logMessageData.name || "Tên không tồn tại";
            task = `Người dùng thay đổi tên nhóm thành ${newName}`;
            await Threads.setData(event.threadID, { name: newName });
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
                task = "『 🌸 』 Người dùng đã thêm bot vào một nhóm mới";
            }
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == botID) {
                if (event.senderID == botID) return;
                const data = (await Threads.getData(event.threadID)).data || {};
                data.banned = true;
                const reason = "[『 🌸 』 Kích bot tự do, không xin phép";
                data.reason = reason;
                data.dateAdded = time;
                await Threads.setData(event.threadID, { data });
                global.data.threadBanned.set(event.threadID, { reason: data.reason, dateAdded: data.dateAdded });
                task = "『 🌸 』 Người dùng đã kick bot ra khỏi nhóm";
            }
            break;
        }
        default:
            break;
    }

    if (task.length == 0) return;

    const finalReport = formReport.replace(/\{task}/g, task);

    return api.sendMessage(finalReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) {
            logger(finalReport, "Logging Event");
        }
    });
};