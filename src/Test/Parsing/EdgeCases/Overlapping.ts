import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { RevisionDeletion } from '../../../SyntaxNodes/RevisionDeletion'


describe('A paragraph with 2 separate instances of overlapped conventions', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.toDocument('I *love ~~drinking* whole~~ milk. I *love ~~drinking* whole~~ milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new RevisionDeletion([
            new PlainText('drinking')
          ])
        ]),
        new RevisionDeletion([
          new PlainText(' whole')
        ]),
        new PlainText(' milk. I '),
        new Emphasis([
          new PlainText('love '),
          new RevisionDeletion([
            new PlainText('drinking')
          ])
        ]),
        new RevisionDeletion([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('A paragraph with 2 (separately!) overlapped links', () => {
  it('produces the correct nodes for each', () => {
    const markup = 'I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all. I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.'

    expect(Up.toDocument(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I do '),
        new Emphasis([
          new PlainText('not '),
        ]),
        new Link([
          new Emphasis([
            new PlainText('care'),
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all. I do '),
        new Emphasis([
          new PlainText('not '),
        ]),
        new Link([
          new Emphasis([
            new PlainText('care'),
          ]),
          new PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new PlainText(' all.')
      ]))
  })
})
