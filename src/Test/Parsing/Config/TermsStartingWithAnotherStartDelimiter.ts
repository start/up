import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


context("When the custom term for an inline convention starts with a caret, the fact that it happens to start with the start delimiter for footnotes doesn't affect anything.", () => {
  context("When the custom term for 'spoiler' starts with a caret", () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          revealable: '^lookaway^'
        }
      }
    })

    specify('inline spoilers can be produced using the term', () => {
      expect(up.parse('[^lookaway^: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineSpoiler([
            new Up.Text('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline spoiler start delimiter is treated as plain text', () => {
      expect(up.parse('[^lookaway^: Not finished typi')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'nsfw' starts with a caret", () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          nsfw: '^lookaway^'
        }
      }
    })

    specify('inline NSFW conventions can be produced using the term', () => {
      expect(up.parse('[^lookaway^: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfw([
            new Up.Text('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFW start delimiter is treated as plain text', () => {
      expect(up.parse('[^lookaway^: Not finished typi')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'nsfl' starts with a caret", () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          nsfl: '^lookaway^'
        }
      }
    })

    specify('inline NSFL conventions can be produced using the term', () => {
      expect(up.parse('[^lookaway^: Ash fights Gary]')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.InlineNsfl([
            new Up.Text('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFL start delimiter is treated as plain text', () => {
      expect(up.parse('[^lookaway^: Not finished typi')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'audio' starts with a caret", () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          audio: '^listen^'
        }
      }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.parse('[^listen^: Ash fights Gary](example.com/audio.ogg)')).to.deep.equal(
        new Up.Document([
          new Up.Audio('Ash fights Gary', 'https://example.com/audio.ogg')
        ]))
    })

    specify('an unmatched audio start delimiter is treated as plain text', () => {
      expect(up.parse('[^listen^: Ash fights Ga')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('[^listen^: Ash fights Ga')
        ]))
    })

    specify('a would-be audio convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new Up.Footnote([
        new Up.Text('listen^: I guess this means '),
        new Up.InlineQuote([
          new Up.Text('listen up')
        ]),
        new Up.Text('?')
      ], { referenceNumber: 1 })

      expect(up.parse('[^listen^: I guess this means "listen up"?]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  context("When the custom term for 'image' starts with a caret", () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          image: '^look^'
        }
      }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.parse('[^look^: Ash fights Gary](example.com/image.svg)')).to.deep.equal(
        new Up.Document([
          new Up.Image('Ash fights Gary', 'https://example.com/image.svg')
        ]))
    })

    specify('an unmatched image start delimiter is treated as plain text', () => {
      expect(up.parse('[^look^: Ash fights Ga')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('[^look^: Ash fights Ga')
        ]))
    })

    specify('a would-be image convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new Up.Footnote([
        new Up.Text('look^: I guess this means '),
        new Up.InlineQuote([
          new Up.Text('look up')
        ]),
        new Up.Text('?')
      ], { referenceNumber: 1 })

      expect(up.parse('[^look^: I guess this means "look up"?]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })


  context("When the custom term for 'video' starts with a caret", () => {
    const up = new Up.Transformer({
      parsing: {
        terms: {
          video: '^watch^'
        }
      }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.parse('[^watch^: Ash fights Gary](example.com/video.webm)')).to.deep.equal(
        new Up.Document([
          new Up.Video('Ash fights Gary', 'https://example.com/video.webm')
        ]))
    })

    specify('an unmatched image start delimiter is treated as plain text', () => {
      expect(up.parse('[^watch^: Ash fights Ga')).to.deep.equal(
        insideDocumentAndParagraph([
          new Up.Text('[^watch^: Ash fights Ga')
        ]))
    })

    specify('a would-be image convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new Up.Footnote([
        new Up.Text('watch^: I guess this means '),
        new Up.InlineQuote([
          new Up.Text('watch up')
        ]),
        new Up.Text('?')
      ], { referenceNumber: 1 })

      expect(up.parse('[^watch^: I guess this means "watch up"?]')).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([footnote]),
          new Up.FootnoteBlock([footnote])
        ]))
    })
  })
})
