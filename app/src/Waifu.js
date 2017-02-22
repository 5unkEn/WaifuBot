var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js'),
    Database = require('./tools/Database.js')

var WaifuModule = function () {
    this.keywords = env.keywords;
    this.commandParser = new CommandParser;
    this.database = new Database();

    this.lowestRequiredPermission = null;
};

WaifuModule.prototype.getKeywords = function() {
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

WaifuModule.prototype.Message = function(keyword, message, callback) {
    var parsedCommand = this.commandParser.Parse(message.content);

    var onSuccess = function (results) {
        return results.length == 0 ? callback("Your waifu does not exist!") : callback(results[0].Link);
    }
    var onError = function (message) {
        return callback(message);
    }

    return database.Query("SELECT Link FROM Link, Waifu WHERE Link.Waifu = Waifu.WaifuId AND Waifu.FullName REGEXP '[[:<:]]" + waifuName + "[[:>:]]' ORDER BY RAND() LIMIT 1", null, onSuccess, onError);
}

module.exports = WaifuModule;
