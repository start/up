import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Table } from '../../SyntaxNodes/Table'
import { PlainText } from '../../SyntaxNodes/PlainText'


describe('Just like a table, a chart row ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const markup = `
Chart:

                    Release Date

Final Fantasy;      1987
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')])
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([])
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A chart row ending with an unescaped semicolon followed by whitespace', () => {
  it('ends with an empty cell', () => {
    const markup = `
Chart:

                    Release Date

Final Fantasy;      1987
Final Fantasy II; \t \t 

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')])
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([])
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A chart header ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const markup = `
Chart:

                    Release Date;

Final Fantasy;      1987;             This game has some interesting bugs.     
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999;             Though not a proper sequel, it's my favorite game.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')]),
            new Table.Header.Cell([])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
              new Table.Row.Cell([new PlainText('This game has some interesting bugs.')])
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([])
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
              new Table.Row.Cell([new PlainText("Though not a proper sequel, it's my favorite game.")])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A chart header ending with an unescaped semicolon followed by whitespace', () => {
  it('ends with an empty cell', () => {
    const markup = `
Chart:

                    Release Date; \t \t 

Final Fantasy;      1987;             This game has some interesting bugs.     
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999;             Though not a proper sequel, it's my favorite game.`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')]),
            new Table.Header.Cell([])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
              new Table.Row.Cell([new PlainText('This game has some interesting bugs.')])
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([])
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
              new Table.Row.Cell([new PlainText("Though not a proper sequel, it's my favorite game.")])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A (non-empty) chart header cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const markup = `
Chart:

                    Developer;        \t  ;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Square')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ], new Table.Header.Cell([new PlainText('Terranigma')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ], new Table.Header.Cell([new PlainText('Command & Conquer')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Blizzard')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
            ], new Table.Header.Cell([new PlainText('Starcraft')]))
          ])
      ]))
  })
})


describe('A (non-empty) chart row cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const markup = `
Chart:

                    Developer;            Platform;         Release Date

Chrono Trigger;       \t  ;               Super Nintendo;   March 11, 1995
 \t ;               Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;      \t ;             August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Developer')]),
            new Table.Header.Cell([new PlainText('Platform')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ], new Table.Header.Cell([])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([]),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ], new Table.Header.Cell([new PlainText('Command & Conquer')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Blizzard')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
            ], new Table.Header.Cell([new PlainText('Starcraft')]))
          ])
      ]))
  })
})


describe('A chart header starting with a semicolon', () => {
  it("starts with 2 empty cells (the first empty cell is the one that's added automatically)", () => {
    const markup = `
Chart:

;                                         Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Platform')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Square')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('March 11, 1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Quintet')]),
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('October 20, 1995')])
            ], new Table.Header.Cell([new PlainText('Terranigma')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Westwood Studios')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('August 31, 1995')])
            ], new Table.Header.Cell([new PlainText('Command & Conquer')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Blizzard')]),
              new Table.Row.Cell([new PlainText('PC')]),
              new Table.Row.Cell([new PlainText('March 31, 1998')])
            ], new Table.Header.Cell([new PlainText('Starcraft')]))
          ])
      ]))
  })
})
