import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'


describe("The text in an inline NSFL convention's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      terms: { toggleNsfl: 'show/hide' }
    })

    const document = new UpDocument([
      new ParagraphNode([
        new InlineNsflNode([])
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
      terms: { toggleNsfl: 'show/hide' }
    })

    const document = new UpDocument([
      new NsflBlockNode([])
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
