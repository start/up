
import { expect } from 'chai'
import * as Up from '../../index'
import { insideDocumentAndParagraph } from './Helpers'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'



describe('Text surrounded by 3 asterisks', () => {
  it('is shouted, and produces a stress node containing an emphasis node containing the text', () => {
    expect(Up.toAst('Xamarin is now ***free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is now '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('free'),
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Shouted text', () => {
  it('can be surrounded by more than 3 asterisks', () => {
    expect(Up.toAst('Koopas! ******Mario is on his way!****** Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })

  it('can be surrounded by an uneven number of asterisks, as long as there are at least 3', () => {
    expect(Up.toAst('Koopas! ******Mario is on his way!********* Grab your shells!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Koopas! '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Mario is on his way!'),
          ]),
        ]),
        new PlainTextNode(' Grab your shells!')
      ]))
  })

  it('can have its emphasis node ended first (and thus starting second), with the remaining text being stressed', () => {
    expect(Up.toAst('Hello, ***my* world**!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('my'),
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have its emphasis node ended first (and thus starting second), with the remaining text being emphasized', () => {
    expect(Up.toAst('Hello, ***my** world*!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new StressNode([
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
    expect(Up.toAst('*Please ***stop eating the cardboard*** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop eating the cardboard'),
            ]),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('Shouted text inside of stressed text', () => {
  it('produces the typical shouted syntax nodes nested within another stress node', () => {
    expect(Up.toAst('**Please ***stop eating the cardboard*** immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop eating the cardboard'),
            ]),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})

describe('Text that is both emphasized and stressed', () => {
  it('can have both nodes closed with 3 asterisks', () => {
    expect(Up.toAst('Xamarin is **now *free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is '),
        new StressNode([
          new PlainTextNode('now '),
          new EmphasisNode([
            new PlainTextNode('free')
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })

  it('can have both nodes closed with 4 or more asterisks', () => {
    expect(Up.toAst('Xamarin is **now *free****!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Xamarin is '),
        new StressNode([
          new PlainTextNode('now '),
          new EmphasisNode([
            new PlainTextNode('free')
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 3 asterisks with its emphasis ended early', () => {
  it('can have its stress closed with 3 asterisks', () => {
    expect(Up.toAst('Well, ***Xamarin* is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new StressNode([
          new EmphasisNode([
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
    expect(Up.toAst('Well, ***Xamarin** is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new EmphasisNode([
          new StressNode([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Emphasized and stressed text', () => {
  it('can be closed by 3 asterisks', () => {
    expect(Up.toAst('*He has won **six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has won '),
          new StressNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toAst('*He has won **six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has won '),
          new StressNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })
})

describe('Stressed and emphasized text', () => {
  it('can be closed by 3 asterisks', () => {
    expect(Up.toAst('**He has won *six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('He has won '),
          new EmphasisNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toAst('**He has won *six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('He has won '),
          new EmphasisNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })
})

describe('Doubly emphasized text', () => {
  it('can be closed by 2 asterisks', () => {
    expect(Up.toAst('*He has won *six in a row!**')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has won '),
          new EmphasisNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })

  it('can be closed by 3 asterisks', () => {
    expect(Up.toAst('*He has won *six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has won '),
          new EmphasisNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })

  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toAst('*He has won *six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has won '),
          new EmphasisNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })
})

describe('Doubly stressed text', () => {
  it('can be closed by 4 asterisks', () => {
    expect(Up.toAst('**He has won **six in a row!****')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('He has won '),
          new StressNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })

  it('can be closed by 5 or more asterisks', () => {
    expect(Up.toAst('**He has won **six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('He has won '),
          new StressNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })
})

describe('Two nested raised-voice conventions, both starting with 2 asterisks', () => {
  it('can be closed by 3 asterisks, resulting in the inner text being stressed and the outer text emphasized', () => {
    expect(Up.toAst('**He has won **six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has won '),
          new StressNode([
            new PlainTextNode('six in a row!')
          ]),
        ])
      ]))
  })
})

describe('Triply emphasized text', () => {
  it('can be closed by 3 asterisks', () => {
    expect(Up.toAst('*He has *won *six in a row!***')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has '),
          new EmphasisNode([
            new PlainTextNode('won '),
            new EmphasisNode([
              new PlainTextNode('six in a row!')
            ])
          ])
        ])
      ]))
  })
  
  it('can be closed by 4 or more asterisks', () => {
    expect(Up.toAst('*He has *won *six in a row!*****')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('He has '),
          new EmphasisNode([
            new PlainTextNode('won '),
            new EmphasisNode([
              new PlainTextNode('six in a row!')
            ])
          ])
        ])
      ]))
  })
})

describe('Quadruple asterisks followed by 4 separate single closing asterisks', () => {
  it('produces 4 nested emphasis nodes', () => {
    expect(Up.toAst('****Warning:* never* feed* this tarantula*')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new EmphasisNode([
            new EmphasisNode([
              new EmphasisNode([
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
