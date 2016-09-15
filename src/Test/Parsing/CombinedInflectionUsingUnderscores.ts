import { expect } from 'chai'
import Up = require('../../index')
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Text surrounded by 3 underscores', () => {
  it('is italicized and bolded', () => {
    expect(Up.parse('Xamarin is now ___free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Xamarin is now '),
        new Up.Bold([
          new Up.Italic([
            new Up.PlainText('free'),
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Text that is italicized/bolded at the same time', () => {
  it('can be surrounded by more than 3 underscores', () => {
    expect(Up.parse('Koopas! ______Mario is on his way!______ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Koopas! '),
        new Up.Bold([
          new Up.Italic([
            new Up.PlainText('Mario is on his way!'),
          ])
        ]),
        new Up.PlainText(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of underscores, as long as there are at least 3', () => {
    expect(Up.parse('Koopas! ______Mario is on his way!_________ Grab your shells!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Koopas! '),
        new Up.Bold([
          new Up.Italic([
            new Up.PlainText('Mario is on his way!'),
          ])
        ]),
        new Up.PlainText(' Grab your shells!')
      ]))
  })

  it('can have its italic convention closed first (and thus opened second), with the remaining text being bolded', () => {
    expect(Up.parse('Hello, ___my_ world__!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Bold([
          new Up.Italic([
            new Up.PlainText('my'),
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })

  it('can have its italic convention closed first (and thus opened second), with the remaining text being italicized', () => {
    expect(Up.parse('Hello, ___my__ world_!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Hello, '),
        new Up.Italic([
          new Up.Bold([
            new Up.PlainText('my'),
          ]),
          new Up.PlainText(' world')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


context("You can italicize/bold text at the same time when you're already within", () => {
  specify('an italic convention', () => {
    expect(Up.parse('_Please ___stop eating the cardboard___ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.PlainText('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.PlainText('stop eating the cardboard'),
            ])
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })

  specify('a bold convention', () => {
    expect(Up.parse('__Please ___stop eating the cardboard___ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.PlainText('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.PlainText('stop eating the cardboard'),
            ])
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })
})


context('An inflection start delimiter consisting of 3 underscores with its italic ended first', () => {
  it('can have its bold convention closed with 3 underscores', () => {
    expect(Up.parse('Well, ___Xamarin_ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Bold([
          new Up.Italic([
            new Up.PlainText('Xamarin')
          ]),
          new Up.PlainText(' is now free')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 3 underscores with its bold ended first', () => {
  it('can have its italic convention closed with 3 underscores', () => {
    expect(Up.parse('Well, ___Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Italic([
          new Up.Bold([
            new Up.PlainText('Xamarin')
          ]),
          new Up.PlainText(' is now free')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


context('Text that is bolded then italicized can have both conventions closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.parse('Xamarin is __now _free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Xamarin is '),
        new Up.Bold([
          new Up.PlainText('now '),
          new Up.Italic([
            new Up.PlainText('free')
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('Xamarin is __now _free____!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Xamarin is '),
        new Up.Bold([
          new Up.PlainText('now '),
          new Up.Italic([
            new Up.PlainText('free')
          ])
        ]),
        new Up.PlainText('!')
      ]))
  })
})


context('Text that is italicized then bolded can have both conventions closed together by', () => {
  specify('3 underscores', () => {
    expect(Up.parse('_He has won __six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.PlainText('He has won '),
          new Up.Bold([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('_He has won __six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.PlainText('He has won '),
          new Up.Bold([
            new Up.PlainText('six in a row!')
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
          new Up.PlainText('He has won '),
          new Up.Italic([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('3 underscores', () => {
    expect(Up.parse('_He has won _six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.PlainText('He has won '),
          new Up.Italic([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('4 or more underscores', () => {
    expect(Up.parse('_He has won _six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.PlainText('He has won '),
          new Up.Italic([
            new Up.PlainText('six in a row!')
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
          new Up.PlainText('He has won '),
          new Up.Bold([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })

  specify('5 or more underscores', () => {
    expect(Up.parse('__He has won __six in a row!_____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.PlainText('He has won '),
          new Up.Bold([
            new Up.PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two inflection start delimiters, both consisting of 2 underscores,', () => {
  it('can be closed by 3 underscores, bolding the inner text and italicizing the outer text', () => {
    expect(Up.parse('__He has won __six in a row!___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
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
    expect(Up.parse('_He has _won _six in a row!___')).to.deep.equal(
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
    expect(Up.parse('_He has _won _six in a row!_____')).to.deep.equal(
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
    expect(Up.parse('____Warning:_ never_ feed_ this tarantula_')).to.deep.equal(
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
