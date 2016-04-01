/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

// NOTE: "Shouting" is simply emphasized and stressed text.

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



describe('Text surrounded by 3 asterisks', () => {
  it('is shouted, and produces nested stress and emphasis nodes containing the text', () => {
    expect(Up.ast('Xamarin is now ***free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('free'),
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text surrounded by more than 3 asterisks', () => {
  it('is shouted, and produces nested stress and emphasis nodes containing the text', () => {
    expect(Up.ast('Koopas! ******Mario is on his way!****** Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })
})


describe('Shouted text', () => {
  it('does not need to have an equal number of asterisks on either side', () => {
    expect(Up.ast('Koopas! ******Mario is on his way!********* Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })
})


describe('Shouted text', () => {
  it('can have its emphasis node ended first, with the remaining text being stressed', () => {
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

  it('can have its emphasis node ended first, with the remaining text being emphasized', () => {
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
