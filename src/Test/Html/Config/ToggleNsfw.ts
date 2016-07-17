import { expect } from 'chai'
import Up from '../../../index'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'


describe("The text in an inline NSFW convention's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfw: 'show/hide' }
      }
    })

    const node = new InlineNsfwNode([])

    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">show/hide</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
