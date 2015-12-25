var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParseResult_1 = require('./ParseResult');
var FailedParseResult = (function (_super) {
    __extends(FailedParseResult, _super);
    function FailedParseResult() {
        _super.call(this, null);
    }
    FailedParseResult.prototype.success = function () {
        return false;
    };
    return FailedParseResult;
})(ParseResult_1.ParseResult);
exports.FailedParseResult = FailedParseResult;
