import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'
import { InlineSpoiler } from '../../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../../SyntaxNodes/InlineNsfl'
import { Link } from '../../../SyntaxNodes/Link'
import { RevisionDeletion } from '../../../SyntaxNodes/RevisionDeletion'
import { RevisionInsertion } from '../../../SyntaxNodes/RevisionInsertion'


describe('Overlapped stressed, deleted, and inserted text', () => {
  it("split the revision deletion node once and the revision insertion node twice", () => {
    expect(Up.toDocument('I **love ~~covertly ++drinking** whole~~ milk++ all the time.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Stress([
          new PlainText('love '),
          new RevisionDeletion([
            new PlainText('covertly '),
            new RevisionInsertion([
              new PlainText('drinking')
            ])
          ])
        ]),
        new RevisionDeletion([
          new RevisionInsertion([
            new PlainText(' whole')
          ])
        ]),
        new RevisionInsertion([
          new PlainText(' milk')
        ]),
        new PlainText(' all the time.')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the same time) and revision deletion', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toDocument("*I know. *Well, I don't ~~really.** Ha!~~ Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('I know. '),
          new Emphasis([
            new PlainText("Well, I don't "),
            new RevisionDeletion([
              new PlainText('really.')
            ])
          ]),
        ]),
        new RevisionDeletion([
          new PlainText(' Ha!')
        ]),
        new PlainText(' Hi!')
      ]))
  })
})


describe('Nested spoilers (closing at the same time) overlapping a link', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toDocument("[SPOILER: I know. [SPOILER: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineSpoiler([
          new PlainText('I know. '),
          new InlineSpoiler([
            new PlainText("Well, I don't "),
            new Link([
              new PlainText('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new Link([
          new PlainText(' Good!')
        ], 'https://example.com/really-good'),
        new PlainText(' Hi!')
      ]))
  })
})


describe('A link overlapping nested spoilers (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.toDocument("(I suspect [SPOILER: [SPOILER: you)(example.com/crime-suspects) fight Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new InlineSpoiler([
          new InlineSpoiler([
            new Link([
              new PlainText('you')
            ], 'https://example.com/crime-suspects'),
            new PlainText(' fight Gary.')
          ])
        ]),
        new PlainText(' Hi!')
      ]))
  })
})


describe('A link overlapping an inline NSFL convention containing an inline NSFW convention (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.toDocument("(I suspect [NSFL: [NSFW: naked you)(example.com/crime-suspects) wrestles a rotting Gary.]] Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Link([
          new PlainText("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new InlineNsfl([
          new InlineNsfw([
            new Link([
              new PlainText('naked you')
            ], 'https://example.com/crime-suspects'),
            new PlainText(' wrestles a rotting Gary.')
          ])
        ]),
        new PlainText(' Hi!')
      ]))
  })
})


describe('An inline NSFW convention nested within an inline NSFL convention (closing at the same time), both of which overlap a link', () => {
  it('splits the link node', () => {
    expect(Up.toDocument("[NSFL: I know. [NSFW: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new InlineNsfl([
          new PlainText('I know. '),
          new InlineNsfw([
            new PlainText("Well, I don't "),
            new Link([
              new PlainText('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new Link([
          new PlainText(' Good!')
        ], 'https://example.com/really-good'),
        new PlainText(' Hi!')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the different times) and revision deletion', () => {
  it('splits the stress node, with 1 part inside both emphasis nodes), 1 part only enclosing up to the end of the outer emphasis, and 1 part following both emphasis nodes', () => {
    expect(Up.toDocument("*I know. *Well, I don't ~~really.* So there.* Ha!~~ Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('I know. '),
          new Emphasis([
            new PlainText("Well, I don't "),
            new RevisionDeletion([
              new PlainText('really.')
            ])
          ]),
          new RevisionDeletion([
            new PlainText(' So there.')
          ])
        ]),
        new RevisionDeletion([
          new PlainText(' Ha!')
        ]),
        new PlainText(' Hi!')
      ]))
  })
})


describe('Overlapped revision deletion and doubly emphasized text (opening at the same time)', () => {
  it('splits the emphasis nodes', () => {
    expect(Up.toDocument("~~I need to sleep. **So~~ what?* It's early.* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new RevisionDeletion([
          new PlainText("I need to sleep. "),
          new Emphasis([
            new Emphasis([
              new PlainText("So"),
            ])
          ])
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(" what?"),
          ]),
          new PlainText(" It's early.")
        ]),
        new PlainText(' Hi!')
      ]))
  })
})


describe('Overlapped revision deletion and doubly emphasized text (opening at different times)', () => {
  it('splits the emphasis nodes', () => {
    expect(Up.toDocument("~~I need to sleep. *Uhhh... *So~~ what?* It's early.* Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new RevisionDeletion([
          new PlainText("I need to sleep. "),
          new Emphasis([
            new PlainText("Uhhh... "),
            new Emphasis([
              new PlainText("So"),
            ])
          ])
        ]),
        new Emphasis([
          new Emphasis([
            new PlainText(" what?"),
          ]),
          new PlainText(" It's early.")
        ]),
        new PlainText(' Hi!')
      ]))
  })
})


