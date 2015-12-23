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
describe('A backslash', function () {
    describe('causes the following character to be treated as plain text', function () {
        it('whether that following character is a backslash', function () {
            chai_1.expect(Up.ast('Hello, \\\\')).to.be.eql(new DocumentNode_1.DocumentNode([
                new PlainTextNode_1.PlainTextNode('Hello, \\!')
            ]));
        });
        it('or not', function () {
            chai_1.expect(Up.ast('Hello, \\world! \\')).to.be.eql(new DocumentNode_1.DocumentNode([
                new PlainTextNode_1.PlainTextNode('Hello, world!')
            ]));
        });
    });
});
