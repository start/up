import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'



const footnoteProducedByParentheses =
  "I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have."

describe('In a paragraph, text surrounded by 2 parentheses', () => {
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


describe('Text surrounded by 2 square brackets', () => {
  it("also produces a footnote node", () => {
    const footnoteProducedBySquareBrackets =
      "I don't eat cereal. [[Well, I do, but I pretend not to.]] Never have."

    expect(Up.toAst(footnoteProducedByParentheses)).to.be.eql(
      Up.toAst(footnoteProducedBySquareBrackets))
  })
})


describe('Text surrounded by 2 curly brackets', () => {
  it("also produces a footnote node", () => {
    const footnoteProducedByCurlyBrackets =
      "I don't eat cereal. {{Well, I do, but I pretend not to.}} Never have."

    expect(Up.toAst(footnoteProducedByParentheses)).to.be.eql(
      Up.toAst(footnoteProducedByCurlyBrackets))
  })
})


describe('A word followed by several spaces followed by a footnote', () => {
  it("produces a footnote node directly after the word", () => {
    const text = "I don't eat cereal.   ((Well, I do, but I pretend not to.))"

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

    expect(Up.toAst("I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })

  it('can contain other footnotes, which produce additional footnotes in the same footnote block', () => {
    const text = "Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.)) Really."

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
