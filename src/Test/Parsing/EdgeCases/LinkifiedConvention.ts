import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'


describe("An almost-linkified spoiler (with whitespace between its content and URL) terminated early due to a space in its URL", () => {
  it('can contain an unclosed square bracket without affecting a linkified spoiler with a square bracketed URL that follows it', () => {
    expect(Up.toDocument('(SPOILER: Ash dies) (https://example.com/ending:[ has all the info) ... [SPOILER: anyway, go here instead] [https://example.com/happy]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('Ash dies')
        ]),
        new PlainText(' '),
        new NormalParenthetical([
          new PlainText('('),
          new Link([
            new PlainText('example.com/ending:[')
          ], 'https://example.com/ending:['),
          new PlainText(' has all the info)')
        ]),
        new PlainText(' ... '),
        new InlineSpoiler([
          new Link([
            new PlainText('anyway, go here instead')
          ], 'https://example.com/happy')
        ])
      ]))
  })
})
