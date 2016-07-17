import { expect } from 'chai'
import Up from '../../../index'
import { expectEveryPermutationOfBracketsAroundContentAndUrl } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


describe('A footnote directly followed by a bracketed/parenthesized URL', () => {
  it("produces a footnote whose entire contents is put inside a link pointing to that URL", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)[http://example.com/luckycharms] Never have."

    const footnote =
      new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('Any footnote followed by a bracketed/parenthesized URL', () => {
  it('produces a footnote node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the footnote can be different from the type of bracket surrounding the URL', () => {
    const footnote =
      new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Well, I do, but I pretend not to.',
      url: 'http://example.com/luckycharms',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })
})


describe('A footnote directly followed by another footnote (with no spaces in between)', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)(^Everyone does. It isn't a big deal.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1),
      new FootnoteNode([
        new PlainTextNode("Everyone does. It isn't a big deal.")
      ], 2)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnotes[0],
          footnotes[1]
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('A footnote directly followed by a media convention', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)[video: me not eating cereal](https://example.com/v/123)"

    const footnote =
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new VideoNode('me not eating cereal', 'https://example.com/v/123')
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote directly followed by a spoiler', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)[spoiler: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new InlineSpoilerNode([
            new PlainTextNode("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote directly followed by a NSFW convention', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)[NSFW: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new InlineNsfwNode([
            new PlainTextNode("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote directly followed by a NSFL convention', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.)[NSFL: None of the Final Four's Pokemon are named 'Cereal']"

    const footnote =
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new InlineNsflNode([
            new PlainTextNode("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('An otherwise-valid linkified footnote with its URL escaped', () => {
  it('is not linkified', () => {
    const text = "[^He called her.](\\tel:5555555555)"

    const footnote =
      new FootnoteNode([
        new PlainTextNode('He called her.')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote,
          new ParenthesizedNode([
            new PlainTextNode('(tel:5555555555)')
          ]),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe("When an otherwise-valid linkified spoiler's URL starts with whitespace, and the first character in the actual URL is escaped,", () => {
  specify('the footnote is not linkified', () => {
    const text = "[^He called her.]( \t \\tel:5555555555)"

    const footnote =
      new FootnoteNode([
        new PlainTextNode('He called her.')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          footnote,
          new PlainTextNode('( \t tel:5555555555)')
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


context("If there's no whitespace between a footnote and its bracketed URL", () => {
  specify("the URL can start with whitespace", () => {
    const footnote =
      new FootnoteNode([
        new LinkNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ], 'http://example.com/luckycharms')
      ], 1)

    expectEveryPermutationOfBracketsAroundContentAndUrl({
      content: '^Well, I do, but I pretend not to.',
      url: ' \t \thttp://example.com/luckycharms',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })
})