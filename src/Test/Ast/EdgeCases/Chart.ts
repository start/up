import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
//import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
//import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('A chart with one column', () => {
  it('has that column interpreted as a vertical heading', () => {
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
            new TableNode.Header.Cell([new PlainTextNode('Magical Happenings')]),
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
})

/*describe('A chart with one column', () => {
  it('can contain cells that would otherwise be interpreted as section separator streaks', () => {
    const text = `
Table: Most common underlines for top-level headings (from most to least common)

Underline

====
####
----`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Underline')]),
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('====')]),
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('####')]),
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('----')]),
            ])
          ],
          new TableNode.Caption([
            new PlainTextNode('Most common underlines for top-level headings '),
            new ParenthesizedNode([
              new PlainTextNode('(from most to least common)')
            ])
          ]))
      ]))
  })
})


describe("A table header cell", () => {
  it('can end with an escaped semicolon', () => {
    const text = `
Table

Game [\\;;           Release Date
Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game [;')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ])
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const text = `
Table

Game :\\\\;           Release Date
Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game :\\')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ])
          ])
      ]))
  })
})


describe("A table row cell", () => {
  it('can end with an escaped semicolon', () => {
    const text = `
Table

Game;               Release Date
Chrono Trigger [\\;; 1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger [;')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ])
          ])
      ]))
  })

  it('can end with an escaped backslash', () => {
    const text = `
Table

Game;           Release Date
Chrono Trigger :\\\\; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger :\\')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ])
          ])
      ]))
  })
})


context("A table's label line", () => {
  specify('cannot be followed by two spaces', () => {
    const text = `
Table: my favorite outline convention.


I almost didn't include them; however, I realized tables are too useful to leave out.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Table: my favorite outline convention.')]),
        new ParagraphNode([new PlainTextNode("I almost didn't include them; however, I realized tables are too useful to leave out.")]),
      ]))
  })
})
*/