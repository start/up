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


describe('Inside a paragraph, text surrounded by 2 parentheses', () => {
  it("produces a footnote node inside the paragraph and a footnote block node after the paragraph", () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have."

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
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

  it('can contain other footnote, which produce additional footnotes in the same footnote block', () => {
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


describe('Footnotes in a heading', () => {
  it('produce a footnote block after the heading', () => {
    const text = `
I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.
------`

    const footnote = new FootnoteNode([
      new PlainTextNode('Well, I do, but I pretend not to.')
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([
          new PlainTextNode("I don't eat cereal."),
          footnote,
          new PlainTextNode(" Never have."),
        ], 1),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })
})


describe('Footnotes in a line block', () => {
  it('produce a footnote block after the line block', () => {
    const text = `
Roses are red ((This is not my line.))
Violets are blue ((Neither is this line. I think my mom made it up.))`

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('This is not my line.')
      ], 1),
      new FootnoteNode([
        new PlainTextNode('Neither is this line. I think my mom made it up.')
      ], 2)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode("Roses are red"),
            footnotes[0],
          ]),
          new Line([
            new PlainTextNode("Violets are blue"),
            footnotes[1]
          ])
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('Footnotes in unordered list items', () => {
  it('produce a footnote block that appears after the entire list', () => {
    const text = `
* I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

* I don't eat ((Or touch.)) pumpkins.

* Roses are red ((This is not my line.))
  Violets are blue ((Neither is this line. I think my mom made it up.))`

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode("Well, I do, but I pretend not to."),
      ], 1),
      new FootnoteNode([
        new PlainTextNode("Or touch."),
      ], 2),
      new FootnoteNode([
        new PlainTextNode('This is not my line.')
      ], 3),
      new FootnoteNode([
        new PlainTextNode('Neither is this line. I think my mom made it up.')
      ], 4)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([

          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnotes[0],
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),

          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              footnotes[1],
              new PlainTextNode(" pumpkins."),
            ])
          ]),

          new UnorderedListItem([
            new LineBlockNode([
              new Line([
                new PlainTextNode("Roses are red"),
                footnotes[2],
              ]),
              new Line([
                new PlainTextNode("Violets are blue"),
                footnotes[3],
              ])
            ]),
          ])
        ]),

        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('Footnotes in a blockquote', () => {
  it('produce footnote blocks within the blockquote', () => {
    const text = "> I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have."

    const footnote =
      new FootnoteNode([
        new PlainTextNode("Well, I do, but I pretend not to."),
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([
          new ParagraphNode([
            new PlainTextNode("I don't eat cereal."),
            footnote,
            new PlainTextNode(" Never have."),
          ]),
          new FootnoteBlockNode([footnote]),
        ])
      ])
    )
  })
})

describe('Footnotes nested inside 2 or more outline conventions nested inside a blockquote', () => {
  it("produce footnote blocks inside the blockquote after all the appropriate outline conventions. The only difference is that everything is inside a blockquote", () => {
    const text = `
> * I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.
>
>   It's too expensive.
>
> * I don't eat ((Or touch.)) pumpkins.`

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode("Well, I do, but I pretend not to."),
      ], 1),
      new FootnoteNode([
        new PlainTextNode("Or touch."),
      ], 2)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new BlockquoteNode([

          new UnorderedListNode([

            new UnorderedListItem([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnotes[0],
                new PlainTextNode(" Never have."),
              ]),
              new ParagraphNode([
                new PlainTextNode("It's too expensive.")
              ])
            ]),

            new UnorderedListItem([
              new ParagraphNode([
                new PlainTextNode("I don't eat"),
                footnotes[1],
                new PlainTextNode(" pumpkins."),
              ])
            ])

          ]),

          new FootnoteBlockNode(footnotes)

        ])
      ])
    )
  })
})


