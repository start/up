var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode();
    if (!tryParseInline(documentNode, text)) {
        throw "Unable to parse text";
    }
    return documentNode;
}
exports.parse = parse;
function tryParseInline(intoNode, text, charIndex, countCharsConsumed) {
    if (charIndex === void 0) { charIndex = 0; }
    if (countCharsConsumed === void 0) { countCharsConsumed = 0; }
    var currentNode = intoNode;
    var workingText = '';
    var isNextCharEscaped = false;
    for (; charIndex < text.length; charIndex += countCharsConsumed) {
        if (currentNode === intoNode.parent) {
            return true;
        }
        var char = text[charIndex];
        countCharsConsumed = 1;
        if (isNextCharEscaped) {
            workingText += char;
            isNextCharEscaped = false;
            continue;
        }
        if (currentTextIs('\\')) {
            isNextCharEscaped = true;
            continue;
        }
        if (parentIs(InlineCodeNode_1.InlineCodeNode)) {
            if (!flushAndExitCurrentNodeIf('`')) {
                workingText += char;
            }
            continue;
        }
        if (flushAndEnterNewChildNodeIf('`', InlineCodeNode_1.InlineCodeNode)) {
            continue;
        }
        if (parseSandwichIf('**', StressNode_1.StressNode)) {
            continue;
        }
        if (parseSandwichIf('*', EmphasisNode_1.EmphasisNode)) {
            continue;
        }
        workingText += char;
    }
    flushWorkingText();
    return (currentNode === intoNode) && currentNode.valid();
    function parentIs(SyntaxNodeType) {
        return currentNode instanceof SyntaxNodeType;
    }
    function anyParentIs(SyntaxNodeType) {
        return currentNode.parents().some(function (parent) { return parent instanceof SyntaxNodeType; });
    }
    function currentTextIs(needle) {
        return needle === text.substr(charIndex, needle.length);
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
    function flushAndEnterNewChildNodeIf(needle, SyntaxNodeType) {
        if (currentTextIs(needle)) {
            flushAndEnterNewChildNode(new SyntaxNodeType());
            countCharsConsumed = needle.length;
            return true;
        }
        return false;
    }
    function flushAndExitCurrentNodeIf(needle) {
        if (currentTextIs(needle)) {
            flushAndCloseCurrentNode();
            countCharsConsumed = needle.length;
            return true;
        }
        return false;
    }
    function parseSandwichIf(bun, SandwichNodeType) {
        if (!currentTextIs(bun)) {
            return false;
        }
        countCharsConsumed = bun.length;
        if (parentIs(SandwichNodeType)) {
            flushAndCloseCurrentNode();
            return true;
        }
        if (anyParentIs(SandwichNodeType)) {
            return false;
        }
        flushAndEnterNewChildNode(new SandwichNodeType());
        return true;
    }
}
