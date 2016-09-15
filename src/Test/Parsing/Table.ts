import { expect } from 'chai'
import Up = require('../../index')


describe('A line consisting solely of "Table:", followed by any number of rows of semicolon-delimited row values,', () => {
  it('produces a table node', () => {
    const markup = `
Table:
Game;Release Date
Chrono Trigger;1995
Chrono Cross;1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ]),
          ])
      ]))
  })
})


context('The rows of a table (and thus the table itself) are terminated by:', () => {
  specify('A blank line', () => {
    const markup = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988
Chrono Trigger;1995
Chrono Cross;1999

I don't like video games; in fact, I never have.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ]),
          ]),
        new Up.Paragraph([
          new Up.PlainText("I don't like video games; in fact, I never have.")
        ])
      ]))
  })

  specify('2 consecutive blank lines', () => {
    const markup = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988
Chrono Trigger;1995
Chrono Cross;1999


I don't like video games; in fact, I never have.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ]),
          ]),
        new Up.Paragraph([
          new Up.PlainText("I don't like video games; in fact, I never have.")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ]),
          ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.PlainText("I don't like video games; in fact, I never have.")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')])
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
              new Up.Table.Row.Cell([new Up.PlainText('Square')]),
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Terranigma')]),
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Command & Conquer')]),
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')]),
              new Up.Table.Row.Cell([new Up.PlainText('PC')]),
              new Up.Table.Row.Cell([new Up.PlainText('August 31, 1995')])
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


context('Table header cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Table:

Game;               Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988
Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([
              new Up.PlainText('Release Date '),
              new Up.NormalParenthetical([
                new Up.PlainText('(year only)')
              ])
            ])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('1988')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher; Developer')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Super Mario Kart')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.PlainText('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy II')]),
              new Up.Table.Row.Cell([
                new Up.PlainText('1988 '),
                new Up.NormalParenthetical([
                  new Up.PlainText('(almost 1989)')
                ])
              ])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Final Fantasy; Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.PlainText('Square')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Super Mario Kart; Mario Kart 64')]),
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('[: Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date :]')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('[: Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995 :]')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]),
          [])
      ]))
  })
})
