import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


context('The "nsfl" term is used by both inline NSFL conventions and NSFL blocks.', () => {
  const up = new Up({
    parsing: {
      terms: { nsfl: 'ruins ending' }
    }
  })

  context('For inline NSFL conventions, the term', () => {
    it('is used', () => {
      expect(up.parse('[ruins ending: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('is case-insensitive', () => {
      const lowercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.parse(lowercase)).to.deep.equal(up.parse(mixedCase))
    })

    it('is trimmed', () => {
      const document = Up.parse(
        '[RUINS ending: Ash fights Gary]', {
          terms: {
            nsfl: ' \t ruins ending \t '
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const document = Up.parse(
        '[*RUINS* ending: Ash fights Gary]', {
          terms: {
            nsfl: '*ruins* ending'
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      const document = Up.parse(
        '[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', {
          terms: {
            nsfl: ['look away', 'ruins ending']
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ]),
          new Up.InlineNsfl([
            new Up.PlainText('Ash fights Gary')
          ])
        ]))
    })
  })


  context('For NSFL blocks, the term', () => {
    specify('is used', () => {
      const markup = `
ruins ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Paragraph([
              new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.Paragraph([
              new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
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

      expect(up.parse(lowercase)).to.deep.equal(up.parse(mixedCase))
    })

    it('is trimmed', () => {
      const markup = `
RUINS ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const document = Up.parse(markup, {
        terms: {
          nsfl: ' \t ruins ending \t '
        }
      })

      expect(document).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Paragraph([
              new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.Paragraph([
              new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
            ])
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const markup = `
*RUINS* ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const document = Up.parse(markup, {
        terms: {
          nsfl: '*ruins* ending'
        }
      })

      expect(document).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Paragraph([
              new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.Paragraph([
              new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
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

      const document = Up.parse(markup, {
        terms: {
          nsfl: ['look away', 'ruins ending']
        }
      })

      expect(document).to.deep.equal(
        new Up.Document([
          new Up.NsflBlock([
            new Up.Paragraph([
              new Up.PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new Up.NsflBlock([
              new Up.Paragraph([
                new Up.PlainText('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
