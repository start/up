import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('The term that represents table conventions', () => {
  const up = new Up({
    i18n: {
      terms: { table: 'data' }
    }
  })

  it('comes from the "table" config term', () => {
    const markup = `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toAst(markup)).to.be.eql(
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
          ])
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const uppercase = `
Data:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const mixedCase = `
dAtA:

Game;             Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
  })
})
