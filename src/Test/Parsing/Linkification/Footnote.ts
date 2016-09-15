import { expect } from 'chai'
import Up = require('../../../index')
import { expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'


describe('A footnote directly followed by a bracketed/parenthesized URL', () => {
  it("produces a footnote whose entire contents is put inside a link pointing to that URL", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] Never have."

    const footnote =
      new Up.Footnote([
        new Up.Link([
          new Up.PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.PlainText(" Never have."),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('Any footnote followed by a bracketed/parenthesized URL', () => {
  it('produces a footnote node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the footnote can be different from the type of bracket surrounding the URL', () => {
    const footnote =
      new Up.Footnote([
        new Up.Link([
          new Up.PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Well, I do, but I pretend not to.',
      url: 'http://example.com/luckycharms',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })
})


describe('A footnote directly followed by another footnote (with no spaces in between)', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)(^Everyone does. It isn't a big deal.)"

    const footnotes = [
      new Up.Footnote([
        new Up.PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.PlainText("Everyone does. It isn't a big deal.")
      ], { referenceNumber: 2 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnotes[0],
          footnotes[1]
        ]),
        new Up.FootnoteBlock(footnotes)
      ]))
  })
})


describe('A footnote directly followed by a media convention', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[video: me not eating cereal](https://example.com/v/123)"

    const footnote =
      new Up.Footnote([
        new Up.PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.Video('me not eating cereal', 'https://example.com/v/123')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote directly followed by an inline spoiler', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[spoiler: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new Up.Footnote([
        new Up.PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.InlineSpoiler([
            new Up.PlainText("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote directly followed by an inline NSFW convention', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[NSFW: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new Up.Footnote([
        new Up.PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.InlineNsfw([
            new Up.PlainText("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote directly followed by an inline NSFL convention', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[NSFL: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new Up.Footnote([
        new Up.PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.InlineNsfl([
            new Up.PlainText("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('An otherwise-valid linkified footnote with its URL escaped', () => {
  it('is not linkified', () => {
    const markup = "[^He called her.](\\tel:5555555555)"

    const footnote =
      new Up.Footnote([
        new Up.PlainText('He called her.')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote,
          new Up.NormalParenthetical([
            new Up.PlainText('(tel:5555555555)')
          ]),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe("When an otherwise-valid linkified spoiler's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the footnote is not linkified', () => {
    const markup = "[^He called her.]( \t \\tel:5555555555)"

    const footnote =
      new Up.Footnote([
        new Up.PlainText('He called her.')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote,
          new Up.PlainText('( \t tel:5555555555)')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


context("If there's no whitespace between a footnote and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    const footnote =
      new Up.Footnote([
        new Up.Link([
          new Up.PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], { referenceNumber: 1 })

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Well, I do, but I pretend not to.',
      url: ' \t \thttp://example.com/luckycharms',
      toProduce: new Up.Document([
        new Up.Paragraph([footnote]),
        new Up.FootnoteBlock([footnote])
      ])
    })
  })
})
