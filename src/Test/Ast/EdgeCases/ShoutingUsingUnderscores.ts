
import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { ItalicNode } from '../../../SyntaxNodes/ItalicNode'
import { BoldNode } from '../../../SyntaxNodes/BoldNode'


describe('Shouted text', () => {
  it('can have its italic node closed first even when followed by bold text', () => {
    expect(Up.toAst('___Nimble_ navigators?__ __Tropical.__')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new BoldNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })

  it('can have its italic node closed first even when followed by emphasized text', () => {
    expect(Up.toAst('___Nimble_ navigators?__ _Tropical._')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new ItalicNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new ItalicNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })

  it('can have its bold node closed first even when followed by bold text', () => {
    expect(Up.toAst('___Nimble__ navigators?_ __Tropical.__')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new BoldNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new BoldNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })

  it('can have its bold node closed first even when followed by emphasized text', () => {
    expect(Up.toAst('___Nimble__ navigators?_ _Tropical._')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new BoldNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new ItalicNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })
})


describe('Shouted text inside of emphasized text', () => {
  it('can have its inner bold node closed early', () => {
    expect(Up.toAst('_Please ___stop__ eating the cardboard_ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('Please '),
          new ItalicNode([
            new BoldNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have its italic node closed early', () => {
    expect(Up.toAst('_Please ___stop_ eating the cardboard__ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have both the italic nodes closed before the bold node', () => {
    expect(Up.toAst('_Please ___stop_ eating the cardboard_ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
        ]),
        new BoldNode([
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('An inflection convention starting with 3 underscores', () => {
  it('can be closed by a single underscore if no other subsequent underscores close it, resulting in emphasized text and no stray underscores in the document', () => {
    expect(Up.toAst('A ___bread_ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new ItalicNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('An inflection convention starting with 3 underscores', () => {
  it('can be closed by double underscores if no other subsequent underscores close it, resulting in bold text and no stray underscores in the document', () => {
    expect(Up.toAst('A ___bread__ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new BoldNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('A single starting underscore', () => {
  it('can be closed by 3+ underscores, producing an italic node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toAst('A _bread___ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new ItalicNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('Double starting underscores', () => {
  it('can be closed by 3+ underscores, producing an italic node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toAst('A __bread___ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new BoldNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('Shouted text inside of bold text', () => {
  it('can have its inner bold node closed early', () => {
    expect(Up.toAst('__Please ___stop__ eating the cardboard_ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('Please '),
          new ItalicNode([
            new BoldNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have its italic node closed early', () => {
    expect(Up.toAst('__Please ___stop_ eating the cardboard__ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have both the bold nodes closed before the italic node', () => {
    expect(Up.toAst('__Please ___stop__ eating the cardboard__ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('Please '),
          new ItalicNode([
            new BoldNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
        ]),
        new ItalicNode([
          new PlainTextNode(' immediately')
        ]),
      ]))
  })
})


describe('Inside of bold text, shouted text with its inner bold node closed early', () => {
  it('can have the reamining italic node and bold node closed by 3 or more underscores', () => {
    expect(Up.toAst('__Please ___stop__ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('Please '),
          new ItalicNode([
            new BoldNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ]),
        ])
      ]))
  })
})


describe('Inside of bold text, shouted text with its inner italic node closed early', () => {
  it('can have the reamining two bold nodes closed by 4 or more underscores', () => {
    expect(Up.toAst('__Please ___stop_ eating the cardboard immediately____')).to.be.eql(
      insideDocumentAndParagraph([
        new BoldNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner bold node closed early', () => {
  it('can have the reamining two italic nodes closed by 3 or more underscores', () => {
    expect(Up.toAst('_Please ___stop__ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('Please '),
          new ItalicNode([
            new BoldNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ]),
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner italic node closed early', () => {
  it('can have the reamining bold node and italic node closed by 3 or more underscores', () => {
    expect(Up.toAst('_Please ___stop_ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new ItalicNode([
          new PlainTextNode('Please '),
          new BoldNode([
            new ItalicNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})


describe('Matching clusters of 3+ underscores each surrounded by whitespce', () => {
  it('are preserved as plain text', () => {
    expect(Up.toAst('I believe _____ will win the primary in _____ easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe _____ will win the primary in _____ easily.')
      ]))
  })
})


describe('Shouted text starting with 4+ underscores, with an italic convention ended early, subsequently ending in 3+ additional underscores', () => {
  it('produces an italic node nested within bold and italic nodes', () => {
    expect(Up.toAst('Well, ____Xamarin_ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new BoldNode([
          new ItalicNode([
            new ItalicNode([
              new PlainTextNode('Xamarin')
            ]),
            new PlainTextNode(' is now free')
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 4 underscores, with a bold convention ended early, subsequently ending in 3 additional underscores', () => {
  it('produces nested bold nodes', () => {
    expect(Up.toAst('Well, ____Xamarin__ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new BoldNode([
          new BoldNode([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 5+ underscores, with an italic convention ended early, subsequently ending in 3+ additional underscores', () => {
  it('produces a bold node nested within bold and italic nodes', () => {
    expect(Up.toAst('Well, _____Xamarin__ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new BoldNode([
          new ItalicNode([
            new BoldNode([
              new PlainTextNode('Xamarin')
            ]),
            new PlainTextNode(' is now free')
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})
