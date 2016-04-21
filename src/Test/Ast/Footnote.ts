
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { PlaceholderFootnoteReferenceNode } from '../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
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
import { FootnoteReferenceNode } from '../../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { Footnote } from '../../SyntaxNodes/Footnote'


describe('In a paragraph, text surrounded by 2 parentheses', () => {
  it('produces a footnote reference node. This node references a footnote within a footnote block node after the paragraph', () => {
    expect(Up.toAst("I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode('Well, I do, but I pretend not to.')
          ], 1)
        ])
      ]))
  })
})


describe('A footnote reference', () => {
  it('is evaluated for other conventions', () => {
    expect(Up.toAst("I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Never have."),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode('Well, I '),
            new EmphasisNode([
              new PlainTextNode('do')
            ]),
            new PlainTextNode(', but I pretend not to.')
          ], 1)
        ])
      ]))
  })

  it('can contain other footnote references, which produce additional footnotes in the same footnote block', () => {
    expect(Up.toAst("Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.)) Really.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Really."),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("That said, I don't eat cereal."),
            new FootnoteReferenceNode(2),
            new PlainTextNode(" Never have."),
          ], 1),
          new Footnote([
            new PlainTextNode('Well, I '),
            new EmphasisNode([
              new PlainTextNode('do')
            ]),
            new PlainTextNode(', but I pretend not to.'),
          ], 2)
        ])
      ]))
  })
})

describe('Footnote references in a heading', () => {
  it('produce a footnote block node after the heading', () => {
    const text = `
I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.
------`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new HeadingNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Never have."),
        ], 1),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode('Well, I do, but I pretend not to.')
          ], 1)
        ])
      ]))
  })
})


describe('Footnote references in a line block', () => {
  it('produce a footnote block node after the line block', () => {
    const text = `
Roses are red ((This is not my line.))
Violets are blue ((Neither is this line. I think my mom made it up.))`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode("Roses are red"),
            new FootnoteReferenceNode(1),
          ]),
          new Line([
            new PlainTextNode("Violets are blue"),
            new FootnoteReferenceNode(2),
          ])
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode('This is not my line.')
          ], 1),
          new Footnote([
            new PlainTextNode('Neither is this line. I think my mom made it up.')
          ], 2)
        ])
      ]))
  })
})


describe('Footnote references in unordered list items', () => {
  it('produce a footnote block node that appears after the entire list', () => {
    const text = `
* I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

* I don't eat ((Or touch.)) pumpkins.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              new FootnoteReferenceNode(1),
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              new FootnoteReferenceNode(2),
              new PlainTextNode(" pumpkins."),
            ])
          ])
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("Well, I do, but I pretend not to."),
          ], 1),
          new Footnote([
            new PlainTextNode("Or touch."),
          ], 2)
        ])
      ]))
  })
})


describe('Footnote references in ordered list items', () => {
  it('produce a footnote block node that appears after the entire list', () => {
    const text = `
1) I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

2) I don't eat ((Or touch.)) pumpkins.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new OrderedListNode([
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              new FootnoteReferenceNode(1),
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ], 1),
          new OrderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              new FootnoteReferenceNode(2),
              new PlainTextNode(" pumpkins."),
            ])
          ], 2)
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("Well, I do, but I pretend not to."),
          ], 1),
          new Footnote([
            new PlainTextNode("Or touch."),
          ], 2)
        ])
      ]))
  })
})


