import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'spoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-ruins-ending-1">toggle spoiler</label>'
      + '<input id="up-ruins-ending-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'spoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    const documentNode = new DocumentNode([
      new SpoilerBlockNode([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-ruins-ending-1">toggle spoiler</label>'
      + '<input id="up-ruins-ending-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})
