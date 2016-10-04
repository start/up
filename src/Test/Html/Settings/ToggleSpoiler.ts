import { expect } from 'chai'
import * as Up from '../../../Up'


describe("The text in an inline revealable's label", () => {
  it("uses the provided term for 'revealContent'", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { revealContent: 'show/hide' }
      }
    })

    const node = new Up.Document([
      new Up.Paragraph([
        new Up.InlineRevealable([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-revealable">'
      + '<label for="up-revealable-1" role="button">show/hide</label>'
      + '<input id="up-revealable-1" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(node)).to.equal(html)
  })
})


describe("The text in a revealable block's label", () => {
  it("uses the provided term for 'revealContent'", () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { revealContent: 'show/hide' }
      }
    })

    const node = new Up.Document([
      new Up.RevealableBlock([])
    ])

    const html =
      '<div class="up-revealable">'
      + '<label for="up-revealable-1" role="button">show/hide</label>'
      + '<input id="up-revealable-1" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(node)).to.equal(html)
  })
})

