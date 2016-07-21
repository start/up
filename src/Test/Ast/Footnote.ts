import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'



const footnoteProducedByParentheses =
  "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

describe('In a paragraph, parenthesized text starting with a caret', () => {
  it("produces a footnote node inside the paragraph, and a footnote block node for the footnote after the paragraph", () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(footnoteProducedByParentheses)).to.be.eql(
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


describe('Square bracketed text starting with a caret', () => {
  it("also produces a footnote node", () => {
    const footnoteProducedBySquareBrackets =
      "I don't eat cereal. [^Well, I do, but I pretend not to.] Never have."

    expect(Up.toAst(footnoteProducedByParentheses)).to.be.eql(
      Up.toAst(footnoteProducedBySquareBrackets))
  })
})


describe('Curly bracketed text starting with a caret', () => {
  it("also produces a footnote node", () => {
    const footnoteProducedByCurlyBrackets =
      "I don't eat cereal. {^Well, I do, but I pretend not to.} Never have."

    expect(Up.toAst(footnoteProducedByParentheses)).to.be.eql(
      Up.toAst(footnoteProducedByCurlyBrackets))
  })
})


describe('A word followed by several spaces followed by a footnote', () => {
  it("produces a footnote node directly after the word", () => {
    const text = "I don't eat cereal.   (^Well, I do, but I pretend not to.)"

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote', () => {
  it('is evaluated for inline conventions', () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do')
      ]),
      new PlainTextNode(', but I pretend not to.')
    ], 1)

    expect(Up.toAst("I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('can be nested within an inline convention', () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do')
      ]),
      new PlainTextNode(', but I pretend not to.')
    ], 1)

    expect(Up.toAst("**I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.**")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new StressNode([
            new PlainTextNode("I don't eat cereal."),
            footnote,
            new PlainTextNode(" Never have."),
          ])
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('can contain other footnotes, which produce additional footnotes in the same footnote block', () => {
    const text = "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really."

    const innerFootnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do')
      ]),
      new PlainTextNode(', but I pretend not to.'),
    ], 2)

    const outerFootnote = new FootnoteNode([
      new PlainTextNode("That said, I don't eat cereal."),
      innerFootnote,
      new PlainTextNode(" Never have."),
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          outerFootnote,
          new PlainTextNode(" Really."),
        ]),
        new FootnoteBlockNode([
          outerFootnote,
          innerFootnote
        ])
      ]))
  })
})


describe('Any whitespace after the caret in a footnote start delimiter', () => {
  it("is ignored", () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst("I don't eat cereal. (^ \tWell, I do, but I pretend not to.) Never have.")).to.be.eql(
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