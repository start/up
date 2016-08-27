import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Italic } from '../../../SyntaxNodes/Italic'
import { Bold } from '../../../SyntaxNodes/Bold'


// These test descriptions are a mess. Turn back now.
//
// TODO: Clarify tests and organize them into contexts.

describe('Inside of italiczed text, text that is bolded/again-italiczed at the same time', () => {
  it('can have its bold convention closed first', () => {
    expect(Up.toDocument('_Please ___stop__ eating the cardboard_ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have its inner mphasis convention closed first', () => {
    expect(Up.toDocument('_Please ___stop_ eating the cardboard__ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have the 2 italic conventions closed before the bold convention', () => {
    expect(Up.toDocument('_Please ___stop_ eating the cardboard_ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
        ]),
        new Bold([
          new PlainText(' immediately')
        ])
      ]))
  })
})


describe('An inflection start delimiter consisting of 3 underscores', () => {
  it('can be closed by a single underscore if no other subsequent underscores close it, resulting in italiczed text and no stray underscores in the document', () => {
    expect(Up.toDocument('A ___bread_ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Italic([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })

  it('can be closed by double underscores if no other subsequent underscores close it, resulting in bolded text and no stray underscores in the document', () => {
    expect(Up.toDocument('A ___bread__ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Bold([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('An inflection start delimiter consisting of 1 underscore', () => {
  it('can be closed by 3+ underscores, producing an italic node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toDocument('A _bread___ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Italic([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('An inflection start delimiter consisting of 2 underscores', () => {
  it('can be closed by 3+ underscores, producing an italic node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toDocument('A __bread___ to believe in')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Bold([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('Inside of bolded text, text that is italiczed/again-bolded at the same time', () => {
  it('can have its inner bold convention closed first', () => {
    expect(Up.toDocument('__Please ___stop__ eating the cardboard_ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have its italic convention closed first', () => {
    expect(Up.toDocument('__Please ___stop_ eating the cardboard__ immediately__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard')
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have both the bold conventions closed before the italic node', () => {
    expect(Up.toDocument('__Please ___stop__ eating the cardboard__ immediately_')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard'),
          ]),
        ]),
        new Italic([
          new PlainText(' immediately')
        ])
      ]))
  })
})


describe('Inside of bolded text, italiczed/bolded text with its bold convention closed first', () => {
  it('can have the reamining italic convention and bold convention closed by 3 or more underscores', () => {
    expect(Up.toDocument('__Please ___stop__ eating the cardboard immediately___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of bolded text, italiczed/bolded text with its italic convention closed first', () => {
  it('can have the reamining 2 bold conventions closed by 4 or more underscores', () => {
    expect(Up.toDocument('__Please ___stop_ eating the cardboard immediately____')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of italiczed text, italiczed/bolded text with its bold convention closed first', () => {
  it('can have the reamining two italic convention closed by 3 or more underscores', () => {
    expect(Up.toDocument('_Please ___stop__ eating the cardboard immediately___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Inside of italiczed text, italiczed/bolded text with its inner italic convention closed first', () => {
  it('can have the reamining bold convention and italic convention closed by 3 or more underscores', () => {
    expect(Up.toDocument('_Please ___stop_ eating the cardboard immediately___')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop')
            ]),
            new PlainText(' eating the cardboard immediately')
          ])
        ])
      ]))
  })
})


describe('Matching clusters of 3+ underscores each surrounded by whitespce', () => {
  it('are preserved as plain text', () => {
    expect(Up.toDocument('I believe _____ will win the primary in _____ easily.')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('I believe _____ will win the primary in _____ easily.')
      ]))
  })
})


describe('An inflection start delimiter consisting of 4+ underscores, with an italic convention ended first, subsequently ending in 3+ additional underscores', () => {
  it('produces an italic node nested within bold and italic nodes', () => {
    expect(Up.toDocument('Well, ____Xamarin_ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Bold([
          new Italic([
            new Italic([
              new PlainText('Xamarin')
            ]),
            new PlainText(' is now free')
          ]),
        ]),
        new PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 4+ underscores, with a bold convention ended first, subsequently ending in 3 additional underscores', () => {
  it('produces nested bold nodes', () => {
    expect(Up.toDocument('Well, ____Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Bold([
          new Bold([
            new PlainText('Xamarin')
          ]),
          new PlainText(' is now free')
        ]),
        new PlainText('!')
      ]))
  })
})


describe('An inflection start delimiter consisting of 5+ underscores, with an italic convention ended first, subsequently ending in 3+ additional underscores', () => {
  it('produces a bold node nested within bold and italic nodes', () => {
    expect(Up.toDocument('Well, _____Xamarin__ is now free___!')).to.deep.equal(
      insideDocumentAndParagraph([
        new PlainText('Well, '),
        new Bold([
          new Italic([
            new Bold([
              new PlainText('Xamarin')
            ]),
            new PlainText(' is now free')
          ]),
        ]),
        new PlainText('!')
      ]))
  })
})


describe('Text that is italiczed/bolded at the same time', () => {
  it('can have its italic convention closed first and be followed by bolded text', () => {
    expect(Up.toDocument('___Nimble_ navigators?__ __Tropical.__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new Italic([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Bold([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its italic convention closed first and be followed by italiczed text', () => {
    expect(Up.toDocument('___Nimble_ navigators?__ _Tropical._')).to.deep.equal(
      insideDocumentAndParagraph([
        new Bold([
          new Italic([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Italic([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its bold convention closed first and be followed by bolded text', () => {
    expect(Up.toDocument('___Nimble__ navigators?_ __Tropical.__')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new Bold([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Bold([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its bold convention closed first and be followed by italiczed text', () => {
    expect(Up.toDocument('___Nimble__ navigators?_ _Tropical._')).to.deep.equal(
      insideDocumentAndParagraph([
        new Italic([
          new Bold([
            new PlainText('Nimble')
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Italic([
          new PlainText('Tropical.')
        ])
      ]))
  })
})
