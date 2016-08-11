import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe("A footnote's ID", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'fn' }
      }
    })

    const node = new DocumentNode([
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
      + '<dt id="up-fn-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-fn-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of the footnote referenced by a footnote reference", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'fn' }
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up-footnote-reference-3"><a href="#up-fn-3">3</a></sup></p>')
  })
})
