import { expect } from 'chai'
import * as Up from '../../index'


context('A chart is simply a table with a second, vertical header. Its syntax is almost exactly the same, except it uses the term "chart" instead of "table".', () => {
  specify("An empty cell is added to the beginning of a chart's header row (its top-left corner) due to the header column beneath it, and the first cell of chart row is treated as a header cell for that row.", () => {
    const markup = `
Chart: AND operator logic

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
          ],
          new Up.Table.Caption([new Up.PlainText('AND operator logic')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
          ])
      ]))
  })

  specify("the colon after the tern for 'chart' is optional", () => {
    const markup = `
Chart

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1988')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1988')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
          ],
          new Up.Table.Caption([new Up.PlainText('AND operator logic')]))
      ]))
  })
})


context('The rows of a chart (and thus the chart itself) are terminated by:', () => {
  specify('A blank line', () => {
    const markup = `
Chart:

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
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1988')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ]),
        new Up.Paragraph([
          new Up.PlainText("I don't like video games; in fact, I never have.")
        ])
      ]))
  })

  specify('2 consecutive blank lines', () => {
    const markup = `
Chart:

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
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1988')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ]),
        new Up.Paragraph([
          new Up.PlainText("I don't like video games; in fact, I never have.")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1988')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.PlainText("I don't like video games; in fact, I never have.")
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Magical Happenings')])
          ]), [
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('Monday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('Tuesday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('Wednesday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('Thursday')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.PlainText('Friday')]))
          ],
          new Up.Table.Caption([
            new Up.PlainText('Magical happenings this past work week')
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Developer')]),
            new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Square')]),
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 11, 1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Quintet')]),
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('October 20, 1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Terranigma')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Westwood Studios')]),
              new Up.Table.Row.Cell([new Up.PlainText('PC')]),
              new Up.Table.Row.Cell([new Up.PlainText('August 31, 1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Command & Conquer')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Blizzard')]),
              new Up.Table.Row.Cell([new Up.PlainText('PC')]),
              new Up.Table.Row.Cell([new Up.PlainText('March 31, 1998')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Starcraft')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([
              new Up.PlainText('Release Date '),
              new Up.NormalParenthetical([
                new Up.PlainText('(year only)')
              ])
            ])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1988')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Chart:

                    Publisher\\; Developer

Final Fantasy;      Square
Super Mario Kart;   Nintendo`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher; Developer')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Square')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Super Mario Kart')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1987')]),
            ], new Up.Table.Header.Cell([
              new Up.PlainText('Final Fantasy '),
              new Up.NormalParenthetical([
                new Up.PlainText('(I)')
              ])
            ])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([
                new Up.PlainText('1988 '),
                new Up.NormalParenthetical([
                  new Up.PlainText('(almost 1989)')
                ])
              ]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1995')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('1999')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('can contain escaped semicolons', () => {
    const markup = `
Chart:

                                    Publisher

Final Fantasy\\; Final Fantasy II;  Square [\\; Soft
Super Mario Kart\\; Mario Kart 64;  Nintendo`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Publisher')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Square [; Soft')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Final Fantasy; Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Nintendo')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Super Mario Kart; Mario Kart 64')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
          ])
      ]))
  })

  specify("When followed by a colon with a caption", () => {
    const markup = `
Chart:  \t  \t  \t 

        1;      0
1;      true;   false
0;      false;  false`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('1')]),
            new Up.Table.Header.Cell([new Up.PlainText('0')])
          ]), [

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('true')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
            ], new Up.Table.Header.Cell([new Up.PlainText('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('false')]),
              new Up.Table.Row.Cell([new Up.PlainText('false')])
            ], new Up.Table.Header.Cell([new Up.PlainText('0')]))
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

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('[: Platform')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date :]')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Playstation')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row cells', () => {
    const markup = `
Chart:

                  Platform;           Release Date
Chrono Trigger;   Super Nintendo;     1995
Chrono Cross;     [: Playstation;     1999 :]`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Super Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('[: Playstation')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999 :]')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ])
      ]))
  })

  specify('Row header cells', () => {
    const markup = `
Chart:

                      Platform;            Release Date
[: Chrono Trigger;    Super :] Nintendo;   1995
Chrono Cross;         Playstation;         1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Platform')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Super :] Nintendo')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ], new Up.Table.Header.Cell([new Up.PlainText('[: Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Playstation')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ], new Up.Table.Header.Cell([new Up.PlainText('Chrono Cross')]))
          ])
      ]))
  })
})

describe('A chart', () => {
  it('does not need any rows', () => {
    const markup = `
Chart

	      Release Date`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]),
          [])
      ]))
  })
})
