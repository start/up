
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
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
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
})