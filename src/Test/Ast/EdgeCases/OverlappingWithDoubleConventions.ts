import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { NsfwNode } from '../../../SyntaxNodes/NsfwNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'


describe('Overlapped doubly emphasized text (closing at the same time) and revision deletion', () => {
  it('splits the revision deletion node', () => {
    expect(Up.toAst("*I know. *Well, I don't ~~really.** Ha!~~")).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('I know. '),
          new EmphasisNode([
            new PlainTextNode("Well, I don't "),
            new RevisionDeletionNode([
              new PlainTextNode('really.')
            ])
          ]),
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped nested spoilers (closing at the same time) and a link', () => {
  it('splits the link node', () => {
    expect(Up.toAst("[SPOILER: I know. [SPOILER: Well, I don't {really.]] Good!}(example.com/really-good)")).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('I know. '),
          new SpoilerNode([
            new PlainTextNode("Well, I don't "),
            new LinkNode([
              new PlainTextNode('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new LinkNode([
          new PlainTextNode(' Good!')
        ], 'https://example.com/really-good'),
      ]))
  })
})


describe('A NSFW convention nested within a NSFL convention (closing at the same time), both of which overlap a link', () => {
  it('splits the link node', () => {
    expect(Up.toAst("[NSFL: I know. [NSFW: Well, I don't {really.]] Good!}(example.com/really-good)")).to.be.eql(
      insideDocumentAndParagraph([
        new NsflNode([
          new PlainTextNode('I know. '),
          new NsfwNode([
            new PlainTextNode("Well, I don't "),
            new LinkNode([
              new PlainTextNode('really.')
            ], 'https://example.com/really-good')
          ]),
        ]),
        new LinkNode([
          new PlainTextNode(' Good!')
        ], 'https://example.com/really-good'),
      ]))
  })
})


describe('Overlapped doubly emphasized text (closing at the different times) and revision deletion', () => {
  it('splits the stress node, with 1 part inside both emphasis nodes), 1 part only enclosing up to the end of the outer emphasis, and 1 part following both emphasis nodes', () => {
    expect(Up.toAst("*I know. *Well, I don't ~~really.* So there.* Ha!~~")).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('I know. '),
          new EmphasisNode([
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
      ]))
  })
})


describe('Overlapped revision deletion and doubly emphasized text (opening at the same time)', () => {
  it('splits the emphasis nodes', () => {
    expect(Up.toAst("~~I need to sleep. **So~~ what?* It's early.*")).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionDeletionNode([
          new PlainTextNode("I need to sleep. "),
          new EmphasisNode([
            new EmphasisNode([
              new PlainTextNode("So"),
            ])
          ])
        ]),
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode(" what?"),
          ]),
          new PlainTextNode(" It's early.")
        ]),
      ]))
  })
})


describe('Overlapped revision deletion and doubly emphasized text (opening at different times)', () => {
  it('splits the emphasis nodes', () => {
    expect(Up.toAst("~~I need to sleep. *Uhhh... *So~~ what?* It's early.*")).to.be.eql(
      insideDocumentAndParagraph([
        new RevisionDeletionNode([
          new PlainTextNode("I need to sleep. "),
          new EmphasisNode([
            new PlainTextNode("Uhhh... "),
            new EmphasisNode([
              new PlainTextNode("So"),
            ])
          ])
        ]),
        new EmphasisNode([
          new EmphasisNode([
            new PlainTextNode(" what?"),
          ]),
          new PlainTextNode(" It's early.")
        ]),
      ]))
  })
})
