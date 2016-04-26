
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
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('A naked URL', () => {
  it('produces a link node. The content of the link is the URL minus its protocol', () => {
    expect(Up.toAst('https://archive.org')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org')
        ], 'https://archive.org')
      ]))
  })
  
  it('is terminated by a space', () => {
    expect(Up.toAst('https://archive.org ')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org')
        ], 'https://archive.org')
      ]))
  })
  
  it('can contain matching parentheses', () => {
    expect(Up.toAst('https://archive.org/fake(url)')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake(url)')
        ], 'https://archive.org/fake(url)')
      ]))
  })
  
  it('can contain matching square brackets', () => {
    expect(Up.toAst('https://archive.org/fake[url]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('archive.org/fake[url]')
        ], 'https://archive.org/fake[url]')
      ]))
  })
  
  it('can be inside parentheses', () => {
    expect(Up.toAst('(https://archive.org/fake)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('('),
        new LinkNode([
          new PlainTextNode('archive.org/fake')
        ], 'https://archive.org/fake'),
        new PlainTextNode(')'),
      ]))
  })
  
  it('can contain be inside square brackets', () => {
    expect(Up.toAst('[https://archive.org/fake]')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('archive.org/fake')
        ], 'https://archive.org/fake'),
        new PlainTextNode(']'),
      ]))
  })
})