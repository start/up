import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../../../SyntaxNodes/ParenthesizedNode'


describe('Overlapped doubly parenthesized text (closing at the same time) and stress', () => {
  it('splits the stress node, with 1 part inside both parenthesized nodes (enclosing the first closing parenthesis), 1 part only enclosing the second closing parenthesis, and 1 part following both parenthesized nodes', () => {
    expect(Up.toAst("(I know. (Well, I don't **really.)) What?**")).to.be.eql(
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
          new PlainTextNode(' What?')
        ]),
      ]))
  })
})


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