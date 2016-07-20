import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'


context('The "nsfw" config term is used by both inline NSFW conventions and NSFW blocks.', () => {
  context('For inline NSFW conventions:', () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'gross' }
      }
    })

    specify('The term is used', () => {
      expect(up.toAst('[gross: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('The term is case-insensitive, even when custom', () => {
      const lowercase = '[gross: Ash fights Gary]'
      const mixedCase = '[gRoSs: Ash fights Gary]'

      expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
    })
  })


  context('For NSFW blocks:', () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'gross' }
      }
    })

    specify('The term is used', () => {
      it('produces an inline spoiler block node', () => {
        const text = `
gross:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

        expect(Up.toAst(text)).to.be.eql(
          new DocumentNode([
            new NsfwBlockNode([
              new ParagraphNode([
                new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
              ]),
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ]))
      })

      expect(up.toAst('[gross: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('The term is case-insensitive, even when custom', () => {
        const lowercase = `
gross:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

        const mixedCase = `
gRosS:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
    })
  })
})
