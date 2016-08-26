import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by single underscores', () => {
  it('is put inside an italic node', () => {
    expect(Up.toDocument('Hello, _world_!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Italic([
          new PlainText('world')
        ]),
        new PlainText('!!')
      ]))
  })
})


describe('Italicized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, _`world`_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Italic([
          new InlineCode('world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain further italicized text', () => {
    expect(Up.toDocument('Hello, _my _little_ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Italic([
          new PlainText('my '),
          new Italic([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.toDocument('Hello, _my __little__ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Italic([
          new PlainText('my '),
          new Bold([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Double underscores followed by two separate single closing underscores', () => {
  it('produces 2 nested italic nodes', () => {
    expect(Up.toDocument('__Warning:_ never feed this tarantula_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new Italic([
            new PlainText('Warning:'),
          ]),
          new PlainText(' never feed this tarantula')
        ])
      ]))
  })
})


describe('Text separated from (otherwise surrounding) underscores by whitespace', () => {
  it('is not put inside an italic node', () => {
    expect(Up.toDocument('Birdie Sanders _ won _ Wisconsin')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Birdie Sanders _ won _ Wisconsin'),
      ]))
  })
})
