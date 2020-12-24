const Discord = require("discord.js");
const { userSchema, config } = require("./mongodb");

const incrementRank = async (id, name, discriminator) => {
  await userSchema.findOne(
    {
      id: id,
    },
    (err, user) => {
      if (err) console.log(err);
      if (!user) {
        const newUser = new userSchema({
          id: id,
          name: name,
          messages_count: 0,
          rank: 0,
          discordName: `${name}#${discriminator}`,
        });

        return newUser.save();
      } else {
        console.log("incrementing rank:", user.discordName, user.rank + 1);
        user.rank = user.rank + 1;
        user.save();
      }
    }
  );
};

const incrementMessages = async (id, name) => {
  await userSchema.findOne(
    {
      id: id,
    },
    (err, user) => {
      if (err) console.log(err);
      if (!user) {
        const newUser = new userSchema({
          id: id,
          name: name,
          messages_count: 0,
          rank: 0,
        });

        return newUser.save();
      }
      if (user) {
        user.messages_count = user.messages_count + 1;
        user.save();
      }
    }
  );
};

const levelUp = async (message, guildId, level, client) => {
  if (message.user.id === client.user.id) return;
  console.log("level up");

  const channel = await config.findOne(
    {
      id: guildId,
    },
    (err, server) => {
      if (err) console.log(err);
      if (!server) {
        const newServer = new config({
          id: guildId,
          guildPrefix: "!",
          guildNotificationChannelID: null,
          welcomeChannel: null,
          customRanks: {},
          rankTime: null,
        });

        return newServer.save();
      }
    }
  );

  const hasCustomRank = channel.customRanks.hasOwnProperty(level);

  const embed = new Discord.MessageEmbed()
    .setAuthor(message.user.username)
    .setColor("#8966ff")
    .setThumbnail(message.user.avatarURL({ format: "png" }))
    .addField("Rank", `${level}`);

  const notificationChannel = client.channels.cache.get(
    channel.guildNotificationChannelID
  );

  if (hasCustomRank) {
    const customRankId = channel.customRanks[level];
    const customRole = message.guild.roles.cache.get(customRankId);

    message.roles
      .add(customRole)
      .then(() => {
        console.log("guildNotificationChannelID", notificationChannel);
        if (channel.guildNotificationChannelID)
          return notificationChannel.send(embed);
      })
      .catch(console.error);
  }
};

module.exports = { incrementRank, incrementMessages, levelUp };
