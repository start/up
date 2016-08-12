import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('The term that represents chart conventions', () => {
  const up = new Up({
    terms: { chart: 'data' }
  })

  it('comes from the "chart" config term', () => {
    const markup = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new TableNode(
          new TableNode.Header([
            new TableNode.Header.Cell([]),
            new TableNode.Header.Cell([new PlainTextNode('Release Date')])
          ]), [
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1995')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Trigger')])),
            new TableNode.Row([
              new TableNode.Row.Cell([new PlainTextNode('1999')])
            ], new TableNode.Header.Cell([new PlainTextNode('Chrono Cross')]))
          ])
      ]))
  })

  it('is case-insensitive even when custom', () => {
    const uppercase = `
Data:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    const mixedCase = `
dAtA:

                  Release Date
Chrono Trigger;   1995
Chrono Cross;     1999`

    expect(up.toAst(uppercase)).to.be.eql(up.toAst(mixedCase))
  })
})
