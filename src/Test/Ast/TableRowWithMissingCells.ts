import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


context('When a cell in a table row ommitted', () => {
  specify('an empty cell is appended to the row', () => {
    const text = `
Table:

Game;               Release Date

Final Fantasy;      1987
Final Fantasy II

Chrono Trigger;     1995
Chrono Cross;       1999`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy')]),
              new TableNode.Row.Cell([new PlainTextNode('1987')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Final Fantasy II')]),
              new TableNode.Row.Cell([])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Cross')]),
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ]),
          ])
      ]))
  })
})