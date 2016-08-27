import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Text surrounded by 3 asterisks', () => {
  it('is emphasized and stressed', () => {
    expect(Up.toDocument('Xamarin is now ***free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is now '),
        new Stress([
          new Emphasis([
            new PlainText('free'),
          ])
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Text that is emphasized/stressed at the same time', () => {
  it('can be surrounded by more than 3 asterisks', () => {
    expect(Up.toDocument('Koopas! ******Mario is on his way!****** Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Koopas! '),
        new Stress([
          new Emphasis([
            new PlainText('Mario is on his way!'),
          ])
        ]),
        new PlainText(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of asterisks, as long as there are at least 3', () => {
    expect(Up.toDocument('Koopas! ******Mario is on his way!********* Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Koopas! '),
        new Stress([
          new Emphasis([
            new PlainText('Mario is on his way!'),
          ])
        ]),
        new PlainText(' Grab your shells!')
      ]))
  })

  it('can have its emphasis convention closed first (and thus opened second), with the remaining text being stressed', () => {
    expect(Up.toDocument('Hello, ***my* world**!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Stress([
          new Emphasis([
            new PlainText('my'),
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can have its emphasis convention closed first (and thus opened second), with the remaining text being emphasized', () => {
    expect(Up.toDocument('Hello, ***my** world*!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Emphasis([
          new Stress([
            new PlainText('my'),
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })
})


context("You can emphasize/stress text at the same time when you're already within", () => {
  specify('an emphasis convention', () => {
    expect(Up.toDocument('*Please ***stop eating the cardboard*** immediately*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop eating the cardboard'),
            ])
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  specify('a stress convention', () => {
    expect(Up.toDocument('**Please ***stop eating the cardboard*** immediately**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop eating the cardboard'),
            ])
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })
})


context('An inflection start delimiter consisting of 3 asterisks with its emphasis ended first', () => {
  it('can have its stress closed with 3 asterisks', () => {
    expect(Up.toDocument('Well, ***Xamarin* is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Stress([
          new Emphasis([
            new PlainText('Xamarin')
          ]),
          new PlainText(' is now free')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 3 asterisks with its stress ended first', () => {
  it('can have its emphasis closed with 3 asterisks', () => {
    expect(Up.toDocument('Well, ***Xamarin** is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Emphasis([
          new Stress([
            new PlainText('Xamarin')
          ]),
          new PlainText(' is now free')
        ]),
        new PlainText('!')
      ]))
  })
})


context('Text that is stressed then emphasized can have both conventions closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.toDocument('Xamarin is **now *free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is '),
        new Stress([
          new PlainText('now '),
          new Emphasis([
            new PlainText('free')
          ])
        ]),
        new PlainText('!')
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.toDocument('Xamarin is **now *free****!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is '),
        new Stress([
          new PlainText('now '),
          new Emphasis([
            new PlainText('free')
          ])
        ]),
        new PlainText('!')
      ]))
  })
})


context('Text that is emphasized then stressed can have both conventions closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.toDocument('*He has won **six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has won '),
          new Stress([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.toDocument('*He has won **six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has won '),
          new Stress([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly emphasized text can be closed together by', () => {
  specify('2 asterisks', () => {
    expect(Up.toDocument('*He has won *six in a row!**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has won '),
          new Emphasis([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('3 asterisks', () => {
    expect(Up.toDocument('*He has won *six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has won '),
          new Emphasis([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.toDocument('*He has won *six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has won '),
          new Emphasis([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly stressed text can be closed together by', () => {
  specify('4 asterisks', () => {
    expect(Up.toDocument('**He has won **six in a row!****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('He has won '),
          new Stress([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('5 or more asterisks', () => {
    expect(Up.toDocument('**He has won **six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('He has won '),
          new Stress([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two inflection start delimiters, both consisting of 2 asterisks,', () => {
  it('can be closed by 3 asterisks, stressing the inner text and emphasizing the outer text', () => {
    expect(Up.toDocument('**He has won **six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has won '),
          new Stress([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


context('Triply emphasized text can be closed together by', () => {
  specify('3 asterisks', () => {
    expect(Up.toDocument('*He has *won *six in a row!***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has '),
          new Emphasis([
            new PlainText('won '),
            new Emphasis([
              new PlainText('six in a row!')
            ])
          ])
        ])
      ]))
  })

  specify('4 or more asterisks', () => {
    expect(Up.toDocument('*He has *won *six in a row!*****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('He has '),
          new Emphasis([
            new PlainText('won '),
            new Emphasis([
              new PlainText('six in a row!')
            ])
          ])
        ])
      ]))
  })
})


describe('Quadruple asterisks followed by 4 separate single closing asterisks', () => {
  it('produces 4 nested emphasis nodes', () => {
    expect(Up.toDocument('****Warning:* never* feed* this tarantula*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Emphasis([
          new Emphasis([
            new Emphasis([
              new Emphasis([
                new PlainText('Warning:'),
              ]),
              new PlainText(' never')
            ]),
            new PlainText(' feed')
          ]),
          new PlainText(' this tarantula')
        ])
      ]))
  })
})
