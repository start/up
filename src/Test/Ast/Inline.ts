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