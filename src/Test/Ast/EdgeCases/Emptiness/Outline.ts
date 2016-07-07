import { expect } from 'chai'
import Up from '../../../../index'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'


describe('An empty document', () => {
  it('produces an empty document node', () => {
    expect(Up.toAst('')).to.eql(new DocumentNode())
  })
})


describe('A document with only blank lines', () => {
  it('produces an empty document node', () => {
    const text = `     

\t       
      
      
`
    expect(Up.toAst(text)).to.eql(new DocumentNode())
  })
})


describe('A paragraph consisting only of blank lines and lines consisting of empty inline conventions', () => {
  it('produces an empty document node', () => {
    const text = `     
I had too much cereal.

[NSFW: \t][NSFL:(SPOILER: \t )]

I'm never eating again.`
    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('I had too much cereal.')
        ]),
        new ParagraphNode([
          new PlainTextNode("I'm never eating again."),
        ])
      ])
      )
  })
})