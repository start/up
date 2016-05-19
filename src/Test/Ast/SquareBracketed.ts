import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'


describe('Text surrounded by square brackets', () => {
  it('is put inside a square bracketed node with the square brackets preserved as plain text', () => {
    expect(Up.toAst('I like [certain types of] pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketedNode([
          new PlainTextNode('[certain types of]')
        ]),
        new PlainTextNode(' pizza')
      ]))
  })
})


describe('Square bracketed text', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst('I like [certain *types* of] pizza')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I like '),
        new SquareBracketedNode([
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
