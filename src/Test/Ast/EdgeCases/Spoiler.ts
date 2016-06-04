import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'


describe('A spoiler convention', () => {
  it('can be the first convention inside another spoiler convention using same bracket type', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: [SPOILER: Gary] fights you].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new SpoilerNode([
          new SpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode(' fights you'),
        ]),
        new PlainTextNode('.')
      ]))
  })
})
