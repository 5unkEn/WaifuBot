var env = require('./config.json'),
    WaifuBot = require('./app/index.js'),
    Discord = require('discord.js');
    Mysql = require('mysql');

var wbot = new WaifuBot;
var discordjs = new Discord.Client();

discordjs.on("ready", function () {
    console.log("Ready to begin! Serving in " + discordjs.channels.array.length + " channels");
});

discordjs.on('message', message =>
{
    if (typeof wbot.loadKeywords() !== 'undefined' && wbot.loadKeywords().length > 0) {
        wbot.checkMessageForKeywords(message.content, wbot.loadKeywords(), function(keyword)
        {
            if (keyword != 0) {
                var newConnection = Mysql.createConnection({
                    host     : env.database.host,
                    user     : env.database.user,
                    password : env.database.pass,
                    database : env.database.database
                });

                wbot.runKeywordFunction(wbot.getKeyByValue(wbot.keywords, keyword), keyword, message, newConnection, function(reply)
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