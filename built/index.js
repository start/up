var Parser_1 = require('./Parsing/Parser');
var parser = new Parser_1.Parser();
function ast(text) {
    return parser.parse(text);
}
exports.ast = ast;
