import { expect } from 'chai'
import Up = require('../../../index')
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Emphasis } from '../../../SyntaxNodes/Emphasis'
import { Stress } from '../../../SyntaxNodes/Stress'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Inside of emphasized text, text that is stressed/again-emphasized at the same time', () => {
  it('can have its stress convention closed first', () => {
    expect(Up.parse('*Please ***stop** eating the cardboard* immediately*')).to.deep.equal(
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

  it('can have its inner mphasis convention closed first', () => {
    expect(Up.parse('*Please ***stop* eating the cardboard** immediately*')).to.deep.equal(
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

  it('can have the 2 emphasis conventions closed before the stress convention', () => {
    expect(Up.parse('*Please ***stop* eating the cardboard* immediately**')).to.deep.equal(
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


describe('An inflection start delimiter consisting of 3 asterisks', () => {
  it('can be closed by a single asterisk if no other subsequent asterisks close it, resulting in emphasized text and no stray asterisks in the document', () => {
    expect(Up.parse('A ***bread* to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Emphasis([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })

  it('can be closed by double asterisks if no other subsequent asterisks close it, resulting in stressed text and no stray asterisks in the document', () => {
    expect(Up.parse('A ***bread** to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Stress([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('An inflection start delimiter consisting of 1 asterisk', () => {
  it('can be closed by 3+ asterisks, producing an emphasis node (if there are no other asterisks to close) and no stray asterisks in the document', () => {
    expect(Up.parse('A *bread*** to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Emphasis([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('An inflection start delimiter consisting of 2 asterisks', () => {
  it('can be closed by 3+ asterisks, producing an emphasis node (if there are no other asterisks to close) and no stray asterisks in the document', () => {
    expect(Up.parse('A **bread*** to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Stress([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('Inside of stressed text, text that is emphasized/again-stressed at the same time', () => {
  it('can have its inner stress convention closed first', () => {
    expect(Up.parse('**Please ***stop** eating the cardboard* immediately**')).to.deep.equal(
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

  it('can have its emphasis convention closed first', () => {
    expect(Up.parse('**Please ***stop* eating the cardboard** immediately**')).to.deep.equal(
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

  it('can have both the stress conventions closed before the emphasis node', () => {
    expect(Up.parse('**Please ***stop** eating the cardboard** immediately*')).to.deep.equal(
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


describe('Inside of stressed text, emphasized/stressed text with its stress convention closed first', () => {
  it('can have the reamining emphasis convention and stress convention closed by 3 or more asterisks', () => {
    expect(Up.parse('**Please ***stop** eating the cardboard immediately***')).to.deep.equal(
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


describe('Inside of stressed text, emphasized/stressed text with its emphasis convention closed first', () => {
  it('can have the reamining 2 stress conventions closed by 4 or more asterisks', () => {
    expect(Up.parse('**Please ***stop* eating the cardboard immediately****')).to.deep.equal(
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


describe('Inside of emphasized text, emphasized/stressed text with its stress convention closed first', () => {
  it('can have the reamining two emphasis convention closed by 3 or more asterisks', () => {
    expect(Up.parse('*Please ***stop** eating the cardboard immediately***')).to.deep.equal(
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


describe('Inside of emphasized text, emphasized/stressed text with its inner emphasis convention closed first', () => {
  it('can have the reamining stress convention and emphasis convention closed by 3 or more asterisks', () => {
    expect(Up.parse('*Please ***stop* eating the cardboard immediately***')).to.deep.equal(
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
    expect(Up.parse('I believe ***** will win the primary in ***** easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe ***** will win the primary in ***** easily.')
      ]))
  })
})


describe('An inflection start delimiter consisting of 4+ asterisks, with an emphasis convention ended first, subsequently ending in 3+ additional asterisks', () => {
  it('produces an emphasis node nested within stress and emphasis nodes', () => {
    expect(Up.parse('Well, ****Xamarin* is now free***!')).to.deep.equal(
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


describe('An inflection start delimiter consisting of 4+ asterisks, with a stress convention ended first, subsequently ending in 3 additional asterisks', () => {
  it('produces nested stress nodes', () => {
    expect(Up.parse('Well, ****Xamarin** is now free***!')).to.deep.equal(
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


describe('An inflection start delimiter consisting of 5+ asterisks, with an emphasis convention ended first, subsequently ending in 3+ additional asterisks', () => {
  it('produces a stress node nested within stress and emphasis nodes', () => {
    expect(Up.parse('Well, *****Xamarin** is now free***!')).to.deep.equal(
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


describe('Text that is emphasized/stressed at the same time', () => {
  it('can have its emphasis convention closed first and be followed by stressed text', () => {
    expect(Up.parse('***Nimble* navigators?** **Tropical.**')).to.deep.equal(
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

  it('can have its emphasis convention closed first and be followed by emphasized text', () => {
    expect(Up.parse('***Nimble* navigators?** *Tropical.*')).to.deep.equal(
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

  it('can have its stress convention closed first and be followed by stressed text', () => {
    expect(Up.parse('***Nimble** navigators?* **Tropical.**')).to.deep.equal(
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

  it('can have its stress convention closed first and be followed by emphasized text', () => {
    expect(Up.parse('***Nimble** navigators?* *Tropical.*')).to.deep.equal(
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
