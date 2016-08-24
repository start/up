import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe("A footnote reference's ID", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      terms: {
        output: {
          footnoteReference: 'ref'
        }
      }
    })

    const document = new UpDocument([
      new Paragraph([
        new Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.toHtml(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="up-ref-3"><a href="#up-footnote-3">3</a></sup></p>')
  })
})


describe("The ID of the footnote reference referencing the footnote", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      terms: {
        output: {
          footnoteReference: 'ref'
        }
      }
    })

    const document = new UpDocument([
      new FootnoteBlock([
        new Footnote([
          new PlainText("Arwings")
        ], { referenceNumber: 2 }),
        new Footnote([
          new PlainText("Killer Bees")
        ], { referenceNumber: 3 })
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-ref-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-ref-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.equal(html)
  })
})
