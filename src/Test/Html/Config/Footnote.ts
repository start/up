import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe("A footnote's ID", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up({
      terms: { footnote: 'fn' }
    })

    const node = new UpDocument([
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
      + '<dt id="up-fn-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-fn-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of the footnote referenced by a footnote reference", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up({
      terms: { footnote: 'fn' }
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-fn-3">3</a></sup></p>')
  })
})
