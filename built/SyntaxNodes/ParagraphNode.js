var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyntaxNode_1 = require('./SyntaxNode');
var ParagraphNode = (function (_super) {
    __extends(ParagraphNode, _super);
    function ParagraphNode() {
        _super.apply(this, arguments);
    }
    return ParagraphNode;
})(SyntaxNode_1.SyntaxNode);
exports.ParagraphNode = ParagraphNode;
