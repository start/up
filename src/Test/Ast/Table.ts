import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { NormalParentheticalNode } from '../../SyntaxNodes/NormalParentheticalNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('A line consisting solely of "Table:", followed by any number of rows of semicolon-delimited row values,', () => {
  it('produces a table node', () => {
    const markup = `
Table:
Game;Release Date
Chrono Trigger;1995
Chrono Cross;1999`

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('1988')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('1988')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('1988')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ]),
          ]),
        new ParagraphNode([
          new PlainTextNode("I don't like video games; in fact, I never have.")
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('1988')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ]),
          ]),
        new OutlineSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode("I don't like video games; in fact, I never have.")
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Terranigma')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Command & Conquer')]),
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')]),
              new TableNode.Row.Cell([new PlainTextNode('PC')]),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([
              new PlainTextNode('Release Date '),
              new NormalParentheticalNode([
                new PlainTextNode('(year only)')
              ])
            ])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('1988')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher; Developer')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([
                new PlainTextNode('1988 '),
                new NormalParentheticalNode([
                  new PlainTextNode('(almost 1989)')
                ])
              ])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy; Final Fantasy II')]),
              new TableNode.Row.Cell([new PlainTextNode('Square')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Super Mario Kart; Mario Kart 64')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('[: Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date :]')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('[: Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995 :]')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
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
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]),
          [])
      ]))
  })
})
