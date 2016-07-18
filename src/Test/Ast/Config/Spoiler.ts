import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'
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
      const lowercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
    })
  })


  context('For spoiler blocks:', () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    specify('The term is used', () => {
      it('produces an inline spoiler block node', () => {
        const text = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

        expect(Up.toAst(text)).to.be.eql(
          new DocumentNode([
            new SpoilerBlockNode([
              new ParagraphNode([
                new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
              ]),
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ]))
      })

      expect(up.toAst('[ruins ending: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('The term is case-insensitive, even when custom', () => {
        const lowercase = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

        const mixedCase = `
ruINs eNDiNg:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
    })
  })
})
