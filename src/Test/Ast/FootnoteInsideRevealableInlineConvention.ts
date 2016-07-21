import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


context("When a footnote is inside a revealable inline convention, the footnote's body in its footnote block is placed inside that same revealable inline convention.", () => {
  context('Specifically:', () => {
    specify("Spoilers", () => {
      const footnoteOutsideRevealableConvention = new FootnoteNode([
        new PlainTextNode('Really.')
      ], 1)

      const footnoteInsideRevealableConvention = new FootnoteNode([
        new InlineSpoilerNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ])
      ], 2)

      expect(Up.toAst("I'm normal. (^Really.) [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I'm normal."),
            footnoteOutsideRevealableConvention,
            new PlainTextNode(" "),
            new InlineSpoilerNode([
              new PlainTextNode("I don't eat cereal."),
              footnoteInsideRevealableConvention,
              new PlainTextNode(" Never have."),
            ])
          ]),
          new FootnoteBlockNode([
            footnoteOutsideRevealableConvention,
            footnoteInsideRevealableConvention
          ])
        ]))
    })
  })
})
