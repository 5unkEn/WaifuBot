var env = require('../config.json'),
    Admin = require('./src/Admin.js'),
    Help = require('./src/Help.js'),
    Test = require('./src/Test.js'),
    Waifu = require('./src/Waifu.js'),
    PermissionManager = require('./src/tools/PermissionManager.js')

var WaifuBot = function () {
    this.keywords = env.keywords;
    this.Admin = new Admin;
    this.Help = new Help;
    this.Test = new Test;
    this.Waifu = new Waifu;

    this.permissionManager = new PermissionManager();
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

WaifuBot.prototype.runKeywordFunction = function(keywordFunction, keyword, message, callback)
{
    var bot = this;
    this.permissionManager.GetUserPermission(message.author.id, function(error, permissions) {
        if (error) { return callback("Error occured"); }

        if (bot.hasPermission(bot[keywordFunction], permissions)) 
            return bot[keywordFunction].Message(keyword, message, callback);
        else
            return callback("Insufficient permissions");
    });
}

WaifuBot.prototype.hasPermission = function(command, userPermissions) {
    if (command.lowestRequiredPermission == null)
        return true;

    if (command.lowestRequiredPermission == 'owner' && userPermissions.includes("owner"))
        return true;
    if (command.lowestRequiredPermission == 'admin' && userPermissions.includes("admin"))
        return true;
    if (command.lowestRequiredPermission == 'mod' && userPermissions.includes("mod"))
        return true;

    return false; 
}

module.exports = WaifuBot;
