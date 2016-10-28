import { expect } from 'chai'
import * as Up from '../../../Up'
import { insideDocumentAndParagraph } from '../Helpers'


describe('A paragraph with 2 separate instances of overlapped conventions with equal continuity priority', () => {
  it('prorduce the correct nodes for each', () => {
    expect(Up.parse('I *love ==drinking* whole== milk. I *love ==drinking* whole== milk.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I '),
        new Up.Emphasis([
          new Up.Text('love '),
          new Up.Highlight([
            new Up.Text('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk. I '),
        new Up.Emphasis([
          new Up.Text('love '),
          new Up.Highlight([
            new Up.Text('drinking')
          ])
        ]),
        new Up.Highlight([
          new Up.Text(' whole')
        ]),
        new Up.Text(' milk.')
      ]))
  })
})


describe('A paragraph with 2 (separately!) overlapped links', () => {
  it('produces the correct nodes for each', () => {
    const markup = 'I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all. I do *not [care* at][https://en.wikipedia.org/wiki/Carrot] all.'

    expect(Up.parse(markup)).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I do '),
        new Up.Emphasis([
          new Up.Text('not '),
        ]),
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('care'),
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all. I do '),
        new Up.Emphasis([
          new Up.Text('not '),
        ]),
        new Up.Link([
          new Up.Emphasis([
            new Up.Text('care'),
          ]),
          new Up.Text(' at'),
        ], 'https://en.wikipedia.org/wiki/Carrot'),
        new Up.Text(' all.')
      ]))
  })
})
