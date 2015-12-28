var chai_1 = require('chai');
var Up = require('../index');
var DocumentNode_1 = require('../SyntaxNodes/DocumentNode');
var PlainTextNode_1 = require('../SyntaxNodes/PlainTextNode');
var EmphasisNode_1 = require('../SyntaxNodes/EmphasisNode');
var StressNode_1 = require('../SyntaxNodes/StressNode');
var InlineCodeNode_1 = require('../SyntaxNodes/InlineCodeNode');
var RevisionInsertionNode_1 = require('../SyntaxNodes/RevisionInsertionNode');
var RevisionDeletionNode_1 = require('../SyntaxNodes/RevisionDeletionNode');
function insideDocument(syntaxNodes) {
    return new DocumentNode_1.DocumentNode(syntaxNodes);
}
describe('No text', function () {
    it('creates only a document node', function () {
        chai_1.expect(Up.ast('')).to.be.eql(new DocumentNode_1.DocumentNode());
    });
});
describe('Text', function () {
    it('is put inside a plain text node', function () {
        chai_1.expect(Up.ast('Hello, world!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, world!')
        ]));
    });
});
describe('A backslash', function () {
    it('causes the following character to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\world!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, world!')
        ]));
    });
    it('causes the following backslash to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\\\!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, \\!')
        ]));
    });
    it('disables any special meaning of the following character', function () {
        chai_1.expect(Up.ast('Hello, \\*world\\*!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, *world*!')
        ]));
    });
    it('causes only the following character to be treated as plain text', function () {
        chai_1.expect(Up.ast('Hello, \\\\, meet \\\\!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, \\, meet \\!')
        ]));
    });
    it('is ignored if it is the final character', function () {
        chai_1.expect(Up.ast('Hello, \\')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, ')
        ]));
    });
});
describe('Text surrounded by asterisks', function () {
    it('is put inside an emphasis node', function () {
        chai_1.expect(Up.ast('Hello, *world*!!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new EmphasisNode_1.EmphasisNode([
                new PlainTextNode_1.PlainTextNode('world')
            ]),
            new PlainTextNode_1.PlainTextNode('!!')
        ]));
    });
    it('is evaluated for other conventions', function () {
        chai_1.expect(Up.ast('Hello, *`world`*!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new EmphasisNode_1.EmphasisNode([
                new InlineCodeNode_1.InlineCodeNode([
                    new PlainTextNode_1.PlainTextNode('world')
                ])
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
    it('can even hold stressed text', function () {
        chai_1.expect(Up.ast('Hello, *my **little** world*!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new EmphasisNode_1.EmphasisNode([
                new PlainTextNode_1.PlainTextNode('my '),
                new StressNode_1.StressNode([
                    new PlainTextNode_1.PlainTextNode('little')
                ]),
                new PlainTextNode_1.PlainTextNode(' world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
    it('can be indirectly nested inside another emphasis node', function () {
        chai_1.expect(Up.ast('Hello, *my **very, *very* little** world*!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new EmphasisNode_1.EmphasisNode([
                new PlainTextNode_1.PlainTextNode('my '),
                new StressNode_1.StressNode([
                    new PlainTextNode_1.PlainTextNode('very, '),
                    new EmphasisNode_1.EmphasisNode([
                        new PlainTextNode_1.PlainTextNode("very")
                    ]),
                    new PlainTextNode_1.PlainTextNode(' little')
                ]),
                new PlainTextNode_1.PlainTextNode(' world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
});
describe('Text surrounded by backticks', function () {
    it('is put inside an inline code node', function () {
        chai_1.expect(Up.ast('Hello, `["w", "o", "r", "l", "d"].join("")`!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new InlineCodeNode_1.InlineCodeNode([
                new PlainTextNode_1.PlainTextNode('["w", "o", "r", "l", "d"].join("")')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
    it('is not evaluated for other conventions', function () {
        chai_1.expect(Up.ast('Hello, `*world*`!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new InlineCodeNode_1.InlineCodeNode([
                new PlainTextNode_1.PlainTextNode('*world*')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
});
describe('Text surrounded by 2 asterisks', function () {
    it('is put inside a stress node', function () {
        chai_1.expect(Up.ast('Hello, **world**!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new StressNode_1.StressNode([
                new PlainTextNode_1.PlainTextNode('world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
    it('can even hold emphasized text', function () {
        chai_1.expect(Up.ast('Hello, **my *little* world**!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new StressNode_1.StressNode([
                new PlainTextNode_1.PlainTextNode('my '),
                new EmphasisNode_1.EmphasisNode([
                    new PlainTextNode_1.PlainTextNode('little')
                ]),
                new PlainTextNode_1.PlainTextNode(' world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
});
describe('Text starting with 3 asterisks', function () {
    it('can have its emphasis node closed first', function () {
        chai_1.expect(Up.ast('Hello, ***my* world**!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new StressNode_1.StressNode([
                new EmphasisNode_1.EmphasisNode([
                    new PlainTextNode_1.PlainTextNode('my'),
                ]),
                new PlainTextNode_1.PlainTextNode(' world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
    it('can have its stress node closed first', function () {
        chai_1.expect(Up.ast('Hello, ***my** world*!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, '),
            new EmphasisNode_1.EmphasisNode([
                new StressNode_1.StressNode([
                    new PlainTextNode_1.PlainTextNode('my'),
                ]),
                new PlainTextNode_1.PlainTextNode(' world')
            ]),
            new PlainTextNode_1.PlainTextNode('!')
        ]));
    });
});
describe('An unmatched asterisk', function () {
    it('does not create an emphasis node', function () {
        chai_1.expect(Up.ast('Hello, *world!')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('Hello, *world!')
        ]));
    });
});
describe('Text surrounded by 2 plus signs', function () {
    it('is put inside a revision insertion node', function () {
        chai_1.expect(Up.ast('I like ++to brush++ my teeth')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('I like '),
            new RevisionInsertionNode_1.RevisionInsertionNode([
                new PlainTextNode_1.PlainTextNode('to brush')
            ]),
            new PlainTextNode_1.PlainTextNode(' my teeth')
        ]));
    });
    it('is evaluated for other conventions', function () {
        chai_1.expect(Up.ast('I like ++to *regularly* brush++ my teeth')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('I like '),
            new RevisionInsertionNode_1.RevisionInsertionNode([
                new PlainTextNode_1.PlainTextNode('to '),
                new EmphasisNode_1.EmphasisNode([
                    new PlainTextNode_1.PlainTextNode('regularly')
                ]),
                new PlainTextNode_1.PlainTextNode(' brush')
            ]),
            new PlainTextNode_1.PlainTextNode(' my teeth')
        ]));
    });
});
describe('Text surrounded by 2 tildes', function () {
    it('is put inside a revision deletion node', function () {
        chai_1.expect(Up.ast('I like ~~certain types of~~ pizza')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('I like '),
            new RevisionDeletionNode_1.RevisionDeletionNode([
                new PlainTextNode_1.PlainTextNode('certain types of')
            ]),
            new PlainTextNode_1.PlainTextNode(' pizza')
        ]));
    });
    it('is evaluated for other conventions', function () {
        chai_1.expect(Up.ast('I like ~~certain *types* of~~ pizza')).to.be.eql(insideDocument([
            new PlainTextNode_1.PlainTextNode('I like '),
            new RevisionDeletionNode_1.RevisionDeletionNode([
                new PlainTextNode_1.PlainTextNode('certain '),
                new EmphasisNode_1.EmphasisNode([
                    new PlainTextNode_1.PlainTextNode('types')
                ]),
                new PlainTextNode_1.PlainTextNode(' of')
            ]),
            new PlainTextNode_1.PlainTextNode(' pizza')
        ]));
    });
});
