var chai_1 = require('chai');
var Up = require('../index');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
describe('A document node', function () {
    it('is all you get when there is no text', function () {
        chai_1.expect(Up.ast('')).to.be.eql(new DocumentNode_1.DocumentNode());
    });
});
describe('A document node', function () {
    it('is all you get when there is no text', function () {
        chai_1.expect(Up.ast('Hello, world!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, world!')
        ]));
    });
});