describe('Emphasis nested within revision deletion, both of which overlap a link', () => {
  it('are both split by the link', () => {
    expect(Up.toDocument("In Texas, ~~*I never eat [cereal*~~ outside](example.com/sun-flakes). Hi!")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In Texas, '),
        new RevisionDeletion([
          new Emphasis([
            new PlainText('I never eat '),
          ]),
        ]),
        new Link([
          new RevisionDeletion([
            new Emphasis([
              new PlainText('cereal')
            ])
          ]),
          new PlainText(' outside')
        ], 'https://example.com/sun-flakes'),
        new PlainText('. Hi!')
      ]))
  })
})


describe('A link that overlaps both an emphasis convention and the revision deletion the emphasis convention is nested within', () => {
  it('splits the revision deletion and emphasis conventions', () => {
    expect(Up.toDocument("In [Texas, ~~*I](example.com/texas-hurricans) never eat cereal*~~ outside.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In '),
        new Link([
          new PlainText('Texas, '),
          new RevisionDeletion([
            new Emphasis([
              new PlainText('I'),
            ]),
          ]),
        ], 'https://example.com/texas-hurricans'),
        new RevisionDeletion([
          new Emphasis([
            new PlainText(' never eat cereal')
          ])
        ]),
        new PlainText(' outside.')
      ]))
  })
})


describe('A link that overlaps nested emphasis conventions', () => {
  it('splits both emphasis conventions', () => {
    expect(Up.toDocument("In [Texas, **I](example.com/texas-hurricans) never* eat cereal* outside.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In '),
        new Link([
          new PlainText('Texas, '),
          new Emphasis([
            new Emphasis([
              new PlainText('I'),
            ])
          ])
        ], 'https://example.com/texas-hurricans'),
        new Emphasis([
          new Emphasis([
            new PlainText(' never')
          ]),
          new PlainText(' eat cereal')
        ]),
        new PlainText(' outside.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping emphasis and stress conventions', () => {
  it('splits both the emphasis convention and the already-split stress convention', () => {
    expect(Up.toDocument("Hello [Gary, *my **very](example.com/rhyme) dear* friend**.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello '),
        new Link([
          new PlainText('Gary, '),
          new Emphasis([
            new PlainText('my '),
            new Stress([
              new PlainText('very'),
            ])
          ])
        ], 'https://example.com/rhyme'),
        new Emphasis([
          new Stress([
            new PlainText(' dear')
          ]),
        ]),
        new Stress([
          new PlainText(' friend')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping double emphasis and stress conventions', () => {
  it('splits both emphasis conventions and the already-split stress convention', () => {
    expect(Up.toDocument("Hello [Gary, *my *own **very](example.com/rhyme) dear* and kind* friend**.")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello '),
        new Link([
          new PlainText('Gary, '),
          new Emphasis([
            new PlainText('my '),
            new Emphasis([
              new PlainText('own '),
              new Stress([
                new PlainText('very'),
              ]),
            ]),
          ])
        ], 'https://example.com/rhyme'),
        new Emphasis([
          new Emphasis([
            new Stress([
              new PlainText(' dear'),
            ]),
          ]),
          new Stress([
            new PlainText(' and kind')
          ]),
        ]),
        new Stress([
          new PlainText(' friend')
        ]),
        new PlainText('.')
      ]))
  })
})


describe('Emphasis nested with an inline spoiler, both of which overlap a link', () => {
  it('splits the emphasis node then the link node', () => {
    expect(Up.toDocument("In Texas, (SPOILER: *I never eat [cereal*) outside](example.com/sun-flakes)")).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('In Texas, '),
        new InlineSpoiler([
          new Emphasis([
            new PlainText('I never eat '),
          ]),
          new Link([
            new Emphasis([
              new PlainText('cereal')
            ]),
          ], 'https://example.com/sun-flakes'),
        ]),
        new Link([
          new PlainText(' outside')
        ], 'https://example.com/sun-flakes')
      ]))
  })
})


describe('Emphasis overlapping a linkified NSFL convention', () => {
  it('splits the emphasis node, not the NSF: or link nodes', () => {
    expect(Up.toDocument('I do *not [NSFL: care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Emphasis([
          new PlainText('not ')
        ]),
        new InlineNsfl([
          new Link([
            new Emphasis([
              new PlainText('care')
            ]),
            new PlainText(' at'),
          ], 'https://en.wikipedia.org/wiki/Carrot'),
        ]),
        new PlainText(' all.')
      ]))
  })
})


describe('A linkified spoiler overlapping emphasized text', () => {
  it('splits the emphasis node, not the spoiler or link nodes', () => {
    expect(Up.toDocument('This [SPOILER: trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new InlineSpoiler([
          new Link([
            new PlainText('trash '),
            new Emphasis([
              new PlainText('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
        ]),
        new Emphasis([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })
})


describe('An inline spoiler overlapping an emphasis convention split in two (by a link) ending in the second piece of the split emphasis', () => {
  it('splits the emphasis node again', () => {
    expect(Up.toDocument('This [SPOILER: old (trash *can)(en.wikipedia.org/wiki/Waste_container) certainly] not* stay here.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('This '),
        new InlineSpoiler([
          new PlainText('old '),
          new Link([
            new PlainText('trash '),
            new Emphasis([
              new PlainText('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
          new Emphasis([
            new PlainText(' certainly')
          ]),
        ]),
        new Emphasis([
          new PlainText(' not')
        ]),
        new PlainText(' stay here.')
      ]))
  })
})
