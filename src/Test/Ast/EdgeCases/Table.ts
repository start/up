import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe("A table header cell", () => {
  it('can end with an escaped semicolon', () => {
    const markup = `
Table

Game [\\;;        Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
Table

Game :\\\\;       Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
Table

Game;                 Release Date
Chrono Trigger [\\;;  1995
Chrono Cross;         1999`

    expect(Up.toAst(markup)).to.be.eql(
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
    const markup = `
Table

Game;                   Release Date
Chrono Trigger :\\\\;   1995
Chrono Cross;           1999`

    expect(Up.toAst(markup)).to.be.eql(
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
  specify('cannot be followed by two or more blank lines', () => {
    const markup = `
Table: my favorite outline convention.


I almost didn't include them; however, I realized tables are too useful to leave out.`
    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Table: my favorite outline convention.')]),
        new ParagraphNode([new PlainTextNode("I almost didn't include them; however, I realized tables are too useful to leave out.")]),
      ]))
  })
})



describe('A table with one column', () => {
  it('can contain cells that would otherwise be interpreted as outline separator streaks, assuming the streaks have no special inline meaning (e.g. multiple dashes)', () => {
    const markup = `
Table: Most common underlines for top-level headings (from most to least common)

Underline

====
####
****`

    expect(Up.toAst(markup)).to.be.eql(
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
              new TableNode.Row.Cell([new PlainTextNode('****')]),
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


context("Outline conventions are evaluated before inline conventions, so table cells' delimiters are evaluated before their inline contents.", () => {
  context('Inline code delimiters do not interfere with', () => {
    specify('Header cells', () => {
      const markup = `
Table

Game\`s Title;        Game\`s Release Date
Chrono Trigger;       1995
Chrono Cross;         1999`

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('Game`s Title')]),
              new TableNode.Header.Cell([new PlainTextNode('Game`s Release Date')])
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

    specify('Row cells', () => {
      const markup = `
Table:

Game;                         Release Decade
Square\`s Chrono Trigger;     1990\`s
Square\`s Chrono Cross;       1990\`s`

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('Game')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Decade')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Square`s Chrono Trigger')]),
                new TableNode.Row.Cell([new PlainTextNode('1990`s')])
              ]),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Square`s Chrono Cross')]),
                new TableNode.Row.Cell([new PlainTextNode('1990`s')])
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

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('{: Game')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date :}')])
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

    specify('Row cells', () => {
      const markup = `
Table

Game;                 Release Date
{: Chrono Trigger;    1995 :}
Chrono Cross;         1999`

      expect(Up.toAst(markup)).to.be.eql(
        new DocumentNode([
          new TableNode(
            new TableNode.Header([
              new TableNode.Header.Cell([new PlainTextNode('Game')]),
              new TableNode.Header.Cell([new PlainTextNode('Release Date')])
            ]), [
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('{: Chrono Trigger')]),
                new TableNode.Row.Cell([new PlainTextNode('1995 :}')])
              ]),
              new TableNode.Row([
                new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
                new TableNode.Row.Cell([new PlainTextNode('1999')])
              ])
            ])
        ]))
    })
  })
})
