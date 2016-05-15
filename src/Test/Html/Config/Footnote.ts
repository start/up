import { expect } from 'chai'
import { Up } from '../../../index'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'


describe("A footnote reference's ID (as well as the ID of the footnote it points to)", () => {
  it("are prefixed with the document name, if one was provided", () => {
    const up = new Up({
      documentName: 'reply-11'
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="reply-11-footnote-reference-3" data-footnote-reference><a href="#reply-11-footnote-3">3</a></sup>')
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
      '<sup id="footnote::reference::3" data-footnote-reference><a href="#footnote::3">3</a></sup>')
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
      '<sup id="reply::11::footnote::reference::3" data-footnote-reference><a href="#reply::11::footnote::3">3</a></sup>')
  })
})


describe("A footnote reference's ID", () => {
  it('uses the provided term for "footnote reference"', () => {
    const up = new Up({
      i18n: {
        terms: { footnoteReference: 'fn ref' }
      }
    })
    
    const node = new FootnoteNode([], 3)

    expect(up.toHtml(node)).to.be.eql(
      '<sup id="fn-ref-3" data-footnote-reference><a href="#footnote-3">3</a></sup>')
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
      '<sup id="footnote-reference-3" data-footnote-reference><a href="#fn-3">3</a></sup>')
  })
})