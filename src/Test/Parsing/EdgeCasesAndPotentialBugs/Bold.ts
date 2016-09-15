import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Double underscores followed by whitespace with matching double underscores touching the end of a word', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.parse('I believe__ my spelling__ was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I believe__ my spelling__ was wrong.')
      ]))
  })
})


describe('Double underscores touching the beginning of a word with matching double underscores preceded by whitespace', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.parse('I __believe my __spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I __believe my __spelling was wrong.')
      ]))
  })
})


describe('Matching double underscores each surrounded by whitespace', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.parse('I believe __ will win the primary in __ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I believe __ will win the primary in __ easily.')
      ]))
  })
})
