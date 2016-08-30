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
import { Audio } from '../../../SyntaxNodes/Audio'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('An audio convention (with its URL) followed immediately by a (second) parenthesized/bracketd URL', () => {
  it('produces an audio node within a link pointing to that second URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Link([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle'),
        new PlainText('.')
      ]))
  })
})


describe('Any audio convention (with its URL) followed immediately by a (second) parenthesized/bracketed URL', () => {
  it('produces an audio node within a link pointing to that second URL. The types of brackets surrounding the audio description, the audio URL, and the "linkifying" URL can all be different', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: 'http://example.com/finalbattle' }
      ],
      toProduce: new UpDocument([
        new Link([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/finalbattle')
      ])
    })
  })
})


context("As long as there is no whitespace between the audio's URL and the linkifying URL, there are no restrictions on the linkifying URL.", () => {
  specify('The linkifying URL can contain whitespace', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: 'http://example.com/final battle' }
      ],
      toProduce: new UpDocument([
        new Link([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/final battle')
      ])
    })
  })

  specify('The linkifying URL can start with whitespace', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: ' \t \thttp://example.com/final-battle' }
      ],
      toProduce: new UpDocument([
        new Link([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'http://example.com/final-battle')
      ])
    })
  })

  specify('The linkifying URL can start with whitespace, contain whitespace, and not have a URL scheme', () => {
    expectEveryPermutationOfBrackets({
      bracketedSegments: [
        { text: 'audio: you fight Gary' },
        { text: 'https://example.com/fight.ogg' },
        { text: ' \t \t example.com/final battle' }
      ],
      toProduce: new UpDocument([
        new Link([
          new Audio('you fight Gary', 'https://example.com/fight.ogg')
        ], 'https://example.com/final battle')
      ])
    })
  })
})


describe('An audio convention directly followed by an inline spoiler', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new InlineSpoiler([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An audio convention directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new InlineNsfw([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An audio convention directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)[NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Audio('you fight Gary', 'https://example.com/fight.ogg'),
        new InlineNsfl([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An audio convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [audio: you fight Gary](https://example.com/fight.ogg)(^Or whatever you name him.)"

    const footnotes = [
      new Footnote([
        new PlainText('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("After you beat the Elite Four, "),
          new Audio('you fight Gary', 'https://example.com/fight.ogg'),
          footnotes[0],
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified audio convention with its linkifying URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[audio: phone call](https://example.com/phonecall.ogg)(\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Audio('phone call', 'https://example.com/phonecall.ogg'),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified audio convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the audio convention is not linkified', () => {
    expect(Up.toDocument('[audio: phone call](https://example.com/phonecall.ogg)( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Audio('phone call', 'https://example.com/phonecall.ogg'),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})

