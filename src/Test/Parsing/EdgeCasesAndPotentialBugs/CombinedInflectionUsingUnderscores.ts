import { expect } from 'chai'
import * as Up from '../../../Main'
import { insideDocumentAndParagraph } from '../Helpers'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Inside of italicized text, text that is bolded/again-italicized at the same time', () => {
  it('can have its bold convention closed first', () => {
    expect(Up.parse('_Please ___stop__ eating the cardboard_ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Please '),
          new Up.Italic([
            new Up.Bold([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard')
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })

  it('can have its inner emphasis convention closed first', () => {
    expect(Up.parse('_Please ___stop_ eating the cardboard__ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard')
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })

  it('can have the 2 italics conventions closed before the bold convention', () => {
    expect(Up.parse('_Please ___stop_ eating the cardboard_ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard')
          ])
        ]),
        new Up.Bold([
          new Up.Text(' immediately')
        ])
      ]))
  })
})


describe('A start delimiter consisting of 3 underscores', () => {
  it('can be closed by a single underscore if no other subsequent underscores close it, resulting in italicized text and no stray underscores in the document', () => {
    expect(Up.parse('A ___bread_ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('A '),
        new Up.Italic([
          new Up.Text('bread')
        ]),
        new Up.Text(' to believe in')
      ]))
  })

  it('can be closed by double underscores if no other subsequent underscores close it, resulting in bolded text and no stray underscores in the document', () => {
    expect(Up.parse('A ___bread__ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('A '),
        new Up.Bold([
          new Up.Text('bread')
        ]),
        new Up.Text(' to believe in')
      ]))
  })
})


describe('A start delimiter consisting of 1 underscore', () => {
  it('can be closed by 3+ underscores, producing an italics node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.parse('A _bread___ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('A '),
        new Up.Italic([
          new Up.Text('bread')
        ]),
        new Up.Text(' to believe in')
      ]))
  })
})


describe('A start delimiter consisting of 2 underscores', () => {
  it('can be closed by 3+ underscores, producing an italics node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.parse('A __bread___ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('A '),
        new Up.Bold([
          new Up.Text('bread')
        ]),
        new Up.Text(' to believe in')
      ]))
  })
})


describe('Inside of bolded text, text that is italicized/again-bolded at the same time', () => {
  it('can have its inner bold convention closed first', () => {
    expect(Up.parse('__Please ___stop__ eating the cardboard_ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('Please '),
          new Up.Italic([
            new Up.Bold([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard')
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })

  it('can have its italics convention closed first', () => {
    expect(Up.parse('__Please ___stop_ eating the cardboard__ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard')
          ]),
          new Up.Text(' immediately')
        ])
      ]))
  })

  it('can have both the bold conventions closed before the italics node', () => {
    expect(Up.parse('__Please ___stop__ eating the cardboard__ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('Please '),
          new Up.Italic([
            new Up.Bold([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard')
          ])
        ]),
        new Up.Italic([
          new Up.Text(' immediately')
        ])
      ]))
  })
})


describe('Inside of bolded text, italicized/bolded text with its bold convention closed first', () => {
  it('can have the remaining italics convention and bold convention closed by 3 or more underscores', () => {
    expect(Up.parse('__Please ___stop__ eating the cardboard immediately___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('Please '),
          new Up.Italic([
            new Up.Bold([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of bolded text, italicized/bolded text with its italics convention closed first', () => {
  it('can have the remaining 2 bold conventions closed by 4 or more underscores', () => {
    expect(Up.parse('__Please ___stop_ eating the cardboard immediately____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of italicized text, italicized/bolded text with its bold convention closed first', () => {
  it('can have the remaining two italics convention closed by 3 or more underscores', () => {
    expect(Up.parse('_Please ___stop__ eating the cardboard immediately___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Please '),
          new Up.Italic([
            new Up.Bold([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of italicized text, italicized/bolded text with its inner italics convention closed first', () => {
  it('can have the remaining bold convention and italics convention closed by 3 or more underscores', () => {
    expect(Up.parse('_Please ___stop_ eating the cardboard immediately___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Text('Please '),
          new Up.Bold([
            new Up.Italic([
              new Up.Text('stop')
            ]),
            new Up.Text(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Matching clusters of 3+ underscores each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.parse('I believe _____ will win the primary in _____ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('I believe _____ will win the primary in _____ easily.')
      ]))
  })
})


describe('A start delimiter consisting of 4+ underscores, with an italics convention ended first, subsequently ending in 3+ additional underscores', () => {
  it('produces an italics node nested within bold and italics nodes', () => {
    expect(Up.parse('Well, ____Xamarin_ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Bold([
          new Up.Italic([
            new Up.Italic([
              new Up.Text('Xamarin')
            ]),
            new Up.Text(' is now free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('A start delimiter consisting of 4+ underscores, with a bold convention ended first, subsequently ending in 3 additional underscores', () => {
  it('produces nested bold nodes', () => {
    expect(Up.parse('Well, ____Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Bold([
          new Up.Bold([
            new Up.Text('Xamarin')
          ]),
          new Up.Text(' is now free')
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('A start delimiter consisting of 5+ underscores, with an italics convention ended first, subsequently ending in 3+ additional underscores', () => {
  it('produces a bold node nested within bold and italics nodes', () => {
    expect(Up.parse('Well, _____Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Text('Well, '),
        new Up.Bold([
          new Up.Italic([
            new Up.Bold([
              new Up.Text('Xamarin')
            ]),
            new Up.Text(' is now free')
          ])
        ]),
        new Up.Text('!')
      ]))
  })
})


describe('Text that is italicized/bolded at the same time', () => {
  it('can have its italics convention closed first and be followed by bolded text', () => {
    expect(Up.parse('___Nimble_ navigators?__ __Tropical.__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Italic([
            new Up.Text('Nimble')
          ]),
          new Up.Text(' navigators?')
        ]),
        new Up.Text(' '),
        new Up.Bold([
          new Up.Text('Tropical.')
        ])
      ]))
  })

  it('can have its italics convention closed first and be followed by italicized text', () => {
    expect(Up.parse('___Nimble_ navigators?__ _Tropical._')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Bold([
          new Up.Italic([
            new Up.Text('Nimble')
          ]),
          new Up.Text(' navigators?')
        ]),
        new Up.Text(' '),
        new Up.Italic([
          new Up.Text('Tropical.')
        ])
      ]))
  })

  it('can have its bold convention closed first and be followed by bolded text', () => {
    expect(Up.parse('___Nimble__ navigators?_ __Tropical.__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Bold([
            new Up.Text('Nimble')
          ]),
          new Up.Text(' navigators?')
        ]),
        new Up.Text(' '),
        new Up.Bold([
          new Up.Text('Tropical.')
        ])
      ]))
  })

  it('can have its bold convention closed first and be followed by italicized text', () => {
    expect(Up.parse('___Nimble__ navigators?_ _Tropical._')).to.deep.equal(
      insideDocumentAndParagraph([
        new Up.Italic([
          new Up.Bold([
            new Up.Text('Nimble')
          ]),
          new Up.Text(' navigators?')
        ]),
        new Up.Text(' '),
        new Up.Italic([
          new Up.Text('Tropical.')
        ])
      ]))
  })
})
