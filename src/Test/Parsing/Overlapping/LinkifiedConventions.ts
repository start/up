import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Emphasis overlapping a linkified spoiler', () => {
  it('splits the emphasis node', () => {
    expect(Up.parse('After you beat the Elite Four, *only [SPOILER: you* fight Gary] (http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Emphasis([
          new Up.Text('only ')
        ]),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Emphasis([
              new Up.Text('you')
            ]),
            new Up.Text(' fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A linkified spoiler overlapping highlighted text', () => {
  it('splits the inline quote node', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary (highlight: Oak][http://example.com/finalbattle] and then the credits roll).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('you fight Gary '),
            new Up.Highlight([
              new Up.Text('Oak')
            ])
          ], 'http://example.com/finalbattle')
        ]),
        new Up.Highlight([
          new Up.Text(' and then the credits roll')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A footnote that overlaps a linkified NSFL convention', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] [example.com] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new Up.Footnote([
        new Up.Text('reasonable '),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Text('and realistic')
          ], 'https://example.com')
        ])
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will think of one'),
          footnote,
          new Up.InlineNsfl([
            new Up.Link([
              new Up.Text(' example of a')
            ], 'https://example.com')
          ]),
          new Up.Text(' footnote that overlaps an inline NSFL convention.')
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
            new Up.Text('Ketchum')
          ], 'https://example.com')
        ]),
        new Up.Text(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfl([
            new Up.Link([
              new Up.Text('Gary loses to Ash'),
            ], 'https://example.com')
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})
