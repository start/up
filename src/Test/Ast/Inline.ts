/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


function insideDocumentAndParagraph(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode([
    new ParagraphNode(syntaxNodes)
  ])
}

describe('An empty document', () => {
  it('produces only a document node', () => {
    expect(Up.ast('')).to.eql(new DocumentNode())
  })
  
  it('is considered empty even if there are up to two lines of whitespace', () => {
    const text =
`     
\t
`
    expect(Up.ast(text)).to.eql(new DocumentNode())
  })
})

describe('A backslash', () => {
  it('causes the following character to be treated as plain text', () => {
    expect(Up.ast('Hello, \\world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, world!')
      ]))
  })

  it('causes the following backslash to be treated as plain text', () => {
    expect(Up.ast('Hello, \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\!')
      ]))
  })

  it('disables any special meaning of the following character', () => {
    expect(Up.ast('Hello, \\*world\\*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world*!')
      ]))
  })

  it('causes only the following character to be treated as plain text', () => {
    expect(Up.ast('Hello, \\\\, meet \\\\!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, \\, meet \\!')
      ]))
  })

  it('is ignored if it is the final character of the text', () => {
    expect(Up.ast('Hello, \\')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, ')
      ]))
  })

  it('disables any special meaning of the following line break', () => {
    const text = `Hello, world!\\
\\
Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, world!\n\nGoodbye, world!')
      ]))
  })
})

describe('Text surrounded by backticks', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.ast('Hello, `*world*`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('*world*'),
        new PlainTextNode('!')
      ]))
  })

  it('can be escaped', () => {
    expect(Up.ast('Hello, `\\h\\i`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('hi'),
        new PlainTextNode('!')
      ]))
  })

  it('can contain escaped backslashes', () => {
    expect(Up.ast('Hello, `\\`\\h\\i\\``!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('`hi`'),
        new PlainTextNode('!')
      ]))
  })

  it('can be the last convention in a paragraph', () => {
    expect(Up.ast('Hello, `*world*`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('*world*')
      ]))
  })
})

describe('Text surrounded by asterisks', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.ast('Hello, *world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!!')
      ]))
  })

  it('is evaluated for other conventions', () => {
    expect(Up.ast('Hello, *`world`*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new InlineCodeNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can even hold stressed text', () => {
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

  it('can be indirectly nested inside another emphasis node', () => {
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

describe('Text surrounded by 2 asterisks', () => {
  it('is put inside a stress node', () => {
    expect(Up.ast('Hello, **world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can even hold emphasized text', () => {
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

describe('Text starting with 3 asterisks', () => {
  it('can have its emphasis node closed first', () => {
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

  it('can have its stress node closed first', () => {
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

describe('An unmatched asterisk', () => {
  it('does not create an emphasis node', () => {
    expect(Up.ast('Hello, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, *world!')
      ]))
  })

  it('does not create an emphasis node, even when following 2 matching asterisks', () => {
    expect(Up.ast('*Hello*, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Hello'),
        ]),
        new PlainTextNode(', *world!')
      ]))
  })
})


describe('Text surrounded by 2 plus signs', () => {
  it('is put inside a revision insertion node', () => {
    expect(Up.ast('I like ++to brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionInsertionNode([
          new PlainTextNode('to brush')
        ]),
        new PlainTextNode(' my teeth')
      ]))
  })

  it('is evaluated for other conventions', () => {
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

describe('Text surrounded by 2 tildes', () => {
  it('is put inside a revision deletion node', () => {
    expect(Up.ast('I like ~~certain types of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })

  it('is evaluated for other conventions', () => {
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


describe('Text surrounded by faces looking away', () => {
  it('is put inside a spoiler node', () => {
    expect(Up.ast('After you beat the Elite Four, [<_<]you fight Gary[>_>].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('is evaluated for other conventions', () => {
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

  it('can be nested within another spoiler node', () => {
    expect(Up.ast('After you beat the Elite Four, [<_<]you fight [<_<]Gary[>_>][>_>].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight '),
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
        ]),
        new PlainTextNode('.')
      ]))
  })
})

describe('Bracketed text pointing to a URL', () => {
  it('is put inside a link node', () => {
    expect(Up.ast('I like [this site -> https://stackoverflow.com]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })

  it('is evaluated for other conventions', () => {
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

  it('can contain matching unescaped brackets in the URL', () => {
    expect(Up.ast('Here is a [strange URL -> https://google.com/search?q=[hi]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Here is a '),
        new LinkNode([
          new PlainTextNode('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new PlainTextNode('.')
      ]))
  })

  it('does not try to match brackets in the link text with brackets in the URL', () => {
    expect(Up.ast('I like [you [: -> https://stackoverflow.com]!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('you [:')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('!!')
      ]))
  })

  it('can have an escaped, unmatched closing bracket in the URL', () => {
    expect(Up.ast('I like [this site -> https://google.com/?fake=\\]query]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://google.com/?fake=]query'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})


describe('Text surrounded by 2 parentheses', () => {
  it('is put inside an inline aside node', () => {
    expect(Up.ast("I don't eat cereal. ((Well, I do, but I pretend not to.)) I haven't for years.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I don't eat cereal. "),
        new InlineAsideNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ]),
        new PlainTextNode(" I haven't for years.")
      ]))
  })

  it('is evaluated for other conventions', () => {
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

  it('can be nested inside other inline aside nodes', () => {
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

  it('can be the last convention in a paragraph', () => {
    expect(Up.ast("I don't eat cereal. ((Well, I do, but I pretend not to.))")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I don't eat cereal. "),
        new InlineAsideNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ])
      ]))
  })
})