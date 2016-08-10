import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'



describe('The "baseForUrlsStartingWithFragmentIdentifier" setting', () => {
  const up = new Up({
    baseForUrlsStartingWithHashMark: 'https://example.com/page'
  })

  it("does not affect a footnote reference's link to its footnote", () => {
    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup></p>')
  })

  it("does not affect a footnote's link back to its reference", () => {
    const document = new DocumentNode([
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
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
