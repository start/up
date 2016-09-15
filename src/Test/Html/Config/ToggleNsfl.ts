import { expect } from 'chai'
import Up = require('../../../index')


describe("The text in an inline NSFL convention's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      rendering: {
        terms: { toggleNsfl: 'show/hide' }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.InlineNsfl([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<span role="alert"></span>'
      + '</span>'
      + '</p>'

    expect(up.render(document)).to.equal(html)
  })
})


describe("The text in a NSFL block's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      rendering: {
        terms: { toggleNsfl: 'show/hide' }
      }
    })

    const document = new Up.Document([
      new Up.NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.render(document)).to.equal(html)
  })
})
