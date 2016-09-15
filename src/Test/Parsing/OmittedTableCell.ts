import { expect } from 'chai'
import Up = require('../../index')


context('When a table row has fewer cells than the header or than other rows', () => {
  specify('no extra cells are added to that row', () => {
    const markup = `
Table:

Game;               Developer;            Platform;         Release Date

Chrono Trigger;     Square
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995
Command & Conquer
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Starcraft')]),
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')]),
              new Up.Table.Row.Cell([new Up.PlainText('PC')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 31, 1998')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
              new Up.Table.Row.Cell([new Up.PlainText('This game has some interesting bugs.')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
              new Up.Table.Row.Cell([new Up.PlainText("Though not a proper sequel, it's my favorite game.")])
            ])
          ])
      ]))
  })
})
