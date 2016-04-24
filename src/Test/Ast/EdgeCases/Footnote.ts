
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
import { FootnoteReferenceNode } from '../../../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { Footnote } from '../../../SyntaxNodes/Footnote'
import { BlockquoteNode } from '../../../SyntaxNodes/BlockquoteNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../../../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../../../SyntaxNodes/UnorderedListItem'
import { SectionSeparatorNode } from '../../../SyntaxNodes/SectionSeparatorNode'


describe('A footnote reference at the end of a paragraph', () => {
  it('produces the expected syntax nodes', () => {
    expect(Up.toAst("I don't eat cereal. ((Well, I do, but I pretend not to.))")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteReferenceNode(1)
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode('Well, I do, but I pretend not to.')
          ], 1)
        ])
      ]))
  })
})


describe('Inside an outline convention, blockquoted footnote references', () => {
  it('produce footnote blocks directly after each appropriate convention within the blockquote', () => {
    const text = `
* > I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                new FootnoteReferenceNode(1),
                new PlainTextNode(" Never have."),
              ]),
              new FootnoteBlockNode([
                new Footnote([
                  new PlainTextNode("Well, I do, but I pretend not to."),
                ], 1),
              ])
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

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([
          new UnorderedListItem([
            new ParagraphNode([
              new PlainTextNode("I regularly drink water."),
              new FootnoteReferenceNode(1)
            ])
          ]),
          new UnorderedListItem([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                new FootnoteReferenceNode(2),
                new PlainTextNode(" Never have."),
              ]),
              new FootnoteBlockNode([
                new Footnote([
                  new PlainTextNode("Well, I do, but I pretend not to."),
                ], 2),
              ])
            ]),
          ]),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("When it's in other beverages."),
          ], 1),
        ])
      ]))
  })
})
