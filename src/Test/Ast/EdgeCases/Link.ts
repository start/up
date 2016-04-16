/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
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
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('An opening bracket followed by " -> " followed by a closing bracket', () => {
  it('does not produce a link node', () => {
    expect(Up.ast('[Try to] do this -> smile :]')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[Try to] do this -> smile :]')
      ]))
  })
})


describe('A link with no URL', () => {
  it('does not produce a link node, but its contents are included directly', () => {
    expect(Up.ast('[*Yggdra Union* -> ]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with a blank URL', () => {
  it('does not produce a link node, but its contents are included directly', () => {
    expect(Up.ast('[*Yggdra Union* ->   \t  ]')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Yggdra Union')
        ])
      ]))
  })
})


describe('A link with no content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.ast('[ -> https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]
      ))
  })
})


describe('A link with blank content', () => {
  it('produces a link node with its URL for its content', () => {
    expect(Up.ast('[   \t   -> https://google.com]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('https://google.com')
        ], 'https://google.com'
        )]))
  })
})


describe('A link with no content and no URL', () => {
  it('produces no syntax nodes', () => {
    expect(Up.ast('Hello, [ -> ]!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, !')
      ])
    )
  })
})


describe('A link', () => {
  it('can follow bracketed text', () => {
    expect(Up.ast("I [usually] use [Google -> https://google.com]!!")).to.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I [usually] use '),
        new LinkNode([
          new PlainTextNode('Google')
        ], 'https://google.com'),
        new PlainTextNode('!!')
      ]))
  })


  it('can be inside bracketed text', () => {
    expect(Up.ast("[I use [Google -> https://google.com]]")).to.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[I use '),
        new LinkNode([
          new PlainTextNode('Google')
        ], 'https://google.com'),
        new PlainTextNode(']')
      ]))
  })


  it('starts with the final of multiple opening brackets even when there is just one closing bracket', () => {
    expect(Up.ast('Go to [this [site -> https://stackoverflow.com]!!')).to.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Go to [this '),
        new LinkNode([
          new PlainTextNode('site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('!!')
      ]))
  })
})
