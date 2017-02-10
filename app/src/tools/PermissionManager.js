var env = require('../../../config.json'),
    Database = require('./Database.js')

var PermissionManagerModule = function () {
    this.ownerId = env.ownerId;
    this.database = new Database();
};

PermissionManagerModule.prototype.GetUserPermission = function(userId, callback) {
    /* 
        Permissions: owner > admin > mod
    */

    if (this.ownerId == userId) { return callback("called", ['owner', 'admin', 'mod']) };

    this.CheckIfAdmin(userId, function(error, isAdmin) {
        if (isAdmin) { return callback(error, ['admin', 'mod']); }
    });

    this.CheckIfMod(userId, function(error, isMod) {
        if (isMod) { return callback(error, ['mod']) };
    });

    return callback(null, []);
}

PermissionManagerModule.prototype.CheckIfAdmin = function(userId, callback) {
    var onSuccess = function(results) {
        return callback(null, results[0].isAdmin == 1);
    }

    var onError = function(error) {
        return callback(error, false);
    }

    return this.database.Query("SELECT COUNT(*) AS isAdmin FROM Admin WHERE ?", { "AdminId" : userId }, onSuccess, onError);
}

PermissionManagerModule.prototype.CheckIfMod = function(userId, callback) {
    var onSuccess = function(results) {
        return callback(null, results[0].isMod == 1);
    }
    var onError = function(error) {
        return callback(error, false);
    }

    return this.database.Query("SELECT COUNT(*) AS isMod FROM Moderator WHERE ?", { "ModeratorId" : userId }, onSuccess, onError);
}

module.exports = PermissionManagerModule;
