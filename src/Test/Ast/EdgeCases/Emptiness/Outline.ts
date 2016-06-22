import { expect } from 'chai'
import Up from '../../../../index'
import { insideDocumentAndParagraph } from '../../Helpers'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../../../SyntaxNodes/LinkNode'
import { EmphasisNode } from '../../../../SyntaxNodes/EmphasisNode'


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

[NSFW: \t][NSFL:]

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


describe('A document consisting only of blank lines and lines consisting of empty inline conventions', () => {
  it('produces an empty document node', () => {
    const text = `     

[SPOILER: ]
[NSFW: \t][NSFL:]
\t     

[]{}`

    expect(Up.toAst(text)).to.be.eql(new DocumentNode([]))
  })
})