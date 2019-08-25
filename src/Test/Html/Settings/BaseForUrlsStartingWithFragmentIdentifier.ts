import { expect } from 'chai'
import * as Up from '../../../Main'



describe('The "baseForUrlsStartingWithFragmentIdentifier" setting', () => {
  const up = new Up.Up({
    parsing: {
      baseForUrlsStartingWithHashMark: 'https://example.com/page'
    }
  })

  it("does not affect a footnote reference's link to its footnote", () => {
    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("does not affect a footnote's link back to its reference", () => {
    const document = new Up.Document([
      new Up.FootnoteBlock([
        new Up.Footnote([
          new Up.Text("Arwings")
        ], { referenceNumber: 2 }),
        new Up.Footnote([
          new Up.Text("Killer Bees")
        ], { referenceNumber: 3 })
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })
})
