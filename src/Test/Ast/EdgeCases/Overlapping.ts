import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'


describe('A paragraph with 2 separate instances of overlapped conventions', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.toDocument('I *love ~~drinking* whole~~ milk. I *love ~~drinking* whole~~ milk.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I '),
        new Emphasis([
          new PlainTextNode('love '),
          new RevisionDeletionNode([
            new PlainTextNode('drinking')
          ])
        ]),
        new RevisionDeletionNode([
          new PlainTextNode(' whole')
        ]),
        new PlainTextNode(' milk. I '),
        new Emphasis([
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
    const markup = 'I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all. I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.'

    expect(Up.toDocument(markup)).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I do '),
        new Emphasis([
          new PlainTextNode('not '),
        ]),
        new LinkNode([
          new Emphasis([
            new PlainTextNode('care'),
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all. I do '),
        new Emphasis([
          new PlainTextNode('not '),
        ]),
        new LinkNode([
          new Emphasis([
            new PlainTextNode('care'),
          ]),
          new PlainTextNode(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainTextNode(' all.')
      ]))
  })
})
