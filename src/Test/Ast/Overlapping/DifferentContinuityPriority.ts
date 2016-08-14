import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { DocumentNode } from'../../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from'../../../SyntaxNodes/ParagraphNode'
import { LinkNode } from'../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from'../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from'../../../SyntaxNodes/EmphasisNode'
import { StressNode } from'../../../SyntaxNodes/StressNode'
import { ItalicNode } from'../../../SyntaxNodes/ItalicNode'
import { BoldNode } from'../../../SyntaxNodes/BoldNode'
import { InlineSpoilerNode } from'../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from'../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from'../../../SyntaxNodes/InlineNsflNode'
import { RevisionInsertionNode } from'../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from'../../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from'../../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from'../../../SyntaxNodes/SquareBracketedNode'
import { FootnoteNode } from'../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from'../../../SyntaxNodes/FootnoteBlockNode'
import { HighlightNode } from'../../../SyntaxNodes/HighlightNode'


// TODO: Organize these tests into contexts for clarity

describe('Emphasized text overlapping a link', () => {
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


describe('A link overlapping emphasized text', () => {
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


describe('Italicized text overlapping a link', () => {
  it('splits the italic node, not the link node', () => {
    expect(Up.toAst('I do _not [care_ at][https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new ItalicNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new ItalicNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


describe('A link overlapping italicized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toAst('This [trash _can][https://en.wikipedia.org/wiki/Waste_container] not_ stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new ItalicNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new ItalicNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})


context('When a link overlaps stressed text, the stressed text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash **can](https://en.wikipedia.org/wiki/Waste_container) not** stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new StressNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new StressNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The italicized text opens first', () => {
    expect(Up.toAst('I do **not (care** at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new StressNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new StressNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


context('When a link overlaps italicized text, the italicized text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash _can](https://en.wikipedia.org/wiki/Waste_container) not_ stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new ItalicNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new ItalicNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The italicized text opens first', () => {
    expect(Up.toAst('I do _not (care_ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new ItalicNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new ItalicNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


context('When a link overlaps bold text, the bold text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash __can](https://en.wikipedia.org/wiki/Waste_container) not__ stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new BoldNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new BoldNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The bold text opens first', () => {
    expect(Up.toAst('I do __not (care__ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new BoldNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new BoldNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


context('When a link overlaps highlighted text, the highlighted text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash (highlight: can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.be.eql(
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
    expect(Up.toAst('I do [highlight: not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
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


context('When a link overlaps revision deletion, the revision deletion will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash ~~can](https://en.wikipedia.org/wiki/Waste_container) not~~ stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new RevisionDeletionNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new RevisionDeletionNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The revision deletion opens first', () => {
    expect(Up.toAst('I do ~~not (care~~ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new RevisionDeletionNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new RevisionDeletionNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


context('When a link overlaps revision insertion, the revision insertion will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash ++can](https://en.wikipedia.org/wiki/Waste_container) not++ stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new RevisionInsertionNode([
            new PlainTextNode('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new RevisionInsertionNode([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The revision deletion opens first', () => {
    expect(Up.toAst('I do ++not (care++ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new RevisionInsertionNode([
          new PlainTextNode('not ')
        ]),
        new LinkNode([
          new RevisionInsertionNode([
            new PlainTextNode('care')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


context('When a link overlaps parenthesized text, the parenthesized text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This [trash (can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new ParenthesizedNode([
            new PlainTextNode('(can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new ParenthesizedNode([
          new PlainTextNode(' not)')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The parenthesized text opens first', () => {
    expect(Up.toAst('I do (not [care) at](https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new ParenthesizedNode([
          new PlainTextNode('(not ')
        ]),
        new LinkNode([
          new ParenthesizedNode([
            new PlainTextNode('care)')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


context('When a link overlaps square bracketed text, the square bracketed text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toAst('This (trash [can)(https://en.wikipedia.org/wiki/Waste_container) not] stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new SquareBracketedNode([
            new PlainTextNode('[can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new SquareBracketedNode([
          new PlainTextNode(' not]')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })

  it('The square bracketed text opens first', () => {
    expect(Up.toAst('I do [not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new SquareBracketedNode([
          new PlainTextNode('[not ')
        ]),
        new LinkNode([
          new SquareBracketedNode([
            new PlainTextNode('care]')
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
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
      'In Pokémon Red, [Gary Oak (SPOILER: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

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
  it("splits the link node, not the NSFW node", () => {
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
  it("splits the link node, not the NSFW node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFW: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

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


describe('An inline NSFW convention that overlaps a footnote', () => {
  it("splits the NSFW node, not the footnote node", () => {
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
  it("splits the NSFW node, not the footnote node", () => {
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
  it("splits the link node, not the NSFL node", () => {
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
  it("splits the link node, not the NSFL node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFL: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

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


describe('An inline NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL node, not the footnote node", () => {
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
  it("splits the NSFL node, not the footnote node", () => {
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
