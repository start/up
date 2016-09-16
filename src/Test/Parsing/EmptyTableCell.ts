import { expect } from 'chai'
import * as Up from '../../index'


describe('A table row ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;
Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
              new Up.Table.Row.Cell([])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ]),
          ])
      ]))
  })
})


describe('A table row ending with an unescaped semicolon followed by whitespace', () => {
  it('ends with an empty cell', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II; \t \t
Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
              new Up.Table.Row.Cell([])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ]),
          ])
      ]))
  })
})


describe('A table header ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const markup = `
Table:

Game;               Release Date;

Final Fantasy;      1987;               This game has some interesting bugs.
Final Fantasy II;   1988
Chrono Trigger;     1995
Chrono Cross;       1999;               Though not a proper sequel, it's my favorite game.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')]),
            new Up.Table.Header.Cell([])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.Text('1987')]),
              new Up.Table.Row.Cell([new Up.Text('This game has some interesting bugs.')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')]),
              new Up.Table.Row.Cell([new Up.Text("Though not a proper sequel, it's my favorite game.")])
            ]),
          ])
      ]))
  })
})


describe('A table header ending with an unescaped semicolon followed by whitespace', () => {
  it('ends with an empty cell', () => {
    const markup = `
Table:

Game;               Release Date; \t \t 

Final Fantasy;      1987
Final Fantasy II;   1988
Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')]),
            new Up.Table.Header.Cell([])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ]),
          ])
      ]))
  })
})


describe('A (non-empty) table header cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const markup = `
Table:

Game;               Developer;      \t    ;                 Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995
Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ])
          ])
      ]))
  })
})


describe('A (non-empty) table row cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const markup = `
Table:

Game;               Developer;            Platform;         Release Date

Chrono Trigger;     ;        \t           Super Nintendo;   March 11, 1995
 \t ;               Quintet;              Super Nintendo;   October 20, 1995
Command & Conquer;  Westwood Studios;     ;    \t           August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Platform')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')]),
              new Up.Table.Row.Cell([]),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ])
          ])
      ]))
  })
})


describe('A table header starting with a semicolon', () => {
  it('starts with an empty cell', () => {
    const markup = `
Table:

;    \t             Developer;            Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995
Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
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
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('Square')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Terranigma')]),
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Starcraft')]),
              new Up.Table.Row.Cell([new Up.Text('Blizzard')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ])
          ])
      ]))
  })
})
