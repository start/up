import { expect } from 'chai'
import { Up } from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineQuote } from '../../../SyntaxNodes/InlineQuote'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('Emphasis overlapping a linkified spoiler', () => {
  it('splits the emphasis node', () => {
    expect(Up.parse('After you beat the Elite Four, *only [SPOILER: you* fight Gary] (http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Emphasis([
          new PlainText('only ')
        ]),
        new InlineSpoiler([
          new Link([
            new Emphasis([
              new PlainText('you')
            ]),
            new PlainText(' fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A linkified spoiler overlapping quoted text', () => {
  it('splits the inline quote node', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary "Ketchum](http://example.com/finalbattle) and then the credits roll".')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineSpoiler([
          new Link([
            new PlainText('you fight Gary '),
            new InlineQuote([
              new PlainText('Ketchum')
            ])
          ], 'http://example.com/finalbattle')
        ]),
        new InlineQuote([
          new PlainText(' and then the credits roll')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A footnote that overlaps a linkified NSFL convention', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] [example.com] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new Footnote([
        new PlainText('reasonable '),
        new InlineNsfl([
          new Link([
            new PlainText('and realistic')
          ], 'https://example.com')
        ])
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Eventually, I will think of one'),
          footnote,
          new InlineNsfl([
            new Link([
              new PlainText(' example of a')
            ], 'https://example.com')
          ]),
          new PlainText(' footnote that overlaps an inline NSFL convention.')
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A linkified NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL convention node and its inner link node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] (example.com) is his last name)'

    const footnote =
      new Footnote([
        new InlineNsfl([
          new Link([
            new PlainText('Ketchum')
          ], 'https://example.com')
        ]),
        new PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineNsfl([
            new Link([
              new PlainText('Gary loses to Ash'),
            ], 'https://example.com')
          ]),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})
