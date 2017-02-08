var env = require('../../config.json');

var WaifuModule = function () {
    this.keywords = env.keywords;
};

WaifuModule.prototype.requiresDb = function() {
    return true;
}

WaifuModule.prototype.getKeywords = function() {
    var result = [];
    for (var i in this.keywords) {
        if (this.keywords.hasOwnProperty(i)) {
            result.push(this.keywords[i]);
        }
    }
    return result;
}

WaifuModule.prototype.Message = function(keyword, message, connection, callback) {
    var result;

    connection.connect(function(err) {
        if (err) {
            console.log(err);
            return callback("Error occured");
        }

        var fullName = message.content.replace("!waifu", "").trim();
        var namePost = { "Waifu.FullName" : fullName };

        result = connection.query('SELECT Link FROM Link, Waifu WHERE Link.Waifu = Waifu.WaifuId AND ? ORDER BY RAND() LIMIT 1', namePost, function(err, result) {
            if (err) {
                console.log(err);
                return callback("Error occured");
            }

            if (result.length == 0)
                return callback("Your waifu does not exist!");
            else
                return callback(result[0].Link);
        });
    });
}

module.exports = WaifuModule;