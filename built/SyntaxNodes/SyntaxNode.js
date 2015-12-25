var SyntaxNode = (function () {
    function SyntaxNode(initialChildren) {
        if (initialChildren === void 0) { initialChildren = []; }
        this.parent = null;
        this.children = [];
        if (initialChildren) {
            this.addChildren(initialChildren);
        }
    }
    SyntaxNode.prototype.parents = function () {
        if (this.parent === null) {
            return [];
        }
        return [this.parent].concat(this.parent.parents());
    };
    SyntaxNode.prototype.text = function () {
        return this.children.reduce(function (text, child) { return text + child.text(); }, '');
    };
    SyntaxNode.prototype.addChild = function (syntaxNode) {
        syntaxNode.parent = this;
        this.children.push(syntaxNode);
    };
    SyntaxNode.prototype.addChildren = function (nodes) {
        for (var _i = 0; _i < nodes.length; _i++) {
            var node = nodes[_i];
            node.parent = this;
            this.children.push(node);
        }
    };
    return SyntaxNode;
})();
exports.SyntaxNode = SyntaxNode;
