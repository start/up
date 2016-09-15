import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Inside of emphasized text, text that is stressed/again-emphasized at the same time', () => {
  it('can have its stress convention closed first', () => {
    expect(Up.parse('*Please ***stop** eating the cardboard* immediately*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('Please '),
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard'),
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })

  it('can have its inner mphasis convention closed first', () => {
    expect(Up.parse('*Please ***stop* eating the cardboard** immediately*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard'),
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })

  it('can have the 2 emphasis conventions closed before the stress convention', () => {
    expect(Up.parse('*Please ***stop* eating the cardboard* immediately**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard'),
          ]),
        ]),
        new Up.Stress([
          new Up.PlainText(' immediately')
        ])
      ]))
  })
})


describe('An inflection start delimiter consisting of 3 asterisks', () => {
  it('can be closed by a single asterisk if no other subsequent asterisks close it, resulting in emphasized text and no stray asterisks in the document', () => {
    expect(Up.parse('A ***bread* to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('A '),
        new Up.Emphasis([
          new Up.PlainText('bread'),
        ]),
        new Up.PlainText(' to believe in')
      ]))
  })

  it('can be closed by double asterisks if no other subsequent asterisks close it, resulting in stressed text and no stray asterisks in the document', () => {
    expect(Up.parse('A ***bread** to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('A '),
        new Up.Stress([
          new Up.PlainText('bread'),
        ]),
        new Up.PlainText(' to believe in')
      ]))
  })
})


describe('An inflection start delimiter consisting of 1 asterisk', () => {
  it('can be closed by 3+ asterisks, producing an emphasis node (if there are no other asterisks to close) and no stray asterisks in the document', () => {
    expect(Up.parse('A *bread*** to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('A '),
        new Up.Emphasis([
          new Up.PlainText('bread'),
        ]),
        new Up.PlainText(' to believe in')
      ]))
  })
})


describe('An inflection start delimiter consisting of 2 asterisks', () => {
  it('can be closed by 3+ asterisks, producing an emphasis node (if there are no other asterisks to close) and no stray asterisks in the document', () => {
    expect(Up.parse('A **bread*** to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('A '),
        new Up.Stress([
          new Up.PlainText('bread'),
        ]),
        new Up.PlainText(' to believe in')
      ]))
  })
})


describe('Inside of stressed text, text that is emphasized/again-stressed at the same time', () => {
  it('can have its inner stress convention closed first', () => {
    expect(Up.parse('**Please ***stop** eating the cardboard* immediately**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('Please '),
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard'),
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })

  it('can have its emphasis convention closed first', () => {
    expect(Up.parse('**Please ***stop* eating the cardboard** immediately**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard')
          ]),
          new Up.PlainText(' immediately')
        ])
      ]))
  })

  it('can have both the stress conventions closed before the emphasis node', () => {
    expect(Up.parse('**Please ***stop** eating the cardboard** immediately*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('Please '),
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard'),
          ]),
        ]),
        new Up.Emphasis([
          new Up.PlainText(' immediately')
        ])
      ]))
  })
})


describe('Inside of stressed text, emphasized/stressed text with its stress convention closed first', () => {
  it('can have the reamining emphasis convention and stress convention closed by 3 or more asterisks', () => {
    expect(Up.parse('**Please ***stop** eating the cardboard immediately***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('Please '),
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of stressed text, emphasized/stressed text with its emphasis convention closed first', () => {
  it('can have the reamining 2 stress conventions closed by 4 or more asterisks', () => {
    expect(Up.parse('**Please ***stop* eating the cardboard immediately****')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, emphasized/stressed text with its stress convention closed first', () => {
  it('can have the reamining two emphasis convention closed by 3 or more asterisks', () => {
    expect(Up.parse('*Please ***stop** eating the cardboard immediately***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('Please '),
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, emphasized/stressed text with its inner emphasis convention closed first', () => {
  it('can have the reamining stress convention and emphasis convention closed by 3 or more asterisks', () => {
    expect(Up.parse('*Please ***stop* eating the cardboard immediately***')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.PlainText('Please '),
          new Up.Stress([
            new Up.Emphasis([
              new Up.PlainText('stop')
            ]),
            new Up.PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Matching clusters of 3+ asterisks each surrounded by whitespce', () => {
  it('are preserved as plain text', () => {
    expect(Up.parse('I believe ***** will win the primary in ***** easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('I believe ***** will win the primary in ***** easily.')
      ]))
  })
})


describe('An inflection start delimiter consisting of 4+ asterisks, with an emphasis convention ended first, subsequently ending in 3+ additional asterisks', () => {
  it('produces an emphasis node nested within stress and emphasis nodes', () => {
    expect(Up.parse('Well, ****Xamarin* is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Emphasis([
              new Up.PlainText('Xamarin')
            ]),
            new Up.PlainText(' is now free')
          ]),
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 4+ asterisks, with a stress convention ended first, subsequently ending in 3 additional asterisks', () => {
  it('produces nested stress nodes', () => {
    expect(Up.parse('Well, ****Xamarin** is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Stress([
          new Up.Stress([
            new Up.PlainText('Xamarin')
          ]),
          new Up.PlainText(' is now free')
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 5+ asterisks, with an emphasis convention ended first, subsequently ending in 3+ additional asterisks', () => {
  it('produces a stress node nested within stress and emphasis nodes', () => {
    expect(Up.parse('Well, *****Xamarin** is now free***!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.PlainText('Well, '),
        new Up.Stress([
          new Up.Emphasis([
            new Up.Stress([
              new Up.PlainText('Xamarin')
            ]),
            new Up.PlainText(' is now free')
          ]),
        ]),
        new Up.PlainText('!')
      ]))
  })
})


describe('Text that is emphasized/stressed at the same time', () => {
  it('can have its emphasis convention closed first and be followed by stressed text', () => {
    expect(Up.parse('***Nimble* navigators?** **Tropical.**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('Nimble')
          ]),
          new Up.PlainText(' navigators?')
        ]),
        new Up.PlainText(' '),
        new Up.Stress([
          new Up.PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its emphasis convention closed first and be followed by emphasized text', () => {
    expect(Up.parse('***Nimble* navigators?** *Tropical.*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Stress([
          new Up.Emphasis([
            new Up.PlainText('Nimble')
          ]),
          new Up.PlainText(' navigators?')
        ]),
        new Up.PlainText(' '),
        new Up.Emphasis([
          new Up.PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its stress convention closed first and be followed by stressed text', () => {
    expect(Up.parse('***Nimble** navigators?* **Tropical.**')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Stress([
            new Up.PlainText('Nimble')
          ]),
          new Up.PlainText(' navigators?')
        ]),
        new Up.PlainText(' '),
        new Up.Stress([
          new Up.PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its stress convention closed first and be followed by emphasized text', () => {
    expect(Up.parse('***Nimble** navigators?* *Tropical.*')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Emphasis([
          new Up.Stress([
            new Up.PlainText('Nimble')
          ]),
          new Up.PlainText(' navigators?')
        ]),
        new Up.PlainText(' '),
        new Up.Emphasis([
          new Up.PlainText('Tropical.')
        ])
      ]))
  })
})
