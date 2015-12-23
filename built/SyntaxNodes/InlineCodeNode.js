var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyntaxNode_1 = require('./SyntaxNode');
var InlineCodeNode = (function (_super) {
    __extends(InlineCodeNode, _super);
    function InlineCodeNode(plainText) {
        _super.call(this, null);
        this.plainText = plainText;
        this.INLINE_CODE_NODE = null;
    }
    InlineCodeNode.prototype.text = function () {
        return this.plainText;
    };
    return InlineCodeNode;
})(SyntaxNode_1.SyntaxNode);
exports.InlineCodeNode = InlineCodeNode;
