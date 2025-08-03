const cc = 33 // Tỉ lệ thành công :>
module.exports.config = {
    name: "cuop",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Khoa",
    description: "Phủ định học thuyết lao động của triết gia Huấn rô sì :>",
    commandCategory: "Game",
    usages: "@tag",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, Users, Threads, Currencies }) {
    var { threadID, messageID, senderID } = event;
    const data1 = await Currencies.getData(senderID);
    const money1 = data1.money;
    if (money1 < 1 || isNaN(money1)) return api.sendMessage(`Bạn không có tiền lỡ bị bắt r lấy gì trả!`, threadID, messageID);
    var mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage(`Vui lòng tag mục tiêu!`, threadID, messageID);
    const botID = api.getCurrentUserID();
    if (mention == botID) return api.sendMessage("Định trộm cả tao à -.-", threadID, messageID);
    var name = await Users.getNameUser(mention);
    const data2 = await Currencies.getData(mention);
    const money2 = data2.money;
    if (money2 < 1 || isNaN(money2)) return api.sendMessage(`Mục tiêu ${name} không có đồng xu dính túi!`, threadID, messageID);
    var tile = Math.floor(Math.random() * 100) + 1;
    if (tile < cc) {
        if (money2 < 10000) { var phan = 4 } else { var phan = 8 };
        var sotien = Math.floor(Math.random() * money2 / phan) + 1;
        Currencies.increaseMoney(senderID, sotien);
        Currencies.decreaseMoney(mention, sotien);
        return api.sendMessage(`Bạn đã cướp thành công ${sotien}$ của ${name} :>`, threadID, messageID);
    }
    else {
        if (money1 < 10000) { var phan = 4 } else { var phan = 8 };
        var sotienmat = Math.floor(Math.random() * money1 / phan) + 1;
        Currencies.decreaseMoney(senderID, sotienmat);
        Currencies.increaseMoney(mention, sotienmat);
        return api.sendMessage(`Bạn đã cướp ${name} thất bại và mất ${sotienmat}$ :>`, threadID, messageID);
    }
}