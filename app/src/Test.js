var env = require('../../config.json'),
    CommandParser = require('./tools/CommandParser.js')

var TestModule = function () {
    this.keywords = env.keywords;
    this.CommandParser = new CommandParser;
};

TestModule.prototype.requiresDb = function() {
    return false;
}

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
    var cmdArg = this.CommandParser.Parse(message.content);
    return callback("Your parsed command: " + cmdArg);
}

module.exports = TestModule;
