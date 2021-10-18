const Discord = require("discord.js");
const logger = require("./modules/logger");
const { config } = require("./mongodb");

const incrementRank = async (user) => {
  const newRank = (user.rank ? user.rank : 0) + 1;
  user.rank = newRank;
  assignRankRole(user, client, newRank);
  return user.save();
};

const decrementRank = async (user) => {
  const newRank = (user.rank ? user.rank : 0) - 1;
  user.rank = newRank >= 0 ? newRank : 0;
  assignRankRole(user, client, newRank);
  return user.save();
};

const incrementMessages = async (user) => {
  user.messages_count = user.messages_count + 1;
  await user.save();
};

const assignRankRole = async (state, client, level, tryNum = 0) => {
  if (user.id === client.user.id) return;

  const guildId = state.guild.id;

  const channel = await config.findOne({
    id: guildId,
  });

  if (!channel) {
    const newServer = new config({
      id: guildId,
      guildPrefix: "!",
      guildNotificationChannelID: null,
      welcomeChannel: null,
      customRanks: {},
      rankTime: null,
      defaultRole: null,
    });

    await newServer.save();

    if (tryNum < 3) assignRankRole(state, client, level, tryNum + 1);
    else return;
  }

  const embed = new Discord.MessageEmbed()
    .setAuthor(state.member.user.username)
    .setColor("#8966ff")
    .setThumbnail(state.member.user.avatarURL({ format: "png" }))
    .addField("Rank", `${level}`);

  const notificationChannel = client.channels.cache.get(
    channel?.guildNotificationChannelID
  );

  if (channel?.customRanks) {
    const customRankId = channel.customRanks.get(level);

    if (customRankId) {
      const customRole = state.guild.roles.cache.get(customRankId);

      message.roles
        .add(customRole)
        .then(() => {
          if (channel?.guildNotificationChannelID)
            return notificationChannel.send({ embeds: [embed] });
        })
        .catch((e) => logger.error(e));
    }
  }
};

const msToTime = (duration) => {
  let milliseconds = Math.floor((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
};

const toProperCase = (string) => {
  return string.replace(
    /([^\W_]+[^\s-]*) */g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

module.exports = {
  incrementRank,
  decrementRank,
  incrementMessages,
  assignRankRole,
  msToTime,
  toProperCase,
};
