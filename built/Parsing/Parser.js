var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
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
            var currentChar = text[_i];
            if (isNextCharEscaped) {
                this.workingText += currentChar;
                isNextCharEscaped = false;
                continue;
            }
            if (currentChar === '\\') {
                isNextCharEscaped = true;
                continue;
            }
            if (this.currentNode instanceof EmphasisNode_1.EmphasisNode) {
                if (currentChar === '*') {
                    this.flushWorkingText();
                    this.exitCurrentNode();
                    continue;
                }
            }
            else {
                if (currentChar === '*') {
                    this.flushWorkingText();
                    this.enterNewChildNode(new EmphasisNode_1.EmphasisNode());
                    continue;
                }
            }
            this.workingText += currentChar;
        }
        this.flushWorkingText();
    };
    Parser.prototype.flushWorkingText = function () {
        if (this.workingText) {
            this.currentNode.addChild(new PlainTextNode_1.PlainTextNode(this.workingText));
        }
        this.workingText = '';
    };
    Parser.prototype.enterNewChildNode = function (child) {
        this.currentNode.addChild(child);
        this.currentNode = child;
    };
    Parser.prototype.exitCurrentNode = function () {
        this.currentNode = this.currentNode.parent;
    };
    return Parser;
})();
exports.Parser = Parser;
