import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('Just like a table, a chart row ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const text = `
Chart:

                    Release Date

Final Fantasy;      1987
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A chart row ending with an unescaped semicolon followed by whitespace', () => {
  it('ends with an empty cell', () => {
    const text = `
Chart:

                    Release Date

Final Fantasy;      1987
Final Fantasy II; \t \t 

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A chart header ending with an unescaped semicolon', () => {
  it('ends with an empty cell', () => {
    const text = `
Chart:

                    Release Date;

Final Fantasy;      1987;             This game has some interesting bugs.     
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999;             Though not a proper sequel, it's my favorite game.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')]),
            new TableNode.Header.Cell([])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
              new TableNode.Row.Cell([new PlainTextNode('This game has some interesting bugs.')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
              new TableNode.Row.Cell([new PlainTextNode("Though not a proper sequel, it's my favorite game.")])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A chart header ending with an unescaped semicolon followed by whitespace', () => {
  it('ends with an empty cell', () => {
    const text = `
Chart:

                    Release Date; \t \t 

Final Fantasy;      1987;             This game has some interesting bugs.     
Final Fantasy II;

Chrono Trigger;     1995
Chrono Cross;       1999;             Though not a proper sequel, it's my favorite game.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')]),
            new TableNode.Header.Cell([])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
              new TableNode.Row.Cell([new PlainTextNode('This game has some interesting bugs.')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
              new TableNode.Row.Cell([new PlainTextNode("Though not a proper sequel, it's my favorite game.")])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')])),
          ])
      ]))
  })
})


describe('A (non-empty) chart header cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const text = `
Chart:

                    Developer;        \t  ;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Terranigma')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Command & Conquer')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ], new TableNode.Header.Cell([new PlainTextNode('Starcraft')]))
          ])
      ]))
  })
})


describe('A (non-empty) chart row cell consisting only of whitespace', () => {
  it('is considered empty', () => {
    const text = `
Chart:

                    Developer;            Platform;         Release Date

Chrono Trigger;       \t  ;               Super Nintendo;   March 11, 1995
 \t ;               Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;      \t ;             August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ], new TableNode.Header.Cell([])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')]),
              new TableNode.Row.Cell([]),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Command & Conquer')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ], new TableNode.Header.Cell([new PlainTextNode('Starcraft')]))
          ])
      ]))
  })
})


describe('A chart header starting with a semicolon', () => {
  it("starts with 2 empty cells (the first empty cell is the one that's added automatically)", () => {
    const text = `
Chart:

;                                         Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Terranigma')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Command & Conquer')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ], new TableNode.Header.Cell([new PlainTextNode('Starcraft')]))
          ])
      ]))
  })
})
