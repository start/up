import { expect } from 'chai'
import { Up } from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'


describe('1 blank line between paragraphs', () => {
  it('simply provides separation, producing no syntax node itself', () => {
    const text = `Pokemon Moon has a Mew under a truck.

Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })
})

describe('2 blank lines between paragraphs', () => {
  it('simply provides separation, producing no syntax node itself', () => {
    const text = `Pokemon Moon has a Mew under a truck.

\t
Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })
})
