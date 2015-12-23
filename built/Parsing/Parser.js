var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode;
    var i = 0;
    var workingText = '';
    while (i < text.length) {
        var currentChar = text[i];
        switch (currentChar) {
            case '\\':
                i += 1;
                workingText += text[1 + i];
                break;
            default:
                workingText += currentChar;
        }
        i += 1;
    }
    if (workingText) {
        documentNode.children.push(new PlainTextNode_1.PlainTextNode(workingText));
    }
    return documentNode;
}
exports.parse = parse;
