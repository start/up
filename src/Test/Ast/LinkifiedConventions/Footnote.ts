import { expect } from 'chai'
import Up from '../../../index'
import { expectEveryCombinationOfBrackets } from '../Helpers'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { VideoNode } from '../../../SyntaxNodes/VideoNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'


const FOOTNOTE_BRACKETS = [
  { open: '((', close: '))' },
  { open: '[[', close: ']]' },
  { open: '{{', close: '}}' }
]


describe('A footnote directly followed by a bracketed/parenthesized URL', () => {
  it("produces a footnote whose entire contents is put inside a link pointing to that URL", () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))[http://example.com/luckycharms] Never have."

    const footnote = new FootnoteNode([
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
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 'http://example.com/luckycharms')
    ], 1)

    expectEveryCombinationOfBrackets({
      bracketsToWrapAroundContent: FOOTNOTE_BRACKETS,
      contentToWrapInBrackets: 'Well, I do, but I pretend not to.',
      partsToPutInBetween: ['  ', '\t', ' \t '],
      urlToWrapInBrackets: 'http://example.com/luckycharms',
      toProduce: new DocumentNode([
        new ParagraphNode([footnote]),
        new FootnoteBlockNode([footnote])
      ])
    })
  })
})


describe('A footnote directly followed by another footnote (with no spaces in between)', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))((Everyone does. It isn't a big deal.))"

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
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))[video: me not eating cereal](https://example.com/v/123)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnotes[0],
          new VideoNode('me not eating cereal', 'https://example.com/v/123')
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('A footnote directly followed by a spoiler', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))[spoiler: None of the Final Four's Pokemon are named 'Cereal']"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnotes[0],
          new SpoilerNode([
            new PlainTextNode("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('A footnote directly followed by a NSFW convention', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))[NSFW: None of the Final Four's Pokemon are named 'Cereal']"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnotes[0],
          new NsfwNode([
            new PlainTextNode("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('A footnote directly followed by a NSFL convention', () => {
  it("is not linkified", () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))[NSFL: None of the Final Four's Pokemon are named 'Cereal']"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnotes[0],
          new NsflNode([
            new PlainTextNode("None of the Final Four's Pokemon are named 'Cereal'")
          ])
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})
