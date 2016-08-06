import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'


describe("The ID of an inline NSFW convention's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-explicit-1">toggle NSFW</label>'
      + '<input id="up-explicit-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The ID of a NSFW block's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfw: 'explicit' }
      }
    })

    const documentNode = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-explicit-1">toggle NSFW</label>'
      + '<input id="up-explicit-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})
