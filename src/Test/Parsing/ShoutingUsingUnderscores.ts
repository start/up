import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'


describe('Text surrounded by 3 underscores', () => {
  it('is shouted, and produces a bold node containing an italic node containing the text', () => {
    expect(Up.toDocument('Xamarin is now ___free___!')).to.be.eql(
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


describe('Shouted text', () => {
  it('can be surrounded by more than 3 underscores', () => {
    expect(Up.toDocument('Koopas! ______Mario is on his way!______ Grab your shells!')).to.be.eql(
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
    expect(Up.toDocument('Koopas! ______Mario is on his way!_________ Grab your shells!')).to.be.eql(
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

  it('can have its italic node ended first (and thus starting second), with the remaining text being bold', () => {
    expect(Up.toDocument('Hello, ___my_ world__!')).to.be.eql(
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

  it('can have its italic node ended first (and thus starting second), with the remaining text being italicized', () => {
    expect(Up.toDocument('Hello, ___my__ world_!')).to.be.eql(
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


describe('Shouted text inside of italicized text', () => {
  it('produces the typical shouted syntax nodes nested within another italic node', () => {
    expect(Up.toDocument('_Please ___stop eating the cardboard___ immediately_')).to.be.eql(
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
})


describe('Shouted text inside of bold text', () => {
  it('produces the typical shouted syntax nodes nested within another bold node', () => {
    expect(Up.toDocument('__Please ___stop eating the cardboard___ immediately__')).to.be.eql(
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


describe('Text that is both italicized and bold', () => {
  it('can have both nodes closed with 3 underscores', () => {
    expect(Up.toDocument('Xamarin is __now _free___!')).to.be.eql(
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

  it('can have both nodes closed with 4 or more underscores', () => {
    expect(Up.toDocument('Xamarin is __now _free____!')).to.be.eql(
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


describe('Shouted text starting with 3 underscores with its italics ended early', () => {
  it('can have its bold text closed with 3 underscores', () => {
    expect(Up.toDocument('Well, ___Xamarin_ is now free___!')).to.be.eql(
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


describe('Shouted text starting with 3 underscores with its bold text ended early', () => {
  it('can have its italics closed with 3 underscores', () => {
    expect(Up.toDocument('Well, ___Xamarin__ is now free___!')).to.be.eql(
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


describe('Text that is italicized then bold', () => {
  it('can be closed by 3 underscores', () => {
    expect(Up.toDocument('_He has won __six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toDocument('_He has won __six in a row!_____')).to.be.eql(
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


describe('Text that is bold then italicized', () => {
  it('can be closed by 3 underscores', () => {
    expect(Up.toDocument('__He has won _six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toDocument('__He has won _six in a row!_____')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Doubly italicized text', () => {
  it('can be closed by 2 underscores', () => {
    expect(Up.toDocument('_He has won _six in a row!__')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 3 underscores', () => {
    expect(Up.toDocument('_He has won _six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('He has won '),
          new Italic([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toDocument('_He has won _six in a row!_____')).to.be.eql(
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


describe('Doubly bold text', () => {
  it('can be closed by 4 underscores', () => {
    expect(Up.toDocument('__He has won __six in a row!____')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('He has won '),
          new Bold([
            new PlainText('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 5 or more underscores', () => {
    expect(Up.toDocument('__He has won __six in a row!_____')).to.be.eql(
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


describe('Two nested inflection conventions, both starting with 2 underscores', () => {
  it('can be closed by 3 underscores, resulting in the inner text being bold and the outer text italicized', () => {
    expect(Up.toDocument('__He has won __six in a row!___')).to.be.eql(
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


describe('Triply italicized text', () => {
  it('can be closed by 3 underscores', () => {
    expect(Up.toDocument('_He has _won _six in a row!___')).to.be.eql(
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

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toDocument('_He has _won _six in a row!_____')).to.be.eql(
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
    expect(Up.toDocument('____Warning:_ never_ feed_ this tarantula_')).to.be.eql(
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
