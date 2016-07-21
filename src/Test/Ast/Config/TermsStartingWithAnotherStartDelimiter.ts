import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { AudioNode } from '../../../SyntaxNodes/AudioNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


context("When the custom term for an inline convention starts with a caret, the fact that it happens to start with the start delimiter for footnotes doesn't affect anything.", () => {
  context("When the custom term for 'spoiler' starts with a caret", () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: '^lookaway^' }
      }
    })

    specify('inline spoilers can be produced using the term', () => {
      expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline spoiler start delimiter is treated as plain text', () => {
      expect(up.toAst('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'nsfw' starts with a caret", () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: '^lookaway^' }
      }
    })

    specify('inline NSFW conventions can be produced using the term', () => {
      expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsfwNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFW start delimiter is treated as plain text', () => {
      expect(up.toAst('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'nsfl' starts with a caret", () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: '^lookaway^' }
      }
    })

    specify('inline NSFL conventions can be produced using the term', () => {
      expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineNsflNode([
            new PlainTextNode('Ash fights Gary')
          ])
        ]))
    })

    specify('an unmatched inline NSFL start delimiter is treated as plain text', () => {
      expect(up.toAst('[^lookaway^: Not finished typi')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^lookaway^: Not finished typi')
        ]))
    })
  })


  context("When the custom term for 'audio' starts with a caret", () => {
    const up = new Up({
      i18n: {
        terms: { audio: '^listen^' }
      }
    })

    specify('audio conventions can be produced using the term', () => {
      expect(up.toAst('[^listen^: Ash fights Gary](example.com/audio.ogg)')).to.be.eql(
        new DocumentNode([
          new AudioNode('Ash fights Gary', 'https://example.com/audio.ogg')
        ]))
    })

    specify('an unmatched audio start delimiter is treated as plain text', () => {
      expect(up.toAst('[^listen^: Ash fights Ga')).to.be.eql(
        insideDocumentAndParagraph([
          new PlainTextNode('[^listen^: Ash fights Ga')
        ]))
    })

    specify('a would-be audio convention without its bracketed URL produces a footnote instead', () => {
      const footnote = new FootnoteNode([
        new PlainTextNode('listen^: I guess this means "listen up"?')
      ], 1)

      expect(up.toAst('[^listen^: I guess this means "listen up"?]')).to.be.eql(
        new DocumentNode([
          new ParagraphNode([footnote]),
          new FootnoteBlockNode([footnote])
        ]))
    })
  })
})