import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Double asterisks followed by whitespace with matching double asterisks touching the end of a word', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.parse('I believe** my spelling** was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe** my spelling** was wrong.')
      ]))
  })
})


describe('Double asterisks touching the beginning of a word with matching double asterisks preceded by whitespace', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.parse('I **believe my **spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I **believe my **spelling was wrong.')
      ]))
  })
})


describe('Matching double asterisks each surrounded by whitespace', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.parse('I believe ** will win the primary in ** easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe ** will win the primary in ** easily.')
      ]))
  })
})
