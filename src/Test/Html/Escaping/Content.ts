import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'


describe('Inside plain text nodes, all instances of < and &', () => {
  it('are escaped by replacing them with "&lt;" and "&amp;", respectively', () => {
    const node = new PlainTextNode('4 & 5 < 10, and 6 & 7 < 10. Coincidence?')
    expect(Up.toHtml(node)).to.be.eql('4 &amp; 5 &lt; 10, and 6 &amp; 7 &lt; 10. Coincidence?')
  })
})


describe('Inside a plain text node, >, \', and "', () => {
  it('are preserved', () => {
    const text = 'John said, "1 and 2 > 0. I can\'t believe it."'
    const node = new PlainTextNode(text)
    expect(Up.toHtml(node)).to.be.eql(text)
  })
})


describe("Inside a spoiler's label, all instances of < and &", () => {
  it("are escaped", () => {
    const up = new Up({
      i18n: {
        terms: { toggleSpoiler: '<_< & show & hide' }
      }
    })

    const node = new SpoilerNode([])

    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">&lt;_&lt; &amp; show &amp; hide</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
