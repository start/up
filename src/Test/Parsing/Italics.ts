import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by single underscores', () => {
  it('is put inside an italics node', () => {
    expect(Up.parse('Hello, _world_!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Italics([
          new Up.Text('world')
        ]),
        new Up.Text('!!')
      ]))
  })
})


describe('Italicized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, _`world`_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Italics([
          new Up.InlineCode('world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can contain further italicized text', () => {
    expect(Up.parse('Hello, _my _little_ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Italics([
          new Up.Text('my '),
          new Up.Italics([
            new Up.Text('little')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.parse('Hello, _my __little__ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Italics([
          new Up.Text('my '),
          new Up.Bold([
            new Up.Text('little')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Double underscores followed by two separate single closing underscores', () => {
  it('produces 2 nested italics nodes', () => {
    expect(Up.parse('__Warning:_ never feed this tarantula_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italics([
          new Up.Italics([
            new Up.Text('Warning:'),
          ]),
          new Up.Text(' never feed this tarantula')
        ])
      ]))
  })
})


describe('Text separated from (otherwise surrounding) underscores by whitespace', () => {
  it('is not put inside an italics node', () => {
    expect(Up.parse('Birdie Sanders _ won _ Wisconsin')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Birdie Sanders _ won _ Wisconsin'),
      ]))
  })
})
