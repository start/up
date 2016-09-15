import { expect } from 'chai'
import * as Up from '../../index'



const footnoteProducedByParentheses =
  "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

describe('In a paragraph, parenthesized text starting with a caret', () => {
  it("produces a footnote node inside the paragraph, and a footnote block node for the footnote after the paragraph", () => {
    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(footnoteProducedByParentheses)).to.deep.equal(
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


describe('Square bracketed text starting with a caret', () => {
  it("also produces a footnote node", () => {
    const footnoteProducedBySquareBrackets =
      "I don't eat cereal. [^Well, I do, but I pretend not to.] Never have."

    expect(Up.parse(footnoteProducedByParentheses)).to.deep.equal(
      Up.parse(footnoteProducedBySquareBrackets))
  })
})


describe('A word followed by several spaces followed by a footnote', () => {
  it("produces a footnote node directly after the word", () => {
    const markup = "I don't eat cereal.   (^Well, I do, but I pretend not to.)"

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote', () => {
  it('is evaluated for inline conventions', () => {
    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I '),
      new Up.Emphasis([
        new Up.PlainText('do')
      ]),
      new Up.PlainText(', but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse("I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal."),
          footnote,
          new Up.PlainText(" Never have."),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  it('can be nested within an inline convention', () => {
    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I '),
      new Up.Emphasis([
        new Up.PlainText('do')
      ]),
      new Up.PlainText(', but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse("**I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.**")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Stress([
            new Up.PlainText("I don't eat cereal."),
            footnote,
            new Up.PlainText(" Never have."),
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  it('can be nested within multiple inline convention', () => {
    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I '),
      new Up.Emphasis([
        new Up.PlainText('do')
      ]),
      new Up.PlainText(', but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse("***I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.***")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText("I don't eat cereal."),
              footnote,
              new Up.PlainText(" Never have."),
            ])
          ])
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  it('can contain other footnotes, which produce additional footnotes in the same footnote block', () => {
    const markup = "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really."

    const innerFootnote = new Up.Footnote([
      new Up.PlainText('Well, I '),
      new Up.Emphasis([
        new Up.PlainText('do')
      ]),
      new Up.PlainText(', but I pretend not to.'),
    ], { referenceNumber: 2 })

    const outerFootnote = new Up.Footnote([
      new Up.PlainText("That said, I don't eat cereal."),
      innerFootnote,
      new Up.PlainText(" Never have."),
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("Me? I'm totally normal."),
          outerFootnote,
          new Up.PlainText(" Really."),
        ]),
        new Up.FootnoteBlock([
          outerFootnote,
          innerFootnote
        ])
      ]))
  })
})


describe('Any whitespace after the caret in a footnote start delimiter', () => {
  it("is ignored", () => {
    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse("I don't eat cereal. (^ \tWell, I do, but I pretend not to.) Never have.")).to.deep.equal(
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
