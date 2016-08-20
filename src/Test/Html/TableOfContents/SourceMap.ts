import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Table } from '../../../SyntaxNodes/Table'



context("When an item referenced by the table of contents has a source line number, its entry within the table of content's <nav> element isn't given a 'data-up-source-line' attribute. This applies for:", () => {
  specify("Headings", () => {
    const heading =
      new Heading([new PlainText('I enjoy apples')], 1, 2)

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document, { writeTableOfContents: true })).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 data-up-source-line="2" id="up-item-1">I enjoy apples</h1>')
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
          new PlainText('Influential games')
        ]), 4)

    const document =
      new UpDocument([table], new UpDocument.TableOfContents([table]))

    expect(Up.toHtml(document, { writeTableOfContents: true })).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">Influential games</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table data-up-source-line="4" id="up-item-1">'
      + '<caption>Influential games</caption>'
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
          new PlainText('AND operator logic')
        ]), 3)

    const document =
      new UpDocument([chart], new UpDocument.TableOfContents([chart]))

    expect(Up.toHtml(document, { writeTableOfContents: true })).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">AND operator logic</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table data-up-source-line="3" id="up-item-1">'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })
})
