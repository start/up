import { expect } from 'chai'
import Up from '../../../index'
import { expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Video } from '../../../SyntaxNodes/Video'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'


describe('A footnote directly followed by a bracketed/parenthesized URL', () => {
  it("produces a footnote whose entire contents is put inside a link pointing to that URL", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] Never have."

    const footnote =
      new Footnote([
        new Link([
          new PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('Any footnote followed by a bracketed/parenthesized URL', () => {
  it('produces a footnote node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the footnote can be different from the type of bracket surrounding the URL', () => {
    const footnote =
      new Footnote([
        new Link([
          new PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Well, I do, but I pretend not to.',
      url: 'http://example.com/luckycharms',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })
})


describe('A footnote directly followed by another footnote (with no spaces in between)', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)(^Everyone does. It isn't a big deal.)"

    const footnotes = [
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], 1),
      new Footnote([
        new PlainText("Everyone does. It isn't a big deal.")
      ], 2)
    ]

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnotes[0],
          footnotes[1]
        ]),
        new FootnoteBlock(footnotes)
      ]))
  })
})


describe('A footnote directly followed by a media convention', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[video: me not eating cereal](https://example.com/v/123)"

    const footnote =
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new Video('me not eating cereal', 'https://example.com/v/123')
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote directly followed by an inline spoiler', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[spoiler: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new InlineSpoiler([
            new PlainText("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote directly followed by an inline NSFW convention', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[NSFW: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new InlineNsfw([
            new PlainText("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote directly followed by an inline NSFL convention', () => {
  it("is not linkified", () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)[NSFL: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new Footnote([
        new PlainText('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new InlineNsfl([
            new PlainText("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('An otherwise-valid linkified footnote with its URL escaped', () => {
  it('is not linkified', () => {
    const markup = "[^He called her.](\\tel:5555555555)"

    const footnote =
      new Footnote([
        new PlainText('He called her.')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          footnote,
          new NormalParenthetical([
            new PlainText('(tel:5555555555)')
          ]),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe("When an otherwise-valid linkified spoiler's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the footnote is not linkified', () => {
    const markup = "[^He called her.]( \t \\tel:5555555555)"

    const footnote =
      new Footnote([
        new PlainText('He called her.')
      ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          footnote,
          new PlainText('( \t tel:5555555555)')
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


context("If there's no whitespace between a footnote and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    const footnote =
      new Footnote([
        new Link([
          new PlainText('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Well, I do, but I pretend not to.',
      url: ' \t \thttp://example.com/luckycharms',
      toProduce: new UpDocument([
        new Paragraph([footnote]),
        new FootnoteBlock([footnote])
      ])
    })
  })
})
