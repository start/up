var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyntaxNode_1 = require('./SyntaxNode');
var PlainTextNode = (function (_super) {
    __extends(PlainTextNode, _super);
    function PlainTextNode(plainText) {
        _super.call(this, null);
        this.plainText = plainText;
        this.PLAIN_TEXT_NODE = 'plain text node';
    }
    PlainTextNode.prototype.text = function () {
        return this.plainText;
    };
    return PlainTextNode;
})(SyntaxNode_1.SyntaxNode);
exports.PlainTextNode = PlainTextNode;
