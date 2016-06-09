import { expect } from 'chai'
import Up from '../../index'
import { expectEveryCombinationOf } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


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


describe('A footnote produced by doubly parenthesized, square bracketed, or curly bracketed text followed immediately by a parenthesized, a square bracketed, or a curly bracketed URL', () => {
  it('produces a footnote node whose contents are put inside a link pointing to that URL. The type of bracket surrounding the footnote can be different from the type of bracket surrounding the URL', () => {
    
    const footnote = new FootnoteNode([
      new LinkNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 'http://example.com/luckycharms')
    ], 1)
    
    expectEveryCombinationOf({
      firstHalves: [
        '((Well, I do, but I pretend not to.))',
        '[[Well, I do, but I pretend not to.]]',
        '{{Well, I do, but I pretend not to.}}'
      ],
      secondHalves: [
        '[http://example.com/luckycharms]',
        '(http://example.com/luckycharms)',
        '{http://example.com/luckycharms}'
      ],
      toProduce: new DocumentNode([
        new ParagraphNode([
          footnote
        ]),
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