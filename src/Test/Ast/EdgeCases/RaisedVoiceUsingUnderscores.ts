
import { expect } from 'chai'
import Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'


describe('Shouted text', () => {
  it('can have its emphasis node closed first even when followed by stressed text', () => {
    expect(Up.toAst('___Nimble_ navigators?__ __Tropical.__')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new StressNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })

  it('can have its emphasis node closed first even when followed by emphasized text', () => {
    expect(Up.toAst('___Nimble_ navigators?__ _Tropical._')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new EmphasisNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new EmphasisNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })

  it('can have its stress node closed first even when followed by stressed text', () => {
    expect(Up.toAst('___Nimble__ navigators?_ __Tropical.__')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new StressNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new StressNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })

  it('can have its stress node closed first even when followed by emphasized text', () => {
    expect(Up.toAst('___Nimble__ navigators?_ _Tropical._')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new StressNode([
            new PlainTextNode('Nimble'),
          ]),
          new PlainTextNode(' navigators?')
        ]),
        new PlainTextNode(' '),
        new EmphasisNode([
          new PlainTextNode('Tropical.')
        ])
      ]))
  })
})


describe('Shouted text inside of emphasized text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.toAst('_Please ___stop__ eating the cardboard_ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have its emphasis node closed early', () => {
    expect(Up.toAst('_Please ___stop_ eating the cardboard__ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have both the emphasis nodes closed before the stress node', () => {
    expect(Up.toAst('_Please ___stop_ eating the cardboard_ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
        ]),
        new StressNode([
          new PlainTextNode(' immediately')
        ])
      ]))
  })
})


describe('A raised voice convention starting with 3 underscores', () => {
  it('can be closed by a single underscore if no other subsequent underscores close it, resulting in emphasized text and no stray underscores in the document', () => {
    expect(Up.toAst('A ___bread_ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new EmphasisNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('A raised voice convention starting with 3 underscores', () => {
  it('can be closed by double underscores if no other subsequent underscores close it, resulting in stressed text and no stray underscores in the document', () => {
    expect(Up.toAst('A ___bread__ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new StressNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('A single starting underscore', () => {
  it('can be closed by 3+ underscores, producing an emphasis node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toAst('A _bread___ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new EmphasisNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('Double starting underscores', () => {
  it('can be closed by 3+ underscores, producing an emphasis node (if there are no other underscores to close) and no stray underscores in the document', () => {
    expect(Up.toAst('A __bread___ to believe in')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('A '),
        new StressNode([
          new PlainTextNode('bread'),
        ]),
        new PlainTextNode(' to believe in')
      ]))
  })
})


describe('Shouted text inside of stressed text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.toAst('__Please ___stop__ eating the cardboard_ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have its emphasis node closed early', () => {
    expect(Up.toAst('__Please ___stop_ eating the cardboard__ immediately__')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
          new PlainTextNode(' immediately')
        ])
      ]))
  })

  it('can have both the stress nodes closed before the emphasis node', () => {
    expect(Up.toAst('__Please ___stop__ eating the cardboard__ immediately_')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard'),
          ]),
        ]),
        new EmphasisNode([
          new PlainTextNode(' immediately')
        ]),
      ]))
  })
})


describe('Inside of stressed text, shouted text with its inner stress node closed early', () => {
  it('can have the reamining emphasis node and stress node closed by 3 or more underscores', () => {
    expect(Up.toAst('__Please ___stop__ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ]),
        ])
      ]))
  })
})


describe('Inside of stressed text, shouted text with its inner emphasis node closed early', () => {
  it('can have the reamining two stress nodes closed by 4 or more underscores', () => {
    expect(Up.toAst('__Please ___stop_ eating the cardboard immediately____')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner stress node closed early', () => {
  it('can have the reamining two emphasis nodes closed by 3 or more underscores', () => {
    expect(Up.toAst('_Please ___stop__ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ]),
        ])
      ]))
  })
})


describe('Inside of emphasized text, shouted text with its inner emphasis node closed early', () => {
  it('can have the reamining stress node and emphasis node closed by 3 or more underscores', () => {
    expect(Up.toAst('_Please ___stop_ eating the cardboard immediately___')).to.be.eql(
      insideDocumentAndParagraph([
        new EmphasisNode([
          new PlainTextNode('Please '),
          new StressNode([
            new EmphasisNode([
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
      ])
    )
  })
})


describe('Shouted text starting with 4+ underscores, with an emphasis convention ended early, subsequently ending in 3+ additional underscores', () => {
  it('produces an emphasis node nested within stress and emphasis nodes', () => {
    expect(Up.toAst('Well, ____Xamarin_ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new StressNode([
          new EmphasisNode([
            new EmphasisNode([
              new PlainTextNode('Xamarin')
            ]),
            new PlainTextNode(' is now free')
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 4 underscores, with a stress convention ended early, subsequently ending in 3 additional underscores', () => {
  it('produces nested stress nodes', () => {
    expect(Up.toAst('Well, ____Xamarin__ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new StressNode([
          new StressNode([
            new PlainTextNode('Xamarin')
          ]),
          new PlainTextNode(' is now free')
        ]),
        new PlainTextNode('!')
      ]))
  })
})


describe('Shouted text starting with 5+ underscores, with an emphasis convention ended early, subsequently ending in 3+ additional underscores', () => {
  it('produces a stress node nested within stress and emphasis nodes', () => {
    expect(Up.toAst('Well, _____Xamarin__ is now free___!')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('Well, '),
        new StressNode([
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('Xamarin')
            ]),
            new PlainTextNode(' is now free')
          ]),
        ]),
        new PlainTextNode('!')
      ]))
  })
})
