import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


describe('An inline revealable followed immediately by a parenthesized/bracketd URL', () => {
  it('produces an inline revealable node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary](http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Any inline revealable followed immediately by a parenthesized/bracketed URL', () => {
  it('produces an inline revealable node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the revealable can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: you fight Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('An inline revealable directly followed by another inline revealable', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary][SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.InlineRevealable([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('An inline revealable directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.InlineRevealable([
          new Up.Text('you fight Gary')
        ]),
        new Up.Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('An inline revealable directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [SPOILER: you fight Gary](^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("After you beat the Elite Four, "),
          new Up.InlineRevealable([
            new Up.Text('you fight Gary')
          ]),
          footnotes[0],
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified revealable with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[SPOILER: he called her](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('he called her')
        ]),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified revealable's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the spoiler convention is not linkified', () => {
    expect(Up.parse('[SPOILER: he called her]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('he called her')
        ]),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between an inline revealable and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
