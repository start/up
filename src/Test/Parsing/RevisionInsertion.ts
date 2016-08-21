import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'


describe('markup surrounded by 2 plus signs', () => {
  it('is put inside a revision insertion node', () => {
    expect(Up.toDocument('I like ++to brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new RevisionInsertion([
          new PlainText('to brush')
        ]),
        new PlainText(' my teeth')
      ]))
  })
})


describe('A revision insertion', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like ++to *regularly* brush++ my teeth')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new RevisionInsertion([
          new PlainText('to '),
          new Emphasis([
            new PlainText('regularly')
          ]),
          new PlainText(' brush')
        ]),
        new PlainText(' my teeth')
      ]))
  })
})


describe('An unmatched revision insertion delimiter', () => {
  it('is preserved as plain text', () => {
    expect(Up.toDocument('I like pizza++but I never eat it.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I like pizza++but I never eat it.'),
      ]))
  })
})
