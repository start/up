var ParseResult = (function () {
    function ParseResult(nodes, countCharsConsumed) {
        this.nodes = nodes;
        this.countCharsConsumed = countCharsConsumed;
    }
    ParseResult.prototype.success = function () {
        return true;
    };
    return ParseResult;
})();
exports.ParseResult = ParseResult;
