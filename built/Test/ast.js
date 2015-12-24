var chai_1 = require('chai');
var Up = require('../index');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
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
        chai_1.expect(Up.ast('Hello, \\world!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, world!')
        ]));
    });
    it('causes the following backslash to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\\\!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, \\!')
        ]));
    });
    it('disables any special meaning of the following character', function () {
        chai_1.expect(Up.ast('Hello, \\*world\\*!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, *world*!')
        ]));
    });
    it('causes only the following character to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\\\, meet \\\\!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, \\, meet \\!')
        ]));
    });
    it('is ignored if it is the final character', function () {
        chai_1.expect(Up.ast('Hello, \\')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, ')
        ]));
    });
});
describe('Text surrounded by asterisks', function () {
    it('is put inside an emphasis node', function () {
        chai_1.expect(Up.ast('Hello, *world*!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new EmphasisNode_1.EmphasisNode([
                new PlainTextNode_1.PlainTextNode('world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
});
describe('Text surrounded by backticks', function () {
    it('is put inside an inline code node', function () {
        chai_1.expect(Up.ast('Hello, `["w", "o", "r", "l", "d"].join("")`!')).to.be.eql(new DocumentNode_1.DocumentNode([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new InlineCodeNode_1.InlineCodeNode([
                new PlainTextNode_1.PlainTextNode('["w", "o", "r", "l", "d"].join("")')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
});
