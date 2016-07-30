import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context("In a table's label line, when the term for 'table' is followed by a colon,", () => {
  specify('the colon can be folowed by a caption', () => {
    const text = `
Table: Games in the Chrono series

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
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
          ],
          new TableNode.Caption([
            new PlainTextNode('Games in the Chrono series')
          ]))
      ]))
  })
})


describe("A table caption", () => {
  it('is evaluated for inline conventions', () => {
    const text = `
Table: Games in the *Chrono* series

Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
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
          ],
          new TableNode.Caption([
            new PlainTextNode('Games in the '),
            new EmphasisNode([
              new PlainTextNode('Chrono')
            ]),
            new PlainTextNode(' series'),
          ]))
      ]))
  })
})


describe("A table with a caption (just like a table without a caption)", () => {
  it('does not need to have a blank line before the header row', () => {
    const text = `
Table: Games in the Chrono series
Game;           Release Date

Chrono Trigger; 1995
Chrono Cross;   1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
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
          ],
          new TableNode.Caption([
            new PlainTextNode('Games in the Chrono series')
          ]))
      ]))
  })

  it('does not need any rows', () => {
    const text = `
Table: Games in the Chrono series

Game;           Release Date`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]),
          [],
          new TableNode.Caption([
            new PlainTextNode('Games in the Chrono series')
          ]))
      ]))
  })
})


context("When there isn't a colon after the term for 'table' in a table's label line", () => {
  specify('the table cannot have a caption', () => {
    const text = `
Table the proposal.

Do it now; I'm tired of waiting.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Table the proposal.')]),
        new ParagraphNode([new PlainTextNode("Do it now; I'm tired of waiting.")]),
      ]))
  })
})
