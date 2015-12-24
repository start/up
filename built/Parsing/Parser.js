var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.parse = function (text) {
        var documentNode = new DocumentNode_1.DocumentNode();
        this.currentNode = documentNode;
        this.workingText = '';
        this.parseInline(text);
        return documentNode;
    };
    Parser.prototype.parseInline = function (text) {
        var isNextCharEscaped = false;
        for (var _i = 0; _i < text.length; _i++) {
            var char = text[_i];
            if (isNextCharEscaped) {
                this.workingText += char;
                isNextCharEscaped = false;
                continue;
            }
            if (char === '\\') {
                isNextCharEscaped = true;
                continue;
            }
            if (this.currentNode instanceof InlineCodeNode_1.InlineCodeNode) {
                if (char === '`') {
                    this.flushAndExitCurrentNode();
                    continue;
                }
            }
            else if (this.currentNode instanceof EmphasisNode_1.EmphasisNode) {
                if (char === '*') {
                    this.flushAndExitCurrentNode();
                    continue;
                }
            }
            else {
                if (char === '`') {
                    this.flushAndEnterNewChildNode(new InlineCodeNode_1.InlineCodeNode());
                    continue;
                }
                if (char === '*') {
                    this.flushAndEnterNewChildNode(new EmphasisNode_1.EmphasisNode());
                    continue;
                }
            }
            this.workingText += char;
        }
        this.flushWorkingText();
    };
    Parser.prototype.flushWorkingText = function () {
        if (this.workingText) {
            this.currentNode.addChild(new PlainTextNode_1.PlainTextNode(this.workingText));
        }
        this.workingText = '';
    };
    Parser.prototype.flushAndEnterNewChildNode = function (child) {
        this.flushWorkingText();
        this.currentNode.addChild(child);
        this.currentNode = child;
    };
    Parser.prototype.flushAndExitCurrentNode = function () {
        this.flushWorkingText();
        this.currentNode = this.currentNode.parent;
    };
    return Parser;
})();
exports.Parser = Parser;
