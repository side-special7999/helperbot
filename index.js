const Discord = require("discord.js");

const bot = new Discord.Client();

bot.on("guildCreate", async gc => {

  gc.channels.find(r => r.name === "general").send("Hello! I can set up your server for you. Just use *setup to get started!");

});

bot.on("message", async msg => {

  if (msg.author.bot) return; // any message from a bot is ignored

  if (msg.content.indexOf("*") !== 0) return; // checks to make sure the prefix (derived from config.json) is present in the message

  const args = msg.content.slice(1).trim().split(/ +/g); // trims the args

  const cmd = args.shift().toLowerCase(); // finds the actual command

  const guild = msg.guild;

  if (cmd === "setup") {

    if (guild.afkChannel) {

      msg.channel.send("There is already an AFK channel set.");

    } else {

      if (guild.channels.find(ct => ct.name === "Voice Channels" && ct.type === "category")) {

        guild.createChannel("AFK", {

          type: "voice"

        }).then(function (nc) {

          nc.setParent(guild.channels.find(ct => ct.name === "Voice Channels"));

          guild.setAFKChannel(nc);

        });

        msg.channel.send("Successfully created an AFK Channel!");

      } else {

        guild.createChannel("Voice Channels", {

          type: "category"

        });

        guild.createChannel("AFK", {

          type: "voice"

        }).then(function (nc) {

          nc.setParent(guild.channels.find(ct => ct.name === "Voice Channels"));

          guild.setAFKChannel(nc);

        });

        msg.channel.send("Successfully created a voice category and an AFK Channel!");

      }

    }
    if (guild.roles.find(r => r.name === "Admin")) {
      msg.channel.send("There is already an admin role.");
    } else {
      guild.createRole({
        name: "Admin",
        permissions: ["ADMINISTRATOR"]
      });

      msg.channel.send("Successfully created an admin role!");
    }
    if (guild.defaultMessageNotifications === 'MENTIONS') {
      msg.channel.send("Default notification settings are already on mentions only.");
    } else {
      msg.guild.setDefaultMessageNotifications('MENTIONS');
      msg.channel.send("Set default notifications to mentions only.");

    }

    if (guild.channels.find(ch => ch.name === "welcome")) {
      msg.channel.send("There is already a welcome channel.");
    } else {
      guild.createChannel('welcome', {
        type: 'text',
        permissionOverwrites: [{
          id: msg.guild.id,
          deny: ['SEND_MESSAGES'],
        }, ],
      }).then(function (ch) {

        ch.createInvite({
          maxAge: 0,
          maxUses: 0,
        }, ).then(function (inv) {

          ch.send("Permanent invite link: " + inv.url);

        });

      });

      msg.channel.send("Set up a welcome channel and a permanent invite link.");

    }
  }
});
bot.login("noToken.forYou.butNiceTry");
