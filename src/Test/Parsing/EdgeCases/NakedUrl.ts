import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { RevisionInsertion } from '../../../SyntaxNodes/RevisionInsertion'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('A naked URL containing another URL', () => {
  it("produces a single link node. In the link's content, the second URL's scheme is preserved", () => {
    expect(Up.toDocument('https://web.archive.org/web/19961222145127/http://www.nintendo.com/')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('web.archive.org/web/19961222145127/http://www.nintendo.com/')
        ], 'https://web.archive.org/web/19961222145127/http://www.nintendo.com/')
      ]))
  })
})


context('When a naked URL hostname follows an open square bracket', () => {
  specify("it will not include a trailing escaped closing square bracket", () => {
    expect(Up.toDocument('[https://nintendo.com\\]')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('['),
        new Link([
          new PlainText('nintendo.com')
        ], 'https://nintendo.com'),
        new PlainText(']')
      ]))
  })
})


context('When a naked URL hostname follows an open parenthesis', () => {
  specify("it will not include a trailing escaped closing parentheses", () => {
    expect(Up.toDocument('(https://nintendo.com\\)')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('('),
        new Link([
          new PlainText('nintendo.com')
        ], 'https://nintendo.com'),
        new PlainText(')')
      ]))
  })
})


describe("Unmatched opening parentheses in a naked URL", () => {
  it('do not affect any markup that follows the URL', () => {
    const markup = '(^Well, https://www.example.com/a(normal(url is my favorite site)'

    const footnote = new Footnote([
      new PlainText('Well, '),
      new Link([
        new PlainText('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new PlainText(' is my favorite site')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a naked URL", () => {
  it('do not prevent parenthesis from closing a subsequent naked URL', () => {
    const markup = '(^Well, https://www.example.com/a(normal(url is better than https://w3.org)'

    const footnote = new Footnote([
      new PlainText('Well, '),
      new Link([
        new PlainText('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new PlainText(' is better than '),
      new Link([
        new PlainText('w3.org')
      ], 'https://w3.org'),
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a naked URL closed by another convention closing", () => {
  it('do not prevent parenthesis from closing a subsequent naked URL', () => {
    const markup = "(^Well, ++https://www.example.com/a(normal(url++'s better than https://w3.org)"

    const footnote = new Footnote([
      new PlainText('Well, '),
      new RevisionInsertion([
        new Link([
          new PlainText('www.example.com/a(normal(url')
        ], 'https://www.example.com/a(normal(url'),
      ]),
      new PlainText("'s better than "),
      new Link([
        new PlainText('w3.org')
      ], 'https://w3.org'),
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe('A paragraph ending with a naked URL scheme (without the rest of the URL)', () => {
  it("is preserved as plain text", () => {
    expect(Up.toDocument('This is a URL scheme: http://')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This is a URL scheme: http://')
      ]))
  })
})


describe('A naked URL scheme followed by a space', () => {
  it("is preserved as plain text", () => {
    expect(Up.toDocument('http:// is my favorite URL scheme.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('http:// is my favorite URL scheme.')
      ]))
  })
})


describe('A naked URL scheme (only) immediately followed by another convention closing', () => {
  it("is preserved as plain text", () => {
    expect(Up.toDocument('++A URL scheme: http://++')).to.deep.equal(
      insideDocumentAndParagraph([
        new RevisionInsertion([
          new PlainText('A URL scheme: http://')
        ])
      ]))
  })
})


describe('A naked URL followed by a space then a footnote', () => {
  it('produces a link node immediately followed by a footnote node. The space is not put into a plain text node', () => {
    const markup = "https://google.com (^An old search engine.)"

    const footnote = new Footnote([
      new PlainText('An old search engine.')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new Link([
            new PlainText('google.com')
          ], 'https://google.com'),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A naked URL inside a link', () => {
  it("does not need a space between itself and the closing bracket that follows", () => {
    expect(Up.toDocument('[Trust me: https://inner.example.com/fake](https://outer.example.com/real)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText('Trust me: '),
          new Link([
            new PlainText('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })
})


describe('A naked URL terminated by another convention closing, followed by a non-whitespace character,', () => {
  it('does not prevent other conventions from being evaluated afterward', () => {
    expect(Up.toDocument('I found a weird site (https://archive.org/fake). It had *way* too many tarantulas.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I found a weird site '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new PlainText(')')
        ]),
        new PlainText('. It had '),
        new Emphasis([
          new PlainText('way')
        ]),
        new PlainText(' too many tarantulas.')
      ]))
  })
})


context('When a naked URL consisting only of a hostname is followed by a space then a valid URL path', () => {
  specify("the path is not included in the naked URL", () => {
    expect(Up.toDocument('ahhhh oh my goodness help me i went to http://4chan.org /rk9/ is the saddest place ever')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('ahhhh oh my goodness help me i went to '),
        new Link([
          new PlainText('4chan.org')
        ], 'http://4chan.org'),
        new PlainText(' /rk9/ is the saddest place ever')        
      ]))
  })
})
