var ParseResult_1 = require('./ParseResult');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var NodeStatus;
(function (NodeStatus) {
    NodeStatus[NodeStatus["Okay"] = 0] = "Okay";
    NodeStatus[NodeStatus["NeedsToBeClosed"] = 1] = "NeedsToBeClosed";
})(NodeStatus || (NodeStatus = {}));
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
function parseInline(parentNode, text, initialCharIndex, parentNodeStatus) {
    if (initialCharIndex === void 0) { initialCharIndex = 0; }
    if (parentNodeStatus === void 0) { parentNodeStatus = NodeStatus.Okay; }
    var isParentClosed = false;
    var failed = false;
    var resultNodes = [];
    var workingText = '';
    var isNextCharEscaped = false;
    var charIndex = 0;
    for (charIndex = initialCharIndex; charIndex < text.length; charIndex += 1) {
        if (isParentClosed || failed) {
            break;
        }
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
            if (!closeParentIfCurrentTextIs('`')) {
                workingText += char;
            }
            continue;
        }
        if (parseIfCurrentTextIs('`', InlineCodeNode_1.InlineCodeNode)) {
            continue;
        }
        if (handleSandwichIfCurrentTextIs('**', StressNode_1.StressNode)) {
            continue;
        }
        if (handleSandwichIfCurrentTextIs('*', EmphasisNode_1.EmphasisNode)) {
            continue;
        }
        workingText += char;
    }
    if (failed || parentNodeStatus === NodeStatus.NeedsToBeClosed) {
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
        var startIndex = charIndex + countCharsToSkip;
        var parseResult = parseInline(potentialNode, text, startIndex, NodeStatus.NeedsToBeClosed);
        if (parseResult.success()) {
            flushWorkingText();
            potentialNode.addChildren(parseResult.nodes);
            resultNodes.push(potentialNode);
            advanceExtraCountCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed);
            return true;
        }
        return false;
    }
    function closeParent() {
        flushWorkingText();
        parentNodeStatus = NodeStatus.Okay;
        isParentClosed = true;
    }
    function parseIfCurrentTextIs(needle, SyntaxNodeType) {
        return isCurrentText(needle) && parse(SyntaxNodeType, needle.length);
    }
    function closeParentIfCurrentTextIs(needle) {
        if (isCurrentText(needle)) {
            closeParent();
            advanceExtraCountCharsConsumed(needle.length);
            return true;
        }
        return false;
    }
    function handleSandwichIfCurrentTextIs(bun, SandwichNodeType) {
        if (!isCurrentText(bun)) {
            return false;
        }
        if (isParent(SandwichNodeType)) {
            closeParent();
            advanceExtraCountCharsConsumed(bun.length);
            return true;
        }
        if (isAnyAncestor(SandwichNodeType)) {
            return false;
        }
        if (parse(SandwichNodeType, bun.length)) {
            return true;
        }
        return false;
    }
}
