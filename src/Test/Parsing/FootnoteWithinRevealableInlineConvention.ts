import { expect } from 'chai'
import Up from '../../index'
import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'


context("When a footnote is inside a revealable inline convention, the footnote's body in its footnote block is placed inside that same hidden revealable convention.", () => {
  context('Specifically:', () => {
    specify("Spoilers", () => {
      const footnoteOutsideHiddenConvention = new Footnote([
        new PlainText('Really.')
      ], { referenceNumber: 1 })

      const footnoteInsideHiddenConvention = new Footnote([
        new InlineSpoiler([
          new PlainText('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 2 })

      expect(Up.toDocument("I'm normal. (^Really.) [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new PlainText("I'm normal."),
            footnoteOutsideHiddenConvention,
            new PlainText(" "),
            new InlineSpoiler([
              new PlainText("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new PlainText(" Never have."),
            ])
          ]),
          new FootnoteBlock([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })

    specify("NSFW conventions", () => {
      const footnoteOutsideHiddenConvention = new Footnote([
        new PlainText('Really.')
      ], { referenceNumber: 1 })

      const footnoteInsideHiddenConvention = new Footnote([
        new InlineNsfw([
          new PlainText('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 2 })

      expect(Up.toDocument("I'm normal. (^Really.) [NSFW: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new PlainText("I'm normal."),
            footnoteOutsideHiddenConvention,
            new PlainText(" "),
            new InlineNsfw([
              new PlainText("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new PlainText(" Never have."),
            ])
          ]),
          new FootnoteBlock([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })

    specify("NSFL conventions", () => {
      const footnoteOutsideHiddenConvention = new Footnote([
        new PlainText('Really.')
      ], { referenceNumber: 1 })

      const footnoteInsideHiddenConvention = new Footnote([
        new InlineNsfl([
          new PlainText('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 2 })

      expect(Up.toDocument("I'm normal. (^Really.) [NSFL: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new PlainText("I'm normal."),
            footnoteOutsideHiddenConvention,
            new PlainText(" "),
            new InlineNsfl([
              new PlainText("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new PlainText(" Never have."),
            ])
          ]),
          new FootnoteBlock([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })
  })


  specify("This doesn't affect revealable conventions within footnotes", () => {
    const footnote = new Footnote([
      new PlainText('After you beat the Elite Four, '),
      new InlineSpoiler([
        new PlainText('You have to beat your rival.')
      ])
    ], { referenceNumber: 1 })

    expect(Up.toDocument("Beating the game isn't a quick process. (^After you beat the Elite Four, [SPOILER: You have to beat your rival.])")).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText("Beating the game isn't a quick process."),
          footnote
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })



  specify("This includes nested footnotes within a revealable inline convention", () => {
    const innerFootnote = new Footnote([
      new InlineNsfw([
        new PlainText('Well, I do, but I pretend not to.')
      ])
    ], { referenceNumber: 2 })

    const outerFootnote = new Footnote([
      new InlineNsfw([
        new PlainText("I don't eat cereal."),
        innerFootnote,
        new PlainText(" Never have."),
      ])
    ], { referenceNumber: 1 })

    expect(Up.toDocument("(NSFW: I'm normal. [^ I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineNsfw([
            new PlainText("I'm normal."),
            outerFootnote
          ])
        ]),
        new FootnoteBlock([
          outerFootnote,
          innerFootnote
        ])
      ]))
  })


  context("When a footnote is inside multiple revealable inline conventions, the footnote's body is only placed inside the innermost one. This includes when the footnote is nested within", () => {
    specify("a spoiler convention within a NSFW convention", () => {
      const footnote = new Footnote([
        new InlineSpoiler([
          new PlainText('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 1 })

      expect(Up.toDocument("(NSFW: [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
        new UpDocument([
          new Paragraph([
            new InlineNsfw([
              new InlineSpoiler([
                new PlainText("I don't eat cereal."),
                footnote,
                new PlainText(" Never have."),
              ])
            ])
          ]),
          new FootnoteBlock([
            footnote
          ])
        ]))
    })
  })

  specify("a NSFW convention within a NSFL convention", () => {
    const footnote = new Footnote([
      new InlineNsfw([
        new PlainText('Well, I do, but I pretend not to.')
      ])
    ], { referenceNumber: 1 })

    expect(Up.toDocument("(NSFL: [NSFW: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineNsfl([
            new InlineNsfw([
              new PlainText("I don't eat cereal."),
              footnote,
              new PlainText(" Never have."),
            ])
          ])
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })

  specify("a NSFL convention within a spoiler convention", () => {
    const footnote = new Footnote([
      new InlineNsfl([
        new PlainText('Well, I do, but I pretend not to.')
      ])
    ], { referenceNumber: 1 })

    expect(Up.toDocument("(SPOILER: [NSFL: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineSpoiler([
            new InlineNsfl([
              new PlainText("I don't eat cereal."),
              footnote,
              new PlainText(" Never have."),
            ])
          ])
        ]),
        new FootnoteBlock([
          footnote
        ])
      ]))
  })
})

