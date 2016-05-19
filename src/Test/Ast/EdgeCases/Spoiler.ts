import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'

describe('A spoiler with " -> " inside', () => {
  it('is not transformed into a link', () => {
    expect(Up.toAst('[SPOILER: Goten + Trunks -> Gotenks]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Goten + Trunks -> Gotenks')
        ]),
      ]))
  })
})


describe('A spoiler convention', () => {
  it('can contain "square bracketed" text', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: you fight [and beat] Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new PlainTextNode('you fight '),
          new SquareBracketedNode([
            new PlainTextNode('[and beat]')
          ]),
          new PlainTextNode(' Gary')          
        ]),
        new PlainTextNode('.')
      ]))
  })
})
