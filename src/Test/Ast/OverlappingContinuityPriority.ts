import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { HighlightNode } from '../../SyntaxNodes/HighlightNode'


describe('Overlapping emphasis (using asterisks) and a link', () => {
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


describe('A link overlapping emphasized text (using asterisks)', () => {
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


describe('Overlapping emphasis (using underscores) and a link', () => {
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


describe('A link overlapping emphasized text (using underscores)', () => {
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


context('When a link overlaps highlighted text, the highlighted text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash {highlight: can](https://en.wikipedia.org/wiki/Waste_container) not} stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new HighlightNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new HighlightNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The highlight opens first', () => {
    expect(Up.toAst('I do [highlight: not {care] at}(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new HighlightNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new HighlightNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
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
      ]))
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
      ]))
  })
})


describe('An inline spoiler that overlaps a link', () => {
  it("splits the link node, not the spoiler node", () => {
    expect(Up.toAst('(SPOILER: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new PlainTextNode('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new LinkNode([
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline spoiler', () => {
  it("splits the link node, not the spoiler node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak {SPOILER: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

    expect(Up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainTextNode(' repeatedly')
        ]),
        new PlainTextNode(' throughout the game.')
      ]))
  })
})


describe('An inline spoiler that overlaps action text', () => {
  it("splits the action text node, not the spoiler node", () => {
    expect(Up.toAst('In Pokémon Red, [SPOILER: Gary Oak {loses] badly}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new InlineSpoilerNode([
          new PlainTextNode('Gary Oak '),
          new ActionNode([
            new PlainTextNode('loses')
          ])
        ]),
        new ActionNode([
          new PlainTextNode(' badly')
        ])
      ]))
  })
})


describe('Action text that overlaps an inline spoiler', () => {
  it("splits the action node, not the spoiler node", () => {
    const markup =
      'In Pokémon Red, Gary Oak {loses [SPOILER: badly} to Ash Ketchum]'

    expect(Up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses ')
        ]),
        new InlineSpoilerNode([
          new ActionNode([
            new PlainTextNode('badly')
          ]),
          new PlainTextNode(' to Ash Ketchum')
        ])
      ]))
  })
})


describe('An inline spoiler that overlaps a footnote', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = '[SPOILER: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new FootnoteNode([
        new InlineSpoilerNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineSpoilerNode([
            new PlainTextNode('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline spoiler', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [SPOILER: and realistic) example of a] footnote that overlaps an inline spoiler.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new InlineSpoilerNode([
          new PlainTextNode('and realistic')
        ]),
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new InlineSpoilerNode([
            new PlainTextNode(' example of a')
          ]),
          new PlainTextNode(' footnote that overlaps an inline spoiler.'),
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})



describe('An inline NSFW convention that overlaps a link', () => {
  it("splits the link node, not the NSFW convention node", () => {
    expect(Up.toAst('(NSFW: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsfwNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new PlainTextNode('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new LinkNode([
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline NSFW convention', () => {
  it("splits the link node, not the NSFW convention node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak {NSFW: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

    expect(Up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new InlineNsfwNode([
          new LinkNode([
            new PlainTextNode('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainTextNode(' repeatedly')
        ]),
        new PlainTextNode(' throughout the game.')
      ]))
  })
})


describe('An inline NSFW convention that overlaps action text', () => {
  it("splits the action text node, not the NSFW convention node", () => {
    expect(Up.toAst('In Pokémon Red, [NSFW: Gary Oak {loses] badly}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new InlineNsfwNode([
          new PlainTextNode('Gary Oak '),
          new ActionNode([
            new PlainTextNode('loses')
          ])
        ]),
        new ActionNode([
          new PlainTextNode(' badly')
        ])
      ]))
  })
})


describe('Action text that overlaps an inline NSFW convention', () => {
  it("splits the action node, not the NSFW convention node", () => {
    const markup =
      'In Pokémon Red, Gary Oak {loses [NSFW: badly} to Ash Ketchum]'

    expect(Up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses ')
        ]),
        new InlineNsfwNode([
          new ActionNode([
            new PlainTextNode('badly')
          ]),
          new PlainTextNode(' to Ash Ketchum')
        ])
      ]))
  })
})


describe('An inline NSFW convention that overlaps a footnote', () => {
  it("splits the NSFW convention node, not the footnote node", () => {
    const markup = '[NSFW: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new FootnoteNode([
        new InlineNsfwNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineNsfwNode([
            new PlainTextNode('Gary loses to Ash')
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline NSFW convention', () => {
  it("splits the NSFW convention node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFW: and realistic) example of a] footnote that overlaps an inline NSFW convention.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new InlineNsfwNode([
          new PlainTextNode('and realistic')
        ]),
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new InlineNsfwNode([
            new PlainTextNode(' example of a'),
          ]),
          new PlainTextNode(' footnote that overlaps an inline NSFW convention.')
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('An inline NSFL convention that overlaps a link', () => {
  it("splits the link node, not the NSFL convention node", () => {
    expect(Up.toAst('(NSFL: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
          new PlainTextNode('Gary loses to '),
          new LinkNode([
            new PlainTextNode('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new LinkNode([
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline NSFL convention', () => {
  it("splits the link node, not the NSFL convention node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak {NSFL: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly} throughout the game.'

    expect(Up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new InlineNsflNode([
          new LinkNode([
            new PlainTextNode('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainTextNode(' repeatedly')
        ]),
        new PlainTextNode(' throughout the game.')
      ]))
  })
})


describe('An inline NSFL convention that overlaps action text', () => {
  it("splits the action text node, not the NSFL convention node", () => {
    expect(Up.toAst('In Pokémon Red, [NSFL: Gary Oak {loses] badly}')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new InlineNsflNode([
          new PlainTextNode('Gary Oak '),
          new ActionNode([
            new PlainTextNode('loses')
          ])
        ]),
        new ActionNode([
          new PlainTextNode(' badly')
        ])
      ]))
  })
})


describe('Action text that overlaps an inline NSFL convention', () => {
  it("splits the action node, not the NSFL convention node", () => {
    const markup =
      'In Pokémon Red, Gary Oak {loses [NSFL: badly} to Ash Ketchum]'

    expect(Up.toAst(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, Gary Oak '),
        new ActionNode([
          new PlainTextNode('loses ')
        ]),
        new InlineNsflNode([
          new ActionNode([
            new PlainTextNode('badly')
          ]),
          new PlainTextNode(' to Ash Ketchum')
        ])
      ]))
  })
})


describe('An inline NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL convention node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new FootnoteNode([
        new InlineNsflNode([
          new PlainTextNode('Ketchum')
        ]),
        new PlainTextNode(' is his last name')
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new InlineNsflNode([
            new PlainTextNode('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline NSFL convention', () => {
  it("splits the NSFL convention node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new FootnoteNode([
        new PlainTextNode('reasonable '),
        new InlineNsflNode([
          new PlainTextNode('and realistic')
        ])
      ], 1)

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new ParagraphNode([
          new PlainTextNode('Eventually, I will think of one'),
          footnote,
          new InlineNsflNode([
            new PlainTextNode(' example of a')
          ]),
          new PlainTextNode(' footnote that overlaps an inline NSFL convention.')
        ]),
        new FootnoteBlockNode([footnote])
      ]))
  })
})
