var ParseResult_1 = require('./ParseResult');
var ParentNodeClosureStatus_1 = require('./ParentNodeClosureStatus');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var RevisionInsertionNode_1 = require('../SyntaxNodes/RevisionInsertionNode');
var RevisionDeletionNode_1 = require('../SyntaxNodes/RevisionDeletionNode');
var InlineParser = (function () {
    function InlineParser(text, parentNode, parentNodeClosureStatus, countCharsConsumedOpeningParentNode) {
        if (countCharsConsumedOpeningParentNode === void 0) { countCharsConsumedOpeningParentNode = 0; }
        this.text = text;
        this.parentNode = parentNode;
        this.parentNodeClosureStatus = parentNodeClosureStatus;
        this.parentNode = parentNode;
        this.parentNodeClosureStatus = parentNodeClosureStatus;
        this.resultNodes = [];
        this.workingText = '';
        this.reachedEndOfParent = false;
        this.parentFailedToParse = false;
        this.charIndex = 0;
        var isNextCharEscaped = false;
        for (this.charIndex = countCharsConsumedOpeningParentNode; this.charIndex < text.length; this.charIndex += 1) {
            if (this.reachedEndOfParent || this.parentFailedToParse) {
                break;
            }
            var char = text[this.charIndex];
            if (isNextCharEscaped) {
                this.workingText += char;
                isNextCharEscaped = false;
                continue;
            }
            if (this.isCurrentText('\\')) {
                isNextCharEscaped = true;
                continue;
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('`', InlineCodeNode_1.InlineCodeNode)) {
                continue;
            }
            if (this.isParent(InlineCodeNode_1.InlineCodeNode)) {
                this.workingText += char;
                continue;
            }
            if (this.isCurrentText('***') && !this.areAnyDistantAncestorsEither([EmphasisNode_1.EmphasisNode, StressNode_1.StressNode])) {
                var startWithEmphasis = this.getInlineParseResult(EmphasisNode_1.EmphasisNode, '*'.length);
                var startWithStress = this.getInlineParseResult(StressNode_1.StressNode, '**'.length);
                if (this.tryAcceptBestTripleAsteriskParseResult([startWithEmphasis, startWithStress])) {
                    continue;
                }
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('**', StressNode_1.StressNode)) {
                continue;
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('*', EmphasisNode_1.EmphasisNode)) {
                continue;
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('++', RevisionInsertionNode_1.RevisionInsertionNode)) {
                continue;
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('~~', RevisionDeletionNode_1.RevisionDeletionNode)) {
                continue;
            }
            this.workingText += char;
        }
        if (this.parentFailedToParse || this.parentNodeClosureStatus === ParentNodeClosureStatus_1.ParentNodeClosureStatus.MustBeClosed) {
            this.result = new FailedParseResult_1.FailedParseResult();
        }
        else {
            this.flushWorkingText();
            this.result = new ParseResult_1.ParseResult(this.resultNodes, this.charIndex, parentNode);
        }
    }
    InlineParser.prototype.isParent = function (SyntaxNodeType) {
        return this.parentNode instanceof SyntaxNodeType;
    };
    InlineParser.prototype.isParentEither = function (syntaxNodeTypes) {
        return this.isNodeEither(this.parentNode, syntaxNodeTypes);
    };
    InlineParser.prototype.isNodeEither = function (node, syntaxNodeTypes) {
        return syntaxNodeTypes.some(function (SyntaxNodeType) { return node instanceof SyntaxNodeType; });
    };
    InlineParser.prototype.areAnyDistantAncestors = function (SyntaxNodeType) {
        return this.parentNode.parents().some(function (ancestor) { return ancestor instanceof SyntaxNodeType; });
    };
    InlineParser.prototype.areAnyDistantAncestorsEither = function (syntaxNodeTypes) {
        var _this = this;
        return this.parentNode.parents()
            .some(function (ancestor) { return _this.isNodeEither(ancestor, syntaxNodeTypes); });
    };
    InlineParser.prototype.isCurrentText = function (needle) {
        return needle === this.text.substr(this.charIndex, needle.length);
    };
    InlineParser.prototype.advanceCountExtraCharsConsumed = function (countCharsConsumed) {
        this.charIndex += countCharsConsumed - 1;
    };
    InlineParser.prototype.flushWorkingText = function () {
        if (this.workingText) {
            this.resultNodes.push(new PlainTextNode_1.PlainTextNode(this.workingText));
        }
        this.workingText = '';
    };
    InlineParser.prototype.tryParseInline = function (ParentSyntaxNodeType, countCharsThatOpenedNode) {
        var parseResult = this.getInlineParseResult(ParentSyntaxNodeType, countCharsThatOpenedNode);
        if (parseResult.success()) {
            this.addParsedNode(parseResult);
            return true;
        }
        return false;
    };
    InlineParser.prototype.getInlineParseResult = function (ParentSyntaxNodeType, countCharsThatOpenedNode) {
        var newParentNode = new ParentSyntaxNodeType();
        newParentNode.parent = this.parentNode;
        return new InlineParser(this.text.slice(this.charIndex), newParentNode, ParentNodeClosureStatus_1.ParentNodeClosureStatus.MustBeClosed, countCharsThatOpenedNode).result;
    };
    InlineParser.prototype.addParsedNode = function (parseResult) {
        this.flushWorkingText();
        parseResult.parentNode.addChildren(parseResult.nodes);
        this.resultNodes.push(parseResult.parentNode);
        this.advanceCountExtraCharsConsumed(parseResult.countCharsConsumed);
    };
    InlineParser.prototype.closeParent = function () {
        this.flushWorkingText();
        this.parentNodeClosureStatus = ParentNodeClosureStatus_1.ParentNodeClosureStatus.Closed;
        this.reachedEndOfParent = true;
    };
    InlineParser.prototype.parseIfCurrentTextIs = function (needle, SyntaxNodeType) {
        return this.isCurrentText(needle) && this.tryParseInline(SyntaxNodeType, needle.length);
    };
    InlineParser.prototype.closeParentIfCurrentTextIs = function (needle) {
        if (this.isCurrentText(needle)) {
            this.closeParent();
            this.advanceCountExtraCharsConsumed(needle.length);
            return true;
        }
        return false;
    };
    InlineParser.prototype.openOrCloseSandwichIfCurrentTextIs = function (bun, SandwichNodeType) {
        if (!this.isCurrentText(bun)) {
            return false;
        }
        if (this.isParent(SandwichNodeType)) {
            this.closeParent();
            this.advanceCountExtraCharsConsumed(bun.length);
            return true;
        }
        if (this.tryParseInline(SandwichNodeType, bun.length)) {
            return true;
        }
        return false;
    };
    InlineParser.prototype.tryAcceptBestTripleAsteriskParseResult = function (parseResults) {
        var sortedResults = parseResults.slice()
            .filter(function (result) { return result.success(); })
            .sort(function (result1, result2) { return result2.countCharsConsumed - result1.countCharsConsumed; });
        if (!sortedResults.length) {
            return false;
        }
        this.addParsedNode(sortedResults[0]);
        return true;
    };
    return InlineParser;
})();
exports.InlineParser = InlineParser;
