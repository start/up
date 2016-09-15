import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe("An almost-linkified spoiler (with whitespace between its content and URL) terminated early due to a space in its URL", () => {
  it('can contain an unclosed square bracket without affecting a linkified spoiler with a square bracketed URL that follows it', () => {
    expect(Up.parse('(SPOILER: Ash dies) (https://example.com/ending:[ has all the info) ... [SPOILER: anyway, go here instead] [https://example.com/happy]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('Ash dies')
        ]),
        new Up.PlainText(' '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Link([
            new Up.PlainText('example.com/ending:[')
          ], 'https://example.com/ending:['),
          new Up.PlainText(' has all the info)')
        ]),
        new Up.PlainText(' … '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('anyway, go here instead')
          ], 'https://example.com/happy')
        ])
      ]))
  })
})