describe('Footnotes in ordered list items', () => {
  it('produce a footnote block that appears after the entire list', () => {
    const text = `
1) I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

2) I don't eat ((Or touch.)) pumpkins.`

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode("Well, I do, but I pretend not to."),
      ], 1),
      new FootnoteNode([
        new PlainTextNode("Or touch."),
      ], 2)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnotes[0],
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ], 1),
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              footnotes[1],
              new PlainTextNode(" pumpkins."),
            ])
          ], 2)
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('Footnotes in description list terms and definitions', () => {
  it('produce a footnote block that appears after the entire description list', () => {
    const text = `
Bulbasaur
  A strange seed was planted on its back at birth. ((What happens to the creature if the seed is never planted?)) The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade ((This probably wasn't a reference to the family of plants.))
  Ghost type moves.
  
Gary
  A young man with a great sense of smell. ((Or maybe Ash simply smelled really good.))`

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode("What happens to the creature if the seed is never planted?"),
      ], 1),
      new FootnoteNode([
        new PlainTextNode("This probably wasn't a reference to the family of plants."),
      ], 2),
      new FootnoteNode([
        new PlainTextNode("Or maybe Ash simply smelled really good."),
      ], 3)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Bulbasaur')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth.'),
              footnotes[0],
              new PlainTextNode(' The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Confuse Ray')]),
            new DescriptionTerm([new PlainTextNode('Lick')]),
            new DescriptionTerm([
              new PlainTextNode('Night Shade'),
              footnotes[1]
            ])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('Ghost type moves.')
            ])
          ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Gary')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A young man with a great sense of smell.'),
              footnotes[2]
            ])
          ]))
        ]),

        new FootnoteBlockNode(footnotes)
      ])
    )
  })
})


describe("In a document, footnotes' reference numbers", () => {
  it('are always sequential, even across multiple outline conventions.', () => {
    const text = `
* I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

* I don't eat ((Or touch.)) pumpkins.

------------------------

I wear glasses ((It's actually been a dream of mine ever since I was young.)) even while working out.`

    const footnotesInUnorderedList = [
      new FootnoteNode([
        new PlainTextNode("Well, I do, but I pretend not to."),
      ], 1),
      new FootnoteNode([
        new PlainTextNode("Or touch."),
      ], 2)
    ]

    const footnoteInParagraph =
      new FootnoteNode([
        new PlainTextNode("It's actually been a dream of mine ever since I was young."),
      ], 3)


    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnotesInUnorderedList[0],
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              footnotesInUnorderedList[1],
              new PlainTextNode(" pumpkins."),
            ])
          ])
        ]),
        new FootnoteBlockNode(footnotesInUnorderedList),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode("I wear glasses"),
          footnoteInParagraph,
          new PlainTextNode(" even while working out."),
        ]),
        new FootnoteBlockNode([footnoteInParagraph])
      ]))
  })
})


describe('Nested footnotes', () => {
  it('that appear in the footnote block after any non-nested footnotes', () => {
    const text =
      "Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.)) Really. ((Probably.))"

    const footnoteInsideFirstFootnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do')
      ]),
      new PlainTextNode(', but I pretend not to.'),
    ], 3)

    const firstFootnote = new FootnoteNode([
      new PlainTextNode("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new PlainTextNode(" Never have."),
    ], 1)

    const secondFootnote = new FootnoteNode([
      new PlainTextNode("Probably."),
    ], 2)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          firstFootnote,
          new PlainTextNode(" Really."),
          secondFootnote,
        ]),
        new FootnoteBlockNode([
          firstFootnote,
          secondFootnote,
          footnoteInsideFirstFootnote,
        ])
      ]))
  })

  it('appear in the footnote block after lesser nested footnotes', () => {
    const text =
      "Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do* ((Only on Mondays...)) but I pretend not to.)) Never have. ((At least you've never seen me.)))) Really. ((Probably.))"

    const footnoteInsideFirstInnerFootnote =
      new FootnoteNode([
        new PlainTextNode("Only on Mondays..."),
      ], 5)

    const secondInnerFootnote = new FootnoteNode([
      new PlainTextNode("At least you've never seen me."),
    ], 4)

    const firstInnerFootnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do'),
      ]),
      footnoteInsideFirstInnerFootnote,
      new PlainTextNode(' but I pretend not to.'),
    ], 3)

    const firstFootnote = new FootnoteNode([
      new PlainTextNode("That said, I don't eat cereal."),
      firstInnerFootnote,
      new PlainTextNode(" Never have."),
      secondInnerFootnote,
    ], 1)

    const secondFootnote = new FootnoteNode([
      new PlainTextNode("Probably."),
    ], 2)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          firstFootnote,
          new PlainTextNode(" Really."),
          secondFootnote,
        ]),
        new FootnoteBlockNode([
          firstFootnote,
          secondFootnote,
          firstInnerFootnote,
          secondInnerFootnote,
          footnoteInsideFirstInnerFootnote
        ])
      ]))
  })
})
