var env = require('./config.json'),
    WaifuBot = require('./app/index.js'),
    Discord = require('discord.js');

var wbot = new WaifuBot;
var discordjs = new Discord.Client();

discordjs.on("ready", function () {
    discordjs.user.setPresence({"game": { "name" : "Nekopara" } });
    console.log("Ready to begin! Serving in " + discordjs.channels.array.length + " channels");
});

discordjs.on('message', message =>
{
    if (typeof wbot.loadKeywords() !== 'undefined' && wbot.loadKeywords().length > 0) {
        wbot.checkMessageForKeywords(message.content, wbot.loadKeywords(), function(keyword)
        {
            if (keyword != 0) {
                wbot.runKeywordFunction(wbot.getKeyByValue(wbot.keywords, keyword), keyword, message, function(reply)
                {
                    message.channel.sendMessage(reply);
                });
            }
        });
    }
});

discordjs.on('disconnected', function () {
    console.log('Disconnected.');
    process.exit(1);
});

discordjs.login(env.discord.token);
