import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Audio } from '../../../SyntaxNodes/Audio'
import { Image } from '../../../SyntaxNodes/Image'
import { Video } from '../../../SyntaxNodes/Video'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


context("When the custom term for an inline convention starts with a caret, the fact that it happens to start with the start delimiter for footnotes doesn't affect anything.", () => {
  context("When the custom term for 'spoiler' starts with a caret", () => {
    const up = new Up({
      terms: { spoiler: '^lookaway^' }
    })

    specify('inline spoilers can be produced using the term', () => {
      expect(up.toDocument('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoiler([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline spoiler start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'nsfw' starts with a caret", () => {
    const up = new Up({
      terms: { nsfw: '^lookaway^' }
    })

    specify('inline NSFW conventions can be produced using the term', () => {
      expect(up.toDocument('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfw([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFW start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'nsfl' starts with a caret", () => {
    const up = new Up({
      terms: { nsfl: '^lookaway^' }
    })

    specify('inline NSFL conventions can be produced using the term', () => {
      expect(up.toDocument('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfl([
            new PlainText('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFL start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'audio' starts with a caret", () => {
    const up = new Up({
      terms: { audio: '^listen^' }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.toDocument('[^listen^: Ash fights Gary](example.com/audio.ogg)')).to.be.eql(
        new UpDocument([
          new Audio('Ash fights Gary', 'https://example.com/audio.ogg')
        ]))
    })

    specify('an unmatched audio start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^listen^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('[^listen^: Ash fights Ga')
        ]))
    })

    specify('a would-be audio convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new Footnote([
        new PlainText('listen^: I guess this means "listen up"?')
      ], 1)

      expect(up.toDocument('[^listen^: I guess this means "listen up"?]')).to.be.eql(
        new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  context("When the custom term for 'image' starts with a caret", () => {
    const up = new Up({
      terms: { image: '^look^' }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.toDocument('[^look^: Ash fights Gary](example.com/image.svg)')).to.be.eql(
        new UpDocument([
          new Image('Ash fights Gary', 'https://example.com/image.svg')
        ]))
    })

    specify('an unmatched image start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^look^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('[^look^: Ash fights Ga')
        ]))
    })

    specify('a would-be image convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new Footnote([
        new PlainText('look^: I guess this means "look up"?')
      ], 1)

      expect(up.toDocument('[^look^: I guess this means "look up"?]')).to.be.eql(
        new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ]))
    })
  })


  context("When the custom term for 'video' starts with a caret", () => {
    const up = new Up({
      terms: { video: '^watch^' }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.toDocument('[^watch^: Ash fights Gary](example.com/video.webm)')).to.be.eql(
        new UpDocument([
          new Video('Ash fights Gary', 'https://example.com/video.webm')
        ]))
    })

    specify('an unmatched image start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^watch^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainText('[^watch^: Ash fights Ga')
        ]))
    })

    specify('a would-be image convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new Footnote([
        new PlainText('watch^: I guess this means "watch up"?')
      ], 1)

      expect(up.toDocument('[^watch^: I guess this means "watch up"?]')).to.be.eql(
        new UpDocument([
          new Paragraph([footnote]),
          new FootnoteBlock([footnote])
        ]))
    })
  })
})
