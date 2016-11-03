import { expect } from 'chai'
import * as Up from '../../../Main'


const NOT_USED: string = null

context('Inside a link', () => {
  specify("a footnote does not produce another <a> element. The footnote's <sup> directly contains the footnote's reference number", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Text('Google'),
          new Up.Footnote([new Up.Text('A really old search engine.')], { referenceNumber: 2 })
        ], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p><a href="https://google.com">Google<sup class="up-footnote-reference" id="up-footnote-reference-2">2</sup></a></p>')
  })

  specify("a nested link does not produce another <a> element. The nested link's contents are included directly inside the outer link", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Text('Google is probably not '),
          new Up.Link([new Up.Text('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('A link within a table of contents entry does not produce an <a> element:', () => {
  specify('in the table of contents itself', () => {
    const heading =
      new Up.Heading([
        new Up.Link([new Up.Text('I enjoy apples')], 'https://google.com')
      ], {
          level: 1,
          searchableMarkup: NOT_USED,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })

  specify('in a reference to that table of contents entry', () => {
    const heading =
      new Up.Heading([
        new Up.Link([new Up.Text('I enjoy apples')], 'https://google.com')
      ], {
          level: 1,
          searchableMarkup: NOT_USED,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('apples', heading)]),
        heading
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#up-topic-1">I enjoy apples</a></p>'
      + '<h1 id="up-topic-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })
})


context("When a link is nested deeply within another link, it doesn't produce an <a> element. This is true for:", () => {
  specify("A footnote nested deeply within a link", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('Google'),
            new Up.Footnote([new Up.Text('A really old search engine.')], { referenceNumber: 2 })
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<a href="https://google.com"><em>Google<sup class="up-footnote-reference" id="up-footnote-reference-2">2</sup></em></a>'
      + '</p>')
  })

  specify("A link nested deeply within another a link", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('Google is probably not '),
            new Up.Link([new Up.Text('Bing')], 'https://bing.com')
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal(
      '<p>'
      + '<a href="https://google.com"><em>Google is probably not Bing</em></a>'
      + '</p>')
  })

  specify('a link nested within another link within a table of contents entry', () => {
    const heading =
      new Up.Heading([
        new Up.Link([
          new Up.Emphasis([
            new Up.Link([new Up.Text('I enjoy apples')], 'https://bing.com')
          ])
        ], 'https://apple.com')
      ], {
          level: 1,
          searchableMarkup: NOT_USED,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1"><em>I enjoy apples</em></a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1"><a href="https://apple.com"><em>I enjoy apples</em></a></h1>')
  })

  specify('a link nested within another link within a table of contents entry... as presented by a reference to that entry', () => {
    const heading =
      new Up.Heading([
        new Up.Link([
          new Up.Emphasis([
            new Up.Link([new Up.Text('I enjoy apples')], 'https://bing.com')
          ])
        ], 'https://apple.com')
      ], {
          level: 1,
          searchableMarkup: NOT_USED,
          ordinalInTableOfContents: 1
        })

    const document =
      new Up.Document([
        new Up.Paragraph([new Up.SectionLink('apples', heading)]),
        heading
      ], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      Up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-topic-1"><em>I enjoy apples</em></a></h1>')

    expect(documentHtml).to.equal(
      '<p><a href="#up-topic-1"><em>I enjoy apples</em></a></p>'
      + '<h1 id="up-topic-1"><a href="https://apple.com"><em>I enjoy apples</em></a></h1>')
  })
})


context('When severeal links are nested within each other', () => {
  specify('only the outermost link produces an <a> element', () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Link([
            new Up.Link([
              new Up.Link([
                new Up.Text('Google is probably not '),
                new Up.Link([new Up.Text('Bing')], 'https://bing.com')
              ], 'https://ddg.gg')
            ], 'https://google.co.uk')
          ], 'https://altavista.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('When a link contains 2 or more inner links', () => {
  specify("neither inner link produces an <a> element", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Link([
          new Up.Link([new Up.Text('Google is probably not ')], 'https://google.co.nz'),
          new Up.Link([new Up.Text('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.render(document)).to.equal('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})
