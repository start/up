import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


describe('A paragraph with 2 separate instances of overlapped conventions with equal continuity priority', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.parse('I *love [highlight: drinking* whole] milk. I *love [highlight: drinking* whole] milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I '),
        new Up.Emphasis([
          new Up.PlainText('love '),
          new Up.Highlight([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk. I '),
        new Up.Emphasis([
          new Up.PlainText('love '),
          new Up.Highlight([
            new Up.PlainText('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.PlainText(' whole')
        ]),
        new Up.PlainText(' milk.')
      ]))
  })
})


describe('A paragraph with 2 (separately!) overlapped links', () => {
  it('produces the correct nodes for each', () => {
    const markup = 'I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all. I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I do '),
        new Up.Emphasis([
          new Up.PlainText('not '),
        ]),
        new Up.Link([
          new Up.Emphasis([
            new Up.PlainText('care'),
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all. I do '),
        new Up.Emphasis([
          new Up.PlainText('not '),
        ]),
        new Up.Link([
          new Up.Emphasis([
            new Up.PlainText('care'),
          ]),
          new Up.PlainText(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.PlainText(' all.')
      ]))
  })
})
