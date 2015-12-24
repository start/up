var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode();
    parseInlineInto(documentNode, text);
    return documentNode;
}
exports.parse = parse;
function parseInlineInto(node, text) {
    function isCurrentNode(SyntaxNodeType) {
        return currentNode instanceof SyntaxNodeType;
    }
    var workingText = '';
    var currentNode = node;
    var index;
    function currentText(needle) {
        return needle === text.substr(index, needle.length);
    }
    function flushWorkingText() {
        if (workingText) {
            currentNode.addChild(new PlainTextNode_1.PlainTextNode(workingText));
        }
        workingText = '';
    }
    function flushAndEnterNewChildNode(child) {
        flushWorkingText();
        currentNode.addChild(child);
        currentNode = child;
    }
    function flushAndCloseCurrentNode() {
        flushWorkingText();
        currentNode = currentNode.parent;
    }
    function parseSandwich(bun, SandwichNode) {
        if (currentText(bun)) {
            if (isCurrentNode(SandwichNode)) {
                flushAndCloseCurrentNode();
            }
            else {
                flushAndEnterNewChildNode(new SandwichNode());
            }
            var extraCharsToSkip = bun.length - 1;
            index += extraCharsToSkip;
            return true;
        }
        return false;
    }
    var isNextCharEscaped = false;
    for (index = 0; index < text.length; index++) {
        var char = text[index];
        if (isNextCharEscaped) {
            workingText += char;
            isNextCharEscaped = false;
            continue;
        }
        if (currentText('\\')) {
            isNextCharEscaped = true;
            continue;
        }
        if (isCurrentNode(InlineCodeNode_1.InlineCodeNode)) {
            if (currentText('`')) {
                flushAndCloseCurrentNode();
            }
            else {
                workingText += char;
            }
            continue;
        }
        if (currentText('`')) {
            flushAndEnterNewChildNode(new InlineCodeNode_1.InlineCodeNode());
            continue;
        }
        if (parseSandwich('**', StressNode_1.StressNode)) {
            continue;
        }
        if (parseSandwich('*', EmphasisNode_1.EmphasisNode)) {
            continue;
        }
        workingText += char;
    }
    flushWorkingText();
}
