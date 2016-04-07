/// <reference path="../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../../index'
import { insideDocumentAndParagraph } from '../Helpers'
import { SyntaxNode } from '../../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../../SyntaxNodes/ParagraphNode'


describe('Shouted text', () => {
  it('can have its emphasis node closed first even when followed by stressed text', () => {
    expect(Up.ast('***Nimble* navigators?** **Tropical.**')).to.be.eql(
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
    expect(Up.ast('***Nimble* navigators?** *Tropical.*')).to.be.eql(
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
    expect(Up.ast('***Nimble** navigators?* **Tropical.**')).to.be.eql(
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
    expect(Up.ast('***Nimble** navigators?* *Tropical.*')).to.be.eql(
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
    expect(Up.ast('*Please ***stop** eating the cardboard* immediately*')).to.be.eql(
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
    expect(Up.ast('*Please ***stop* eating the cardboard** immediately*')).to.be.eql(
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
    expect(Up.ast('*Please ***stop* eating the cardboard* immediately**')).to.be.eql(
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


describe('Shouted text inside of stressed text', () => {
  it('can have its inner stress node closed early', () => {
    expect(Up.ast('**Please ***stop** eating the cardboard* immediately**')).to.be.eql(
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
    expect(Up.ast('**Please ***stop* eating the cardboard** immediately**')).to.be.eql(
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
    expect(Up.ast('**Please ***stop** eating the cardboard** immediately*')).to.be.eql(
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
  it('can have the reamining emphasis node and stress node closed by 3 or more asterisks', () => {
    expect(Up.ast('**Please ***stop** eating the cardboard immediately***')).to.be.eql(
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
  it('can have the reamining two stress nodes closed by 3 or more asterisks', () => {
    expect(Up.ast('**Please ***stop* eating the cardboard immediately***')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})

describe('Inside of emphasized text, shouted text with its inner stress node closed early', () => {
  it('can have the reamining two emphasis nodes closed by 3 or more asterisks', () => {
    expect(Up.ast('*Please ***stop** eating the cardboard immediately***')).to.be.eql(
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
  it('can have the reamining stress node and emphasis node closed by 3 or more asterisks', () => {
    expect(Up.ast('*Please ***stop* eating the cardboard immediately***')).to.be.eql(
      insideDocumentAndParagraph([
        new StressNode([
          new PlainTextNode('Please '),
          new EmphasisNode([
            new StressNode([
              new PlainTextNode('stop'),
            ]),
            new PlainTextNode(' eating the cardboard immediately'),
          ])
        ])
      ]))
  })
})


describe('Matching single asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.ast('I believe * will win the primary in * easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe * will win the primary in * easily.')
      ])
    )
  })
})


describe('Matching clusters of dpuble asterisks each surrounded by whitespace', () => {
  it('are preserved as plain text', () => {
    expect(Up.ast('I believe ** will win the primary in ** easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe ** will win the primary in ** easily.')
      ])
    )
  })
})


describe('Matching clusters of 3+ asterisks each surrounded by whitespce', () => {
  it('are preserved as plain text', () => {
    expect(Up.ast('I believe ***** will win the primary in ***** easily.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe ***** will win the primary in ***** easily.')
      ])
    )
  })
})


describe('An asterisk followed by whitespace with a matching closing asterisk', () => {
  it('does not produce an emphasis node and is preserved as plain text', () => {
    expect(Up.ast('I believe* my spelling* was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe* my spelling* was wrong.')
      ])
    )
  })
})


describe('Double asterisks followed by whitespace with matching closing double asterisks', () => {
  it('do not produce a stress node and are preserved as plain text', () => {
    expect(Up.ast('I believe** my spelling** was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe** my spelling** was wrong.')
      ])
    )
  })
})


describe('3+ consecutive asterisks followed by whitespace with matching 3+ consecutive asterisks', () => {
  it('do not produce a stress node or an emphasis node, and are preserved as plain text', () => {
    expect(Up.ast('I believe*** my spelling*** was wrong.')).to.be.eql(
      insideDocumentAndParagraph([
        new PlainTextNode('I believe*** my spelling*** was wrong.')
      ])
    )
  })
})
