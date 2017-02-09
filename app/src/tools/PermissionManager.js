var env = require('../../../config.json'),
    Database = requires('./Database.js')

var PermissionManagerModule = function () {
    this.ownerId = env.ownerId;
    this.database = new Database();
};

PermissionManagerModule.prototype.GetUserPermission = function(userId, errorCallback) {
    /* 
        Permissions: owner > admin > mod
    */

    if (this.ownerId == userId)                     return ['owner', 'admin', 'mod'];
    if (this.CheckIfAdmin(userId, errorCallback))   return ['admin', 'mod'];
    if (this.CheckIfMod(userId, errorCallback))     return ['mod'];

    return [];
}

PermissionManagerModule.prototype.CheckIfAdmin = function(userId, errorCallback) {
    var onSuccess = function(results) {
        return results[0] == 1;
    }
    var onError = function(error) {
        errorCallback(error);
    }

    this.database.Query("SELECT COUNT(*) FROM Admin WHERE ?", { "AdminId" : userId }, onSuccess, onError);
}

PermissionManagerModule.prototype.CheckIfMod = function(userId, errorCallback) {
    var onSuccess = function(results) {
        return results[0] == 1;
    }
    var onError = function(error) {
        errorCallback(error);
    }

    this.database.Query("SELECT COUNT(*) FROM Moderator WHERE ?", { "ModeratorId" : userId }, onSuccess, onError);
}

module.exports = PermissionManagerModule;
