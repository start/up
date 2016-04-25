
import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../../SyntaxNodes/UnorderedListItem'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('A footnote reference at the end of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    const text = "I don't eat cereal. ((Well, I do, but I pretend not to.))"

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


describe('Inside an outline convention, blockquoted footnote references', () => {
  it('produce footnote blocks directly after each appropriate convention within the blockquote', () => {
    const text = `
* > I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.`

    const footnote = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend not to."),
    ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnote,
                new PlainTextNode(" Never have."),
              ]),
              new FootnoteBlockNode([footnote])
            ])
          ])
        ])
      ]))
  })
})

describe('Within an outline convention, a blockquoted footnote reference that follows a non-blockquoted footnote reference', () => {
  it("has a reference number greater than that of the preceding reference, but it produces footnote block that appears before the footnote block of the preceding reference", () => {
    const text = `
* I regularly drink water. ((When it's in other beverages.))

* > I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.`

    const footnoteInFirstListItem = new FootnoteNode([
      new PlainTextNode("When it's in other beverages."),
    ], 1)

    const footnoteInBlockquote = new FootnoteNode([
      new PlainTextNode("Well, I do, but I pretend not to."),
    ], 2)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I regularly drink water."),
              footnoteInFirstListItem
            ])
          ]),
          new UnorderedListItem([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                footnoteInBlockquote,
                new PlainTextNode(" Never have."),
              ]),
              new FootnoteBlockNode([footnoteInBlockquote])
            ]),
          ]),
        ]),
        new FootnoteBlockNode([footnoteInFirstListItem])
      ]))
  })
})



describe('A footnote with inner footnotes followed by another footnote with inner footnotes', () => {
  it('produces no duplicate reference numbers', () => {
    const text =
      "Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I *do*, but I pretend not to.)) Never have.)) Really. ((Probably. ((No.))))"

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

    const footnoteInsideSecondFootnote = new FootnoteNode([
      new PlainTextNode("No."),
    ], 4)

    const secondFootnote = new FootnoteNode([
      new PlainTextNode("Probably."),
      footnoteInsideSecondFootnote
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
          footnoteInsideSecondFootnote
        ])
      ]))
  })
})