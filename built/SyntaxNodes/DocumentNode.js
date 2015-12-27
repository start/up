var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyntaxNode_1 = require('./SyntaxNode');
var DocumentNode = (function (_super) {
    __extends(DocumentNode, _super);
    function DocumentNode() {
        _super.apply(this, arguments);
    }
    return DocumentNode;
})(SyntaxNode_1.SyntaxNode);
exports.DocumentNode = DocumentNode;
