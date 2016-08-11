import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'



describe("The words in a footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '::'
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up::footnote::reference::3"><a href="#up::footnote::3">3</a></sup></p>')
  })
})


describe("The words in a footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '::'
      }
    })

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
      + '<dt id="up::footnote::2"><a href="#up::footnote::reference::2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up::footnote::3"><a href="#up::footnote::reference::3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The words in the ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '_'
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new InlineSpoilerNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-spoiler up-revealable">'
      + '<label for="up_spoiler_1">toggle spoiler</label>'
      + '<input id="up_spoiler_1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The words in the ID of an inline NSFW conventions's checkbox (on both the checkbox and the label)", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '_'
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new InlineNsfwNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfw up-revealable">'
      + '<label for="up_nsfw_1">toggle NSFW</label>'
      + '<input id="up_nsfw_1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("The words in the ID of an inline NSFL conventions's checkbox (on both the checkbox and the label)", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '_'
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new InlineNsflNode([])
      ])
    ])

    const html =
      '<p>'
      + '<span class="up-nsfl up-revealable">'
      + '<label for="up_nsfl_1">toggle NSFL</label>'
      + '<input id="up_nsfl_1" type="checkbox">'
      + '<span></span>'
      + '</span>'
      + '</p>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe("In a footnote reference, separate words in the provided document name", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    const up = new Up({
      documentName: 'reply 11',
      i18n: {
        wordDelimiterForGeneratedIds: '::'
      }
    })

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="reply::11::footnote::reference::3"><a href="#reply::11::footnote::3">3</a></sup></p>')
  })
})


describe("In a footnote block, separate words in the provided document name", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      documentName: 'reply 11',
      i18n: {
        wordDelimiterForGeneratedIds: '::'
      }
    })

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
      + '<dt id="reply::11::footnote::2"><a href="#reply::11::footnote::reference::2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply::11::footnote::3"><a href="#reply::11::footnote::reference::3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})


describe('In a footnote reference, separate words in the provided term for "footnote reference"', () => {
  it('are separated by the ID word delimiter in a footnote reference ID', () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '_',
        terms: { footnoteReference: 'fn ref' }
      }
    })

    const document = new DocumentNode([
      new ParagraphNode([
        new FootnoteNode([], 3)
      ])
    ])

    expect(up.toHtml(document)).to.be.eql(
      '<p><sup class="up-footnote-reference" id="up_fn_ref_3"><a href="#up_footnote_3">3</a></sup></p>')
  })
})


describe('In a footnote block, separate words in the provided term for "footnote reference"', () => {
  it('are separated by the ID word delimiter in a footnote reference ID', () => {
    const up = new Up({
      i18n: {
        wordDelimiterForGeneratedIds: '_',
        terms: { footnoteReference: 'fn ref' }
      }
    })

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
      + '<dt id="up_footnote_2"><a href="#up_fn_ref_2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up_footnote_3"><a href="#up_fn_ref_3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(document)).to.be.eql(html)
  })
})

