/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../index'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'

describe('No text', function() {
  it('creates only a document node', function() {
    expect(Up.ast('')).to.be.eql(new DocumentNode())
  })
})

describe('Text', function() {
  it('is put inside a plain text node', function() {
    expect(Up.ast('Hello, world!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, world!')
      ]))
  })
})

describe('A backslash', function() {
  it('causes the following character to be treated as plain text', function() {
    expect(Up.ast('Hello, \\world!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, world!')
      ]))
  })
  it('causes the following backslash to be treated as plain text', function() {
    expect(Up.ast('Hello, \\\\!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, \\!')
      ]))
  })
  it('disables any special meaning of the following character', function() {
    expect(Up.ast('Hello, \\*world\\*!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, *world*!')
      ]))
  })
  it('causes only the following character to be treated as plain text', function() {
    expect(Up.ast('Hello, \\\\, meet \\\\!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, \\, meet \\!')
      ]))
  })
  it('is ignored if it is the final character', function() {
    expect(Up.ast('Hello, \\')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, ')
      ]))
  })
})

describe('Text surrounded by asterisks', function() {
  it('is put inside an emphasis node', function() {
    expect(Up.ast('Hello, *world*!!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!!')
      ]))
  })
  
  it('is evaluated for other conventions', function() {
    expect(Up.ast('Hello, *`world`*!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new InlineCodeNode([
            new PlainTextNode('world')
          ])
        ]),
        new PlainTextNode('!')
      ]))
  })
  
  it('can even hold stressed text', function() {
    expect(Up.ast('Hello, *my **little** world*!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new StressNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
  
  it('can be indirectly nested inside another emphasis node', function() {
    expect(Up.ast('Hello, *my **very, *very* little** world*!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new EmphasisNode([
          new PlainTextNode('my '),
          new StressNode([
            new PlainTextNode('very, '),
            new EmphasisNode([
              new PlainTextNode("very")
            ]),       
            new PlainTextNode(' little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Text surrounded by backticks', function() {
  it('is put inside an inline code node', function() {
    expect(Up.ast('Hello, `["w", "o", "r", "l", "d"].join("")`!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new InlineCodeNode([
          new PlainTextNode('["w", "o", "r", "l", "d"].join("")')
        ]),
        new PlainTextNode('!')
      ]))
  })
  
  it('is not evaluated for other conventions', function() {
    expect(Up.ast('Hello, `*world*`!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new InlineCodeNode([
          new PlainTextNode('*world*')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Text surrounded by 2 asterisks', function() {
  it('is put inside a stress node', function() {
    expect(Up.ast('Hello, **world**!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('world')
        ]),
        new PlainTextNode('!')
      ]))
  })
  
  it('can even hold emphasized text', function() {
    expect(Up.ast('Hello, **my *little* world**!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, '),
        new StressNode([
          new PlainTextNode('my '),
          new EmphasisNode([
            new PlainTextNode('little')
          ]),
          new PlainTextNode(' world')
        ]),
        new PlainTextNode('!')
      ]))
  })
})

describe('Text starting with 3 asterisks', function() {
  it('can have its emphasis node closed first', function() {
    expect(Up.ast('Hello, ***my* world**!')).to.be.eql(
      new DocumentNode([
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
  
  it('can have its stress node closed first', function() {
    expect(Up.ast('Hello, ***my** world*!')).to.be.eql(
      new DocumentNode([
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

describe('An unmatched asterisk', function() {
  it('does not create an emphasis node', function() {
    expect(Up.ast('Hello, *world!')).to.be.eql(
      new DocumentNode([
        new PlainTextNode('Hello, *world!')
      ]))
  })
  
  it('does not create emphasis node when nested inside a stress node', function() {
    expect(Up.ast('Hello, **my* world**!')).to.be.eql(
      new DocumentNode([
          new PlainTextNode('Hello, '),
          new StressNode([
            new PlainTextNode('my* world'),
          ]),
        new PlainTextNode('!')
      ]))
  })
})