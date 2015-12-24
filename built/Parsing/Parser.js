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
    var currentNode = node;
    var index;
    function currentText(needle) {
        return needle === text.substr(index, needle.length);
    }
    var workingText = '';
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
    function tryFlushAndEnterNewChildNode(needle, SyntaxNodeType) {
        if (currentText(needle)) {
            flushAndEnterNewChildNode(new SyntaxNodeType());
            return true;
        }
        return false;
    }
    function tryFlushAndCloseCurrentNode(needle) {
        if (currentText(needle)) {
            flushAndCloseCurrentNode();
            return true;
        }
        return false;
    }
    function tryParseSandwich(bun, SandwichNodeType) {
        if (currentText(bun)) {
            if (isCurrentNode(SandwichNodeType)) {
                flushAndCloseCurrentNode();
            }
            else {
                flushAndEnterNewChildNode(new SandwichNodeType());
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
            if (!tryFlushAndCloseCurrentNode('`')) {
                workingText += char;
            }
            continue;
        }
        if (tryFlushAndEnterNewChildNode('`', InlineCodeNode_1.InlineCodeNode)) {
            continue;
        }
        if (tryParseSandwich('**', StressNode_1.StressNode)) {
            continue;
        }
        if (tryParseSandwich('*', EmphasisNode_1.EmphasisNode)) {
            continue;
        }
        workingText += char;
    }
    flushWorkingText();
}
