var ParseResult = (function () {
    function ParseResult(nodes) {
        this.nodes = nodes;
    }
    ParseResult.prototype.success = function () {
        return true;
    };
    return ParseResult;
})();
exports.ParseResult = ParseResult;
