
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
import { PlaceholderFootnoteReferenceNode } from '../../../SyntaxNodes/PlaceholderFootnoteReferenceNode'
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


describe('Footnote references inside a blockquote nested inside another outline convention', () => {
  it('produce a footnote block after the outer outline convention. Being inside a blockquote changes nothing', () => {
    const text = `
* > I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.

  It's too expensive.

* I don't eat ((Or touch.)) pumpkins.`

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new UnorderedListNode([

          new UnorderedListItem([
            new BlockquoteNode([
              new ParagraphNode([
                new PlainTextNode("I don't eat cereal."),
                new FootnoteReferenceNode(1),
                new PlainTextNode(" Never have."),
              ])
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
          ], 2),
        ])
      ]))
  })
})