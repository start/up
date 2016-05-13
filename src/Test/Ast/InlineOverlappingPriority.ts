import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'


describe('Overlapped emphasized and linked text', () => {
  it('produce an emphasis node, followed by a link node containing another emphasis node. The link node is unbroken', () => {
    expect(Up.toAst('I do *not [care* at -> https://en.wikipedia.org/wiki/Carrot] all.')).to.be.eql(
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
        new PlainTextNode(' all.')
      ]))
  })
})


describe('Overlapped linked and emphasized text', () => {
  it('produce a link node containing an emphasis node, followed by an empahsis node. The link node is unbroken', () => {
    expect(Up.toAst('This [trash *can -> https://en.wikipedia.org/wiki/Waste_container] not* stay here.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('This '),
        new LinkNode([
          new PlainTextNode('trash '),
          new EmphasisNode([
            new PlainTextNode('can'),
          ]),
        ], 'https://en.wikipedia.org/wiki/Waste_container'),
        new EmphasisNode([
          new PlainTextNode(' not'),
        ]),
        new PlainTextNode(' stay here.')
      ]))
  })
})


describe('A spoiler that overlaps a link', () => {
  it("produce the correct nodes, despite the seemingly terminating closing bracket in the link's contents", () => {
    // TODO: For bracketed conventions, possibly allow different types of brackets
    expect(Up.toAst('[SPOILER: Gary loses to [Ash] Ketchum -> http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum]')).to.be.eql(
      insideDocumentAndParagraph([
        new SpoilerNode([
          new PlainTextNode('Gary loses to '),
        ]),
        new LinkNode([
          new SpoilerNode([
            new PlainTextNode('Ash')
          ]),
          new PlainTextNode(' Ketchum')
        ], 'http://bulbapedia.bulbagarden.net/wiki/Ash_Ketchum')
      ])
    )
  })
})
