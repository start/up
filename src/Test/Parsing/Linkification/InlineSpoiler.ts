import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


describe('An inline spoiler followed immediately by a parenthesized/bracketd URL', () => {
  it('produces an inline spoiler node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary](http://example.com/finalbattle).')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Any spoiler followed immediately by a parenthesized/bracketed URL', () => {
  it('produces an inline spoiler node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the spoiler can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: you fight Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('An inline spoiler directly followed by another spoiler', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary][SPOILER: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.InlineSpoiler([
          new Up.PlainText('and win')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline spoiler directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary][NSFW: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.InlineNsfw([
          new Up.PlainText('and win')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline spoiler directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary][NSFL: and win].')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.InlineNsfl([
          new Up.PlainText('and win')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('An inline spoiler directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.parse('After you beat the Elite Four, [SPOILER: you fight Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('After you beat the Elite Four, '),
        new Up.InlineSpoiler([
          new Up.PlainText('you fight Gary')
        ]),
        new Up.Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('An inline spoiler directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [SPOILER: you fight Gary](^Or whatever you name him.)"

    const footnotes = [
      new Up.Footnote([
        new Up.PlainText('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("After you beat the Elite Four, "),
          new Up.InlineSpoiler([
            new Up.PlainText('you fight Gary')
          ]),
          footnotes[0],
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified spoiler with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.parse('[SPOILER: he called her](\\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('he called her')
        ]),
        new Up.NormalParenthetical([
          new Up.PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified spoiler's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the spoiler convention is not linkified', () => {
    expect(Up.parse('[SPOILER: he called her]( \t \\tel:5555555555)')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('he called her')
        ]),
        new Up.PlainText('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between an inline spoiler and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'SPOILER: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
