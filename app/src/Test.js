var env = require('../../config.json'),
    CommandParser = require('./src/tools/CommandParser.js')

var TestModule = function () {
    this.keywords = env.keywords;
    this.CommandParser = CommandParser;
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
    CommandParser.Parse(message.content);
    return callback("WaifuBot Commands: " + words.split(',').join(', '));
}

module.exports = TestModule;