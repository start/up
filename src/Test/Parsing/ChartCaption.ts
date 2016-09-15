import { expect } from 'chai'
import Up = require('../../index')


context("A chart caption is exactly like a table caption.", () => {
  specify('It is evaluated for inline conventions', () => {
    const markup = `
Chart: \`AND\` operator logic

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')])),
          ],

          new Up.Table.Caption([
            new Up.InlineCode('AND'),
            new Up.PlainText(' operator logic')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')])),
          ],
          new Up.Table.Caption([
            new Up.InlineCode('AND'),
            new Up.PlainText(' operator logic')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ],
          new Up.Table.Caption([new Up.PlainText('Games in the Chrono series')]))
      ]))
  })

  it('does not need any rows', () => {
    const markup = `
Chart: Games in the Chrono series

        Release Date`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]),
          [],
          new Up.Table.Caption([
            new Up.PlainText('Games in the Chrono series')
          ]))
      ]))
  })
})


context("When there isn't a colon after the term for 'chart' in a chart's label line", () => {
  specify("the chart cannot have a caption", () => {
    const markup = `
Chart the numbers.

Do it now; I'm tired of waiting.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText('Chart the numbers.')]),
        new Up.Paragraph([new Up.PlainText("Do it now; I'm tired of waiting.")]),
      ]))
  })
})
