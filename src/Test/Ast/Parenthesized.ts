import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'


describe('Text surrounded by parentheses', () => {
  it('is put inside a parenthesized node with the parentheses preserved as plain text', () => {
    expect(Up.toAst('I like (certain types of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain types of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Parenthesized text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like (certain *types* of) pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('(certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of)')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Two left square brackets followed by a single right square bracket', () => {
  it('produces bracketed text starting from the second left square bracket', () => {
    expect(Up.toAst(':( I like [certain *types* of] pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode(':( I like '),
        new ParenthesizedNode([
          new PlainTextNode('[certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of]')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('A left square brackets followed by two right square brackets', () => {
  it('produces bracketed text ending with the first right square bracket', () => {
    expect(Up.toAst('I like [certain *types* of] pizza :)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new ParenthesizedNode([
          new PlainTextNode('[certain '),
          new EmphasisNode([
            new PlainTextNode('types')
          ]),
          new PlainTextNode(' of]')
        ]),
        new PlainTextNode(' pizza :)')
      ]))
  })
})
