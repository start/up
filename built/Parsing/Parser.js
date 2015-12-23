var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var ParseMode;
(function (ParseMode) {
    ParseMode[ParseMode["Literal"] = 0] = "Literal";
    ParseMode[ParseMode["Normal"] = 1] = "Normal";
})(ParseMode || (ParseMode = {}));
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode;
    var mode = ParseMode.Normal;
    var i = 0;
    var workingText = '';
    while (i < text.length) {
        var currentChar = text[i];
        if (mode == ParseMode.Literal) {
            workingText += currentChar;
            mode = ParseMode.Normal;
        }
        else if (mode == ParseMode.Normal) {
            if (currentChar == '\\') {
                mode = ParseMode.Literal;
            }
            else {
                workingText += currentChar;
            }
        }
        else {
            throw 'Unrecognized parse mode';
        }
        i += 1;
    }
    if (workingText) {
        documentNode.children.push(new PlainTextNode_1.PlainTextNode(workingText));
    }
    return documentNode;
}
exports.parse = parse;
