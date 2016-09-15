import { expect } from 'chai'
import * as Up from '../../../index'


describe("The text in an inline NSFW convention's label", () => {
  it("uses the provided term for 'toggleNsfw'", () => {
    const up = new Up.Converter({
      rendering: {
        terms: { toggleNsfw: 'show/hide' }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineNsfw([])
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
    const up = new Up.Converter({
      rendering: {
        terms: {   toggleNsfw: 'show/hide'}
      }
    })

    const document = new Up.Document([
      new Up.NsfwBlock([])
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
