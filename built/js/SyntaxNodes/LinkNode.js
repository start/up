var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SyntaxNode_1 = require('./SyntaxNode');
var LinkNode = (function (_super) {
    __extends(LinkNode, _super);
    function LinkNode(children, url) {
        _super.call(this, children);
        this.url = url;
        this.LINK_NODE = 'link node';
    }
    return LinkNode;
})(SyntaxNode_1.SyntaxNode);
exports.LinkNode = LinkNode;
