import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'


context('The "spoiler" config term is used by both inline spoilers and spoiler blocks.', () => {
  context('For inline spoilers:', () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    specify('The term is used', () => {
      expect(up.toAst('[ruins ending: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('The term is case-insensitive, even when custom', () => {
      const uppercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
    })
  })
})
