import { expect } from 'chai'
import Up from '../../../index'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { ReferenceToTableOfContentsEntry } from '../../../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'


context('Inside a link', () => {
  specify("a footnote does not produce another <a> element. The footnote's <sup> directly contains the footnote's reference number", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new PlainText('Google'),
          new Footnote([new PlainText('A really old search engine.')], { referenceNumber: 2 })
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.equal(
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

    expect(Up.toHtml(document)).to.equal('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('A link within a table of contents entry does not produce an <a> element:', () => {
  specify('in the table of contents itself', () => {
    const heading =
      new Heading([
        new Link([new PlainText('I enjoy apples')], 'https://google.com')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })

  specify('in a reference to that table of contents entry', () => {
    const heading =
      new Heading([
        new Link([new PlainText('I enjoy apples')], 'https://google.com')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('apples', heading)]),
        heading
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<p><a href="#up-item-1">I enjoy apples</a></p>'
      + '<h1 id="up-item-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })
})


context("When a link is nested deeply within another link, it doesn't produce an <a> element. This is true for:", () => {
  specify("A footnote nested deeply within a link", () => {
    const document = new UpDocument([
      new Paragraph([
        new Link([
          new Emphasis([
            new PlainText('Google'),
            new Footnote([new PlainText('A really old search engine.')], { referenceNumber: 2 })
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.equal(
      '<p>'
      + '<a href="https://google.com"><em>Google<sup class="up-footnote-reference" id="up-footnote-reference-2">2</sup></em></a>'
      + '</p>')
  })

  specify("A link nested deeply within another a link", () => {
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

    expect(Up.toHtml(document)).to.equal(
      '<p>'
      + '<a href="https://google.com"><em>Google is probably not Bing</em></a>'
      + '</p>')
  })

  specify('a link nested within another link within a table of contents entry', () => {
    const heading =
      new Heading([
        new Link([
          new Emphasis([
            new Link([new PlainText('I enjoy apples')], 'https://bing.com')
          ])
        ], 'https://apple.com')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1"><em>I enjoy apples</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1"><a href="https://apple.com"><em>I enjoy apples</em></a></h1>')
  })

  specify('a link nested within another link within a table of contents entry... as presented by a reference to that entry', () => {
    const heading =
      new Heading([
        new Link([
          new Emphasis([
            new Link([new PlainText('I enjoy apples')], 'https://bing.com')
          ])
        ], 'https://apple.com')
      ], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([
        new Paragraph([new ReferenceToTableOfContentsEntry('apples', heading)]),
        heading
      ], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1"><em>I enjoy apples</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<p><a href="#up-item-1"><em>I enjoy apples</em></a></p>'
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
              new Link([
                new PlainText('Google is probably not '),
                new Link([new PlainText('Bing')], 'https://bing.com')
              ], 'https://ddg.gg')
            ], 'https://google.co.uk')
          ], 'https://altavista.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(document)).to.equal('<p><a href="https://google.com">Google is probably not Bing</a></p>')
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

    expect(Up.toHtml(document)).to.equal('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})
