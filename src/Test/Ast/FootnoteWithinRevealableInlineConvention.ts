import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


context("When a footnote is inside a revealable inline convention, the footnote's body in its footnote block is placed inside that same hidden revealable convention.", () => {
  context('Specifically:', () => {
    specify("Spoilers", () => {
      const footnoteOutsideHiddenConvention = new FootnoteNode([
        new PlainTextNode('Really.')
      ], 1)

      const footnoteInsideHiddenConvention = new FootnoteNode([
        new InlineSpoilerNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ])
      ], 2)

      expect(Up.toAst("I'm normal. (^Really.) [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I'm normal."),
            footnoteOutsideHiddenConvention,
            new PlainTextNode(" "),
            new InlineSpoilerNode([
              new PlainTextNode("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new PlainTextNode(" Never have."),
            ])
          ]),
          new FootnoteBlockNode([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })

    specify("NSFW conventions", () => {
      const footnoteOutsideHiddenConvention = new FootnoteNode([
        new PlainTextNode('Really.')
      ], 1)

      const footnoteInsideHiddenConvention = new FootnoteNode([
        new InlineNsfwNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ])
      ], 2)

      expect(Up.toAst("I'm normal. (^Really.) [NSFW: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I'm normal."),
            footnoteOutsideHiddenConvention,
            new PlainTextNode(" "),
            new InlineNsfwNode([
              new PlainTextNode("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new PlainTextNode(" Never have."),
            ])
          ]),
          new FootnoteBlockNode([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })

    specify("NSFL conventions", () => {
      const footnoteOutsideHiddenConvention = new FootnoteNode([
        new PlainTextNode('Really.')
      ], 1)

      const footnoteInsideHiddenConvention = new FootnoteNode([
        new InlineNsflNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ])
      ], 2)

      expect(Up.toAst("I'm normal. (^Really.) [NSFL: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new PlainTextNode("I'm normal."),
            footnoteOutsideHiddenConvention,
            new PlainTextNode(" "),
            new InlineNsflNode([
              new PlainTextNode("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new PlainTextNode(" Never have."),
            ])
          ]),
          new FootnoteBlockNode([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })
  })


  specify("This doesn't affect revealable conventions within footnotes", () => {
    const footnote = new FootnoteNode([
      new PlainTextNode('After you beat the Elite Four, '),
      new InlineSpoilerNode([
        new PlainTextNode('You have to beat your rival.')
      ])
    ], 1)

    expect(Up.toAst("Beating the game isn't a quick process. (^After you beat the Elite Four, [SPOILER: You have to beat your rival.])")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode("Beating the game isn't a quick process."),
          footnote
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })



  specify("This includes nested footnotes within a revealable inline convention", () => {
    const innerFootnote = new FootnoteNode([
      new InlineNsfwNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ])
    ], 2)

    const outerFootnote = new FootnoteNode([
      new InlineNsfwNode([
        new PlainTextNode("I don't eat cereal."),
        innerFootnote,
        new PlainTextNode(" Never have."),
      ])
    ], 1)

    expect(Up.toAst("{NSFW: I'm normal. [^ I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]}")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineNsfwNode([
            new PlainTextNode("I'm normal."),
            outerFootnote
          ])
        ]),
        new FootnoteBlockNode([
          outerFootnote,
          innerFootnote
        ])
      ]))
  })


  context("When a footnote is inside multiple revealable inline conventions, the footnote's body is only placed inside the innermost one. This includes when the footnote is nested within", () => {
    specify("a spoiler convention within a NSFW convention", () => {
      const footnote = new FootnoteNode([
        new InlineSpoilerNode([
          new PlainTextNode('Well, I do, but I pretend not to.')
        ])
      ], 1)

      expect(Up.toAst("{NSFW: [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]}")).to.be.eql(
        new DocumentNode([
          new ParagraphNode([
            new InlineNsfwNode([
              new InlineSpoilerNode([
                new PlainTextNode("I don't eat cereal."),
                footnote,
                new PlainTextNode(" Never have."),
              ])
            ])
          ]),
          new FootnoteBlockNode([
            footnote
          ])
        ]))
    })
  })

  specify("a NSFW convention within a NSFL convention", () => {
    const footnote = new FootnoteNode([
      new InlineNsfwNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ])
    ], 1)

    expect(Up.toAst("{NSFL: [NSFW: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]}")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineNsflNode([
            new InlineNsfwNode([
              new PlainTextNode("I don't eat cereal."),
              footnote,
              new PlainTextNode(" Never have."),
            ])
          ])
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })

  specify("a NSFL convention within a spoiler convention", () => {
    const footnote = new FootnoteNode([
      new InlineNsflNode([
        new PlainTextNode('Well, I do, but I pretend not to.')
      ])
    ], 1)

    expect(Up.toAst("{SPOILER: [NSFL: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]}")).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineSpoilerNode([
            new InlineNsflNode([
              new PlainTextNode("I don't eat cereal."),
              footnote,
              new PlainTextNode(" Never have."),
            ])
          ])
        ]),
        new FootnoteBlockNode([
          footnote
        ])
      ]))
  })
})

