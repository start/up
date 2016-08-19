import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Table } from '../../../SyntaxNodes/Table'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'


context('When a document has a table of contents, its first HTML element is <nav class="up-table-of-contents">. The <nav> starts with an <h1> containing the term for "Table of Contents".', () => {
  context("Following the <h1> is an <ul> containing a <li> for each entry in the table of contents. Each <li> contains a link to the appropriate element in the document.", () => {
    context("For heading entries, the link's content is the heading's content, and the link is placed inside a new heading element 1 level higher than the original heading.", () => {
      specify('A level 1 heading entry is placed in an <h2>', () => {
        const heading =
          new Heading([new PlainText('I enjoy apples')], 1)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
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
          new Heading([new PlainText('I enjoy apples')], 2)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
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
          new Heading([new PlainText('I enjoy apples')], 3)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
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
          new Heading([new PlainText('I enjoy apples')], 4)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
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
          new Heading([new PlainText('I enjoy apples')], 5)

        const document =
          new UpDocument([heading], new UpDocument.TableOfContents([heading]))

        expect(Up.toHtml(document)).to.be.eql(
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
            new Heading([new PlainText('I enjoy apples')], 6)

          const document =
            new UpDocument([heading], new UpDocument.TableOfContents([heading]))

          expect(Up.toHtml(document)).to.be.eql(
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
            new Heading([new PlainText('I enjoy apples')], 6)

          const document =
            new UpDocument([heading], new UpDocument.TableOfContents([heading]))

          expect(Up.toHtml(document)).to.be.eql(
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
            new Table.Caption([new PlainText('Influential games')]))

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
          + '<caption>Influential games</caption>'
          + '<thead><tr><th scope="col">Game</th><th scope="col">Developer</th></tr></thead>'
          + '<tr><td>Final Fantasy</td><td>Square</td></tr>'
          + '<tr><td>Super Mario Kart</td><td>Nintendo</td></tr>'
          + '</table>')
      })

      specify('A chart entry contains only a link reflecting its caption', () => {
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
            new Table.Caption([new PlainText('AND operator logic')]))

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
        new Heading([new PlainText('I enjoy apples')], 1)

      const document =
        new UpDocument([
          headingInTableOfContents,
          new Blockquote([
            new Heading([new PlainText('I enjoy apples')], 1)
          ])
        ], new UpDocument.TableOfContents([headingInTableOfContents]))

      expect(Up.toHtml(document)).to.be.eql(
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
        new Table.Caption([new PlainText('Influential games')]))

    const document =
      new UpDocument([
        tableInTableOfContents,
        new Blockquote([
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
            new Table.Caption([new PlainText('Influential games')]))

        ])
      ],
        new UpDocument.TableOfContents([tableInTableOfContents]))

    expect(Up.toHtml(document)).to.be.eql(
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
        new Table.Caption([new PlainText('AND operator logic')]))

    const document =
      new UpDocument([
        chartInTableOfContents,
        new Blockquote([
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
            new Table.Caption([new PlainText('AND operator logic')]))
        ])
      ],
        new UpDocument.TableOfContents([chartInTableOfContents]))

    expect(Up.toHtml(document)).to.be.eql(
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
