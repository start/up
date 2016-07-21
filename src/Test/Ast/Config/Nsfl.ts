import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


context('The "nsfl" config term is used by both inline NSFL conventions and NSFL blocks.', () => {
  context('For inline NSFL conventions:', () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: 'gross' }
      }
    })

    specify('The term is used', () => {
      expect(up.toAst('[gross: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('The term is case-insensitive, even when custom', () => {
      const lowercase = '[gross: Ash fights Gary]'
      const mixedCase = '[gRoSs: Ash fights Gary]'

      expect(up.toAst(lowercase)).to.be.eql(up.toAst(mixedCase))
    })
  })


  context('For NSFL blocks:', () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: 'gross' }
      }
    })

    specify('The term is used', () => {
      const text = `
gross:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toAst(text)).to.be.eql(
        new DocumentNode([
          new NsflBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new ParagraphNode([
              new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    specify('The term is case-insensitive, even when custom', () => {
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
