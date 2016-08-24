import { expect } from 'chai'
import Up from'../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'
import { UpDocument } from'../../../SyntaxNodes/UpDocument'
import { Paragraph } from'../../../SyntaxNodes/Paragraph'
import { Link } from'../../../SyntaxNodes/Link'
import { PlainText } from'../../../SyntaxNodes/PlainText'
import { Emphasis } from'../../../SyntaxNodes/Emphasis'
import { Stress } from'../../../SyntaxNodes/Stress'
import { Italic } from'../../../SyntaxNodes/Italic'
import { Bold } from'../../../SyntaxNodes/Bold'
import { InlineSpoiler } from'../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from'../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from'../../../SyntaxNodes/InlineNsfl'
import { RevisionInsertion } from'../../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from'../../../SyntaxNodes/RevisionDeletion'
import { NormalParenthetical } from'../../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from'../../../SyntaxNodes/SquareParenthetical'
import { Footnote } from'../../../SyntaxNodes/Footnote'
import { FootnoteBlock } from'../../../SyntaxNodes/FootnoteBlock'
import { Highlight } from'../../../SyntaxNodes/Highlight'


// TODO: Organize these tests into contexts for clarity

describe('Emphasized text overlapping a link', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toDocument('I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Emphasis([
          new PlainText('not ')
        ]),
        new Link([
          new Emphasis([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


describe('A link overlapping emphasized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toDocument('This [trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new Emphasis([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Emphasis([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })
})


describe('Italicized text overlapping a link', () => {
  it('splits the italic node, not the link node', () => {
    expect(Up.toDocument('I do _not [care_ at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Italic([
          new PlainText('not ')
        ]),
        new Link([
          new Italic([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


describe('A link overlapping italicized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.toDocument('This [trash _can][https://en.wikipedia.org/wiki/Waste_container] not_ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new Italic([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Italic([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })
})


context('When a link overlaps stressed text, the stressed text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash **can](https://en.wikipedia.org/wiki/Waste_container) not** stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new Stress([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Stress([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The italicized text opens first', () => {
    expect(Up.toDocument('I do **not (care** at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Stress([
          new PlainText('not ')
        ]),
        new Link([
          new Stress([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps italicized text, the italicized text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash _can](https://en.wikipedia.org/wiki/Waste_container) not_ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new Italic([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Italic([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The italicized text opens first', () => {
    expect(Up.toDocument('I do _not (care_ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Italic([
          new PlainText('not ')
        ]),
        new Link([
          new Italic([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps bold text, the bold text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash __can](https://en.wikipedia.org/wiki/Waste_container) not__ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new Bold([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Bold([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The bold text opens first', () => {
    expect(Up.toDocument('I do __not (care__ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Bold([
          new PlainText('not ')
        ]),
        new Link([
          new Bold([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps highlighted text, the highlighted text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash (highlight: can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new Highlight([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Highlight([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The highlight opens first', () => {
    expect(Up.toDocument('I do [highlight: not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Highlight([
          new PlainText('not ')
        ]),
        new Link([
          new Highlight([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps revision deletion, the revision deletion will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash ~~can](https://en.wikipedia.org/wiki/Waste_container) not~~ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new RevisionDeletion([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new RevisionDeletion([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The revision deletion opens first', () => {
    expect(Up.toDocument('I do ~~not (care~~ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new RevisionDeletion([
          new PlainText('not ')
        ]),
        new Link([
          new RevisionDeletion([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps revision insertion, the revision insertion will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash ++can](https://en.wikipedia.org/wiki/Waste_container) not++ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new RevisionInsertion([
            new PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new RevisionInsertion([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The revision deletion opens first', () => {
    expect(Up.toDocument('I do ++not (care++ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new RevisionInsertion([
          new PlainText('not ')
        ]),
        new Link([
          new RevisionInsertion([
            new PlainText('care')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps parenthesized text, the parenthesized text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This [trash (can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new NormalParenthetical([
            new PlainText('(can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new NormalParenthetical([
          new PlainText(' not)')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The parenthesized text opens first', () => {
    expect(Up.toDocument('I do (not [care) at](https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new NormalParenthetical([
          new PlainText('(not ')
        ]),
        new Link([
          new NormalParenthetical([
            new PlainText('care)')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


context('When a link overlaps square bracketed text, the square bracketed text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.toDocument('This (trash [can)(https://en.wikipedia.org/wiki/Waste_container) not] stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new Link([
          new PlainText('trash '),
          new SquareParenthetical([
            new PlainText('[can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new SquareParenthetical([
          new PlainText(' not]')
        ]),
        new PlainText(' stay here.')
      ]))
  })

  it('The square bracketed text opens first', () => {
    expect(Up.toDocument('I do [not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new SquareParenthetical([
          new PlainText('[not ')
        ]),
        new Link([
          new SquareParenthetical([
            new PlainText('care]')
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})


describe('An inline spoiler that overlaps a link', () => {
  it("splits the link node, not the spoiler node", () => {
    expect(Up.toDocument('(SPOILER: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('Gary loses to '),
          new Link([
            new PlainText('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Link([
          new PlainText(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline spoiler', () => {
  it("splits the link node, not the spoiler node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (SPOILER: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In Pokémon Red, '),
        new Link([
          new PlainText('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new InlineSpoiler([
          new Link([
            new PlainText('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainText(' repeatedly')
        ]),
        new PlainText(' throughout the game.')
      ]))
  })
})


describe('An inline spoiler that overlaps a footnote', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = '[SPOILER: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Footnote([
        new InlineSpoiler([
          new PlainText('Ketchum')
        ]),
        new PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineSpoiler([
            new PlainText('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline spoiler', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [SPOILER: and realistic) example of a] footnote that overlaps an inline spoiler.'

    const footnote =
      new Footnote([
        new PlainText('reasonable '),
        new InlineSpoiler([
          new PlainText('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Eventually, I will think of one'),
          footnote,
          new InlineSpoiler([
            new PlainText(' example of a')
          ]),
          new PlainText(' footnote that overlaps an inline spoiler.'),
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})



describe('An inline NSFW convention that overlaps a link', () => {
  it("splits the link node, not the NSFW node", () => {
    expect(Up.toDocument('(NSFW: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfw([
          new PlainText('Gary loses to '),
          new Link([
            new PlainText('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Link([
          new PlainText(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline NSFW convention', () => {
  it("splits the link node, not the NSFW node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFW: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In Pokémon Red, '),
        new Link([
          new PlainText('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new InlineNsfw([
          new Link([
            new PlainText('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainText(' repeatedly')
        ]),
        new PlainText(' throughout the game.')
      ]))
  })
})


describe('An inline NSFW convention that overlaps a footnote', () => {
  it("splits the NSFW node, not the footnote node", () => {
    const markup = '[NSFW: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Footnote([
        new InlineNsfw([
          new PlainText('Ketchum')
        ]),
        new PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineNsfw([
            new PlainText('Gary loses to Ash')
          ]),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline NSFW convention', () => {
  it("splits the NSFW node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFW: and realistic) example of a] footnote that overlaps an inline NSFW convention.'

    const footnote =
      new Footnote([
        new PlainText('reasonable '),
        new InlineNsfw([
          new PlainText('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Eventually, I will think of one'),
          footnote,
          new InlineNsfw([
            new PlainText(' example of a'),
          ]),
          new PlainText(' footnote that overlaps an inline NSFW convention.')
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('An inline NSFL convention that overlaps a link', () => {
  it("splits the link node, not the NSFL node", () => {
    expect(Up.toDocument('(NSFL: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfl([
          new PlainText('Gary loses to '),
          new Link([
            new PlainText('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Link([
          new PlainText(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline NSFL convention', () => {
  it("splits the link node, not the NSFL node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFL: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In Pokémon Red, '),
        new Link([
          new PlainText('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new InlineNsfl([
          new Link([
            new PlainText('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainText(' repeatedly')
        ]),
        new PlainText(' throughout the game.')
      ]))
  })
})


describe('An inline NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Footnote([
        new InlineNsfl([
          new PlainText('Ketchum')
        ]),
        new PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new InlineNsfl([
            new PlainText('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline NSFL convention', () => {
  it("splits the NSFL node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new Footnote([
        new PlainText('reasonable '),
        new InlineNsfl([
          new PlainText('and realistic')
        ])
      ], { referenceNumber: 1 })

    expect(Up.toDocument(markup)).to.deep.equal(
      new UpDocument([
        new Paragraph([
          new PlainText('Eventually, I will think of one'),
          footnote,
          new InlineNsfl([
            new PlainText(' example of a')
          ]),
          new PlainText(' footnote that overlaps an inline NSFL convention.')
        ]),
        new FootnoteBlock([footnote])
      ]))
  })
})
