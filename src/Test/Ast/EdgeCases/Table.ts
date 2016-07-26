import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { TableNode } from '../../../SyntaxNodes/TableNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('A table with one column', () => {
  it('can contain cells that would otherwise be interpreted as section separator streaks', () => {
    const text = `
Here are the most common underlines for top-level headings (from most to least common):

Table:

Underline

====
####
----`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Here are the most common underlines for top-level headings "),
          new ParenthesizedNode([
            new PlainTextNode('(from most to least common)')
          ]),
          new PlainTextNode(':')
        ]),
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
          ])
      ]))
  })
})
