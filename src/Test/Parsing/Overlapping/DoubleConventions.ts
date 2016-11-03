import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Overlapped stressed, parenthesized, and inserted text', () => {
  it("split the normal parenthetical node once and the square parenthetical node twice", () => {
    expect(Up.parse('I **love (covertly [drinking** whole) milk] all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.Stress([
          new Up.Text('love '),
          new Up.NormalParenthetical([
            new Up.Text('(covertly '),
            new Up.SquareParenthetical([
              new Up.Text('[drinking')
            ])
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.SquareParenthetical([
            new Up.Text(' whole)')
          ])
        ]),
        new Up.SquareParenthetical([
          new Up.Text(' milk]')
        ]),
        new Up.Text(' all the time.')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the same time) and parenthesized text', () => {
  it('split the normal parenthetical node', () => {
    expect(Up.parse("*I know. *Well, I don't (really.** Ha!) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('I know. '),
          new Up.Emphasis([
            new Up.Text("Well, I don't "),
            new Up.NormalParenthetical([
              new Up.Text('(really.')
            ])
          ]),
        ]),
        new Up.NormalParenthetical([
          new Up.Text(' Ha!)')
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Nested inline revealables (closing at the same time) overlapping emphasis', () => {
  it('split the emphasis node', () => {
    expect(Up.parse("[SPOILER: I know. [SPOILER: Well, I don't *really.]] Good!* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('I know. '),
          new Up.InlineRevealable([
            new Up.Text("Well, I don't "),
            new Up.Emphasis([
              new Up.Text('really.')
            ])
          ]),
        ]),
        new Up.Emphasis([
          new Up.Text(' Good!')
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Emphasis overlapping nested Inline revealables (opening at the same time)', () => {
  it('split the emphasis node', () => {
    expect(Up.parse("*I suspect [SPOILER: [SPOILER: you* fight Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text("I suspect "),
        ]),
        new Up.InlineRevealable([
          new Up.InlineRevealable([
            new Up.Emphasis([
              new Up.Text('you')
            ]),
            new Up.Text(' fight Gary.')
          ])
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Nested Inline revealables (closing at the same time) overlapping a link', () => {
  it('split the link node', () => {
    expect(Up.parse("[SPOILER: I know. [SPOILER: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('I know. '),
          new Up.InlineRevealable([
            new Up.Text("Well, I don't "),
            new Up.Link([
              new Up.Text('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new Up.Link([
          new Up.Text(' Good!')
        ], 'https://example.com/really-good'),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('A link overlapping nested Inline revealables (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.parse("(I suspect [SPOILER: [SPOILER: you)(example.com/crime-suspects) fight Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new Up.InlineRevealable([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('you')
            ], 'https://example.com/crime-suspects'),
            new Up.Text(' fight Gary.')
          ])
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('A link overlapping an inline revealable convention containing a nested inline revealable convention (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.parse("(I suspect [NSFL: [NSFW: naked you)(example.com/crime-suspects) wrestles a rotting Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.Text("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new Up.InlineRevealable([
          new Up.InlineRevealable([
            new Up.Link([
              new Up.Text('naked you')
            ], 'https://example.com/crime-suspects'),
            new Up.Text(' wrestles a rotting Gary.')
          ])
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('An inline revealable convention nested within another inline revealable convention (closing at the same time), both of which overlap a link', () => {
  it('splits the link node', () => {
    expect(Up.parse("[NSFL: I know. [NSFW: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineRevealable([
          new Up.Text('I know. '),
          new Up.InlineRevealable([
            new Up.Text("Well, I don't "),
            new Up.Link([
              new Up.Text('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new Up.Link([
          new Up.Text(' Good!')
        ], 'https://example.com/really-good'),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the different times) and parenthesized text', () => {
  it('split the stress node, with 1 part inside both emphasis nodes), 1 part only enclosing up to the end of the outer emphasis, and 1 part following both emphasis nodes', () => {
    expect(Up.parse("*I know. *Well, I don't (really.* So there.* Ha!) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('I know. '),
          new Up.Emphasis([
            new Up.Text("Well, I don't "),
            new Up.NormalParenthetical([
              new Up.Text('(really.')
            ])
          ]),
          new Up.NormalParenthetical([
            new Up.Text(' So there.')
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.Text(' Ha!)')
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Overlapped parenthesized text and doubly emphasized text (opening at the same time)', () => {
  it('split the emphasis nodes', () => {
    expect(Up.parse("(I need to sleep. **So) what?* It's early.* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text("(I need to sleep. "),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.Text("So)"),
            ])
          ])
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Text(" what?"),
          ]),
          new Up.Text(" It's early.")
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Overlapped parenthesized text and doubly emphasized text (opening at different times)', () => {
  it('split the emphasis nodes', () => {
    expect(Up.parse("(I need to sleep. *Uhhh... *So) what?* It's early.* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.Text("(I need to sleep. "),
          new Up.Emphasis([
            new Up.Text("Uhhh… "),
            new Up.Emphasis([
              new Up.Text("So)")
            ])
          ])
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Text(" what?"),
          ]),
          new Up.Text(" It's early.")
        ]),
        new Up.Text(' Hi!')
      ]))
  })
})


describe('Emphasis nested within parenthesized text, both of which overlap a link', () => {
  it('are both split by the link', () => {
    expect(Up.parse("In Texas, (*I never eat [cereal*) outside](example.com/sun-flakes). Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('In Texas, '),
        new Up.NormalParenthetical([
          new Up.Text('('),
          new Up.Emphasis([
            new Up.Text('I never eat ')
          ]),
        ]),
        new Up.Link([
          new Up.NormalParenthetical([
            new Up.Emphasis([
              new Up.Text('cereal')
            ]),
            new Up.Text(')'),
          ]),
          new Up.Text(' outside')
        ], 'https://example.com/sun-flakes'),
        new Up.Text('. Hi!')
      ]))
  })
})


describe('A link that overlaps both an emphasis convention and some parenthesized text that the emphasis convention is nested within', () => {
  it('splits the parenthesized text and emphasis conventions', () => {
    expect(Up.parse("In [Texas, (*I](example.com/texas-hurricans) never eat cereal*) outside.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('In '),
        new Up.Link([
          new Up.Text('Texas, '),
          new Up.NormalParenthetical([
            new Up.Text('('),
            new Up.Emphasis([
              new Up.Text('I'),
            ]),
          ]),
        ], 'https://example.com/texas-hurricans'),
        new Up.NormalParenthetical([
          new Up.Emphasis([
            new Up.Text(' never eat cereal')
          ]),
          new Up.Text(')'),
        ]),
        new Up.Text(' outside.')
      ]))
  })
})


describe('A link that overlaps nested emphasis conventions', () => {
  it('splits both emphasis conventions', () => {
    expect(Up.parse("In [Texas, **I](example.com/texas-hurricans) never* eat cereal* outside.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('In '),
        new Up.Link([
          new Up.Text('Texas, '),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.Text('I'),
            ])
          ])
        ], 'https://example.com/texas-hurricans'),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Text(' never')
          ]),
          new Up.Text(' eat cereal')
        ]),
        new Up.Text(' outside.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping emphasis and stress conventions', () => {
  it('splits both the emphasis convention and the already-split stress convention', () => {
    expect(Up.parse("Hello [Gary, *my **very](example.com/rhyme) dear* friend**.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello '),
        new Up.Link([
          new Up.Text('Gary, '),
          new Up.Emphasis([
            new Up.Text('my '),
            new Up.Stress([
              new Up.Text('very'),
            ])
          ])
        ], 'https://example.com/rhyme'),
        new Up.Emphasis([
          new Up.Stress([
            new Up.Text(' dear')
          ]),
        ]),
        new Up.Stress([
          new Up.Text(' friend')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping double emphasis and stress conventions', () => {
  it('splits both emphasis conventions and the already-split stress convention', () => {
    expect(Up.parse("Hello [Gary, *my *own **very](example.com/rhyme) dear* and kind* friend**.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello '),
        new Up.Link([
          new Up.Text('Gary, '),
          new Up.Emphasis([
            new Up.Text('my '),
            new Up.Emphasis([
              new Up.Text('own '),
              new Up.Stress([
                new Up.Text('very'),
              ]),
            ]),
          ])
        ], 'https://example.com/rhyme'),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Stress([
              new Up.Text(' dear'),
            ]),
          ]),
          new Up.Stress([
            new Up.Text(' and kind')
          ]),
        ]),
        new Up.Stress([
          new Up.Text(' friend')
        ]),
        new Up.Text('.')
      ]))
  })
})


describe('Emphasis nested with an inline revealable, both of which overlap a link', () => {
  it('splits the emphasis node then the link node', () => {
    expect(Up.parse("In Texas, (SPOILER: *I never eat [cereal*) outside](example.com/sun-flakes)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('In Texas, '),
        new Up.InlineRevealable([
          new Up.Emphasis([
            new Up.Text('I never eat '),
          ]),
          new Up.Link([
            new Up.Emphasis([
              new Up.Text('cereal')
            ]),
          ], 'https://example.com/sun-flakes'),
        ]),
        new Up.Link([
          new Up.Text(' outside')
        ], 'https://example.com/sun-flakes')
      ]))
  })
})


describe('Emphasis overlapping a linified revealable convention', () => {
  it('splits the emphasis node, not the revealable` or link nodes', () => {
    expect(Up.parse('I do *not [NSFL: care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Emphasis([
          new Up.Text('not ')
        ]),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Emphasis([
              new Up.Text('care')
            ]),
            new Up.Text(' at'),
          ], 'https://en.wikipedia.org/wiki/Carrot'),
        ]),
        new Up.Text(' all.')
      ]))
  })
})


describe('A linkified revealable convention overlapping emphasized text', () => {
  it('splits the emphasis node, not the revealable or link nodes', () => {
    expect(Up.parse('This [SPOILER: trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.InlineRevealable([
          new Up.Link([
            new Up.Text('trash '),
            new Up.Emphasis([
              new Up.Text('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
        ]),
        new Up.Emphasis([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })
})


describe('An inline revealable overlapping an emphasis convention split in two (by a link) ending in the second piece of the split emphasis', () => {
  it('splits the emphasis node again', () => {
    expect(Up.parse('This [SPOILER: old (trash *can)(en.wikipedia.org/wiki/Waste_container) certainly] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('This '),
        new Up.InlineRevealable([
          new Up.Text('old '),
          new Up.Link([
            new Up.Text('trash '),
            new Up.Emphasis([
              new Up.Text('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
          new Up.Emphasis([
            new Up.Text(' certainly')
          ]),
        ]),
        new Up.Emphasis([
          new Up.Text(' not')
        ]),
        new Up.Text(' stay here.')
      ]))
  })
})
