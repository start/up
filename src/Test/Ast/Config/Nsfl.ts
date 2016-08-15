import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


context('The "nsfl" config term is used by both inline NSFL conventions and NSFL blocks.', () => {
  const up = new Up({
    terms: { nsfl: 'ruins ending' }
  })

  context('For inline NSFL conventions, the term', () => {
    it('is used', () => {
      expect(up.toDocument('[ruins ending: Ash fights Gary]', { terms: { nsfl: 'ruins ending' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('is case-insensitive, even when custom', () => {
      const lowercase = '[ruins ending: Ash fights Gary]'
      const mixedCase = '[ruINs eNDiNg: Ash fights Gary]'

      expect(up.toDocument(lowercase)).to.be.eql(up.toDocument(mixedCase))
    })

    it('ignores inline conventions and regular expression rules', () => {
      expect(up.toDocument('[RUINS ending: Ash fights Gary]', { terms: { nsfl: ' \t ruins ending \t ' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('ignores inline conventions and regular expression rules', () => {
      expect(up.toDocument('[*RUINS* ending: Ash fights Gary]', { terms: { nsfl: '*ruins* ending' } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    it('can have multiple variations', () => {
      expect(up.toDocument('[RUINS ENDING: Ash fights Gary][LOOK AWAY: Ash fights Gary]', { terms: { nsfl: ['look away', 'ruins ending'] } })).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ]),
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
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

      expect(up.toDocument(markup)).to.be.eql(
        new UpDocument([
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

    it('is trimmed', () => {
      const markup = `
RUINS ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { nsfl: ' \t ruins ending \t ' } })).to.be.eql(
        new UpDocument([
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

    it('ignores inline conventions and regular expression rules', () => {
      const markup = `
*RUINS* ending:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { nsfl: '*ruins* ending' } })).to.be.eql(
        new UpDocument([
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

    it('can contain multiple variations', () => {
      const markup = `
LOOK AWAY:

  With a very sad song playing in the background, Ash said goodbye to Pikachu.
  
  RUINS ENDING:
    
    Luckily, Pikachu ultimately decided to stay.`

      expect(Up.toDocument(markup, { terms: { nsfl: ['look away', 'ruins ending'] } })).to.be.eql(
        new UpDocument([
          new NsflBlockNode([
            new ParagraphNode([
              new PlainTextNode('With a very sad song playing in the background, Ash said goodbye to Pikachu.')
            ]),
            new NsflBlockNode([
              new ParagraphNode([
                new PlainTextNode('Luckily, Pikachu ultimately decided to stay.')
              ])
            ])
          ])
        ]))
    })
  })
})
