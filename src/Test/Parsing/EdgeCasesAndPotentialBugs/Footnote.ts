import { expect } from 'chai'
import * as Up from '../../../Main'


describe('Before a footnote, an escaped space followed by several non-escaped spaces', () => {
  it('produces a footnote node following a single space', () => {
    const markup = "I don't eat cereal.\\           (^Well, I do, but I pretend not to.)"

    const footnote = new Up.Footnote([
      new Up.Text('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal. "),
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
      new Up.Text('Well, I do, but I pretend not to.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("I don't eat cereal."),
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
      new Up.Text("I'm normal. "),
      new Up.NormalParenthetical([
        new Up.Text("(I don't eat cereal. "),
        new Up.NormalParenthetical([
          new Up.Text("(Well, I do, but I pretend not to.)"),
        ]),
        new Up.Text(')')
      ]),
      new Up.Text(' See?')
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
      new Up.Text("I'm normal. "),
      new Up.SquareParenthetical([
        new Up.Text("[I don't eat cereal. "),
        new Up.SquareParenthetical([
          new Up.Text("[Well, I do, but I pretend not to.]"),
        ]),
        new Up.Text(']')
      ]),
      new Up.Text(' See?')
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
        new Up.Text('Well, I do, but I pretend not to.')
      ], { referenceNumber: 1 }),
      new Up.Footnote([
        new Up.Text('Except for Mondays.')
      ], { referenceNumber: 2 })
    ]

    const lineBlockFootnotes = [
      new Up.Footnote([
        new Up.Text('This is not my line.')
      ], { referenceNumber: 3 }),
      new Up.Footnote([
        new Up.Text('Neither is this line. I think my mom made it up.')
      ], { referenceNumber: 4 })
    ]

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.BulletedList([
          new Up.BulletedList.Item([
            new Up.RevealableBlock([
              new Up.Paragraph([
                new Up.Text("I don't eat cereal."),
                paragraphFootnotes[0],
                new Up.Text(" Never have."),
                paragraphFootnotes[1]
              ]),
              new Up.FootnoteBlock(paragraphFootnotes),
              new Up.LineBlock([
                new Up.LineBlock.Line([
                  new Up.Text("Roses are red"),
                  lineBlockFootnotes[0],
                ]),
                new Up.LineBlock.Line([
                  new Up.Text("Violets are blue"),
                  lineBlockFootnotes[1]
                ])
              ]),
              new Up.FootnoteBlock(lineBlockFootnotes),
              new Up.Paragraph([
                new Up.Text('Anyway, none of that matters.')
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
      new Up.Text('Well, I '),
      new Up.Emphasis([
        new Up.Text('do')
      ]),
      new Up.Text(', but I pretend not to.'),
    ], { referenceNumber: 3 })

    const firstFootnote = new Up.Footnote([
      new Up.Text("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new Up.Text(" Never have."),
    ], { referenceNumber: 1 })

    const footnoteInsideSecondFootnote = new Up.Footnote([
      new Up.Text("No."),
    ], { referenceNumber: 4 })

    const secondFootnote = new Up.Footnote([
      new Up.Text("Probably."),
      footnoteInsideSecondFootnote
    ], { referenceNumber: 2 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Me? I'm totally normal."),
          firstFootnote,
          new Up.Text(" Really."),
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
      new Up.Text('I would never eat cereal.')
    ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          footnote,
          new Up.Text(" I'm a normal breakfast eater, just like you.")
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})
