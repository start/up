import { expect } from 'chai'
import * as Up from '../../Up'
import { insideDocumentAndParagraph } from './Helpers'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Text surrounded by 3 underscores', () => {
  it('is italicized and bolded', () => {
    expect(Up.parse('Xamarin is now ___free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is now '),
        new Up.Bold([
          new Up.Italic([
            new Up.Text('free'),
          ])
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text that is italicized/bolded at the same time', () => {
  it('can be surrounded by more than 3 underscores', () => {
    expect(Up.parse('Koopas! ______Mario is on his way!______ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Koopas! '),
        new Up.Bold([
          new Up.Italic([
            new Up.Text('Mario is on his way!'),
          ])
        ]),
        new Up.Text(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of underscores, as long as there are at least 3', () => {
    expect(Up.parse('Koopas! ______Mario is on his way!_________ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Koopas! '),
        new Up.Bold([
          new Up.Italic([
            new Up.Text('Mario is on his way!'),
          ])
        ]),
        new Up.Text(' Grab your shells!')
      ]))
  })

  it('can have its italics convention closed first (and thus opened second), with the remaining text being bolded', () => {
    expect(Up.parse('Hello, ___my_ world__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Bold([
          new Up.Italic([
            new Up.Text('my'),
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })

  it('can have its italics convention closed first (and thus opened second), with the remaining text being italicized', () => {
    expect(Up.parse('Hello, ___my__ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Hello, '),
        new Up.Italic([
          new Up.Bold([
            new Up.Text('my'),
          ]),
          new Up.Text(' world')
        ]),
        new Up.Text('!')
      ]))
  })
})


context("You can italicize/bold text at the same time when you're already within", () => {
  specify('an italics convention', () => {
    expect(Up.parse('_Please ___stop eating the cardboard___ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop eating the cardboard'),
            ])
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })

  specify('a bold convention', () => {
    expect(Up.parse('__Please ___stop eating the cardboard___ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop eating the cardboard'),
            ])
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })
})


context('A start delimiter consisting of 3 underscores with its italics ended first', () => {
  it('can have its bold convention closed with 3 underscores', () => {
    expect(Up.parse('Well, ___Xamarin_ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Bold([
          new Up.Italic([
            new Up.Text('Xamarin')
          ]),
          new Up.Text(' is now free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('A start delimiter consisting of 3 underscores with its bold ended first', () => {
  it('can have its italics convention closed with 3 underscores', () => {
    expect(Up.parse('Well, ___Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Italic([
          new Up.Bold([
            new Up.Text('Xamarin')
          ]),
          new Up.Text(' is now free')
        ]),
        new Up.Text('!')
      ]))
  })
})


context('Text that is bolded then italicized can have both conventions closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.parse('Xamarin is __now _free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is '),
        new Up.Bold([
          new Up.Text('now '),
          new Up.Italic([
            new Up.Text('free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('Xamarin is __now _free____!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Xamarin is '),
        new Up.Bold([
          new Up.Text('now '),
          new Up.Italic([
            new Up.Text('free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })
})


context('Text that is italicized then bolded can have both conventions closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.parse('_He has won __six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has won '),
          new Up.Bold([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('_He has won __six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has won '),
          new Up.Bold([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly italicized text can be closed together by', () => {
  specify('2 underscores', () => {
    expect(Up.parse('_He has won _six in a row!__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has won '),
          new Up.Italic([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('3 underscores', () => {
    expect(Up.parse('_He has won _six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has won '),
          new Up.Italic([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('_He has won _six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has won '),
          new Up.Italic([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly bolded text can be closed together by', () => {
  specify('4 underscores', () => {
    expect(Up.parse('__He has won __six in a row!____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('He has won '),
          new Up.Bold([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })

  specify('5 or more underscores', () => {
    expect(Up.parse('__He has won __six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('He has won '),
          new Up.Bold([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two start delimiters, both consisting of 2 underscores,', () => {
  it('can be closed by 3 underscores, bolding the inner text and italicizing the outer text', () => {
    expect(Up.parse('__He has won __six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has won '),
          new Up.Bold([
            new Up.Text('six in a row!')
          ])
        ])
      ]))
  })
})


context('Triply italicized text can be closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.parse('_He has _won _six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has '),
          new Up.Italic([
            new Up.Text('won '),
            new Up.Italic([
              new Up.Text('six in a row!')
            ])
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('_He has _won _six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('He has '),
          new Up.Italic([
            new Up.Text('won '),
            new Up.Italic([
              new Up.Text('six in a row!')
            ])
          ])
        ])
      ]))
  })
})


describe('Quadruple underscores followed by 4 separate single closing underscores', () => {
  it('produces 4 nested italics nodes', () => {
    expect(Up.parse('____Warning:_ never_ feed_ this tarantula_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Italic([
            new Up.Italic([
              new Up.Italic([
                new Up.Text('Warning:'),
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
