import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'


describe('Text surrounded by 2 tildes', () => {
  it('is put inside a revision deletion node', () => {
    expect(Up.toDocument('I like ~~certain types of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain types of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('A revision deletion', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toDocument('I like ~~certain *types* of~~ pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new RevisionDeletionNode([
          new PlainTextNode('certain '),
          new Emphasis([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('An unmatched revision deletion delimiter', () => {
  it('is preserved as plain text', () => {
    expect(Up.toDocument('I like pizza~~but I never eat it.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like pizza~~but I never eat it.'),
      ]))
  })
})
