import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe("A footnote reference's ID", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      terms: { footnoteReference: 'ref' }
    })

    const document = new UpDocument([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up-ref-3"><a href="#up-footnote-3">3</a></sup></p>')
  })
})


describe("The ID of the footnote reference referencing the footnote", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      terms: { footnoteReference: 'ref' }
    })

    const document = new UpDocument([
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings")
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees")
        ], 3)
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-ref-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-ref-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})
