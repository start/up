import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { NsfwBlockNode } from '../../../SyntaxNodes/NsfwBlockNode'


describe("The text in an inline NSFW convention's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      terms: { toggleNsfw: 'show/hide' }
    })

    const document = new UpDocument([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">show/hide</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The text in a NSFW block's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      terms: { toggleNsfw: 'show/hide' }
    })

    const document = new UpDocument([
      new NsfwBlockNode([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">show/hide</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})
