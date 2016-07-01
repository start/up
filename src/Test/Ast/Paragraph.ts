import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'


describe('A typical line of text', () => {
  it('produces a paragraph node', () => {
    expect(Up.toAst("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Also, it has to be around 70 degrees.")
      ]))
  })
})


describe('Paragraphs', () => {
  it('can contain inline conventions', () => {
    expect(Up.toAst("I'm just a normal guy who only eats when it's raining. Isn't *everyone* like that?")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("I'm just a normal guy who only eats when it's raining. Isn't "),
        new EmphasisNode([
          new PlainTextNode('everyone')
        ]),
        new PlainTextNode(" like that?")        
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
