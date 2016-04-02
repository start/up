/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
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


describe('Shouted text', () => {
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



describe('Shouted text inside of emphasized text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.ast('*Please ***stop** eating the cardboard* immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have its emphasis node closed early', () => {
    expect(Up.ast('*Please ***stop* eating the cardboard** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have both the emphasis nodes closed before the stress node', () => {
    expect(Up.ast('*Please ***stop* eating the cardboard* immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new StressNode([
            new PlainTextNode(' immediately')
          ]),
        ])
      ]))
  })
})


describe('Shouted text inside of stressed text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.ast('**Please ***stop** eating the cardboard* immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have its emphasis node closed early', () => {
    expect(Up.ast('**Please ***stop* eating the cardboard** immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have both the stress nodes closed before the emphasis node', () => {
    expect(Up.ast('**Please ***stop** eating the cardboard** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
        ]),
        new EmphasisNode([
          new PlainTextNode(' immediately')
        ]),
      ]))
  })
})
