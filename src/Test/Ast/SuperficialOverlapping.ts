import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../SyntaxNodes/NsflNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'


context('When most conventions overlap by only their start tokens, they nest without being split.', () => {
  context('This includes: ', () => {
    specify('Two "freely-splittable" conventions (e.g. stress, revision insertion) overlap a third (e.g. revision deletion) ', () => {
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

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, action) overlapping a third (e.g. spoiler)', () => {
      expect(Up.toAst('[NSFL: {(SPOILER: thwomp} good] friend!) Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new NsflNode([
              new ActionNode([
                new PlainTextNode('thwomp')
              ]),
              new PlainTextNode(' good')
            ]),
            new PlainTextNode(' friend!')
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

    specify("A link and emphasis", () => {
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
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toAst('~~(Oh~~ why would you do this?)')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new ParenthesizedNode([
              new PlainTextNode('(Oh')
            ]),
          ]),
          new ParenthesizedNode([
            new PlainTextNode(' why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('~~[Oh~~ why would you do this?]')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new SquareBracketedNode([
              new PlainTextNode('[Oh')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode(' why would you do this?]')
          ])
        ]))
    })
  })
})


context('When most conventions overlap by only their end tokens, they nest without being split.', () => {
  context('This includes: ', () => {
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

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, action) being overlapped by a third with a priority in between the first two (e.g. spoiler) ', () => {
      expect(Up.toAst('(SPOILER: There was another [NSFL: rotten body {squish)}] Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('There was another '),
            new NsflNode([
              new PlainTextNode('rotten body '),
              new ActionNode([
                new PlainTextNode('squish')
              ]),
            ]),
          ]),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Two "only-split-when-necessary" conventions (e.g. NSFL, action) being overlapped by a third with lower priority than both (e.g. link) ', () => {
      expect(Up.toAst('(There was another [NSFL: rotten body {squish)(example.com)}] Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('There was another '),
            new NsflNode([
              new PlainTextNode('rotten body '),
              new ActionNode([
                new PlainTextNode('squish')
              ]),
            ]),
          ], 'https://example.com'),
          new PlainTextNode(' Hi!')
        ]))
    })

    specify('Several conventions (some freely splittable, and some that should only be split when necessary) overlapping each other', () => {
      expect(Up.toAst('**There ++was (SPOILER: another [NSFL: loud {stomp++**)}]. Hi!')).to.be.eql(
        insideDocumentAndParagraph([
          new StressNode([
            new PlainTextNode('There '),
            new RevisionInsertionNode([
              new PlainTextNode('was '),
              new SpoilerNode([
                new PlainTextNode('another '),
                new NsflNode([
                  new PlainTextNode('loud '),
                  new ActionNode([
                    new PlainTextNode('stomp')
                  ])
                ])
              ])
            ])
          ]),
          new PlainTextNode('. Hi!')
        ]))
    })

    specify("A spoiler and an action convention", () => {
      expect(Up.toAst('[SPOILER: Mario fell off the platform. {splat]}')).to.be.eql(
        insideDocumentAndParagraph([
          new SpoilerNode([
            new PlainTextNode('Mario fell off the platform. '),
            new ActionNode([
              new PlainTextNode('splat')
            ])
          ])
        ])
      )
    })

    specify("An action convention and a spoiler", () => {
      expect(Up.toAst("{loudly sings [SPOILER: Jigglypuff's Lullaby}]")).to.be.eql(
        insideDocumentAndParagraph([
          new ActionNode([
            new PlainTextNode('loudly sings '),
            new SpoilerNode([
              new PlainTextNode("Jigglypuff's Lullaby")
            ])
          ])
        ])
      )
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
        ])
      )
    })

    specify("A link and an action convention", () => {
      expect(Up.toAst('[Mario fell off the platform. {splat](example.com/game-over)}')).to.be.eql(
        insideDocumentAndParagraph([
          new LinkNode([
            new PlainTextNode('Mario fell off the platform. '),
            new ActionNode([
              new PlainTextNode('splat')
            ])
          ], 'https://example.com/game-over')
        ])
      )
    })

    specify("An action convention and a link", () => {
      expect(Up.toAst('{loud [thwomp}](example.com/thwomp)')).to.be.eql(
        insideDocumentAndParagraph([
          new ActionNode([
            new PlainTextNode('loud '),
            new LinkNode([
              new PlainTextNode('thwomp')
            ], 'https://example.com/thwomp')
          ])
        ])
      )
    })

    specify('Revision insertino and revision deletion', () => {
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
  })


  context('But not conventions whose delimiters represent actual content:', () => {
    specify('Parentheses', () => {
      expect(Up.toAst('++Oh (++why would you do this?)')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionInsertionNode([
            new ParenthesizedNode([
              new PlainTextNode('Oh (')
            ]),
          ]),
          new ParenthesizedNode([
            new PlainTextNode('why would you do this?)')
          ])
        ]))
    })

    specify('Square brackets', () => {
      expect(Up.toAst('~~Oh [~~ why would you do this?]')).to.be.eql(
        insideDocumentAndParagraph([
          new RevisionDeletionNode([
            new SquareBracketedNode([
              new PlainTextNode('Oh [')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode('why would you do this?]')
          ])
        ]))
    })
  })
})


describe('Conventions that completely overlap', () => {
  it('are nested in the order they endedg', () => {
    expect(Up.toAst('++**Why would you do this?++**')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new RevisionInsertionNode([
            new PlainTextNode('Why would you do this?')
          ])
        ])
      ])
    )
  })
})