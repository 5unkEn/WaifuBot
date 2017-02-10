var env = require('../../config.json'),
    PermissionManager = require('./tools/PermissionManager.js')

var TestModule = function () {
    this.keywords = env.keywords;
    this.permissionManager = new PermissionManager();

    this.Requires = {
        Owner : false,
        Admin : false,
        Mod : false
    };
};

TestModule.prototype.getKeywords = function() {
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

TestModule.prototype.Message = function(keywords, message, callback)
{
    this.permissionManager.GetUserPermission(message.author.id, function(error, permissions) {
        if (error) { return callback("Error occured"); }
        else { return callback("Your parsed command: " + permissions); }
    });
}

module.exports = TestModule;
