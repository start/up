var Parser_1 = require('./Parsing/Parser');
function ast(text) {
    return Parser_1.parse(text);
}
exports.ast = ast;
