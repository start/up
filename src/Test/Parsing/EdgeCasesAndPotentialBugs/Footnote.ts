import { expect } from 'chai'
import * as Up from '../../../index'


describe('Before a footnote, an escaped space followed by several non-escaped spaces', () => {
  it('produces a footnote node following a single space', () => {
    const markup = "I don't eat cereal.\\           (^Well, I do, but I pretend not to.)"

    const footnote = new Up.Footnote([
      new Up.PlainText('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("I don't eat cereal. "),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote reference at the end of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const markup = "I don't eat cereal. (^Well, I do, but I pretend not to.)"

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


describe('A footnote produced by parentheses that contains nested parenthesized text ending together', () => {
  it('produces a footnote containing the nested parenthesized text', () => {
    const markup = "(^I'm normal. (I don't eat cereal. (Well, I do, but I pretend not to.)) See?)"

    const footnote = new Up.Footnote([
      new Up.PlainText("I'm normal. "),
      new Up.NormalParenthetical([
        new Up.PlainText("(I don't eat cereal. "),
        new Up.NormalParenthetical([
          new Up.PlainText("(Well, I do, but I pretend not to.)"),
        ]),
        new Up.PlainText(')')
      ]),
      new Up.PlainText(' See?')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote produced by square brackets that contains nested square bracketed text ending together', () => {
  it('produces a footnote containing the nested square bracketed text', () => {
    const markup = "[^I'm normal. [I don't eat cereal. [Well, I do, but I pretend not to.]] See?]"

    const footnote = new Up.Footnote([
      new Up.PlainText("I'm normal. "),
      new Up.SquareParenthetical([
        new Up.PlainText("[I don't eat cereal. "),
        new Up.SquareParenthetical([
          new Up.PlainText("[Well, I do, but I pretend not to.]"),
        ]),
        new Up.PlainText(']')
      ]),
      new Up.PlainText(' See?')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('Within an outline convention, footnotes within a revealable outline convention', () => {
  it('produce footnote blocks directly after each appropriate convention within the revealable outline convention', () => {
    const markup = `
* SPOILER:
    I don't eat cereal. [^ Well, I do, but I pretend not to.] Never have. [^ Except for Mondays.]

    Roses are red [^ This is not my line.]
    Violets are blue [^ Neither is this line. I think my mom made it up.]
    
    Anyway, none of that matters.`

    const paragraphFootnotes = [
      new Up.Footnote([
        new Up.PlainText('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.PlainText('Except for Mondays.')
      ], { referenceNumber: 2 })
    ]

    const lineBlockFootnotes = [
      new Up.Footnote([
        new Up.PlainText('This is not my line.')
      ], { referenceNumber: 3 }),
      new Up.Footnote([
        new Up.PlainText('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.UnorderedList([
          new Up.UnorderedList.Item([
            new Up.SpoilerBlock([
              new Up.Paragraph([
                new Up.PlainText("I don't eat cereal."),
                paragraphFootnotes[0],
                new Up.PlainText(" Never have."),
                paragraphFootnotes[1]
              ]),
              new Up.FootnoteBlock(paragraphFootnotes),
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.PlainText("Roses are red"),
                  lineBlockFootnotes[0],
                ]),
                new Up.LineBlock.Line([
                  new Up.PlainText("Violets are blue"),
                  lineBlockFootnotes[1]
                ])
              ]),
              new Up.FootnoteBlock(lineBlockFootnotes),
              new Up.Paragraph([
                new Up.PlainText('Anyway, none of that matters.')
              ])
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

    const footnoteInsideFirstFootnote = new Up.Footnote([
      new Up.PlainText('Well, I '),
      new Up.Emphasis([
        new Up.PlainText('do')
      ]),
      new Up.PlainText(', but I pretend not to.'),
    ], { referenceNumber: 3 })

    const firstFootnote = new Up.Footnote([
      new Up.PlainText("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new Up.PlainText(" Never have."),
    ], { referenceNumber: 1 })

    const footnoteInsideSecondFootnote = new Up.Footnote([
      new Up.PlainText("No."),
    ], { referenceNumber: 4 })

    const secondFootnote = new Up.Footnote([
      new Up.PlainText("Probably."),
      footnoteInsideSecondFootnote
    ], { referenceNumber: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText("Me? I'm totally normal."),
          firstFootnote,
          new Up.PlainText(" Really."),
          secondFootnote,
        ]),
        new Up.FootnoteBlock([
          firstFootnote,
          secondFootnote,
          footnoteInsideFirstFootnote,
          footnoteInsideSecondFootnote
        ])
      ]))
  })
})


describe('A footnote at the beginning of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const markup = "(^I would never eat cereal.) I'm a normal breakfast eater, just like you."

    const footnote = new Up.Footnote([
      new Up.PlainText('I would never eat cereal.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote,
          new Up.PlainText(" I'm a normal breakfast eater, just like you.")
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})
