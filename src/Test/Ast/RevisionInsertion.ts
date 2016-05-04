
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'


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
