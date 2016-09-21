import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from'.././Helpers'


// TODO: Organize these tests into contexts for clarity

describe('Emphasized text overlapping a link', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.parse('I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Emphasis([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('care')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


describe('A link overlapping emphasized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.parse('This [trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.Emphasis([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Emphasis([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })
})


describe('Italicized text overlapping a link', () => {
  it('splits the italics node, not the link node', () => {
    expect(Up.parse('I do _not [care_ at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Italics([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Italics([
            new Up.Text('care')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


describe('A link overlapping italicized text', () => {
  it('splits the emphasis node, not the link node', () => {
    expect(Up.parse('This [trash _can][https://en.wikipedia.org/wiki/Waste_container] not_ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.Italics([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Italics([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })
})


context('When a link overlaps stressed text, the stressed text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash **can](https://en.wikipedia.org/wiki/Waste_container) not** stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.Stress([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Stress([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The italicized text opens first', () => {
    expect(Up.parse('I do **not (care** at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Stress([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Stress([
            new Up.Text('care')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


context('When a link overlaps italicized text, the italicized text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash _can](https://en.wikipedia.org/wiki/Waste_container) not_ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.Italics([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Italics([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The italicized text opens first', () => {
    expect(Up.parse('I do _not (care_ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Italics([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Italics([
            new Up.Text('care')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


context('When a link overlaps bold text, the bold text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash __can](https://en.wikipedia.org/wiki/Waste_container) not__ stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.Bold([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Bold([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The bold text opens first', () => {
    expect(Up.parse('I do __not (care__ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Bold([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Bold([
            new Up.Text('care')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


context('When a link overlaps highlighted text, the highlighted text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash (highlight: can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.Highlight([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Highlight([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The highlight opens first', () => {
    expect(Up.parse('I do [highlight: not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Highlight([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Highlight([
            new Up.Text('care')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


context('When a link overlaps parenthesized text, the parenthesized text will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash (can](https://en.wikipedia.org/wiki/Waste_container) not) stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.NormalParenthetical([
            new Up.Text('(can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.NormalParenthetical([
          new Up.Text(' not)')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The parenthesized text opens first', () => {
    expect(Up.parse('I do (not [care) at](https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.NormalParenthetical([
          new Up.Text('(not ')
        ]),
        new Up.Link([
          new Up.NormalParenthetical([
            new Up.Text('care)')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


context('When a link overlaps square bracketed text, the square bracketed text will always be split. This includes when:', () => {
  it('The link opens first', () => {
    expect(Up.parse('This (trash [can)(https://en.wikipedia.org/wiki/Waste_container) not] stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.SquareParenthetical([
            new Up.Text('[can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.SquareParenthetical([
          new Up.Text(' not]')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  it('The square bracketed text opens first', () => {
    expect(Up.parse('I do [not (care] at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.SquareParenthetical([
          new Up.Text('[not ')
        ]),
        new Up.Link([
          new Up.SquareParenthetical([
            new Up.Text('care]')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


context('When a link overlaps a quote, the quote will always be split. This includes when:', () => {
  specify('the link opens first', () => {
    expect(Up.parse('This [trash "can][https://en.wikipedia.org/wiki/Waste_container] not" stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash '),
          new Up.InlineQuote([
            new Up.Text('"can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.InlineQuote([
          new Up.Text(' not"')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The quote opens first', () => {
    expect(Up.parse('I do "not [care" at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.InlineQuote([
          new Up.Text('"not ')
        ]),
        new Up.Link([
          new Up.InlineQuote([
            new Up.Text('care"')
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


describe('An inline spoiler that overlaps a link', () => {
  it("splits the link node, not the spoiler node", () => {
    expect(Up.parse('(SPOILER: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.Text('Gary loses to '),
          new Up.Link([
            new Up.Text('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Up.Link([
          new Up.Text(' Ketchum')
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
        new Up.Text('In Pokémon Red, '),
        new Up.Link([
          new Up.Text('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.Text('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.Text(' repeatedly')
        ]),
        new Up.Text(' throughout the game.')
      ]))
  })
})


describe('An inline spoiler that overlaps a footnote', () => {
  it("splits the spoiler node, not the footnote node", () => {
    const markup = '[SPOILER: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineSpoiler([
          new Up.Text('Ketchum')
        ]),
        new Up.Text(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineSpoiler([
            new Up.Text('Gary loses to Ash'),
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
        new Up.Text('reasonable '),
        new Up.InlineSpoiler([
          new Up.Text('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will think of one'),
          footnote,
          new Up.InlineSpoiler([
            new Up.Text(' example of a')
          ]),
          new Up.Text(' footnote that overlaps an inline spoiler.'),
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
          new Up.Text('Gary loses to '),
          new Up.Link([
            new Up.Text('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Up.Link([
          new Up.Text(' Ketchum')
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
        new Up.Text('In Pokémon Red, '),
        new Up.Link([
          new Up.Text('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineNsfw([
          new Up.Link([
            new Up.Text('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.Text(' repeatedly')
        ]),
        new Up.Text(' throughout the game.')
      ]))
  })
})


describe('An inline NSFW convention that overlaps a footnote', () => {
  it("splits the NSFW node, not the footnote node", () => {
    const markup = '[NSFW: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineNsfw([
          new Up.Text('Ketchum')
        ]),
        new Up.Text(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfw([
            new Up.Text('Gary loses to Ash')
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
        new Up.Text('reasonable '),
        new Up.InlineNsfw([
          new Up.Text('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will think of one'),
          footnote,
          new Up.InlineNsfw([
            new Up.Text(' example of a'),
          ]),
          new Up.Text(' footnote that overlaps an inline NSFW convention.')
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
          new Up.Text('Gary loses to '),
          new Up.Link([
            new Up.Text('Ash')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
        ]),
        new Up.Link([
          new Up.Text(' Ketchum')
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
        new Up.Text('In Pokémon Red, '),
        new Up.Link([
          new Up.Text('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Text('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.Text(' repeatedly')
        ]),
        new Up.Text(' throughout the game.')
      ]))
  })
})


describe('An inline NSFL convention that overlaps a footnote', () => {
  it("splits the NSFL node, not the footnote node", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineNsfl([
          new Up.Text('Ketchum')
        ]),
        new Up.Text(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineNsfl([
            new Up.Text('Gary loses to Ash'),
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
        new Up.Text('reasonable '),
        new Up.InlineNsfl([
          new Up.Text('and realistic')
        ])
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will think of one'),
          footnote,
          new Up.InlineNsfl([
            new Up.Text(' example of a')
          ]),
          new Up.Text(' footnote that overlaps an inline NSFL convention.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})
