var ParseResult_1 = require('./ParseResult');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var ParentNodeClosureStatus;
(function (ParentNodeClosureStatus) {
    ParentNodeClosureStatus[ParentNodeClosureStatus["AutomaticallyClosesItself"] = 0] = "AutomaticallyClosesItself";
    ParentNodeClosureStatus[ParentNodeClosureStatus["NeedsToBeClosed"] = 1] = "NeedsToBeClosed";
})(ParentNodeClosureStatus || (ParentNodeClosureStatus = {}));
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.parse = function (text) {
        var documentNode = new DocumentNode_1.DocumentNode();
        var parseResult = this.parseInline(documentNode, text);
        if (!parseResult.success) {
            throw new Error("Unable to parse text");
        }
        documentNode.addChildren(parseResult.nodes);
        return documentNode;
    };
    Parser.prototype.parseInline = function (parentNode, text, initialCharIndex, parentNodeStatus) {
        if (initialCharIndex === void 0) { initialCharIndex = 0; }
        if (parentNodeStatus === void 0) { parentNodeStatus = ParentNodeClosureStatus.AutomaticallyClosesItself; }
        this.parentNode = parentNode;
        this.text = text;
        this.parentNodeStatus = parentNodeStatus;
        this.resultNodes = [];
        this.workingText = '';
        this.reachedEndOfParent = false;
        this.parentFailedToParse = false;
        this.charIndex = 0;
        var isNextCharEscaped = false;
        for (this.charIndex = initialCharIndex; this.charIndex < text.length; this.charIndex += 1) {
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
            if (this.isParent(InlineCodeNode_1.InlineCodeNode)) {
                if (!this.closeParentIfCurrentTextIs('`')) {
                    this.workingText += char;
                }
                continue;
            }
            if (this.parseIfCurrentTextIs('`', InlineCodeNode_1.InlineCodeNode)) {
                continue;
            }
            if (this.isCurrentText('***') && !this.areAnyDistantAncestorsEither([EmphasisNode_1.EmphasisNode, StressNode_1.StressNode])) {
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('**', StressNode_1.StressNode)) {
                continue;
            }
            if (this.openOrCloseSandwichIfCurrentTextIs('*', EmphasisNode_1.EmphasisNode)) {
                continue;
            }
            this.workingText += char;
        }
        if (this.parentFailedToParse || this.parentNodeStatus === ParentNodeClosureStatus.NeedsToBeClosed) {
            return new FailedParseResult_1.FailedParseResult();
        }
        this.flushWorkingText();
        return new ParseResult_1.ParseResult(this.resultNodes, this.charIndex - initialCharIndex);
    };
    Parser.prototype.isParent = function (SyntaxNodeType) {
        return this.parentNode instanceof SyntaxNodeType;
    };
    Parser.prototype.isParentEither = function (syntaxNodeTypes) {
        return this.isNodeEither(this.parentNode, syntaxNodeTypes);
    };
    Parser.prototype.isNodeEither = function (node, syntaxNodeTypes) {
        return syntaxNodeTypes.some(function (SyntaxNodeType) { return node instanceof SyntaxNodeType; });
    };
    Parser.prototype.areAnyDistantAncestors = function (SyntaxNodeType) {
        return this.parentNode.parents().some(function (ancestor) { return ancestor instanceof SyntaxNodeType; });
    };
    Parser.prototype.areAnyDistantAncestorsEither = function (syntaxNodeTypes) {
        var _this = this;
        return this.parentNode.parents()
            .some(function (ancestor) { return _this.isNodeEither(ancestor, syntaxNodeTypes); });
    };
    Parser.prototype.isCurrentText = function (needle) {
        return needle === this.text.substr(this.charIndex, needle.length);
    };
    Parser.prototype.advanceCountExtraCharsConsumed = function (countCharsConsumed) {
        this.charIndex += countCharsConsumed - 1;
    };
    Parser.prototype.flushWorkingText = function () {
        if (this.workingText) {
            this.resultNodes.push(new PlainTextNode_1.PlainTextNode(this.workingText));
        }
        this.workingText = '';
    };
    Parser.prototype.tryParseInline = function (ParentSyntaxNodeType, countCharsToSkip) {
        var potentialNode = new ParentSyntaxNodeType();
        potentialNode.parent = this.parentNode;
        var startIndex = this.charIndex + countCharsToSkip;
        var parseResult = new Parser().parseInline(potentialNode, this.text, startIndex, ParentNodeClosureStatus.NeedsToBeClosed);
        if (parseResult.success()) {
            this.flushWorkingText();
            potentialNode.addChildren(parseResult.nodes);
            this.resultNodes.push(potentialNode);
            this.advanceCountExtraCharsConsumed(countCharsToSkip + parseResult.countCharsConsumed);
            return true;
        }
        return false;
    };
    Parser.prototype.closeParent = function () {
        this.flushWorkingText();
        this.parentNodeStatus = ParentNodeClosureStatus.AutomaticallyClosesItself;
        this.reachedEndOfParent = true;
    };
    Parser.prototype.parseIfCurrentTextIs = function (needle, SyntaxNodeType) {
        return this.isCurrentText(needle) && this.tryParseInline(SyntaxNodeType, needle.length);
    };
    Parser.prototype.closeParentIfCurrentTextIs = function (needle) {
        if (this.isCurrentText(needle)) {
            this.closeParent();
            this.advanceCountExtraCharsConsumed(needle.length);
            return true;
        }
        return false;
    };
    Parser.prototype.openOrCloseSandwichIfCurrentTextIs = function (bun, SandwichNodeType) {
        if (!this.isCurrentText(bun)) {
            return false;
        }
        if (this.isParent(SandwichNodeType)) {
            this.closeParent();
            this.advanceCountExtraCharsConsumed(bun.length);
            return true;
        }
        if (this.areAnyDistantAncestors(SandwichNodeType)) {
            this.parentFailedToParse = true;
            return false;
        }
        if (this.tryParseInline(SandwichNodeType, bun.length)) {
            return true;
        }
        return false;
    };
    return Parser;
})();
exports.Parser = Parser;
