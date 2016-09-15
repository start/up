import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Text surrounded by 3 asterisks', () => {
  it('is emphasized and stressed', () => {
    expect(Up.parse('Xamarin is now ***free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Xamarin is now '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('free'),
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Text that is emphasized/stressed at the same time', () => {
  it('can be surrounded by more than 3 asterisks', () => {
    expect(Up.parse('Koopas! ******Mario is on his way!****** Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Koopas! '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('Mario is on his way!'),
          ])
        ]),
        new Up.PlainText(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of asterisks, as long as there are at least 3', () => {
    expect(Up.parse('Koopas! ******Mario is on his way!********* Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Koopas! '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('Mario is on his way!'),
          ])
        ]),
        new Up.PlainText(' Grab your shells!')
      ]))
  })

  it('can have its emphasis convention closed first (and thus opened second), with the remaining text being stressed', () => {
    expect(Up.parse('Hello, ***my* world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('my'),
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can have its emphasis convention closed first (and thus opened second), with the remaining text being emphasized', () => {
    expect(Up.parse('Hello, ***my** world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Emphasis([
          new Up.Stress([
            new Up.PlainText('my'),
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


context("You can emphasize/stress text at the same time when you're already within", () => {
  specify('an emphasis convention', () => {
    expect(Up.parse('*Please ***stop eating the cardboard*** immediately*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop eating the cardboard'),
            ])
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })

  specify('a stress convention', () => {
    expect(Up.parse('**Please ***stop eating the cardboard*** immediately**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop eating the cardboard'),
            ])
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })
})


context('An inflection start delimiter consisting of 3 asterisks with its emphasis ended first', () => {
  it('can have its stress conventionclosed with 3 asterisks', () => {
    expect(Up.parse('Well, ***Xamarin* is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('Xamarin')
          ]),
          new Up.PlainText(' is now free')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 3 asterisks with its stress ended first', () => {
  it('can have its emphasis convention closed with 3 asterisks', () => {
    expect(Up.parse('Well, ***Xamarin** is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Emphasis([
          new Up.Stress([
            new Up.PlainText('Xamarin')
          ]),
          new Up.PlainText(' is now free')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


context('Text that is stressed then emphasized can have both conventions closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.parse('Xamarin is **now *free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Xamarin is '),
        new Up.Stress([
          new Up.PlainText('now '),
          new Up.Emphasis([
            new Up.PlainText('free')
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('Xamarin is **now *free****!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Xamarin is '),
        new Up.Stress([
          new Up.PlainText('now '),
          new Up.Emphasis([
            new Up.PlainText('free')
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })
})


context('Text that is emphasized then stressed can have both conventions closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.parse('*He has won **six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('He has won '),
          new Up.Stress([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('*He has won **six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('He has won '),
          new Up.Stress([
            new Up.PlainText('six in a row!')
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
          new Up.PlainText('He has won '),
          new Up.Emphasis([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('3 asterisks', () => {
    expect(Up.parse('*He has won *six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('He has won '),
          new Up.Emphasis([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('*He has won *six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('He has won '),
          new Up.Emphasis([
            new Up.PlainText('six in a row!')
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
          new Up.PlainText('He has won '),
          new Up.Stress([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('5 or more asterisks', () => {
    expect(Up.parse('**He has won **six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('He has won '),
          new Up.Stress([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two inflection start delimiters, both consisting of 2 asterisks,', () => {
  it('can be closed by 3 asterisks, stressing the inner text and emphasizing the outer text', () => {
    expect(Up.parse('**He has won **six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('He has won '),
          new Up.Stress([
            new Up.PlainText('six in a row!')
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
          new Up.PlainText('He has '),
          new Up.Emphasis([
            new Up.PlainText('won '),
            new Up.Emphasis([
              new Up.PlainText('six in a row!')
            ])
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.parse('*He has *won *six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('He has '),
          new Up.Emphasis([
            new Up.PlainText('won '),
            new Up.Emphasis([
              new Up.PlainText('six in a row!')
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
                new Up.PlainText('Warning:'),
              ]),
              new Up.PlainText(' never')
            ]),
            new Up.PlainText(' feed')
          ]),
          new Up.PlainText(' this tarantula')
        ])
      ]))
  })
})
