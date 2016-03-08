/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import { expect } from 'chai'
import * as Up from '../../index'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../../SyntaxNodes/InlineAsideNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { Line } from '../../SyntaxNodes/Line'



describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const text =
      `
Roses are red
Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })

  it('can contain inline conventions', () => {
    const text =
      `
Roses are red
Violets are **blue**
Lyrics have lines
And addresses do, too
`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are '),
            new StressNode([
              new PlainTextNode('blue')
            ])
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
  
  it('are separated by a streak, even when there are no blank lines', () => {
    const text =
      `
Roses are red
Violets are blue
#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
        new SectionSeparatorNode(),
        new LineBlockNode([
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
  
  it('are not separated by a streak if the streak is escaped', () => {
    const text =
      `
Roses are red
Violets are blue
\\#~#~#~#~#~#~#~#~#
Lyrics have lines
And addresses do, too`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
          new Line([
            new PlainTextNode('#~#~#~#~#~#~#~#~#')
          ]),
          new Line([
            new PlainTextNode('Lyrics have lines')
          ]),
          new Line([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
})

describe('Non-blank lines separated by escaped blank lines', () => {
  it('are still considered consecutive and still produce a line block node', () => {
    const text =
      `
Roses are red\\
\\

Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red\n\n')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})

describe('A line starting with an escaped character in a line block', () => {
  it('does not impact the parsing of the next line', () => {
    const text =
      `
\\Roses are red
Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
  
  it('does not impact the parsing of the previous line', () => {
    const text =
      `
Roses are red
\\Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new Line([
            new PlainTextNode('Roses are red')
          ]),
          new Line([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})