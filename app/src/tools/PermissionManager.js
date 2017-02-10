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

    var adminCalled = false;
    var modCalled = false;
    var sent = false;

    if (this.ownerId == userId) { return callback(null, ['owner', 'admin', 'mod']) };

    this.CheckIfAdmin(userId, function(error, isAdmin) {
        adminCalled = true;
        if (isAdmin && !sent) { sent = true; return callback(error, ['admin', 'mod']); }
        if (modCalled && !sent) { sent = true; return callback(error, []); }
    });

    this.CheckIfMod(userId, function(error, isMod) {
        modCalled = true;
        if (isMod && !sent) { sent = true; return callback(error, ['mod']) };
        if (adminCalled && !sent) { sent = true; return callback(error, []); }
    });
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
