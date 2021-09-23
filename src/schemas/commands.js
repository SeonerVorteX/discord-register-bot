const { Schema, model } = require("mongoose");

const commands = Schema({
  guildID: { type: String, default: "" },
  registerCommands: { type: Array, default: [] },
});

module.exports = model("commands", commands);