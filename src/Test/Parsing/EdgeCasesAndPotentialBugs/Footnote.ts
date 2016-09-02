import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../../SyntaxNodes/FootnoteBlock'
import { Blockquote } from '../../../SyntaxNodes/Blockquote'
import { Paragraph } from '../../../SyntaxNodes/Paragraph'
import { NormalParenthetical } from '../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../../SyntaxNodes/SquareParenthetical'
import { UnorderedList } from '../../../SyntaxNodes/UnorderedList'


describe('A footnote reference at the end of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)"

    const footnote = new Footnote([
      new PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("I don't eat cereal."),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote produced by parentheses that contains nested parenthesized text ending together', () => {
  it('produces a footnote containing the nested parenthesized text', () => {
    const markup = "(^I'm normal. (I don't eat cereal. (Well, I do, but I pretend not to.)) See?)"

    const footnote = new Footnote([
      new PlainText("I'm normal. "),
      new NormalParenthetical([
        new PlainText("(I don't eat cereal. "),
        new NormalParenthetical([
          new PlainText("(Well, I do, but I pretend not to.)"),
        ]),
        new PlainText(')')
      ]),
      new PlainText(' See?')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote produced by square brackets that contains nested square bracketed text ending together', () => {
  it('produces a footnote containing the nested square bracketed text', () => {
    const markup = "[^I'm normal. [I don't eat cereal. [Well, I do, but I pretend not to.]] See?]"

    const footnote = new Footnote([
      new PlainText("I'm normal. "),
      new SquareParenthetical([
        new PlainText("[I don't eat cereal. "),
        new SquareParenthetical([
          new PlainText("[Well, I do, but I pretend not to.]"),
        ]),
        new PlainText(']')
      ]),
      new PlainText(' See?')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('Inside an outline convention, blockquoted footnote references', () => {
  it('produce footnote blocks directly after each appropriate convention within the blockquote', () => {
    const markup = `
* > I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.`

    const footnote = new Footnote([
      new PlainText("Well, I do, but I pretend not to."),
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new UnorderedList([
          new UnorderedList.Item([
            new Blockquote([
              new Paragraph([
                new PlainText("I don't eat cereal."),
                footnote,
                new PlainText(" Never have."),
              ]),
              new FootnoteBlock([footnote])
            ])
          ])
        ])
      ]))
  })
})


describe('A footnote with inner footnotes followed by another footnote with inner footnotes', () => {
  it('produces no duplicate reference numbers', () => {
    const markup =
      "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably. (^No.))"

    const footnoteInsideFirstFootnote = new Footnote([
      new PlainText('Well, I '),
      new Emphasis([
        new PlainText('do')
      ]),
      new PlainText(', but I pretend not to.'),
    ], { referenceNumber: 3 })

    const firstFootnote = new Footnote([
      new PlainText("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new PlainText(" Never have."),
    ], { referenceNumber: 1 })

    const footnoteInsideSecondFootnote = new Footnote([
      new PlainText("No."),
    ], { referenceNumber: 4 })

    const secondFootnote = new Footnote([
      new PlainText("Probably."),
      footnoteInsideSecondFootnote
    ], { referenceNumber: 2 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("Me? I'm totally normal."),
          firstFootnote,
          new PlainText(" Really."),
          secondFootnote,
        ]),
        new FootnoteBlock([
          firstFootnote,
          secondFootnote,
          footnoteInsideFirstFootnote,
          footnoteInsideSecondFootnote
        ])
      ]))
  })
})


describe('A footnote reference at the beginning of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const markup = "(^I would never eat cereal.) I'm a normal breakfast eater, just like you."

    const footnote = new Footnote([
      new PlainText('I would never eat cereal.')
    ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          footnote,
          new PlainText(" I'm a normal breakfast eater, just like you.")
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})
