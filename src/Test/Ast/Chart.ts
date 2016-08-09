import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('A chart is simply a table with a second, vertical header. Its syntax is almost exactly the same, except it uses the term "chart" instead of "table".', () => {
  specify("An empty cell is added to the beginning of a chart's header row (its top-left corner) due to the header column beneath it, and the first cell of chart row is treated as a header cell for that row.", () => {
    const markup = `
Chart: AND operator logic

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toAst(markup)).to.be.eql(
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
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ],
          new TableNode.Caption([new PlainTextNode('AND operator logic')]))
      ]))
  })
})


context("On a chart's label line", () => {
  specify("the caption is not required", () => {
    const markup = `
Chart:

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toAst(markup)).to.be.eql(
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
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),

            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ])
      ]))
  })

  specify("the colon after the tern for 'chart' is optional", () => {
    const markup = `
Chart

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toAst(markup)).to.be.eql(
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
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),

            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ])
      ]))
  })
})


context('Within a chart', () => {
  specify('single blank lines are allowed anywhere', () => {
    const markup = `
Chart:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988

Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1988')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })

  specify('outer whitespace is trimmed from each header and row cell', () => {
    const markup = `
Chart:

 \t  \t\t  \t              Release Date \t \t \t 

 \t Final Fantasy\t ;\t    1987
 \t Final Fantasy II\t ;\t 1988

 \t Chrono Trigger\t ;\t   1995
 \t Chrono Cross\t ;\t     1999`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1988')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })
})


describe('The padding between cells in a chart', () => {
  it("is optional", () => {
    const markup = `
Chart: AND operator logic
1;0
1;true;false
0;false;false`

    expect(Up.toAst(markup)).to.be.eql(
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
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ],
          new TableNode.Caption([new PlainTextNode('AND operator logic')]))
      ]))
  })
})


context('A chart is terminated by', () => {
  specify('2 consecutive blank lines', () => {
    const markup = `
Chart:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988

Chrono Trigger;   1995
Chrono Cross;     1999


I don't like video games; in fact, I never have.`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1988')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ]),
        new ParagraphNode([
          new PlainTextNode("I don't like video games; in fact, I never have.")
        ])
      ]))
  })

  specify('3 consecutive blank lines', () => {
    const markup = `
Chart:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988

Chrono Trigger;   1995
Chrono Cross;     1999



I don't like video games; in fact, I never have.`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1988')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ]),
        new OutlineSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode("I don't like video games; in fact, I never have.")
        ])
      ]))
  })
})


describe('A chart', () => {
  it('can have 1 column, and when it does, that 1 column interpreted as a vertical heading', () => {
    const markup = `
Chart: Magical happenings this past work week

            Magical Happenings

Monday
Tuesday
Wednesday
Thursday
Friday`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Magical Happenings')])
          ]), [
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Monday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Tuesday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Wednesday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Thursday')])),
            new TableNode.Row(
              [], new TableNode.Header.Cell([new PlainTextNode('Friday')]))
          ],
          new TableNode.Caption([
            new PlainTextNode('Magical happenings this past work week')
          ]))
      ]))
  })


  it('can have 3 or more columns', () => {
    const markup = `
Chart:

                    Developer;            Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995

Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
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


context('Chart header cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Chart:

                    Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([
              new PlainTextNode('Release Date '),
              new ParenthesizedNode([
                new PlainTextNode('(year only)')
              ])
            ])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1988')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Chart:

                    Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher; Developer')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
            ], new TableNode.Header.Cell([new PlainTextNode('Super Mario Kart')]))
          ])
      ]))
  })
})


context('Chart row cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Chart:

                        Release Date

Final Fantasy (I);      1987
Final Fantasy II;       1988 (almost 1989)

Chrono Trigger;         1995
Chrono Cross;           1999`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1987')]),
            ], new TableNode.Header.Cell([
              new PlainTextNode('Final Fantasy '),
              new ParenthesizedNode([
                new PlainTextNode('(I)')
              ])
            ])),
            new TableNode.Row([
              new TableNode.Row.Cell([
                new PlainTextNode('1988 '),
                new ParenthesizedNode([
                  new PlainTextNode('(almost 1989)')
                ])
              ]),
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')]),
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Chart:

                                    Publisher

Final Fantasy\\; Final Fantasy II;  Square [\\; Soft
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square [; Soft')])
            ], new TableNode.Header.Cell([new PlainTextNode('Final Fantasy; Final Fantasy II')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')])
            ], new TableNode.Header.Cell([new PlainTextNode('Super Mario Kart; Mario Kart 64')]))
          ])
      ]))
  })
})


context("The label line for charts can end with whitespace, regardless of whether the term for 'chart' is followed by a colon.", () => {
  specify("When followed by a colon without a caption", () => {
    const markup = `
Chart:  \t  \t  \t 

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toAst(markup)).to.be.eql(
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
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),

            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ])
      ]))
  })

  specify("When followed by a colon with a caption", () => {
    const markup = `
Chart:  \t  \t  \t 

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toAst(markup)).to.be.eql(
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
            ], new TableNode.Header.Cell([new PlainTextNode('1')])),

            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('false')]),
              new TableNode.Row.Cell([new PlainTextNode('false')])
            ], new TableNode.Header.Cell([new PlainTextNode('0')]))
          ])
      ]))
  })
})


context('Inline conventions are evaluated separately in each chart cell. Delimiters in one cell only affect markup in that one cell. This is true for:', () => {
  specify('Header cells', () => {
    const markup = `
Chart:

                  [: Platform;          Release Date :]
Chrono Trigger;   Super Nintendo;       1995
Chrono Cross;     Playstation;          1999`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('[: Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date :]')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Playstation')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const markup = `
Chart:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     [: Playstation;     1999 :]`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Super Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('[: Playstation')]),
              new TableNode.Row.Cell([new PlainTextNode('1999 :]')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row header cells', () => {
    const markup = `
Chart:

                      Platform;            Release Date
[: Chrono Trigger;    Super :] Nintendo;   1995
Chrono Cross;         Playstation;         1999`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Platform')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Super :] Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('[: Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Playstation')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })
})

describe('A chart', () => {
  it('does not need any rows', () => {
    const markup = `
Chart

	      Release Date`

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]),
          [])
      ]))
  })
})
