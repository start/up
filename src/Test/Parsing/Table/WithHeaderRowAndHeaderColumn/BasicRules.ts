import { expect } from 'chai'
import * as Up from '../../../../index'


context('A chart is simply a table with a second, vertical header. Its syntax is almost exactly the same, except it uses the term "chart" instead of "table".', () => {
  specify("An empty cell is added to the beginning of a chart's header row (its top-left corner) due to the header column beneath it, and the first cell of chart row is treated as a header cell for that row.", () => {
    const markup = `
Table: AND operator logic

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('1')]),
            new Up.Table.Header.Cell([new Up.Text('0')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('true')]),
              new Up.Table.Row.Cell([new Up.Text('false')]),
            ], new Up.Table.Header.Cell([new Up.Text('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ],
          new Up.Table.Caption([new Up.Text('AND operator logic')]))
      ]))
  })
})


context("On a chart's label line", () => {
  specify("the caption is not required", () => {
    const markup = `
Table:

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('1')]),
            new Up.Table.Header.Cell([new Up.Text('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('true')]),
              new Up.Table.Row.Cell([new Up.Text('false')]),
            ], new Up.Table.Header.Cell([new Up.Text('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ])
      ]))
  })

  specify("the colon after the tern for 'chart' is optional", () => {
    const markup = `
Table

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('1')]),
            new Up.Table.Header.Cell([new Up.Text('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('true')]),
              new Up.Table.Row.Cell([new Up.Text('false')]),
            ], new Up.Table.Header.Cell([new Up.Text('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ])
      ]))
  })
})


context('Within a chart', () => {
  specify('single blank lines are allowed anywhere', () => {
    const markup = `
Table:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  specify('outer whitespace is trimmed from each header and row cell', () => {
    const markup = `
Table:

 \t  \t\t  \t              Release Date \t \t \t 

 \t Final Fantasy\t ;\t    1987
 \t Final Fantasy II\t ;\t 1988
 \t Chrono Trigger\t ;\t   1995
 \t Chrono Cross\t ;\t     1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })
})


describe('The padding between cells in a chart', () => {
  it("is optional", () => {
    const markup = `
Table: AND operator logic
1;0
1;true;false
0;false;false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('1')]),
            new Up.Table.Header.Cell([new Up.Text('0')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('true')]),
              new Up.Table.Row.Cell([new Up.Text('false')]),
            ], new Up.Table.Header.Cell([new Up.Text('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ],
          new Up.Table.Caption([new Up.Text('AND operator logic')]))
      ]))
  })
})


