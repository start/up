import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'spoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    const node = new InlineSpoilerNode([])

    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-ruins-ending-1">toggle spoiler</label>'
      + '<input id="up-ruins-ending-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})