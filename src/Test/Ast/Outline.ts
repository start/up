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

function insideDocument(syntaxNodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode(syntaxNodes);
}

function insideDocumentAndParagraph(syntaxNodes: SyntaxNode[]): DocumentNode {
  return insideDocument([new ParagraphNode(syntaxNodes)]);
}


describe('Between paragraphs', function() {
  it('1 blank line simply provides separation, producing no syntax node itself', function() {
    const text = `Hello, world!

Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('2 blank lines simply provide separation, producing no syntax nodes themselves', function() {
    const text = `Hello, world!

  \t 
Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('3 blank lines produces a section separator node', function() {
    const text = `Hello, world!



Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new SectionSeparatorNode(),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')]),
      ]))
  })

  it('more than 3 blank lines produces a single section separator node', function() {
    const text = `Hello, world!
 \t





Goodbye, world!`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new ParagraphNode([new PlainTextNode('Hello, world!')]),
        new SectionSeparatorNode(),
        new ParagraphNode([new PlainTextNode('Goodbye, world!')])
      ]))
  })
})



describe('A line of a streak of characters', function() {
  it('produces a section separator node', function() {
    const text = `----`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new SectionSeparatorNode()
      ]))
  })

  it('must not be immediately followed by a non-blank line', function() {
    const text = `----
hi`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new ParagraphNode([
          new PlainTextNode('----')
        ]),
        new ParagraphNode([
          new PlainTextNode('hi')
        ])
      ]))
  })

  it('can be immediately followed by any number of blank lines', function() {
    const text = `----
    


    
`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new SectionSeparatorNode()
      ]))
  })

  it('can be immediately preceeded by any number of blank lines', function() {
    const text = `



   
----
    


    
`
    expect(Up.ast(text)).to.be.eql(
      insideDocument([
        new SectionSeparatorNode()
      ]))
  })
})

