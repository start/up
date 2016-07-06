import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'


context("When the custom term for 'spoiler' starts with the a caret, its start delimiter starts with the footnote's start delimiter,", () => {
  const up = new Up({
    i18n: {
      terms: { spoiler: '^lookaway^' }
    }
  })

  specify('When there is a matching closing bracket, a spoiler is produced.', () => {
    expect(up.toAst('[^lookaway^: Ash fights Gary]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Ash fights Gary')
        ])
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
        new NsfwNode([
          new PlainTextNode('Ash fights Gary')
        ])
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
        new NsflNode([
          new PlainTextNode('Ash fights Gary')
        ])
      ]))
  })
})
