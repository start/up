import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'


describe('Emojis in a paragraph', () => {
  it('are treated like any other other regular character', () => {
    expect(Up.toAst("Okay. 🙄 I'll eat the tarantula. 🕷")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})


describe('Escaped emojis', () => {
  it('are preserved appropriately (rather than split into two pieces)', () => {
    expect(Up.toAst("Okay. \\🙄 I'll eat the tarantula. \\🕷")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})


describe('Emojis in a link URL', () => {
  it('are treated like any other other regular character', () => {
    expect(Up.toAst("[American flag emoji](https://example.com/empojis/🇺🇸?info)")).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode("American flag emoji")
        ], 'https://example.com/empojis/🇺🇸?info')
      ]))
  })
})