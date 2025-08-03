const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const formatter = require('./formatter');

class Logger {
  constructor(api) {
    this.api = api;
    this.logFile = path.join(__dirname, '../logs/bot.log');
    
    // Tạo thư mục logs nếu chưa có
    if (!fs.existsSync(path.dirname(this.logFile))) {
      fs.mkdirSync(path.dirname(this.logFile));
    }
  }

  async log(event) {
    // Bỏ qua một số sự kiện
    if (['read_receipt', 'typ'].includes(event.type)) return;

    // Format log
    const message = await formatter(this.api, event);
    const timestamp = new Date().toLocaleString('vi-VN');

    // Hiển thị console
    console.log(`${chalk.gray(`[${timestamp}]`)} ${message}`);

    // Ghi vào file
    fs.appendFileSync(
      this.logFile,
      `[${timestamp}] ${message.replace(/\u001b\[.*?m/g, '')}\n`
    );
  }
}

module.exports = Logger;