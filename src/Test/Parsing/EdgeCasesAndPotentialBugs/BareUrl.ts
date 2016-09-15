import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


describe('A bare URL containing another URL', () => {
  it("produces a single link node. In the link's content, the second URL's scheme is preserved", () => {
    expect(Up.parse('https://web.archive.org/web/19961222145127/http://www.nintendo.com/')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('web.archive.org/web/19961222145127/http://www.nintendo.com/')
        ], 'https://web.archive.org/web/19961222145127/http://www.nintendo.com/')
      ]))
  })
})


context('When a bare URL hostname follows an open square bracket', () => {
  specify("it will not include a trailing escaped closing square bracket", () => {
    expect(Up.parse('[https://nintendo.com\\]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('['),
        new Up.Link([
          new Up.PlainText('nintendo.com')
        ], 'https://nintendo.com'),
        new Up.PlainText(']')
      ]))
  })
})


context('When a bare URL hostname follows an open parenthesis', () => {
  specify("it will not include a trailing escaped closing parentheses", () => {
    expect(Up.parse('(https://nintendo.com\\)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('('),
        new Up.Link([
          new Up.PlainText('nintendo.com')
        ], 'https://nintendo.com'),
        new Up.PlainText(')')
      ]))
  })
})


describe("Unmatched opening parentheses in a bare URL", () => {
  it('do not affect any markup that follows the URL', () => {
    const markup = '(^Well, https://www.example.com/a(normal(url is my favorite site)'

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, '),
      new Up.Link([
        new Up.PlainText('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new Up.PlainText(' is my favorite site')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a bare URL", () => {
  it('do not prevent parenthesis from closing a subsequent bare URL', () => {
    const markup = '(^Well, https://www.example.com/a(normal(url is better than https://w3.org)'

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, '),
      new Up.Link([
        new Up.PlainText('www.example.com/a(normal(url')
      ], 'https://www.example.com/a(normal(url'),
      new Up.PlainText(' is better than '),
      new Up.Link([
        new Up.PlainText('w3.org')
      ], 'https://w3.org'),
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe("Unmatched opening parentheses in a bare URL closed by another convention closing", () => {
  it('do not prevent parenthesis from closing a subsequent bare URL', () => {
    const markup = "(^Well, *https://www.example.com/a(normal(url*'s better than https://w3.org)"

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, '),
      new Up.Emphasis([
        new Up.Link([
          new Up.PlainText('www.example.com/a(normal(url')
        ], 'https://www.example.com/a(normal(url'),
      ]),
      new Up.PlainText("'s better than "),
      new Up.Link([
        new Up.PlainText('w3.org')
      ], 'https://w3.org'),
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })
})


describe('A paragraph ending with a bare URL scheme (without the rest of the URL)', () => {
  it("is preserved as plain text", () => {
    expect(Up.parse('This is a URL scheme: http://')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This is a URL scheme: http://')
      ]))
  })
})


describe('A bare URL scheme followed by a space', () => {
  it("is preserved as plain text", () => {
    expect(Up.parse('http:// is my favorite URL scheme.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('http:// is my favorite URL scheme.')
      ]))
  })
})


describe('A bare URL scheme (only) immediately followed by another convention closing', () => {
  it("is preserved as plain text", () => {
    expect(Up.parse('*A URL scheme: http://*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('A URL scheme: http://')
        ])
      ]))
  })
})


describe('A bare URL followed by a space then a footnote', () => {
  it('produces a link node immediately followed by a footnote node. The space is not put into a plain text node', () => {
    const markup = "https://google.com (^An old search engine.)"

    const footnote = new Up.Footnote([
      new Up.PlainText('An old search engine.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Link([
            new Up.PlainText('google.com')
          ], 'https://google.com'),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A bare URL inside a link', () => {
  it("does not need a space between itself and the closing bracket that follows", () => {
    expect(Up.parse('[Trust me: https://inner.example.com/fake](https://outer.example.com/real)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText('Trust me: '),
          new Up.Link([
            new Up.PlainText('inner.example.com/fake')
          ], 'https://inner.example.com/fake')
        ], 'https://outer.example.com/real')
      ]))
  })
})


describe('A bare URL terminated by another convention closing, followed by a non-whitespace character,', () => {
  it('does not prevent other conventions from being evaluated afterward', () => {
    expect(Up.parse('I found a weird site (https://archive.org/fake). It had *way* too many tarantulas.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I found a weird site '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('archive.org/fake')
          ], 'https://archive.org/fake'),
          new Up.PlainText(')')
        ]),
        new Up.PlainText('. It had '),
        new Up.Emphasis([
          new Up.PlainText('way')
        ]),
        new Up.PlainText(' too many tarantulas.')
      ]))
  })
})


context('When a bare URL consisting only of a hostname is followed by a space then a valid URL path', () => {
  specify("the path is not included in the bare URL", () => {
    expect(Up.parse('ahhhh oh my goodness help me i went to http://4chan.org /rk9/ is the saddest place ever')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('ahhhh oh my goodness help me i went to '),
        new Up.Link([
          new Up.PlainText('4chan.org')
        ], 'http://4chan.org'),
        new Up.PlainText(' /rk9/ is the saddest place ever')        
      ]))
  })
})
