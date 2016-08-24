import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Table } from '../../../SyntaxNodes/Table'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe("A table header cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Table

Game [\\;;        Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game [;')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game :\\')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger [;')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Game')]),
            new Table.Header.Cell([new PlainText('Release Date')])
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Trigger :\\')]),
              new Table.Row.Cell([new PlainText('1995')])
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('Chrono Cross')]),
              new Table.Row.Cell([new PlainText('1999')])
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
    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([new PlainText('Table: my favorite outline convention.')]),
        new Paragraph([new PlainText("I almost didn't include them; however, I realized tables are too useful to leave out.")]),
      ]))
  })
})



describe('A table with one column', () => {
  it('can contain cells that would otherwise be interpreted as thematic break streaks, assuming the streaks have no special inline meaning (e.g. multiple dashes)', () => {
    const markup = `
Table: Most common underlines for top-level headings (from most to least common)

Underline

====
####
****`

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Table(
          new Table.Header([
            new Table.Header.Cell([new PlainText('Underline')]),
          ]), [
            new Table.Row([
              new Table.Row.Cell([new PlainText('====')]),
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('####')]),
            ]),
            new Table.Row([
              new Table.Row.Cell([new PlainText('****')]),
            ])
          ],
          new Table.Caption([
            new PlainText('Most common underlines for top-level headings '),
            new NormalParenthetical([
              new PlainText('(from most to least common)')
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game`s Title')]),
              new Table.Header.Cell([new PlainText('Game`s Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Trigger')]),
                new Table.Row.Cell([new PlainText('1995')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Cross')]),
                new Table.Row.Cell([new PlainText('1999')])
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game')]),
              new Table.Header.Cell([new PlainText('Release Decade')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Square`s Chrono Trigger')]),
                new Table.Row.Cell([new PlainText('1990`s')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Square`s Chrono Cross')]),
                new Table.Row.Cell([new PlainText('1990`s')])
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('{: Game')]),
              new Table.Header.Cell([new PlainText('Release Date :}')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Trigger')]),
                new Table.Row.Cell([new PlainText('1995')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Cross')]),
                new Table.Row.Cell([new PlainText('1999')])
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

      expect(Up.toDocument(markup)).to.deep.equal(
        new UpDocument([
          new Table(
            new Table.Header([
              new Table.Header.Cell([new PlainText('Game')]),
              new Table.Header.Cell([new PlainText('Release Date')])
            ]), [
              new Table.Row([
                new Table.Row.Cell([new PlainText('{: Chrono Trigger')]),
                new Table.Row.Cell([new PlainText('1995 :}')])
              ]),
              new Table.Row([
                new Table.Row.Cell([new PlainText('Chrono Cross')]),
                new Table.Row.Cell([new PlainText('1999')])
              ])
            ])
        ]))
    })
  })
})
