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
