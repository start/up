import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('Double underscores followed by whitespace with matching double underscores touching the end of a word', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.toDocument('I believe__ my spelling__ was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe__ my spelling__ was wrong.')
      ]))
  })
})


describe('Double underscores touching the beginning of a word with matching double underscores preceded by whitespace', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.toDocument('I __believe my __spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I __believe my __spelling was wrong.')
      ]))
  })
})


describe('Matching double underscores each surrounded by whitespace', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.toDocument('I believe __ will win the primary in __ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe __ will win the primary in __ easily.')
      ]))
  })
})
