import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
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


describe('A link and a spoiler using the same type of brackets', () => {
  it("can overlap (assuming the link starts first)", () => {
    const text =
      'In Pokémon Red, [Gary Oak [SPOILER: loses to Ash Ketchum -> http://bulbapedia.bulbagarden.net/wiki/Red_(game)] repeatedly] throughout the game.'

    expect(Up.toAst(text)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('In Pokémon Red, '),
        new LinkNode([
          new PlainTextNode('Gary Oak ')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
        new SpoilerNode([
          new LinkNode([
            new PlainTextNode('loses to Ash Ketchum')
          ], 'http://bulbapedia.bulbagarden.net/wiki/Red_(game)'),
          new PlainTextNode(' repeatedly')
        ]),
        new PlainTextNode(' throughout the game.')
      ])
    )
  })
})