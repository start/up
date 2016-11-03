import { expect } from 'chai'
import * as Up from '../../../../Main'


context('Within a table with a header column:', () => {
  describe("A cell in the header row", () => {
    it('can end with an escaped semicolon', () => {
      const markup = `
Table

                     Release Date [\\;
Chrono Trigger;      1995
Chrono Cross;        1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date [;')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')])),
            ])
        ]))
    })

    it('can end with an escaped backslash', () => {
      const markup = `
Table

                      Release Date :\\\\
Chrono Trigger;       1995
Chrono Cross;         1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date :\\')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')])),
            ])
        ]))
    })
  })


  describe("A content cell", () => {
    it('can end with an escaped semicolon', () => {
      const markup = `
Table

                     Release Date
Chrono Trigger;      1995
Chrono Cross;        1999 [\\;`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1999 [;')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')])),
            ])
        ]))
    })

    it('can end with an escaped backslash', () => {
      const markup = `
Table

                      Release Date
Chrono Trigger;       1995
Chrono Cross;         1999 :\\\\`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1999 :\\')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')])),
            ])
        ]))
    })
  })


  describe("A cell in the header column", () => {
    it('can end with an escaped semicolon', () => {
      const markup = `
Table

                     Release Date
Chrono Trigger [\\;; 1995
Chrono Cross;        1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger [;')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')])),
            ])
        ]))
    })

    it('can end with an escaped backslash', () => {
      const markup = `
Table

                      Release Date
Chrono Trigger :\\\\; 1995
Chrono Cross;         1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger :\\')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')])),
            ])
        ]))
    })
  })
})



describe("A table with a header column", () => {
  it('is terminated if its caption line is followed by two or more blank lines', () => {
    const markup = `
Table: Good games on the Sega Genesis

        Release Date


I'm not biased; instead, I simply recognize Nintendo is completely flawless.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]),
          [],
          new Up.Table.Caption([
            new Up.Text('Good games on the Sega Genesis')
          ])),
        new Up.Paragraph([
          new Up.Text("I'm not biased; instead, I simply recognize Nintendo is completely flawless.")
        ])
      ]))
  })
})


describe('A table with a header column', () => {
  it('can contain header column cells that would otherwise be interpreted as thematic break streaks, assuming the streaks have no special inline role (e.g. multiple dashes)', () => {
    const markup = `
Table: Most common underlines for top-level headings (from most to least common)

      Underline Frequency

====
####
****`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Underline Frequency')])
          ]), [
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('====')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('####')])),
            new Up.Table.Row(
              [], new Up.Table.Header.Cell([new Up.Text('****')]))
          ],
          new Up.Table.Caption([
            new Up.Text('Most common underlines for top-level headings '),
            new Up.NormalParenthetical([
              new Up.Text('(from most to least common)')
            ])
          ]))
      ]))
  })
})


context("Just like with regular tables, the delimiters of cells in a table with a header column are evaluated before any inline conventions.", () => {
  context('Inline code delimiters do not interfere with delimiters for', () => {
    specify('Header cells', () => {
      const markup = `
Table

                    Game\`s Platform;       Game\`s Release Date
Chrono Trigger;     Super NES;              1995
Chrono Cross;       Playstation;            1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Game`s Platform')]),
              new Up.Table.Header.Cell([new Up.Text('Game`s Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Super NES')]),
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
Table

                    Platform;                 Release Decade
Chrono Trigger;     Nintendo\`s Super NES;    1990\`s
Chrono Cross;       Sony\`s Playstation;      1990\`s`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Platform')]),
              new Up.Table.Header.Cell([new Up.Text('Release Decade')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Nintendo\`s Super NES')]),
                new Up.Table.Row.Cell([new Up.Text('1990`s')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Sony\`s Playstation')]),
                new Up.Table.Row.Cell([new Up.Text('1990`s')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
            ])
        ]))
    })

    specify('Header column cells', () => {
      const markup = `
Table

                              Platform;         Release Decade
Square\`s Chrono Trigger;     Super NES;        1990\`s
Square\s Chrono Cross;        Playstation;      1990\`s`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('Platform')]),
              new Up.Table.Header.Cell([new Up.Text('Release Decade')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Super NES')]),
                new Up.Table.Row.Cell([new Up.Text('1990`s')])
              ], new Up.Table.Header.Cell([new Up.Text('Square\`s Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Playstation')]),
                new Up.Table.Row.Cell([new Up.Text('1990`s')])
              ], new Up.Table.Header.Cell([new Up.Text('Square\s Chrono Cross')]))
            ])
        ]))
    })
  })


  context('Delimiters for example input do not interfere with', () => {
    specify('Header cells', () => {
      const markup = `
Table:

                  {: Platform;          Release Date :}
Chrono Trigger;   Super Nintendo;       1995
Chrono Cross;     Playstation;          1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([]),
              new Up.Table.Header.Cell([new Up.Text('{: Platform')]),
              new Up.Table.Header.Cell([new Up.Text('Release Date :}')])
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
Chrono Cross;     {: Playstation;     1999 :}`

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
                new Up.Table.Row.Cell([new Up.Text('{: Playstation')]),
                new Up.Table.Row.Cell([new Up.Text('1999 :}')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
            ])
        ]))
    })

    specify('Header column cells', () => {
      const markup = `
Table:

                      Platform;            Release Date
{: Chrono Trigger;    Super :} Nintendo;   1995
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
                new Up.Table.Row.Cell([new Up.Text('Super :} Nintendo')]),
                new Up.Table.Row.Cell([new Up.Text('1995')])
              ], new Up.Table.Header.Cell([new Up.Text('{: Chrono Trigger')])),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Playstation')]),
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ], new Up.Table.Header.Cell([new Up.Text('Chrono Cross')]))
            ])
        ]))
    })
  })
})


context('Like in a regular table, within a cell in a table with a header column,', () => {
  specify('backslashes escape characters (like they normally do)', () => {
    const markup = `
Table: My favorite faces

          Reason for liking

\\*oo*;   It looks suspicious
83;       It's comprised of digits`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([]),
            new Up.Table.Header.Cell([new Up.Text('Reason for liking')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('It looks suspicious')])
            ], new Up.Table.Header.Cell([new Up.Text('*oo*')])),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text("It's comprised of digits")])
            ], new Up.Table.Header.Cell([new Up.Text('83')]))
          ], new Up.Table.Caption([
            new Up.Text('My favorite faces')
          ]))
      ]))
  })
})
