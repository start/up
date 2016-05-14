import { expect } from 'chai'
import { Up } from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'


describe('A single line consisting solely of "> "', () => {
  it('produces an empty blockquote node', () => {
    expect(Up.toAst('> ')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([])
      ])
    )
  })
})
