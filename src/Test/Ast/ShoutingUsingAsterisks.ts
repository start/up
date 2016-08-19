import { expect } from 'chai'
import Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { Stress } from '../../SyntaxNodes/Stress'


describe('Text surrounded by 3 asterisks', () => {
  it('is shouted, and produces a stress node containing an emphasis node containing the text', () => {
    expect(Up.toDocument('Xamarin is now ***free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new Stress([
          new Emphasis([
            new PlainTextNode('free'),
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text', () => {
  it('can be surrounded by more than 3 asterisks', () => {
    expect(Up.toDocument('Koopas! ******Mario is on his way!****** Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new Stress([
          new Emphasis([
            new PlainTextNode('Mario is on his way!'),
          ])
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of asterisks, as long as there are at least 3', () => {
    expect(Up.toDocument('Koopas! ******Mario is on his way!********* Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new Stress([
          new Emphasis([
            new PlainTextNode('Mario is on his way!'),
          ])
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })

  it('can have its emphasis node ended first (and thus starting second), with the remaining text being stressed', () => {
    expect(Up.toDocument('Hello, ***my* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Stress([
          new Emphasis([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have its emphasis node ended first (and thus starting second), with the remaining text being emphasized', () => {
    expect(Up.toDocument('Hello, ***my** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new Emphasis([
          new Stress([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text inside of emphasized text', () => {
  it('produces the typical shouted syntax nodes nested within another emphasis node', () => {
    expect(Up.toDocument('*Please ***stop eating the cardboard*** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('Please '),
          new Stress([
            new Emphasis([
              new PlainTextNode('stop eating the cardboard'),
            ])
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('Shouted text inside of stressed text', () => {
  it('produces the typical shouted syntax nodes nested within another stress node', () => {
    expect(Up.toDocument('**Please ***stop eating the cardboard*** immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainTextNode('Please '),
          new Stress([
            new Emphasis([
              new PlainTextNode('stop eating the cardboard'),
            ])
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('Text that is both emphasized and stressed', () => {
  it('can have both nodes closed with 3 asterisks', () => {
    expect(Up.toDocument('Xamarin is **now *free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is '),
        new Stress([
          new PlainTextNode('now '),
          new Emphasis([
            new PlainTextNode('free')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have both nodes closed with 4 or more asterisks', () => {
    expect(Up.toDocument('Xamarin is **now *free****!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is '),
        new Stress([
          new PlainTextNode('now '),
          new Emphasis([
            new PlainTextNode('free')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 3 asterisks with its emphasis ended early', () => {
  it('can have its stress closed with 3 asterisks', () => {
    expect(Up.toDocument('Well, ***Xamarin* is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new Stress([
          new Emphasis([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 3 asterisks with its stress ended early', () => {
  it('can have its emphasis closed with 3 asterisks', () => {
    expect(Up.toDocument('Well, ***Xamarin** is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new Emphasis([
          new Stress([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Text that is emphasized then stressed', () => {
  it('can be closed by 3 asterisks', () => {
    expect(Up.toDocument('*He has won **six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has won '),
          new Stress([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toDocument('*He has won **six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has won '),
          new Stress([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Text that is stressed then emphasized', () => {
  it('can be closed by 3 asterisks', () => {
    expect(Up.toDocument('**He has won *six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainTextNode('He has won '),
          new Emphasis([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toDocument('**He has won *six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainTextNode('He has won '),
          new Emphasis([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Doubly emphasized text', () => {
  it('can be closed by 2 asterisks', () => {
    expect(Up.toDocument('*He has won *six in a row!**')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has won '),
          new Emphasis([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 3 asterisks', () => {
    expect(Up.toDocument('*He has won *six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has won '),
          new Emphasis([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toDocument('*He has won *six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has won '),
          new Emphasis([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Doubly stressed text', () => {
  it('can be closed by 4 asterisks', () => {
    expect(Up.toDocument('**He has won **six in a row!****')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainTextNode('He has won '),
          new Stress([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })

  it('can be closed by 5 or more asterisks', () => {
    expect(Up.toDocument('**He has won **six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainTextNode('He has won '),
          new Stress([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Two nested inflection conventions, both starting with 2 asterisks', () => {
  it('can be closed by 3 asterisks, resulting in the inner text being stressed and the outer text emphasized', () => {
    expect(Up.toDocument('**He has won **six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has won '),
          new Stress([
            new PlainTextNode('six in a row!')
          ])
        ])
      ]))
  })
})


describe('Triply emphasized text', () => {
  it('can be closed by 3 asterisks', () => {
    expect(Up.toDocument('*He has *won *six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has '),
          new Emphasis([
            new PlainTextNode('won '),
            new Emphasis([
              new PlainTextNode('six in a row!')
            ])
          ])
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toDocument('*He has *won *six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainTextNode('He has '),
          new Emphasis([
            new PlainTextNode('won '),
            new Emphasis([
              new PlainTextNode('six in a row!')
            ])
          ])
        ])
      ]))
  })
})


describe('Quadruple asterisks followed by 4 separate single closing asterisks', () => {
  it('produces 4 nested emphasis nodes', () => {
    expect(Up.toDocument('****Warning:* never* feed* this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new Emphasis([
            new Emphasis([
              new Emphasis([
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
