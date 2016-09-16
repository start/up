import { expect } from 'chai'
import * as Up from '../../../index'


describe('The "table" term', () => {
  const up = new Up.Transformer({
    parsing: {
      terms: { table: 'data' }
    }
  })

  it('is used to produce tables', () => {
    const markup = `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ])
      ]))
  })

  it('is case-insensitive', () => {
    const uppercase = `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const mixedCase = `
dAtA:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.parse(uppercase)).to.deep.equal(up.parse(mixedCase))
  })

  it('is trimmed', () => {
    const markup = `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.parse(markup, {
      terms: {
        table: ' \t data \t '
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ])
      ]))
  })

  it('ignores inline conventions and regular expression rules', () => {
    const markup = `
*Data*:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.parse(markup, {
      terms: {
        table: '*data*'
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ])
      ]))
  })

  it('can have multiple variations', () => {
    const markup = `
Info:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999


Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const document = Up.parse(markup, {
      terms: {
        table: ['data', 'info']
      }
    })

    expect(document).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ]),
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ])
      ]))
  })
})
