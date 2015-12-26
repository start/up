var ParseResult = (function () {
    function ParseResult(nodes, countCharsConsumed, parentNode) {
        this.nodes = nodes;
        this.countCharsConsumed = countCharsConsumed;
        this.parentNode = parentNode;
    }
    ParseResult.prototype.success = function () {
        return true;
    };
    return ParseResult;
})();
exports.ParseResult = ParseResult;
