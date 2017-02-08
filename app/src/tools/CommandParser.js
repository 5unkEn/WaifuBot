var CommandParserModule = function () {};

CommandParserModule.prototype.Parse = function(command) {
    /* 
        Command composition:
        
        !command        - command keyword
        some arguments  - command arguments, passed separated by spaces
        --flag          - command flag, adds different behavious
    */

    commandArguments = this.RemoveCommandKeyword(command);
    commandFlags = this.GetFlags(commandArguments);
    console.log(commandFlags);
    return commandFlags;
}

CommandParserModule.prototype.RemoveCommandKeyword = function(command) {
    var result = command.split(' ');
    result.shift();
    return result instanceof Array ? result.join(' ') : result;
}

CommandParserModule.prototype.GetFlags = function(commandArguments) {
    return commandArguments.match(/(\B--\S+\b)/ig);
}

CommandParserModule.prototype.RemoveFlags = function(arguments) {

}

module.exports = CommandParserModule;
