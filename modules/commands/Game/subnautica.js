try {
    const path = require("path");
    const axios = require("axios");
    const fs = require("fs-extra")
    module.exports.config = {
        name: "subnautica",
        version: "5.0.0",
        hasPermssion: 0,
        credits: "Dàn code của D-Jukie, đàn cá của Heo Rừng UwU",
        description: "Câu cá ở một hành tinh khác, dựa theo tựa game Subnautica khiến bạn đái ra máu vì độ đa dạng của nó UwU",
        commandCategory: "Game",
        usages: "[]",
        cooldowns: 0
    };
    module.exports.checkPath = function (type, senderID) {
        const pathItem = path.join(__dirname, 'FolderGame', 'cauca', `item.json`);
        const pathUser = path.join(__dirname, 'FolderGame', 'cauca', 'datauser', `${senderID}.json`);
        const pathUser_1 = require("./FolderGame/cauca/datauser/" + senderID + '.json');
        const pathItem_1 = require("../FolderGame/FolderGame/cauca/item.json");
        const pathEquipment = require("../FolderGame/FolderGame/cauca/equipment.json");
        if (type == 1) return pathItem
        if (type == 2) return pathItem_1
        if (type == 3) return pathUser
        if (type == 4) return pathUser_1
        if (type == 5) return pathEquipment
    }

    module.exports.onLoad = async () => {
        const dir = __dirname + `/FolderGame/cauca/`;
        const dirCache = __dirname + `/FolderGame/cauca/cache/`;
        const dirData = __dirname + `/FolderGame/cauca/datauser/`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
            recursive: true
        });
        if (!fs.existsSync(dirData)) fs.mkdirSync(dirData, {
            recursive: true
        });
        if (!fs.existsSync(dirCache)) fs.mkdirSync(dirCache, {
            recursive: true
        });
        if (!fs.existsSync(dir + "item.json")) (await axios({
            url: "https://raw.githubusercontent.com/theguardian132/subnautica/main/datasub.json",
            method: 'GET',
            responseType: 'stream'
        })).data.pipe(fs.createWriteStream(dir + "data.json"));

        if (!fs.existsSync(dir + "item.json")) (await axios({
            url: "https://raw.githubusercontent.com/theguardian132/subnautica/main/itemsub.json",
            method: 'GET',
            responseType: 'stream'
        })).data.pipe(fs.createWriteStream(dir + "item.json"));

        if (!fs.existsSync(dir + "item.json")) (await axios({
            url: "https://raw.githubusercontent.com/theguardian132/subnautica/main/equipment.json",
            method: 'GET',
            responseType: 'stream'
        })).data.pipe(fs.createWriteStream(dir + "equipment.json"));
        return;
    }

    module.exports.run = async function ({
        api,
        event,
        args,
        Users,
        Currencies
    }) {
        const {
            threadID,
            messageID,
            senderID
        } = event;
        const { readFileSync, writeFileSync, existsSync, createReadStream, readdirSync } = require("fs-extra")
        const pathData = path.join(__dirname, 'FolderGame', 'cauca', 'datauser', `${senderID}.json`);
        switch (args[0]) {
            case 'register':
            case '-r': {
                const nDate = new Date().toLocaleString('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh'
                });
                if (!existsSync(pathData)) {
                    var obj = {};
                    obj.name = (await Users.getData(senderID)).name;
                    obj.ID = senderID;
                    obj.mainROD = null,
                        obj.accessory = null,
                        obj.GPS = {};
                    obj.GPS.locate = null,
                        obj.GPS.area = null,
                        obj.fishBag = [];
                    obj.item = [];
                    obj.equipments = [];
                    obj.point = [];
                    obj.timeRegister = nDate
                    obj.fishBag.push({
                        ID: 0,
                        name: 'Đừng bán con cá này ko là lỗi tao đéo chịu trách nhiệm đâu',
                        category: 'Unnamed',
                        size: 999999,
                        sell: 0
                    });
                    obj.point.push({
                        ID: 0,
                        name: 'Đừng bán con cá này ko là lỗi tao đéo chịu trách nhiệm đâu',
                        category: 'Unnamed',
                        size: 999999,
                        sell: 0
                    });
                    writeFileSync(pathData, JSON.stringify(obj, null, 4));
                    var msg = { body: "(•𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬•)\n⚔️Đ𝔞̆𝔫𝔤 𝔨𝔦́ 𝔠𝔞̂𝔲 𝔠𝔞́ 𝔱𝔥𝔞̀𝔫𝔥 𝔠𝔬̂𝔫𝔤⚔️\nIt's time to duel!!!", attachment: await this.subnautica() }
                    return api.sendMessage(msg, threadID, messageID);
                } else return api.sendMessage({ body: "==[𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬]==\n⚔️Bạn đã có trong cơ sở dữ liệu⚔️", attachment: await this.subnautica() }, threadID, messageID);
            }
            case 'shop':
            case '-s': {
                if (!existsSync(pathData)) {
                    return api.sendMessage({ body: "(•𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬•)\n⚔️Bạn chưa đăng kí tài khoản câu cá!\n Nhập /subnautica -r để đăng kí", attachment: await this.subnautica() }, threadID, messageID);
                }
                return api.sendMessage({ body: "=====[𝗦𝗛𝗢𝗣]=====\n-----------------------\n1. Mua phóng lao và đinh ba\n2. Bán vật phẩm câu được\n3. Nâng cấp/Sửa chửa phóng lao\n4. Mua phụ kiện\n-----------------------\n<Reply tin nhắn này với lựa chọn của bạn>", attachment: await this.subnautica() }, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "shop"
                    })
                }, messageID);
            }
            case 'bag':
            case '-b': {
                if (!existsSync(pathData)) {
                    return api.sendMessage({ body: "<(𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬)>\n⚔️Bạn chưa đăng kí tài khoản câu cá!\nNhập /subnautica register hoặc -r", attachment: await this.subnautica() }, threadID, messageID);
                }
                var data = this.checkPath(4, senderID)

                return api.sendMessage({ body: `<(𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬)>\n----------------\n1. Cá (SL: ${data.fishBag.length})\n2. Cần câu (SL: ${data.item.length})\nVui lòng reply vật phẩm cần xem!`, attachment: await this.subnautica() }, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "choosebag"
                    })
                }, messageID);
            }
            case 'custom':
            case '-c': {
                if (!existsSync(pathData)) {
                    return api.sendMessage({ body: "<(𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬)>\n⚔️Bạn chưa đăng kí tài khoản câu cá!\nNhập /subnautica register hoặc -r", attachment: await this.subnautica() }, threadID, messageID);
                }
                if (args[1] == 'harpoon') {
                    var data = this.checkPath(4, senderID)
                    var listItem = '<(•𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬•)>\n_______________\n',
                        number = 1;
                    for (let i of data.item) {
                        listItem += `➤${number++}: ${i.name} - Thời gian chờ: ${i.countdown}s - Độ bền: ${i.durability}\n`
                    }
                    listItem += 'Vui lòng reply để chọn cần vũ khí chính của bạn!'
                    return api.sendMessage(listItem, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "rodMain",
                            data: data,
                            item: data.item
                        })
                    }, messageID);
                }
                if (args[1] == 'equip') {
                    var data = this.checkPath(4, senderID)
                    var listItem = '<(•𝗘𝗤𝗨𝗜𝗣𝗠𝗘𝗡𝗧𝗦•)>\n______________\n',
                        number = 1;
                    for (let i of data.equipments) {
                        listItem += `${number++}. ${i.name}\n- Mô tả: ${i.description}\n`
                    }
                    listItem += 'Vui lòng reply để chọn cần phụ kiện của bạn!'
                    return api.sendMessage(listItem, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "equipMain",
                            data: data,
                            item: data.equipments
                        })
                    }, messageID);
                }
                if (args[1] == 'locate') {
                    return api.sendMessage({ body: "==[𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡]==\n1. The Crater🌏\n2. Sector Zero❄️\n3. ԱហҠហටచហ\n-------------------\n>Reply kèm STT để chọn khu vực", attachment: await this.subnautica() }, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "location"
                        })
                    }, messageID);
                }
            }
            case 'help': {
                return api.sendMessage({ body: "==[𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬]==\n-----------------\n- register/-r: Đăng kí\n- custom/-c: custom harpoon để trang bị lao, custom equip để trang bị phụ kiện, custom locate để đặt vị trí câu\n- bag: Xem túi đồ\n- shop/-s: Cửa hàng\n\n=====D-Jukie=====", attachment: await this.subnautica() }, threadID, messageID);
            }
            case 'info': {
                var data = this.checkPath(4, senderID)
                var dataRank = this.checkPath(4, senderID).point;
                if (data.length == 0) return api.sendMessage('No Information', threadID, messageID);
                var Common = dataRank.filter(i => i.category == 'Common')
                var Uncommon = dataRank.filter(i => i.category == 'Uncommon')
                var Rare = dataRank.filter(i => i.category == 'Rare')
                var Epic = dataRank.filter(i => i.category == 'Epic')
                var Legendary = dataRank.filter(i => i.category == 'Legendary')
                var Mythical = dataRank.filter(i => i.category == 'Mythical')
                var Spectral = dataRank.filter(i => i.category == 'Spectral')
                var Etherial = dataRank.filter(i => i.category == 'Etherial')
                var Unknown = dataRank.filter(i => i.category == 'Unknown')
                var Unreal = dataRank.filter(i => i.category == 'Unreal')
                const exp = Math.floor(Common.length + 2 * Uncommon.length + 4 * Rare.length + 8 * Epic.length + 16 * Legendary.length + 80 * Mythical.length + 800 * Spectral.length + 8000 * Etherial.length + 16000 * Unknown.length + 80000 * Unreal.length)
                var rank = "";
                if (exp >= 1) rank = "Sắt I";
                if (exp >= 10) rank = "Sắt II";
                if (exp >= 30) rank = "Sắt III";
                if (exp >= 60) rank = "Sắt IV";
                if (exp >= 100) rank = "Sắt V";
                if (exp >= 150) rank = "Đồng I";
                if (exp >= 210) rank = "Đồng II";
                if (exp >= 280) rank = "Đồng III";
                if (exp >= 360) rank = "Bạc I";
                if (exp >= 450) rank = "Bạc II";
                if (exp >= 550) rank = "Bạc III";
                if (exp >= 660) rank = "Vàng I";
                if (exp >= 780) rank = "Vàng II";
                if (exp >= 910) rank = "Vàng III";
                if (exp >= 1050) rank = "Bạch Kim I";
                if (exp >= 1200) rank = "Bạch Kim II";
                if (exp >= 1400) rank = "Bạch Kim III";
                if (exp >= 1800) rank = "Kim Cương I";
                if (exp >= 3000) rank = "Kim Cương II";
                if (exp >= 5000) rank = "Kim Cương III";
                if (exp >= 8000) rank = "Tinh Anh I";
                if (exp >= 11000) rank = "Tinh Anh II";
                if (exp >= 15000) rank = "Tinh Anh III";
                if (exp >= 20000) rank = "Cao Thủ I";
                if (exp >= 30000) rank = "Cao Thủ II";
                if (exp >= 45000) rank = "Cao Thủ III";
                if (exp >= 60000) rank = "Chiến Tướng";
                if (exp >= 100000) rank = "Cần Thủ Chi Thần";
                return api.sendMessage({ body: `==[𝙄𝙣𝙛𝙤 𝙐𝙨𝙚𝙧]==\n------------------\n- Name: ${data.name}\n- Rank: ${rank} - ${exp}\n- ID: ${data.ID}\n- Weapon: ${data.mainROD != null ? data.mainROD : "Đéo có"}\n- Storage: ${data.fishBag.length != null ? data.fishBag.length : "0"}/100\n- Location: ${data.GPS.locate != null ? data.GPS.locate : "Không"} - ${data.GPS.area != null ? data.GPS.area : "Không"}\n- Item: ${data.item.length}\n- Số cá đã câu được: ${data.point.length}\n- Time created: ${data.timeRegister} \n\n===D-Jukie - Heo Rừng===`, attachment: await this.subnautica() }, threadID, messageID);
            }
            case 'history': {
                var data = this.checkPath(4, senderID).point;
                if (data.length == 0) return api.sendMessage('No Information', threadID, messageID);
                var Common = data.filter(i => i.category == 'Common')
                var Uncommon = data.filter(i => i.category == 'Uncommon')
                var Rare = data.filter(i => i.category == 'Rare')
                var Epic = data.filter(i => i.category == 'Epic')
                var Legendary = data.filter(i => i.category == 'Legendary')
                var Mythical = data.filter(i => i.category == 'Mythical')
                var Spectral = data.filter(i => i.category == 'Spectral')
                var Etherial = data.filter(i => i.category
                    == 'Etherial')
                var Unknown = data.filter(i => i.category == 'Unknown')
                return api.sendMessage({ body: `Thành tích hiện tại:\n1. Common - ${Common.length}\n2. Uncommon - ${Uncommon.length}\n3. Rare - ${Rare.length}\n4. Epic - ${Epic.length}\n5. Legendary - ${Legendary.length}\n6. Mythical - ${Mythical.length}\n7. Spectral - ${Spectral.length}\n8. Etherial - ${Etherial.length}\n9. Unknown - ${Unknown.length}\nTổng số cá: ${data.length - 1}\nĐiểm Thành tựu: ${Common.length + 2 * Uncommon.length + 4 * Rare.length + 8 * Epic.length + 16 * Legendary.length + 80 * Mythical.length + 800 * Spectral.length + 8000 * Etherial.length + 16000 * Unknown.length}`, attachment: await this.subnautica() }, threadID, messageID);
            }
            case 'top': {
                if (!existsSync(pathData)) {
                    return api.sendMessage({ body: "Bạn chưa đăng kí tài khoản!\n Nhập /subnautica register để đăng kí", attachment: await this.image('https://i.pinimg.com/originals/b6/f1/1f/b6f11fb474e1e6058489fb3c6357039a.gif') }, threadID, messageID);
                }
                try {
                    const data = readdirSync(__dirname + `/FolderGame/cauca/datauser`);
                    if (data.length < 3) return api.sendMessage(`Cần ít nhất có 3 người chơi trên server để xem top`, threadID, messageID);
                    var p = []
                    for (let i of data) {
                        var o = require(`./FolderGame/cauca/datauser/${i}`);
                        p.push(o)
                        msg += `${number++}. ${o.name} - ${o.point.length} con\n`
                    }
                    p.sort((a, b) => b.point.length - a.point.length);
                    var msg = '===TOP 3 NGƯỜI CHƠI CÂU NHIỀU CÁ NHẤT===\n'
                    for (var i = 0; i < 3; i++) {
                        msg += `${i + 1}. ${p[i].name} với ${p[i].point.length} con\n`
                    }
                    return api.sendMessage(msg, threadID, messageID);
                } catch (e) {
                    console.log(e);
                    return api.sendMessage({
                        bdoy: e
                    }, threadID, messageID);
                }
            }
            default: {
                async function checkTime(cooldown, dataTime) {
                    if (cooldown - (Date.now() - dataTime) > 0) {

                        var time = cooldown - (Date.now() - dataTime),
                            minutes = Math.floor(time / 60000),
                            seconds = ((time % 60000) / 1000).toFixed(0);
                        return api.sendMessage(`⏰ Vui lòng mua phóng lao cấp bậc cao hơn để câu liên tiếp trong thời gian ngắn!\n⌚Chờ gian chờ còn lại: ${minutes}:${seconds}!`, threadID, messageID);
                    }
                }
                if (!existsSync(pathData)) {
                    return api.sendMessage({ body: "-<(𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬)>-\n⚔️Bạn chưa đăng kí tài khoản câu cá!\nNhập /subnautica register hoặc -r", attachment: await this.subnautica() }, threadID, messageID);
                }
                var data = this.checkPath(4, senderID)
                if (data.item.length == 0) return api.sendMessage({
                    body: `
✨=====【 𝗦𝗛𝗢𝗣 𝗣𝗛𝗜ÊU 𝗟ƯU 】=====✨
-----------------------------------
1️⃣ Mua phóng lao và đinh ba sắc bén
2️⃣ Bán những vật phẩm quý báu bạn câu được
3️⃣ Nâng cấp hoặc sửa chữa phóng lao của bạn
4️⃣ Mua phụ kiện hỗ trợ săn bắt hiệu quả hơn
-----------------------------------
🚫 Bạn chưa có phóng lao nào!
📝 Hãy trả lời tin nhắn này với lựa chọn của bạn để bắt đầu cuộc phiêu lưu ngay!
` }, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "shop"
                    })
                }, messageID)

                if (data.fishBag.length >= 40) {
                    return api.sendMessage(`Hiện đã đầy túi, mau bán bớt cá không nó nổ kho chết con mẹ mày giờ thằng ngu\nThả cảm xúc bất kì vào đây để mở kho cá`, threadID, (error, info) => {
                        global.client.handleReaction.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "typeFull"
                        })
                    }, messageID)
                }
                if (data.mainROD == null) {
                    var data = this.checkPath(4, senderID)
                    var listItem = '<(•𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬•)>\n_______________\n',
                        number = 1;
                    for (let i of data.item) {
                        listItem += `➤${number++}: ${i.name} - Thời gian chờ: ${i.countdown}s - Độ bền: ${i.durability}\n`
                    }
                    listItem += `Bạn chưa chọn phóng lao để câu cá!\nVui lòng reply để chọn cần vũ khí chính của bạn!`
                    return api.sendMessage(listItem, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "rodMain",
                            data: data,
                            item: data.item
                        })
                    }, messageID);
                }
                if (data.GPS.locate == null || data.GPS.area == null) {
                    return api.sendMessage({ body: '==[𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡]==\n1. The Crater🌏\n2. Sector Zero❄️\n3. ԱហҠហටచហ\n-------------------\n>Reply kèm STT để chọn khu vực\nBạn chưa chọn địa điểm để câu cá!\nVui lòng Reply để chọn địa điểm câu!' }, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "location"
                        })
                    }, messageID)
                }
                var rod = data.mainROD
                var equip = data.accessory
                var findEquip = data.equipments.find(i => i.name == equip)
                var location = data.GPS.locate
                var area = data.GPS.area
                var data = this.checkPath(4, senderID)
                var findRod = data.item.find(i => i.name == rod)
                var rate = Math.floor(Math.random() * (100006 - (findRod.luck + (equip != null ? findEquip.luck : 0)))) + (findRod.luck + (equip != null ? findEquip.luck : 0));
                if (rate <= 4000) type = false;
                if (rate > 4000 && rate <= 34000) type = 'Common';
                if (rate > 34000 && rate <= 59000) type = 'Uncommon';
                if (rate > 59000 && rate <= 79000) type = 'Rare';
                if (rate > 79000 && rate <= 94000) type = 'Epic';
                if (rate > 94000 && rate <= 99000) type = 'Legendary';
                if (rate > 99000 && rate <= 99890) type = 'Mythical';
                if (rate > 99890 && rate <= 99990) type = 'Spectral';
                if (rate > 99990 && rate <= 100000) type = 'Etherial';
                if (rate > 100000 && rate <= 100005) type = 'Unknown';
                if (rate > 100005 && rate <= 100006) type = 'Unreal';
                if (findRod.durability <= 0) return api.sendMessage('Vũ khí đã hỏng, bạn cần sửa chữa hoặc chọn một thanh mới!', threadID, messageID);
                await checkTime(findRod.countdown * (equip != null ? findEquip.countdownDecrease : 1) * 1000, findRod.countdownData)
                findRod.countdownData = Date.now();
                findRod.durability = findRod.durability - 10;
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
                if (type == false) return api.sendMessage('Oh, không dính gì cả', threadID, messageID);
                var fil = (await this.dataFish(location, area)).filter(i => i.category == type)
                if (fil.length == 0) return api.sendMessage('Oh, không dính gì cả', threadID, messageID);
                var getData = fil[Math.floor(Math.random() * fil.length)];
                var IDF = ((this.checkPath(4, senderID)).fishBag)[parseInt(((this.checkPath(4, senderID)).fishBag).length - 1)].ID + 1;
                (this.checkPath(4, senderID)).fishBag.push({
                    ID: IDF,
                    name: getData.name,
                    category: getData.category,
                    size: getData.size,
                    sell: getData.sell * (equip != null ? findEquip.priceIncrease : 1),
                    image: getData.image
                });
                (this.checkPath(4, senderID)).point.push({
                    ID: IDF,
                    name: getData.name,
                    category: getData.category,
                    size: getData.size,
                    weight: getData.weight,
                    sell: getData.sell,
                    image: getData.image
                });

                writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
                var msg = { body: `|---<(𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬)>---|\nChúc mừng bạn đã phóng chết cmn con cá\n-----------------------\n🐟Tên: ${getData.name}\n💵Giá: ${getData.sell * (equip != null ? findEquip.priceIncrease : 1)}$\n✡Độ hiếm: ${getData.category}\n📐Size: ${getData.size}cm`, attachment: await this.image(getData.image) }
                return api.sendMessage(msg, threadID, messageID);
            }
        }
    }

    module.exports.dataFish = async function (a, b) {
        const data = require("../FolderGame/FolderGame/cauca/data.json");
        var loc = data.find(i => i.location == a)
        var are = loc.area.find(i => i.name == b)
        return are.creature
    }

    module.exports.image = async function (link) {
        var images = [];
        let download = (await axios.get(link, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/FolderGame/cauca/cache/subnautica.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/FolderGame/cauca/cache/subnautica.png`));
        return images
    }
    module.exports.subnautica = async function () {
        var images = [];
        let download = (await axios.get('https://i.imgur.com/RFfyXMj.png', { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/FolderGame/cauca/cache/subnauticapage.png`, Buffer.from(download, "utf-8"));
        images.push(fs.createReadStream(__dirname + `/FolderGame/cauca/cache/subnauticapage.png`));
        return images
    }




    module.exports.handleReply = async function ({
        event,
        api,
        Currencies,
        handleReply,
        Users
    }) {
        if (handleReply.author != event.senderID) return;
        const {
            body,
            threadID,
            messageID,
            senderID
        } = event;
        const {
            readFileSync,
            writeFileSync,
            existsSync,
            createReadStream,
            unlinkSync,
            writeFile
        } = require("fs-extra");
        const pathItem = this.checkPath(2, senderID);
        const pathEquipment = this.checkPath(5, senderID);
        async function checkDur(a, b, c) {
            var data = require("../FolderGame/FolderGame/cauca/item.json");
            var find = data.find(i => i.name == a)
            if (c == 'rate') return (b / find.durability) * 100
            if (c == 'reset') return find.durability
            return `${b}/${find.durability} (${((b / find.durability) * 100).toFixed(0)}%)`
        }
        switch (handleReply.type) {
            case 'shop': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                if (body == 1) {
                    api.unsendMessage(handleReply.messageID)
                    var listItem = '===[𝗦𝗛𝗢𝗣]===\n',
                        number = 1;
                    for (let i of pathItem) {
                        listItem += `Lv${number++}: ${i.name} (${i.price}$) - Thời gian chờ ${i.countdown} (Độ bền: ${i.durability})\n\n`
                    }
                    return api.sendMessage(listItem + 'Reply tin nhắn này để chọn cần vũ khí cho bạn. Mỗi lần câu trừ 10 độ bền!', threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,////// all
                            author: event.senderID,
                            type: "buyfishingrod"
                        })
                    }, messageID);
                }
                if (body == 2 || handleReply.type == "typeFull") {
                    api.unsendMessage(handleReply.messageID)
                    var data = this.checkPath(4, senderID).fishBag;
                    if (data.length == 0) return api.sendMessage('Túi của bạn không có gì cả!', threadID, messageID);
                    var Common = data.filter(i => i.category == 'Common')
                    var Uncommon = data.filter(i => i.category == 'Uncommon')
                    var Rare = data.filter(i => i.category == 'Rare')
                    var Epic = data.filter(i => i.category == 'Epic')
                    var Legendary = data.filter(i => i.category == 'Legendary')
                    var Mythical = data.filter(i => i.category == 'Mythical')
                    var Spectral = data.filter(i => i.category == 'Spectral')
                    var Etherial = data.filter(i => i.category == 'Etherial')
                    var Unknown = data.filter(i => i.category == 'Unknown')
                    var Unreal = data.filter(i => i.category == 'Unreal')
                    var listCategory = [Common, Uncommon, Rare, Epic, Legendary, Mythical, Spectral, Etherial, Unknown, Unreal];
                    return api.sendMessage(`Chọn loại cá muốn bán:\n1. Common⚪ - ${Common.length}\n2. Uncommon🟢 - ${Uncommon.length}\n3. Rare🔵 - ${Rare.length}\n4. Epic🟣 - ${Epic.length}\n5. Legendary🟡 - ${Legendary.length}\n6. Mythical🔴 - ${Mythical.length}\n7. Spectral😈 - ${Spectral.length}\n8. Etherial🌟 - ${Etherial.length}\n9. Unknown🔯 - ${Unknown.length}\n10. Unreal♾️ - ${Unreal.length}`, threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "chooseFish",
                            listCategory
                        })
                    }, messageID);
                }
                if (body == 3) {
                    api.unsendMessage(handleReply.messageID)
                    var data = this.checkPath(4, senderID).item;
                    var msg = `===𝓕𝓘𝓧 𝓘𝓣𝓔𝓜===\n`,
                        number = 1;
                    for (let i of data) {
                        msg += `${number++}. ${i.name} - Độ bền: ${await checkDur(i.name, i.durability, 0)}\n`
                    }
                    return api.sendMessage(msg + 'Vui lòng reply vật phẩm muốn sửa!, giá sửa bằng 75% giá vật phẩm', threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            type: "fixfishingrod",
                            list: data
                        })
                    }, messageID);
                }
                if (body == 4) {
                    api.unsendMessage(handleReply.messageID)
                    var listItem = '===[SHOP PHỤ KIỆN]===\n',
                        number = 1;
                    for (let i of pathEquipment) {
                        listItem += `${number++}. ${i.name} - ${i.price}$\n- ${i.description}\n_________________\n`
                    }
                    return api.sendMessage(listItem + 'Reply tin nhắn này để chọn phụ kiện muốn mua. Trang bị phụ kiện đã mua bằng cách nhập /subnautica custom equip', threadID, (error, info) => {
                        global.client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,////// all
                            author: event.senderID,
                            type: "buyequipment"
                        })
                    }, messageID);
                }
                else return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
            }
            case 'choosebag': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                var data = this.checkPath(4, senderID)
                if (body == 1) {
                    if (data.fishBag.length == 0) return api.sendMessage('Trong túi của bạn không có cái nịt', threadID, messageID);
                    var listFish = `===𝓲𝓷𝓿𝓮𝓷𝓽𝓸𝓻𝔂===\n`,
                        number = 1;
                    for (let i of data.fishBag) {
                        listFish += `${number++}. ${i.name} (${i.size}cm) - ${i.category} (${i.sell}$)\n`
                    }
                    return api.sendMessage(listFish, threadID, messageID);
                }
                if (body == 2) {
                    api.unsendMessage(handleReply.messageID)
                    if (data.item.length == 0) return api.sendMessage('Trong túi của bạn không có vật phẩm nào!', threadID, messageID);
                    var listItemm = `===𝓲𝓷𝓿𝓮𝓷𝓽𝓸𝓻𝔂===\n`,
                        number = 1;
                    for (let i of data.item) {
                        listItemm += `${number++}. ${i.name} (${i.price}$) - Độ bền: ${i.durability} (${i.countdown}s)\n`
                    }
                    return api.sendMessage(listItemm, threadID, messageID);
                } else return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
            }
            case 'rodMain': {
                var data = handleReply.data;
                var item = handleReply.item;
                const choice = parseInt(body, 10);
                if (isNaN(choice) || choice > item.length || choice <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                data.mainROD = item[parseInt(body) - 1].name
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(data, null, 2));
                return api.sendMessage(`===МĂĨŃ ŴĔĂРŐŃ===\n- Đặt '${item[parseInt(body) - 1].name}' thành vũ khí chính thành công!`, threadID, messageID);
            }
            case 'equipMain': {
                var data = handleReply.data;
                var equip = handleReply.item;
                if (isNaN((parseInt(body))) || parseInt(body) > equip.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                data.accessory = equip[parseInt(body) - 1].name
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(data, null, 2));
                return api.sendMessage(`=== 𝐄𝐐𝐔𝐈𝐏𝐌𝐄𝐍𝐓𝐒 ===\n Đã trang bị '${equip[parseInt(body) - 1].name}'!`, threadID, messageID);
            }
            case 'location': {
                const data = require("../FolderGame/FolderGame/cauca/data.json");
                if (isNaN((parseInt(body))) || body < 1 && body > 3) return api.sendMessage("Lựa chọn không hợp lệ!", threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                var listLoca = '==[𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡]==\n',
                    number = 1;
                for (let i of data[parseInt(body) - 1].area) {
                    listLoca += `${number++}. ${i.name}\n`
                };
                (this.checkPath(4, senderID)).GPS.locate = data[parseInt(body) - 1].location
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
                if (body == 1) var images = 'https://i.imgur.com/SJewp15.png'
                if (body == 2) var images = 'https://i.imgur.com/FtB2vWi.png'
                if (body == 3) var images = 'https://i.imgur.com/XyreoAC.png'
                return api.sendMessage({ body: listLoca + 'Vui lòng chọn vùng bạn muốn câu!', attachment: await this.image(images) }, threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "chooseArea",
                        area: data[parseInt(body) - 1]
                    })
                }, messageID);
            }
            case 'chooseArea': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                var area = handleReply.area;
                var pathh = this.checkPath(4, senderID)
                var pathhh = this.checkPath(3, senderID)
                if (parseInt(body) > area.area.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                pathh.GPS.area = area.area[parseInt(body) - 1].name
                writeFileSync(pathhh, JSON.stringify(pathh, null, 2));
                return api.sendMessage(`==[𝗟𝗢𝗖𝗔𝗧𝗜𝗢𝗡]==\nChuyển tới vùng '${area.location} - ${area.area[parseInt(body) - 1].name}' thành công`, threadID, messageID);
            }
            case 'fixfishingrod': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                if (parseInt(body) > handleReply.list.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                var rod = handleReply.list[parseInt(body) - 1]
                if (await checkDur(rod.name, rod.durability, 'rate') > 75) return api.sendMessage('Chỉ sửa được phóng lợn à nhầm phóng lao có độ bền dưới 75%', threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                await checkMoney(senderID, parseInt((rod.price * (3 / 4)).toFixed(0)))
                await Currencies.decreaseMoney(senderID, parseInt((rod.price * (3 / 4)).toFixed(0)));
                rod.durability = await checkDur(rod.name, rod.durability, 'reset')
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
                return api.sendMessage(`===ŦĨЖ ŴĔĂРŐŃ===\n- Sửa thành công ${rod.name} (${parseInt((rod.price * (3 / 4)).toFixed(0))}$)`, threadID, messageID);
            }
            case 'buyfishingrod': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                if (parseInt(body) > pathItem.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                var data = pathItem[parseInt(body) - 1]
                var checkM = await checkMoney(senderID, data.price);
                if ((this.checkPath(4, senderID)).item.some(i => i.name == data.name)) return api.sendMessage('Bạn đã sở hữu vật phẩm này rồi!', threadID, messageID);
                (this.checkPath(4, senderID)).item.push({
                    name: data.name,
                    price: data.price,
                    durability: data.durability,
                    countdown: data.countdown,
                    luck: data.luck,
                    countdownData: null,
                    image: data.image
                })
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
                api.unsendMessage(handleReply.messageID)
                await Currencies.decreaseMoney(senderID, parseInt(data.price));
                var msg = { body: `Mua thành công ${data.name}\nGiá mua: ${data.price}$\nĐộ bền: ${data.durability}\nLuck: ${data.luck}\nThời gian chờ: ${data.countdown}s`, attachment: await this.image(data.image) }
                return api.sendMessage(msg, threadID, messageID);
            }
            case 'buyequipment': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                if (parseInt(body) > pathEquipment.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                var data = pathEquipment[parseInt(body) - 1]
                var checkM = await checkMoney(senderID, data.price);
                if ((this.checkPath(4, senderID)).item.some(i => i.name == data.name)) return api.sendMessage('Bạn đã sở hữu vật phẩm này rồi!', threadID, messageID);
                (this.checkPath(4, senderID)).equipments.push({
                    name: data.name,
                    price: data.price,
                    countdownDecrease: data.countdownDecrease,
                    luck: data.luck,
                    priceIncrease: data.priceIncrease,
                    description: data.description,
                    image: data.image
                })
                writeFileSync(this.checkPath(3, senderID), JSON.stringify(this.checkPath(4, senderID), null, 2));
                api.unsendMessage(handleReply.messageID)
                await Currencies.decreaseMoney(senderID, parseInt(data.price));
                var msg = { body: `Mua thành công ${data.name}\nGiá mua: ${data.price}$\n________________\n${data.description}`, attachment: await this.image(data.image) }
                return api.sendMessage(msg, threadID, messageID);
            }
            case 'chooseFish': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                if (parseInt(body) > handleReply.listCategory.length || parseInt(body) <= 0) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                if (handleReply.listCategory[parseInt(body) - 1].length == 0) return api.sendMessage('Không có con cá nào hết á, hmmm!', threadID, messageID);
                var fish = "==𝗦𝗨𝗕𝗡𝗔𝗨𝗧𝗜𝗖𝗔 𝟱.𝟬==\n",
                    number = 1;
                for (let i of handleReply.listCategory[parseInt(body) - 1]) {
                    fish += `${number++}. ${i.name} (${i.size}cm) - Loại: ${i.category} - ${i.sell}$\n`
                }
                return api.sendMessage(fish + "Reply số thứ tự để bán (có thể rep nhiều số) all cái đầu buồi t fix r bug tiền cc", threadID, (error, info) => {
                    global.client.handleReply.push({
                        name: this.config.name,
                        messageID: info.messageID,
                        author: event.senderID,
                        type: "sell",
                        list: handleReply.listCategory[parseInt(body) - 1]
                    })
                }, messageID);
            }
            case 'sell': {
                if (isNaN((parseInt(body)))) return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
                if ((parseInt(body) > handleReply.list.length || parseInt(body) <= 0) && body.toLowerCase() != 'bugcaiditconmemay') return api.sendMessage('Lựa chọn hong hợp lệ!', threadID, messageID);
                api.unsendMessage(handleReply.messageID)
                var bag = (this.checkPath(4, senderID)).fishBag
                var coins = 0;
                if (body.toLowerCase() == 'bugcaiditconmemay') {
                    for (let i of handleReply.list) {
                        await Currencies.increaseMoney(senderID, parseInt(i.sell));
                        coins += parseInt(i.sell)
                        console.log(i.ID)
                        var index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == i.ID);
                        bag.splice(index, 1);
                        writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
                    }
                    return api.sendMessage(`Bán thành công ${handleReply.list.length} con cá và thu về được ${coins}$`, threadID, messageID);
                }
                else {
                    var msg = 'Code_By_D-Jukie ' + body
                    var chooses = msg.split(" ").map(n => parseInt(n));
                    chooses.shift();
                    var text = `=====SELL=====\n`,
                        number = 1;
                    for (let i of chooses) {
                        const index = (this.checkPath(4, senderID)).fishBag.findIndex(item => item.ID == handleReply.list[i - 1].ID);
                        text += `${number++}. ${bag[index].name} +${bag[index].sell}$\n`
                        coins += parseInt(bag[index].sell)
                        await Currencies.increaseMoney(senderID, parseInt(bag[index].sell));
                        bag.splice(index, 1);
                        writeFileSync(this.checkPath(3, senderID), JSON.stringify((this.checkPath(4, senderID)), null, 2));
                    }
                    return api.sendMessage(text + `\nThu về được ${coins}$`, threadID, messageID);
                }
            }
            default: {
                api.unsendMessage(handleReply.messageID)
                return api.sendMessage('Lựa chọn không hợp lệ!', threadID, messageID);
            }
        }
        async function checkMoney(senderID, maxMoney) {
            var i, w;
            i = (await Currencies.getData(senderID)) || {};
            w = i.money || 0
            if (w < parseInt(maxMoney)) return api.sendMessage('Bạn không đủ tiền để thực hiện giao dịch này!', threadID, messageID);
        }
    }///Lv

    module.exports.handleReaction = async function ({
        event,
        api,
        Currencies,
        handleReply,
        Users
    }) {
        if (handleReaction.type == "typeFull") {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "typeFull"
            })
        }
    }
} catch (e) {
    console.log(e)
}
