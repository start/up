import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('Double asterisks followed by whitespace with matching double asterisks touching the end of a word', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.toDocument('I believe** my spelling** was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe** my spelling** was wrong.')
      ]))
  })
})


describe('Double asterisks touching the beginning of a word with matching double asterisks preceded by whitespace', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.toDocument('I **believe my **spelling was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I **believe my **spelling was wrong.')
      ]))
  })
})


describe('Matching double asterisks each surrounded by whitespace', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.toDocument('I believe ** will win the primary in ** easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe ** will win the primary in ** easily.')
      ]))
  })
})
