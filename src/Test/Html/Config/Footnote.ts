import { expect } from 'chai'
import Up from '../../../index'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'


describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("are prefixed with the default document name 'up' if one wasn't provided", () => {   
    const node = new FootnoteNode([], 3)

    expect(Up.toHtml(node)).to.be.eql(
      '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>')
  })

  it("are prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="reply-11-footnote-reference-3" class="up-footnote-reference"><a href="#reply-11-footnote-3">3</a></sup>')
  })

  it("are not prefixed with a document name if a blank one was provided", () => {
    const up = new Up({
      documentName: ''
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="footnote-reference-3" class="up-footnote-reference"><a href="#footnote-3">3</a></sup>')
  })
})


describe("The words in a footnote reference's ID (as well as the ID of the footnote it points to)", () => {
it("are delimited by specified the ID word delimiter", () => {
    const up = new Up({
      i18n: {
        idWordDelimiter: '::'
      }
    })

    const node = new FootnoteNode([], 3)
    
    expect(up.toHtml(node)).to.be.eql(
      '<sup id="up::footnote::reference::3" class="up-footnote-reference"><a href="#up::footnote::3">3</a></sup>')
  })
})


describe("Separate words in the provided document name", () => {
it("are delimited by specified the ID word delimiter", () => {
    const node = new FootnoteNode([], 3)

    const up = new Up({
      documentName: 'reply 11',
      i18n: {
        idWordDelimiter: '::'
      }
    })

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="reply::11::footnote::reference::3" class="up-footnote-reference"><a href="#reply::11::footnote::3">3</a></sup>')
  })
})


describe("A footnote reference's ID", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      i18n: {
        terms: { footnoteReference: 'ref' }
      }
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="up-ref-3" class="up-footnote-reference"><a href="#up-footnote-3">3</a></sup>')
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
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="up_fn_ref_3" class="up-footnote-reference"><a href="#up_footnote_3">3</a></sup>')
  })
})


describe("The ID of the footnote referenced by a footnote reference", () => {
  it('uses the provided term for "footnote"', () => {
    const up = new Up({
      i18n: {
        terms: { footnote: 'fn' }
      }
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="up-footnote-reference-3" class="up-footnote-reference"><a href="#up-fn-3">3</a></sup>')
  })
})
