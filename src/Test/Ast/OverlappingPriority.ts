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
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'


describe('Overlapped emphasized (using asterisks) and linked text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new EmphasisNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


describe('Overlapped linked and emphasized text (using asterisks)', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('This [trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new EmphasisNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new EmphasisNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})


describe('Overlapped emphasized (using underscores) and linked text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('I do _not [care_ at][https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new EmphasisNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


describe('Overlapped linked and emphasized text (using underscores)', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('This [trash _can][https://en.wikipedia.org/wiki/Waste_container] not_ stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new EmphasisNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new EmphasisNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})


describe('Overlapped stressed (using asterisks) and action text', () => {
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


describe('Overlapped stressed (using asterisks) and action text', () => {
  it('splits the stress node, not the action node', () => {
    expect(Up.toAst('I {sigh **loudly} sing**.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new ActionNode([
          new PlainTextNode('sigh '),
          new StressNode([
            new PlainTextNode('loudly')
          ]),
        ]),
        new StressNode([
          new PlainTextNode(' sing')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Overlapped stressed (using underscores) and action text', () => {
  it('splits the stress node, not the action node', () => {
    expect(Up.toAst('I __hate {huge__ sigh} this.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('hate ')
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


describe('Overlapped stressed (using underscores) and action text', () => {
  it('splits the stress node, not the action node', () => {
    expect(Up.toAst('I {sigh __loudly} sing__.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new ActionNode([
          new PlainTextNode('sigh '),
          new StressNode([
            new PlainTextNode('loudly')
          ]),
        ]),
        new StressNode([
          new PlainTextNode(' sing')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Action text that overlaps a link', () => {
  it("splits the link node, not the action node", () => {
    expect(Up.toAst('{sighs [Painfully} Midwestern Records][https://en.wikipedia.org/wiki/Painfully_Midwestern_Records]')).to.be.eql(
      insideDocumentAndParagraph([
        new ActionNode([
          new PlainTextNode('sighs '),
          new LinkNode([
            new PlainTextNode('Painfully')
          ], 'https://en.wikipedia.org/wiki/Painfully_Midwestern_Records')
        ]),
        new LinkNode([
          new PlainTextNode(' Midwestern Records')
        ], 'https://en.wikipedia.org/wiki/Painfully_Midwestern_Records')
      ])
    )
  })
})


describe('A link that overlaps action text', () => {
  it("splits the link node, not the action node", () => {
    expect(Up.toAst('[Painfully Midwestern {Records][https://en.wikipedia.org/wiki/Painfully_Midwestern_Records] furiously}')).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode('Painfully Midwestern ')
        ], 'https://en.wikipedia.org/wiki/Painfully_Midwestern_Records'),
        new ActionNode([
          new LinkNode([
            new PlainTextNode('Records')
          ], 'https://en.wikipedia.org/wiki/Painfully_Midwestern_Records'),
          new PlainTextNode(' furiously')
        ])
      ])
    )
  })
})


describe('A spoiler that overlaps a link', () => {
  it("splits the link node, not the spoiler node", () => {
    expect(Up.toAst('(SPOILER: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new PlainTextNode('Ash')
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
      'In Pokémon Red, [Gary Oak {SPOILER: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

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


describe('A spoiler that overlaps action text', () => {
  it("splits the action text node, not the spoiler node", () => {
    expect(Up.toAst('In Pokémon Red, [SPOILER: Gary Oak {loses] badly}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new SpoilerNode([
          new PlainTextNode('Gary Oak '),
          new ActionNode([
            new PlainTextNode('loses')
          ])
        ]),
        new ActionNode([
          new PlainTextNode(' badly')
        ])
      ])
    )
  })
})


describe('Action text that overlaps a spoiler', () => {
  it("splits the action node, not the spoiler node", () => {
    const text =
      'In Pokémon Red, Gary Oak {loses [SPOILER: badly} to Ash Ketchum]'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses ')
        ]),
        new SpoilerNode([
          new ActionNode([
            new PlainTextNode('badly')
          ]),
          new PlainTextNode(' to Ash Ketchum')
        ])
      ])
    )
  })
})


describe('A spoiler that overlaps an action by only their end tokens', () => {
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


describe('An action convention that overlaps a spoiler (which is prioritized to avoid being split over action conventions) by only their end tokens', () => {
  it("is perfectly nested", () => {
    const text =
      'In Pokémon Red, Gary Oak {loses [SPOILER: badly}] to Ash Ketchum'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses '),
          new SpoilerNode([
            new PlainTextNode('badly')
          ]),
        ]),
        new PlainTextNode(' to Ash Ketchum')
      ])
    )
  })
})


describe('A link that overlaps an action convention (which is prioritized to avoid being split over links) by only their end tokens', () => {
  it("is perfectly nested", () => {
    const text =
      '[Mario fell off the platform. {splat](example.com/game-over)}'

    expect(Up.toAst(text)).to.be.eql(
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


describe('A spoiler that overlaps a footnote', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const text = '[SPOILER: Gary loses to Ash (^Ketchum] is his last name)'

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
    const text = 'Eventually, I will think of one (^reasonable [SPOILER: and realistic) example of a] footnote that overlaps a spoiler.'

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
            new PlainTextNode(' example of a')
          ]),
          new PlainTextNode(' footnote that overlaps a spoiler.'),
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})



describe('A NSFW convention that overlaps a link', () => {
  it("splits the link node, not the NSFW convention node", () => {
    expect(Up.toAst('(NSFW: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new NsfwNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new PlainTextNode('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new LinkNode([
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ])
    )
  })
})


describe('A link that overlaps a NSFW convention', () => {
  it("splits the link node, not the NSFW convention node", () => {
    const text =
      'In Pokémon Red, [Gary Oak {NSFW: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new NsfwNode([
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


describe('A NSFW convention that overlaps action text', () => {
  it("splits the action text node, not the NSFW convention node", () => {
    expect(Up.toAst('In Pokémon Red, [NSFW: Gary Oak {loses] badly}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new NsfwNode([
          new PlainTextNode('Gary Oak '),
          new ActionNode([
            new PlainTextNode('loses')
          ])
        ]),
        new ActionNode([
          new PlainTextNode(' badly')
        ])
      ])
    )
  })
})


describe('Action text that overlaps a NSFW convention', () => {
  it("splits the action node, not the NSFW convention node", () => {
    const text =
      'In Pokémon Red, Gary Oak {loses [NSFW: badly} to Ash Ketchum]'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses ')
        ]),
        new NsfwNode([
          new ActionNode([
            new PlainTextNode('badly')
          ]),
          new PlainTextNode(' to Ash Ketchum')
        ])
      ])
    )
  })
})


describe('A NSFW convention that overlaps a footnote', () => {
  it("splits the NSFW convention node, not the footnote node", () => {
    const text = '[NSFW: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new FootnoteNode([
        new NsfwNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new NsfwNode([
            new PlainTextNode('Gary loses to Ash')
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})


describe('A footnote that overlaps a NSFW convention', () => {
  it("splits the NSFW convention node, not the footnote node", () => {
    const text = 'Eventually, I will think of one (^reasonable [NSFW: and realistic) example of a] footnote that overlaps a NSFW convention.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new NsfwNode([
          new PlainTextNode('and realistic')
        ]),
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new NsfwNode([
            new PlainTextNode(' example of a'),
          ]),
          new PlainTextNode(' footnote that overlaps a NSFW convention.')
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})


describe('A NSFL convention that overlaps a link', () => {
  it("splits the link node, not the NSFL convention node", () => {
    expect(Up.toAst('(NSFL: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new NsflNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new PlainTextNode('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new LinkNode([
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ])
    )
  })
})


describe('A link that overlaps a NSFL convention', () => {
  it("splits the link node, not the NSFL convention node", () => {
    const text =
      'In Pokémon Red, [Gary Oak {NSFL: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new NsflNode([
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


describe('A NSFL convention that overlaps action text', () => {
  it("splits the action text node, not the NSFL convention node", () => {
    expect(Up.toAst('In Pokémon Red, [NSFL: Gary Oak {loses] badly}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new NsflNode([
          new PlainTextNode('Gary Oak '),
          new ActionNode([
            new PlainTextNode('loses')
          ])
        ]),
        new ActionNode([
          new PlainTextNode(' badly')
        ])
      ])
    )
  })
})


describe('Action text that overlaps a NSFL convention', () => {
  it("splits the action node, not the NSFL convention node", () => {
    const text =
      'In Pokémon Red, Gary Oak {loses [NSFL: badly} to Ash Ketchum]'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses ')
        ]),
        new NsflNode([
          new ActionNode([
            new PlainTextNode('badly')
          ]),
          new PlainTextNode(' to Ash Ketchum')
        ])
      ])
    )
  })
})


describe('A NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL convention node, not the footnote node", () => {
    const text = '[NSFL: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new FootnoteNode([
        new NsflNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new NsflNode([
            new PlainTextNode('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})


describe('A footnote that overlaps a NSFL convention', () => {
  it("splits the NSFL convention node, not the footnote node", () => {
    const text = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] footnote that overlaps a NSFL convention.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new NsflNode([
          new PlainTextNode('and realistic')
        ])
      ], 1)

    expect(Up.toAst(text)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new NsflNode([
            new PlainTextNode(' example of a')
          ]),
          new PlainTextNode(' footnote that overlaps a NSFL convention.')
        ]),
        new FootnoteBlockNode([footnote])
      ])
    )
  })
})


describe('Overlapped emphasized (using asterisks) and linked text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new EmphasisNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})