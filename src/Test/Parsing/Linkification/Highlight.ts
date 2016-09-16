import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


describe('A highlight followed immediately by a parenthesized/bracketd URL', () => {
  it('produces a highlight node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight Gary](http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Any highlight followed immediately by a parenthesized/bracketed URL', () => {
  it('produces a highlight node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the highlight can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: you fight Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('A highlight directly followed by another highlight', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight Gary][highlight: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Highlight([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A highlight directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight Gary][NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.InlineNsfw([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A highlight directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight Gary][NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.InlineNsfl([
          new Up.Text('and win')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A highlight directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [highlight: you fight Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('After you beat the Elite Four, '),
        new Up.Highlight([
          new Up.Text('you fight Gary')
        ]),
        new Up.Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('A highlight directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [highlight: you fight Gary](^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.Text('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("After you beat the Elite Four, "),
          new Up.Highlight([
            new Up.Text('you fight Gary')
          ]),
          footnotes[0],
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified highlight with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[highlight: he called her](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Text('he called her')
        ]),
        new Up.NormalParenthetical([
          new Up.Text('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified highlight's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the highlight convention is not linkified', () => {
    expect(Up.parse('[highlight: he called her]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Text('he called her')
        ]),
        new Up.Text('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between a highlight and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.Highlight([
          new Up.Link([
            new Up.Text('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
