import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'


// TODO: Organize these tests into contexts for clarity

describe('Emphasized text overlapping a link', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.parse('I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Emphasis([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.Emphasis([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


describe('A link overlapping emphasized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.parse('This [trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.Emphasis([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Emphasis([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })
})


describe('Italicized text overlapping a link', () => {
  it('splits the italic node, not the link node', () => {
    expect(Up.parse('I do _not [care_ at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Italic([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.Italic([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


describe('A link overlapping italicized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.parse('This [trash _can][https://en.wikipedia.org/wiki/Waste_container] not_ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.Italic([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Italic([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })
})


context('When a link overlaps stressed text, the stressed text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash **can](https://en.wikipedia.org/wiki/Waste_container) not** stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.Stress([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Stress([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  specify('The italicized text opens first', () => {
    expect(Up.parse('I do **not (care** at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Stress([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.Stress([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


context('When a link overlaps italicized text, the italicized text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash _can](https://en.wikipedia.org/wiki/Waste_container) not_ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.Italic([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Italic([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  specify('The italicized text opens first', () => {
    expect(Up.parse('I do _not (care_ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Italic([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.Italic([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


context('When a link overlaps bold text, the bold text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash __can](https://en.wikipedia.org/wiki/Waste_container) not__ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.Bold([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Bold([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  specify('The bold text opens first', () => {
    expect(Up.parse('I do __not (care__ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Bold([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.Bold([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


context('When a link overlaps highlighted text, the highlighted text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash (highlight: can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.Highlight([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Highlight([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  specify('The highlight opens first', () => {
    expect(Up.parse('I do [highlight: not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Highlight([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.Highlight([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


context('When a link overlaps parenthesized text, the parenthesized text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash (can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.NormalParenthetical([
            new Up.PlainText('(can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.NormalParenthetical([
          new Up.PlainText(' not)')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  specify('The parenthesized text opens first', () => {
    expect(Up.parse('I do (not [care) at](https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.NormalParenthetical([
          new Up.PlainText('(not ')
        ]),
        new Up.Link([
          new Up.NormalParenthetical([
            new Up.PlainText('care)')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


context('When a link overlaps square bracketed text, the square bracketed text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.parse('This (trash [can)(https://en.wikipedia.org/wiki/Waste_container) not] stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.SquareParenthetical([
            new Up.PlainText('[can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.SquareParenthetical([
          new Up.PlainText(' not]')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  it('The square bracketed text opens first', () => {
    expect(Up.parse('I do [not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.SquareParenthetical([
          new Up.PlainText('[not ')
        ]),
        new Up.Link([
          new Up.SquareParenthetical([
            new Up.PlainText('care]')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


context('When a link overlaps a quote, the quote will always be split. This includes when:', () => {
  specify('the link opens first', () => {
    expect(Up.parse('This [trash "can][https://en.wikipedia.org/wiki/Waste_container] not" stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.Link([
          new Up.PlainText('trash '),
          new Up.InlineQuote([
            new Up.PlainText('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.InlineQuote([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })

  specify('The quote opens first', () => {
    expect(Up.parse('I do "not [care" at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.InlineQuote([
          new Up.PlainText('not ')
        ]),
        new Up.Link([
          new Up.InlineQuote([
            new Up.PlainText('care')
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})


describe('An inline spoiler that overlaps a link', () => {
  it("splits the link node, not the spoiler node", () => {
    expect(Up.parse('(SPOILER: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('Gary loses to '),
          new Up.Link([
            new Up.PlainText('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Up.Link([
          new Up.PlainText(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline spoiler', () => {
  it("splits the link node, not the spoiler node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (SPOILER: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In Pokémon Red, '),
        new Up.Link([
          new Up.PlainText('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.PlainText(' repeatedly')
        ]),
        new Up.PlainText(' throughout the game.')
      ]))
  })
})


describe('An inline spoiler that overlaps a footnote', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = '[SPOILER: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineSpoiler([
          new Up.PlainText('Ketchum')
        ]),
        new Up.PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineSpoiler([
            new Up.PlainText('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline spoiler', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [SPOILER: and realistic) example of a] footnote that overlaps an inline spoiler.'

    const footnote =
      new Up.Footnote([
        new Up.PlainText('reasonable '),
        new Up.InlineSpoiler([
          new Up.PlainText('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Eventually, I will think of one'),
          footnote,
          new Up.InlineSpoiler([
            new Up.PlainText(' example of a')
          ]),
          new Up.PlainText(' footnote that overlaps an inline spoiler.'),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})



describe('An inline NSFW convention that overlaps a link', () => {
  it("splits the link node, not the NSFW node", () => {
    expect(Up.parse('(NSFW: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfw([
          new Up.PlainText('Gary loses to '),
          new Up.Link([
            new Up.PlainText('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Up.Link([
          new Up.PlainText(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline NSFW convention', () => {
  it("splits the link node, not the NSFW node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFW: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In Pokémon Red, '),
        new Up.Link([
          new Up.PlainText('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineNsfw([
          new Up.Link([
            new Up.PlainText('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.PlainText(' repeatedly')
        ]),
        new Up.PlainText(' throughout the game.')
      ]))
  })
})


describe('An inline NSFW convention that overlaps a footnote', () => {
  it("splits the NSFW node, not the footnote node", () => {
    const markup = '[NSFW: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineNsfw([
          new Up.PlainText('Ketchum')
        ]),
        new Up.PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfw([
            new Up.PlainText('Gary loses to Ash')
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline NSFW convention', () => {
  it("splits the NSFW node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFW: and realistic) example of a] footnote that overlaps an inline NSFW convention.'

    const footnote =
      new Up.Footnote([
        new Up.PlainText('reasonable '),
        new Up.InlineNsfw([
          new Up.PlainText('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Eventually, I will think of one'),
          footnote,
          new Up.InlineNsfw([
            new Up.PlainText(' example of a'),
          ]),
          new Up.PlainText(' footnote that overlaps an inline NSFW convention.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('An inline NSFL convention that overlaps a link', () => {
  it("splits the link node, not the NSFL node", () => {
    expect(Up.parse('(NSFL: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.PlainText('Gary loses to '),
          new Up.Link([
            new Up.PlainText('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Up.Link([
          new Up.PlainText(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ]))
  })
})


describe('A link that overlaps an inline NSFL convention', () => {
  it("splits the link node, not the NSFL node", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFL: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In Pokémon Red, '),
        new Up.Link([
          new Up.PlainText('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.PlainText('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.PlainText(' repeatedly')
        ]),
        new Up.PlainText(' throughout the game.')
      ]))
  })
})


describe('An inline NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineNsfl([
          new Up.PlainText('Ketchum')
        ]),
        new Up.PlainText(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfl([
            new Up.PlainText('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline NSFL convention', () => {
  it("splits the NSFL node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] footnote that overlaps an inline NSFL convention.'

    const footnote =
      new Up.Footnote([
        new Up.PlainText('reasonable '),
        new Up.InlineNsfl([
          new Up.PlainText('and realistic')
        ])
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.PlainText('Eventually, I will think of one'),
          footnote,
          new Up.InlineNsfl([
            new Up.PlainText(' example of a')
          ]),
          new Up.PlainText(' footnote that overlaps an inline NSFL convention.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})
