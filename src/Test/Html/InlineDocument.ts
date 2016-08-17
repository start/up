import { expect } from 'chai'
import Up from '../../index'
import { InlineUpDocument } from '../../SyntaxNodes/InlineUpDocument'


describe('An empty inline document', () => {
  it('does not produce any HTML on its own', () => {
    expect(Up.toInlineHtml(new InlineUpDocument([]))).to.be.eql('')
  })
})
