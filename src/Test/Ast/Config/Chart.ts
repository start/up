import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Table } from '../../../SyntaxNodes/Table'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('The term that represents chart conventions', () => {
  const up = new Up({
    terms: {
      markup: { chart: 'data' }
    }
  })

  it('comes from the "chart" config term', () => {
    const markup = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  it('is case-insensitive', () => {
    const uppercase = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const mixedCase = `
dAtA:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toDocument(uppercase)).to.be.eql(up.toDocument(mixedCase))
  })

  it('is trimmed', () => {
    const markup = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.toDocument(markup, {
      terms: {
        markup: {
          table: ' \t data \t '
        }
      }
    })

    expect(document).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = `
*Data*:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.toDocument(markup, {
      terms: {
        markup: {
          table: '*data*'
        }
      }
    })

    expect(document).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  it('can have multiple variations', () => {
    const markup = `
Info:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999


Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.toDocument(markup, {
      terms: {
        markup: {
          table: ['data', 'info']
        }
      }
    })

    expect(document).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ]),
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })
})
