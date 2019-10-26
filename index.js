const Discord = require('discord.js');
const bot = new Discord.Client();

const ytdl = require("ytdl-core");

const token = 'NjM3Mzc0MzM1ODAzMzI2NDcw.XbNPXQ.tNsSygpyZJfztJWB70TAYjS2QGs';

var servers = {};

bot.on('ready', () => {
    console.log('This bot is Online!');
    bot.user.setActivity('Prefix "s" | Type "shelp" for Help')
})

//Prefix
var PREFIX = 's';



//Help
bot.on('message', msg => {

    let args = msg.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'help':
            msg.channel.sendMessage('`If this dosent help you please contact Apex#9911 for further help.`');
            msg.channel.sendMessage('`Commands`')
            msg.channel.sendMessage('`_____________`')
            msg.channel.sendMessage('`shelp  - Shows commands.`')
            msg.channel.sendMessage('`shelp Whitelist - Shows whitelist options.`')
            msg.channel.sendMessage('`info - Tells you about Savitar.`')
            msg.channel.sendMessage('`swebsite  - Shows website link.`')
            msg.channel.sendMessage('`plite is good  - Tells you otherwise.`')
            break;
        case 'yeet':
            if (!msg.member.roles.find(r => r.name === "Moderator")) return msg.reply('You cannot use this command!')
                .then(msg => msg.delete(2500));
            if (!args[1]) return msg.reply('Please enter a valid number.')
            msg.channel.bulkDelete(args[1]);
            break;
        case 'profile':
            msg.channel.sendMessage('Yeet heres your profile')
            const profile = new Discord.RichEmbed()
                .setTitle('Profile')
                .addField('Player Name', msg.author.username);
            msg.channel.sendEmbed(profile);
            break;
        case 'play':

            function play(connection, msg) {
                var server = servers[msg.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: "audioonly" }));

                server.queue.shift();

                server.dispatcher.on("end", function () {
                    if (server.queue[0]) {
                        play(connection, msg);
                    } else {
                        connection.disconnect();
                    }
                })

            }




            if (!args[1]) {
                msg.channel.send("Please provide a link.");
                return;
            }

            if (!msg.member.voiceChannel) {
                msg.channel.send("You must be in a voice channel to play music!");
                return;
            }

            if (!servers[msg.guild.id]) servers[msg.guild.id] = {
                queue: []
            }

            var server = servers[msg.guild.id];

            server.queue.push(args[1]);

            if (!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function (connection) {
                play(connection, msg);
            })
            break;
        case 'kip':
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            msg.channel.send('Skipped!')
            break;
        case 'top':
            var server = servers[msg.guild.id];
            if (msg.guild.voiceConnection) {
                for (var i = server.queue.length - 1; i >= 0; i--) {
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                msg.channel.send('Queue ended, leaving voice channel.')
                console.log('queue stopped.')
            }

            break;
        case 'oftyeet':
            if (!msg.member.roles.find(r => r.name === "Management") || !msg.member.roles.find(r => r.name === "CEO")) return msg.reply('You cannot use this command!').then(msg => msg.delete(2500));

            const user = msg.mentions.users.first();

            if (user) {
                const member = msg.guild.member(user);

                if (member) {
                    member.kick('You have been kicked from Savitar').then(() => {
                        msg.channel.send(`${user.tag} has been yeeted out of the server.`);
                    }).catch(err => {
                        msg.reply('Error kicking member.').then(msg => msg.delete(2500));
                        console.log(err);
                    });
                } else {
                    msg.reply("Invalid User").then(msg => msg.delete(2500));
                }
            } else {
                msg.reply('You need to specify a person!').then(msg => msg.delete(2500));
            }
            break;
        case 'uperyeet':
            if (!msg.member.roles.find(r => r.name === "Management") || !msg.member.roles.find(r => r.name === "CEO")) return msg.reply('You cannot use this command!').then(msg => msg.delete(2500));

            const user2 = msg.mentions.users.first();

            if (user2) {
                const member = msg.guild.member(user2);

                if (member) {
                    member.ban({ reason: 'yeet.' }).then(() => {
                        msg.channel.send(`${user.tag} has been permanently yeeted out of the server.`)
                    })
                } else {
                    msg.reply("Invalid User").then(msg => msg.delete(2500));
                }
            } else {
                msg.reply('You need to specify a person!').then(msg => msg.delete(2500));
            }
            break;
        case 'peakyeet':
            if (!msg.member.roles.find(r => r.name === "Moderator")) return msg.reply('You cannot use this command!')
            let person = msg.guild.member(msg.mentions.users.first() || msg.guild.members.get(args[1]))
            if (!person) return msg.reply("Invalid User");

            let mainrole = msg.guild.roles.find(role => role.name === "Member");
            let muterole = msg.guild.roles.find(role => role.name === "Muted");

            if (!muterole) return msg.reply("Please set valid mute role.")

            let time = args[2];

            if (!time) {
                return msg.reply("Please specify a time window.");
            }

            person.addRole(muterole.id);

            msg.channel.send(`@${person.user.tag} is muted for ${ms(ms(time))}`);

            setTimeout(function () {
                person.addRole(mainrole.id);
                msg.channel.send(`@${person.user.tag} was unmuted.`)
            }, ms(time));

            break;

    }
})









bot.login(token);