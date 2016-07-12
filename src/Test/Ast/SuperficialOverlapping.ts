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


describe('A spoiler that overlaps an action by only their end delimiters', () => {
  it("is perfectly nested", () => {
    const text =
      '[SPOILER: Mario fell off the platform. {splat]}'

    expect(Up.toAst(text)).to.be.eql(
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
})


describe('An action convention that overlaps a spoiler (which is prioritized to avoid being split over action conventions) by only their end delimiters', () => {
  it("is perfectly nested", () => {
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
})


describe('Emphasis that overlaps a link (which is prioritized to avoid being split over emphasis) by only their end delimiters', () => {
  it("is perfectly nested", () => {
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
})


describe('A link that overlaps an action convention (which is prioritized to avoid being split over links) by only their end delimiters', () => {
  it("is perfectly nested", () => {
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
})


describe('An action that overlaps a link by only their end delimiters', () => {
  it("is perfectly nested", () => {
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
})


context("Overlapping conventions where only the first convention's end delimiter is inside the second are treated as though the first convention is inside the second (and thus not overlapping).", () => {
  it('This is the case for nearly all conventions', () => {
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
              new PlainTextNode('Oh (')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode('why would you do this?)')
          ])
        ])
      )
    })
  })
})


context("Overlapping conventions where only the first convention's start delimiter is outside the second are treated as though the first convention is inside the second (and thus not overlapping).", () => {
  specify('This is the case for nearly all conventions', () => {
    expect(Up.toAst('~~++Oh~~ why would you do this?++')).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionInsertionNode([
          new RevisionDeletionNode([
            new PlainTextNode('Oh')
          ]),
          new PlainTextNode(' why would you do this?')
        ])
      ])
    )
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
              new PlainTextNode('(Oh')
            ]),
          ]),
          new SquareBracketedNode([
            new PlainTextNode(' why would you do this?)')
          ])
        ]))
    })
  })
})