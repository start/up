import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { Table } from '../../SyntaxNodes/Table'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { PlainText } from '../../SyntaxNodes/PlainText'


context('A chart is simply a table with a second, vertical header. Its syntax is almost exactly the same, except it uses the term "chart" instead of "table".', () => {
  specify("An empty cell is added to the beginning of a chart's header row (its top-left corner) due to the header column beneath it, and the first cell of chart row is treated as a header cell for that row.", () => {
    const markup = `
Chart: AND operator logic

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('1')]),
            new Table.Header.Cell([new PlainText('0')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('true')]),
              new Table.Row.Cell([new PlainText('false')]),
            ], new Table.Header.Cell([new PlainText('1')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('false')]),
              new Table.Row.Cell([new PlainText('false')])
            ], new Table.Header.Cell([new PlainText('0')]))
          ],
          new Table.Caption([new PlainText('AND operator logic')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('1')]),
            new Table.Header.Cell([new PlainText('0')])
          ]), [

            new Table.Row([
              new Table.Row.Cell([new PlainText('true')]),
              new Table.Row.Cell([new PlainText('false')]),
            ], new Table.Header.Cell([new PlainText('1')])),

            new Table.Row([
              new Table.Row.Cell([new PlainText('false')]),
              new Table.Row.Cell([new PlainText('false')])
            ], new Table.Header.Cell([new PlainText('0')]))
          ])
      ]))
  })

  specify("the colon after the tern for 'chart' is optional", () => {
    const markup = `
Chart

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('1')]),
            new Table.Header.Cell([new PlainText('0')])
          ]), [

            new Table.Row([
              new Table.Row.Cell([new PlainText('true')]),
              new Table.Row.Cell([new PlainText('false')]),
            ], new Table.Header.Cell([new PlainText('1')])),

            new Table.Row([
              new Table.Row.Cell([new PlainText('false')]),
              new Table.Row.Cell([new PlainText('false')])
            ], new Table.Header.Cell([new PlainText('0')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1988')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')]),
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1988')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')]),
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('1')]),
            new Table.Header.Cell([new PlainText('0')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('true')]),
              new Table.Row.Cell([new PlainText('false')]),
            ], new Table.Header.Cell([new PlainText('1')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('false')]),
              new Table.Row.Cell([new PlainText('false')])
            ], new Table.Header.Cell([new PlainText('0')]))
          ],
          new Table.Caption([new PlainText('AND operator logic')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1988')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')]),
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ]),
        new Paragraph([
          new PlainText("I don't like video games; in fact, I never have.")
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1988')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')]),
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ]),
        new ThematicBreak(),
        new Paragraph([
          new PlainText("I don't like video games; in fact, I never have.")
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Magical Happenings')])
          ]), [
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('Monday')])),
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('Tuesday')])),
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('Wednesday')])),
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('Thursday')])),
            new Table.Row(
              [], new Table.Header.Cell([new PlainText('Friday')]))
          ],
          new Table.Caption([
            new PlainText('Magical happenings this past work week')
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


context('Chart header cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Chart:

                    Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([
              new PlainText('Release Date '),
              new NormalParenthetical([
                new PlainText('(year only)')
              ])
            ])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1988')]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')]),
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Chart:

                    Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Publisher; Developer')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Square')])
            ], new Table.Header.Cell([new PlainText('Final Fantasy')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Nintendo')])
            ], new Table.Header.Cell([new PlainText('Super Mario Kart')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('1987')]),
            ], new Table.Header.Cell([
              new PlainText('Final Fantasy '),
              new NormalParenthetical([
                new PlainText('(I)')
              ])
            ])),
            new Table.Row([
              new Table.Row.Cell([
                new PlainText('1988 '),
                new NormalParenthetical([
                  new PlainText('(almost 1989)')
                ])
              ]),
            ], new Table.Header.Cell([new PlainText('Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1995')]),
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('1999')]),
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Chart:

                                    Publisher

Final Fantasy\\; Final Fantasy II;  Square [\\; Soft
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Publisher')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Square [; Soft')])
            ], new Table.Header.Cell([new PlainText('Final Fantasy; Final Fantasy II')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Nintendo')])
            ], new Table.Header.Cell([new PlainText('Super Mario Kart; Mario Kart 64')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('1')]),
            new Table.Header.Cell([new PlainText('0')])
          ]), [

            new Table.Row([
              new Table.Row.Cell([new PlainText('true')]),
              new Table.Row.Cell([new PlainText('false')]),
            ], new Table.Header.Cell([new PlainText('1')])),

            new Table.Row([
              new Table.Row.Cell([new PlainText('false')]),
              new Table.Row.Cell([new PlainText('false')])
            ], new Table.Header.Cell([new PlainText('0')]))
          ])
      ]))
  })

  specify("When followed by a colon with a caption", () => {
    const markup = `
Chart:  \t  \t  \t 

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('1')]),
            new Table.Header.Cell([new PlainText('0')])
          ]), [

            new Table.Row([
              new Table.Row.Cell([new PlainText('true')]),
              new Table.Row.Cell([new PlainText('false')]),
            ], new Table.Header.Cell([new PlainText('1')])),

            new Table.Row([
              new Table.Row.Cell([new PlainText('false')]),
              new Table.Row.Cell([new PlainText('false')])
            ], new Table.Header.Cell([new PlainText('0')]))
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('[: Platform')]),
            new Table.Header.Cell([new PlainText('Release Date :]')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Playstation')]),
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const markup = `
Chart:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     [: Playstation;     1999 :]`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Platform')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Super Nintendo')]),
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('[: Playstation')]),
              new Table.Row.Cell([new PlainText('1999 :]')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row header cells', () => {
    const markup = `
Chart:

                      Platform;            Release Date
[: Chrono Trigger;    Super :] Nintendo;   1995
Chrono Cross;         Playstation;         1999`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Platform')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Super :] Nintendo')]),
              new Table.Row.Cell([new PlainText('1995')])
            ], new Table.Header.Cell([new PlainText('[: Chrono Trigger')])),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Playstation')]),
              new Table.Row.Cell([new PlainText('1999')])
            ], new Table.Header.Cell([new PlainText('Chrono Cross')]))
          ])
      ]))
  })
})

describe('A chart', () => {
  it('does not need any rows', () => {
    const markup = `
Chart

	      Release Date`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]),
          [])
      ]))
  })
})
