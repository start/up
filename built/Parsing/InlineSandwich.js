var InlineSandwich = (function () {
    function InlineSandwich(SyntaxNodeType, bun, closingBun) {
        if (closingBun === void 0) { closingBun = bun; }
        this.SyntaxNodeType = SyntaxNodeType;
        this.bun = bun;
        this.closingBun = closingBun;
    }
    return InlineSandwich;
})();
exports.InlineSandwich = InlineSandwich;
