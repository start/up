import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { NsflBlock } from '../../../SyntaxNodes/NsflBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'


context('The "nsfl" config term is used by both inline NSFL conventions and NSFL blocks.', () => {
  const up = new Up({
    terms: {
      markup: { nsfl: 'ruins ending' }
    }
  })

  context('For inline NSFL conventions, the config term', () => {
    it('is used', () => {
      expect(up.parseDocument('[ruins ending: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('is case-insensitive', () => {
      const lowercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.parseDocument(lowercase)).to.deep.equal(up.parseDocument(mixedCase))
    })

    it('is trimmed', () => {
      const document = Up.parseDocument(
        '[RUINS ending: Ash fights Gary]', {
          terms: {
            markup: { nsfl: ' \t ruins ending \t ' }
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const document = Up.parseDocument(
        '[*RUINS* ending: Ash fights Gary]', {
          terms: {
            markup: { nsfl: '*ruins* ending' }
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      const document = Up.parseDocument(
        '[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', {
          terms: {
            markup: { nsfl: ['look away', 'ruins ending'] }
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ]),
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })
  })


  context('For NSFL blocks, the config term', () => {
    specify('is used', () => {
      const markup = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.parseDocument(markup)).to.deep.equal(
        new UpDocument([
          new NsflBlock([
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

      expect(up.parseDocument(lowercase)).to.deep.equal(up.parseDocument(mixedCase))
    })

    it('is trimmed', () => {
      const markup = `
RUINS ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const document = Up.parseDocument(markup, {
        terms: {
          markup: { nsfl: ' \t ruins ending \t ' }
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new NsflBlock([
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

      const document = Up.parseDocument(markup, {
        terms: {
          markup: { nsfl: '*ruins* ending' }
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new NsflBlock([
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

      const document = Up.parseDocument(markup, {
        terms: {
          markup: { nsfl: ['look away', 'ruins ending'] }
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new NsflBlock([
            new Paragraph([
              new PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new NsflBlock([
              new Paragraph([
                new PlainText('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
