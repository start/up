import { expect } from 'chai'
import * as Up from '../../../../index'


context("In a table's label line, when the term for 'table' is followed by a colon,", () => {
  specify('the colon can be folowed by a caption', () => {
    const markup = `
Table: Games in the Chrono series

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.parse(markup)).to.deep.equal(
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
          ],
          new Up.Table.Caption([
            new Up.Text('Games in the Chrono series')
          ]))
      ]))
  })
})


describe("A table caption", () => {
  it('is evaluated for inline conventions', () => {
    const markup = `
Table: Games in the *Chrono* series

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.parse(markup)).to.deep.equal(
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
          ],
          new Up.Table.Caption([
            new Up.Text('Games in the '),
            new Up.Emphasis([
              new Up.Text('Chrono')
            ]),
            new Up.Text(' series'),
          ]))
      ]))
  })

  it('is trimmed', () => {
    const markup = `
Table:  \t \t Games in the *Chrono* series \t \t

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.parse(markup)).to.deep.equal(
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
          ],
          new Up.Table.Caption([
            new Up.Text('Games in the '),
            new Up.Emphasis([
              new Up.Text('Chrono')
            ]),
            new Up.Text(' series'),
          ]))
      ]))
  })
})


describe("A table with a caption (just like a table without a caption)", () => {
  it('does not need to have a blank line before the header row', () => {
    const markup = `
Table: Games in the Chrono series
Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.parse(markup)).to.deep.equal(
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
          ],
          new Up.Table.Caption([
            new Up.Text('Games in the Chrono series')
          ]))
      ]))
  })

  it('does not need any rows', () => {
    const markup = `
Table: Games in the Chrono series

Game;           Release Date`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]),
          [],
          new Up.Table.Caption([
            new Up.Text('Games in the Chrono series')
          ]))
      ]))
  })
})


context("When there isn't a colon after the term for 'table' in a table's label line", () => {
  specify('the table cannot have a caption', () => {
    const markup = `
Table the proposal.

Do it now; I'm tired of waiting.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Table the proposal.')]),
        new Up.Paragraph([new Up.Text("Do it now; I'm tired of waiting.")]),
      ]))
  })
})
