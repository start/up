import { expect } from 'chai'
import Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { TableNode } from '../../SyntaxNodes/TableNode'


context('Inside a link', () => {
  specify("a footnote does not produce another link element. The footnote's <sup> directly contains the footnote's reference number", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Google'),
          new FootnoteNode([new PlainTextNode('A really old search engine.')], 2)
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Google<sup id="up-footnote-reference-2" class="up-footnote-reference">2</sup></a></p>')
  })

  specify("a nested link does not produce another link element. The nested link's contents are included directly inside the outer link", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new PlainTextNode('Google is probably not '),
          new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('Links nested within table of contents entries do not produce <a> elements. This applies to links within:', () => {
  specify('Headings', () => {
    const heading =
      new HeadingNode([
        new LinkNode([new PlainTextNode('I enjoy apples')], 'https://google.com')
      ], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-part-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-part-1"><a href="https://google.com">I enjoy apples</a></h1>')
  })

  specify('Tables', () => {
    const table =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')]),
          new TableNode.Header.Cell([new PlainTextNode('Developer')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
            new TableNode.Row.Cell([new PlainTextNode('Square')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart')]),
            new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
          ])
        ],
        new TableNode.Caption([
          new LinkNode([new PlainTextNode('Influential games')], 'https://google.com')
        ]))

    const documentNode =
      new DocumentNode([table], new DocumentNode.TableOfContents([table]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-part-1">Influential games</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-part-1">'
      + '<caption><a href="https://google.com">Influential games</a></caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('Charts', () => {
    const chart =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([]),
          new TableNode.Header.Cell([new PlainTextNode('1')]),
          new TableNode.Header.Cell([new PlainTextNode('0')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('true')]),
            new TableNode.Row.Cell([new PlainTextNode('false')]),
          ], new TableNode.Header.Cell([new PlainTextNode('1')])),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('false')]),
            new TableNode.Row.Cell([new PlainTextNode('false')])
          ], new TableNode.Header.Cell([new PlainTextNode('0')]))
        ],
        new TableNode.Caption([
          new LinkNode([new PlainTextNode('AND operator logic')], 'https://google.com')
        ]))

    const documentNode =
      new DocumentNode([chart], new DocumentNode.TableOfContents([chart]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-part-1">AND operator logic</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-part-1">'
      + '<caption><a href="https://google.com">AND operator logic</a></caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })
})


context("Even when a link is nested deep within another link, it doesn't produce an <a> element. This is true for", () => {
  specify("regular links inside another link", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('Google'),
            new FootnoteNode([new PlainTextNode('A really old search engine.')], 2)
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<p>' +
      '<a href="https://google.com"><em>Google<sup id="up-footnote-reference-2" class="up-footnote-reference">2</sup></em></a>'
      + '</p>')
  })

  specify("footnotes inside a link", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('Google is probably not '),
            new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
          ])
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<p>'
      + '<a href="https://google.com"><em>Google is probably not Bing</em></a>'
      + '</p>')
  })

  specify('the table of contents entry for a heading', () => {
    const heading =
      new HeadingNode([
        new EmphasisNode([
          new LinkNode([new PlainTextNode('I enjoy apples')], 'https://google.com')
        ])
      ], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-part-1"><em>I enjoy apples</em></a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-part-1"><em><a href="https://google.com">I enjoy apples</a></em></h1>')
  })

  specify('the table of contents entry for a table', () => {
    const table =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Game')]),
          new TableNode.Header.Cell([new PlainTextNode('Developer')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
            new TableNode.Row.Cell([new PlainTextNode('Square')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart')]),
            new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
          ])
        ],
        new TableNode.Caption([
          new EmphasisNode([
            new LinkNode([new PlainTextNode('Influential games')], 'https://google.com')
          ])
        ]))

    const documentNode =
      new DocumentNode([table], new DocumentNode.TableOfContents([table]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-part-1"><em>Influential games</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-part-1">'
      + '<caption><em><a href="https://google.com">Influential games</a></em></caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>')
  })

  specify('the table of contents entry for a chart', () => {
    const chart =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([]),
          new TableNode.Header.Cell([new PlainTextNode('1')]),
          new TableNode.Header.Cell([new PlainTextNode('0')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('true')]),
            new TableNode.Row.Cell([new PlainTextNode('false')]),
          ], new TableNode.Header.Cell([new PlainTextNode('1')])),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('false')]),
            new TableNode.Row.Cell([new PlainTextNode('false')])
          ], new TableNode.Header.Cell([new PlainTextNode('0')]))
        ],
        new TableNode.Caption([
          new EmphasisNode([
            new LinkNode([new PlainTextNode('AND operator logic')], 'https://google.com')
          ])
        ]))

    const documentNode =
      new DocumentNode([chart], new DocumentNode.TableOfContents([chart]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-part-1"><em>AND operator logic</em></a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-part-1">'
      + '<caption><em><a href="https://google.com">AND operator logic</a></em></caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })
})


context('When severeal links are nested within each other', () => {
  specify('only the outermost link produces an <a> element', () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new LinkNode([
            new LinkNode([
              new PlainTextNode('Google is probably not '),
              new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
            ], 'https://ddg.gg')
          ], 'https://google.co.uk')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})


context('When a link contains 2 or more inner links', () => {
  specify("neither inner link produces an <a> element", () => {
    const documentNode = new DocumentNode([
      new ParagraphNode([
        new LinkNode([
          new LinkNode([new PlainTextNode('Google is probably not ')], 'https://google.co.nz'),
          new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
        ], 'https://google.com')
      ])
    ])

    expect(Up.toHtml(documentNode)).to.be.eql('<p><a href="https://google.com">Google is probably not Bing</a></p>')
  })
})
