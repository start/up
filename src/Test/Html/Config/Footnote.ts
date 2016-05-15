import { expect } from 'chai'
import { Up } from '../../../index'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'


describe("A footnote reference's ID, as well as the ID of the referenced footnote", () => {
  const up = new Up({
    documentName: 'reply-11'
  }) 
  
  it("are prefixed with the document name, if one was provided", () => {
    const node = new FootnoteNode([], 3)
    
    expect(up.toHtml(node)).to.be.eql(
      '<sup id="reply-11-footnote-reference-3" data-footnote-reference><a href="#reply-11-footnote-3">3</a></sup>')
  })
})