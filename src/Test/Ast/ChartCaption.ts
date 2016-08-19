import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context("A chart caption is exactly like a table caption.", () => {
  specify('It is evaluated for inline conventions', () => {
    const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
            ], new TableNode.Header.Cell([new PlainTextNode('0')])),
          ],

          new TableNode.Caption([
            new InlineCode('AND'),
            new PlainTextNode(' operator logic')
          ]))
      ]))
  })
})


  specify('Its outer whitespace is trimmed away', () => {
    const markup = `
Chart:  \t  \t  \`AND\` operator logic \t \t  

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
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
            ], new TableNode.Header.Cell([new PlainTextNode('0')])),
          ],
          new TableNode.Caption([
            new InlineCode('AND'),
            new PlainTextNode(' operator logic')
          ]))
      ]))
  })


describe("A chart with a caption (just like a chart without a caption)", () => {
  it('does not need to have a blank line before the header row', () => {
    const markup = `
Chart: Games in the Chrono series
                Release Date

Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ],
          new TableNode.Caption([new PlainTextNode('Games in the Chrono series')]))
      ]))
  })

  it('does not need any rows', () => {
    const markup = `
Chart: Games in the Chrono series

        Release Date`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]),
          [],
          new TableNode.Caption([
            new PlainTextNode('Games in the Chrono series')
          ]))
      ]))
  })
})


context("When there isn't a colon after the term for 'chart' in a chart's label line", () => {
  specify("the chart cannot have a caption", () => {
    const markup = `
Chart the numbers.

Do it now; I'm tired of waiting.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new ParagraphNode([new PlainTextNode('Chart the numbers.')]),
        new ParagraphNode([new PlainTextNode("Do it now; I'm tired of waiting.")]),
      ]))
  })
})
