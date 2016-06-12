import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'


describe('A normal line of text', () => {
  it('produces a paragraph node containing a plain text node itself containing line of text', () => {
    expect(Up.toAst("I'm just a normal guy who eats only when it's raining outside. Also, it has to be around 70 degrees.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who eats only when it's raining outside. Also, it has to be around 70 degrees.")
      ]))
  })
})


describe('A line of text ending with an escaped line break directly followed by another line of text', () => {
  it('produce a paragraph node, not a line block node', () => {
    const text = `
Roses are red\\
Violets are blue`
    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Roses are red\nViolets are blue')
      ]))
  })
})