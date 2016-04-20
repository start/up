
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
import { PlaceholderFootnoteReferenceNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { FootnoteReferenceNode } from '../../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { Footnote } from '../../SyntaxNodes/Footnote'


describe('In a paragraph, text surrounded by 2 parentheses', () => {
  it('produces a footnote reference node. This node references a footnote within a footnote block node after the paragraph', () => {
    expect(Up.toAst("I don't eat cereal. ((Well, I do, but I pretend not to.)) I haven't for years.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" I haven't for years."),
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
    expect(Up.toAst("I don't eat cereal. ((Well, I *do*, but I pretend not to.)) I haven't for years.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("I don't eat cereal."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" I haven't for years."),
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
    expect(Up.toAst("Me? I'm not crazy. ((I don't eat cereal. ((Well, I *do*, but I pretend not to.)) I haven't for years.)) Really.")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Me? I'm not crazy."),
          new FootnoteReferenceNode(1),
          new PlainTextNode(" Really."),
        ]),
        new FootnoteBlockNode([
          new Footnote([
            new PlainTextNode("I don't eat cereal."),
            new FootnoteReferenceNode(2),
            new PlainTextNode(" I haven't for years."),
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
