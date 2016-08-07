import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { OrderedListNode } from '../../../SyntaxNodes/OrderedListNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { DescriptionListNode } from '../../../SyntaxNodes/DescriptionListNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'


context('When a table of contents has multiple entries', () => {
  specify('the ID of each element referenced by the table of contents ends with a number corresponding to its ordinal (1-based) in the table of contents', () => {
    const bestFruitHeading =
      new HeadingNode([new PlainTextNode('The best fruit')], 1)

    const table =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([new PlainTextNode('Apple')]),
          new TableNode.Header.Cell([new PlainTextNode('Description')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Pink Lady')]),
            new TableNode.Row.Cell([new PlainTextNode('Very crisp and sweet')])
          ]),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('Red Delicious')]),
            new TableNode.Row.Cell([new PlainTextNode('Very mushy and bland')])
          ])
        ],
        new TableNode.Caption([
          new PlainTextNode('Apple varieties')
        ]))

    const purchasingHeading =
      new HeadingNode([new PlainTextNode('Purchasing')], 2)

    const chart =
      new TableNode(
        new TableNode.Header([
          new TableNode.Header.Cell([]),
          new TableNode.Header.Cell([new PlainTextNode('Target')]),
          new TableNode.Header.Cell([new PlainTextNode('Walmart')])
        ]), [
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('No')]),
            new TableNode.Row.Cell([new PlainTextNode('Yes')])
          ], new TableNode.Header.Cell([new PlainTextNode('Pink Lady')])),
          new TableNode.Row([
            new TableNode.Row.Cell([new PlainTextNode('No')]),
            new TableNode.Row.Cell([new PlainTextNode('No')])
          ], new TableNode.Header.Cell([new PlainTextNode('Red Delicious')]))
        ],
        new TableNode.Caption([
          new PlainTextNode('Where to buy apples')
        ]))

    const tableOfContents =
      new DocumentNode.TableOfContents([bestFruitHeading, table, purchasingHeading, chart])

    const documentNode = new DocumentNode([
      bestFruitHeading,

      new UnorderedListNode([
        new UnorderedListNode.Item([

          new OrderedListNode([
            new OrderedListNode.Item([

              new DescriptionListNode([
                new DescriptionListNode.Item([
                  new DescriptionListNode.Item.Term([new PlainTextNode('Apple')])
                ], new DescriptionListNode.Item.Description([
                  table,
                  purchasingHeading,
                  chart
                ]))
              ])
            ])
          ])
        ])
      ])
    ], tableOfContents)

    expect(Up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-outline-1">The best fruit</a></h2></li>'
      + '<li><a href="#up-outline-2">Apple varieties</a></li>'
      + '<li><h3><a href="#up-outline-3">Purchasing</a></h3></li>'
      + '<li><a href="#up-outline-4">Where to buy apples</a></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-outline-1">The best fruit</h1>'
      + '<ul>'
      + '<li>'
      + '<ol>'
      + '<li>'
      + '<dl>'
      + '<dt>Apple</dt>'
      + '<dd>'
      + '<table id="up-outline-2">'
      + '<caption>Apple varieties</caption>'
      + '<thead><tr><th scope="col">Apple</th><th scope="col">Description</th></tr></thead>'
      + '<tr><td>Pink Lady</td><td>Very crisp and sweet</td></tr>'
      + '<tr><td>Red Delicious</td><td>Very mushy and bland</td></tr>'
      + '</table>'
      + '<h2 id="up-outline-3">Purchasing</h2>'
      + '<table id="up-outline-4">'
      + '<caption>Where to buy apples</caption>'
      + '<thead><tr><th scope="col"></th><th scope="col">Target</th><th scope="col">Walmart</th></tr></thead>'
      + '<tr><th scope="row">Pink Lady</th><td>No</td><td>Yes</td></tr>'
      + '<tr><th scope="row">Red Delicious</th><td>No</td><td>No</td></tr>'
      + '</table>'
      + '</dd>'
      + '</dl>'
      + '</li>'
      + '</ol>'
      + '</li>'
      + '</ul>')
  })
})

