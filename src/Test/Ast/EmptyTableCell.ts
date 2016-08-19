import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Table } from '../../SyntaxNodes/Table'
import { PlainText } from '../../SyntaxNodes/PlainText'


describe('A table row ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')]),
            new Table.Header.Cell([])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')]),
              new Table.Row.Cell([new PlainText('This game has some interesting bugs.')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('1988')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')]),
              new Table.Row.Cell([new PlainText("Though not a proper sequel, it's my favorite game.")])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')]),
            new Table.Header.Cell([])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('1987')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('1988')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
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


describe('A (non-empty) table row cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const markup = `
Table:

Game;               Developer;            Platform;         Release Date

Chrono Trigger;     ;        \t           Super Nintendo;   March 11, 1995
 \t ;               Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     ;    \t           August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.be.eql(
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
              new Table.Row.Cell([]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([]),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
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


describe('A table header starting with a semicolon', () => {
  it('starts with an empty cell', () => {
    const markup = `
Table:

;    \t             Developer;            Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Platform')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('Square')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Terranigma')]),
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Command & Conquer')]),
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
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
