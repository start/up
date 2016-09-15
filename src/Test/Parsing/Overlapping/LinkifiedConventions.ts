import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'


describe('Emphasis overlapping a linkified spoiler', () => {
  it('splits the emphasis node', () => {
    expect(Up.parse('After you beat the Elite Four, *only [SPOILER: you* fight Gary] (http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.Emphasis([
          new Up.PlainText('only ')
        ]),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.Emphasis([
              new Up.PlainText('you')
            ]),
            new Up.PlainText(' fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('A linkified spoiler overlapping quoted text', () => {
  it('splits the inline quote node', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary "Ketchum](http://example.com/finalbattle) and then the credits roll".')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('you fight Gary '),
            new Up.InlineQuote([
              new Up.PlainText('Ketchum')
            ])
          ], 'http://example.com/finalbattle')
        ]),
        new Up.InlineQuote([
          new Up.PlainText(' and then the credits roll')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('A footnote that overlaps a linkified NSFL convention', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] [example.com] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new Up.Footnote([
        new Up.PlainText('reasonable '),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.PlainText('and realistic')
          ], 'https://example.com')
        ])
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Eventually, I will think of one'),
          footnote,
          new Up.InlineNsfl([
            new Up.Link([
              new Up.PlainText(' example of a')
            ], 'https://example.com')
          ]),
          new Up.PlainText(' footnote that overlaps an inline NSFL convention.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A linkified NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] (example.com) is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineNsfl([
          new Up.Link([
            new Up.PlainText('Ketchum')
          ], 'https://example.com')
        ]),
        new Up.PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfl([
            new Up.Link([
              new Up.PlainText('Gary loses to Ash'),
            ], 'https://example.com')
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})
