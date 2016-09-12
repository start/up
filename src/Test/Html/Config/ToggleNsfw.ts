import { expect } from 'chai'
import { Up } from '../../../Up'
import { Document } from '../../../SyntaxNodes/Document'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { NsfwBlock } from '../../../SyntaxNodes/NsfwBlock'


describe("The text in an inline NSFW convention's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      rendering: {
        terms: { toggleNsfw: 'show/hide' }
      }
    })

    const document = new Document([
      new Paragraph([
        new InlineNsfw([])
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

    expect(up.render(document)).to.equal(html)
  })
})


describe("The text in a NSFW block's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up({
      rendering: {
        terms: {   toggleNsfw: 'show/hide'}
      }
    })

    const document = new Document([
      new NsfwBlock([])
    ])

    const html =
      '<div class="up-nsfw up-revealable">'
      + '<label for="up-nsfw-1">show/hide</label>'
      + '<input id="up-nsfw-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })
})
