import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { LinkNode } from'../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from'../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from'../../../SyntaxNodes/EmphasisNode'
import { StressNode } from'../../../SyntaxNodes/StressNode'
import { BoldNode } from'../../../SyntaxNodes/BoldNode'
import { RevisionInsertionNode } from'../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from'../../../SyntaxNodes/RevisionDeletionNode'
import { InlineSpoilerNode } from'../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsflNode } from'../../../SyntaxNodes/InlineNsflNode'
import { InlineNsfwNode } from'../../../SyntaxNodes/InlineNsfwNode'
import { ParenthesizedNode } from'../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from'../../../SyntaxNodes/SquareBracketedNode'
import { HighlightNode } from'../../../SyntaxNodes/HighlightNode'


context('When most otherwise-nested conventions overlap by only their start delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, revision insertion) overlap a third (e.g. revision deletion)', () => {
      expect(Up.toAst('**++~~Hello++ good** friend!~~ Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new StressNode([
              new RevisionInsertionNode([
                new PlainTextNode('Hello')
              ]),
              new PlainTextNode(' good')
            ]),
            new PlainTextNode(' friend!')
          ]),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, link) overlapping a freely-splittable convention (e.g. stress)', () => {
      expect(Up.toAst('[NSFL: (**Ash)(example.com) is] a friend!** Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new StressNode([
            new InlineNsflNode([
              new LinkNode([
                new PlainTextNode('Ash')
              ], 'https://example.com'),
              new PlainTextNode(' is')
            ]),
            new PlainTextNode(' a friend!')
          ]),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Revision deletion and revision insertion', () => {
      expect(Up.toAst('~~++Oh~~ why would you do this?++')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionInsertionNode([
            new RevisionDeletionNode([
              new PlainTextNode('Oh')
            ]),
            new PlainTextNode(' why would you do this?')
          ])
        ]))
    })

    specify("A link whose content is wrapped in square brackets and emphasis", () => {
      expect(Up.toAst("*[Yes*, I watched it live](example.com/replay).")).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new EmphasisNode([
              new PlainTextNode('Yes'),
            ]),
            new PlainTextNode(", I watched it live")
          ], 'https://example.com/replay'),
          new PlainTextNode('.')
        ]))
    })

    specify("Emphasis and a link whose content is wrapped in square brackets and emphasis", () => {
      expect(Up.toAst("[*Yes, I watched it live](example.com/replay) yesterday*.")).to.be.eql(
        insideDocumentAndParagraph([
          new EmphasisNode([
            new LinkNode([
              new PlainTextNode('Yes, I watched it live'),
            ], 'https://example.com/replay'),
            new PlainTextNode(' yesterday')
          ]),
          new PlainTextNode('.')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toAst('~~(Oh~~ why would you do this?)')).to.be.eql(
        insideDocumentAndParagraph([
          new ParenthesizedNode([
            new RevisionDeletionNode([
              new PlainTextNode('(Oh')
            ]),
            new PlainTextNode(' why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('~~[Oh~~ why would you do this?]')).to.be.eql(
        insideDocumentAndParagraph([
          new SquareBracketedNode([
            new RevisionDeletionNode([
              new PlainTextNode('[Oh')
            ]),
            new PlainTextNode(' why would you do this?]')
          ])
        ]))
    })
  })
})


context('When most otherwise-nested conventions overlap by only their end delimiters, they nest without being split.', () => {
  context('This includes:', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, revision insertion) being overlapped by a third (e.g. revision deletion)', () => {
      expect(Up.toAst('~~Hello **good ++friend!~~++** Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new PlainTextNode('Hello '),
            new StressNode([
              new PlainTextNode('good '),
              new RevisionInsertionNode([
                new PlainTextNode('friend!')
              ])
            ])
          ]),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Two conventions (e.g. NSFL, bold) being overlapped by a third with a priority in between the first two (e.g. spoiler)', () => {
      expect(Up.toAst('(SPOILER: There was another [NSFL: rotten __body)__] Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('There was another '),
            new InlineNsflNode([
              new PlainTextNode('rotten '),
              new BoldNode([
                new PlainTextNode('body')
              ]),
            ]),
          ]),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, NSFW) being overlapped by a third with lower priority than both (e.g. link)', () => {
      expect(Up.toAst('(There was another [NSFL: rotten body {NSFW: squish)(example.com)}] Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('There was another '),
            new InlineNsflNode([
              new PlainTextNode('rotten body '),
              new InlineNsfwNode([
                new PlainTextNode('squish')
              ]),
            ]),
          ], 'https://example.com'),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping each other', () => {
      expect(Up.toAst('**There ++was (SPOILER: another [NSFL: loud __stomp++**)__]. Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new StressNode([
            new PlainTextNode('There '),
            new RevisionInsertionNode([
              new PlainTextNode('was '),
              new InlineSpoilerNode([
                new PlainTextNode('another '),
                new InlineNsflNode([
                  new PlainTextNode('loud '),
                  new BoldNode([
                    new PlainTextNode('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainTextNode('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single freely-splittable convention', () => {
      expect(Up.toAst('**There ++was (SPOILER: another [NSFL: loud __stomp++**)]__. Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new StressNode([
            new PlainTextNode('There '),
            new RevisionInsertionNode([
              new PlainTextNode('was '),
              new InlineSpoilerNode([
                new PlainTextNode('another '),
                new InlineNsflNode([
                  new PlainTextNode('loud '),
                  new BoldNode([
                    new PlainTextNode('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainTextNode('. Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping a single convention that should only be split when necessary', () => {
      expect(Up.toAst('**There ++was ~~another [NSFL: loud (SPOILER: stomp++**~~]). Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new StressNode([
            new PlainTextNode('There '),
            new RevisionInsertionNode([
              new PlainTextNode('was '),
              new RevisionDeletionNode([
                new PlainTextNode('another '),
                new InlineNsflNode([
                  new PlainTextNode('loud '),
                  new InlineSpoilerNode([
                    new PlainTextNode('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainTextNode('. Hi!')
        ]))
    })

    specify("An inline spoiler and a link", () => {
      expect(Up.toAst('[SPOILER: Mario fell off the platform. (splat])(example.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('Mario fell off the platform. '),
            new LinkNode([
              new PlainTextNode('splat')
            ], 'https://example.com')
          ])
        ]))
    })

    specify("A link and an inline spoiler", () => {
      expect(Up.toAst("(loudly sings [SPOILER: Jigglypuff's Lullaby)(example.com)]")).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('loudly sings '),
            new InlineSpoilerNode([
              new PlainTextNode("Jigglypuff's Lullaby")
            ])
          ], 'https://example.com')
        ]))
    })

    specify("Emphasis and a link", () => {
      expect(Up.toAst("*I watched it [live*](example.com/replay)")).to.be.eql(
        insideDocumentAndParagraph([
          new EmphasisNode([
            new PlainTextNode('I watched it '),
            new LinkNode([
              new PlainTextNode("live")
            ], 'https://example.com/replay')
          ])
        ]))
    })

    specify("A link and highlighted text", () => {
      expect(Up.toAst('[Mario fell off the platform. (highlight: splat][example.com/game-over])')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Mario fell off the platform. '),
            new HighlightNode([
              new PlainTextNode('splat')
            ])
          ], 'https://example.com/game-over')
        ]))
    })

    specify("Highlighted text and a link", () => {
      expect(Up.toAst('(highlight: loud [thwomp)](example.com/thwomp)')).to.be.eql(
        insideDocumentAndParagraph([
          new HighlightNode([
            new PlainTextNode('loud '),
            new LinkNode([
              new PlainTextNode('thwomp')
            ], 'https://example.com/thwomp')
          ])
        ]))
    })
  })


  context('When the convention closing last is linkified, and when the convention overlapping the linkified convention is linkifiable', () => {
    specify("the convention closing last remains linkified despite being nested inside the linkifiable convention", () => {
      expect(Up.toAst('(SPOILER: There was another [NSFL: rotten body)] (example.com/rotten) Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new PlainTextNode('There was another '),
            new InlineNsflNode([
              new LinkNode([
                new PlainTextNode('rotten body'),
              ], 'https://example.com/rotten')
            ]),
          ]),
          new PlainTextNode(' Hi!')
        ]))
    })
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toAst('++Oh (why would you do this?++)')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionInsertionNode([
            new PlainTextNode('Oh '),
            new ParenthesizedNode([
              new PlainTextNode('(why would you do this?')
            ]),
          ]),
          new ParenthesizedNode([
            new PlainTextNode(')')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('~~Oh [why would you do this?~~]')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new PlainTextNode('Oh '),
            new SquareBracketedNode([
              new PlainTextNode('[why would you do this?')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode(']')
          ])
        ]))
    })
  })
})


context('When most conventions completely overlap, they nest perfectly, with the conventions closing last becoming outermost.', () => {
  context('This includes:', () => {
    specify('Revision insertion and stress', () => {
      expect(Up.toAst('++**Why would you do this?++**')).to.be.eql(
        insideDocumentAndParagraph([
          new StressNode([
            new RevisionInsertionNode([
              new PlainTextNode('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('An inline spoiler and emphasis', () => {
      expect(Up.toAst('[SPOILER: *Why would you do this?]*')).to.be.eql(
        insideDocumentAndParagraph([
          new EmphasisNode([
            new InlineSpoilerNode([
              new PlainTextNode('Why would you do this?')
            ])
          ])
        ]))
    })

    specify('Emphasis and an inline spoiler', () => {
      expect(Up.toAst('*[SPOILER: Why would you do this?*]')).to.be.eql(
        insideDocumentAndParagraph([
          new InlineSpoilerNode([
            new EmphasisNode([
              new PlainTextNode('Why would you do this?')
            ])
          ])
        ]))
    })
  })

  specify('Revision insertion and parentheses', () => {
    expect(Up.toAst('++(Why would you do this?++)')).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new RevisionInsertionNode([
            new PlainTextNode('(Why would you do this?')
          ]),
          new PlainTextNode(')')
        ])
      ]))
  })

  specify('Revision deletion and square brackets', () => {
    expect(Up.toAst('~~[Why would you do this?~~]')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new RevisionDeletionNode([
            new PlainTextNode('[Why would you do this?')
          ]),
          new PlainTextNode(']')
        ])
      ]))
  })

  specify('Parentheses and revision insertion', () => {
    expect(Up.toAst('++(Why would you do this?++)')).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new RevisionInsertionNode([
            new PlainTextNode('(Why would you do this?')
          ]),
          new PlainTextNode(')')
        ])
      ]))
  })

  specify('Square brackets and revision deletion', () => {
    expect(Up.toAst('[~~Why would you do this?]~~')).to.be.eql(
      insideDocumentAndParagraph([
        new SquareBracketedNode([
          new PlainTextNode('['),
          new RevisionDeletionNode([
            new PlainTextNode('Why would you do this?]')
          ]),
        ])
      ]))
  })
})


context("When most conventions overlap by only the first convention's end delimiter and the second convention's start delimiter, the conventions are treated as though the first closed before the second", () => {
  context('This includes:', () => {
    specify('Revision insertion and revision deletion', () => {
      expect(Up.toAst('++Oh ~~++why would you do this?~~')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionInsertionNode([
            new PlainTextNode('Oh ')
          ]),
          new RevisionDeletionNode([
            new PlainTextNode('why would you do this?')
          ])
        ]))
    })

    specify('Revision insertion and a link whose content is wrapped in square brackets', () => {
      expect(Up.toAst('++Oh [++why would you do this?](example.com)')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionInsertionNode([
            new PlainTextNode('Oh ')
          ]),
          new LinkNode([
            new PlainTextNode('why would you do this?')
          ], 'https://example.com')
        ]))
    })

    specify('A link whose content is wrapped in square brackets and revision deletion', () => {
      expect(Up.toAst('[Well, well, ~~](example.com) why would you do this?~~')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Well, well, ')
          ], 'https://example.com'),
          new RevisionDeletionNode([
            new PlainTextNode(' why would you do this?')
          ])
        ]))
    })
  })

  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toAst('++Oh (++why would you do this?)')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionInsertionNode([
            new PlainTextNode('Oh '),
            new ParenthesizedNode([
              new PlainTextNode('(')
            ]),
          ]),
          new ParenthesizedNode([
            new PlainTextNode('why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('~~Oh [~~why would you do this?]')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new PlainTextNode('Oh '),
            new SquareBracketedNode([
              new PlainTextNode('[')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode('why would you do this?]')
          ])
        ]))
    })
  })
})
