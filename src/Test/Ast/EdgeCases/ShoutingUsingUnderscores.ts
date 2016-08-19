
import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainText } from '../../../SyntaxNodes/PlainText'
import { Italic } from '../../../SyntaxNodes/Italic'
import { Bold } from '../../../SyntaxNodes/Bold'


describe('Shouted text', () => {
  it('can have its italic node closed first even when followed by bold text', () => {
    expect(Up.toDocument('___Nimble_ navigators?__ __Tropical.__')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new Italic([
            new PlainText('Nimble'),
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Bold([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its italic node closed first even when followed by emphasized text', () => {
    expect(Up.toDocument('___Nimble_ navigators?__ _Tropical._')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new Italic([
            new PlainText('Nimble'),
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Italic([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its bold node closed first even when followed by bold text', () => {
    expect(Up.toDocument('___Nimble__ navigators?_ __Tropical.__')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new Bold([
            new PlainText('Nimble'),
          ]),
          new PlainText(' navigators?')
        ]),
        new PlainText(' '),
        new Bold([
          new PlainText('Tropical.')
        ])
      ]))
  })

  it('can have its bold node closed first even when followed by emphasized text', () => {
    expect(Up.toDocument('___Nimble__ navigators?_ _Tropical._')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new Bold([
            new PlainText('Nimble'),
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


describe('Shouted text inside of emphasized text', () => {
  it('can have its inner bold node closed early', () => {
    expect(Up.toDocument('_Please ___stop__ eating the cardboard_ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have its italic node closed early', () => {
    expect(Up.toDocument('_Please ___stop_ eating the cardboard__ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have both the italic nodes closed before the bold node', () => {
    expect(Up.toDocument('_Please ___stop_ eating the cardboard_ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop'),
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


describe('An inflection convention starting with 3 underscores', () => {
  it('can be closed by a single underscore if no other subsequent underscores close it, resulting in emphasized text and no stray underscores in the document', () => {
    expect(Up.toDocument('A ___bread_ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Italic([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('An inflection convention starting with 3 underscores', () => {
  it('can be closed by double underscores if no other subsequent underscores close it, resulting in bold text and no stray underscores in the document', () => {
    expect(Up.toDocument('A ___bread__ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Bold([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('A single starting underscore', () => {
  it('can be closed by 3+ underscores, producing an italic node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toDocument('A _bread___ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Italic([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('Double starting underscores', () => {
  it('can be closed by 3+ underscores, producing an italic node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toDocument('A __bread___ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('A '),
        new Bold([
          new PlainText('bread'),
        ]),
        new PlainText(' to believe in')
      ]))
  })
})


describe('Shouted text inside of bold text', () => {
  it('can have its inner bold node closed early', () => {
    expect(Up.toDocument('__Please ___stop__ eating the cardboard_ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have its italic node closed early', () => {
    expect(Up.toDocument('__Please ___stop_ eating the cardboard__ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard'),
          ]),
          new PlainText(' immediately')
        ])
      ]))
  })

  it('can have both the bold nodes closed before the italic node', () => {
    expect(Up.toDocument('__Please ___stop__ eating the cardboard__ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard'),
          ]),
        ]),
        new Italic([
          new PlainText(' immediately')
        ]),
      ]))
  })
})


describe('Inside of bold text, shouted text with its inner bold node closed early', () => {
  it('can have the reamining italic node and bold node closed by 3 or more underscores', () => {
    expect(Up.toDocument('__Please ___stop__ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard immediately'),
          ]),
        ])
      ]))
  })
})


describe('Inside of bold text, shouted text with its inner italic node closed early', () => {
  it('can have the reamining two bold nodes closed by 4 or more underscores', () => {
    expect(Up.toDocument('__Please ___stop_ eating the cardboard immediately____')).to.be.eql(
      insideDocumentAndParagraph([
        new Bold([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner bold node closed early', () => {
  it('can have the reamining two italic nodes closed by 3 or more underscores', () => {
    expect(Up.toDocument('_Please ___stop__ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Italic([
            new Bold([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard immediately'),
          ]),
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner italic node closed early', () => {
  it('can have the reamining bold node and italic node closed by 3 or more underscores', () => {
    expect(Up.toDocument('_Please ___stop_ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new Italic([
          new PlainText('Please '),
          new Bold([
            new Italic([
              new PlainText('stop'),
            ]),
            new PlainText(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})


describe('Matching clusters of 3+ underscores each surrounded by whitespce', () => {
  it('are preserved as plain text', () => {
    expect(Up.toDocument('I believe _____ will win the primary in _____ easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainText('I believe _____ will win the primary in _____ easily.')
      ]))
  })
})


describe('Shouted text starting with 4+ underscores, with an italic convention ended early, subsequently ending in 3+ additional underscores', () => {
  it('produces an italic node nested within bold and italic nodes', () => {
    expect(Up.toDocument('Well, ____Xamarin_ is now free___!')).to.be.eql(
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


describe('Shouted text starting with 4 underscores, with a bold convention ended early, subsequently ending in 3 additional underscores', () => {
  it('produces nested bold nodes', () => {
    expect(Up.toDocument('Well, ____Xamarin__ is now free___!')).to.be.eql(
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


describe('Shouted text starting with 5+ underscores, with an italic convention ended early, subsequently ending in 3+ additional underscores', () => {
  it('produces a bold node nested within bold and italic nodes', () => {
    expect(Up.toDocument('Well, _____Xamarin__ is now free___!')).to.be.eql(
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
