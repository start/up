import { expect } from 'chai'
import Up from '../../../../index'
import { UpDocument } from '../../../../SyntaxNodes/UpDocument'


describe('An empty document', () => {
  it('produces an empty document object', () => {
    expect(Up.parse('')).to.eql(new UpDocument([]))
  })
})


describe('A document with only blank lines', () => {
  it('produces an empty document object', () => {
    const markup = `     

\t       
      
      
`
    expect(Up.parse(markup)).to.eql(new UpDocument([]))
  })
})


describe('A document with only escaped blank lines', () => {
  it('produces an empty document object', () => {
    const markup = `     
 \\ \t
\\\t       
\\   \\ \\       
\\\t    \\       
 \\ `
    expect(Up.parse(markup)).to.eql(new UpDocument([]))
  })
})
