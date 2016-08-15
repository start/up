import { expect } from 'chai'
import Up from '../../../../index'
import { UpDocument } from '../../../../SyntaxNodes/UpDocument'


describe('An empty document', () => {
  it('produces an empty document object', () => {
    expect(Up.toDocument('')).to.eql(new UpDocument([]))
  })
})


describe('A document with only blank lines', () => {
  it('produces an empty document object', () => {
    const markup = `     

\t       
      
      
`
    expect(Up.toDocument(markup)).to.eql(new UpDocument([]))
  })
})
