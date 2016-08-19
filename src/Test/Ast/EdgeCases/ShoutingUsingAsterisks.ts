
import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'


describe('Shouted text', () => {
  it('can have its emphasis node closed first even when followed by stressed text', () => {
    expect(Up.toDocument('***Nimble* navigators?** **Tropical.**')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new Emphasis([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Stress([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its emphasis node closed first even when followed by emphasized text', () => {
    expect(Up.toDocument('***Nimble* navigators?** *Tropical.*')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new Emphasis([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Emphasis([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its stress node closed first even when followed by stressed text', () => {
    expect(Up.toDocument('***Nimble** navigators?* **Tropical.**')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new Stress([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Stress([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its stress node closed first even when followed by emphasized text', () => {
    expect(Up.toDocument('***Nimble** navigators?* *Tropical.*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new Stress([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Emphasis([
          new PlainText('Tropical.')
        ])
      ]))
  })
})


describe('Shouted text inside of emphasized text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.toDocument('*Please ***stop** eating the cardboard* immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Please '),
          new Emphasis([
            new Stress([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have its emphasis node closed early', () => {
    expect(Up.toDocument('*Please ***stop* eating the cardboard** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have both the emphasis nodes closed before the stress node', () => {
    expect(Up.toDocument('*Please ***stop* eating the cardboard* immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
        ]),
        new Stress([
          new PlainText(' immediately')
        ])
      ]))
  })
})


describe('An inflection convention starting with 3 asterisks', () => {
  it('can be closed by a single asterisk if no other subsequent asterisks close it, resulting in emphasized text and no stray asterisks in the document', () => {
    expect(Up.toDocument('A ***bread* to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Emphasis([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('An inflection convention starting with 3 asterisks', () => {
  it('can be closed by double asterisks if no other subsequent asterisks close it, resulting in stressed text and no stray asterisks in the document', () => {
    expect(Up.toDocument('A ***bread** to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Stress([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('A single starting asterisk', () => {
  it('can be closed by 3+ asterisks, producing an emphasis node (if there are no other asterisks to close) and no stray asterisks in the document', () => {
    expect(Up.toDocument('A *bread*** to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Emphasis([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('Double starting asterisks', () => {
  it('can be closed by 3+ asterisks, producing an emphasis node (if there are no other asterisks to close) and no stray asterisks in the document', () => {
    expect(Up.toDocument('A **bread*** to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Stress([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('Shouted text inside of stressed text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.toDocument('**Please ***stop** eating the cardboard* immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('Please '),
          new Emphasis([
            new Stress([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have its emphasis node closed early', () => {
    expect(Up.toDocument('**Please ***stop* eating the cardboard** immediately**')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard')
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have both the stress nodes closed before the emphasis node', () => {
    expect(Up.toDocument('**Please ***stop** eating the cardboard** immediately*')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('Please '),
          new Emphasis([
            new Stress([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
        ]),
        new Emphasis([
          new PlainText(' immediately')
        ])
      ]))
  })
})


describe('Inside of stressed text, shouted text with its inner stress node closed early', () => {
  it('can have the reamining emphasis node and stress node closed by 3 or more asterisks', () => {
    expect(Up.toDocument('**Please ***stop** eating the cardboard immediately***')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('Please '),
          new Emphasis([
            new Stress([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of stressed text, shouted text with its inner emphasis node closed early', () => {
  it('can have the reamining two stress nodes closed by 4 or more asterisks', () => {
    expect(Up.toDocument('**Please ***stop* eating the cardboard immediately****')).to.be.eql(
      insideDocumentAndParagraph([
        new Stress([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner stress node closed early', () => {
  it('can have the reamining two emphasis nodes closed by 3 or more asterisks', () => {
    expect(Up.toDocument('*Please ***stop** eating the cardboard immediately***')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Please '),
          new Emphasis([
            new Stress([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner emphasis node closed early', () => {
  it('can have the reamining stress node and emphasis node closed by 3 or more asterisks', () => {
    expect(Up.toDocument('*Please ***stop* eating the cardboard immediately***')).to.be.eql(
      insideDocumentAndParagraph([
        new Emphasis([
          new PlainText('Please '),
          new Stress([
            new Emphasis([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Matching clusters of 3+ asterisks each surrounded by whitespce', () => {
  it('are preserved as plain text', () => {
    expect(Up.toDocument('I believe ***** will win the primary in ***** easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I believe ***** will win the primary in ***** easily.')
      ]))
  })
})


describe('Shouted text starting with 4+ asterisks, with an emphasis convention ended early, subsequently ending in 3+ additional asterisks', () => {
  it('produces an emphasis node nested within stress and emphasis nodes', () => {
    expect(Up.toDocument('Well, ****Xamarin* is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Stress([
          new Emphasis([
            new Emphasis([
              new PlainText('Xamarin')
            ]),
            new PlainText(' is now free')
          ]),
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Shouted text starting with 4 asterisks, with a stress convention ended early, subsequently ending in 3 additional asterisks', () => {
  it('produces nested stress nodes', () => {
    expect(Up.toDocument('Well, ****Xamarin** is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Stress([
          new Stress([
            new PlainText('Xamarin')
          ]),
          new PlainText(' is now free')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Shouted text starting with 5+ asterisks, with an emphasis convention ended early, subsequently ending in 3+ additional asterisks', () => {
  it('produces a stress node nested within stress and emphasis nodes', () => {
    expect(Up.toDocument('Well, *****Xamarin** is now free***!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Stress([
          new Emphasis([
            new Stress([
              new PlainText('Xamarin')
            ]),
            new PlainText(' is now free')
          ]),
        ]),
        new PlainText('!')
      ]))
  })
})
