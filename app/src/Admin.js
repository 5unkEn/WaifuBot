var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js'),
    Database = require('./Database.js')

var AdminModule = function () {
    this.keywords = env.keywords;
    this.commandParser = new CommandParser;
    this.database = new Database();

    this.lowestRequiredPermission = 'owner';
};

AdminModule.prototype.getKeywords = function() {
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

AdminModule.prototype.Message = function(keywords, message, callback)
{
    var parsedCommand = this.commandParser.Parse(message.content);
    
    if (message.mentions.users.length == 0) {
        return callback("Mention the member you wish to grant admin to using @");
    }

    if (message.Mentions.users.length > 1) {
        return callback("You can only grant admin right to one user at a time");
    }

    if (parsedCommand.Flags.includes('--revoke')) {
        return this.RevokeAdmin(message.mentions.users[0], function(error, message) {
            if (error) { return callback("Error occured"); }
            return callback(message);
        });
    }

    return this.GrandAdmin(message.mentions.users[0], function(error, message) {
        if (error) { return callback("Error occured"); }
        return callback(message);
    });
}

AdminModule.prototype.GrandAdmin = function(user, callback) {
    var onSuccess = function(results) {
        return callback(null, "Admin rights granted for user " + user.mention());
    }

    var onError = function(error) {
        return callback(error, null);
    }

    return this.database.Query("INSERT INTO Admin(AdminId) VALUES('?')", [user.id], onSuccess, onError);
}

AdminModule.prototype.RevokeAdmin = function(user, callback) {
    var onSuccess = function(results) {
        return callback(null, "Admin rights revoked for user " + user.mention());
    }

    var onError = function(error) {
        return callback(error, null);
    }

    return this.database.Query("DELETE FROM Admin WHERE ?", { "AdminId" : user.id }, onSuccess, onError);
}

module.exports = AdminModule;
