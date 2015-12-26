var ParentNodeClosureStatus_1 = require('./ParentNodeClosureStatus');
var InlineParser_1 = require('./InlineParser');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var Parser = (function () {
    function Parser(text) {
        this.text = text;
        this.documentNode = new DocumentNode_1.DocumentNode();
        var parseResult = new InlineParser_1.InlineParser(text, this.documentNode, ParentNodeClosureStatus_1.ParentNodeClosureStatus.Closed).result;
        if (!parseResult.success) {
            throw new Error("Unable to parse text");
        }
        this.documentNode.addChildren(parseResult.nodes);
    }
    return Parser;
})();
exports.Parser = Parser;
