import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


describe('A naked URL containing another URL', () => {
  it("produces a single link node. In the link's contnet, the second URL's protocol is preserved", () => {
    expect(Up.toAst('https://web.archive.org/web/19961222145127/http://www.nintendo.com/')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('web.archive.org/web/19961222145127/http://www.nintendo.com/')
        ], 'https://web.archive.org/web/19961222145127/http://www.nintendo.com/')
      ]))
  })
})


describe('A naked URL following an open parenthesis', () => {
  it("can contain an escaped closing parenthesis", () => {
    expect(Up.toAst('(https://nintendo.com\)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('('),
        new LinkNode([
          new PlainTextNode('nintendo.com')
        ], 'https://nintendo.com'),
        new PlainTextNode(')')
      ]))
  })
})


describe('A naked URL following an open square bracket', () => {
  it("can contain an escaped closing square bracket", () => {
    expect(Up.toAst('[https://nintendo.com\]')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('nintendo.com')
        ], 'https://nintendo.com'),
        new PlainTextNode(']')
      ]))
  })
})
