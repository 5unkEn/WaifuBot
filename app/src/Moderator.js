var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js'),
    Database = require('./tools/Database.js'),
    PermissionManager = require('./tools/PermissionManager.js')

var ModeratorModule = function () {
    this.keywords = env.keywords;
    this.commandParser = new CommandParser;
    this.database = new Database();
    this.permissionManager = new PermissionManager();

    this.lowestRequiredPermission = 'admin';
};

ModeratorModule.prototype.getKeywords = function() {
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

ModeratorModule.prototype.Message = function(keywords, message, callback)
{
    var parsedCommand = this.commandParser.Parse(message.content);
    var mentions = message.mentions.users.array();

    if (mentions.length == 0) {
        return callback("Mention the member you wish to grant Moderator to using @");
    }

    if (mentions.length > 1) {
        return callback("You can only grant moderator to one user at a time");
    }

    if (parsedCommand.Flags.includes('--revoke')) {
        return this.RevokeModerator(mentions[0], function(error, message) {
            if (error) { return callback("Error occured"); }
            return callback(message);
        });
    }

    return this.GrantModerator(mentions[0], function(error, message) {
        if (error) { return callback("Error occured"); }
        return callback(message);
    });
}

ModeratorModule.prototype.GrantModerator = function(user, callback) {
    var onSuccess = function(results) {
        return callback(null, "Moderator rights granted for user <@" + user.id + ">");
    }

    var onError = function(error) {
        return callback(error, null);
    }

    var database = this.database;
    this.permissionManager.GetUserPermission(user.id, function(error, permissions) {
        if (error) { return callback("Error occured"); }

        if (permissions.includes("owner") || permissions.includes("admin") || permissions.includes("mod")) { return callback(null, "This user already is a moderator"); }            
        return database.Query("INSERT IGNORE INTO Moderator(ModeratorId) VALUES(?)", [user.id], onSuccess, onError);
    });
}

ModeratorModule.prototype.RevokeModerator = function(user, callback) {
    var onSuccess = function(results) {
        return callback(null, "Moderator rights revoked for user <@" + user.id + ">");
    }

    var onError = function(error) {
        return callback(error, null);
    }

    return this.database.Query("DELETE FROM Moderator WHERE ?", { "ModeratorId" : user.id }, onSuccess, onError);
}

module.exports = ModeratorModule;
