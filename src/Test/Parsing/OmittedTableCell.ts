import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Table } from '../../SyntaxNodes/Table'
import { PlainText } from '../../SyntaxNodes/PlainText'


context('When a table row has fewer cells than the header or than other rows', () => {
  specify('no extra cells are added to that row', () => {
    const markup = `
Table:

Game;               Developer;            Platform;         Release Date

Chrono Trigger;     Square
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Platform')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Starcraft')]),
              new Table.Row.Cell([new PlainText('Blizzard')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
            ])
          ])
      ]))
  })
})


describe('A table header', () => {
  specify('can have fewer cells than its rows have', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987;               This game has some interesting bugs.
Chrono Cross;       1999;               Though not a proper sequel, it's my favorite game.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')]),
              new Table.Row.Cell([new PlainText('This game has some interesting bugs.')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')]),
              new Table.Row.Cell([new PlainText("Though not a proper sequel, it's my favorite game.")])
            ])
          ])
      ]))
  })
})
