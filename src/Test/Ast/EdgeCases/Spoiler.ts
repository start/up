import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { SquareBracketedNode } from '../../../SyntaxNodes/SquareBracketedNode'


describe('A spoiler convention', () => {
  it('can be the first convention inside another spoiler convention using same bracket type', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: [SPOILER: Gary] fights you].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode(' fights you')
        ]),
        new PlainTextNode('.')
      ]))
  })

  it('can directly follow square bracketed text', () => {
    expect(Up.toAst('After you beat the Elite Four [in Pokemon Red/Blue/Yellow][SPOILER: you fight Gary].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four '),
        new SquareBracketedNode([
          new PlainTextNode('[in Pokemon Red/Blue/Yellow]')
        ]),
        new SpoilerNode([
          new PlainTextNode('you fight Gary')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
