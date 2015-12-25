var ParseResult_1 = require('./ParseResult');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
function parse(text) {
    var documentNode = new DocumentNode_1.DocumentNode();
    var parseResult = parseInline(documentNode, text);
    if (!parseResult.success) {
        throw "Unable to parse text";
    }
    documentNode.addChildren(parseResult.nodes);
    return documentNode;
}
exports.parse = parse;
function parseInline(parentNode, text, initialCharIndex, isNodeOpen) {
    if (initialCharIndex === void 0) { initialCharIndex = 0; }
    if (isNodeOpen === void 0) { isNodeOpen = false; }
    var done = false;
    var nodes = [];
    var workingText = '';
    var isNextCharEscaped = false;
    var charIndex = 0;
    for (charIndex = initialCharIndex; !done && charIndex < text.length; charIndex += 1) {
        var char = text[charIndex];
        if (isNextCharEscaped) {
            workingText += char;
            isNextCharEscaped = false;
            continue;
        }
        if (isCurrentText('\\')) {
            isNextCharEscaped = true;
            continue;
        }
        if (isParent(InlineCodeNode_1.InlineCodeNode)) {
            if (!closeIfCurrentTextIs('`')) {
                workingText += char;
            }
            continue;
        }
        if (parseIf('`', InlineCodeNode_1.InlineCodeNode)) {
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
    if (isNodeOpen) {
        return new FailedParseResult_1.FailedParseResult();
    }
    flush();
    return new ParseResult_1.ParseResult(nodes, charIndex - initialCharIndex);
    function isParent(SyntaxNodeType) {
        return parentNode instanceof SyntaxNodeType;
    }
    function isAnyAncestor(SyntaxNodeType) {
        return;
        isParent(SyntaxNodeType)
            || parentNode.parents().some(function (parent) { return parent instanceof SyntaxNodeType; });
    }
    function isCurrentText(needle) {
        return needle === text.substr(charIndex, needle.length);
    }
    function advanceExtraCountCharsConsumed(countCharsConsumed) {
        charIndex += countCharsConsumed - 1;
    }
    function flush() {
        if (workingText) {
            nodes.push(new PlainTextNode_1.PlainTextNode(workingText));
        }
        workingText = '';
    }
    function parse(SyntaxNodeType, countCharsToSkip) {
        var newNode = new SyntaxNodeType();
        newNode.parent = parentNode;
        var parseResult = parseInline(newNode, text, charIndex + countCharsToSkip);
        if (parseResult.success()) {
            flush();
            newNode.addChildren(parseResult.nodes);
            nodes.push(newNode);
            advanceExtraCountCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed);
            return true;
        }
        return false;
    }
    function close() {
        flush();
        isNodeOpen = false;
        done = true;
    }
    function parseIf(needle, SyntaxNodeType) {
        return isCurrentText(needle) && parse(SyntaxNodeType, needle.length);
    }
    function closeIfCurrentTextIs(needle) {
        if (isCurrentText(needle)) {
            close();
            advanceExtraCountCharsConsumed(needle.length);
            return true;
        }
        return false;
    }
    function parseSandwichIf(bun, SandwichNodeType) {
        if (!isCurrentText(bun)) {
            return false;
        }
        if (isParent(SandwichNodeType)) {
            close();
            return true;
        }
        if (isAnyAncestor(SandwichNodeType)) {
            return false;
        }
        if (parse(SandwichNodeType, bun.length)) {
            close();
            return true;
        }
        return false;
    }
}
