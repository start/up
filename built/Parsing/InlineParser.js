var ParseResult_1 = require('./ParseResult');
var ParentNodeClosureStatus_1 = require('./ParentNodeClosureStatus');
var InlineSandwich_1 = require('./InlineSandwich');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var RevisionInsertionNode_1 = require('../SyntaxNodes/RevisionInsertionNode');
var RevisionDeletionNode_1 = require('../SyntaxNodes/RevisionDeletionNode');
var SpoilerNode_1 = require('../SyntaxNodes/SpoilerNode');
var INLINE_CODE = new InlineSandwich_1.InlineSandwich(InlineCodeNode_1.InlineCodeNode, '`');
var STRESS = new InlineSandwich_1.InlineSandwich(StressNode_1.StressNode, "**");
var EMPHASIS = new InlineSandwich_1.InlineSandwich(EmphasisNode_1.EmphasisNode, "*");
var REVISION_INSERTION = new InlineSandwich_1.InlineSandwich(RevisionInsertionNode_1.RevisionInsertionNode, "++");
var REVISION_DELETION = new InlineSandwich_1.InlineSandwich(RevisionDeletionNode_1.RevisionDeletionNode, "~~");
var SPOILER = new InlineSandwich_1.InlineSandwich(SpoilerNode_1.SpoilerNode, "[<_<]", "[>_>]");
var InlineParser = (function () {
    function InlineParser(text, parentNode, parentNodeClosureStatus, countCharsConsumedOpeningParentNode) {
        if (countCharsConsumedOpeningParentNode === void 0) { countCharsConsumedOpeningParentNode = 0; }
        this.text = text;
        this.parentNode = parentNode;
        this.parentNodeClosureStatus = parentNodeClosureStatus;
        this.reachedEndOfParent = false;
        this.parentFailedToParse = false;
        this.resultNodes = [];
        this.workingText = '';
        this.charIndex = 0;
        var isNextCharEscaped = false;
        main_parser_loop: for (this.charIndex = countCharsConsumedOpeningParentNode; this.charIndex < text.length; this.charIndex += 1) {
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
            if (this.tryOpenOrCloseSandwich(INLINE_CODE)) {
                continue;
            }
            if (this.isParent(InlineCodeNode_1.InlineCodeNode)) {
                this.workingText += char;
                continue;
            }
            var shouldProbablyOpenEmphasisAndStress = this.isCurrentText('***') && !this.areAnyAncestorsEither([EmphasisNode_1.EmphasisNode, StressNode_1.StressNode]);
            if (shouldProbablyOpenEmphasisAndStress && this.tryOpenBothEmphasisAndStress()) {
                continue;
            }
            for (var _i = 0, _a = [
                STRESS,
                EMPHASIS,
                REVISION_INSERTION,
                REVISION_DELETION,
                SPOILER,
            ]; _i < _a.length; _i++) {
                var sandwich = _a[_i];
                if (this.tryOpenOrCloseSandwich(sandwich)) {
                    continue main_parser_loop;
                }
            }
            this.workingText += char;
        }
        this.finish();
    }
    InlineParser.prototype.finish = function () {
        if (this.parentFailedToParse || this.parentNodeClosureStatus === ParentNodeClosureStatus_1.ParentNodeClosureStatus.OpenAndMustBeClosed) {
            this.result = new FailedParseResult_1.FailedParseResult();
        }
        else {
            this.flushWorkingText();
            this.result = new ParseResult_1.ParseResult(this.resultNodes, this.charIndex, this.parentNode);
        }
    };
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
    InlineParser.prototype.areAnyAncestorsEither = function (syntaxNodeTypes) {
        var _this = this;
        return;
        this.isParentEither(syntaxNodeTypes)
            || this.parentNode.parents().some(function (ancestor) { return _this.isNodeEither(ancestor, syntaxNodeTypes); });
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
        return new InlineParser(this.text.slice(this.charIndex), newParentNode, ParentNodeClosureStatus_1.ParentNodeClosureStatus.OpenAndMustBeClosed, countCharsThatOpenedNode).result;
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
    InlineParser.prototype.tryOpenOrCloseSandwich = function (sandwich) {
        if (this.isParent(sandwich.SyntaxNodeType)) {
            return this.closeParentIfCurrentTextIs(sandwich.closingBun);
        }
        return this.isCurrentText(sandwich.bun) && this.tryParseInline(sandwich.SyntaxNodeType, sandwich.bun.length);
    };
    InlineParser.prototype.tryOpenBothEmphasisAndStress = function () {
        if (!this.isCurrentText('***') || this.areAnyAncestorsEither([EmphasisNode_1.EmphasisNode, StressNode_1.StressNode])) {
            return false;
        }
        var startWithEmphasis = this.getInlineParseResult(EmphasisNode_1.EmphasisNode, '*'.length);
        var startWithStress = this.getInlineParseResult(StressNode_1.StressNode, '**'.length);
        return this.tryAcceptBestTripleAsteriskParseResult([startWithEmphasis, startWithStress]);
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
