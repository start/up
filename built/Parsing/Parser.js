var ParseResult_1 = require('./ParseResult');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var NodeState;
(function (NodeState) {
    NodeState[NodeState["Okay"] = 0] = "Okay";
    NodeState[NodeState["Dangling"] = 1] = "Dangling";
})(NodeState || (NodeState = {}));
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
function parseInline(parentNode, text, initialCharIndex, parentNodeState) {
    if (initialCharIndex === void 0) { initialCharIndex = 0; }
    if (parentNodeState === void 0) { parentNodeState = NodeState.Okay; }
    var done = false;
    var resultNodes = [];
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
    if (parentNodeState) {
        return new FailedParseResult_1.FailedParseResult();
    }
    flushWorkingText();
    return new ParseResult_1.ParseResult(resultNodes, charIndex - initialCharIndex);
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
    function flushWorkingText() {
        if (workingText) {
            resultNodes.push(new PlainTextNode_1.PlainTextNode(workingText));
        }
        workingText = '';
    }
    function parse(SyntaxNodeType, countCharsToSkip) {
        var potentialNode = new SyntaxNodeType();
        potentialNode.parent = parentNode;
        var parseResult = parseInline(potentialNode, text, charIndex + countCharsToSkip, NodeState.Dangling);
        if (parseResult.success()) {
            flushWorkingText();
            potentialNode.addChildren(parseResult.nodes);
            resultNodes.push(potentialNode);
            advanceExtraCountCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed);
            return true;
        }
        return false;
    }
    function close() {
        flushWorkingText();
        parentNodeState = NodeState.Okay;
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
