var Parser_1 = require('./Parsing/Parser');
function ast(text) {
    return new Parser_1.Parser(text).documentNode;
}
exports.ast = ast;
