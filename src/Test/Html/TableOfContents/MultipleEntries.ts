import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../../SyntaxNodes/DescriptionList'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Table } from '../../../SyntaxNodes/Table'


context('When a table of contents has multiple entries', () => {
  specify('the ID of each element referenced by the table of contents ends with a number corresponding to its ordinal (1-based) in the table of contents', () => {
    const bestFruitHeading =
      new Heading([new PlainText('The best fruit')], 1)

    const table =
      new Table(
        new Table.Header([
          new Table.Header.Cell([new PlainText('Apple')]),
          new Table.Header.Cell([new PlainText('Description')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('Pink Lady')]),
            new Table.Row.Cell([new PlainText('Very crisp and sweet')])
          ]),
          new Table.Row([
            new Table.Row.Cell([new PlainText('Red Delicious')]),
            new Table.Row.Cell([new PlainText('Very mushy and bland')])
          ])
        ],
        new Table.Caption([
          new PlainText('Apple varieties')
        ]))

    const purchasingHeading =
      new Heading([new PlainText('Purchasing')], 2)

    const chart =
      new Table(
        new Table.Header([
          new Table.Header.Cell([]),
          new Table.Header.Cell([new PlainText('Target')]),
          new Table.Header.Cell([new PlainText('Walmart')])
        ]), [
          new Table.Row([
            new Table.Row.Cell([new PlainText('No')]),
            new Table.Row.Cell([new PlainText('Yes')])
          ], new Table.Header.Cell([new PlainText('Pink Lady')])),
          new Table.Row([
            new Table.Row.Cell([new PlainText('No')]),
            new Table.Row.Cell([new PlainText('No')])
          ], new Table.Header.Cell([new PlainText('Red Delicious')]))
        ],
        new Table.Caption([
          new PlainText('Where to buy apples')
        ]))

    const tableOfContents =
      new UpDocument.TableOfContents([bestFruitHeading, table, purchasingHeading, chart])

    const document = new UpDocument([
      bestFruitHeading,

      new UnorderedList([
        new UnorderedList.Item([

          new OrderedList([
            new OrderedList.Item([

              new DescriptionList([
                new DescriptionList.Item([
                  new DescriptionList.Item.Term([new PlainText('Apple')])
                ], new DescriptionList.Item.Description([
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

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">The best fruit</a></h2></li>'
      + '<li><a href="#up-item-2">Apple varieties</a></li>'
      + '<li><h3><a href="#up-item-3">Purchasing</a></h3></li>'
      + '<li><a href="#up-item-4">Where to buy apples</a></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">The best fruit</h1>'
      + '<ul>'
      + '<li>'
      + '<ol>'
      + '<li>'
      + '<dl>'
      + '<dt>Apple</dt>'
      + '<dd>'
      + '<table id="up-item-2">'
      + '<caption>Apple varieties</caption>'
      + '<thead><tr><th scope="col">Apple</th><th scope="col">Description</th></tr></thead>'
      + '<tr><td>Pink Lady</td><td>Very crisp and sweet</td></tr>'
      + '<tr><td>Red Delicious</td><td>Very mushy and bland</td></tr>'
      + '</table>'
      + '<h2 id="up-item-3">Purchasing</h2>'
      + '<table id="up-item-4">'
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

