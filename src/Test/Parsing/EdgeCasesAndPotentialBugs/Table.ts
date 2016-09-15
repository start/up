import { expect } from 'chai'
import * as Up from '../../../index'


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
            new Up.Table.Header.Cell([new Up.PlainText('Game [;')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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
            new Up.Table.Header.Cell([new Up.PlainText('Game :\\')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger [;')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
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
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger :\\')]),
              new Up.Table.Row.Cell([new Up.PlainText('1995')])
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
              new Up.Table.Row.Cell([new Up.PlainText('1999')])
            ])
          ])
      ]))
  })
})


context("A table's label line", () => {
  specify('cannot be followed by two or more blank lines', () => {
    const markup = `
Table: my favorite outline convention.


I almost didn't include them; however, I realized tables are too useful to leave out.`
    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([new Up.PlainText('Table: my favorite outline convention.')]),
        new Up.Paragraph([new Up.PlainText("I almost didn't include them; however, I realized tables are too useful to leave out.")]),
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
            new Up.Table.Header.Cell([new Up.PlainText('Game')]),
            new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
          ]),
          [],
          new Up.Table.Caption([
            new Up.PlainText('Good games on the Sega Genesis')
          ])),
        new Up.Paragraph([
          new Up.PlainText("I'm not biased; instead, I simply recognize Nintendo is completely flawless.")
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
            new Up.Table.Header.Cell([new Up.PlainText('Underline')]),
          ]), [
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('====')]),
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('####')]),
            ]),
            new Up.Table.Row([
              new Up.Table.Row.Cell([new Up.PlainText('****')]),
            ])
          ],
          new Up.Table.Caption([
            new Up.PlainText('Most common underlines for top-level headings '),
            new Up.NormalParenthetical([
              new Up.PlainText('(from most to least common)')
            ])
          ]))
      ]))
  })
})


context("Outline conventions are evaluated before inline conventions, so table cells' delimiters are evaluated before their inline contents.", () => {
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
              new Up.Table.Header.Cell([new Up.PlainText('Game`s Title')]),
              new Up.Table.Header.Cell([new Up.PlainText('Game`s Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999')])
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
              new Up.Table.Header.Cell([new Up.PlainText('Game')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Decade')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Square`s Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.PlainText('1990`s')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Square`s Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.PlainText('1990`s')])
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
              new Up.Table.Header.Cell([new Up.PlainText('{: Game')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Date :}')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999')])
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
              new Up.Table.Header.Cell([new Up.PlainText('Game')]),
              new Up.Table.Header.Cell([new Up.PlainText('Release Date')])
            ]), [
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('{: Chrono Trigger')]),
                new Up.Table.Row.Cell([new Up.PlainText('1995 :}')])
              ]),
              new Up.Table.Row([
                new Up.Table.Row.Cell([new Up.PlainText('Chrono Cross')]),
                new Up.Table.Row.Cell([new Up.PlainText('1999')])
              ])
            ])
        ]))
    })
  })
})