describe('Footnote references in description list terms and definitions', () => {
  it('produce a footnote block node that appears after the entire description list', () => {
    const text = `
Bulbasaur
  A strange seed was planted on its back at birth. ((What happens to the creature if the seed is never planted?)) The plant sprouts and grows with this Pokémon.

Confuse Ray
Lick
Night Shade ((This probably wasn't a reference to the family of plants.))
  Ghost type moves.
  
Gary
  A young man with a great sense of smell. ((Or maybe Ash simply smelled really good.))`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new DescriptionListNode([
          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Bulbasaur')])
          ], new Description([
            new ParagraphNode([
              new PlainTextNode('A strange seed was planted on its back at birth.'),
              new FootnoteReferenceNode(1),
              new PlainTextNode(' The plant sprouts and grows with this Pokémon.')
            ])
          ])),

          new DescriptionListItem([
            new DescriptionTerm([new PlainTextNode('Confuse Ray')]),
            new DescriptionTerm([new PlainTextNode('Lick')]),
            new DescriptionTerm([
              new PlainTextNode('Night Shade'),
              new FootnoteReferenceNode(2)
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
              new FootnoteReferenceNode(3)
            ])
          ]))
        ]),
        
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("What happens to the creature if the seed is never planted?"),
          ], 1),
          new Footnote([
            new PlainTextNode("This probably wasn't a reference to the family of plants."),
          ], 2),
          new Footnote([
            new PlainTextNode("Or maybe Ash simply smelled really good."),
          ], 3)
        ])
      ])
    )
  })
})


describe('The reference numbers in a document', () => {
  it('are always sequential, even across multiple outline conventions.', () => {
    const text = `
* I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

* I don't eat ((Or touch.)) pumpkins.

------------------------

I wear glasses ((It's actually been a dream of mine ever since I was young.)) even while working out.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat cereal."),
              new FootnoteReferenceNode(1),
              new PlainTextNode(" Never have."),
            ]),
            new ParagraphNode([
              new PlainTextNode("It's too expensive.")
            ])
          ]),
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I don't eat"),
              new FootnoteReferenceNode(2),
              new PlainTextNode(" pumpkins."),
            ])
          ])
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("Well, I do, but I pretend not to."),
          ], 1),
          new Footnote([
            new PlainTextNode("Or touch."),
          ], 2)
        ]),
        new SectionSeparatorNode(),
        new ParagraphNode([
          new PlainTextNode("I wear glasses"),
          new FootnoteReferenceNode(3),
          new PlainTextNode(" even while working out."),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("It's actually been a dream of mine ever since I was young."),
          ], 3)
        ])
      ]))
  })
})



describe('Nested footnote references', () => {
  it('produce footnotes that appear after any footnotes produced by non-nested references', () => {
    expect(Up.toAst("Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.)) Really. ((Probably.))")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Really."),
          new FootnoteReferenceNode(2),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("That said, I don't eat cereal."),
            new FootnoteReferenceNode(3),
            new PlainTextNode(" Never have."),
          ], 1),
          new Footnote([
            new PlainTextNode("Probably."),
          ], 2),
          new Footnote([
            new PlainTextNode('Well, I '),
            new EmphasisNode([
              new PlainTextNode('do')
            ]),
            new PlainTextNode(', but I pretend not to.'),
          ], 3),
        ])
      ]))
  })


  it('produce footnotes that appear after any footnotes produced by less nested references', () => {
    const text =
      "Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do* ((Only on Mondays...)) but I pretend not to.)) Never have. ((At least you've never seen me.)))) Really. ((Probably.))"

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm totally normal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Really."),
          new FootnoteReferenceNode(2),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("That said, I don't eat cereal."),
            new FootnoteReferenceNode(3),
            new PlainTextNode(" Never have."),
            new FootnoteReferenceNode(4),
          ], 1),
          new Footnote([
            new PlainTextNode("Probably."),
          ], 2),
          new Footnote([
            new PlainTextNode('Well, I '),
            new EmphasisNode([
              new PlainTextNode('do'),
            ]),
            new FootnoteReferenceNode(5),
            new PlainTextNode(' but I pretend not to.'),
          ], 3),
          new Footnote([
            new PlainTextNode("At least you've never seen me."),
          ], 4),
          new Footnote([
            new PlainTextNode("Only on Mondays..."),
          ], 5),
        ])
      ]))
  })
})