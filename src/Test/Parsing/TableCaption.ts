import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Table } from '../../SyntaxNodes/Table'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { PlainText } from '../../SyntaxNodes/PlainText'


context("In a table's label line, when the term for 'table' is followed by a colon,", () => {
  specify('the colon can be folowed by a caption', () => {
    const markup = `
Table: Games in the Chrono series

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toDocument(markup)).to.be.eql(
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
          ],
          new Table.Caption([
            new PlainText('Games in the Chrono series')
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

    expect(Up.toDocument(markup)).to.be.eql(
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
          ],
          new Table.Caption([
            new PlainText('Games in the '),
            new Emphasis([
              new PlainText('Chrono')
            ]),
            new PlainText(' series'),
          ]))
      ]))
  })

  it('is trimmed', () => {
    const markup = `
Table:  \t \t Games in the *Chrono* series \t \t

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toDocument(markup)).to.be.eql(
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
          ],
          new Table.Caption([
            new PlainText('Games in the '),
            new Emphasis([
              new PlainText('Chrono')
            ]),
            new PlainText(' series'),
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

    expect(Up.toDocument(markup)).to.be.eql(
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
          ],
          new Table.Caption([
            new PlainText('Games in the Chrono series')
          ]))
      ]))
  })

  it('does not need any rows', () => {
    const markup = `
Table: Games in the Chrono series

Game;           Release Date`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]),
          [],
          new Table.Caption([
            new PlainText('Games in the Chrono series')
          ]))
      ]))
  })
})


context("When there isn't a colon after the term for 'table' in a table's label line", () => {
  specify('the table cannot have a caption', () => {
    const markup = `
Table the proposal.

Do it now; I'm tired of waiting.`
    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([new PlainText('Table the proposal.')]),
        new Paragraph([new PlainText("Do it now; I'm tired of waiting.")]),
      ]))
  })
})
