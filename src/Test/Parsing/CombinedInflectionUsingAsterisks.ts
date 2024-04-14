import { expect } from 'chai'
import * as Up from '../../Main'
import { insideDocumentAndParagraph } from './Helpers'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Text surrounded by 3 asterisks', () => {
  it('is emphasized and stressed', () => {
    expect(Up.parse('Xamarin is now ***free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Text('free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text that is emphasized/stressed at the same time', () => {
  it('can be surrounded by more than 3 asterisks', () => {
    expect(Up.parse('Koopas! ******Mario is on his way!****** Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Koopas! '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Text('Mario is on his way!')
          ])
        ]),
        new Up.Text(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of asterisks, as long as there are at least 3', () => {
    expect(Up.parse('Koopas! ******Mario is on his way!********* Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Koopas! '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Text('Mario is on his way!')
          ])
        ]),
        new Up.Text(' Grab your shells!')
      ]))
  })

  it('can have its emphasis convention closed first (and thus opened second), with the remaining text being stressed', () => {
    expect(Up.parse('Hello, ***my* world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Text('my')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can have its emphasis convention closed first (and thus opened second), with the remaining text being emphasized', () => {
    expect(Up.parse('Hello, ***my** world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Emphasis([
          new Up.Stress([
            new Up.Text('my')
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })
})


context("You can emphasize/stress text at the same time when you're already within", () => {
  specify('an emphasis convention', () => {
    expect(Up.parse('*Please ***stop eating the cardboard*** immediately*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.Text('stop eating the cardboard')
            ])
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })

  specify('a stress convention', () => {
    expect(Up.parse('**Please ***stop eating the cardboard*** immediately**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.Text('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.Text('stop eating the cardboard')
            ])
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })
})


context('A start delimiter consisting of 3 asterisks with its emphasis ended first', () => {
  it('can have its stress convention closed with 3 asterisks', () => {
    expect(Up.parse('Well, ***Xamarin* is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Text('Xamarin')
          ]),
          new Up.Text(' is now free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('A start delimiter consisting of 3 asterisks with its stress ended first', () => {
  it('can have its emphasis convention closed with 3 asterisks', () => {
    expect(Up.parse('Well, ***Xamarin** is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Emphasis([
          new Up.Stress([
            new Up.Text('Xamarin')
          ]),
          new Up.Text(' is now free')
        ]),
        new Up.Text('!')
      ]))
  })
})


context('Text that is stressed then emphasized can have both conventions closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.parse('Xamarin is **now *free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is '),
        new Up.Stress([
          new Up.Text('now '),
          new Up.Emphasis([
            new Up.Text('free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('Xamarin is **now *free****!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is '),
        new Up.Stress([
          new Up.Text('now '),
          new Up.Emphasis([
            new Up.Text('free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })
})


context('Text that is emphasized then stressed can have both conventions closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.parse('*He has won **six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has won '),
          new Up.Stress([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('*He has won **six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has won '),
          new Up.Stress([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly emphasized text can be closed together by', () => {
  specify('2 asterisks', () => {
    expect(Up.parse('*He has won *six in a row!**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has won '),
          new Up.Emphasis([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('3 asterisks', () => {
    expect(Up.parse('*He has won *six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has won '),
          new Up.Emphasis([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('*He has won *six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has won '),
          new Up.Emphasis([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly stressed text can be closed together by', () => {
  specify('4 asterisks', () => {
    expect(Up.parse('**He has won **six in a row!****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.Text('He has won '),
          new Up.Stress([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('5 or more asterisks', () => {
    expect(Up.parse('**He has won **six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.Text('He has won '),
          new Up.Stress([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two start delimiters, both consisting of 2 asterisks,', () => {
  it('can be closed by 3 asterisks, stressing the inner text and emphasizing the outer text', () => {
    expect(Up.parse('**He has won **six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has won '),
          new Up.Stress([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


context('Triply emphasized text can be closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.parse('*He has *won *six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has '),
          new Up.Emphasis([
            new Up.Text('won '),
            new Up.Emphasis([
              new Up.Text('six in a row!')
            ])
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('*He has *won *six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Text('He has '),
          new Up.Emphasis([
            new Up.Text('won '),
            new Up.Emphasis([
              new Up.Text('six in a row!')
            ])
          ])
        ])
      ]))
  })
})


describe('Quadruple asterisks followed by 4 separate single closing asterisks', () => {
  it('produces 4 nested emphasis nodes', () => {
    expect(Up.parse('****Warning:* never* feed* this tarantula*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.Emphasis([
                new Up.Text('Warning:')
              ]),
              new Up.Text(' never')
            ]),
            new Up.Text(' feed')
          ]),
          new Up.Text(' this tarantula')
        ])
      ]))
  })
})
