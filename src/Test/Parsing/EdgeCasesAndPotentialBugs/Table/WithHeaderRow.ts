import { expect } from 'chai'
import * as Up from '../../../../index'


context("When a table doesn't have a caption, its first line can still have trailing whitespace.", () => {
  specify('When "Table" is followed by a colon', () => {
    const markup = `
Table:  \t \t 

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

  specify('When "Table" is not followed by a colon', () => {
    const markup = `
Table  \t \t 

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


describe("A table header cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Table

Game [\\;;        Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game [;')]),
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

  it('can end with an escaped backslash', () => {
    const markup = `
Table

Game :\\\\;       Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game :\\')]),
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


describe("A table row cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Table

Game;                 Release Date
Chrono Trigger [\\;;  1995
Chrono Cross;         1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger [;')]),
              new Up.Table.Row.Cell([new Up.Text('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.Text('1999')])
            ])
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const markup = `
Table

Game;                   Release Date
Chrono Trigger :\\\\;   1995
Chrono Cross;           1999`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
            new Up.Table.Header.Cell([new Up.Text('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('Chrono Trigger :\\')]),
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


context("A table", () => {
  specify('is terminated if its caption line is followed by two or more blank lines', () => {
    const markup = `
Table: my favorite outline convention.


I almost didn't include them; however, I realized tables are too useful to leave out.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.Text('Table: my favorite outline convention.')]),
        new Up.Paragraph([new Up.Text("I almost didn't include them; however, I realized tables are too useful to leave out.")]),
      ]))
  })
})


describe("A table's header row", () => {
  it('cannot be followed by two or more blank lines', () => {
    const markup = `
Table: Good games on the Sega Genesis

Game;           Release Date


I'm not biased; instead, I simply recognize Nintendo is completely flawless.`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Game')]),
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


describe('A table with one column', () => {
  it('can contain cells that would otherwise be interpreted as thematic break streaks, assuming the streaks have no special inline role (e.g. multiple dashes)', () => {
    const markup = `
Table: Most common underlines for top-level headings (from most to least common)

Underline

====
####
****`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Underline')]),
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('====')]),
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('####')]),
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('****')]),
            ])
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


context("Table cells' delimiters are evaluated before any inline conventions.", () => {
  context('Inline code delimiters do not interfere with delimiters for', () => {
    specify('Header cells', () => {
      const markup = `
Table

Game\`s Title;        Game\`s Release Date
Chrono Trigger;       1995
Chrono Cross;         1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game`s Title')]),
              new Up.Table.Header.Cell([new Up.Text('Game`s Release Date')])
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
Table

Game;                         Release Decade
Square\`s Chrono Trigger;     1990\`s
Square\`s Chrono Cross;       1990\`s`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game')]),
              new Up.Table.Header.Cell([new Up.Text('Release Decade')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Square`s Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.Text('1990`s')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Square`s Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.Text('1990`s')])
              ])
            ])
        ]))
    })
  })


  context('Delimiters for example input do not interfere with', () => {
    specify('Header cells', () => {
      const markup = `
Table

{: Game;          Release Date :}
Chrono Trigger;   1995
Chrono Cross;     1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('{: Game')]),
              new Up.Table.Header.Cell([new Up.Text('Release Date :}')])
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
Table

Game;                 Release Date
{: Chrono Trigger;    1995 :}
Chrono Cross;         1999`

      expect(Up.parse(markup)).to.deep.equal(
        new Up.Document([
          new Up.Table(
            new Up.Table.Header([
              new Up.Table.Header.Cell([new Up.Text('Game')]),
              new Up.Table.Header.Cell([new Up.Text('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('{: Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.Text('1995 :}')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.Text('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.Text('1999')])
              ])
            ])
        ]))
    })
  })
})


context('Within a table cell', () => {
  specify('backslashes escape characters (like they normally do)', () => {
    const markup = `
Table: My favorite faces

Face;     Reason for liking

\\*oo*;   It looks suspicious
83;       It's comprised of digits`

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Table(
          new Up.Table.Header([
            new Up.Table.Header.Cell([new Up.Text('Face')]),
            new Up.Table.Header.Cell([new Up.Text('Reason for liking')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('*oo*')]),
              new Up.Table.Row.Cell([new Up.Text('It looks suspicious')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.Text('83')]),
              new Up.Table.Row.Cell([new Up.Text("It's comprised of digits")])
            ])
          ], new Up.Table.Caption([
            new Up.Text('My favorite faces')
          ]))
      ]))
  })
})
