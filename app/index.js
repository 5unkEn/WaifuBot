var env = require('../config.json'),
    Help = require('./src/Help.js'),
    Waifu = require('./src/Waifu.js')

var WaifuBot = function () {
    this.keywords = env.keywords;
    this.Help = new Help;
    this.Waifu = new Waifu;
};

WaifuBot.prototype.loadKeywords = function ()
{
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

WaifuBot.prototype.checkMessageForKeywords = function(message, triggers, callback)
{
    for(var i = 0; i != triggers.length; i++) {
        var substring = triggers[i];
        if (message.indexOf(substring) == 0) {
            return callback(substring);
        }
    }
    return callback(0);
}

WaifuBot.prototype.getKeyByValue = function(object, value)
{
    for(var prop in object) {
        if(object.hasOwnProperty(prop)) {
            if(object[prop] == value)
                return prop;
        }
    }
}

WaifuBot.prototype.runKeywordFunction = function(keywordFunction, keyword, message, connection, callback)
{
    if (this[keywordFunction].requiresDb()) {
        this[keywordFunction].Message(keyword, message, connection, callback);
    }
    else {
        this[keywordFunction].Message(keyword, message, callback);
    }
}

module.exports = WaifuBot;