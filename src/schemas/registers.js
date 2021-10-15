const { Schema, model } = require("mongoose");

const register = Schema({

    row: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    gender: { type: String, default: "" },
    guildID: { type: String, default: "" },
    userID: { type: String, default: "" },
    staffID: { type: String, default: "" },
    date: { type: Number, default: Date.now() },
    nameArray: { type: Array, default: [] },
    options: { type: Object, default: {} },
});

module.exports = model("register", register);