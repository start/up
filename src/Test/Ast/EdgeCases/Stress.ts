
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
import { PlaceholderFootnoteReferenceNode } from '../../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'




describe('Double asterisks followed by whitespace with matching double asterisks touching the end of a word', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.toAst('I believe** my spelling** was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe** my spelling** was wrong.')
      ])
    )
  })
})


describe('Double asterisks touching the beginning of a word with matching double asterisks preceded by whitespace', () => {
  it('do not produce an emphasis node and are preserved as plain text', () => {
    expect(Up.toAst('I **believe my **spelling was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I **believe my **spelling was wrong.')
      ])
    )
  })
})


describe('Matching double asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.toAst('I believe ** will win the primary in ** easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe ** will win the primary in ** easily.')
      ])
    )
  })
})
