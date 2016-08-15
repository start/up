import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'


context('The "nsfw" config term is used by both inline NSFW conventions and NSFW blocks.', () => {
  const up = new Up({
    terms: { nsfw: 'ruins ending' }
  })

  context('For inline NSFW conventions, the term', () => {
    it('is used', () => {
      expect(up.toDocument('[ruins ending: Ash fights Gary]', { terms: { nsfw: 'ruins ending' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
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
      expect(up.toDocument('[RUINS ending: Ash fights Gary]', { terms: { nsfw: ' \t ruins ending \t ' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      expect(up.toDocument('[*RUINS* ending: Ash fights Gary]', { terms: { nsfw: '*ruins* ending' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      expect(up.toDocument('[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', { terms: { nsfw: ['look away', 'ruins ending'] } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })
  })


  context('For NSFW blocks, the term', () => {
    specify('is used', () => {
      const markup = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toDocument(markup)).to.be.eql(
        new UpDocument([
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
RUINS ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { nsfw: ' \t ruins ending \t ' } })).to.be.eql(
        new UpDocument([
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

    it('ignores inline conventions and regular expression rules', () => {
      const markup = `
*RUINS* ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { nsfw: '*ruins* ending' } })).to.be.eql(
        new UpDocument([
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

    it('can contain multiple variations', () => {
      const markup = `
LOOK AWAY:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  RUINS ENDING:
    
    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { nsfw: ['look away', 'ruins ending'] } })).to.be.eql(
        new UpDocument([
          new NsfwBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new NsfwBlockNode([
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
