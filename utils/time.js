const moment = require('moment-timezone');
// xác định thời gian để module xác định ( create : eddy & grok AI)
// Định nghĩa múi giờ
const TIMEZONE = 'Asia/Ho_Chi_Minh';

// Hàm lấy thời gian theo định dạng
function getTime(option) {
  return moment.tz(TIMEZONE).format({
    seconds: 'ss',           // Giây: 00-59
    minutes: 'mm',           // Phút: 00-59
    hours: 'HH',             // Giờ: 00-23
    date: 'DD',              // Ngày: 01-31
    month: 'MM',             // Tháng: 01-12
    year: 'YYYY',            // Năm: 2025
    fullHour: 'HH:mm:ss',    // Giờ đầy đủ: 08:37:00
    fullYear: 'DD/MM/YYYY',  // Ngày đầy đủ: 01/08/2025
    fullTime: 'HH:mm:ss DD/MM/YYYY' // Thời gian đầy đủ: 08:37:00 01/08/2025
  }[option] || 'HH:mm:ss DD/MM/YYYY'); // Mặc định trả về fullTime
}

// Hàm lấy buổi trong ngày
function getSession(hours) {
  hours = parseInt(hours || getTime('hours'), 10);
  return hours <= 10 ? '𝐒𝐚́𝐧𝐠' :
         hours > 10 && hours <= 12 ? '𝐓𝐫𝐮̛𝐚' :
         hours > 12 && hours <= 18 ? '𝐂𝐡𝐢𝐞̂̀𝐮' : '𝐓𝐨̂́𝐢';
}

// Hàm tùy chỉnh định dạng thời gian
function customFormat(formatString) {
  return moment.tz(TIMEZONE).format(formatString);
}

module.exports = {
  getTime,
  getSession,
  customFormat
};