import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by 2 asterisks', () => {
  it('is put inside a stress node', () => {
    expect(Up.parse('Hello, **world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Stress([
          new Up.Text('world')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Stressed text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, **`world`**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Stress([
          new Up.InlineCode('world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can contain further stressed text', () => {
    expect(Up.parse('Hello, **my **little** world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Stress([
          new Up.Text('my '),
          new Up.Stress([
            new Up.Text('little')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can contain emphasized text', () => {
    expect(Up.parse('Hello, **my *little* world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Stress([
          new Up.Text('my '),
          new Up.Emphasis([
            new Up.Text('little')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })})
