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