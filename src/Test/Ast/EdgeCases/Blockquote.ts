import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('A single line consisting solely of "> "', () => {
  it('produces an empty blockquote node', () => {
    expect(Up.toAst('> ')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([])
      ])
    )
  })
})


describe('A single line blockquote', () => {
  it('can be sandwched by identical section separator streaks without producing a heading', () => {
    const text = `
---------------
> I choose you!
---------------`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SectionSeparatorNode(),
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('I choose you!')
          ])
        ]),
        new SectionSeparatorNode()
      ]))
  })
})