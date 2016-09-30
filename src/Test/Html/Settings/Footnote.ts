import { expect } from 'chai'
import * as Up from '../../../Up'


describe("A footnote's ID", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up.Transformer({
      rendering: {
        terms: {
          footnote: 'fn'
        }
      }
    })

    const node = new Up.Document([
      new Up.FootnoteBlock([
        new Up.Footnote([
          new Up.Text("Arwings"),
        ], { referenceNumber: 2 }),
        new Up.Footnote([
          new Up.Text("Killer Bees"),
        ], { referenceNumber: 3 }),
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-fn-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-fn-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(node)).to.equal(html)
  })
})


describe("The ID of the footnote referenced by a footnote reference", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up.Transformer({
      rendering: {
        terms: {
          footnote: 'fn'
        }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-fn-3">3</a></sup></p>')
  })
})
