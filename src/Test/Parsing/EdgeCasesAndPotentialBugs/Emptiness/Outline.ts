import { expect } from 'chai'
import * as Up from '../../../../Main'


describe('An empty document', () => {
  it('produces an empty document object', () => {
    expect(Up.parse('')).to.deep.equal(new Up.Document([]))
  })
})


describe('A document with only blank lines', () => {
  it('produces an empty document object', () => {
    const markup = `     

\t       
      
      
`
    expect(Up.parse(markup)).to.deep.equal(new Up.Document([]))
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
    expect(Up.parse(markup)).to.deep.equal(new Up.Document([]))
  })
})
