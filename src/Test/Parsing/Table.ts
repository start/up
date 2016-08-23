import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { Table } from '../../SyntaxNodes/Table'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { PlainText } from '../../SyntaxNodes/PlainText'


describe('A line consisting solely of "Table:", followed by any number of rows of semicolon-delimited row values,', () => {
  it('produces a table node', () => {
    const markup = `
Table:
Game;Release Date
Chrono Trigger;1995
Chrono Cross;1999`

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
          ])
      ]))
  })
})


context('Within a table', () => {
  specify('single blank lines are allowed', () => {
    const markup = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988

Chrono Trigger;1995
Chrono Cross;1999`

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

  specify('outer whitespace is trimmed from each header and row cell', () => {
    const markup = `
Table:

 \t Game\t ; \t Release Date \t

 \t Final Fantasy\t ;\t 1987 \t 
 \t Final Fantasy II\t ;\t 1988 \t 

 \t Chrono Trigger\t ;\t 1995 \t 
 \t Chrono Cross\t ;\t 1999 \t `

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


context('A table is terminated by', () => {
  specify('2 consecutive blank lines', () => {
    const markup = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988

Chrono Trigger;1995
Chrono Cross;1999


I don't like video games; in fact, I never have.`

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
          ]),
        new Paragraph([
          new PlainText("I don't like video games; in fact, I never have.")
        ])
      ]))
  })

  specify('3 consecutive blank lines', () => {
    const markup = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988

Chrono Trigger;1995
Chrono Cross;1999



I don't like video games; in fact, I never have.`

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
          ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText("I don't like video games; in fact, I never have.")
        ])
      ]))
  })
})


describe('Tables', () => {
  it('can have just 1 column', () => {
    const markup = `
Table:

Game

Chrono Trigger
Chrono Cross`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')])
            ])
          ])
      ]))
  })

  it('can have 3 or more columns', () => {
    const markup = `
Table:

Game;               Developer;            Platform;         Release Date

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


context('Table header cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Table:

Game;               Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([
              new PlainText('Release Date '),
              new NormalParenthetical([
                new PlainText('(year only)')
              ])
            ])
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
            ])
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Table:

Game;               Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Publisher; Developer')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy')]),
              new Table.Row.Cell([new PlainText('Square')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Super Mario Kart')]),
              new Table.Row.Cell([new PlainText('Nintendo')])
            ])
          ])
      ]))
  })
})


context('Table row cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;   1988 (almost 1989)

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
              new Table.Row.Cell([
                new PlainText('1988 '),
                new NormalParenthetical([
                  new PlainText('(almost 1989)')
                ])
              ])
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

  specify('can contain escaped semicolons', () => {
    const markup = `
Table:

Game;                               Publisher

Final Fantasy\\; Final Fantasy II;  Square
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Publisher')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Final Fantasy; Final Fantasy II')]),
              new Table.Row.Cell([new PlainText('Square')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Super Mario Kart; Mario Kart 64')]),
              new Table.Row.Cell([new PlainText('Nintendo')])
            ])
          ])
      ]))
  })
})


describe("The colon after the 'table' term", () => {
  it('is not required', () => {
    const markup = `
Table

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
          ])
      ]))
  })
})


context("The label line for tables can end with whitespace, regardless of whether the term for 'table' is followed by a colon.", () => {
  specify('When followed by a colon without a caption', () => {
    const markup = `
Table:  \t \t 

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
          ])
      ]))
  })

  specify('When not followed by a colon', () => {
    const markup = `
Table  \t \t 

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
          ])
      ]))
  })
})


context('Inline conventions are evaluated separately in each table cell. Delimiters in one cell only affect markup in that one cell. This is true for:', () => {
  specify('Header cells', () => {
    const markup = `
Table:

[: Game;          Release Date :]
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('[: Game')]),
            new Table.Header.Cell([new PlainText('Release Date :]')])
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

  specify('Row cells', () => {
    const markup = `
Table:

Game;                 Release Date
[: Chrono Trigger;    1995 :]
Chrono Cross;         1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('[: Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995 :]')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
            ])
          ])
      ]))
  })
})

describe('A table', () => {
  it('does not need any rows', () => {
    const markup = `
Table

Game;           Release Date`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]),
          [])
      ]))
  })
})
