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
import { LineNode } from '../../SyntaxNodes/LineNode'



describe('Consecutive non-blank lines', () => {
  it('produce a line block node containing line nodes', () => {
    const text =
      `
Roses are red
Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new LineNode([
            new PlainTextNode('Roses are red')
          ]),
          new LineNode([
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
          new LineNode([
            new PlainTextNode('Roses are red')
          ]),
          new LineNode([
            new PlainTextNode('Violets are '),
            new StressNode([
              new PlainTextNode('blue')
            ])
          ]),
          new LineNode([
            new PlainTextNode('Lyrics have lines')
          ]),
          new LineNode([
            new PlainTextNode('And addresses do, too')
          ]),
        ]),
      ]))
  })
  
  it('are still considered consecutive when separated by escaped blank lines', () => {
    const text =
      `
Roses are red\\
\\

Violets are blue`
    expect(Up.ast(text)).to.be.eql(
      new DocumentNode([
        new LineBlockNode([
          new LineNode([
            new PlainTextNode('Roses are red\n\n')
          ]),
          new LineNode([
            new PlainTextNode('Violets are blue')
          ]),
        ]),
      ]))
  })
})
