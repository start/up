import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('Overlapped stressed, parenthesized, and inserted text', () => {
  it("split the normal parenthetical node once and the square parenthetical node twice", () => {
    expect(Up.parse('I **love (covertly [drinking** whole) milk] all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Stress([
          new Up.PlainText('love '),
          new Up.NormalParenthetical([
            new Up.PlainText('(covertly '),
            new Up.SquareParenthetical([
              new Up.PlainText('[drinking')
            ])
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.SquareParenthetical([
            new Up.PlainText(' whole)')
          ])
        ]),
        new Up.SquareParenthetical([
          new Up.PlainText(' milk]')
        ]),
        new Up.PlainText(' all the time.')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the same time) and parenthesized text', () => {
  it('split the normal parenthetical node', () => {
    expect(Up.parse("*I know. *Well, I don't (really.** Ha!) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('I know. '),
          new Up.Emphasis([
            new Up.PlainText("Well, I don't "),
            new Up.NormalParenthetical([
              new Up.PlainText('(really.')
            ])
          ]),
        ]),
        new Up.NormalParenthetical([
          new Up.PlainText(' Ha!)')
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Nested spoilers (closing at the same time) overlapping emphasis', () => {
  it('split the emphasis node', () => {
    expect(Up.parse("[SPOILER: I know. [SPOILER: Well, I don't *really.]] Good!* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('I know. '),
          new Up.InlineSpoiler([
            new Up.PlainText("Well, I don't "),
            new Up.Emphasis([
              new Up.PlainText('really.')
            ])
          ]),
        ]),
        new Up.Emphasis([
          new Up.PlainText(' Good!')
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Emphasis overlapping nested spoilers (opening at the same time)', () => {
  it('split the emphasis node', () => {
    expect(Up.parse("*I suspect [SPOILER: [SPOILER: you* fight Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText("I suspect "),
        ]),
        new Up.InlineSpoiler([
          new Up.InlineSpoiler([
            new Up.Emphasis([
              new Up.PlainText('you')
            ]),
            new Up.PlainText(' fight Gary.')
          ])
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Nested spoilers (closing at the same time) overlapping a link', () => {
  it('split the link node', () => {
    expect(Up.parse("[SPOILER: I know. [SPOILER: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineSpoiler([
          new Up.PlainText('I know. '),
          new Up.InlineSpoiler([
            new Up.PlainText("Well, I don't "),
            new Up.Link([
              new Up.PlainText('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new Up.Link([
          new Up.PlainText(' Good!')
        ], 'https://example.com/really-good'),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('A link overlapping nested spoilers (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.parse("(I suspect [SPOILER: [SPOILER: you)(example.com/crime-suspects) fight Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new Up.InlineSpoiler([
          new Up.InlineSpoiler([
            new Up.Link([
              new Up.PlainText('you')
            ], 'https://example.com/crime-suspects'),
            new Up.PlainText(' fight Gary.')
          ])
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('A link overlapping an inline NSFL convention containing an inline NSFW convention (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.parse("(I suspect [NSFL: [NSFW: naked you)(example.com/crime-suspects) wrestles a rotting Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Link([
          new Up.PlainText("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new Up.InlineNsfl([
          new Up.InlineNsfw([
            new Up.Link([
              new Up.PlainText('naked you')
            ], 'https://example.com/crime-suspects'),
            new Up.PlainText(' wrestles a rotting Gary.')
          ])
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('An inline NSFW convention nested within an inline NSFL convention (closing at the same time), both of which overlap a link', () => {
  it('splits the link node', () => {
    expect(Up.parse("[NSFL: I know. [NSFW: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.InlineNsfl([
          new Up.PlainText('I know. '),
          new Up.InlineNsfw([
            new Up.PlainText("Well, I don't "),
            new Up.Link([
              new Up.PlainText('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new Up.Link([
          new Up.PlainText(' Good!')
        ], 'https://example.com/really-good'),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the different times) and parenthesized text', () => {
  it('split the stress node, with 1 part inside both emphasis nodes), 1 part only enclosing up to the end of the outer emphasis, and 1 part following both emphasis nodes', () => {
    expect(Up.parse("*I know. *Well, I don't (really.* So there.* Ha!) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('I know. '),
          new Up.Emphasis([
            new Up.PlainText("Well, I don't "),
            new Up.NormalParenthetical([
              new Up.PlainText('(really.')
            ])
          ]),
          new Up.NormalParenthetical([
            new Up.PlainText(' So there.')
          ])
        ]),
        new Up.NormalParenthetical([
          new Up.PlainText(' Ha!)')
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Overlapped parenthesized text and doubly emphasized text (opening at the same time)', () => {
  it('split the emphasis nodes', () => {
    expect(Up.parse("(I need to sleep. **So) what?* It's early.* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText("(I need to sleep. "),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText("So)"),
            ])
          ])
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(" what?"),
          ]),
          new Up.PlainText(" It's early.")
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Overlapped parenthesized text and doubly emphasized text (opening at different times)', () => {
  it('split the emphasis nodes', () => {
    expect(Up.parse("(I need to sleep. *Uhhh... *So) what?* It's early.* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.NormalParenthetical([
          new Up.PlainText("(I need to sleep. "),
          new Up.Emphasis([
            new Up.PlainText("Uhhh… "),
            new Up.Emphasis([
              new Up.PlainText("So)")
            ])
          ])
        ]),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(" what?"),
          ]),
          new Up.PlainText(" It's early.")
        ]),
        new Up.PlainText(' Hi!')
      ]))
  })
})


describe('Emphasis nested within parenthesized text, both of which overlap a link', () => {
  it('are both split by the link', () => {
    expect(Up.parse("In Texas, (*I never eat [cereal*) outside](example.com/sun-flakes). Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In Texas, '),
        new Up.NormalParenthetical([
          new Up.PlainText('('),
          new Up.Emphasis([
            new Up.PlainText('I never eat ')
          ]),
        ]),
        new Up.Link([
          new Up.NormalParenthetical([
            new Up.Emphasis([
              new Up.PlainText('cereal')
            ]),
            new Up.PlainText(')'),
          ]),
          new Up.PlainText(' outside')
        ], 'https://example.com/sun-flakes'),
        new Up.PlainText('. Hi!')
      ]))
  })
})


describe('A link that overlaps both an emphasis convention and some parenthesized text that the emphasis convention is nested within', () => {
  it('splits the parenthesized text and emphasis conventions', () => {
    expect(Up.parse("In [Texas, (*I](example.com/texas-hurricans) never eat cereal*) outside.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In '),
        new Up.Link([
          new Up.PlainText('Texas, '),
          new Up.NormalParenthetical([
            new Up.PlainText('('),
            new Up.Emphasis([
              new Up.PlainText('I'),
            ]),
          ]),
        ], 'https://example.com/texas-hurricans'),
        new Up.NormalParenthetical([
          new Up.Emphasis([
            new Up.PlainText(' never eat cereal')
          ]),
          new Up.PlainText(')'),
        ]),
        new Up.PlainText(' outside.')
      ]))
  })
})


describe('A link that overlaps nested emphasis conventions', () => {
  it('splits both emphasis conventions', () => {
    expect(Up.parse("In [Texas, **I](example.com/texas-hurricans) never* eat cereal* outside.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In '),
        new Up.Link([
          new Up.PlainText('Texas, '),
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText('I'),
            ])
          ])
        ], 'https://example.com/texas-hurricans'),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.PlainText(' never')
          ]),
          new Up.PlainText(' eat cereal')
        ]),
        new Up.PlainText(' outside.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping emphasis and stress conventions', () => {
  it('splits both the emphasis convention and the already-split stress convention', () => {
    expect(Up.parse("Hello [Gary, *my **very](example.com/rhyme) dear* friend**.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello '),
        new Up.Link([
          new Up.PlainText('Gary, '),
          new Up.Emphasis([
            new Up.PlainText('my '),
            new Up.Stress([
              new Up.PlainText('very'),
            ])
          ])
        ], 'https://example.com/rhyme'),
        new Up.Emphasis([
          new Up.Stress([
            new Up.PlainText(' dear')
          ]),
        ]),
        new Up.Stress([
          new Up.PlainText(' friend')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping double emphasis and stress conventions', () => {
  it('splits both emphasis conventions and the already-split stress convention', () => {
    expect(Up.parse("Hello [Gary, *my *own **very](example.com/rhyme) dear* and kind* friend**.")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello '),
        new Up.Link([
          new Up.PlainText('Gary, '),
          new Up.Emphasis([
            new Up.PlainText('my '),
            new Up.Emphasis([
              new Up.PlainText('own '),
              new Up.Stress([
                new Up.PlainText('very'),
              ]),
            ]),
          ])
        ], 'https://example.com/rhyme'),
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText(' dear'),
            ]),
          ]),
          new Up.Stress([
            new Up.PlainText(' and kind')
          ]),
        ]),
        new Up.Stress([
          new Up.PlainText(' friend')
        ]),
        new Up.PlainText('.')
      ]))
  })
})


describe('Emphasis nested with an inline spoiler, both of which overlap a link', () => {
  it('splits the emphasis node then the link node', () => {
    expect(Up.parse("In Texas, (SPOILER: *I never eat [cereal*) outside](example.com/sun-flakes)")).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('In Texas, '),
        new Up.InlineSpoiler([
          new Up.Emphasis([
            new Up.PlainText('I never eat '),
          ]),
          new Up.Link([
            new Up.Emphasis([
              new Up.PlainText('cereal')
            ]),
          ], 'https://example.com/sun-flakes'),
        ]),
        new Up.Link([
          new Up.PlainText(' outside')
        ], 'https://example.com/sun-flakes')
      ]))
  })
})


describe('Emphasis overlapping a linkified NSFL convention', () => {
  it('splits the emphasis node, not the NSF: or link nodes', () => {
    expect(Up.parse('I do *not [NSFL: care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Emphasis([
          new Up.PlainText('not ')
        ]),
        new Up.InlineNsfl([
          new Up.Link([
            new Up.Emphasis([
              new Up.PlainText('care')
            ]),
            new Up.PlainText(' at'),
          ], 'https://en.wikipedia.org/wiki/Carrot'),
        ]),
        new Up.PlainText(' all.')
      ]))
  })
})


describe('A linkified spoiler overlapping emphasized text', () => {
  it('splits the emphasis node, not the spoiler or link nodes', () => {
    expect(Up.parse('This [SPOILER: trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.InlineSpoiler([
          new Up.Link([
            new Up.PlainText('trash '),
            new Up.Emphasis([
              new Up.PlainText('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
        ]),
        new Up.Emphasis([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })
})


describe('An inline spoiler overlapping an emphasis convention split in two (by a link) ending in the second piece of the split emphasis', () => {
  it('splits the emphasis node again', () => {
    expect(Up.parse('This [SPOILER: old (trash *can)(en.wikipedia.org/wiki/Waste_container) certainly] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('This '),
        new Up.InlineSpoiler([
          new Up.PlainText('old '),
          new Up.Link([
            new Up.PlainText('trash '),
            new Up.Emphasis([
              new Up.PlainText('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
          new Up.Emphasis([
            new Up.PlainText(' certainly')
          ]),
        ]),
        new Up.Emphasis([
          new Up.PlainText(' not')
        ]),
        new Up.PlainText(' stay here.')
      ]))
  })
})
