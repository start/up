import { expect } from 'chai'
import * as Up from '../../../index'


describe("The text in an inline spoiler's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleVisibility: 'show/hide' }
      }
    })

    const node = new Up.Document([
      new Up.Paragraph([
        new Up.InlineSpoiler([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">show/hide</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(node)).to.equal(html)
  })
})


describe("The text in a spoiler block's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { toggleVisibility: 'show/hide' }
      }
    })

    const node = new Up.Document([
      new Up.SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">show/hide</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(node)).to.equal(html)
  })
})

