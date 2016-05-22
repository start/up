import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


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
    expect(Up.toAst('(https://nintendo.com\\)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('('),
        new LinkNode([
          new PlainTextNode('nintendo.com)')
        ], 'https://nintendo.com)'),
      ]))
  })
})


describe('A naked URL following an open square bracket', () => {
  it("can contain an escaped closing square bracket", () => {
    expect(Up.toAst('[https://nintendo.com\\]')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('['),
        new LinkNode([
          new PlainTextNode('nintendo.com]')
        ], 'https://nintendo.com]'),
      ]))
  })
})


describe("Unmatched opening parentheses in a naked URL", () => {
  it('do not affect any text that follows the URL', () => {
    const text = '((Well, https://www.example.com/a(normal(url is my favorite site!))'

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, '),
      new LinkNode([
        new PlainTextNode('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new PlainTextNode(' is my favorite site!')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })
})


describe('A naked URL protocol without the rest of the URL', () => {
  it("is preserved as plain text", () => {
    expect(Up.toAst('http://')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('http://')
      ]))
  })
})


describe('A naked URL followed by a space then a footnote', () => {
  it('produces a link node immediately followed by a footnote node. The space is not put into a plain text node', () => {
    const text = "https://google.com ((An old search engine.))"

    const footnote = new FootnoteNode([
      new PlainTextNode('An old search engine.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new LinkNode([
            new PlainTextNode('google.com')
          ], 'https://google.com'),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})

describe('A naked URL inside a link', () => {
  it("does not need a space between itseld and the start of the arrow", () => {
    expect(Up.toAst('[https://inner.example.com/fake-> https://outer.example.com/real]')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new LinkNode([
            new PlainTextNode('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })
})