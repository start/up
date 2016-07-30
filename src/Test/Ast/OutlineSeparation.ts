import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'


context('Between paragraphs, 1 or 2 empty or blank lines provide separation without producing any syntax nodes of their own. Specifically:', () => {
  specify('1 empty line', () => {
    const text = `
Pokemon Moon has a Mew under a truck.

Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 empty lines', () => {
    const text = `
Pokemon Moon has a Mew under a truck.


Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('1 blank line', () => {
    const text = `
Pokemon Moon has a Mew under a truck.
 \t \t 
Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('2 blank lines', () => {
    const text = `
Pokemon Moon has a Mew under a truck.
  \t \t 
\t \t 
Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('1 empty and 1 blank line', () => {
    const text = `
Pokemon Moon has a Mew under a truck.

\t \t 
Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })

  specify('1 blank and 1 empty line', () => {
    const text = `
Pokemon Moon has a Mew under a truck.
\t \t 

Pokemon Sun is a truck.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([new PlainTextNode('Pokemon Moon has a Mew under a truck.')]),
        new ParagraphNode([new PlainTextNode('Pokemon Sun is a truck.')]),
      ]))
  })
})
