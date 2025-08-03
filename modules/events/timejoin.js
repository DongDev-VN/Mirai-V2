module.exports.config = {
    name: "timejoin",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "Nam",
    description: "Tự xóa data time join user khi out"
};
const fs = require("fs");
var path = __dirname + "/../commands/cache/timeJoin.json";
module.exports.run = async function ({
    event: e
}) {
    const {
        threadID: t,
        logMessageData: l
    } = e, {
        writeFileSync: w,
        readFileSync: r
    } = fs, {
        stringify: s,
        parse: p
    } = JSON;
    var v = l.leftParticipantFbId;
    let a = p(r(path));
    a[v + t] = "";
    w(path, s(a, null, 2));
}