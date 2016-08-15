import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { OutlineSeparatorNode } from '../../../SyntaxNodes/OutlineSeparatorNode'


describe('A single blank blockquoted line', () => {
  it('does not require any trailing whitespace after the blockquote delimiter', () => {
    expect(Up.toAst('>')).to.be.eql(
      new UpDocument([
        new BlockquoteNode([])
      ]))
  })

  it('may have a trailing space after the blockquote delimiter', () => {
    expect(Up.toAst('> ')).to.be.eql(
      new UpDocument([
        new BlockquoteNode([])
      ]))
  })

  it('may have a trailing tab after the blockquote delimiter', () => {
    expect(Up.toAst('>\t')).to.be.eql(
      new UpDocument([
        new BlockquoteNode([])
      ]))
  })
})


describe('A single line blockquote', () => {
  it('can be sandwched by identical outline separator streaks without producing a heading', () => {
    const markup = `
---------------
> I choose you!
---------------`

    expect(Up.toAst(markup)).to.be.eql(
      new UpDocument([
        new OutlineSeparatorNode(),
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode('I choose you!')
          ])
        ]),
        new OutlineSeparatorNode()
      ]))
  })
})
