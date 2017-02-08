var CommandParserModule = function () {};

CommandParserModule.prototype.Parse = function(command) {
    /* 
        Command composition:
        
        !command        - command keyword
        some arguments  - command arguments, passed separated by spaces
        --flag          - command flag, adds different behavious
    */

    command = this.RemoveCommandKeyword(command);
    console.log(command);
}

CommandParserModule.prototype.RemoveCommandKeyword = function(command) {
    var result = command.split(' ');
    result.shift();
    return result instanceof Array ? result.join(' ') : result;
}

module.exports = CommandParserModule;
