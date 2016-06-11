import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('All instances of "<" and "&" inside a plain text node', () => {
  it('are replaced with "&lt;" and "&amp;", respectively', () => {
    const node = new PlainTextNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
    expect(Up.toHtml(node)).to.be.eql('4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?')
  })
})
