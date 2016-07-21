import { expect } from 'chai'
import Up from '../../../../index'
import { DocumentNode } from '../../../../SyntaxNodes/DocumentNode'


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