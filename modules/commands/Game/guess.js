module.exports.config = {
    name: "guess",
    version: "1.0.0",
    hasPermssion: 0,
    Rent: 2,
    credits: "Niio-team (Vtuan)",
    description: "Trò chơi đoán số",
    commandCategory: "Game",
    usages: "No",
    cooldowns: 0
};

function rd() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function Number($) {
    let $_ = $.toString();
    let _ = $_.split('.');
    let i = _[0];
    let $0 = _.length > 1 ? '.' + _[1] : '';
    let $$ = /(-?\d+)(\d{3})/;
    while ($$.test(i)) {
        i = i.replace($$, '$1,$2');
    }
    return i + $0;
}

module.exports.run = async ({ api, event, args }) => {
    const num = rd();
    console.log(num);
    api.sendMessage(`Hãy đoán một số có 4 chữ số\nReply vào tin nhắn này "gợi ý" hoặc đáp án của bạn để xem gợi ý hoặc trả lời!`, event.threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
            name: module.exports.config.name,
            author: event.senderID,
            messageID: info.messageID,
            threadID: event.threadID,
            num,
            at: 0
        });
    });
}

module.exports.handleReply = async function ({ api, event, handleReply, Currencies }) {
    if (event.senderID !== handleReply.author) return;

    const guess = event.body;
    const num = handleReply.num;

    if (event.body.toLowerCase() === "gợi ý") {
        const coinsdown = 20000;
        let balance = (await Currencies.getData(event.senderID)).money;
        if (coinsdown > balance) {
            return api.sendMessage(`Số dư không đủ ${coinsdown.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} VND để xem gợi ý`, event.threadID, event.messageID);
        }
        await Currencies.decreaseMoney(event.senderID, coinsdown);

        const cặc = Math.floor((num - 900) / 100) * 100;
        const lồn = Math.ceil((parseInt(num, 10) + 1000) / 100) * 100;

        let hint = num.split('').map((digit, index) => index === 1 ? digit : '_').join(' ');
        if (handleReply.messageID) api.unsendMessage(handleReply.messageID)
        return api.sendMessage(`Gợi ý: số nằm trong khoảng từ ${cặc} - ${lồn}\nsố ${hint}`, event.threadID, (err, info) => {
            if (err) return console.error(err);
            global.client.handleReply.push({
                name: module.exports.config.name,
                author: event.senderID,
                messageID: info.messageID,
                threadID: event.threadID,
                num,
                at: handleReply.at
            });
        });
    }

    if (guess.length !== 4 || isNaN(guess)) {
        if (handleReply.messageID) api.unsendMessage(handleReply.messageID)
        return api.sendMessage(`Vui lòng đoán một số có 4 chữ số\nReply vào tin nhắn này để trả lời!`, event.threadID, (err, info) => {
            if (err) return console.error(err);
            global.client.handleReply.push({
                name: module.exports.config.name,
                author: event.senderID,
                messageID: info.messageID,
                threadID: event.threadID,
                num,
                at: handleReply.at
            });
        });
    }

    const money = 1000000; // 1 triệu
    let $ = 0;

    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === num[i]) {
            $++;
        }
    }

    if (guess === num) {
        api.unsendMessage(handleReply.messageID);
        await Currencies.increaseMoney(event.senderID, money - handleReply.at * 50000);
        return api.sendMessage(`Bạn đã đoán đúng số: ${num}\nBạn nhận được ${Number(money - handleReply.at * 50000)} VND`, event.threadID, event.messageID);
    } else {
        if (money - handleReply.at * 50000 <= 0) {
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`Bạn thua!`, event.threadID);
        }
        handleReply.at += 1;
        api.unsendMessage(handleReply.messageID);
        return api.sendMessage(`Có ${$} chữ số đúng ở vị trí chính xác\nSố lần đoán: ${handleReply.at}\nReply vào tin nhắn này để trả lời!`, event.threadID, (err, info) => {
            if (err) return console.error(err);
            global.client.handleReply.push({
                name: module.exports.config.name,
                author: event.senderID,
                messageID: info.messageID,
                threadID: event.threadID,
                num,
                at: handleReply.at
            });
        });
    }
}