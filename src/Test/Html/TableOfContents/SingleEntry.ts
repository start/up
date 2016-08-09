import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'


context('When a document has a table of contents, its first HTML element is <nav class="up-table-of-contents">. The <nav> starts with an <h1> containing the term for "Table of Contents".', () => {
  context("Following the <h1> is an <ul> containing a <li> for each entry in the table of contents. Each <li> contains a link to the appropriate element in the document.", () => {
    context("For heading entries, the link's content is the heading's content, and the link is placed inside a new heading element 1 level higher than the original heading.", () => {
      specify('A level 1 heading entry is placed in an <h2>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
          + '</ul>'
          + '</nav>'
          + '<h1 id="up-item-1">I enjoy apples</h1>')
      })

      specify('A level 2 heading entry is placed in an <h3>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 2)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h3><a href="#up-item-1">I enjoy apples</a></h3></li>'
          + '</ul>'
          + '</nav>'
          + '<h2 id="up-item-1">I enjoy apples</h2>')
      })

      specify('A level 3 heading entry is placed in an <h4>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 3)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h4><a href="#up-item-1">I enjoy apples</a></h4></li>'
          + '</ul>'
          + '</nav>'
          + '<h3 id="up-item-1">I enjoy apples</h3>')
      })

      specify('A level 4 heading entry entry contains an <h5>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 4)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h5><a href="#up-item-1">I enjoy apples</a></h5></li>'
          + '</ul>'
          + '</nav>'
          + '<h4 id="up-item-1">I enjoy apples</h4>')
      })

      specify('A level 5 heading entry is placed in an <h6>', () => {
        const heading =
          new HeadingNode([new PlainTextNode('I enjoy apples')], 5)

        const documentNode =
          new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><h6><a href="#up-item-1">I enjoy apples</a></h6></li>'
          + '</ul>'
          + '</nav>'
          + '<h5 id="up-item-1">I enjoy apples</h5>')
      })

      context("HTML heading levels don't go higher than <h6>, so all subsequent heading levels produce <h6> table of contents entries.", () => {
        specify('A level 6 heading entry is placed in an <h6>', () => {
          const heading =
            new HeadingNode([new PlainTextNode('I enjoy apples')], 6)

          const documentNode =
            new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

          expect(Up.toHtml(documentNode)).to.be.eql(
            '<nav class="up-table-of-contents">'
            + '<h1>Table of Contents</h1>'
            + '<ul>'
            + '<li><h6><a href="#up-item-1">I enjoy apples</a></h6></li>'
            + '</ul>'
            + '</nav>'
            + '<h6 id="up-item-1">I enjoy apples</h6>')
        })

        specify('A level 10 heading entry is placed in an <h6>', () => {
          const heading =
            new HeadingNode([new PlainTextNode('I enjoy apples')], 6)

          const documentNode =
            new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

          expect(Up.toHtml(documentNode)).to.be.eql(
            '<nav class="up-table-of-contents">'
            + '<h1>Table of Contents</h1>'
            + '<ul>'
            + '<li><h6><a href="#up-item-1">I enjoy apples</a></h6></li>'
            + '</ul>'
            + '</nav>'
            + '<h6 id="up-item-1">I enjoy apples</h6>')
        })
      })
    })

    context("For charts and table entries (both of which must have a caption to be included in the table of contents), the link's content is the caption's content.", () => {
      specify('A table entry contains only a link reflecting its caption', () => {
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
              new PlainTextNode('Influential games')
            ]))

        const documentNode =
          new DocumentNode([table], new DocumentNode.TableOfContents([table]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><a href="#up-item-1">Influential games</a></li>'
          + '</ul>'
          + '</nav>'
          + '<table id="up-item-1">'
          + '<caption>Influential games</caption>'
          + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
          + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
          + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
          + '</table>')
      })

      specify('A chart entry contains only a link reflecting its caption', () => {
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
            new TableNode.Caption([new PlainTextNode('AND operator logic')]))

        const documentNode =
          new DocumentNode([chart], new DocumentNode.TableOfContents([chart]))

        expect(Up.toHtml(documentNode)).to.be.eql(
          '<nav class="up-table-of-contents">'
          + '<h1>Table of Contents</h1>'
          + '<ul>'
          + '<li><a href="#up-item-1">AND operator logic</a></li>'
          + '</ul>'
          + '</nav>'
          + '<table id="up-item-1">'
          + '<caption>AND operator logic</caption>'
          + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
          + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
          + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
          + '</table>')
      })
    })
  })

  context("The table of contents has no effect on elements that aren't referenced by it, even when syntax nodes represented by those elements are otherwise identical.", () => {
    specify("Other headings are not affected", () => {
      const headingInTableOfContents =
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

      const documentNode =
        new DocumentNode([
          headingInTableOfContents,
          new BlockquoteNode([
            new HeadingNode([new PlainTextNode('I enjoy apples')], 1)
          ])
        ], new DocumentNode.TableOfContents([headingInTableOfContents]))

      expect(Up.toHtml(documentNode)).to.be.eql(
        '<nav class="up-table-of-contents">'
        + '<h1>Table of Contents</h1>'
        + '<ul>'
        + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
        + '</ul>'
        + '</nav>'
        + '<h1 id="up-item-1">I enjoy apples</h1>'
        + '<blockquote>'
        + '<h1>I enjoy apples</h1>'
        + '</blockquote>')
    })
  })

  specify("Other tables are not affected", () => {
    const tableInTableOfContents =
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
          new PlainTextNode('Influential games')
        ]))

    const documentNode =
      new DocumentNode([
        tableInTableOfContents,
        new BlockquoteNode([
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
              new PlainTextNode('Influential games')
            ]))

        ])
      ],
        new DocumentNode.TableOfContents([tableInTableOfContents]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">Influential games</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption>Influential games</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>'
      + '<blockquote>'
      + '<table>'
      + '<caption>Influential games</caption>'
      + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
      + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
      + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
      + '</table>'
      + '</blockquote>')
  })

  specify("Other charts are not affected", () => {
    const chartInTableOfContents =
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
        new TableNode.Caption([new PlainTextNode('AND operator logic')]))

    const documentNode =
      new DocumentNode([
        chartInTableOfContents,
        new BlockquoteNode([
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
            new TableNode.Caption([new PlainTextNode('AND operator logic')]))
        ])
      ],
        new DocumentNode.TableOfContents([chartInTableOfContents]))

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">AND operator logic</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1">'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>'
      + '<blockquote>'
      + '<table>'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>'
      + '</blockquote>')
  })
})
