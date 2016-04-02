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



describe('Text surrounded by 3 asterisks', () => {
  it('is shouted, and produces a stress node containing an emphasis node containing the text', () => {
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

describe('Shouted text', () => {
  it('can be surrounded by more than 3 asterisks', () => {
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
  
  it('can be surrounded by an uneven number of asterisks, as long as there are at least 3', () => {
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
  
  it('can have its emphasis node ended first (and thus starting second), with the remaining text being stressed', () => {
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

  it('can have its emphasis node ended first (and thus starting second), with the remaining text being emphasized', () => {
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


describe('Shouted text inside of emphasized text', () => {
  it('produces the typical shouted syntax nodes nested with another emphasis node', () => {
    expect(Up.ast('*Please ***stop eating the cardboard*** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop eating the cardboard'),
            ]),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('Shouted text inside of stressed text', () => {
  it('produces the typical shouted syntax nodes nested with another stress node', () => {
    expect(Up.ast('**Please ***stop eating the cardboard*** immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop eating the cardboard'),
            ]),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})