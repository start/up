import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'
import { Link } from '../../../SyntaxNodes/Link'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Highlight } from '../../../SyntaxNodes/Highlight'


describe('A paragraph with 2 separate instances of overlapped conventions with equal continuity priority', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.parse('I *love [highlight: drinking* whole] milk. I *love [highlight: drinking* whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I '),
        new Emphasis([
          new PlainText('love '),
          new Highlight([
            new PlainText('drinking')
          ])
        ]),
        new Highlight([
          new PlainText(' whole')
        ]),
        new PlainText(' milk. I '),
        new Emphasis([
          new PlainText('love '),
          new Highlight([
            new PlainText('drinking')
          ])
        ]),
        new Highlight([
          new PlainText(' whole')
        ]),
        new PlainText(' milk.')
      ]))
  })
})


describe('A paragraph with 2 (separately!) overlapped links', () => {
  it('produces the correct nodes for each', () => {
    const markup = 'I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all. I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.'

    expect(Up.parse(markup)).to.deep.equal(
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
