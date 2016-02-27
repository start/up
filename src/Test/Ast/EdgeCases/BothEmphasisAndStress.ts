/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { SyntaxNode } from '../../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


function insideDocumentAndParagraph(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode([
    new ParagraphNode(syntaxNodes)
  ])
}

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
  
  it('can have its emphasis node closed first even when followed by stressed text', () => {
    expect(Up.ast('***Nimble* navigators?** **Tropical.**')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new StressNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })
  
  it('can have its emphasis node closed first even when followed by emphasized text', () => {
    expect(Up.ast('***Nimble* navigators?** *Tropical.*')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new EmphasisNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })
  
  it('can have its stress node closed first even when followed by stressed text', () => {
    expect(Up.ast('***Nimble** navigators?* **Tropical.**')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new StressNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new StressNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })
  
  it('can have its stress node closed first even when followed by emphasized text', () => {
    expect(Up.ast('***Nimble** navigators?* *Tropical.*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new StressNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new EmphasisNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })
})