import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { NsflBlock } from '../../../SyntaxNodes/NsflBlock'


describe("The text in an inline NSFL convention's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      terms: {
        output: {
          toggleNsfl: 'show/hide'
        }
      }
    })

    const document = new UpDocument([
      new Paragraph([
        new InlineNsfl([])
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

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The text in a NSFL block's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      terms: {
        output: {
          toggleNsfl: 'show/hide'
        }
      }
    })

    const document = new UpDocument([
      new NsflBlock([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" role="button" type="checkbox">'
      + '<div role="alert"></div>'
      + '</div>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})
