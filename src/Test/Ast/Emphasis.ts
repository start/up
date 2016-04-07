/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
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
})

describe('Text separated from surrounding asterisks by whitespace', () => {
  it('is not put inside an emphasis node', () => {
    expect(Up.ast('Birdie Sanders * won * Wisconsin')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Birdie Sanders * won * Wisconsin'),
      ]))
  })
})


describe('Emphasized text', () => {
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

  it('can contain further emphasized text', () => {
    expect(Up.ast('Hello, *my *little* world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new EmphasisNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can contain stressed text', () => {
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
})

describe('Double asterisks followed by two separate single closing asterisks', () => {
  it('produces 2 nested emphasis nodes', () => {
    expect(Up.ast('**Warning:* never feed this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode('Warning:'),
          ]),
          new PlainTextNode(' never feed this tarantula')
        ])
      ]))
  })
})

describe('Quadruple asterisks followed by 4 separate single closing asterisks', () => {
  it('produces 4 nested emphasis nodes', () => {
    expect(Up.ast('****Warning:* never* feed* this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new EmphasisNode([
            new EmphasisNode([
              new EmphasisNode([
                new PlainTextNode('Warning:'),
              ]),
              new PlainTextNode(' never')
            ]),
            new PlainTextNode('feed')
          ]),
          new PlainTextNode(' this tarantula')
        ])
      ]))
  })
})