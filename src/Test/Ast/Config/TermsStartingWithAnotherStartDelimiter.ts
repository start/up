import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


context("When the custom term for 'spoiler' starts with the a caret, its start delimiter starts with the footnote's start delimiter,", () => {
  const up = new Up({
    i18n: {
      terms: { spoiler: '^lookaway^' }
    }
  })

  specify('When there is a matching closing bracket, a spoiler is produced.', () => {
    expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  specify('When there is not a matching closing bracket, the start delimiter is preserved as plain text', () => {
    expect(up.toAst('[^lookaway^: Not finished typi')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[^lookaway^: Not finished typi')
      ]))
  })
})


context("When the custom term for 'nsfw' starts with the a caret, its start delimiter starts with the footnote's start delimiter,", () => {
  const up = new Up({
    i18n: {
      terms: { nsfw: '^lookaway^' }
    }
  })

  specify('When there is a matching closing bracket, a spoiler is produced.', () => {
    expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsfwNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  specify('When there is not a matching closing bracket, the start delimiter is preserved as plain text', () => {
    expect(up.toAst('[^lookaway^: Not finished typi')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[^lookaway^: Not finished typi')
      ]))
  })
})


context("When the custom term for 'nsfl' starts with the a caret, its start delimiter starts with the footnote's start delimiter,", () => {
  const up = new Up({
    i18n: {
      terms: { nsfl: '^lookaway^' }
    }
  })

  specify('When there is a matching closing bracket, a spoiler is produced.', () => {
    expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })

  specify('When there is not a matching closing bracket, the start delimiter is preserved as plain text', () => {
    expect(up.toAst('[^lookaway^: Not finished typi')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('[^lookaway^: Not finished typi')
      ]))
  })
})
