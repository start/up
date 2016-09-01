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


describe('An inline NSFW convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces an inline NSFW node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle naked Gary](http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new Link([
            new PlainText('you wrestle naked Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Any NSFW convention followed immediately by a parenthesized/bracketed URL', () => {
  it('produces an inline NSFW node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the NSFW convention can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: you wrestle naked Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('you wrestle naked Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('An inline NSFW convention directly followed by another NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle naked Gary][NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle naked Gary')
        ]),
        new InlineNsfw([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention directly followed by an inline spoiler convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle naked Gary][SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle naked Gary')
        ]),
        new InlineSpoiler([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle naked Gary][NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle naked Gary')
        ]),
        new InlineNsfl([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [NSFW: you wrestle naked Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new InlineNsfw([
          new PlainText('you wrestle naked Gary')
        ]),
        new Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('An inline NSFW convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [NSFW: you wrestle naked Gary](^Or whatever you name him.)"

    const footnotes = [
      new Footnote([
        new PlainText('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("After you beat the Elite Four, "),
          new InlineNsfw([
            new PlainText('you wrestle naked Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified NSFW convention with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[NSFW: he called her](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('he called her')
        ]),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified NSFW convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the NSFW convention is not linkified', () => {
    expect(Up.toDocument('[NSFW: he called her]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('he called her')
        ]),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between an inline NSFW conventions and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new InlineNsfw([
          new Link([
            new PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
