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


describe('Between paragraphs', () => {
  it('1 blank line simply provides separation, producing no syntax node itself', () => {
    const text = `Hello, world!

Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('2 blank lines simply provide separation, producing no syntax nodes themselves', () => {
    const text = `Hello, world!

  \t 
Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('3 or more blank lines produces a section separator node', () => {
    const text = `Hello, world!



Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new SectionSeparatorNode(),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('6 or more blank lines produces only a single section separator node', () => {
    const text = `Hello, world!
 \t






Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new SectionSeparatorNode(),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')])
      ]))
  })
})


describe('A document that starts with 3 blank lines', () => {
  it('does not produce a leading section separator node', () => {
    const text =
      `


Hello, world!`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ])
      ])
    )
  })
})


describe('A document that ends with 3 blank lines', () => {
  it('does not produce a trailing section separator node', () => {
    const text =
      `Hello, world!



`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Hello, world!')
        ])
      ])
    )
  })
})


describe('A line consisting solely of a streak of characters', () => {
  it('produces a section separator node when comprised of at least 3 hyphens', () => {
    const text = '---'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be comprised of equal signs', () => {
    const text = '==='
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be comprised of number signs', () => {
    const text = '###'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be comprised of more than 3 characters', () => {
    const text = '##########'
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can have a space between each character', () => {
    const text = '= = ='
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can have a space between each character and start with a space', () => {
    const text = ' = = ='
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be immediately followed by a non-blank line', () => {
    const text = `
---
hi`
    expect(Up.ast(text)).to.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode('hi')
        ])
      ]))
  })

  it('can be immediately followed by any number of blank lines and still produce a single node', () => {
    const text = `===
    


    
`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })

  it('can be immediately preceeded by any number of blank lines and still produce a single node', () => {
    const text = `


  \t
   
###
    
\t   
`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})




describe('Consecutive lines consisting solely of streaks of characters', () => {
  it('produces a single section separator node', () => {
    const text = `
--------
--------
********
`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})


describe('Lines consisting solely of streaks of characters separated only by blank lines', () => {
  it('produces a single section separator node', () => {
    const text = `
--------

--------





********
`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode()
      ]))
  })
})

