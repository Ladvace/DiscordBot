const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const config = new Schema({
  id: { type: String, required: true, unique: true },
  guildPrefix: { type: String, default: "!" },
  guildNotificationChannelID: String,
  welcomeChannel: String,
  customRanks: Map,
  rankTime: { type: Number, default: 0 },
  welcomeMessage: {
    type: String,
    default: "Welcome to the server [user]!",
  },
  defaultRole: String,
});

const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  messages_count: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  lastRankTime: Date,
  discordName: String,
});

module.exports = {
  config: mongoose.model("servers", config),
  userSchema: mongoose.model("users", userSchema),
};