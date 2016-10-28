import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '.././Helpers'


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
        new Up.Italic([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Italic([
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
          new Up.Italic([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Italic([
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
          new Up.Italic([
            new Up.Text('can')
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.Italic([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The italicized text opens first', () => {
    expect(Up.parse('I do _not (care_ at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Italic([
          new Up.Text('not ')
        ]),
        new Up.Link([
          new Up.Italic([
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
    expect(Up.parse('This [trash ==can](https://en.wikipedia.org/wiki/Waste_container) not== stay here.')).to.deep.equal(
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
    expect(Up.parse('I do ==not (care== at)(https://en.wikipedia.org/wiki/Carrot) all.')).to.deep.equal(
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


context('When a link overlaps a quote, the link will always be split. This includes when:', () => {
  specify('The link opens first', () => {
    expect(Up.parse('This [trash "can][https://en.wikipedia.org/wiki/Waste_container] not" stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.Link([
          new Up.Text('trash ')
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new Up.InlineQuote([
          new Up.Link([
            new Up.Text('can')
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })

  specify('The quote opens first', () => {
    expect(Up.parse('I do "not [care" at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.InlineQuote([
          new Up.Text('not '),
          new Up.Link([
            new Up.Text('care')
          ], 'https://en.wikipedia.org/wiki/Carrot'),
        ]),
        new Up.Link([
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})


describe('An inline revealable that overlaps a footnote', () => {
  it("splits the revealable node, not the footnote node", () => {
    const markup = '[SPOILER: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineRevealable([
          new Up.Text('Ketchum')
        ]),
        new Up.Text(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([
            new Up.Text('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


describe('A footnote that overlaps an inline revealable', () => {
  it("splits the revealable node, not the footnote node", () => {
    const markup = 'Eventually, I will think of one (^reasonable [SPOILER: and realistic) example of a] footnote that overlaps an inline revealable.'

    const footnote =
      new Up.Footnote([
        new Up.Text('reasonable '),
        new Up.InlineRevealable([
          new Up.Text('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will think of one'),
          footnote,
          new Up.InlineRevealable([
            new Up.Text(' example of a')
          ]),
          new Up.Text(' footnote that overlaps an inline revealable.'),
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


context('When a link overlaps an inline revealable, the link node will always be split. This includes when:', () => {
  specify("The link opens first", () => {
    const markup =
      'In Pokémon Red, [Gary Oak (NSFW: loses to Ash Ketchum][http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly) throughout the game.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('In Pokémon Red, '),
        new Up.Link([
          new Up.Text('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new Up.Text(' repeatedly')
        ]),
        new Up.Text(' throughout the game.')
      ]))
  })

  specify("The inline revealable opens first", () => {
    expect(Up.parse('(NSFW: Gary loses to [Ash) Ketchum][http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
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


context('When quoted text overlaps emphasis text, the emphasis node will always be split. This includes when:', () => {
  specify('The inline quote opens first', () => {
    expect(Up.parse('I "love *drinking" whole* milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.InlineQuote([
          new Up.Text('love '),
          new Up.Emphasis([
            new Up.Text('drinking')
          ])
        ]),
        new Up.Emphasis([
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })

  specify('The emphasis opens first', () => {
    expect(Up.parse('I *love "drinking* whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.Emphasis([
          new Up.Text('love ')
        ]),
        new Up.InlineQuote([
          new Up.Emphasis([
            new Up.Text('drinking')
          ]),
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })
})


context('When quoted text overlaps stressed text, the stress node will always be split. This includes when:', () => {
  specify('The inline quote opens first', () => {
    expect(Up.parse('I "love **drinking" whole** milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.InlineQuote([
          new Up.Text('love '),
          new Up.Stress([
            new Up.Text('drinking')
          ])
        ]),
        new Up.Stress([
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })

  specify('The stress opens first', () => {
    expect(Up.parse('I **love "drinking** whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.Stress([
          new Up.Text('love ')
        ]),
        new Up.InlineQuote([
          new Up.Stress([
            new Up.Text('drinking')
          ]),
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })
})


context('When quoted text overlaps highlighted text, the highlight node will always be split. This includes when:', () => {
  specify('The inline quote opens first', () => {
    expect(Up.parse('I "love ==drinking" whole== milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.InlineQuote([
          new Up.Text('love '),
          new Up.Highlight([
            new Up.Text('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })

  specify('The highlight opens first', () => {
    expect(Up.parse('I ==love "drinking== whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.Highlight([
          new Up.Text('love ')
        ]),
        new Up.InlineQuote([
          new Up.Highlight([
            new Up.Text('drinking')
          ]),
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })
})


context('When quoted text overlaps an inline revealable convention, the revealable node will always be split. This includes when:', () => {
  specify('The inline quote opens first', () => {
    expect(Up.parse('I "love [NSFW: drinking" whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.InlineQuote([
          new Up.Text('love '),
          new Up.InlineRevealable([
            new Up.Text('drinking')
          ])
        ]),
        new Up.InlineRevealable([
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })

  specify('The revealable opens first', () => {
    expect(Up.parse('I [NSFW: love "drinking] whole" milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.InlineRevealable([
          new Up.Text('love ')
        ]),
        new Up.InlineQuote([
          new Up.InlineRevealable([
            new Up.Text('drinking')
          ]),
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })
})


context('When quoted text overlaps a footnote, the inline quote node will always be split. This includes when:', () => {
  specify('The inline quote opens first', () => {
    const markup = '"This is not [^ as realistic" as some other unit tests]'

    const footnote =
      new Up.Footnote([
        new Up.InlineQuote([
          new Up.Text('as realistic')
        ]),
        new Up.Text(' as some other unit tests')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineQuote([
            new Up.Text('This is not'),
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  specify('The footnote opens first', () => {
    const markup = 'Eventually, I will use a [^ reasonable "and realistic] example" of a footnote that overlaps an inline quote.'

    const footnote =
      new Up.Footnote([
        new Up.Text('reasonable '),
        new Up.InlineQuote([
          new Up.Text('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will use a'),
          footnote,
          new Up.InlineQuote([
            new Up.Text(' example'),
          ]),
          new Up.Text(' of a footnote that overlaps an inline quote.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})


context('When an inline revealable convention overlaps footnote, the revealable node will always be split. This includes when:', () => {
  specify("The inline revealable opens first", () => {
    const markup = '[NSFL: Gary loses to Ash (^Ketchum] is his last name)'

    const footnote =
      new Up.Footnote([
        new Up.InlineRevealable([
          new Up.Text('Ketchum')
        ]),
        new Up.Text(' is his last name')
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.InlineRevealable([
            new Up.Text('Gary loses to Ash'),
          ]),
          footnote
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })

  specify("The footnote opens first", () => {
    const markup = 'Eventually, I will think of one (^reasonable [NSFL: and realistic) example of a] footnote that overlaps an inline revealable convention.'

    const footnote =
      new Up.Footnote([
        new Up.Text('reasonable '),
        new Up.InlineRevealable([
          new Up.Text('and realistic')
        ]),
      ], { referenceNumber: 1 })

    expect(Up.parse(markup)).to.deep.equal(
      new Up.Document([
        new Up.Paragraph([
          new Up.Text('Eventually, I will think of one'),
          footnote,
          new Up.InlineRevealable([
            new Up.Text(' example of a'),
          ]),
          new Up.Text(' footnote that overlaps an inline revealable convention.')
        ]),
        new Up.FootnoteBlock([footnote])
      ]))
  })
})

