import { expect } from 'chai'
import Up from '../../../index'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Heading } from '../../../SyntaxNodes/Heading'
import { Table } from '../../../SyntaxNodes/Table'


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


context('Links nested within table of contents entries do not produce <a> elements. This applies to links within:', () => {
  specify('Headings', () => {
    const heading =
      new Heading([
        new Link([new PlainText('I enjoy apples')], 'https://google.com')
      ], 1)

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

  specify('Tables', () => {
    const table =
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Developer')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Final Fantasy')]),
            new Table.Row.Cell([new PlainText('Square')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Super Mario Kart')]),
            new Table.Row.Cell([new PlainText('Nintendo')])
          ])
        ],
        new Table.Caption([
          new Link([new PlainText('Influential games')], 'https://google.com')
        ]))

    const document =
      new UpDocument([table], new UpDocument.TableOfContents([table]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">Influential games</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption><a href="https://google.com">Influential games</a></caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('Charts', () => {
    const chart =
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('1')]),
          new Table.Header.Cell([new PlainText('0')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('true')]),
            new Table.Row.Cell([new PlainText('false')]),
          ], new Table.Header.Cell([new PlainText('1')])),
          new Table.Row([
            new Table.Row.Cell([new PlainText('false')]),
            new Table.Row.Cell([new PlainText('false')])
          ], new Table.Header.Cell([new PlainText('0')]))
        ],
        new Table.Caption([
          new Link([new PlainText('AND operator logic')], 'https://google.com')
        ]))

    const document =
      new UpDocument([chart], new UpDocument.TableOfContents([chart]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">AND operator logic</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption><a href="https://google.com">AND operator logic</a></caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
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

  specify('the table of contents entry for a heading', () => {
    const heading =
      new Heading([
        new Emphasis([
          new Link([new PlainText('I enjoy apples')], 'https://google.com')
        ])
      ], 1)

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1"><em>I enjoy apples</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1"><em><a href="https://google.com">I enjoy apples</a></em></h1>')
  })

  specify('the table of contents entry for a table', () => {
    const table =
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Game')]),
          new Table.Header.Cell([new PlainText('Developer')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Final Fantasy')]),
            new Table.Row.Cell([new PlainText('Square')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Super Mario Kart')]),
            new Table.Row.Cell([new PlainText('Nintendo')])
          ])
        ],
        new Table.Caption([
          new Emphasis([
            new Link([new PlainText('Influential games')], 'https://google.com')
          ])
        ]))

    const document =
      new UpDocument([table], new UpDocument.TableOfContents([table]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1"><em>Influential games</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption><em><a href="https://google.com">Influential games</a></em></caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('the table of contents entry for a chart', () => {
    const chart =
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('1')]),
          new Table.Header.Cell([new PlainText('0')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('true')]),
            new Table.Row.Cell([new PlainText('false')]),
          ], new Table.Header.Cell([new PlainText('1')])),
          new Table.Row([
            new Table.Row.Cell([new PlainText('false')]),
            new Table.Row.Cell([new PlainText('false')])
          ], new Table.Header.Cell([new PlainText('0')]))
        ],
        new Table.Caption([
          new Emphasis([
            new Link([new PlainText('AND operator logic')], 'https://google.com')
          ])
        ]))

    const document =
      new UpDocument([chart], new UpDocument.TableOfContents([chart]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1"><em>AND operator logic</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption><em><a href="https://google.com">AND operator logic</a></em></caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
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
