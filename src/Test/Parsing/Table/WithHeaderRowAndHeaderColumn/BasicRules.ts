import { expect } from 'chai'
import * as Up from '../../../../Main'


context('When the header row of a table is indented', () => {
  specify('the table is given a header column', () => {
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
              new Up.Table.Row.Cell([new Up.Text('false')])
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


context('In a table with a header column', () => {
  specify('the caption is not required', () => {
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
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ])
      ]))
  })

  specify("the colon after the tern for 'table' is optional if there is no caption", () => {
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
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('1')])),

            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ])
      ]))
  })
})


context('Within a table with a header column', () => {
  specify('single blank lines are allowed above and below the header row', () => {
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
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })

  specify('outer whitespace is trimmed from each header and row cell', () => {
    const markup = `
Table:

 \t  \t\t  \t              Release Date \t \t \t

 \t Final Fantasy\t ;\t    1987 \t
 \t Final Fantasy II\t ;\t 1988 \t
 \t Chrono Trigger\t ;\t   1995 \t
 \t Chrono Cross\t ;\t     1999 \t `

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ])
      ]))
  })
})


context('In a table with a header column, the padding between cells is optional. This naturally assumes the header row is indented:', () => {
  specify('At least 2 spaces', () => {
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
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ],
          new Up.Table.Caption([new Up.Text('AND operator logic')]))
      ]))
  })

  specify('At least 1 tab', () => {
    const markup = `
Table: AND operator logic
\t1;0
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
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('1')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('false')]),
              new Up.Table.Row.Cell([new Up.Text('false')])
            ], new Up.Table.Header.Cell([new Up.Text('0')]))
          ],
          new Up.Table.Caption([new Up.Text('AND operator logic')]))
      ]))
  })

  specify('At least 1 space and 1 tab', () => {
    const markup = `
Table: AND operator logic
 \t1;0
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
              new Up.Table.Row.Cell([new Up.Text('false')])
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


context('The content rows of a table with a header column are terminated by:', () => {
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
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
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
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
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
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
          ]),
        new Up.ThematicBreak(),
        new Up.Paragraph([
          new Up.Text("I don't like video games; in fact, I never have.")
        ])
      ]))
  })
})


describe('A table with a header column', () => {
  it('can have 1 column, and when it does, that 1 column interpreted as a header column', () => {
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


context('The cells in the header row of a table with a header column', () => {
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
              new Up.Table.Row.Cell([new Up.Text('1987')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1988')])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
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


context('The content row cells of a table with a header column', () => {
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
              new Up.Table.Row.Cell([new Up.Text('1987')])
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
              ])
            ], new Up.Table.Header.Cell([new Up.Text('Final Fantasy II')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('1999')])
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


context('Within a table with a header column, inline conventions are evaluated separately in each table cell. Delimiters in one cell only affect markup in that one cell. This is true for:', () => {
  specify('Header row cells', () => {
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

  specify('Header column cells', () => {
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


describe('Just like a normal table, a table with a header column', () => {
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
