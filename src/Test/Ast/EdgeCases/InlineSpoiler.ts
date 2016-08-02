import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'


describe('An inline spoiler convention', () => {
  it('can be the first convention inside another spoiler convention using same bracket type', () => {
    expect(Up.toAst('After you beat the Elite Four, [SPOILER: [SPOILER: Gary] fights you].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('After you beat the Elite Four, '),
        new InlineSpoilerNode([
          new InlineSpoilerNode([
            new PlainTextNode('Gary')
          ]),
          new PlainTextNode(' fights you')
        ]),
        new PlainTextNode('.')
      ]))
  })
})
