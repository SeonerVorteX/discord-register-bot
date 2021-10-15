const { Schema, model } = require("mongoose");

const reload = Schema({
    type: { type: String, default: "register"},
    authorID: { type: String, default: "" },
    channelID: { type: String, default: "" },
    messageID: { type: String, default: "" },
});

module.exports = model("reload", reload);