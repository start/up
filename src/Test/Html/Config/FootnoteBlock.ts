import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe("A footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(Up.toHtml(node)).to.be.eql(html)
  })

  it("are prefixed with the provided document name", () => {
    const up = new Up({
      documentName: 'reply-11'
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply-11-footnote-2"><a href="#reply-11-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply-11-footnote-3"><a href="#reply-11-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })

  it("are not prefixed with a document name if a blank name was provided", () => {
    const up = new Up({
      documentName: ' \t'
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="footnote-2"><a href="#footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="footnote-3"><a href="#footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The words in a footnote's ID (as well as the ID of the footnote reference pointing to it)", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '::'
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up::footnote::2"><a href="#up::footnote::reference::2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up::footnote::3"><a href="#up::footnote::reference::3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("Separate words in the provided document name", () => {
  it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      documentName: 'reply 11',
      i18n: {
        idWordDelimiter: '::'
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="reply::11::footnote::2"><a href="#reply::11::footnote::reference::2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="reply::11::footnote::3"><a href="#reply::11::footnote::reference::3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("A footnote's ID", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'fn' }
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-fn-2"><a href="#up-footnote-reference-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-fn-3"><a href="#up-footnote-reference-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of the footnote reference referencing the footnote", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      i18n: {
        terms: { footnoteReference: 'ref' }
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up-footnote-2"><a href="#up-ref-2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up-footnote-3"><a href="#up-ref-3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe('Separate words in the provided term for "footnote reference"', () => {
  it('are separated by the ID word delimiter in a footnote reference ID', () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '_',
        terms: { footnoteReference: 'fn ref' }
      }
    })
    
    const node =
      new FootnoteBlockNode([
        new FootnoteNode([
          new PlainTextNode("Arwings"),
        ], 2),
        new FootnoteNode([
          new PlainTextNode("Killer Bees"),
        ], 3),
      ])

    const html =
      '<dl class="up-footnotes">'
      + '<dt id="up_footnote_2"><a href="#up_fn_ref_2">2</a></dt><dd>Arwings</dd>'
      + '<dt id="up_footnote_3"><a href="#up_fn_ref_3">3</a></dt><dd>Killer Bees</dd>'
      + '</dl>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
