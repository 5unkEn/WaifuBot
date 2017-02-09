var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js')

var WaifuModule = function () {
    this.keywords = env.keywords;
    this.CommandParser = new CommandParser;

    this.Requires.Db = true;
    this.Requires.GlobalAdmin = false;
    this.Requires.Admin = false;
    this.Requires.Mod = false;
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

WaifuModule.prototype.Message = function(keyword, message, connection, callback) {
    var parsedCommand = this.CommandParser.Parse(message.content);

    var onSuccess = function (results) {
        return results.length == 0 ? callback("Your waifu does not exist!") : callback(results[0].Link);
    }
    var onError = function (message) {
        return callback(message);
    }

    this.Search(connection, parsedCommand.Arguments.join(' '), parsedCommand.Flags, onSuccess, onError);
}

WaifuModule.prototype.Search = function(connection, waifuName, flags, onSuccess, onError) {
    flags = flags == null ? [] : flags;

    if (flags.includes('--gis')) {
        console.log("Search on google images");
    }
    else {
        connection.connect(function(err) {
            if (err) { return onError("Database connection error occured"); }

            connection.query("SELECT Link FROM Link, Waifu WHERE Link.Waifu = Waifu.WaifuId AND Waifu.FullName REGEXP '[[:<:]]" + waifuName + "[[:>:]]' ORDER BY RAND() LIMIT 1", function(err, results) {
                if (err) { return onError("Database query error occured"); }
                return onSuccess(results);
            });
        });
    }
}

module.exports = WaifuModule;
