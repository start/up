
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
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'


describe('Text surrounded by 2 plus signs', () => {
  it('is put inside a revision insertion node', () => {
    expect(Up.toAst('I like ++to brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionInsertionNode([
          new PlainTextNode('to brush')
        ]),
        new PlainTextNode(' my teeth')
      ]))
  })
})


describe('A revision insertion', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like ++to *regularly* brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionInsertionNode([
          new PlainTextNode('to '),
          new EmphasisNode([
            new PlainTextNode('regularly')
          ]),
          new PlainTextNode(' brush')
        ]),
        new PlainTextNode(' my teeth')
      ]))
  })
})
