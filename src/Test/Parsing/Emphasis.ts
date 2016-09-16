import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


describe('Text surrounded by single asterisks', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.parse('Hello, *world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Emphasis([
          new Up.Text('world')
        ]),
        new Up.Text('!!')
      ]))
  })
})


describe('Emphasized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, *`world`*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Emphasis([
          new Up.InlineCode('world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can contain further emphasized text', () => {
    expect(Up.parse('Hello, *my *little* world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Emphasis([
          new Up.Text('my '),
          new Up.Emphasis([
            new Up.Text('little')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.parse('Hello, *my **little** world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Emphasis([
          new Up.Text('my '),
          new Up.Stress([
            new Up.Text('little')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Double asterisks followed by two separate single closing asterisks', () => {
  it('produces 2 nested emphasis nodes', () => {
    expect(Up.parse('**Warning:* never feed this tarantula*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Text('Warning:'),
          ]),
          new Up.Text(' never feed this tarantula')
        ])
      ]))
  })
})


describe('Text separated from (otherwise surrounding) single asterisks by whitespace', () => {
  it('is not put inside an emphasis node', () => {
    expect(Up.parse('Birdie Sanders * won * Wisconsin')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Birdie Sanders * won * Wisconsin'),
      ]))
  })
})
