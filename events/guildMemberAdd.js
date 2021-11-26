const { config } = require("../mongodb");
const Discord = require("discord.js");
const Canvas = require("canvas");
const path = require("path");
// const fontPath = path.join(__dirname, "..", "assets", "Inter-Bold.ttf");

// Canvas.registerFont(fontPath, { family: "Inter" });

const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    ctx.font = `${(fontSize -= 10)}px Inter`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (ctx.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return ctx.font;
};

module.exports = async (client, member) => {
  const configSettings = {
    id: member.guild.id,
    customRanks: {},
  };

  const server = await config.findOne({
    id: member.guild.id,
  });

  if (!server) {
    const newServer = new config(configSettings);
    await newServer.save();
  }
  if (!server?.welcomeMessage) return;
  const image = path.join(__dirname, "..", "assets", "wallpaper.png");

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(image);

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.font = applyText(
    canvas,
    server.welcomeMessage.replace(/\[user]/g, member.user.username)
  );

  ctx.fillStyle = "#FFFF";
  ctx.fillText(
    server.welcomeMessage.replace(/\[user]/g, member.user.username),
    canvas.width / 2.5,
    canvas.height / 1.8
  );

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(
    member.displayAvatarURL({ format: "png" })
  );
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer());

  if (server.welcomeChannel) {
    const channel = member.guild.channels.cache.get(server.welcomeChannel);

    channel.send({
      content: `Welcome to the server, ${member.user.username}!`,
      files: [attachment],
    });
  }
};
