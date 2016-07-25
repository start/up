import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'


describe("An almost-linkified spoiler (with whitespace between its content and URL) terminated early due to a space in its URL", () => {
  it('can contain an unclosed square bracket without affecting a linkified spoiler with a square bracketed URL that follows it', () => {
    expect(Up.toAst('(SPOILER: Ash dies) (https://example.com/ending:[ has all the info) ... [anyway, go here instead] [https://example.com/happy]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('Ash dies')
        ]),
        new PlainTextNode(' '),
        new ParenthesizedNode([
          new PlainTextNode('('),
          new LinkNode([
            new PlainTextNode('example.com/ending:[')
          ], 'https://example.com/ending:['),
          new PlainTextNode(' has all the info)')
        ]),
        new PlainTextNode(' ... '),
        new LinkNode([
          new PlainTextNode('anyway, go here instead'),
        ], 'https://example.com/happy')
      ]))
  })
})
