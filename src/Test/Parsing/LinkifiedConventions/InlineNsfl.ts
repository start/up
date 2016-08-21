import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Link } from '../../../SyntaxNodes/Link'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { Audio } from '../../../SyntaxNodes/Audio'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('An inline NSFL convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces an inline NSFL node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat rotting Gary](http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new Link([
            new PlainText('you eat rotting Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Any NSFL convention followed immediately by a parenthesized/bracketed URL', () => {
  it('produces an inline NSFL node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the NSFL convention can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: you eat rotting Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfl([
          new Link([
            new PlainText('you eat rotting Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('An inline NSFL convention directly followed by another NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat rotting Gary][NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat rotting Gary')
        ]),
        new InlineNsfl([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFL convention directly followed by an inline spoiler convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat rotting Gary][SPOILER: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat rotting Gary')
        ]),
        new InlineSpoiler([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFL convention directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat rotting Gary][NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat rotting Gary')
        ]),
        new InlineNsfw([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFL convention directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFL: you eat rotting Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfl([
          new PlainText('you eat rotting Gary')
        ]),
        new Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('An inline NSFL convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [NSFL: you eat rotting Gary](^Or whatever you name him.)"

    const footnotes = [
      new Footnote([
        new PlainText('Or whatever you name him.')
      ], 1)
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("After you beat the Elite Four, "),
          new InlineNsfl([
            new PlainText('you eat rotting Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified NSFL convention with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[NSFL: he called her](\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsfl([
          new PlainText('he called her')
        ]),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified NSFL convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the NSFL convention is not linkified', () => {
    expect(Up.toDocument('[NSFL: he called her]( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsfl([
          new PlainText('he called her')
        ]),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between an inline NSFL conventions and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfl([
          new Link([
            new PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
