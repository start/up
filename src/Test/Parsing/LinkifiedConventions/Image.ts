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
import { Image } from '../../../SyntaxNodes/Image'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('An image convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an image node within a link pointing to that second URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/finalbattle'),
        new PlainText('.')
      ]))
  })
})


describe('Any image convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an image node within a link pointing to that second URL. The types of brackets surrounding the image description, the image URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'image: you fight Gary' },
        { text: 'https://example.com/fight.svg' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new UpDocument([
        new Link([
          new Image('you fight Gary', 'https://example.com/fight.svg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })

  context("As long as there is no whitespace between the image's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: you fight Gary' },
          { text: 'https://example.com/fight.svg' },
          { text: 'http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new Link([
            new Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final battle')
        ])
      })
    })

    specify('The linkifying URL can contain whitespace', () => {
      expectEveryPermutationOfBrackets({
        bracketedSegments: [
          { text: 'image: you fight Gary' },
          { text: 'https://example.com/fight.svg' },
          { text: ' \t \t http://example.com/final battle' }
        ],
        toProduce: new UpDocument([
          new Link([
            new Image('you fight Gary', 'https://example.com/fight.svg')
          ], 'http://example.com/final battle')
        ])
      })
    })
  })
})


describe('An image convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Image('you fight Gary', 'https://example.com/fight.svg'),
        new InlineSpoiler([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An image directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Image('you fight Gary', 'https://example.com/fight.svg'),
        new InlineNsfw([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An image directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)[NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Image('you fight Gary', 'https://example.com/fight.svg'),
        new InlineNsfl([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An image directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [image: you fight Gary](https://example.com/fight.svg)(^Or whatever you name him.)"

    const footnotes = [
      new Footnote([
        new PlainText('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("After you beat the Elite Four, "),
          new Image('you fight Gary', 'https://example.com/fight.svg'),
          footnotes[0],
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified image convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[image: phone call](https://example.com/phonecall.svg)(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Image('phone call', 'https://example.com/phonecall.svg'),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified image convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the image convention is not linkified', () => {
    expect(Up.toDocument('[image: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Image('phone call', 'https://example.com/phonecall.ogg'),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})
