const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports = {
    // Khởi tạo dữ liệu tương tác cho nhóm
    initChecktt: async function (threadID) {
        const checkttPath = path.join(__dirname, `${threadID}.json`);
        if (!fs.existsSync(checkttPath)) {
            fs.writeFileSync(checkttPath, JSON.stringify({
                week: [],
                day: [],
                total: []
            }, null, 2));
        }
    },

    // Lấy dữ liệu tương tác
    getChecktt: async function (threadID) {
        const checkttPath = path.join(__dirname, `${threadID}.json`);
        if (!fs.existsSync(checkttPath)) {
            await this.initChecktt(threadID);
        }
        try {
            return JSON.parse(fs.readFileSync(checkttPath));
        } catch (error) {
            console.error(`Lỗi khi đọc checktt ${threadID}.json tại ${global.time.getTime('fullTime')}:`, error);
            return { week: [], day: [], total: [] };
        }
    },

    // Cập nhật dữ liệu tương tác
    updateChecktt: async function (threadID, userID, type = "total") {
        const checkttPath = path.join(__dirname, `${threadID}.json`);
        if (!fs.existsSync(checkttPath)) {
            await this.initChecktt(threadID);
        }
        let data = await this.getChecktt(threadID);
        const time = global.time.getTime("fullTime");

        // Cập nhật dữ liệu
        const index = data[type].findIndex(item => item.id === userID);
        if (index !== -1) {
            data[type][index].count = (data[type][index].count || 0) + 1;
            data[type][index].lastUpdate = time;
        } else {
            data[type].push({ id: userID, count: 1, lastUpdate: time });
        }

        try {
            fs.writeFileSync(checkttPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Lỗi khi ghi checktt ${threadID}.json tại ${global.time.getTime('fullTime')}:`, error);
        }
    },

    // Xóa dữ liệu tương tác của người dùng
    removeUserChecktt: async function (threadID, userID) {
        const checkttPath = path.join(__dirname, `${threadID}.json`);
        if (!fs.existsSync(checkttPath)) return;

        let data = await this.getChecktt(threadID);
        ["week", "day", "total"].forEach(type => {
            const index = data[type].findIndex(item => item.id === userID);
            if (index !== -1) {
                data[type].splice(index, 1);
            }
        });

        try {
            fs.writeFileSync(checkttPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Lỗi khi xóa dữ liệu checktt của ${userID} trong ${threadID}.json tại ${global.time.getTime('fullTime')}:`, error);
        }
    }
};