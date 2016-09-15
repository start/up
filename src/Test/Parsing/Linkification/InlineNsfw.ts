import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


describe('An inline NSFW convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces an inline NSFW node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle naked Gary](http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.Link([
            new Up.PlainText('you wrestle naked Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Any NSFW convention followed immediately by a parenthesized/bracketed URL', () => {
  it('produces an inline NSFW node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the NSFW convention can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: you wrestle naked Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineNsfw([
          new Up.Link([
            new Up.PlainText('you wrestle naked Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('An inline NSFW convention directly followed by another NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle naked Gary][NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle naked Gary')
        ]),
        new Up.InlineNsfw([
          new Up.PlainText('and win')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention directly followed by an inline spoiler convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle naked Gary][SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle naked Gary')
        ]),
        new Up.InlineSpoiler([
          new Up.PlainText('and win')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle naked Gary][NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle naked Gary')
        ]),
        new Up.InlineNsfl([
          new Up.PlainText('and win')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline NSFW convention directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFW: you wrestle naked Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineNsfw([
          new Up.PlainText('you wrestle naked Gary')
        ]),
        new Up.Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('An inline NSFW convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [NSFW: you wrestle naked Gary](^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.PlainText('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("After you beat the Elite Four, "),
          new Up.InlineNsfw([
            new Up.PlainText('you wrestle naked Gary')
          ]),
          footnotes[0],
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified NSFW convention with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[NSFW: he called her](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfw([
          new Up.PlainText('he called her')
        ]),
        new Up.NormalParenthetical([
          new Up.PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified NSFW convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the NSFW convention is not linkified', () => {
    expect(Up.parse('[NSFW: he called her]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfw([
          new Up.PlainText('he called her')
        ]),
        new Up.PlainText('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between an inline NSFW conventions and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFW: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineNsfw([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
