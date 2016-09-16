import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


describe('An inline NSFL convention followed immediately by a parenthesized/bracketd URL', () => {
  it('produces an inline NSFL node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat rotting Gary](http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Text('you eat rotting Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Any NSFL convention followed immediately by a parenthesized/bracketed URL', () => {
  it('produces an inline NSFL node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the NSFL convention can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: you eat rotting Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Text('you eat rotting Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('An inline NSFL convention directly followed by another NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat rotting Gary][NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat rotting Gary')
        ]),
        new Up.InlineNsfl([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline NSFL convention directly followed by an inline spoiler convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat rotting Gary][SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat rotting Gary')
        ]),
        new Up.InlineSpoiler([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline NSFL convention directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat rotting Gary][NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat rotting Gary')
        ]),
        new Up.InlineNsfw([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline NSFL convention directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [NSFL: you eat rotting Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineNsfl([
          new Up.Text('you eat rotting Gary')
        ]),
        new Up.Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('An inline NSFL convention directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [NSFL: you eat rotting Gary](^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("After you beat the Elite Four, "),
          new Up.InlineNsfl([
            new Up.Text('you eat rotting Gary')
          ]),
          footnotes[0],
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified NSFL convention with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[NSFL: he called her](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.Text('he called her')
        ]),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified NSFL convention's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the NSFL convention is not linkified', () => {
    expect(Up.parse('[NSFL: he called her]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.Text('he called her')
        ]),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between an inline NSFL conventions and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'NSFL: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
