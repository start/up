import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'


describe('Overlapped stressed, deleted, and inserted text', () => {
  it("split the revision deletion node once and the revision insertion node twice", () => {
    expect(Up.toDocument('I **love ~~covertly ++drinking** whole~~ milk++ all the time.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new StressNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('covertly '),
            new RevisionInsertionNode([
              new PlainTextNode('drinking')
            ])
          ])
        ]),
        new RevisionDeletionNode([
          new RevisionInsertionNode([
            new PlainTextNode(' whole')
          ])
        ]),
        new RevisionInsertionNode([
          new PlainTextNode(' milk')
        ]),
        new PlainTextNode(' all the time.')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the same time) and revision deletion', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toDocument("*I know. *Well, I don't ~~really.** Ha!~~ Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('I know. '),
          new Emphasis([
            new PlainTextNode("Well, I don't "),
            new RevisionDeletionNode([
              new PlainTextNode('really.')
            ])
          ]),
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' Ha!')
        ]),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('Nested spoilers (closing at the same time) overlapping a link', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toDocument("[SPOILER: I know. [SPOILER: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new InlineSpoilerNode([
          new PlainTextNode('I know. '),
          new InlineSpoilerNode([
            new PlainTextNode("Well, I don't "),
            new LinkNode([
              new PlainTextNode('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new LinkNode([
          new PlainTextNode(' Good!')
        ], 'https://example.com/really-good'),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('A link overlapping nested spoilers (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.toDocument("(I suspect [SPOILER: [SPOILER: you)(example.com/crime-suspects) fight Gary.]] Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new InlineSpoilerNode([
          new InlineSpoilerNode([
            new LinkNode([
              new PlainTextNode('you')
            ], 'https://example.com/crime-suspects'),
            new PlainTextNode(' fight Gary.')
          ])
        ]),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('A link overlapping an inline NSFL convention containing an inline NSFW convention (opening at the same time)', () => {
  it('splits the link node', () => {
    expect(Up.toDocument("(I suspect [NSFL: [NSFW: naked you)(example.com/crime-suspects) wrestles a rotting Gary.]] Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new LinkNode([
          new PlainTextNode("I suspect "),
        ], 'https://example.com/crime-suspects'),
        new InlineNsflNode([
          new InlineNsfwNode([
            new LinkNode([
              new PlainTextNode('naked you')
            ], 'https://example.com/crime-suspects'),
            new PlainTextNode(' wrestles a rotting Gary.')
          ])
        ]),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('An inline NSFW convention nested within an inline NSFL convention (closing at the same time), both of which overlap a link', () => {
  it('splits the link node', () => {
    expect(Up.toDocument("[NSFL: I know. [NSFW: Well, I don't (really.]] Good!)(example.com/really-good) Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new InlineNsflNode([
          new PlainTextNode('I know. '),
          new InlineNsfwNode([
            new PlainTextNode("Well, I don't "),
            new LinkNode([
              new PlainTextNode('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new LinkNode([
          new PlainTextNode(' Good!')
        ], 'https://example.com/really-good'),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the different times) and revision deletion', () => {
  it('splits the stress node, with 1 part inside both emphasis nodes), 1 part only enclosing up to the end of the outer emphasis, and 1 part following both emphasis nodes', () => {
    expect(Up.toDocument("*I know. *Well, I don't ~~really.* So there.* Ha!~~ Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('I know. '),
          new Emphasis([
            new PlainTextNode("Well, I don't "),
            new RevisionDeletionNode([
              new PlainTextNode('really.')
            ])
          ]),
          new RevisionDeletionNode([
            new PlainTextNode(' So there.')
          ])
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' Ha!')
        ]),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('Overlapped revision deletion and doubly emphasized text (opening at the same time)', () => {
  it('splits the emphasis nodes', () => {
    expect(Up.toDocument("~~I need to sleep. **So~~ what?* It's early.* Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionDeletionNode([
          new PlainTextNode("I need to sleep. "),
          new Emphasis([
            new Emphasis([
              new PlainTextNode("So"),
            ])
          ])
        ]),
        new Emphasis([
          new Emphasis([
            new PlainTextNode(" what?"),
          ]),
          new PlainTextNode(" It's early.")
        ]),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('Overlapped revision deletion and doubly emphasized text (opening at different times)', () => {
  it('splits the emphasis nodes', () => {
    expect(Up.toDocument("~~I need to sleep. *Uhhh... *So~~ what?* It's early.* Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionDeletionNode([
          new PlainTextNode("I need to sleep. "),
          new Emphasis([
            new PlainTextNode("Uhhh... "),
            new Emphasis([
              new PlainTextNode("So"),
            ])
          ])
        ]),
        new Emphasis([
          new Emphasis([
            new PlainTextNode(" what?"),
          ]),
          new PlainTextNode(" It's early.")
        ]),
        new PlainTextNode(' Hi!')
      ]))
  })
})


describe('Emphasis nested within revision deletion, both of which overlap a link', () => {
  it('are both split by the link', () => {
    expect(Up.toDocument("In Texas, ~~*I never eat [cereal*~~ outside](example.com/sun-flakes). Hi!")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Texas, '),
        new RevisionDeletionNode([
          new Emphasis([
            new PlainTextNode('I never eat '),
          ]),
        ]),
        new LinkNode([
          new RevisionDeletionNode([
            new Emphasis([
              new PlainTextNode('cereal')
            ])
          ]),
          new PlainTextNode(' outside')
        ], 'https://example.com/sun-flakes'),
        new PlainTextNode('. Hi!')
      ]))
  })
})


describe('A link that overlaps both an emphasis convention and the revision deletion the emphasis convention is nested within', () => {
  it('splits the revision deletion and emphasis conventions', () => {
    expect(Up.toDocument("In [Texas, ~~*I](example.com/texas-hurricans) never eat cereal*~~ outside.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In '),
        new LinkNode([
          new PlainTextNode('Texas, '),
          new RevisionDeletionNode([
            new Emphasis([
              new PlainTextNode('I'),
            ]),
          ]),
        ], 'https://example.com/texas-hurricans'),
        new RevisionDeletionNode([
          new Emphasis([
            new PlainTextNode(' never eat cereal')
          ])
        ]),
        new PlainTextNode(' outside.')
      ]))
  })
})


describe('A link that overlaps nested emphasis conventions', () => {
  it('splits both emphasis conventions', () => {
    expect(Up.toDocument("In [Texas, **I](example.com/texas-hurricans) never* eat cereal* outside.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In '),
        new LinkNode([
          new PlainTextNode('Texas, '),
          new Emphasis([
            new Emphasis([
              new PlainTextNode('I'),
            ])
          ])
        ], 'https://example.com/texas-hurricans'),
        new Emphasis([
          new Emphasis([
            new PlainTextNode(' never')
          ]),
          new PlainTextNode(' eat cereal')
        ]),
        new PlainTextNode(' outside.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping emphasis and stress conventions', () => {
  it('splits both the emphasis convention and the already-split stress convention', () => {
    expect(Up.toDocument("Hello [Gary, *my **very](example.com/rhyme) dear* friend**.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello '),
        new LinkNode([
          new PlainTextNode('Gary, '),
          new Emphasis([
            new PlainTextNode('my '),
            new StressNode([
              new PlainTextNode('very'),
            ])
          ])
        ], 'https://example.com/rhyme'),
        new Emphasis([
          new StressNode([
            new PlainTextNode(' dear')
          ]),
        ]),
        new StressNode([
          new PlainTextNode(' friend')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('A link that overlaps nested already-overlapping double emphasis and stress conventions', () => {
  it('splits both emphasis conventions and the already-split stress convention', () => {
    expect(Up.toDocument("Hello [Gary, *my *own **very](example.com/rhyme) dear* and kind* friend**.")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello '),
        new LinkNode([
          new PlainTextNode('Gary, '),
          new Emphasis([
            new PlainTextNode('my '),
            new Emphasis([
              new PlainTextNode('own '),
              new StressNode([
                new PlainTextNode('very'),
              ]),
            ]),
          ])
        ], 'https://example.com/rhyme'),
        new Emphasis([
          new Emphasis([
            new StressNode([
              new PlainTextNode(' dear'),
            ]),
          ]),
          new StressNode([
            new PlainTextNode(' and kind')
          ]),
        ]),
        new StressNode([
          new PlainTextNode(' friend')
        ]),
        new PlainTextNode('.')
      ]))
  })
})


describe('Emphasis nested with an inline spoiler, both of which overlap a link', () => {
  it('splits the emphasis node then the link node', () => {
    expect(Up.toDocument("In Texas, (SPOILER: *I never eat [cereal*) outside](example.com/sun-flakes)")).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Texas, '),
        new InlineSpoilerNode([
          new Emphasis([
            new PlainTextNode('I never eat '),
          ]),
          new LinkNode([
            new Emphasis([
              new PlainTextNode('cereal')
            ]),
          ], 'https://example.com/sun-flakes'),
        ]),
        new LinkNode([
          new PlainTextNode(' outside')
        ], 'https://example.com/sun-flakes')
      ]))
  })
})


describe('Emphasis overlapping a linkified NSFL convention', () => {
  it('splits the emphasis node, not the NSF: or link nodes', () => {
    expect(Up.toDocument('I do *not [NSFL: care* at][https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new Emphasis([
          new PlainTextNode('not ')
        ]),
        new InlineNsflNode([
          new LinkNode([
            new Emphasis([
              new PlainTextNode('care')
            ]),
            new PlainTextNode(' at'),
          ], 'https://en.wikipedia.org/wiki/Carrot'),
        ]),
        new PlainTextNode(' all.')
      ]))
  })
})


describe('A linkified spoiler overlapping emphasized text', () => {
  it('splits the emphasis node, not the spoiler or link nodes', () => {
    expect(Up.toDocument('This [SPOILER: trash *can][https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new InlineSpoilerNode([
          new LinkNode([
            new PlainTextNode('trash '),
            new Emphasis([
              new PlainTextNode('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
        ]),
        new Emphasis([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})


describe('An inline spoiler overlapping an emphasis convention split in two (by a link) ending in the second piece of the split emphasis', () => {
  it('splits the emphasis node again', () => {
    expect(Up.toDocument('This [SPOILER: old (trash *can)(en.wikipedia.org/wiki/Waste_container) certainly] not* stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new InlineSpoilerNode([
          new PlainTextNode('old '),
          new LinkNode([
            new PlainTextNode('trash '),
            new Emphasis([
              new PlainTextNode('can')
            ]),
          ], 'https://en.wikipedia.org/wiki/Waste_container'),
          new Emphasis([
            new PlainTextNode(' certainly')
          ]),
        ]),
        new Emphasis([
          new PlainTextNode(' not')
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})
