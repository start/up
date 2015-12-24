var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
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
        var index;
        function current(needle) {
            return needle === text.substr(index, needle.length);
        }
        for (index = 0; index < text.length; index++) {
            var char = text[index];
            if (isNextCharEscaped) {
                this.workingText += char;
                isNextCharEscaped = false;
                continue;
            }
            if (current('\\')) {
                isNextCharEscaped = true;
                continue;
            }
            if (this.isCurrentNode(InlineCodeNode_1.InlineCodeNode)) {
                if (current('`')) {
                    this.flushAndCloseCurrentNode();
                }
                else {
                    this.workingText += char;
                }
                continue;
            }
            if (current('`')) {
                this.flushAndEnterNewChildNode(new InlineCodeNode_1.InlineCodeNode());
                continue;
            }
            if (current('**')) {
                if (this.isCurrentNode(StressNode_1.StressNode)) {
                    this.flushAndCloseCurrentNode();
                }
                else {
                    this.flushAndEnterNewChildNode(new StressNode_1.StressNode());
                }
                index += 1;
                continue;
            }
            if (current('*')) {
                if (this.isCurrentNode(EmphasisNode_1.EmphasisNode)) {
                    this.flushAndCloseCurrentNode();
                }
                else {
                    this.flushAndEnterNewChildNode(new EmphasisNode_1.EmphasisNode());
                }
                continue;
            }
            this.workingText += char;
        }
        this.flushWorkingText();
    };
    Parser.prototype.isCurrentNode = function (SyntaxNodeType) {
        return this.currentNode instanceof SyntaxNodeType;
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
    Parser.prototype.flushAndCloseCurrentNode = function () {
        this.flushWorkingText();
        this.currentNode = this.currentNode.parent;
    };
    return Parser;
})();
exports.Parser = Parser;
