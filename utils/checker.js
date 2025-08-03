module.exports = {
    // Kiểm tra quyền admin
    isAdmin: async function ({ api, event, Users }) {
        const threadInfo = await api.getThreadInfo(event.threadID);
        return threadInfo.adminIDs.some(admin => admin.id === event.senderID);
    },

    // Kiểm tra lệnh có bị cấm không
    isCommandBanned: function (commandName, threadID) {
        const bannedCommands = global.data.commandBanned.get(threadID) || [];
        return bannedCommands.includes(commandName);
    },

    // Kiểm tra người dùng hoặc nhóm bị cấm
    isBanned: function (userID, threadID) {
        const userBanned = global.data.userBanned.has(userID);
        const threadBanned = global.data.threadBanned.has(threadID);
        return userBanned || threadBanned;
    },

    // Kiểm tra thời gian cooldown của lệnh
    checkCooldown: function (commandName, userID) {
        const cooldowns = global.client.cooldowns.get(`${commandName}_${userID}`) || 0;
        const now = Date.now();
        return now >= cooldowns;
    }
};