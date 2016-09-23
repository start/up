import { expect } from 'chai'
import * as Up from '../../../../index'


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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ])
      ]))
  })
})


context('Within a table', () => {
  specify('single blank lines are allowed above and below the header row', () => {
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
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

  specify('outer whitespace is trimmed from each header and row cell (though indenting the header row 2 or more spaces produces a header column)', () => {
    const markup = `
Table:

 Game\t ; \t Release Date \t

 \t Final Fantasy\t ;\t 1987 \t 
 \t Final Fantasy II\t ;\t 1988 \t 
 \t Chrono Trigger\t ;\t 1995 \t 
 \t Chrono Cross\t ;\t 1999 \t `

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


context('The rows of a table are terminated by:', () => {
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
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
          ]),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
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
          ]),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
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
          ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
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
            new Up.Table.Header.Cell([new Up.Text('Game')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([
              new Up.Text('Release Date '),
              new Up.NormalParenthetical([
                new Up.Text('(year only)')
              ])
            ])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher; Developer')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.Text('Square')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Super Mario Kart')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy')]),
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy II')]),
              new Up.Table.Row.Cell([
                new Up.Text('1988 '),
                new Up.NormalParenthetical([
                  new Up.Text('(almost 1989)')
                ])
              ])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Final Fantasy; Final Fantasy II')]),
              new Up.Table.Row.Cell([new Up.Text('Square')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Super Mario Kart; Mario Kart 64')]),
              new Up.Table.Row.Cell([new Up.Text('Nintendo')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
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
            new Up.Table.Header.Cell([new Up.Text('[: Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date :]')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('[: Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.Text('1995 :]')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
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
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]),
          [])
      ]))
  })
})
