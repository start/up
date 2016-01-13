/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../index'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../SyntaxNodes/LinkNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'

function insideDocument(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode(syntaxNodes);
}

function insideDocumentAndParagraph(syntaxNodes: SyntaxNode[]): DocumentNode {
  return insideDocument([new ParagraphNode(syntaxNodes)]);
}

describe('No text', function() {
  it('creates only a document node', function() {
    expect(Up.ast('')).to.be.eql(new DocumentNode())
  })
})

describe('Text', function() {
  it('is put inside a plain text node inside a paragraph', function() {
    expect(Up.ast('Hello, world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, world!')
      ]))
  })
})

describe('A backslash', function() {
  it('causes the following character to be treated as plain text', function() {
    expect(Up.ast('Hello, \\world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, world!')
      ]))
  })
  it('causes the following backslash to be treated as plain text', function() {
    expect(Up.ast('Hello, \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\!')
      ]))
  })
  it('disables any special meaning of the following character', function() {
    expect(Up.ast('Hello, \\*world\\*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world*!')
      ]))
  })
  it('causes only the following character to be treated as plain text', function() {
    expect(Up.ast('Hello, \\\\, meet \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\, meet \\!')
      ]))
  })
  it('is ignored if it is the final character', function() {
    expect(Up.ast('Hello, \\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, ')
      ]))
  })
})

describe('Text surrounded by backticks', function() {
  it('is put inside an inline code node', function() {
    expect(Up.ast('Hello, `["w", "o", "r", "l", "d"].join("")`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode([
          new PlainTextNode('["w", "o", "r", "l", "d"].join("")')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('is not evaluated for other conventions', function() {
    expect(Up.ast('Hello, `*world*`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode([
          new PlainTextNode('*world*')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Text surrounded by asterisks', function() {
  it('is put inside an emphasis node', function() {
    expect(Up.ast('Hello, *world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!!')
      ]))
  })

  it('is evaluated for other conventions', function() {
    expect(Up.ast('Hello, *`world`*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new InlineCodeNode([
            new PlainTextNode('world')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can even hold stressed text', function() {
    expect(Up.ast('Hello, *my **little** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new StressNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can be indirectly nested inside another emphasis node', function() {
    expect(Up.ast('Hello, *my **very, *very* little** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new StressNode([
            new PlainTextNode('very, '),
            new EmphasisNode([
              new PlainTextNode("very")
            ]),
            new PlainTextNode(' little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Text surrounded by 2 asterisks', function() {
  it('is put inside a stress node', function() {
    expect(Up.ast('Hello, **world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can even hold emphasized text', function() {
    expect(Up.ast('Hello, **my *little* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('my '),
          new EmphasisNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Text starting with 3 asterisks', function() {
  it('can have its emphasis node closed first', function() {
    expect(Up.ast('Hello, ***my* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have its stress node closed first', function() {
    expect(Up.ast('Hello, ***my** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new StressNode([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('An unmatched asterisk', function() {
  it('does not create an emphasis node', function() {
    expect(Up.ast('Hello, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world!')
      ]))
  })
})


describe('Text surrounded by 2 plus signs', function() {
  it('is put inside a revision insertion node', function() {
    expect(Up.ast('I like ++to brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionInsertionNode([
          new PlainTextNode('to brush')
        ]),
        new PlainTextNode(' my teeth')
      ]))
  })

  it('is evaluated for other conventions', function() {
    expect(Up.ast('I like ++to *regularly* brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionInsertionNode([
          new PlainTextNode('to '),
          new EmphasisNode([
            new PlainTextNode('regularly')
          ]),
          new PlainTextNode(' brush')
        ]),
        new PlainTextNode(' my teeth')
      ]))
  })
})

describe('Text surrounded by 2 tildes', function() {
  it('is put inside a revision deletion node', function() {
    expect(Up.ast('I like ~~certain types of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })

  it('is evaluated for other conventions', function() {
    expect(Up.ast('I like ~~certain *types* of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Text surrounded by faces looking away', function() {
  it('is put inside a spoiler node', function() {
    expect(Up.ast('After you beat the Elite Four, [<_<]you fight Gary[>_>].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is evaluated for other conventions', function() {
    expect(Up.ast('After you beat the Elite Four, [<_<]you fight *Gary*[>_>].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight '),
          new EmphasisNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})

describe('Bracketed text pointing to a URL', function() {
  it('is put inside a link node', function() {
    expect(Up.ast('I like [this site -> https://stackoverflow.com]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })

  it('is evaluated for other conventions', function() {
    expect(Up.ast('I like [*this* site -> https://stackoverflow.com].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('this')
          ]),
          new PlainTextNode(' site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('.')
      ]))
  })

  it('can contain matching unescaped brackets in the URL', function() {
    expect(Up.ast('Here is a [strange URL -> https://google.com/search?q=[hi]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Here is a '),
        new LinkNode([
          new PlainTextNode('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new PlainTextNode('.')
      ]))
  })

  it('does not try to match brackets in the link text with brackets in the URL', function() {
    expect(Up.ast('I like [you [: -> https://stackoverflow.com]!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('you [:')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('!!')
      ]))
  })
})


describe('Text surrounded by 2 parentheses', function() {
  it('is put inside an inline aside node', function() {
    expect(Up.ast("I don't eat cereal. ((Well, I do, but I pretend not to.)) I haven't for years.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I don't eat cereal. "),
        new InlineAsideNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ]),
        new PlainTextNode(" I haven't for years.")
      ]))
  })

  it('is evaluated for other conventions', function() {
    expect(Up.ast("I don't eat cereal. ((Well, I *do*, but I pretend not to.)) I haven't for years.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I don't eat cereal. "),
        new InlineAsideNode([
          new PlainTextNode('Well, I '),
          new EmphasisNode([
            new PlainTextNode('do')
          ]),
          new PlainTextNode(', but I pretend not to.')
        ]),
        new PlainTextNode(" I haven't for years.")
      ]))
  })

  it('can be nested inside other inline aside nodes', function() {
    expect(Up.ast("((I don't eat cereal. ((Well, I *do*, but I pretend not to.)) I haven't for years.))")).to.be.eql(
      insideDocumentAndParagraph([
        new InlineAsideNode([
          new PlainTextNode("I don't eat cereal. "),
          new InlineAsideNode([
            new PlainTextNode('Well, I '),
            new EmphasisNode([
              new PlainTextNode('do')
            ]),
            new PlainTextNode(', but I pretend not to.')
          ]),
          new PlainTextNode(" I haven't for years.")
        ])
      ]))
  })
})

describe('Two lines of text with a blank line in between', function() {
  it('creates two paragraph nodes', function() {
    const text = `Hello, world!

Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })
})