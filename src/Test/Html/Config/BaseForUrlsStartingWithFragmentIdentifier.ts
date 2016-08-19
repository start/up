import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'



describe('The "baseForUrlsStartingWithFragmentIdentifier" setting', () => {
  const up = new Up({
    baseForUrlsStartingWithHashMark: 'https://example.com/page'
  })

  it("does not affect a footnote reference's link to its footnote", () => {
    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("does not affect a footnote's link back to its reference", () => {
    const document = new UpDocument([
      new FootnoteBlock([
        new Footnote([
          new PlainText("Arwings"),
        ], 2),
        new Footnote([
          new PlainText("Killer Bees"),
        ], 3),
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})
