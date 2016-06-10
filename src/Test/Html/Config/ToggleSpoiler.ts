import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'


describe("The text in a spoiler's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleSpoiler: 'show/hide' }
      }
    })

    const node = new SpoilerNode([])

    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">show/hide</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
