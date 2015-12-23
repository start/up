var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode;
    if (text) {
        documentNode.children.push(new PlainTextNode_1.PlainTextNode(text));
    }
    return documentNode;
}
exports.parse = parse;
