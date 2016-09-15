import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by single underscores', () => {
  it('is put inside an italic node', () => {
    expect(Up.parse('Hello, _world_!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Italic([
          new Up.PlainText('world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('Italicized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, _`world`_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Italic([
          new Up.InlineCode('world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain further italicized text', () => {
    expect(Up.parse('Hello, _my _little_ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Italic([
          new Up.PlainText('my '),
          new Up.Italic([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.parse('Hello, _my __little__ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Italic([
          new Up.PlainText('my '),
          new Up.Bold([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Double underscores followed by two separate single closing underscores', () => {
  it('produces 2 nested italic nodes', () => {
    expect(Up.parse('__Warning:_ never feed this tarantula_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Italic([
            new Up.PlainText('Warning:'),
          ]),
          new Up.PlainText(' never feed this tarantula')
        ])
      ]))
  })
})


describe('Text separated from (otherwise surrounding) underscores by whitespace', () => {
  it('is not put inside an italic node', () => {
    expect(Up.parse('Birdie Sanders _ won _ Wisconsin')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Birdie Sanders _ won _ Wisconsin'),
      ]))
  })
})
