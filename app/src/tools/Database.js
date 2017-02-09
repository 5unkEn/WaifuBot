var env = require('../../../config.json'),
    Mysql = require('mysql');

var DatabaseModule = function() {
    this.host = env.database.host;
    this.user = env.database.user;
    this.password = env.database.password;
    this.database = env.database.database;
};

DatabaseModule.prototype.GetConnection = function() {
    return Mysql.createConnection({
        host     : this.host,
        user     : this.user,
        password : this.password,
        database : this.database
    });
}

DatabaseModule.prototype.Query = function(query, data, onSuccess, onError) {
    this.GetConnection().connect(function(error) {
        if (error) return onError("Database connection error");

        connection.query(query, data, function(err, results) {
            if (error) return onError("Database query error");
            return onSuccess(results);
        });
    });
}

module.exports = DatabaseModule;
