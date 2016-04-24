
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


describe('Text surrounded by backticks', () => {
  it('is put into an inline code node', () => {
    expect(Up.toAst('`gabe.attack(james)`')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineCodeNode('gabe.attack(james)'),
      ]))
  })
})


describe('Inline code', () => {
  it('is not evaluated for other conventions', () => {
    expect(Up.toAst('Hello, `*Bruno*`!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new InlineCodeNode('*Bruno*'),
        new PlainTextNode('!')
      ]))
  })
})


describe('Backslashes inside inline code', () => {
  it('escape the following character', () => {
    expect(Up.toAst('Whiteboard `pro\\p`')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Whiteboard '),
        new InlineCodeNode('prop')
      ]))
  })
  
  it('escape backticks', () => {
    expect(Up.toAst('Funny quotes: `"\\``')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Funny quotes: '),
        new InlineCodeNode('"`')
      ]))
  })
})
