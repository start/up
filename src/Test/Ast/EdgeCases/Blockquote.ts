import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'
import { LineBlockNode } from '../../../SyntaxNodes/LineBlockNode'
import { Line } from '../../../SyntaxNodes/Line'


describe('A single blank blockquoted line', () => {
  it('does not require any trailing whitespace after the blockquote delimiter', () => {
    expect(Up.toAst('>')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([])
      ]))
  })

  it('may have a trailing space after the blockquote delimiter', () => {
    expect(Up.toAst('> ')).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([])
      ])
    )
  })

  it('may have a trailing tab after the blockquote delimiter', () => {
    expect(Up.toAst('>\t')).to.be.eql(
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