import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBrackets } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Video } from '../../../SyntaxNodes/Video'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('An video convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an video node within a link pointing to that second URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/finalbattle'),
        new PlainText('.')
      ]))
  })
})


describe('Any video convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an video node within a link pointing to that second URL. The types of brackets surrounding the video description, the video URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'video: you fight Gary' },
        { text: 'https://example.com/fight.webm' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new UpDocument([
        new Link([
          new Video('you fight Gary', 'https://example.com/fight.webm')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the video's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new Link([
            new Video('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })

    specify('The linkifying URL can start with whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'video: you fight Gary' },
          { text: 'https://example.com/fight.webm' },
          { text: ' \t \t http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new Link([
            new Video('you fight Gary', 'https://example.com/fight.webm')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An video convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Video('you fight Gary', 'https://example.com/fight.webm'),
        new InlineSpoiler([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A video directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Video('you fight Gary', 'https://example.com/fight.webm'),
        new InlineNsfw([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A video directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)[NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Video('you fight Gary', 'https://example.com/fight.webm'),
        new InlineNsfl([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A video directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [video: you fight Gary](https://example.com/fight.webm)(^Or whatever you name him.)"

    const footnotes = [
      new Footnote([
        new PlainText('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("After you beat the Elite Four, "),
          new Video('you fight Gary', 'https://example.com/fight.webm'),
          footnotes[0],
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified video convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[video: phone call](https://example.com/phonecall.webm)(\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new Video('phone call', 'https://example.com/phonecall.webm'),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified video's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the video convention is not linkified', () => {
    expect(Up.toDocument('[video: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new Video('phone call', 'https://example.com/phonecall.ogg'),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})
