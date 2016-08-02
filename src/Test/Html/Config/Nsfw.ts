import { expect } from 'chai'
import Up from '../../../index'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'


describe("The ID of an inline NSFW convention's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })

    const node = new InlineNsfwNode([])

    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="up-explicit-1">toggle NSFW</label>'
      + '<input id="up-explicit-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a NSFW block's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })

    const node = new NsfwBlockNode([])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-explicit-1">toggle NSFW</label>'
      + '<input id="up-explicit-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
