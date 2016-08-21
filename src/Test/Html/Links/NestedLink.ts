import { expect } from 'chai'
import Up from '../../../index'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'


context('Inside a link', () => {
  specify("a footnote does not produce another <a> element. The footnote's <sup> directly contains the footnote's reference number", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new PlainText('Google'),
          new Footnote([new PlainText('A really old search engine.')], 2)
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p><a href="https://google.com">Google<sup class="up-footnote-reference" id="up-footnote-reference-2">2</sup></a></p>')
  })

  specify("a nested link does not produce another <a> element. The nested link's contents are included directly inside the outer link", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new PlainText('Google is probably not '),
          new Link([new PlainText('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


describe('A link nested within a table of contents entries ', () => {
  it('does not produce an <a> element', () => {
    const heading =
      new Heading([
        new Link([new PlainText('I enjoy apples')], 'https://google.com')
      ], { level: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })
})


context("Even when a link is nested deep within another link, it doesn't produce an <a> element. This is true for", () => {
  specify("regular links inside another link", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new Emphasis([
            new PlainText('Google'),
            new Footnote([new PlainText('A really old search engine.')], 2)
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p>'
      + '<a href="https://google.com"><em>Google<sup class="up-footnote-reference" id="up-footnote-reference-2">2</sup></em></a>'
      + '</p>')
  })

  specify("footnotes inside a link", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new Emphasis([
            new PlainText('Google is probably not '),
            new Link([new PlainText('Bing')], 'https://bing.com')
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql(
      '<p>'
      + '<a href="https://google.com"><em>Google is probably not Bing</em></a>'
      + '</p>')
  })

  specify('a link within a table of contents entry', () => {
    const heading =
      new Heading([
        new Link([
          new Emphasis([
            new Link([new PlainText('I enjoy apples')], 'https://bing.com')
          ])
        ], 'https://apple.com')
      ], { level: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1"><em>I enjoy apples</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1"><a href="https://apple.com"><em>I enjoy apples</em></a></h1>')
  })
})


context('When severeal links are nested within each other', () => {
  specify('only the outermost link produces an <a> element', () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new Link([
            new Link([
              new PlainText('Google is probably not '),
              new Link([new PlainText('Bing')], 'https://bing.com')
            ], 'https://ddg.gg')
          ], 'https://google.co.uk')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('When a link contains 2 or more inner links', () => {
  specify("neither inner link produces an <a> element", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new Link([new PlainText('Google is probably not ')], 'https://google.co.nz'),
          new Link([new PlainText('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})
