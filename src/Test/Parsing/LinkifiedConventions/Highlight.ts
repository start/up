import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph, expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Link } from '../../../SyntaxNodes/Link'
import { Highlight } from '../../../SyntaxNodes/Highlight'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Audio } from '../../../SyntaxNodes/Audio'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'


describe('A highlight followed immediately by a parenthesized/bracketd URL', () => {
  it('produces a highlight node whose contents are put inside a link pointing to that URL', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary](http://example.com/finalbattle).')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new Link([
            new PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Any highlight followed immediately by a parenthesized/bracketed URL', () => {
  it('produces a highlight node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the highlight can be different from the type of bracket surrounding the URL', () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: you fight Gary',
      url: 'http://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Highlight([
          new Link([
            new PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})


describe('A highlight directly followed by another highlight', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary][highlight: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new Highlight([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A highlight directly followed by an inline NSFW convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary][NSFW: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new InlineNsfw([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A highlight directly followed by an inline NSFL convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary][NSFL: and win].')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new InlineNsfl([
          new PlainText('and win')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A highlight directly followed by a media convention', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('After you beat the Elite Four, [highlight: you fight Gary][audio: final battle theme](https://example.com/songs/123.ogg)')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('After you beat the Elite Four, '),
        new Highlight([
          new PlainText('you fight Gary')
        ]),
        new Audio('final battle theme', 'https://example.com/songs/123.ogg'),
      ]))
  })
})


describe('A highlight directly followed by a footnote', () => {
  it("is not linkified", () => {
    const markup = "After you beat the Elite Four, [highlight: you fight Gary](^Or whatever you name him.)"

    const footnotes = [
      new Footnote([
        new PlainText('Or whatever you name him.')
      ], { referenceNumber: 1 })
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("After you beat the Elite Four, "),
          new Highlight([
            new PlainText('you fight Gary')
          ]),
          footnotes[0],
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('An otherwise-valid linkified highlight with its URL escaped', () => {
  it('is not linkified', () => {
    expect(Up.toDocument('[highlight: he called her](\\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('he called her')
        ]),
        new NormalParenthetical([
          new PlainText('(tel:5555555555)')
        ]),
      ]))
  })
})


context("When an otherwise-valid linkified highlight's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the highlight convention is not linkified', () => {
    expect(Up.toDocument('[highlight: he called her]( \t \\tel:5555555555)')).to.be.eql(
      insideDocumentAndParagraph([
        new Highlight([
          new PlainText('he called her')
        ]),
        new PlainText('( \t tel:5555555555)')
      ]))
  })
})


context("If there's no whitespace between a highlight and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: 'highlight: you fight Gary',
      url: ' \t \thttp://example.com/finalbattle',
      toProduce: insideDocumentAndParagraph([
        new Highlight([
          new Link([
            new PlainText('you fight Gary')
          ], 'http://example.com/finalbattle')
        ]),
      ])
    })
  })
})
