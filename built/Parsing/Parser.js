var ParentNodeClosureStatus_1 = require('./ParentNodeClosureStatus');
var InlineParser_1 = require('./InlineParser');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var ParagraphNode_1 = require('../SyntaxNodes/ParagraphNode');
var Parser = (function () {
    function Parser(text) {
        this.text = text;
        this.documentNode = new DocumentNode_1.DocumentNode();
        var paragraphNode = new ParagraphNode_1.ParagraphNode();
        var parseResult = new InlineParser_1.InlineParser(text, paragraphNode, ParentNodeClosureStatus_1.ParentNodeClosureStatus.Closed).result;
        if (!parseResult.success) {
            throw new Error("Unable to parse text");
        }
        if (parseResult.nodes.length) {
            paragraphNode.addChildren(parseResult.nodes);
            this.documentNode.addChild(paragraphNode);
        }
    }
    return Parser;
})();
exports.Parser = Parser;
