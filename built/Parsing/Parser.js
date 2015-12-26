var ParentNodeClosureType_1 = require('./ParentNodeClosureType');
var InlineParser_1 = require('./InlineParser');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var Parser = (function () {
    function Parser(text) {
        this.text = text;
        this.documentNode = new DocumentNode_1.DocumentNode();
        var parseResult = new InlineParser_1.InlineParser(text, this.documentNode, ParentNodeClosureType_1.ParentNodeClosureType.ClosesItself).result;
        if (!parseResult.success) {
            throw new Error("Unable to parse text");
        }
        this.documentNode.addChildren(parseResult.nodes);
    }
    return Parser;
})();
exports.Parser = Parser;
