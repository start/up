import { expect } from 'chai'
import { Up } from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Link } from '../../SyntaxNodes/Link'


context('Emojis are always treated like any other other character. This includes when the emoji is within', () => {
  specify('a link URL', () => {
    expect(Up.parse("[American flag emoji](https://example.com/empojis/🇺🇸?info)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText("American flag emoji")
        ], 'https://example.com/empojis/🇺🇸?info')
      ]))
  })

  specify('regular text', () => {
    expect(Up.parse("Okay. 🙄 I'll eat the tarantula. 🕷")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})


describe('Escaped emojis', () => {
  it('are preserved appropriately (rather than split into two pieces)', () => {
    expect(Up.parse("Okay. \\🙄 I'll eat the tarantula. \\🕷")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText("Okay. 🙄 I'll eat the tarantula. 🕷")
      ]))
  })
})
