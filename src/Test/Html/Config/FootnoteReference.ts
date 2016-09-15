import { expect } from 'chai'
import Up = require('../../../index')


describe("A footnote reference's ID", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      rendering: {
        terms: {
          footnoteReference: 'ref'
        }
      }
    })

    const document = new Up.Document([
      new Up.Paragraph([
        new Up.Footnote([], { referenceNumber: 3 })
      ])
    ])

    expect(up.render(document)).to.equal(
      '<p><sup class="up-footnote-reference" id="up-ref-3"><a href="#up-footnote-3">3</a></sup></p>')
  })
})


describe("The ID of the footnote reference referencing the footnote", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      rendering: {
        terms: {
          footnoteReference: 'ref'
        }
      }
    })

    const document = new Up.Document([
      new Up.FootnoteBlock([
        new Up.Footnote([
          new Up.PlainText("Arwings")
        ], { referenceNumber: 2 }),
        new Up.Footnote([
          new Up.PlainText("Killer Bees")
        ], { referenceNumber: 3 })
      ])
    ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-ref-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-ref-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.render(document)).to.equal(html)
  })
})
