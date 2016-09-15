import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { InlineCode } from '../../SyntaxNodes/InlineCode'


describe('Text surrounded by single asterisks', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.parse('Hello, *world*!!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.PlainText('world')
        ]),
        new Up.PlainText('!!')
      ]))
  })
})


describe('Emphasized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.parse('Hello, *`world`*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.InlineCode('world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain further emphasized text', () => {
    expect(Up.parse('Hello, *my *little* world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.PlainText('my '),
          new Up.Emphasis([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.parse('Hello, *my **little** world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.PlainText('my '),
          new Up.Stress([
            new Up.PlainText('little')
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Double asterisks followed by two separate single closing asterisks', () => {
  it('produces 2 nested emphasis nodes', () => {
    expect(Up.parse('**Warning:* never feed this tarantula*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText('Warning:'),
          ]),
          new Up.PlainText(' never feed this tarantula')
        ])
      ]))
  })
})


describe('Text separated from (otherwise surrounding) single asterisks by whitespace', () => {
  it('is not put inside an emphasis node', () => {
    expect(Up.parse('Birdie Sanders * won * Wisconsin')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Birdie Sanders * won * Wisconsin'),
      ]))
  })
})
