const Discord = require("discord.js");
const { config } = require("../mongodb");

exports.run = async (client, message, args) => {
  const perms = message.member.permissions;
  const isAdmin = perms.has("ADMINISTRATOR");

  const channelId = args[0];

  if (isAdmin) {
    config.findOne(
      {
        id: message.guild.id,
      },
      (err, server) => {
        if (err) console.log(err);
        if (server) {
          const channelName = client.channels.cache.get(channelId)?.name;

          if (channelName) {
            server.notificationChannel = channelId.trim();
            server.save();
            const embed = new Discord.MessageEmbed()
              .setColor("#8966ff")
              .addField("Notification channel:", `${channelName}`);

            return message.channel.send({ embeds: [embed] });
          } else {
            const isNull = channelId == "null";

            if (isNull) {
              server.notificationChannel = null;
              server.save();
            }

            const embed = new Discord.MessageEmbed()
              .setColor("#8966ff")
              .addField("Error", `Id not valid`);

            return message.channel.send({ embeds: [embed] });
          }
        }
      }
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
};

exports.help = {
  name: "setnotificationchannel",
  category: "System",
  description: "You can set a channel to send the notifications to",
  usage: "setnotificationchannel CHANNEL_ID",
};