context('The rows of a chart (and thus the chart itself) are terminated by:', () => {
  specify('A blank line', () => {
    const markup = `
Table:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988
Chrono Trigger;   1995
Chrono Cross;     1999

I don't like video games; in fact, I never have.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ]),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
        ])
      ]))
  })

  specify('2 consecutive blank lines', () => {
    const markup = `
Table:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988
Chrono Trigger;   1995
Chrono Cross;     1999


I don't like video games; in fact, I never have.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ]),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
        ])
      ]))
  })

  specify('3 consecutive blank lines', () => {
    const markup = `
Table:

                  Release Date

Final Fantasy;    1987
Final Fantasy II; 1988
Chrono Trigger;   1995
Chrono Cross;     1999



I don't like video games; in fact, I never have.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
        ])
      ]))
  })
})


describe('A chart', () => {
  it('can have 1 column, and when it does, that 1 column interpreted as a vertical heading', () => {
    const markup = `
Table: Magical happenings this past work week

            Magical Happenings

Monday
Tuesday
Wednesday
Thursday
Friday`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Magical Happenings')])
          ]), [
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('Monday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('Tuesday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('Wednesday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('Thursday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('Friday')]))
          ],
          new Up.Table.Caption([
            new Up.Text('Magical happenings this past work week')
          ]))
      ]))
  })


  it('can have 3 or more columns', () => {
    const markup = `
Table:

                    Developer;            Platform;         Release Date

Chrono Trigger;     Square;               Super Nintendo;   March 11, 1995
Terranigma;         Quintet;              Super Nintendo;   October 20, 1995
Command & Conquer;  Westwood Studios;     PC;               August 31, 1995
Starcraft;          Blizzard;             PC;               March 31, 1998`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Developer')]),
            new Up.Table.Header.Cell([new Up.Text('Platform')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Square')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('March 11, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Quintet')]),
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('October 20, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Terranigma')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Westwood Studios')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('August 31, 1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Command & Conquer')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Blizzard')]),
              new Up.Table.Row.Cell([new Up.Text('PC')]),
              new Up.Table.Row.Cell([new Up.Text('March 31, 1998')])
            ], new Up.Table.Header.Cell([new Up.Text('Starcraft')]))
          ])
      ]))
  })
})


context('Chart header cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Table:

                    Release Date (year only)

Final Fantasy;      1987
Final Fantasy II;   1988
Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([
              new Up.Text('Release Date '),
              new Up.NormalParenthetical([
                new Up.Text('(year only)')
              ])
            ])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Table:

                    Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Publisher; Developer')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Square')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Nintendo')])
            ], new Up.Table.Header.Cell([new Up.Text('Super Mario Kart')]))
          ])
      ]))
  })
})


context('Chart row cells', () => {
  specify('can contain inline conventions', () => {
    const markup = `
Table:

                        Release Date

Final Fantasy (I);      1987
Final Fantasy II;       1988 (almost 1989)
Chrono Trigger;         1995
Chrono Cross;           1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')]),
            ], new Up.Table.Header.Cell([
              new Up.Text('Final Fantasy '),
              new Up.NormalParenthetical([
                new Up.Text('(I)')
              ])
            ])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([
                new Up.Text('1988 '),
                new Up.NormalParenthetical([
                  new Up.Text('(almost 1989)')
                ])
              ]),
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')]),
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Table:

                                    Publisher

Final Fantasy\\; Final Fantasy II;  Square [\\; Soft
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Square [; Soft')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy; Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Nintendo')])
            ], new Up.Table.Header.Cell([new Up.Text('Super Mario Kart; Mario Kart 64')]))
          ])
      ]))
  })
})


context("The label line for charts can end with whitespace, regardless of whether the term for 'chart' is followed by a colon.", () => {
  specify("When followed by a colon without a caption", () => {
    const markup = `
Table:  \t  \t  \t 

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('1')]),
            new Up.Table.Header.Cell([new Up.Text('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('true')]),
              new Up.Table.Row.Cell([new Up.Text('false')]),
            ], new Up.Table.Header.Cell([new Up.Text('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ])
      ]))
  })

  specify("When followed by a colon with a caption", () => {
    const markup = `
Table:  \t  \t  \t 

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('1')]),
            new Up.Table.Header.Cell([new Up.Text('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('true')]),
              new Up.Table.Row.Cell([new Up.Text('false')]),
            ], new Up.Table.Header.Cell([new Up.Text('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ])
      ]))
  })
})


context('Inline conventions are evaluated separately in each chart cell. Delimiters in one cell only affect markup in that one cell. This is true for:', () => {
  specify('Header cells', () => {
    const markup = `
Table:

                  [: Platform;          Release Date :]
Chrono Trigger;   Super Nintendo;       1995
Chrono Cross;     Playstation;          1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('[: Platform')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date :]')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Playstation')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const markup = `
Table:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     [: Playstation;     1999 :]`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Platform')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('[: Playstation')]),
              new Up.Table.Row.Cell([new Up.Text('1999 :]')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row header cells', () => {
    const markup = `
Table:

                      Platform;            Release Date
[: Chrono Trigger;    Super :] Nintendo;   1995
Chrono Cross;         Playstation;         1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Platform')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Super :] Nintendo')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('[: Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Playstation')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })
})

describe('A chart', () => {
  it('does not need any rows', () => {
    const markup = `
Table

	      Release Date`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]),
          [])
      ]))
  })
})
