var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js'),
    Database = require('./tools/Database.js'),
    PermissionManager = require('./tools/PermissionManager.js')

var AdminModule = function () {
    this.keywords = env.keywords;
    this.commandParser = new CommandParser;
    this.database = new Database();
    this.permissionManager = new PermissionManager();

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
    var mentions = message.mentions.users.array();

    if (mentions.length == 0) {
        return callback("Mention the member you wish to grant admin to using @");
    }

    if (mentions.length > 1) {
        return callback("You can only grant admin to one user at a time");
    }

    if (parsedCommand.Flags.includes('--revoke')) {
        return this.RevokeAdmin(mentions[0], function(error, message) {
            if (error) { return callback("Error occured"); }
            return callback(message);
        });
    }

    return this.GrantAdmin(mentions[0], function(error, message) {
        if (error) { return callback("Error occured"); }
        return callback(message);
    });
}

AdminModule.prototype.GrantAdmin = function(user, callback) {
    var onSuccess = function(results) {
        return callback(null, "Admin rights granted for user <@" + user.id + ">");
    }

    var onError = function(error) {
        return callback(error, null);
    }

    var database = this.database;
    this.permissionManager.GetUserPermission(user.id, function(error, permissions) {
        if (error) { return callback("Error occured"); }

        if (permissions.includes("owner") || permissions.includes("admin")) { return callback(null, "This user already is an admin"); }
        return database.Query("INSERT IGNORE INTO Admin(AdminId) VALUES(?)", [user.id], onSuccess, onError);
    });
}

AdminModule.prototype.RevokeAdmin = function(user, callback) {
    var onSuccess = function(results) {
        return callback(null, "Admin rights revoked for user <@" + user.id + ">");
    }

    var onError = function(error) {
        return callback(error, null);
    }

    return this.database.Query("DELETE FROM Admin WHERE ?", { "AdminId" : user.id }, onSuccess, onError);
}

module.exports = AdminModule;
