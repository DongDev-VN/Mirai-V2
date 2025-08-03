const chalk = require('chalk');

module.exports = async function(api, event) {
  try {
    // Lấy thông tin user và thread từ global data hoặc API
    const getUserName = async (uid) => {
      try {
        // Kiểm tra trong cache trước
        if (global.data.userName && global.data.userName.has(uid)) {
          return global.data.userName.get(uid);
        }
        
        // Nếu không có trong cache, gọi API
        const userInfo = await api.getUserInfo(uid);
        return userInfo[uid]?.name || `User:${uid}`;
      } catch {
        return `User:${uid}`;
      }
    };

    const getThreadName = async (tid) => {
      try {
        if (global.data.threadInfo && global.data.threadInfo.has(tid)) {
          return global.data.threadInfo.get(tid).threadName || `Thread:${tid}`;
        }
        
        const threadInfo = await api.getThreadInfo(tid);
        return threadInfo.threadName || `Thread:${tid}`;
      } catch {
        return `Thread:${tid}`;
      }
    };

    const [userName, threadName] = await Promise.all([
      getUserName(event.senderID),
      getThreadName(event.threadID)
    ]);

    // Format log message
    const formattedUser = chalk.bold.cyan(userName);
    const formattedThread = chalk.bold.green(threadName);

    switch (event.type) {
      case 'message':
        const content = event.body 
          ? chalk.yellow(event.body)
          : event.attachments?.length 
            ? chalk.magenta('[Media]') 
            : chalk.gray('[No content]');
        return `${formattedUser} → ${formattedThread}: ${content}`;

      case 'event':
        return `${formattedUser} → ${formattedThread}: ${chalk.blue(event.type)} event`;

      default:
        return `${formattedUser} → ${formattedThread}: ${chalk.gray(event.type)}`;
    }
  } catch (error) {
    console.error('Formatter error:', error);
    return `[Error formatting ${event.type} event]`;
  }
};