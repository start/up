import { expect } from 'chai'
import Up from '../../index'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'


describe('Inside a link, a footnote', () => {
  it("'does not produce an anchor element. The footnote's sup element directly contains the footnote's reference number", () => {
    const node = new LinkNode([
      new PlainTextNode('Google'),
      new FootnoteNode([new PlainTextNode('A really old search engine.')], 2)
    ], 'https://google.com')
    expect(Up.toHtml(node)).to.be.eql('<a href="https://google.com">Google<sup id="up-footnote-reference-2" class="up-footnote-reference">2</sup></a>')
  })
})


describe('Inside a link, another link', () => {
  it("'does not produce an anchor element. The would-be anchor's contents are included directly inside the outer link", () => {
    const node = new LinkNode([
      new PlainTextNode('Google is probably not '),
      new LinkNode([new PlainTextNode('Bing')], 'https://bing.com')
    ], 'https://google.com')
    expect(Up.toHtml(node)).to.be.eql('<a href="https://google.com">Google is probably not Bing</a>')
  })
})
