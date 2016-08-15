import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'


context('The "spoiler" config term is used by both inline spoilers and spoiler blocks.', () => {
  const up = new Up({
    terms: { spoiler: 'ruins ending' }
  })

  context('For inline spoilers, the term', () => {
    it('is used', () => {
      expect(up.toDocument('[ruins ending: Ash fights Gary]', { terms: { spoiler: 'ruins ending' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('is case-insensitive, even when custom', () => {
      const lowercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.toDocument(lowercase)).to.be.eql(up.toDocument(mixedCase))
    })

    it('is trimmed', () => {
      expect(up.toDocument('[RUINS ending: Ash fights Gary]', { terms: { spoiler: ' \t ruins ending \t ' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      expect(up.toDocument('[*RUINS* ending: Ash fights Gary]', { terms: { spoiler: '*ruins* ending' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      expect(up.toDocument('[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', { terms: { spoiler: ['look away', 'ruins ending'] } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })
  })


  context('For spoiler blocks, the term', () => {
    specify('is used', () => {
      const markup = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toDocument(markup)).to.be.eql(
        new UpDocument([
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

    it('is case-insensitive, even when custom', () => {
      const lowercase = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const mixedCase = `
ruINs eNDiNg:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toDocument(lowercase)).to.be.eql(up.toDocument(mixedCase))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const markup = `
*RUINS* ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { spoiler: '*ruins* ending' } })).to.be.eql(
        new UpDocument([
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

    it('can contain multiple variations', () => {
      const markup = `
LOOK AWAY:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  RUINS ENDING:
    
    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { spoiler: ['look away', 'ruins ending'] } })).to.be.eql(
        new UpDocument([
          new SpoilerBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new SpoilerBlockNode([
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
