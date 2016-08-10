import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'



context("When an item referenced by the table of contents has a source line number, its entry within the table of content's <nav> element isn't given a 'data-up-source-line' attribute. This applies for:", () => {
  specify("Headings", () => {
    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1, 2)

    const document =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1" data-up-source-line="2">I enjoy apples</h1>')
  })

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
        ]), 4)

    const document =
      new DocumentNode([table], new DocumentNode.TableOfContents([table]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">Influential games</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1" data-up-source-line="4">'
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
        new TableNode.Caption([
          new PlainTextNode('AND operator logic')
        ]), 3)

    const document =
      new DocumentNode([chart], new DocumentNode.TableOfContents([chart]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><a href="#up-item-1">AND operator logic</a></li>'
      + '</ul>'
      + '</nav>'
      + '<table id="up-item-1" data-up-source-line="3">'
      + '<caption>AND operator logic</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">1</th><th scope="col">0</th></tr></thead>'
      + '<tr><th scope="row">1</th><td>true</td><td>false</td></tr>'
      + '<tr><th scope="row">0</th><td>false</td><td>false</td></tr>'
      + '</table>')
  })
})
