import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { OrderedList } from '../../../SyntaxNodes/OrderedList'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'
import { DescriptionList } from '../../../SyntaxNodes/DescriptionList'
import { PlainText } from '../../../SyntaxNodes/PlainText'


context('When a table of contents has multiple entries', () => {
  specify('the ID of each element referenced by the table of contents ends with a number corresponding to its ordinal (1-based) in the table of contents', () => {
    const heading1 =
      new Heading([new PlainText('Vegetables')], 1)

    const heading2 =
      new Heading([new PlainText('Fruit')], 1)

    const heading3 =
      new Heading([new PlainText('Apples')], 2)

    const heading4 =
      new Heading([new PlainText('Green apples')], 3)

    const heading5 =
      new Heading([new PlainText('Grains')], 1)

    const heading6 =
      new Heading([new PlainText('Rice')], 2)

    const tableOfContents =
      new UpDocument.TableOfContents([heading1, heading2, heading3, heading4, heading5, heading6])

    const document = new UpDocument([
      heading1,

      new UnorderedList([
        new UnorderedList.Item([

          new OrderedList([
            new OrderedList.Item([
              heading2,

              new DescriptionList([
                new DescriptionList.Item([
                  new DescriptionList.Item.Term([new PlainText('Apple')])
                ], new DescriptionList.Item.Description([
                  heading3, heading4, heading5, heading6
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
      + '<li><h2><a href="#up-item-1">Vegetables</a></h2></li>'
      + '<li><h2><a href="#up-item-2">Fruit</a></h2></li>'
      + '<li><h3><a href="#up-item-3">Apples</a></h3></li>'
      + '<li><h4><a href="#up-item-4">Green apples</a></h4></li>'
      + '<li><h2><a href="#up-item-5">Grains</a></h2></li>'
      + '<li><h3><a href="#up-item-5">Rice</a></h3></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">Vegetables</h1>'
      + '<ul>'
      + '<li>'
      + '<ol>'
      + '<h1 id="up-item-2">Fruit</h1>'
      + '<li>'
      + '<dl>'
      + '<dt>Apple</dt>'
      + '<dd>'
      + '<h2 id="up-item-3">Apples</h2>'
      + '<h3 id="up-item-4">Green Apples</h3>'
      + '<h1 id="up-item-5">Grains</h1>'
      + '<h2 id="up-item-6">Rice</h2>'
      + '</dd>'
      + '</dl>'
      + '</li>'
      + '</ol>'
      + '</li>'
      + '</ul>')
  })
})

