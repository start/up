import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Text surrounded by 3 underscores', () => {
  it('is italicized and bolded', () => {
    expect(Up.toDocument('Xamarin is now ___free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is now '),
        new Bold([
          new Italic([
            new PlainText('free'),
          ])
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Text that is italicized/bolded at the same time', () => {
  it('can be surrounded by more than 3 underscores', () => {
    expect(Up.toDocument('Koopas! ______Mario is on his way!______ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Koopas! '),
        new Bold([
          new Italic([
            new PlainText('Mario is on his way!'),
          ])
        ]),
        new PlainText(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of underscores, as long as there are at least 3', () => {
    expect(Up.toDocument('Koopas! ______Mario is on his way!_________ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Koopas! '),
        new Bold([
          new Italic([
            new PlainText('Mario is on his way!'),
          ])
        ]),
        new PlainText(' Grab your shells!')
      ]))
  })

  it('can have its italic convention closed first (and thus opened second), with the remaining text being bolded', () => {
    expect(Up.toDocument('Hello, ___my_ world__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Bold([
          new Italic([
            new PlainText('my'),
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })

  it('can have its italic convention closed first (and thus opened second), with the remaining text being italicized', () => {
    expect(Up.toDocument('Hello, ___my__ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Hello, '),
        new Italic([
          new Bold([
            new PlainText('my'),
          ]),
          new PlainText(' world')
        ]),
        new PlainText('!')
      ]))
  })
})


context("You can italicize/bold text at the same time when you're already within", () => {
  specify('an italic convention', () => {
    expect(Up.toDocument('_Please ___stop eating the cardboard___ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop eating the cardboard'),
            ])
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  specify('a bold convention', () => {
    expect(Up.toDocument('__Please ___stop eating the cardboard___ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop eating the cardboard'),
            ])
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })
})


context('An inflection start delimiter consisting of 3 underscores with its italic ended first', () => {
  it('can have its bold convention closed with 3 underscores', () => {
    expect(Up.toDocument('Well, ___Xamarin_ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Bold([
          new Italic([
            new PlainText('Xamarin')
          ]),
          new PlainText(' is now free')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 3 underscores with its bold ended first', () => {
  it('can have its italic convention closed with 3 underscores', () => {
    expect(Up.toDocument('Well, ___Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Italic([
          new Bold([
            new PlainText('Xamarin')
          ]),
          new PlainText(' is now free')
        ]),
        new PlainText('!')
      ]))
  })
})


context('Text that is bolded then italicized can have both conventions closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.toDocument('Xamarin is __now _free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is '),
        new Bold([
          new PlainText('now '),
          new Italic([
            new PlainText('free')
          ])
        ]),
        new PlainText('!')
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.toDocument('Xamarin is __now _free____!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Xamarin is '),
        new Bold([
          new PlainText('now '),
          new Italic([
            new PlainText('free')
          ])
        ]),
        new PlainText('!')
      ]))
  })
})


context('Text that is italicized then bolded can have both conventions closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.toDocument('_He has won __six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.toDocument('_He has won __six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly italicized text can be closed together by', () => {
  specify('2 underscores', () => {
    expect(Up.toDocument('_He has won _six in a row!__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('3 underscores', () => {
    expect(Up.toDocument('_He has won _six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.toDocument('_He has won _six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


context('Doubly bolded text can be closed together by', () => {
  specify('4 underscores', () => {
    expect(Up.toDocument('__He has won __six in a row!____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('5 or more underscores', () => {
    expect(Up.toDocument('__He has won __six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two inflection start delimiters, both consisting of 2 underscores,', () => {
  it('can be closed by 3 underscores, bolding the inner text and italicizing the outer text', () => {
    expect(Up.toDocument('__He has won __six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


context('Triply italicized text can be closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.toDocument('_He has _won _six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has '),
          new Italic([
            new PlainText('won '),
            new Italic([
              new PlainText('six in a row!')
            ])
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.toDocument('_He has _won _six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has '),
          new Italic([
            new PlainText('won '),
            new Italic([
              new PlainText('six in a row!')
            ])
          ])
        ])
      ]))
  })
})


describe('Quadruple underscores followed by 4 separate single closing underscores', () => {
  it('produces 4 nested italic nodes', () => {
    expect(Up.toDocument('____Warning:_ never_ feed_ this tarantula_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new Italic([
            new Italic([
              new Italic([
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
