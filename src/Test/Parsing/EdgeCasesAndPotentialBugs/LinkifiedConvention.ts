import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe("An almost-linkified spoiler (with whitespace between its content and URL) terminated early due to a space in its URL", () => {
  it('can contain an unclosed square bracket without affecting a linkified spoiler with a square bracketed URL that follows it', () => {
    expect(Up.parse('(SPOILER: Ash dies) (https://example.com/ending:[ has all the info) ... [SPOILER: anyway, go here instead] [https://example.com/happy]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.Text('Ash dies')
        ]),
        new Up.Text(' '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Link([
            new Up.Text('example.com/ending:[')
          ], 'https://example.com/ending:['),
          new Up.Text(' has all the info)')
        ]),
        new Up.Text(' … '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.Text('anyway, go here instead')
          ], 'https://example.com/happy')
        ])
      ]))
  })
})
