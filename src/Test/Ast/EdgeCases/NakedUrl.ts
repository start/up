import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe('A naked URL containing another URL', () => {
  it("produces a single link node. In the link's contnet, the second URL's scheme is preserved", () => {
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


describe('A naked URL following an open square bracket', () => {
  it("can contain an escaped closing square bracket", () => {
    expect(Up.toAst('{https://nintendo.com\\}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('{'),
        new LinkNode([
          new PlainTextNode('nintendo.com}')
        ], 'https://nintendo.com}'),
      ]))
  })
})


describe("Unmatched opening parentheses in a naked URL", () => {
  it('do not affect any text that follows the URL', () => {
    const text = '(^Well, https://www.example.com/a(normal(url is my favorite site)'

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, '),
      new LinkNode([
        new PlainTextNode('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new PlainTextNode(' is my favorite site')
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


describe("Unmatched opening parentheses in a naked URL", () => {
  it('do not prevent parenthesis from closing a subsequent naked URL', () => {
    const text = '(^Well, https://www.example.com/a(normal(url is better than https://w3.org)'

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, '),
      new LinkNode([
        new PlainTextNode('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new PlainTextNode(' is better than '),
      new LinkNode([
        new PlainTextNode('w3.org')
      ], 'https://w3.org'),
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


describe("Unmatched opening parentheses in a naked URL closed by another convention closing", () => {
  it('do not prevent parenthesis from closing a subsequent naked URL', () => {
    const text = "(^Well, ++https://www.example.com/a(normal(url++'s better than https://w3.org)"

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, '),
      new RevisionInsertionNode([
        new LinkNode([
          new PlainTextNode('www.example.com/a(normal(url')
        ], 'https://www.example.com/a(normal(url'),
      ]),
      new PlainTextNode("'s better than "),
      new LinkNode([
        new PlainTextNode('w3.org')
      ], 'https://w3.org'),
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


describe('A paragraph ending with a naked URL scheme (without the rest of the URL)', () => {
  it("is preserved as plain text", () => {
    expect(Up.toAst('This is a URL scheme: http://')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This is a URL scheme: http://')
      ]))
  })
})


describe('A naked URL scheme followed by a space', () => {
  it("is preserved as plain text", () => {
    expect(Up.toAst('http:// ')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('http:// ')
      ]))
  })
})


describe('A naked URL scheme (only) immediately followed by another convention closing', () => {
  it("is preserved as plain text", () => {
    expect(Up.toAst('++A URL scheme: http://++')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new PlainTextNode('A URL scheme: http://')
        ])
      ]))
  })
})


describe('A naked URL followed by a space then a footnote', () => {
  it('produces a link node immediately followed by a footnote node. The space is not put into a plain text node', () => {
    const text = "https://google.com (^An old search engine.)"

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
  it("does not need a space between itself and the closing bracket that follows", () => {
    expect(Up.toAst('[Trust me: https://inner.example.com/fake](https://outer.example.com/real)')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Trust me: '),
          new LinkNode([
            new PlainTextNode('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })
})


describe('A naked URL terminated by another convention closing, followed by a non-whitespace character,', () => {
  it('does not prevent other conventions from being evaluated afterward', () => {
    expect(Up.toAst('I found a weird site (https://archive.org/fake). It had *way* too many tarantulas.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I found a weird site '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainTextNode(')')
        ]),
        new PlainTextNode('. It had '),
        new EmphasisNode([
          new PlainTextNode('way')
        ]),
        new PlainTextNode(' too many tarantulas.')
      ]))
  })
})
