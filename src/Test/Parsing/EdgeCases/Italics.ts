import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Italic } from '../../../SyntaxNodes/Italic'


describe('An unmatched underscore', () => {
  it('does not create an italic node', () => {
    expect(Up.toDocument('Hello, _world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, _world!')
      ]))
  })

  it('does not create an italic node, even when following 2 matching underscores', () => {
    expect(Up.toDocument('_Hello_, _world!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Hello'),
        ]),
        new PlainText(', _world!')
      ]))
  })
})


describe('Matching single underscores each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.toDocument('I believe _ will win the primary in _ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe _ will win the primary in _ easily.')
      ]))
  })
})


describe('An underscore followed by whitespace with a matching underscore touching the end of a word', () => {
  it('does not produce an italic node and is preserved as plain text', () => {
    expect(Up.toDocument('I believe_ my spelling_ was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe_ my spelling_ was wrong.')
      ]))
  })
})


describe('An underscore touching the beginning of a word with a matching underscore preceded by whitespace', () => {
  it('does not produce an italic node and is preserved as plain text', () => {
    expect(Up.toDocument('I _believe my _spelling was wrong.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I _believe my _spelling was wrong.')
      ]))
  })
})
