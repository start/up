import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'


describe('markup surrounded by 2 plus signs', () => {
  it('is put inside a revision insertion node', () => {
    expect(Up.toDocument('I like ++to brush++ my teeth')).to.be.eql(
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
    expect(Up.toDocument('I like ++to *regularly* brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionInsertionNode([
          new PlainTextNode('to '),
          new Emphasis([
            new PlainTextNode('regularly')
          ]),
          new PlainTextNode(' brush')
        ]),
        new PlainTextNode(' my teeth')
      ]))
  })
})


describe('An unmatched revision insertion delimiter', () => {
  it('is preserved as plain text', () => {
    expect(Up.toDocument('I like pizza++but I never eat it.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like pizza++but I never eat it.'),
      ]))
  })
})
