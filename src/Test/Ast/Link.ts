
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { PlaceholderFootnoteReferenceNode } from '../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Bracketed text pointing to a URL', () => {
  it('produce a link node', () => {
    expect(Up.toAst('I like [this site -> https://stackoverflow.com]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://stackoverflow.com'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})


describe("A link's contents", () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like [*this* site -> https://stackoverflow.com].')).to.be.eql(
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
})


describe("A link's URLs", () => {
  it('can contain matching unescaped brackets', () => {
    expect(Up.toAst('Here is a [strange URL -> https://google.com/search?q=[hi]].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Here is a '),
        new LinkNode([
          new PlainTextNode('strange URL')
        ], 'https://google.com/search?q=[hi]'),
        new PlainTextNode('.')
      ]))
  })

  it('can have an escaped, unmatched closing bracket', () => {
    expect(Up.toAst('I like [this site -> https://google.com/?fake=\\]query]. I bet you do, too.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new LinkNode([
          new PlainTextNode('this site')
        ], 'https://google.com/?fake=]query'),
        new PlainTextNode('. I bet you do, too.')
      ]))
  })
})

