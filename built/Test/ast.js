var chai_1 = require('chai');
var Up = require('../index');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
describe('No text', function () {
    it('creates only a document node', function () {
        chai_1.expect(Up.ast('')).to.be.eql(new DocumentNode_1.DocumentNode());
    });
});
describe('Text', function () {
    it('is put inside a plain text node', function () {
        chai_1.expect(Up.ast('Hello, world!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, world!')
        ]));
    });
});
describe('A backslash', function () {
    it('causes the following character to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\\\')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, \\!')
        ]));
    });
    it('causes the following backslash to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\world! \\')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, world!')
        ]));
    });
});
