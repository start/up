import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'


context('Emojis are always treated like any other other character. This includes when the emoji is within', () => {
  specify('a link URL', () => {
    expect(Up.toDocument("[American flag emoji](https://example.com/empojis/🇺🇸?info)")).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode("American flag emoji")
        ], 'https://example.com/empojis/🇺🇸?info')
      ]))
  })

  specify('regular text', () => {
    expect(Up.toDocument("Okay. 🙄 I'll eat the tarantula. 🕷")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})


describe('Escaped emojis', () => {
  it('are preserved appropriately (rather than split into two pieces)', () => {
    expect(Up.toDocument("Okay. \\🙄 I'll eat the tarantula. \\🕷")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})
