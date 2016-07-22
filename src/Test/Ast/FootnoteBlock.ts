import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../../SyntaxNodes/DescriptionTerm'
import { Description } from '../../SyntaxNodes/Description'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


describe('A footnote in a paragph', () => {
  it("produces a footnote block node after the paragraph", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

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


describe('A paragraph with two footnotes', () => {
  it("produces a single footnote block node after the paragraph for both footnotes", () => {
    const text = "I don't eat cereal. (^Well, I do, but I pretend not to.) Never have. (^Except for Mondays.)"

    const footnotes = [
      new FootnoteNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ], 1),
      new FootnoteNode([
        new PlainTextNode('Except for Mondays.')
      ], 2)
    ]

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          footnotes[0],
          new PlainTextNode(" Never have."),
          footnotes[1]
        ]),
        new FootnoteBlockNode(footnotes)
      ]))
  })
})


describe('Footnotes in a heading', () => {
  it('produce a footnote block after the heading', () => {
    const text = `
I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
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
Roses are red (^This is not my line.)
Violets are blue (^Neither is this line. I think my mom made it up.)`

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
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* I don't eat (^Or touch.) pumpkins.

* Roses are red (^This is not my line.)
  Violets are blue (^Neither is this line. I think my mom made it up.)`

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

          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnotes[0],
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),

          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              footnotes[1],
              new PlainTextNode(" pumpkins."),
            ])
          ]),

          new UnorderedListNode.Item([
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
    const text = "> I don't eat cereal. (^Well, I do, but I pretend not to.) Never have."

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
  it("produce footnote blocks inside the blockquote after all the appropriate outline conventions", () => {
    const text = `
> * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
>
>   It's too expensive.
>
> * I don't eat (^Or touch.) pumpkins.`

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

            new UnorderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnotes[0],
                new PlainTextNode(" Never have."),
              ]),
              new ParagraphNode([
                new PlainTextNode("It's too expensive.")
              ])
            ]),

            new UnorderedListNode.Item([
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


describe('Footnotes in a spoiler block', () => {
  it('produce footnote blocks within the spoiler block', () => {
    const text = `
SPOILER:

  This ruins the movie. [^ And this is a fun fact.]`

    const footnote =
      new FootnoteNode([
        new PlainTextNode("And this is a fun fact."),
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new SpoilerBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            footnote,
          ]),
          new FootnoteBlockNode([footnote]),
        ])
      ])
    )
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a spoiler block', () => {
  it("produce footnote blocks inside the spoiler block after all the appropriate outline conventions", () => {
    const text = `
SPOILER:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.`

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
        new SpoilerBlockNode([

          new UnorderedListNode([

            new UnorderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnotes[0],
                new PlainTextNode(" Never have."),
              ]),
              new ParagraphNode([
                new PlainTextNode("It's too expensive.")
              ])
            ]),

            new UnorderedListNode.Item([
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


describe('Footnotes in a spoiler block', () => {
  it('produce footnote blocks within the spoiler block', () => {
    const text = `
NSFW:

  This ruins the movie. [^ And this is a fun fact.]`

    const footnote =
      new FootnoteNode([
        new PlainTextNode("And this is a fun fact."),
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsfwBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            footnote,
          ]),
          new FootnoteBlockNode([footnote]),
        ])
      ])
    )
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a spoiler block', () => {
  it("produce footnote blocks inside the spoiler block after all the appropriate outline conventions", () => {
    const text = `
NSFW:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.`

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
        new NsfwBlockNode([

          new UnorderedListNode([

            new UnorderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnotes[0],
                new PlainTextNode(" Never have."),
              ]),
              new ParagraphNode([
                new PlainTextNode("It's too expensive.")
              ])
            ]),

            new UnorderedListNode.Item([
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


describe('Footnotes in a spoiler block', () => {
  it('produce footnote blocks within the spoiler block', () => {
    const text = `
NSFL:

  This ruins the movie. [^ And this is a fun fact.]`

    const footnote =
      new FootnoteNode([
        new PlainTextNode("And this is a fun fact."),
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new NsflBlockNode([
          new ParagraphNode([
            new PlainTextNode("This ruins the movie."),
            footnote,
          ]),
          new FootnoteBlockNode([footnote]),
        ])
      ])
    )
  })
})


describe('Footnotes nested inside 2 or more outline conventions nested inside a spoiler block', () => {
  it("produce footnote blocks inside the spoiler block after all the appropriate outline conventions", () => {
    const text = `
NSFL:

  * I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.
 
    It's too expensive.
 
  * I don't eat (^Or touch.) pumpkins.`

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
        new NsflBlockNode([

          new UnorderedListNode([

            new UnorderedListNode.Item([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnotes[0],
                new PlainTextNode(" Never have."),
              ]),
              new ParagraphNode([
                new PlainTextNode("It's too expensive.")
              ])
            ]),

            new UnorderedListNode.Item([
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
1) I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

2) I don't eat (^Or touch.) pumpkins.`

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
          new OrderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnotes[0],
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ], 1),
          new OrderedListNode.Item([
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
  A strange seed was planted on its back at birth. (^What happens to the creature if the seed is never planted?) The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade (^This probably wasn't a reference to the family of plants.)
  Ghost type moves.
  
Gary
  A young man with a great sense of smell. (^Or maybe Ash simply smelled really good.)`

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
  it('do not reset between outline conventions.', () => {
    const text = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* I don't eat (^Or touch.) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

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
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnotesInUnorderedList[0],
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),
          new UnorderedListNode.Item([
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


describe("Within an outline convention, a blockquoted footnote that follows a non-blockquoted footnote", () => {
  it('has a reference number greater than that of the preceding footnote (inside the same outline convention), but it produces footnote block that appears before the footnote block of the preceding footnote', () => {
    const text = `
* I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.

  It's too expensive.

* > I don't eat (^Or touch.) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const footnoteInUnorderedList = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend not to."),
    ], 1)

    const footnoteInBlockquote = new FootnoteNode([
      new PlainTextNode("Or touch."),
    ], 2)

    const footnoteInParagraph = new FootnoteNode([
      new PlainTextNode("It's actually been a dream of mine ever since I was young."),
    ], 3)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnoteInUnorderedList,
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),
          new UnorderedListNode.Item([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat"),
                footnoteInBlockquote,
                new PlainTextNode(" pumpkins."),
              ]),
              new FootnoteBlockNode([footnoteInBlockquote])
            ])
          ])
        ]),
        new FootnoteBlockNode([footnoteInUnorderedList]),
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


describe("Within an outline convention, a blockquoted nested footnote that follows a non-blockquoted nested footnote", () => {
  it('has a reference number lower than that of the preceding nested footnote (inside the same outline convention) because it gets referenced in an earlier footnote block', () => {
    const text = `
* I don't eat cereal. (^Well, I do, but I pretend [^On Mondays.] not to.) Never have.

  It's too expensive.

* > I don't eat (^Or touch. [^Or smell.]) pumpkins.

------------------------

I wear glasses (^It's actually been a dream of mine ever since I was young.) even while working out.`

    const nestedFootnoteInUnorderedList = new FootnoteNode([
      new PlainTextNode("On Mondays."),
    ], 4)

    const footnoteInUnorderedList = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend"),
      nestedFootnoteInUnorderedList,
      new PlainTextNode(' not to.')
    ], 1)

    const nestedFootnoteInBlockquote = new FootnoteNode([
      new PlainTextNode("Or smell."),
    ], 3)

    const footnoteInBlockquote = new FootnoteNode([
      new PlainTextNode("Or touch."),
      nestedFootnoteInBlockquote
    ], 2)

    const footnoteInParagraph = new FootnoteNode([
      new PlainTextNode("It's actually been a dream of mine ever since I was young."),
    ], 5)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListNode.Item([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              footnoteInUnorderedList,
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),
          new UnorderedListNode.Item([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat"),
                footnoteInBlockquote,
                new PlainTextNode(" pumpkins."),
              ]),
              new FootnoteBlockNode([
                footnoteInBlockquote,
                nestedFootnoteInBlockquote
              ])
            ])
          ])
        ]),
        new FootnoteBlockNode([
          footnoteInUnorderedList,
          nestedFootnoteInUnorderedList
        ]),
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


describe('Nesed footnotes (footnotes referenced by other footnotes)', () => {
  it('appear in their footnote block after any non-nested footnotes (and are assigned reference numbers after any non-nested footnotes)', () => {
    const text = "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably.)"

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

  it('appear in the footnote block after any lesser nested footnotes (and are assigned reference numbers after any lesser-nested footnotes)', () => {
    const text =
      "Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do* (^Only on Mondays...) but I pretend not to.) Never have. (^At least you've never seen me.)) Really. (^Probably.)"

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

  it('have reference numbers coming before any footnotes in subsequent outline conventions (because they are referenced earlier)', () => {
    const text = `
Me? I'm totally normal. (^That said, I don't eat cereal. (^Well, I *do*, but I pretend not to.) Never have.) Really. (^Probably.)

I don't eat (^Or touch.) pumpkins.`

    const footnoteInsideFirstFootnote = new FootnoteNode([
      new PlainTextNode('Well, I '),
      new EmphasisNode([
        new PlainTextNode('do')
      ]),
      new PlainTextNode(', but I pretend not to.'),
    ], 3)

    const firstFootnoteInFirstParagraph = new FootnoteNode([
      new PlainTextNode("That said, I don't eat cereal."),
      footnoteInsideFirstFootnote,
      new PlainTextNode(" Never have."),
    ], 1)

    const secondFootnoteInFirstParagraph = new FootnoteNode([
      new PlainTextNode("Probably."),
    ], 2)

    const footnoteInSecondParagraph = new FootnoteNode([
      new PlainTextNode("Or touch."),
    ], 4)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          firstFootnoteInFirstParagraph,
          new PlainTextNode(" Really."),
          secondFootnoteInFirstParagraph,
        ]),
        new FootnoteBlockNode([
          firstFootnoteInFirstParagraph,
          secondFootnoteInFirstParagraph,
          footnoteInsideFirstFootnote,
        ]),
        new ParagraphNode([
          new PlainTextNode("I don't eat"),
          footnoteInSecondParagraph,
          new PlainTextNode(' pumpkins.')
        ]),
        new FootnoteBlockNode([
          footnoteInSecondParagraph
        ])
      ]))
  })
})
