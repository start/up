import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'


describe('A paragraph with 2 separate instances of overlapped conventions', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.toAst('I *love ~~drinking* whole~~ milk. I *love ~~drinking* whole~~ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new EmphasisNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk. I '),
        new EmphasisNode([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk.')
      ]))
  })
})


describe('A paragraph with 2 (separately!) overlapped links', () => {
  it('produces the correct nodes for each', () => {
    const text = 'I do *not [care* at -> https://en.wikipedia.org/wiki/Carrot] all. I do *not [care* at -> https://en.wikipedia.org/wiki/Carrot] all.'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new EmphasisNode([
          new PlainTextNode('not '),
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care'),
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all. I do '),
        new EmphasisNode([
          new PlainTextNode('not '),
        ]),
        new LinkNode([
          new EmphasisNode([
            new PlainTextNode('care'),
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})


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


describe('Overlapped doubly parenthesized text (closing at the same time) and stress', () => {
  it('splits the stress node, with 1 part inside both parenthesized nodes (up to the first closing parenthesis), 1 part only enclosing the second closing parenthesis, and 1 part following both parenthesized nodes', () => {
    expect(Up.toAst("(I know. (Well, I don't **really.)) Ha!**")).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know. '),
          new ParenthesizedNode([
            new PlainTextNode("(Well, I don't "),
            new StressNode([
              new PlainTextNode('really.)')
            ])
          ]),
          new StressNode([
            new PlainTextNode(')')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped doubly parenthesized text (closing at different times) and stress', () => {
  it('splits the stress node, with 1 part inside both parenthesized nodes (up to first closing parenthesis), 1 part enclosing up to the second closing parenthesis, and 1 part following both parenthesized nodes', () => {
    expect(Up.toAst("(I know. (Well, I don't **really.) So there.) Ha!**")).to.be.eql(
      insideDocumentAndParagraph([
        new ParenthesizedNode([
          new PlainTextNode('(I know. '),
          new ParenthesizedNode([
            new PlainTextNode("(Well, I don't "),
            new StressNode([
              new PlainTextNode('really.)')
            ])
          ]),
          new StressNode([
            new PlainTextNode(' So there.)')
          ])
        ]),
        new StressNode([
          new PlainTextNode(' Ha!')
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at the same time)', () => {
  it('does not split the stress node', () => {
    expect(Up.toAst("**I need to sleep. ((So** what?) It's late.)")).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode("I need to sleep. "),
          new ParenthesizedNode([
            new PlainTextNode('('),
            new ParenthesizedNode([
              new PlainTextNode("(So"),
            ])
          ])
        ]),
        new ParenthesizedNode([
          new ParenthesizedNode([
            new PlainTextNode(" what?)"),
          ]),
          new PlainTextNode(" It's late.)")
        ]),
      ]))
  })
})


describe('Overlapped stress and doubly parenthesized text (opening at different times)', () => {
  it('does not split the stress node', () => {
    expect(Up.toAst("**I need to sleep. (I know. (Well**, I don't really.))")).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode("I need to sleep. "),
          new ParenthesizedNode([
            new PlainTextNode('(I know. '),
            new ParenthesizedNode([
              new PlainTextNode("(Well"),
            ])
          ])
        ]),
        new ParenthesizedNode([
          new ParenthesizedNode([
            new PlainTextNode(", I don't really.)"),
          ]),

          new PlainTextNode(')')
        ]),
      ]))
  })
})