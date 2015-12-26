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
    var parentFailedToParse = false;
    var resultNodes = [];
    var workingText = '';
    var isNextCharEscaped = false;
    var charIndex = 0;
    for (charIndex = initialCharIndex; charIndex < text.length; charIndex += 1) {
        if (isParentClosed || parentFailedToParse) {
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
        if (isCurrentText('***') && !areAnyDistantAncestorsEither([EmphasisNode_1.EmphasisNode, StressNode_1.StressNode])) {
        }
        if (handleSandwichIfCurrentTextIs('**', StressNode_1.StressNode)) {
            continue;
        }
        if (handleSandwichIfCurrentTextIs('*', EmphasisNode_1.EmphasisNode)) {
            continue;
        }
        workingText += char;
    }
    if (parentFailedToParse || parentNodeStatus === NodeStatus.NeedsToBeClosed) {
        return new FailedParseResult_1.FailedParseResult();
    }
    flushWorkingText();
    return new ParseResult_1.ParseResult(resultNodes, charIndex - initialCharIndex);
    function isParent(SyntaxNodeType) {
        return parentNode instanceof SyntaxNodeType;
    }
    function isParentEither(syntaxNodeTypes) {
        return isNodeEither(parentNode, syntaxNodeTypes);
    }
    function isNodeEither(node, syntaxNodeTypes) {
        return syntaxNodeTypes.some(function (SyntaxNodeType) { return node instanceof SyntaxNodeType; });
    }
    function areAnyDistantAncestors(SyntaxNodeType) {
        return parentNode.parents().some(function (ancestor) { return ancestor instanceof SyntaxNodeType; });
    }
    function areAnyDistantAncestorsEither(syntaxNodeTypes) {
        return parentNode.parents().some(function (ancestor) { return isNodeEither(ancestor, syntaxNodeTypes); });
    }
    function isCurrentText(needle) {
        return needle === text.substr(charIndex, needle.length);
    }
    function advanceCountExtraCharsConsumed(countCharsConsumed) {
        charIndex += countCharsConsumed - 1;
    }
    function flushWorkingText() {
        if (workingText) {
            resultNodes.push(new PlainTextNode_1.PlainTextNode(workingText));
        }
        workingText = '';
    }
    function tryParse(ParentSyntaxNodeType, countCharsToSkip) {
        var potentialNode = new ParentSyntaxNodeType();
        potentialNode.parent = parentNode;
        var startIndex = charIndex + countCharsToSkip;
        var parseResult = parseInline(potentialNode, text, startIndex, NodeStatus.NeedsToBeClosed);
        if (parseResult.success()) {
            flushWorkingText();
            potentialNode.addChildren(parseResult.nodes);
            resultNodes.push(potentialNode);
            advanceCountExtraCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed);
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
        return isCurrentText(needle) && tryParse(SyntaxNodeType, needle.length);
    }
    function closeParentIfCurrentTextIs(needle) {
        if (isCurrentText(needle)) {
            closeParent();
            advanceCountExtraCharsConsumed(needle.length);
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
            advanceCountExtraCharsConsumed(bun.length);
            return true;
        }
        if (areAnyDistantAncestors(SandwichNodeType)) {
            parentFailedToParse = true;
            return false;
        }
        if (tryParse(SandwichNodeType, bun.length)) {
            return true;
        }
        return false;
    }
}
