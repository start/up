import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'


describe("The text in an inline NSFW convention's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfw: 'show/hide' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">show/hide</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The text in a NSFW block's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfw: 'show/hide' }
      }
    })

    const documentNode = new DocumentNode([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">show/hide</label>'
      + '<input id="up-nsfw-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})
