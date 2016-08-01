import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
//import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
//import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('A chart is simply a table with a second, vertical header.', () => {
  context('Its syntax is almost exactly the same, except it uses the term "chart" instead of "table".', () => {
    specify("An empty cell is added to the beginning of a chart's header row (its top-left corner) due to the header column beneath it, and the first cell of chart row is treated as a header cell for that row.", () => {
      const text = `
Chart: \`AND\` operator logic

        1;      0
0;      true;   false
1;      false;  false`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('1')]),
              new TableNode.Header.Cell([new PlainTextNode('0')])
            ]), [

              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('true')]),
                new TableNode.Row.Cell([new PlainTextNode('false')]),
              ], new TableNode.Header.Cell([new PlainTextNode('0')])),

              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('false')]),
                new TableNode.Row.Cell([new PlainTextNode('false')])
              ], new TableNode.Header.Cell([new PlainTextNode('1')]))
            ],

            new TableNode.Caption([
              new InlineCodeNode('AND'),
              new PlainTextNode(' operator logic')
            ]))
        ]))
    })

    specify("Charts don't need to have captions", () => {
      const text = `
Chart:

        1;      0
0;      true;   false
1;      false;  false`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('1')]),
              new TableNode.Header.Cell([new PlainTextNode('0')])
            ]), [

              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('true')]),
                new TableNode.Row.Cell([new PlainTextNode('false')]),
              ], new TableNode.Header.Cell([new PlainTextNode('0')])),

              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('false')]),
                new TableNode.Row.Cell([new PlainTextNode('false')])
              ], new TableNode.Header.Cell([new PlainTextNode('1')]))
            ])
        ]))
    })

    specify("Charts don't need a colon after the term in its label line", () => {
      const text = `
Chart

        1;      0
0;      true;   false
1;      false;  false`

      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([]),
              new TableNode.Header.Cell([new PlainTextNode('1')]),
              new TableNode.Header.Cell([new PlainTextNode('0')])
            ]), [

              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('true')]),
                new TableNode.Row.Cell([new PlainTextNode('false')]),
              ], new TableNode.Header.Cell([new PlainTextNode('0')])),

              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('false')]),
                new TableNode.Row.Cell([new PlainTextNode('false')])
              ], new TableNode.Header.Cell([new PlainTextNode('1')]))
            ])
        ]))
    })

    specify("Charts cannot have a caption if there isn't a colon after the term for 'chart' in its label line", () => {
      const text = `
Chart the numbers.

Do it now; I'm tired of waiting.`
      expect(Up.toAst(text)).to.be.eql(
        new DocumentNode([
          new ParagraphNode([new PlainTextNode('Chart the numbers.')]),
          new ParagraphNode([new PlainTextNode("Do it now; I'm tired of waiting.")]),
        ]))
    })
  })
})
/*


context('Within a table', () => {
  specify('single blank lines are allowed', () => {
    const text = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988

Chrono Trigger;1995
Chrono Cross;1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

 \t Game\t ; \t Release Date

 \t Final Fantasy\t ;\t 1987
 \t Final Fantasy II\t ;\t 1988

 \t Chrono Trigger\t ;\t 1995
 \t Chrono Cross\t ;\t 1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988

Chrono Trigger;1995
Chrono Cross;1999


I don't like video games; in fact, I never have.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

Game;Release Date

Final Fantasy;1987
Final Fantasy II;1988

Chrono Trigger;1995
Chrono Cross;1999



I don't like video games; in fact, I never have.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode("I don't like video games; in fact, I never have.")
        ])
      ]))
  })
})


describe('Tables', () => {
  it('can have just 1 column', () => {
    const text = `
Table:

Game

Chrono Trigger
Chrono Cross`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

Game;               Developer;            Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

Game;               Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([
              new PlainTextNode('Release Date '),
              new ParenthesizedNode([
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
    const text = `
Table:

Game;               Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II;   1988 (almost 1989)

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
                new ParenthesizedNode([
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
    const text = `
Table:

Game;                               Publisher

Final Fantasy\\; Final Fantasy II;  Square
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table

Game;           Release Date
Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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


context("The label line for tables can be followed by whitespace, regardless of whether the term for 'table' is followed by a colon.", () => {
  specify('When followed by a colon', () => {
    const text = `
Table:  \t \t 

Game;           Release Date
Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table  \t \t 

Game;           Release Date
Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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


context('Inline conventions are evaluated separately in each table cell. Delimiters in one cell only affect text in that one cell. This is true for:', () => {
  specify('Header cells', () => {
    const text = `
Table:

[: Game;          Release Date :]
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
    const text = `
Table:

Game;                 Release Date
[: Chrono Trigger;    1995 :]
Chrono Cross;         1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
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
*/