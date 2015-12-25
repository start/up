var SyntaxNode = (function () {
    function SyntaxNode(children) {
        if (children === void 0) { children = []; }
        this.children = children;
        this.parent = null;
        if (this.children) {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.parent = this;
            }
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
    SyntaxNode.prototype.valid = function () {
        return true;
    };
    return SyntaxNode;
})();
exports.SyntaxNode = SyntaxNode;
