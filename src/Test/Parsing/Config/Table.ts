import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Table } from '../../../SyntaxNodes/Table'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('The "table" config term', () => {
  const up = new Up({
    terms: {
      markup: { table: 'data' }
    }
  })

  it('is used to produce tables', () => {
    const markup = `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(up.toDocument(uppercase)).to.be.eql(up.toDocument(mixedCase))
  })

  it('is trimmed', () => {
    const markup = `
Data:

Game;             Release Date
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
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
            ])
          ]),
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
            ])
          ])
      ]))
  })
})
