import { expect } from 'chai'
import * as Up from '../../../index'


describe('The "chart" term', () => {
  const up = new Up.Transformer({
    parsing: {
      terms: { chart: 'data' }
    }
  })

  it('is used to produce charts', () => {
    const markup = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
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

    expect(up.parse(uppercase)).to.deep.equal(up.parse(mixedCase))
  })

  it('is trimmed', () => {
    const markup = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.parse(markup, {
      terms: {
        chart: ' \t data \t '
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = `
*Data*:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.parse(markup, {
      terms: {
        chart: '*data*'
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
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

    const document = Up.parse(markup, {
      terms: {
        chart: ['data', 'info']
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ]),
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })
})
