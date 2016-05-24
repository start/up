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
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


describe('Overlapped emphasized and linked text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('I do *not [care* at -> https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new EmphasisNode([
          new PlainTextNode('not '),
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care'),
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


describe('Overlapped linked and emphasized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('This [trash *can -> https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new EmphasisNode([
            new PlainTextNode('can'),
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new EmphasisNode([
          new PlainTextNode(' not'),
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})


describe('Overlapped stressed and action text', () => {
  it('splits the stress node, not the action node', () => {
    expect(Up.toAst('I **hate {huge** sigh} this.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('hate '),
        ]),
        new ActionNode([
          new StressNode([
            new PlainTextNode('huge')
          ]),
          new PlainTextNode(' sigh')
        ]),
        new PlainTextNode(' this.')
      ]))
  })
})


describe('A spoiler that overlaps a link', () => {
  it("splits the link node, not the spoiler node", () => {
    expect(Up.toAst('(SPOILER: Gary loses to [Ash) Ketchum -> http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new SpoilerNode([
              new PlainTextNode('Ash')
            ])
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new LinkNode([
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ])
    )
  })
})


describe('A link that overlaps a spoiler', () => {
  it("splits the link node, not the spoiler node", () => {
    const text =
      'In Pokémon Red, [Gary Oak {SPOILER: loses to Ash Ketchum -> http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainTextNode(' repeatedly')
        ]),
        new PlainTextNode(' throughout the game.')
      ])
    )
  })
})


describe('A link and a spoiler using the same type of brackets', () => {
  it("can overlap", () => {
    const text =
      'In Pokémon Red, [Gary Oak [SPOILER: loses to Ash Ketchum -> http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly] throughout the game.'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainTextNode(' repeatedly')
        ]),
        new PlainTextNode(' throughout the game.')
      ])
    )
  })
})


describe('A spoiler that overlaps a footnote', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const text = '[SPOILER: Gary loses to Ash ((Ketchum] is his last name))'

    const footnote =
      new FootnoteNode([
        new SpoilerNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new SpoilerNode([
            new PlainTextNode('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})


describe('A footnote that overlaps a spoiler', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const text = 'Eventually, I will think of one ((reasonable [SPOILER: and realistic)) example of a] footnote that overlaps a spoiler.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new SpoilerNode([
          new PlainTextNode('and realistic')
        ]),
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new SpoilerNode([
            new PlainTextNode(' example of a'),
          ]),
          new PlainTextNode(' footnote that overlaps a spoiler.'),
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})
