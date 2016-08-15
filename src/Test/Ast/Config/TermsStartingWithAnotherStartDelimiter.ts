import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { ImageNode } from '../../../SyntaxNodes/ImageNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


context("When the custom term for an inline convention starts with a caret, the fact that it happens to start with the start delimiter for footnotes doesn't affect anything.", () => {
  context("When the custom term for 'spoiler' starts with a caret", () => {
    const up = new Up({
      terms: { spoiler: '^lookaway^' }
    })

    specify('inline spoilers can be produced using the term', () => {
      expect(up.toDocument('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline spoiler start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^lookaway^: Not finished typi')
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
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFW start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^lookaway^: Not finished typi')
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
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFL start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^lookaway^: Not finished typi')
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
          new AudioNode('Ash fights Gary', 'https://example.com/audio.ogg')
        ]))
    })

    specify('an unmatched audio start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^listen^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^listen^: Ash fights Ga')
        ]))
    })

    specify('a would-be audio convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('listen^: I guess this means "listen up"?')
      ], 1)

      expect(up.toDocument('[^listen^: I guess this means "listen up"?]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
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
          new ImageNode('Ash fights Gary', 'https://example.com/image.svg')
        ]))
    })

    specify('an unmatched image start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^look^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^look^: Ash fights Ga')
        ]))
    })

    specify('a would-be image convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('look^: I guess this means "look up"?')
      ], 1)

      expect(up.toDocument('[^look^: I guess this means "look up"?]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
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
          new VideoNode('Ash fights Gary', 'https://example.com/video.webm')
        ]))
    })

    specify('an unmatched image start delimiter is treated as plain text', () => {
      expect(up.toDocument('[^watch^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^watch^: Ash fights Ga')
        ]))
    })

    specify('a would-be image convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('watch^: I guess this means "watch up"?')
      ], 1)

      expect(up.toDocument('[^watch^: I guess this means "watch up"?]')).to.be.eql(
        new UpDocument([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ]))
    })
  })
})
