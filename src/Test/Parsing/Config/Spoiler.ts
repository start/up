import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { SpoilerBlock } from '../../../SyntaxNodes/SpoilerBlock'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'


context('The "spoiler" term is used by both inline spoilers and spoiler blocks.', () => {
  const up = new Up({
    parsing: {
      terms: { spoiler: 'ruins ending' }
    }
  })

  context('For inline spoilers, the term', () => {
    it('is used', () => {
      expect(up.parse('[ruins ending: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
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
            spoiler: ' \t ruins ending \t '
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      const document = Up.parse(
        '[*RUINS* ending: Ash fights Gary]', {
          terms: {
            spoiler: '*ruins* ending'
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      const document = Up.parse(
        '[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', {
          terms: {
            spoiler: ['look away', 'ruins ending']
          }
        })

      expect(document).to.deep.equal(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ]),
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
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

      expect(up.parse(markup)).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
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

      expect(up.parse(lowercase)).to.deep.equal(up.parse(mixedCase))
    })

    it('is trimmed', () => {
      const markup = `
RUINS ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      const document = Up.parse(markup, {
        terms: {
          spoiler: ' \t ruins ending \t '
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
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

      const document = Up.parse(markup, {
        terms: {
          spoiler: '*ruins* ending'
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
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

      const document = Up.parse(markup, {
        terms: {
          spoiler: ['look away', 'ruins ending']
        }
      })

      expect(document).to.deep.equal(
        new UpDocument([
          new SpoilerBlock([
            new Paragraph([
              new PlainText('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new SpoilerBlock([
              new Paragraph([
                new PlainText('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
