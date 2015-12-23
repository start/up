var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var ParseMode;
(function (ParseMode) {
    ParseMode[ParseMode["Literal"] = 0] = "Literal";
    ParseMode[ParseMode["Normal"] = 1] = "Normal";
})(ParseMode || (ParseMode = {}));
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode;
    var currentNode = documentNode;
    var workingText = '';
    function addPlainTextNodeForWorkingText() {
        if (workingText) {
            currentNode.addChild(new PlainTextNode_1.PlainTextNode(workingText));
        }
        workingText = '';
    }
    function addChildAndMakeChildCurrentNode(child) {
        currentNode.addChild(child);
        currentNode = child;
    }
    var mode = ParseMode.Normal;
    var i = -1;
    while (true) {
        i += 1;
        if (i === text.length) {
            break;
        }
        var currentChar = text[i];
        if (mode == ParseMode.Literal) {
            workingText += currentChar;
            mode = ParseMode.Normal;
        }
        else if (mode == ParseMode.Normal) {
            if (currentChar === '\\') {
                mode = ParseMode.Literal;
            }
            else {
                if (currentNode instanceof EmphasisNode_1.EmphasisNode) {
                    if (currentChar === '*') {
                        addPlainTextNodeForWorkingText();
                        currentNode = currentNode.parent;
                        continue;
                    }
                }
                else {
                    if (currentChar === '*') {
                        addPlainTextNodeForWorkingText();
                        addChildAndMakeChildCurrentNode(new EmphasisNode_1.EmphasisNode());
                        continue;
                    }
                }
                workingText += currentChar;
            }
        }
        else {
            throw 'Unrecognized parse mode';
        }
    }
    addPlainTextNodeForWorkingText();
    return documentNode;
}
exports.parse = parse;
