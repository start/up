import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { UpDocument } from'../../../SyntaxNodes/UpDocument'
import { Paragraph } from'../../../SyntaxNodes/Paragraph'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from'../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfl } from'../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from'../../../SyntaxNodes/InlineNsfw'
import { Highlight } from'../../../SyntaxNodes/Highlight'
import { Footnote } from'../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from'../../../SyntaxNodes/FootnoteBlock'



context('Up offers no special support for conventions that overlap themselves. When conventions overlap themselves, the overlapped portion is simply treated as nested.', () => {
  specify('This is true for highlights, which have no special continuity priority', () => {
    expect(Up.toDocument('This [highlight: does (highlight: not] make) much sense.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Highlight([
          new PlainText('does '),
          new Highlight([
            new PlainText('not')
          ]),
          new PlainText(' make')
        ]),
        new PlainText(' much sense.')
      ]))
  })


  context('This is true for conventions with continuity priority:', () => {
    specify('Inline spoilers', () => {
      expect(Up.toDocument('This [SPOILER: does (SPOILER: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineSpoiler([
            new PlainText('does '),
            new InlineSpoiler([
              new PlainText('not')
            ]),
            new PlainText(' make')
          ]),
          new PlainText(' much sense.')
        ]))
    })

    specify('Inline NSFW', () => {
      expect(Up.toDocument('This [NSFW: does (NSFW: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineNsfw([
            new PlainText('does '),
            new InlineNsfw([
              new PlainText('not')
            ]),
            new PlainText(' make')
          ]),
          new PlainText(' much sense.')
        ]))
    })

    specify('Inline NSFL', () => {
      expect(Up.toDocument('This [NSFL: does (NSFL: not] make) much sense.')).to.deep.equal(
        insideDocumentAndParagraph([
          new PlainText('This '),
          new InlineNsfl([
            new PlainText('does '),
            new InlineNsfl([
              new PlainText('not')
            ]),
            new PlainText(' make')
          ]),
          new PlainText(' much sense.')
        ]))
    })

    specify('Footnotes', () => {
      const innerFootnote = new Footnote([
        new PlainText('not')
      ], { referenceNumber: 2 })

      const outerFootnote = new Footnote([
        new PlainText('does'),
        innerFootnote,
        new PlainText('make')
      ], { referenceNumber: 1 })

      expect(Up.toDocument('This [^ does (^ not] make) much sense.')).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new PlainText('This'),
            outerFootnote,
            new PlainText(' much sense.')
          ]),
          new FootnoteBlock([outerFootnote, innerFootnote])
        ]))
    })
  })
})
