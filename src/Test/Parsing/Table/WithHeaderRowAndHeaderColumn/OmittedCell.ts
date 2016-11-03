import { expect } from 'chai'
import * as Up from '../../../../Main'


describe('The header row of a table with a header column', () => {
  specify('can have more cells than one or more of its rows', () => {
    const markup = `
Table:

                    Developer;            Platform;         Release Date

Chrono Trigger;     Square
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995
Command & Conquer
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Platform')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Square')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Terranigma')])),
            new Up.Table.Row([], new Up.Table.Header.Cell([new Up.Text('Command & Conquer')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Blizzard')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ], new Up.Table.Header.Cell([new Up.Text('Starcraft')]))
          ])
      ]))
  })

  specify('can have fewer cells than one or more of its rows', () => {
    const markup = `
Table:

                    Release Date

Final Fantasy;      1987;               This game has some interesting bugs.
Chrono Cross;       1999;               Though not a proper sequel, it's my favorite game.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')]),
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
              new Up.Table.Row.Cell([new Up.Text('This game has some interesting bugs.')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
              new Up.Table.Row.Cell([new Up.Text("Though not a proper sequel, it's my favorite game.")])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })
})
