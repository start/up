import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'


describe('An unmatched asterisk', () => {
  it('does not create an emphasis node', () => {
    expect(Up.toDocument('Hello, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, *world!')
      ]))
  })

  it('does not create an emphasis node, even when following 2 matching asterisks', () => {
    expect(Up.toDocument('*Hello*, *world!')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Hello'),
        ]),
        new PlainText(', *world!')
      ]))
  })
})


describe('Matching single asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.toDocument('I believe * will win the primary in * easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I believe * will win the primary in * easily.')
      ]))
  })
})


describe('An asterisk followed by whitespace with a matching asterisk touching the end of a word', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.toDocument('I believe* my spelling* was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I believe* my spelling* was wrong.')
      ]))
  })
})


describe('An asterisk touching the beginning of a word with a matching asterisk preceded by whitespace', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.toDocument('I *believe my *spelling was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I *believe my *spelling was wrong.')
      ]))
  })
})
