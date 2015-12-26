var ParseResult_1 = require('./ParseResult');
var ParentNodeClosureStatus_1 = require('./ParentNodeClosureStatus');
var FailedParseResult_1 = require('./FailedParseResult');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var InlineParser = (function () {
    function InlineParser(text, parentNode, parentNodeClosureStatus) {
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
        for (this.charIndex = 0; this.charIndex < text.length; this.charIndex += 1) {
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
            this.addParsedNode(parseResult.parentNode, parseResult, countCharsThatOpenedNode);
            return true;
        }
        return false;
    };
    InlineParser.prototype.getInlineParseResult = function (ParentSyntaxNodeType, countCharsThatOpenedNode) {
        var newParentNode = new ParentSyntaxNodeType();
        newParentNode.parent = this.parentNode;
        var startIndex = this.charIndex + countCharsThatOpenedNode;
        return new InlineParser(this.text.slice(startIndex), newParentNode, ParentNodeClosureStatus_1.ParentNodeClosureStatus.MustBeClosed).result;
    };
    InlineParser.prototype.addParsedNode = function (node, parseResult, countCharsThatOpenedNode) {
        this.flushWorkingText();
        node.addChildren(parseResult.nodes);
        this.resultNodes.push(node);
        this.advanceCountExtraCharsConsumed(countCharsThatOpenedNode + parseResult.countCharsConsumed);
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
        if (this.areAnyDistantAncestors(SandwichNodeType)) {
            this.parentFailedToParse = true;
            return false;
        }
        if (this.tryParseInline(SandwichNodeType, bun.length)) {
            return true;
        }
        return false;
    };
    return InlineParser;
})();
exports.InlineParser = InlineParser;
