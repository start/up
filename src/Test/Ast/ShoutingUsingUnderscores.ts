import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { ItalicNode } from '../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../SyntaxNodes/BoldNode'


describe('Text surrounded by 3 underscores', () => {
  it('is shouted, and produces a bold node containing an italic node containing the text', () => {
    expect(Up.toAst('Xamarin is now ___free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('free'),
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text', () => {
  it('can be surrounded by more than 3 underscores', () => {
    expect(Up.toAst('Koopas! ______Mario is on his way!______ Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('Mario is on his way!'),
          ])
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of underscores, as long as there are at least 3', () => {
    expect(Up.toAst('Koopas! ______Mario is on his way!_________ Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('Mario is on his way!'),
          ])
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })

  it('can have its italic node ended first (and thus starting second), with the remaining text being bold', () => {
    expect(Up.toAst('Hello, ___my_ world__!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have its italic node ended first (and thus starting second), with the remaining text being italicized', () => {
    expect(Up.toAst('Hello, ___my__ world_!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new ItalicNode([
          new BoldNode([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text inside of italicized text', () => {
  it('produces the typical shouted syntax nodes nested within another italic node', () => {
    expect(Up.toAst('_Please ___stop eating the cardboard___ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop eating the cardboard'),
            ])
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('Shouted text inside of bold text', () => {
  it('produces the typical shouted syntax nodes nested within another bold node', () => {
    expect(Up.toAst('__Please ___stop eating the cardboard___ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop eating the cardboard'),
            ])
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('Text that is both italicized and bold', () => {
  it('can have both nodes closed with 3 underscores', () => {
    expect(Up.toAst('Xamarin is __now _free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is '),
        new BoldNode([
          new PlainTextNode('now '),
          new ItalicNode([
            new PlainTextNode('free')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have both nodes closed with 4 or more underscores', () => {
    expect(Up.toAst('Xamarin is __now _free____!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is '),
        new BoldNode([
          new PlainTextNode('now '),
          new ItalicNode([
            new PlainTextNode('free')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 3 underscores with its italics ended early', () => {
  it('can have its bold text closed with 3 underscores', () => {
    expect(Up.toAst('Well, ___Xamarin_ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 3 underscores with its bold text ended early', () => {
  it('can have its italics closed with 3 underscores', () => {
    expect(Up.toAst('Well, ___Xamarin__ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new ItalicNode([
          new BoldNode([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text that is italicized then bold', () => {
  it('can be closed by 3 underscores', () => {
    expect(Up.toAst('_He has won __six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has won '),
          new BoldNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toAst('_He has won __six in a row!_____')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has won '),
          new BoldNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Text that is bold then italicized', () => {
  it('can be closed by 3 underscores', () => {
    expect(Up.toAst('__He has won _six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('He has won '),
          new ItalicNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toAst('__He has won _six in a row!_____')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('He has won '),
          new ItalicNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Doubly italicized text', () => {
  it('can be closed by 2 underscores', () => {
    expect(Up.toAst('_He has won _six in a row!__')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has won '),
          new ItalicNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 3 underscores', () => {
    expect(Up.toAst('_He has won _six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has won '),
          new ItalicNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toAst('_He has won _six in a row!_____')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has won '),
          new ItalicNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Doubly bold text', () => {
  it('can be closed by 4 underscores', () => {
    expect(Up.toAst('__He has won __six in a row!____')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('He has won '),
          new BoldNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 5 or more underscores', () => {
    expect(Up.toAst('__He has won __six in a row!_____')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('He has won '),
          new BoldNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two nested inflection conventions, both starting with 2 underscores', () => {
  it('can be closed by 3 underscores, resulting in the inner text being bold and the outer text italicized', () => {
    expect(Up.toAst('__He has won __six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has won '),
          new BoldNode([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Triply italicized text', () => {
  it('can be closed by 3 underscores', () => {
    expect(Up.toAst('_He has _won _six in a row!___')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has '),
          new ItalicNode([
            new PlainTextNode('won '),
            new ItalicNode([
              new PlainTextNode('six in a row!')
            ])
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more underscores', () => {
    expect(Up.toAst('_He has _won _six in a row!_____')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('He has '),
          new ItalicNode([
            new PlainTextNode('won '),
            new ItalicNode([
              new PlainTextNode('six in a row!')
            ])
          ])
        ])
      ]))
  })
})


describe('Quadruple underscores followed by 4 separate single closing underscores', () => {
  it('produces 4 nested italic nodes', () => {
    expect(Up.toAst('____Warning:_ never_ feed_ this tarantula_')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new ItalicNode([
            new ItalicNode([
              new ItalicNode([
                new PlainTextNode('Warning:'),
              ]),
              new PlainTextNode(' never')
            ]),
            new PlainTextNode(' feed')
          ]),
          new PlainTextNode(' this tarantula')
        ])
      ]))
  })
})
