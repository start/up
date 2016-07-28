import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('A table header consisting only of a semicolon', () => {
  it('consists of a single empty cell', () => {
    const text = `
Table:

;

Chrono Trigger
Starcraft`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
              new TableNode.Header.Cell([])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
            ])
          ])
      ]))
  })
})


describe('A table row consisting only of a semicolon', () => {
  it('consists of a single empty cell', () => {
    const text = `
Table:

Game

Chrono Trigger
;
Starcraft`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([new PlainTextNode('Game')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Chrono Trigger')]),
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([])
            ]),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('Starcraft')]),
            ])
          ])
      ]))
  })
})
