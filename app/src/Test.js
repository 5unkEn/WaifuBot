var env = require('../../config.json'),
    PermissionManager = require('./tools/PermissionManager.js')

var TestModule = function () {
    this.keywords = env.keywords;
    this.PermissionManager = new PermissionManager;

    this.Requires.Db = false;
    this.Requires.GlobalAdmin = true;
    this.Requires.Admin = false;
    this.Requires.Mod = false;
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
    var cmdArg = this.PermissionManager.GetUserPermission(message.author.id, function(err) {
        if (err) return callback("Error occured");
    });
    return callback("Your parsed command: " + cmdArg);
}

module.exports = TestModule;
