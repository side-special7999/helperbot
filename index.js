const Discord = require("discord.js");

const bot = new Discord.Client();
bot.on("ready", () => {
    bot.user.setPresence({
        game: {
            name: 'help => *help'
        },
        status: 'idle'
    });
});
bot.on("guildCreate", async gc => {

    gc.channels.find(r => r.name === "general").send("Hello! I can set up your server for you. Just use *setup to get started!");

});

bot.on("message", async msg => {

    if (msg.author.bot) return; // any message from a bot is ignored

    if (msg.content.indexOf("*") !== 0) return; // checks to make sure the prefix (derived from config.json) is present in the message

    const args = msg.content.slice(1).trim().split(/ +/g); // trims the args

    const cmd = args.shift().toLowerCase(); // finds the actual command

    const guild = msg.guild; // shortens the code a LOOOT.

    const cha = msg.channel; // same as above!

    if (cmd === "setup") {

        if (guild.afkChannel) {

            cha.send("There is already an AFK channel set.");

        } else {

            if (guild.channels.find(ct => ct.name === "Voice Channels" && ct.type === "category")) {

                guild.createChannel("AFK", {

                    type: "voice"

                }).then(function(nc) {

                    nc.setParent(guild.channels.find(ct => ct.name === "Voice Channels"));

                    guild.setAFKChannel(nc);

                });

                cha.send("Successfully created an AFK Channel!");

            } else {

                guild.createChannel("Voice Channels", {

                    type: "category"

                });

                guild.createChannel("AFK", {

                    type: "voice"

                }).then(function(nc) {

                    nc.setParent(guild.channels.find(ct => ct.name === "Voice Channels"));

                    guild.setAFKChannel(nc);

                });

                cha.send("Successfully created a voice category and an AFK Channel!");

            }

        }
        if (guild.roles.find(r => r.name === "Admin")) {
            cha.send("There is already an admin role.");
        } else {
            guild.createRole({
                name: "Admin",
                permissions: ["ADMINISTRATOR"]
            });

            cha.send("Successfully created an admin role!");
        }
        if (guild.defaultMessageNotifications === 'MENTIONS') {
            cha.send("Default notification settings are already on mentions only.");
        } else {
            msg.guild.setDefaultMessageNotifications('MENTIONS');
            cha.send("Set default notifications to mentions only.");

        }

        if (guild.channels.find(ch => ch.name === "welcome")) {
            cha.send("There is already a welcome channel.");
        } else {
            guild.createChannel('welcome', {
                type: 'text',
                permissionOverwrites: [{
                    id: msg.guild.id,
                    deny: ['SEND_MESSAGES'],
                }, ],
            }).then(function(ch) {

                ch.createInvite({
                    maxAge: 0,
                    maxUses: 0,
                }, ).then(function(inv) {

                    ch.send("Permanent invite link: " + inv.url);

                });

            });

            cha.send("Set up a welcome channel and a permanent invite link.");

        }
    }
    if (cmd === "stop" && msg.author.id === "577041100016189441") { // this is my id. only i can stop the bot :)
        process.exit();
    }
    if (cmd === "name") {
        guild.setName(args.join(" "));
        cha.send("Successfully set the guild's name to " + args.join(" ") + "!");
    }
    if (cmd === "check") {
        if (guild.roles.find(r => r.name === "Admin")) {
            cha.send("There is already an admin role.");
        } else {
            cha.send("Could not find any admin role.");
        }
        if (guild.afkChannel) {

            cha.send("There is already an AFK channel set.");

        } else {
            cha.send("There is no AFK channel set.");
        }
        if (guild.channels.find(ct => ct.name === "Voice Channels" && ct.type === "category")) {
            cha.send("There is already a VC category set.");
        } else {
            cha.send("No VC category exists.");
        }
        if (guild.defaultMessageNotifications === 'MENTIONS') {
            cha.send("Default notification settings are already on mentions only.");
        } else {
            cha.send("Notification settings are not set on mentions only. NEVER SET IT TO ALL MESSAGES! EVER!");
        }
        if (guild.channels.find(ch => ch.name === "welcome")) {
            cha.send("There is already a welcome channel.");
        } else {
            cha.send("No welcome channel exists.");
        }
    }
    if (cmd === "help") {
        const help = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setTitle("Helper Bot Commands")
            .setDescription("Server Helper is a bot designed to set up the most basic parts of a new server.")
            .addField("*setup", "Sets up basic features of your new server.")
            .addField("*name", "Sets your server's name.")
            .addField("*check", "Checks if your server has what every server needs.")
            .addField("*invite", "Get a permanent OAuth2 link for the bot, as well as the official server.");
        cha.send(help);
    }
    if (cmd === "invite") {
        const inv = new Discord.RichEmbed()
            .setColor('#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6))
            .setDescription("You may add the bot to your own new server here: https://discordapp.com/api/oauth2/authorize?client_id=665029968979558409&permissions=8&scope=bot\n\nJoin the official server here (WIP): https://discord.gg/aTevuAW");
        cha.send(inv);
    }
});
bot.login("no token for you ;)");
