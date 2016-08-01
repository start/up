import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('A chart is simply a table with a second, vertical header. Its syntax is almost exactly the same, except it uses the term "chart" instead of "table".', () => {
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
})


context("On a chart's label line", () => {
  specify("the caption is not required", () => {
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

  specify("the colon after the tern for 'chart' is optional", () => {
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

  specify("there must be a colon after the term for 'chart' if there's a caption", () => {
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


context('Within a chart', () => {
  specify('single blank lines are allowed anywhere', () => {
    const text = `
Chart:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988

Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

 \t  \t\t  \t              Release Date \t \t \t 

 \t Final Fantasy\t ;\t    1987
 \t Final Fantasy II\t ;\t 1988

 \t Chrono Trigger\t ;\t   1995
 \t Chrono Cross\t ;\t     1999`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart: \`AND\` operator logic
1;0
0;true;false
1;false;false`

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
})


context('A chart is terminated by', () => {
  specify('2 consecutive blank lines', () => {
    const text = `
Chart:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988

Chrono Trigger;   1995
Chrono Cross;     1999


I don't like video games; in fact, I never have.`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988

Chrono Trigger;   1995
Chrono Cross;     1999



I don't like video games; in fact, I never have.`

    expect(Up.toAst(text)).to.be.eql(
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
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode("I don't like video games; in fact, I never have.")
        ])
      ]))
  })
})


describe('A chart', () => {
  it('can have 1 column, and when it does, that 1 column interpreted as a vertical heading', () => {
    const text = `
Chart: Magical happenings this past work week

            Magical Happenings

Monday
Tuesday
Wednesday
Thursday
Friday`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

                    Developer;            Platform;         Release Date

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
    const text = `
Chart:

                    Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

                    Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.toAst(text)).to.be.eql(
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


context('Table row cells', () => {
  specify('can contain inline conventions', () => {
    const text = `
Chart:

                        Release Date

Final Fantasy (I);      1987
Final Fantasy II;       1988 (almost 1989)

Chrono Trigger;         1995
Chrono Cross;           1999`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

                                    Publisher

Final Fantasy\\; Final Fantasy II;  Square [\\; Soft
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:  \t  \t  \t 

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

  specify("When followed by a colon with a caption", () => {
    const text = `
Chart:  \t  \t  \t 

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
})


describe("The caption of a chart", () => {
  it('has any outer whitespace timmed away', () => {
    const text = `
Chart:  \t  \t  \`AND\` operator logic \t \t  

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
})


context('Inline conventions are evaluated separately in each chart cell. Delimiters in one cell only affect text in that one cell. This is true for:', () => {
  specify('Header cells', () => {
    const text = `
Chart:

                  [: Platform;          Release Date :]
Chrono Trigger;   Super Nintendo;       1995
Chrono Cross;     Playstation;          1999`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     [: Playstation;     1999 :]`

    expect(Up.toAst(text)).to.be.eql(
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
    const text = `
Chart:

                      Platform;            Release Date
[: Chrono Trigger;    Super :] Nintendo;   1995
Chrono Cross;         Playstation;          1999`

    expect(Up.toAst(text)).to.be.eql(
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


context('Just like in a table, cells in a chart can span multiple columns. The syntax is the same. Any chart cell can span multiple columns:', () => {
  specify('Header cells', () => {
    const text = `
Chart:

                     Director;;;

Chrono Trigger;     Takashi Tokita;   Yoshinori Kitase;   Akihiko Matsui`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Director')], 3)
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Takashi Tokita')]),
              new TableNode.Row.Cell([new PlainTextNode('Yoshinori Kitase')]),
              new TableNode.Row.Cell([new PlainTextNode('Akihiko Matsui')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const text = `
Chart:

                    Developer;            Publisher;        Marketer;       Release Date

Chrono Trigger;     Square;;;                                               March 11, 1995
Terranigma;         Quintet;              Nintendo;         Quintet;        October 20, 1995

Command & Conquer;  Westwood Studios;;;                                     August 31, 1995
Starcraft;          Blizzard;;;                                             March 31, 1998`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Developer')]),
            new TableNode.Header.Cell([new PlainTextNode('Publisher')]),
            new TableNode.Header.Cell([new PlainTextNode('Marketer')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Square')], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 11, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('Nintendo')]),
              new TableNode.Row.Cell([new PlainTextNode('Quintet')]),
              new TableNode.Row.Cell([new PlainTextNode('October 20, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Terranigma')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Westwood Studios')], 3),
              new TableNode.Row.Cell([new PlainTextNode('August 31, 1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Command & Conquer')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Blizzard')], 3),
              new TableNode.Row.Cell([new PlainTextNode('March 31, 1998')])
            ], new TableNode.Header.Cell([new PlainTextNode('Starcraft')]))
          ])
      ]))
  })

  specify('Row header cells', () => {
    const text = `
Chart: Summary of last work week

              Most Common Word;         Magical Happenings

Monday;;                                Pikachu evolved
Tuesday;;                               Break room destroyed by Psionic Storm
Wednesday;;                             Break room repaired by CSV
Thursday;;                              Todd finished his work                            
Friday;;                                Printer had ink`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Most Common Word')]),
            new TableNode.Header.Cell([new PlainTextNode('Magical Happenings')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Pikachu evolved')])
            ], new TableNode.Header.Cell([new PlainTextNode('Monday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Break room destroyed by Psionic Storm')])
            ], new TableNode.Header.Cell([new PlainTextNode('Tuesday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Break room repaired by CSV')])
            ], new TableNode.Header.Cell([new PlainTextNode('Wednesday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Todd finished his work')])
            ], new TableNode.Header.Cell([new PlainTextNode('Thursday')], 2)),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Printer had ink')])
            ], new TableNode.Header.Cell([new PlainTextNode('Friday')], 2)),
          ],
          new TableNode.Caption([
            new PlainTextNode('Summary of last work week')
          ]))
      ]))
  })
})
