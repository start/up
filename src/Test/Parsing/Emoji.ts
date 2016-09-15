import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'


context('Emojis are always treated like any other other character. This includes when the emoji is within', () => {
  specify('a link URL', () => {
    expect(Up.parse("[American flag emoji](https://example.com/empojis/🇺🇸?info)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText("American flag emoji")
        ], 'https://example.com/empojis/🇺🇸?info')
      ]))
  })

  specify('regular text', () => {
    expect(Up.parse("Okay. 🙄 I'll eat the tarantula. 🕷")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})


describe('Escaped emojis', () => {
  it('are preserved appropriately (rather than split into two pieces)', () => {
    expect(Up.parse("Okay. \\🙄 I'll eat the tarantula. \\🕷")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})
