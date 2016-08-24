import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { RevisionDeletion } from '../../SyntaxNodes/RevisionDeletion'


describe('Text surrounded by 2 tildes', () => {
  it('is put inside a revision deletion node', () => {
    expect(Up.toDocument('I like ~~certain types of~~ pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new RevisionDeletion([
          new PlainText('certain types of')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('A revision deletion', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like ~~certain *types* of~~ pizza')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like '),
        new RevisionDeletion([
          new PlainText('certain '),
          new Emphasis([
            new PlainText('types')
          ]),
          new PlainText(' of')
        ]),
        new PlainText(' pizza')
      ]))
  })
})


describe('An unmatched revision deletion delimiter', () => {
  it('is preserved as plain text', () => {
    expect(Up.toDocument('I like pizza~~but I never eat it.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I like pizza~~but I never eat it.'),
      ]))
  })
})
