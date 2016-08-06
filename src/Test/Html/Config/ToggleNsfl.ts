import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'


describe("The text in an inline NSFL convention's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfl: 'show/hide' }
      }
    })

    const documentNode = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})


describe("The text in a NSFL block's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfl: 'show/hide' }
      }
    })

    const documentNode = new DocumentNode([
      new NsflBlockNode([])
    ])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(documentNode)).to.be.eql(html)
  })
})
