module.exports.config = {
    name: "anti",
    eventType: ["log:subscribe", "log:thread-name", "log:unsubscribe", "log:thread-image", "log:thread-icon", "log:user-nickname", "log:thread-admins", "log:thread-color"],
    version: "1.0.0",
    credits: "Niio-team (Vtuan)",
    description: "Anti của nhóm!"
};

const fs = require('fs-extra');
const axios = require('axios');
const antiDir = "./modules/data/anti";
const bd = "./modules/data/anti/antiBietDanh";
const fileAnti = antiDir + '/antiFile.json';
module.exports.run = async function ({ api, event, Threads, Users }) {
    let DataAnti = JSON.parse(fs.readFileSync(fileAnti, 'utf-8'));
    // console.log(DataAnti[event.threadID].namebox)
    const botID = api.getCurrentUserID();
    if (event.logMessageType == "log:thread-name" && DataAnti[event.threadID] && DataAnti[event.threadID].namebox) {
        var threadInf = (await Threads.getData(event.threadID)).threadInfo;
        const findAd = threadInf.adminIDs.find((el) => el.id === event.author);
        if (!findAd || !botID.includes(event.author)) {
            await api.setTitle(DataAnti[event.threadID].namebox, event.threadID);
            await api.sendMessage(`⚠️ Bạn không có quyền đổi tên nhóm`, event.threadID);
        }
    } else if (event.logMessageType == "log:subscribe" && DataAnti[event.threadID] && DataAnti[event.threadID].join) {
        if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) return;
        var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
        for (let idUser of memJoin) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            api.removeUserFromGroup(idUser, event.threadID);
        }
        return api.sendMessage(`⚠️ Thực thi anti người dùng vào nhóm`, event.threadID);
    } else if (event.logMessageType == "log:unsubscribe" && DataAnti[event.threadID] && DataAnti[event.threadID].out) {
        const typeOut = event.author == event.logMessageData.leftParticipantFbId ? "out" : "kick";
        if (typeOut == "out") {
            api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID,
                (error, info) => {
                    if (error) {
                        api.sendMessage(`[ ANTI ] - thực thi antiout\n❎ Không thể thêm lại người dùng!!\nhttps://www.facebook.com/profile.php?id=${event.logMessageData.leftParticipantFbId}`, event.threadID);
                    } else
                        api.sendMessage(`[ ANTI ] - thực thi antiout\n✅ Đã thêm lại thành cônng người dùng vừa thoát\nhttps://www.facebook.com/profile.php?id=${event.logMessageData.leftParticipantFbId}`, event.threadID);
                }
            );
        }
    } else if (event.logMessageType == "log:thread-image" && DataAnti[event.threadID] && DataAnti[event.threadID].avtbox) {
        var threadInf = (await Threads.getData(event.threadID)).threadInfo;
        const findAd = threadInf.adminIDs.find((el) => el.id === event.author);
        if (!event.logMessageData.url && findAd) {
            delete DataAnti[event.threadID][`avtbox`];
            await fs.writeJson(fileAnti, DataAnti, { spaces: 2 });
            api.sendMessage(`Vì quản trị viên đã gỡ avt,bot tự động tắt anti đổi ảnh nhóm`, event.threadID)
        } else if (findAd || botID.includes(event.author)) {
            DataAnti[event.threadID][`avtbox`] = event.logMessageData.url;
            await fs.writeJson(fileAnti, DataAnti, { spaces: 2 });
            // api.sendMessage(`${event.logMessageBody}`, event.threadID)
        } else {
            StopEvents = true;
            const ảnh = DataAnti[event.threadID].avtbox;
            try {
                const response = await axios.get(ảnh, { responseType: "stream" });
                return new Promise(resolve => {
                    api.changeGroupImage(response.data, event.threadID, (err) => {
                        if (err) {
                            console.error(err);
                            api.sendMessage('⚠️ Có lỗi xảy ra khi đổi ảnh nhóm', event.threadID, resolve);
                        } else {
                            api.sendMessage('⚠️ Bạn không có quyền đổi ảnh nhóm', event.threadID, resolve);
                        }
                    });
                    StopEvents = false;
                });
            } catch (error) {
                console.error('Lỗi khi tải ảnh từ URL:', error);
                api.sendMessage('⚠️ Có lỗi xảy ra khi tải ảnh từ URL', event.threadID);
            }
        }
    } else if (event.logMessageType == "log:thread-icon" && DataAnti[event.threadID] && DataAnti[event.threadID].emoji) {
        var threadInf = (await Threads.getData(event.threadID)).threadInfo;
        const findAd = threadInf.adminIDs.find((el) => el.id === event.author);
        if (findAd || botID.includes(event.author)) {
            DataAnti[event.threadID].emoji = event.logMessageData.thread_quick_reaction_emoji;
            await fs.writeJson(fileAnti, DataAnti, { spaces: 2 });
        } else {
            api.changeThreadEmoji(DataAnti[event.threadID].emoji, event.threadID)
            api.sendMessage(`⚠️ Bạn không có quyền đổi emoji`, event.threadID);
        }
    } else if (event.logMessageType === "log:user-nickname") {
        const NNFile = `${bd}/${event.threadID}.json`;
        try {
            const fileExists = await fs.pathExists(NNFile);
            if (fileExists) {
                let read = await fs.readFile(NNFile, 'utf-8');
                let antiData = read ? JSON.parse(read) : {};
                var threadInf = (await Threads.getData(event.threadID)).threadInfo;
                const findAd = threadInf.adminIDs.find((el) => el.id === event.author);
                if (global.config.ADMINBOT.includes(event.author) || findAd || botID.includes(event.author)) {
                    if (!antiData.bietdanh) antiData.bietdanh = {};
                    antiData.bietdanh[event.logMessageData.participant_id] = event.logMessageData.nickname;
                    await fs.writeFile(NNFile, JSON.stringify(antiData, null, 4), 'utf-8');
                } else {
                    api.sendMessage(`⚠️ Bạn không có quyền đổi tên người dùng`, event.threadID);
                    return api.changeNickname(
                        antiData.bietdanh[event.logMessageData.participant_id] || "",
                        event.threadID,
                        event.logMessageData.participant_id
                    );
                }
            }
        } catch (error) {
            console.error("Error handling nickname change:", error);
        }
    } else if (event.logMessageType == "log:thread-admins") {
        if (DataAnti[event.threadID] && DataAnti[event.threadID].qtv) {
            if (event.author == botID) return;

            function editAdminsCallback(err) {
                if (err) return api.sendMessage("» Lỗi trong quá trình thực thi", event.threadID, event.messageID);
                return api.sendMessage(`⚠️ Thực thi chống cướp box`, event.threadID, event.messageID);
            }

            if (event.logMessageData.ADMIN_EVENT == "add_admin") {
                if (event.logMessageData.TARGET_ID == botID) return;
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                return api.changeAdminStatus(event.threadID, event.logMessageData.TARGET_ID, false);
            } else if (event.logMessageData.ADMIN_EVENT == "remove_admin") {
                delModeAnti(event, DataAnti, botID, api)
                api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                return api.changeAdminStatus(event.threadID, event.logMessageData.TARGET_ID, true);
            }
        } else if (event.logMessageData.ADMIN_EVENT == "remove_admin") {
            delModeAnti(event, DataAnti, botID, api)
        }
    } else if (event.logMessageType == "log:thread-color" && DataAnti[event.threadID] && DataAnti[event.threadID].theme) {
        const threadInf = (await Threads.getData(event.threadID)).threadInfo;
        const findAd = threadInf.adminIDs.find((el) => el.id === event.author);
        if (findAd || botID.includes(event.author)) {
            // console.log(event)
            DataAnti[event.threadID].theme = event.logMessageData.theme_id;
            await fs.writeJson(fileAnti, DataAnti, { spaces: 2 });
        } else {
            api.changeThreadColor(DataAnti[event.threadID].theme, event.threadID);
            api.sendMessage(`⚠️ Bạn không có quyền đổi màu nhóm`, event.threadID);
        }
    }
};

async function delModeAnti(event, DataAnti, botID, api) {
    if (event.logMessageData.TARGET_ID == botID) {
        const list = ['join', 'qtv', 'spam'];
        let xyz = [];
        for (let a of list) {
            if (!DataAnti[event.threadID] || !DataAnti[event.threadID][a]) continue;
            delete DataAnti[event.threadID][a];
            xyz.push(a);
        }
        await fs.writeJson(fileAnti, DataAnti, { spaces: 2 });
        if (xyz.length === 0) return;
        api.sendMessage(`Bot mất quyền admin => tự động tắt các lệnh anti: ${xyz.join(', ')}`, event.threadID);
    }
}