import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('Double underscores followed by whitespace with matching double underscores touching the end of a word', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.toDocument('I believe__ my spelling__ was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe__ my spelling__ was wrong.')
      ]))
  })
})


describe('Double underscores touching the beginning of a word with matching double underscores preceded by whitespace', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.toDocument('I __believe my __spelling was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I __believe my __spelling was wrong.')
      ]))
  })
})


describe('Matching double underscores each surrounded by whitespace', () => {
  it('do not produce a bold node and are preserved as plain text', () => {
    expect(Up.toDocument('I believe __ will win the primary in __ easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe __ will win the primary in __ easily.')
      ]))
  })
})
