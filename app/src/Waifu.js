var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js')

var WaifuModule = function () {
    this.keywords = env.keywords;
    this.CommandParser = new CommandParser;
};

WaifuModule.prototype.requiresDb = function() {
    return true;
}

WaifuModule.prototype.getKeywords = function() {
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

WaifuModule.prototype.Message = function(keyword, message, connection, callback) {
    var parsedCommand = this.CommandParser.Parse(message.content);

    var waifuName = parsedCommand.Arguments.join(' ');
    var request = { "Waifu.FullName" : waifuName };

    var result;
    
    connection.connect(function(err) {
        if (err) { return callback("Database connection error occured"); }

        result = connection.query("SELECT Link FROM Link, Waifu WHERE Link.Waifu = Waifu.WaifuId AND Waifu.FullName REGEXP [[:<:]]" + waifuName + "[[:>:]] ORDER BY RAND() LIMIT 1", function(err, result) {
            if (err) { return callback("Database query error occured"); }

            if (result.length == 0) {
                return callback("Your waifu does not exist!");
            }
            else
                return callback(result[0].Link);
        });
    });
}

module.exports = WaifuModule;