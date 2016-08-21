import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'
import { InlineCode } from '../../SyntaxNodes/InlineCode'

describe('Text surrounded by single asterisks', () => {
  it('is put inside an emphasis node', () => {
    expect(Up.toDocument('Hello, *world*!!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new PlainText('world')
        ]),
        new PlainText('!!')
      ]))
  })
})

describe('Text separated from surrounding asterisks by whitespace', () => {
  it('is not put inside an emphasis node', () => {
    expect(Up.toDocument('Birdie Sanders * won * Wisconsin')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Birdie Sanders * won * Wisconsin'),
      ]))
  })
})


describe('Emphasized text', () => {
  it('is evaluated for inline conventions', () => {
    expect(Up.toDocument('Hello, *`world`*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new InlineCode('world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain further emphasized text', () => {
    expect(Up.toDocument('Hello, *my *little* world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new PlainText('my '),
          new Emphasis([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can contain stressed text', () => {
    expect(Up.toDocument('Hello, *my **little** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new PlainText('my '),
          new Stress([
            new PlainText('little')
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })
})

describe('Double asterisks followed by two separate single closing asterisks', () => {
  it('produces 2 nested emphasis nodes', () => {
    expect(Up.toDocument('**Warning:* never feed this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new Emphasis([
            new PlainText('Warning:'),
          ]),
          new PlainText(' never feed this tarantula')
        ])
      ]))
  })
})
