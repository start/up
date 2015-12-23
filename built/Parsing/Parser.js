var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var ParseMode;
(function (ParseMode) {
    ParseMode[ParseMode["Literal"] = 0] = "Literal";
    ParseMode[ParseMode["Normal"] = 1] = "Normal";
})(ParseMode || (ParseMode = {}));
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.parse = function (text) {
        var documentNode = new DocumentNode_1.DocumentNode();
        this.currentNode = documentNode;
        this.mode = ParseMode.Normal;
        this.workingText = '';
        for (var _i = 0; _i < text.length; _i++) {
            var currentChar = text[_i];
            if (this.mode == ParseMode.Literal) {
                this.workingText += currentChar;
                this.mode = ParseMode.Normal;
            }
            else if (this.mode == ParseMode.Normal) {
                if (currentChar === '\\') {
                    this.mode = ParseMode.Literal;
                }
                else {
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
            }
            else {
                throw 'Unrecognized parse mode';
            }
        }
        this.flushWorkingText();
        return documentNode;
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
