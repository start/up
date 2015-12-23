var SyntaxNode = (function () {
    function SyntaxNode(children) {
        this.children = children;
    }
    SyntaxNode.prototype.text = function () {
        return this.children.reduce(function (text, child) { return text + child.text(); }, '');
    };
    return SyntaxNode;
})();
exports.SyntaxNode = SyntaxNode;
