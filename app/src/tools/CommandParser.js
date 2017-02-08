var CommandParserModule = function () {};

CommandParserModule.prototype.Parse = function(command) {
    /* 
        Command composition:
        
        !command        - command keyword
        some arguments  - command arguments, passed separated by spaces
        --flag          - command flag, adds different behavious
    */

    var commandContent = this.RemoveCommandKeyword(command);
    var commandFlags = this.GetFlags(commandContent);
    var commandArguments = this.GetArguments(this.RemoveFlags(commandContent, commandFlags));

    var parsedCommand = {
        'Flags' : commandFlags,
        'Arguments' : commandArguments
    }
    
    console.log(parsedCommand);
    return parsedCommand;
}

CommandParserModule.prototype.RemoveCommandKeyword = function(command) {
    var result = command.split(' ');
    result.shift();
    return result instanceof Array ? result.join(' ') : result;
}

CommandParserModule.prototype.GetFlags = function(commandContent) {
    return commandContent.match(/(\B--\S+\b)/ig);
}

CommandParserModule.prototype.RemoveFlags = function(commandContent, commandFlags) {
    var result = commandContent;
    commandFlags.forEach(function(flag) {
        result = result.replace(flag, '');
    });

    return result;
}

CommandParserModule.prototype.GetArguments = function(unflaggedArguments) {
    return unflaggedArguments.trim().split(' ').filter(f => f != '');
}

module.exports = CommandParserModule;