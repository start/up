import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { SpoilerBlock } from '../../../SyntaxNodes/SpoilerBlock'


describe("The text in an inline spoiler's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up({
      terms: {
        output: {
          toggleSpoiler: 'show/hide'
        }
      }
    })

    const node = new UpDocument([
      new Paragraph([
        new InlineSpoiler([])
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

    expect(up.toHtml(node)).to.equal(html)
  })
})


describe("The text in a spoiler block's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up({
      terms: {
        output: {
          toggleSpoiler: 'show/hide'
        }
      }
    })

    const node = new UpDocument([
      new SpoilerBlock([])
    ])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">show/hide</label>'
      + '<input id="up-spoiler-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(node)).to.equal(html)
  })
})

