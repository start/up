import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


context("When the custom term for an inline convention starts with a caret, the fact that it happens to start with the start delimiter for footnotes doesn't affect anything.", () => {
  context("When the custom term for 'spoiler' starts with the a caret", () => {
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


  context("When the custom term for 'nsfw' starts with the a caret", () => {
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


  context("When the custom term for 'nsfl' starts with the a caret", () => {
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
})