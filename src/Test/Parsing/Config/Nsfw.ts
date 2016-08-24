import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { NsfwBlock } from '../../../SyntaxNodes/NsfwBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'


context('The "nsfw" config term is used by both inline NSFW conventions and NSFW blocks.', () => {
  const up = new Up({
    terms: {
      markup: { nsfw: 'ruins ending' }
    }
  })

  context('For inline NSFW conventions, the config term', () => {
    it('is used', () => {
      expect(up.toDocument('[ruins ending: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('is case-insensitive', () => {
      const lowercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.toDocument(lowercase)).to.deep.equal(up.toDocument(mixedCase))
    })

    it('is trimmed', () => {
      const document = Up.toDocument(
        '[RUINS ending: Ash fights Gary]', {
          terms: {
            markup: { nsfw: ' \t ruins ending \t ' }
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const document = Up.toDocument(
        '[*RUINS* ending: Ash fights Gary]', {
          terms: {
            markup: { nsfw: '*ruins* ending' }
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      const document = Up.toDocument(
        '[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', {
          terms: {
            markup: { nsfw: ['look away', 'ruins ending'] }
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ]),
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })
  })


  context('For NSFW blocks, the config term', () => {
    specify('is used', () => {
      const markup = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new Paragraph([
              new PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Paragraph([
              new PlainText('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    it('is case-insensitive', () => {
      const lowercase = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const mixedCase = `
ruINs eNDiNg:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.toDocument(lowercase)).to.deep.equal(up.toDocument(mixedCase))
    })

    it('is trimmed', () => {
      const markup = `
RUINS ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const document = Up.toDocument(markup, {
        terms: {
          markup: { nsfw: ' \t ruins ending \t ' }
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new Paragraph([
              new PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Paragraph([
              new PlainText('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const markup = `
*RUINS* ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const document = Up.toDocument(markup, {
        terms: {
          markup: { nsfw: '*ruins* ending' }
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new Paragraph([
              new PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Paragraph([
              new PlainText('Luckily, Pikachu ultimately decided to stay.')
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

      const document = Up.toDocument(markup, {
        terms: {
          markup: { nsfw: ['look away', 'ruins ending'] }
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new NsfwBlock([
            new Paragraph([
              new PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new NsfwBlock([
              new Paragraph([
                new PlainText('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
