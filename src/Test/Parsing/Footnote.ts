import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Stress } from '../../SyntaxNodes/Stress'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'



const footnoteProducedByParentheses =
  "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

describe('In a paragraph, parenthesized text starting with a caret', () => {
  it("produces a footnote node inside the paragraph, and a footnote block node for the footnote after the paragraph", () => {
    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toDocument(footnoteProducedByParentheses)).to.be.eql(
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


describe('Square bracketed text starting with a caret', () => {
  it("also produces a footnote node", () => {
    const footnoteProducedBySquareBrackets =
      "I don't eat cereal. [^Well, I do, but I pretend not to.] Never have."

    expect(Up.toDocument(footnoteProducedByParentheses)).to.be.eql(
      Up.toDocument(footnoteProducedBySquareBrackets))
  })
})


describe('A word followed by several spaces followed by a footnote', () => {
  it("produces a footnote node directly after the word", () => {
    const markup = "I don't eat cereal.   (^Well, I do, but I pretend not to.)"

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote', () => {
  it('is evaluated for inline conventions', () => {
    const footnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.')
    ], 1)

    expect(Up.toDocument("I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.")).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote,
          new PlainText(" Never have."),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('can be nested within an inline convention', () => {
    const footnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.')
    ], 1)

    expect(Up.toDocument("**I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.**")).to.be.eql(
      new UpDocument([
        new Paragraph([
          new Stress([
            new PlainText("I don't eat cereal."),
            footnote,
            new PlainText(" Never have."),
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('can be nested within multiple inline convention', () => {
    const footnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.')
    ], 1)

    expect(Up.toDocument("***I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.***")).to.be.eql(
      new UpDocument([
        new Paragraph([
          new Stress([
            new Emphasis([
              new PlainText("I don't eat cereal."),
              footnote,
              new PlainText(" Never have."),
            ])
          ])
        ]),
        new FootnoteBlock([footnote])
      ]))
  })

  it('can contain other footnotes, which produce additional footnotes in the same footnote block', () => {
    const markup = "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really."

    const innerFootnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.'),
    ], 2)

    const outerFootnote = new Footnote([
      new PlainText("That said, I don't eat cereal."),
      innerFootnote,
      new PlainText(" Never have."),
    ], 1)

    expect(Up.toDocument(markup)).to.be.eql(
      new UpDocument([
        new Paragraph([
          new PlainText("Me? I'm totally normal."),
          outerFootnote,
          new PlainText(" Really."),
        ]),
        new FootnoteBlock([
          outerFootnote,
          innerFootnote
        ])
      ]))
  })
})


describe('Any whitespace after the caret in a footnote start delimiter', () => {
  it("is ignored", () => {
    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toDocument("I don't eat cereal. (^ \tWell, I do, but I pretend not to.) Never have.")).to.be.eql(
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
