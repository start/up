import { expect } from 'chai'
import * as Up from '../../index'


context("When a footnote is inside a revealable inline convention, the footnote's body in its footnote block is placed inside that same hidden revealable convention.", () => {
  context('Specifically:', () => {
    specify("Spoilers", () => {
      const footnoteOutsideHiddenConvention = new Up.Footnote([
        new Up.Text('Really.')
      ], { referenceNumber: 1 })

      const footnoteInsideHiddenConvention = new Up.Footnote([
        new Up.InlineSpoiler([
          new Up.Text('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 2 })

      expect(Up.parse("I'm normal. (^Really.) [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm normal."),
            footnoteOutsideHiddenConvention,
            new Up.Text(" "),
            new Up.InlineSpoiler([
              new Up.Text("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new Up.Text(" Never have."),
            ])
          ]),
          new Up.FootnoteBlock([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })

    specify("NSFW conventions", () => {
      const footnoteOutsideHiddenConvention = new Up.Footnote([
        new Up.Text('Really.')
      ], { referenceNumber: 1 })

      const footnoteInsideHiddenConvention = new Up.Footnote([
        new Up.InlineNsfw([
          new Up.Text('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 2 })

      expect(Up.parse("I'm normal. (^Really.) [NSFW: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm normal."),
            footnoteOutsideHiddenConvention,
            new Up.Text(" "),
            new Up.InlineNsfw([
              new Up.Text("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new Up.Text(" Never have."),
            ])
          ]),
          new Up.FootnoteBlock([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })

    specify("NSFL conventions", () => {
      const footnoteOutsideHiddenConvention = new Up.Footnote([
        new Up.Text('Really.')
      ], { referenceNumber: 1 })

      const footnoteInsideHiddenConvention = new Up.Footnote([
        new Up.InlineNsfl([
          new Up.Text('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 2 })

      expect(Up.parse("I'm normal. (^Really.) [NSFL: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.]")).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.Text("I'm normal."),
            footnoteOutsideHiddenConvention,
            new Up.Text(" "),
            new Up.InlineNsfl([
              new Up.Text("I don't eat cereal."),
              footnoteInsideHiddenConvention,
              new Up.Text(" Never have."),
            ])
          ]),
          new Up.FootnoteBlock([
            footnoteOutsideHiddenConvention,
            footnoteInsideHiddenConvention
          ])
        ]))
    })
  })


  specify("This doesn't affect revealable conventions within footnotes", () => {
    const footnote = new Up.Footnote([
      new Up.Text('After you beat the Elite Four, '),
      new Up.InlineSpoiler([
        new Up.Text('You have to beat your rival.')
      ])
    ], { referenceNumber: 1 })

    expect(Up.parse("Beating the game isn't a quick process. (^After you beat the Elite Four, [SPOILER: You have to beat your rival.])")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text("Beating the game isn't a quick process."),
          footnote
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })



  specify("This includes nested footnotes within a revealable inline convention", () => {
    const innerFootnote = new Up.Footnote([
      new Up.InlineNsfw([
        new Up.Text('Well, I do, but I pretend not to.')
      ])
    ], { referenceNumber: 2 })

    const outerFootnote = new Up.Footnote([
      new Up.InlineNsfw([
        new Up.Text("I don't eat cereal."),
        innerFootnote,
        new Up.Text(" Never have."),
      ])
    ], { referenceNumber: 1 })

    expect(Up.parse("(NSFW: I'm normal. [^ I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfw([
            new Up.Text("I'm normal."),
            outerFootnote
          ])
        ]),
        new Up.FootnoteBlock([
          outerFootnote,
          innerFootnote
        ])
      ]))
  })


  context("When a footnote is inside multiple revealable inline conventions, the footnote's body is only placed inside the innermost one. This includes when the footnote is nested within", () => {
    specify("a spoiler convention within a NSFW convention", () => {
      const footnote = new Up.Footnote([
        new Up.InlineSpoiler([
          new Up.Text('Well, I do, but I pretend not to.')
        ])
      ], { referenceNumber: 1 })

      expect(Up.parse("(NSFW: [SPOILER: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
        new Up.Document([
          new Up.Paragraph([
            new Up.InlineNsfw([
              new Up.InlineSpoiler([
                new Up.Text("I don't eat cereal."),
                footnote,
                new Up.Text(" Never have."),
              ])
            ])
          ]),
          new Up.FootnoteBlock([
            footnote
          ])
        ]))
    })
  })

  specify("a NSFW convention within a NSFL convention", () => {
    const footnote = new Up.Footnote([
      new Up.InlineNsfw([
        new Up.Text('Well, I do, but I pretend not to.')
      ])
    ], { referenceNumber: 1 })

    expect(Up.parse("(NSFL: [NSFW: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfl([
            new Up.InlineNsfw([
              new Up.Text("I don't eat cereal."),
              footnote,
              new Up.Text(" Never have."),
            ])
          ])
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })

  specify("a NSFL convention within a spoiler convention", () => {
    const footnote = new Up.Footnote([
      new Up.InlineNsfl([
        new Up.Text('Well, I do, but I pretend not to.')
      ])
    ], { referenceNumber: 1 })

    expect(Up.parse("(SPOILER: [NSFL: I don't eat cereal. (^ Well, I do, but I pretend not to.) Never have.])")).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineSpoiler([
            new Up.InlineNsfl([
              new Up.Text("I don't eat cereal."),
              footnote,
              new Up.Text(" Never have."),
            ])
          ])
        ]),
        new Up.FootnoteBlock([
          footnote
        ])
      ]))
  })
})

